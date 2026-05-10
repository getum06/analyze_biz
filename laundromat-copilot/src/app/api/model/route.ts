import { NextResponse } from "next/server";
import { buildCashFlowModel } from "@/lib/models/cashFlowModel";
import { prisma } from "@/lib/db/prisma";
import { ExtractedListing } from "@/types/deal";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { dealId, listing, overrides } = body;

    let resolvedListing: ExtractedListing;

    if (dealId) {
      const deal = await prisma.deal.findUnique({ where: { id: dealId } });
      if (!deal) {
        return NextResponse.json({ error: "Deal not found" }, { status: 404 });
      }
      resolvedListing = {
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
    } else if (listing) {
      resolvedListing = listing;
    } else {
      return NextResponse.json(
        { error: "dealId or listing is required" },
        { status: 400 }
      );
    }

    const cashFlowModel = buildCashFlowModel({
      listing: resolvedListing,
      ...(overrides ?? {}),
    });

    // Save to database if dealId provided
    if (dealId) {
      await prisma.deal.update({
        where: { id: dealId },
        data: {
          cashFlowModel: JSON.stringify(cashFlowModel),
        },
      });
    }

    return NextResponse.json({ cashFlowModel });
  } catch (err) {
    console.error("Model error:", err);
    const message =
      err instanceof Error ? err.message : "Cash flow modeling failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
