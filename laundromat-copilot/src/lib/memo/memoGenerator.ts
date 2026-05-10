import OpenAI from "openai";
import {
  InvestmentMemo,
  ExtractedListing,
  MarketData,
  CashFlowModel,
  DealScore,
} from "@/types/deal";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface MemoGeneratorInput {
  listing: ExtractedListing;
  marketData?: MarketData;
  cashFlowModel?: CashFlowModel;
  dealScore?: DealScore;
}

function formatCurrency(n?: number): string {
  if (n === undefined || n === null) return "N/A";
  return `$${n.toLocaleString()}`;
}

function buildContext(input: MemoGeneratorInput): string {
  const { listing, marketData, cashFlowModel, dealScore } = input;
  const lines: string[] = [];

  lines.push("=== DEAL INFORMATION ===");
  lines.push(`Business Name: ${listing.businessName ?? "Unnamed Laundromat"}`);
  lines.push(
    `Location: ${[listing.address, listing.city, listing.state].filter(Boolean).join(", ") || "Unknown"}`
  );
  lines.push(`Asking Price: ${formatCurrency(listing.askingPrice)}`);
  lines.push(`Gross Revenue: ${formatCurrency(listing.grossRevenue)}`);
  lines.push(`SDE: ${formatCurrency(listing.sde)}`);
  lines.push(`EBITDA: ${formatCurrency(listing.ebitda)}`);
  lines.push(`Monthly Rent: ${formatCurrency(listing.rent)}`);
  lines.push(`Lease Terms: ${listing.leaseTerms ?? "Not specified"}`);
  lines.push(`Square Feet: ${listing.squareFeet ? `${listing.squareFeet.toLocaleString()} sq ft` : "N/A"}`);
  lines.push(`Employees: ${listing.employees ?? "N/A"}`);

  if (listing.machines) {
    const m = listing.machines;
    lines.push(
      `Machines: ${m.washers ?? "?"} washers, ${m.dryers ?? "?"} dryers, avg age ${m.avgAgeYears ?? "?"} years`
    );
  }

  if (listing.services) {
    const s = listing.services;
    const serviceList = [
      s.selfServe ? "Self-Serve" : null,
      s.washFold ? "Wash & Fold" : null,
      s.pickupDelivery ? "Pickup & Delivery" : null,
      s.commercialAccounts ? "Commercial Accounts" : null,
    ]
      .filter(Boolean)
      .join(", ");
    lines.push(`Services: ${serviceList || "N/A"}`);
  }

  if (listing.sellerNotes) {
    lines.push(`\nSeller Notes: ${listing.sellerNotes}`);
  }

  if (marketData) {
    lines.push("\n=== MARKET DATA ===");
    if (marketData.population)
      lines.push(`City Population: ${marketData.population.toLocaleString()}`);
    if (marketData.populationGrowth5yr !== undefined)
      lines.push(`5-Year Population Growth: ${marketData.populationGrowth5yr.toFixed(1)}%`);
    if (marketData.medianHouseholdIncome)
      lines.push(`Median Household Income: ${formatCurrency(marketData.medianHouseholdIncome)}`);
    if (marketData.renterPercent !== undefined)
      lines.push(`Renter Percentage: ${marketData.renterPercent.toFixed(1)}%`);
    if (marketData.householdCount)
      lines.push(`Total Households: ${marketData.householdCount.toLocaleString()}`);
    if (marketData.povertyRate !== undefined)
      lines.push(`Poverty Rate: ${marketData.povertyRate.toFixed(1)}%`);
    if (marketData.competitors && marketData.competitors.length > 0) {
      lines.push(`Competitors: ${marketData.competitors.length} laundromats within area`);
      const topCompetitors = marketData.competitors.slice(0, 3);
      topCompetitors.forEach((c) => {
        lines.push(
          `  - ${c.name} (${c.distanceMiles ?? "?"}mi away, ${c.rating ?? "?"}/5 stars, ${c.reviewCount ?? "?"} reviews)`
        );
      });
    }
    if (marketData.notes.length > 0) {
      lines.push(`Market Notes: ${marketData.notes.join("; ")}`);
    }
  }

  if (cashFlowModel) {
    const { summary, financing, assumptions, years } = cashFlowModel;
    const y1 = years[0];
    const y5 = years[4];
    const y10 = years[years.length - 1];

    lines.push("\n=== FINANCIAL MODEL ===");
    lines.push(
      `Financing: ${formatCurrency(financing.downPayment)} down (${((financing.downPayment / cashFlowModel.askingPrice) * 100).toFixed(0)}%)`
    );
    lines.push(
      `SBA Loan: ${formatCurrency(financing.sbaLoanAmount)} @ ${financing.sbaRate}% for ${financing.sbaTerm} years`
    );
    if (financing.sellerFinancingAmount > 0) {
      lines.push(
        `Seller Financing: ${formatCurrency(financing.sellerFinancingAmount)} @ ${financing.sellerFinancingRate}% for ${financing.sellerFinancingTerm} years`
      );
    }
    lines.push(
      `Annual Debt Service: ${formatCurrency(financing.annualDebtService)}`
    );
    lines.push(`\nAssumptions: ${assumptions.revenueGrowthRate}% annual revenue growth, ${assumptions.exitMultiple}x exit multiple`);
    lines.push(`\nYear 1: Revenue=${formatCurrency(y1.grossRevenue)}, EBITDA=${formatCurrency(y1.ebitda)}, FCF=${formatCurrency(y1.freeCashFlow)}, DSCR=${y1.dscr.toFixed(2)}x`);
    if (y5) lines.push(`Year 5: Revenue=${formatCurrency(y5.grossRevenue)}, EBITDA=${formatCurrency(y5.ebitda)}, FCF=${formatCurrency(y5.freeCashFlow)}`);
    lines.push(`Year ${y10.year}: Revenue=${formatCurrency(y10.grossRevenue)}, EBITDA=${formatCurrency(y10.ebitda)}, FCF=${formatCurrency(y10.freeCashFlow)}`);
    lines.push(`\n10-Year Summary:`);
    lines.push(`  IRR: ${summary.irr.toFixed(1)}%`);
    lines.push(`  MOIC: ${summary.moic.toFixed(2)}x`);
    lines.push(`  Min DSCR: ${summary.minDSCR.toFixed(2)}x`);
    lines.push(`  Exit Value (${assumptions.exitMultiple}x EBITDA): ${formatCurrency(summary.exitValue)}`);
    lines.push(`  Total Return: ${formatCurrency(summary.totalReturn)}`);
  }

  if (dealScore) {
    lines.push("\n=== DEAL SCORE ===");
    lines.push(
      `Overall Score: ${dealScore.totalScore}/100 (Grade: ${dealScore.grade} — ${dealScore.recommendation})`
    );
    lines.push(`  Pricing: ${dealScore.categories.pricing.score}/${dealScore.categories.pricing.maxScore}`);
    lines.push(`  Cash Flow: ${dealScore.categories.cashFlow.score}/${dealScore.categories.cashFlow.maxScore}`);
    lines.push(`  Market: ${dealScore.categories.market.score}/${dealScore.categories.market.maxScore}`);
    lines.push(`  Operations: ${dealScore.categories.operations.score}/${dealScore.categories.operations.maxScore}`);
    lines.push(`  Risk: ${dealScore.categories.risk.score}/${dealScore.categories.risk.maxScore}`);
    if (dealScore.strengths.length > 0) {
      lines.push(`Strengths: ${dealScore.strengths.join("; ")}`);
    }
    if (dealScore.weaknesses.length > 0) {
      lines.push(`Weaknesses: ${dealScore.weaknesses.join("; ")}`);
    }
    if (dealScore.redFlags.length > 0) {
      lines.push(`Red Flags: ${dealScore.redFlags.join("; ")}`);
    }
  }

  return lines.join("\n");
}

