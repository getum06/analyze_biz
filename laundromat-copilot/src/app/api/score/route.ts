import { NextResponse } from "next/server";
import { scoreDeal } from "@/lib/scoring/dealScorer";
import { prisma } from "@/lib/db/prisma";
import { ExtractedListing } from "@/types/deal";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dealId } = body;

    if (!dealId) {
      return NextResponse.json({ error: "dealId is required" }, { status: 400 });
    }

    const deal = await prisma.deal.findUnique({ where: { id: dealId } });
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const listing: ExtractedListing = {
      businessName: deal.businessName ?? undefined,
      address: deal.address ?? undefined,
      city: deal.city ?? undefined,
      state: deal.state ?? undefined,
      askingPrice: deal.askingPrice ?? undefined,
      grossRevenue: deal.grossRevenue ?? undefined,
      sde: deal.sde ?? undefined,
      ebitda: deal.ebitda ?? undefined,
      rent: deal.rent ?? undefined,
      leaseTerms: deal.leaseTerms ?? undefined,
      squareFeet: deal.squareFeet ?? undefined,
      employees: deal.employees ?? undefined,
      machines: deal.machines ? JSON.parse(deal.machines) : undefined,
      services: deal.services ? JSON.parse(deal.services) : undefined,
      sellerNotes: deal.sellerNotes ?? undefined,
      sourceUrl: deal.sourceUrl ?? "",
      extractionConfidence: deal.extractionConfidence ?? 0.5,
      missingFields: deal.missingFields ? JSON.parse(deal.missingFields) : [],
    };

    const marketData = deal.marketData ? JSON.parse(deal.marketData) : undefined;
    const cashFlowModel = deal.cashFlowModel
      ? JSON.parse(deal.cashFlowModel)
      : undefined;

    const dealScore = scoreDeal({ listing, marketData, cashFlowModel });

    await prisma.deal.update({
      where: { id: dealId },
      data: {
        dealScore: JSON.stringify(dealScore),
        status: "scored",
      },
    });

    return NextResponse.json({ dealScore });
  } catch (err) {
    console.error("Scoring error:", err);
    const message = err instanceof Error ? err.message : "Scoring failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
