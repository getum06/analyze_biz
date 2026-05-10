import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deal = await prisma.deal.findUnique({ where: { id } });
    if (!deal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const formatted = {
      ...deal,
      machines: deal.machines ? JSON.parse(deal.machines) : null,
      services: deal.services ? JSON.parse(deal.services) : null,
      missingFields: deal.missingFields ? JSON.parse(deal.missingFields) : [],
      marketData: deal.marketData ? JSON.parse(deal.marketData) : null,
      cashFlowModel: deal.cashFlowModel ? JSON.parse(deal.cashFlowModel) : null,
      dealScore: deal.dealScore ? JSON.parse(deal.dealScore) : null,
      investmentMemo: deal.investmentMemo
        ? JSON.parse(deal.investmentMemo)
        : null,
    };

    return NextResponse.json({ deal: formatted });
  } catch (err) {
    console.error("Error fetching deal:", err);
    return NextResponse.json(
      { error: "Failed to fetch deal" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updateData: Record<string, unknown> = {};
    const jsonFields = [
      "machines",
      "services",
      "missingFields",
      "marketData",
      "cashFlowModel",
      "dealScore",
      "investmentMemo",
    ];

    for (const [key, value] of Object.entries(body)) {
      if (jsonFields.includes(key) && value !== null && value !== undefined) {
        updateData[key] = JSON.stringify(value);
      } else {
        updateData[key] = value;
      }
    }

    const deal = await prisma.deal.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ deal });
  } catch (err) {
    console.error("Error updating deal:", err);
    return NextResponse.json(
      { error: "Failed to update deal" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.deal.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error deleting deal:", err);
    return NextResponse.json(
      { error: "Failed to delete deal" },
      { status: 500 }
    );
  }
}
