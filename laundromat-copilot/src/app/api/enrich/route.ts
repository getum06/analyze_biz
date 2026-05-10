import { NextResponse } from "next/server";
import { enrichMarketData } from "@/lib/enrichment/marketEnrichment";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { city, state, address, radiusMiles, dealId } = body;

    if (!city || !state) {
      return NextResponse.json(
        { error: "city and state are required" },
        { status: 400 }
      );
    }

    const marketData = await enrichMarketData({
      city,
      state,
      address,
      radiusMiles: radiusMiles ?? 3,
    });

    // Update deal if dealId provided
    if (dealId) {
      await prisma.deal.update({
        where: { id: dealId },
        data: {
          marketData: JSON.stringify(marketData),
        },
      });
    }

    return NextResponse.json({ marketData });
  } catch (err) {
    console.error("Enrichment error:", err);
    const message = err instanceof Error ? err.message : "Enrichment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
