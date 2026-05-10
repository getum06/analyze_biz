import { NextResponse } from "next/server";
import { extractListing } from "@/lib/extractors/listingExtractor";
import { prisma } from "@/lib/db/prisma";

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
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const listing = await extractListing({
      url,
      manualText,
      assetType: "laundromat",
    });

    // Save to database
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

    return NextResponse.json({ listing, dealId: deal.id });
  } catch (err) {
    console.error("Extraction error:", err);
    const message =
      err instanceof Error ? err.message : "Extraction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
