import { NextResponse } from "next/server";
import { extractListing } from "@/lib/extractors/listingExtractor";
import { enrichMarketData } from "@/lib/enrichment/marketEnrichment";
import { buildCashFlowModel } from "@/lib/models/cashFlowModel";
import { scoreDeal } from "@/lib/scoring/dealScorer";
import { prisma } from "@/lib/db/prisma";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, manualText } = body;

    if (!url && !manualText) {
      return NextResponse.json(
        { error: "Either url or manualText is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured. Please add OPENAI_API_KEY to your environment." },
        { status: 500 }
      );
    }

    // Step 1: Extract listing data
    const listing = await extractListing({
      url,
      manualText,
      assetType: "laundromat",
    });

    // Step 2: Save to database early
    const deal = await prisma.deal.create({
      data: {
        sourceUrl: listing.sourceUrl,
        rawText: manualText,
        businessName: listing.businessName,
        address: listing.address,
        city: listing.city,
        state: listing.state,
        askingPrice: listing.askingPrice,
        grossRevenue: listing.grossRevenue,
        sde: listing.sde,
        ebitda: listing.ebitda,
        rent: listing.rent,
        leaseTerms: listing.leaseTerms,
        squareFeet: listing.squareFeet,
        employees: listing.employees,
        machines: listing.machines ? JSON.stringify(listing.machines) : null,
        services: listing.services ? JSON.stringify(listing.services) : null,
        sellerNotes: listing.sellerNotes,
        extractionConfidence: listing.extractionConfidence,
        missingFields: JSON.stringify(listing.missingFields),
        status: "analyzed",
      },
    });

    // Step 3: Market enrichment (parallel with model if city/state available)
    let marketData = undefined;
    if (listing.city && listing.state) {
      try {
        marketData = await enrichMarketData({
          city: listing.city,
          state: listing.state,
          address: listing.address,
          radiusMiles: 3,
        });
        await prisma.deal.update({
          where: { id: deal.id },
          data: { marketData: JSON.stringify(marketData) },
        });
      } catch (err) {
        console.error("Market enrichment failed (non-fatal):", err);
      }
    }

    // Step 4: Cash flow model
    let cashFlowModel = undefined;
    if (listing.askingPrice || listing.grossRevenue) {
      try {
        cashFlowModel = buildCashFlowModel({ listing });
        await prisma.deal.update({
          where: { id: deal.id },
          data: { cashFlowModel: JSON.stringify(cashFlowModel) },
        });
      } catch (err) {
        console.error("Cash flow model failed (non-fatal):", err);
      }
    }

    // Step 5: Score the deal
    let dealScore = undefined;
    try {
      dealScore = scoreDeal({ listing, marketData, cashFlowModel });
      await prisma.deal.update({
        where: { id: deal.id },
        data: {
          dealScore: JSON.stringify(dealScore),
          status: "scored",
        },
      });
    } catch (err) {
      console.error("Scoring failed (non-fatal):", err);
    }

    return NextResponse.json({
      dealId: deal.id,
      listing,
      marketData,
      cashFlowModel,
      dealScore,
    });
  } catch (err) {
    console.error("Analysis error:", err);
    const message = err instanceof Error ? err.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