const MEMO_SYSTEM_PROMPT = `You are a senior private equity analyst specializing in laundromat acquisitions and commercial real estate. 
Generate a professional first-pass investment memo based on the provided deal data.

Write in a direct, analytical style. Be honest about risks. Do not pad sections with filler language.
Focus on what matters for a laundromat acquisition decision.

Return ONLY valid JSON with these exact keys (all values are strings with markdown formatting):
{
  "executiveSummary": "2-3 paragraph overview of the deal and preliminary recommendation",
  "dealOverview": "Business description, location, operations, what's included",
  "financialAnalysis": "Revenue, margins, SDE analysis, multiple evaluation, historical trends",
  "marketAnalysis": "Location demographics, competition, demand drivers, risks",
  "operationsAssessment": "Machine quality, service mix, lease quality, staff, systems",
  "investmentThesis": "Why this deal makes sense (or doesn't) — be specific",
  "riskFactors": "Key risks — operational, market, financial, lease, competition",
  "dealStructure": "Proposed financing, terms, working capital needs",
  "recommendation": "Clear recommendation with specific conditions or next steps",
  "nextSteps": ["array", "of", "specific", "action", "items"]
}`;

export async function generateMemo(
  input: MemoGeneratorInput
): Promise<InvestmentMemo> {
  const context = buildContext(input);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: MEMO_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Generate an investment memo for this laundromat acquisition:\n\n${context}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 4000,
  });

  const raw = completion.choices[0].message.content;
  if (!raw) throw new Error("OpenAI returned empty memo response");

  const parsed = JSON.parse(raw);

  return {
    generatedAt: new Date().toISOString(),
    executiveSummary: parsed.executiveSummary ?? "",
    dealOverview: parsed.dealOverview ?? "",
    financialAnalysis: parsed.financialAnalysis ?? "",
    marketAnalysis: parsed.marketAnalysis ?? "",
    operationsAssessment: parsed.operationsAssessment ?? "",
    investmentThesis: parsed.investmentThesis ?? "",
    riskFactors: parsed.riskFactors ?? "",
    dealStructure: parsed.dealStructure ?? "",
    recommendation: parsed.recommendation ?? "",
    nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
  };
}
