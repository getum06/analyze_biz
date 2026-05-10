import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        businessName: true,
        city: true,
        state: true,
        askingPrice: true,
        grossRevenue: true,
        sde: true,
        status: true,
        extractionConfidence: true,
        createdAt: true,
        dealScore: true,
      },
    });

    const formatted = deals.map((d) => ({
      ...d,
      dealScore: d.dealScore ? JSON.parse(d.dealScore) : null,
    }));

    return NextResponse.json({ deals: formatted });
  } catch (err) {
    console.error("Error fetching deals:", err);
    return NextResponse.json(
      { error: "Failed to fetch deals" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const deal = await prisma.deal.create({
      data: {
        businessName: body.businessName,
        city: body.city,
        state: body.state,
        askingPrice: body.askingPrice,
        grossRevenue: body.grossRevenue,
        sde: body.sde,
        ebitda: body.ebitda,
        rent: body.rent,
        leaseTerms: body.leaseTerms,
        sourceUrl: body.sourceUrl,
        status: "draft",
      },
    });
    return NextResponse.json({ deal });
  } catch (err) {
    console.error("Error creating deal:", err);
    return NextResponse.json(
      { error: "Failed to create deal" },
      { status: 500 }
    );
  }
}
