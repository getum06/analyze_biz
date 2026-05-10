import {
  DealScore,
  DealScoreCategory,
  ExtractedListing,
  MarketData,
  CashFlowModel,
} from "@/types/deal";

export interface ScorerInput {
  listing: ExtractedListing;
  marketData?: MarketData;
  cashFlowModel?: CashFlowModel;
}

function scoreCategory(
  raw: number,
  maxScore: number,
  weight: number,
  name: string,
  notes: string[]
): DealScoreCategory {
  return {
    name,
    score: Math.min(Math.max(Math.round(raw * 10) / 10, 0), maxScore),
    maxScore,
    weight,
    notes,
  };
}

export function scoreDeal(input: ScorerInput): DealScore {
  const { listing, marketData, cashFlowModel } = input;
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const redFlags: string[] = [];

  // ─────────────────────────────────────────────
  // 1. PRICING (25 points)
  // ─────────────────────────────────────────────
  let pricingScore = 0;
  const pricingNotes: string[] = [];

  const askingPrice = listing.askingPrice ?? 0;
  const sde = listing.sde ?? listing.ebitda ?? 0;
  const grossRevenue = listing.grossRevenue ?? 0;

  if (askingPrice > 0 && sde > 0) {
    const multiple = askingPrice / sde;
    pricingNotes.push(`SDE multiple: ${multiple.toFixed(2)}x`);

    // Laundromat benchmarks: 2–4x SDE is typical; below 3x is excellent
    if (multiple <= 2.0) {
      pricingScore += 25;
      strengths.push(`Exceptional value at ${multiple.toFixed(1)}x SDE`);
    } else if (multiple <= 2.5) {
      pricingScore += 22;
      strengths.push(`Strong value at ${multiple.toFixed(1)}x SDE`);
    } else if (multiple <= 3.0) {
      pricingScore += 18;
    } else if (multiple <= 3.5) {
      pricingScore += 14;
    } else if (multiple <= 4.0) {
      pricingScore += 10;
      weaknesses.push(`High multiple at ${multiple.toFixed(1)}x SDE`);
    } else {
      pricingScore += 5;
      redFlags.push(`Very high multiple at ${multiple.toFixed(1)}x SDE — requires strong justification`);
    }
  } else if (askingPrice > 0 && grossRevenue > 0) {
    const revenueMultiple = askingPrice / grossRevenue;
    pricingNotes.push(`Revenue multiple: ${revenueMultiple.toFixed(2)}x (SDE not available)`);
    if (revenueMultiple <= 0.8) pricingScore += 18;
    else if (revenueMultiple <= 1.2) pricingScore += 14;
    else if (revenueMultiple <= 1.5) pricingScore += 10;
    else pricingScore += 5;
  } else {
    pricingScore += 0;
    pricingNotes.push("Insufficient data to evaluate pricing");
    weaknesses.push("Missing asking price or SDE — cannot evaluate pricing");
  }

  // ─────────────────────────────────────────────
  // 2. CASH FLOW (25 points)
  // ─────────────────────────────────────────────
  let cashFlowScore = 0;
  const cashFlowNotes: string[] = [];

  if (cashFlowModel) {
    const { summary, years } = cashFlowModel;
    const firstYear = years[0];

    // DSCR (Debt Service Coverage Ratio) - most important metric
    if (summary.minDSCR >= 1.5) {
      cashFlowScore += 10;
      strengths.push(`Excellent DSCR: ${summary.minDSCR.toFixed(2)}x minimum`);
    } else if (summary.minDSCR >= 1.25) {
      cashFlowScore += 7;
    } else if (summary.minDSCR >= 1.0) {
      cashFlowScore += 4;
      weaknesses.push(`Tight DSCR at ${summary.minDSCR.toFixed(2)}x — limited buffer`);
    } else {
      cashFlowScore += 0;
      redFlags.push(`DSCR below 1.0 (${summary.minDSCR.toFixed(2)}x) — deal does not cash flow under debt`);
    }
    cashFlowNotes.push(`Min DSCR: ${summary.minDSCR.toFixed(2)}x`);

    // IRR
    if (summary.irr >= 25) {
      cashFlowScore += 8;
      strengths.push(`High IRR: ${summary.irr.toFixed(1)}%`);
    } else if (summary.irr >= 18) {
      cashFlowScore += 6;
    } else if (summary.irr >= 12) {
      cashFlowScore += 4;
    } else {
      cashFlowScore += 2;
      weaknesses.push(`Low IRR: ${summary.irr.toFixed(1)}%`);
    }
    cashFlowNotes.push(`10-year IRR: ${summary.irr.toFixed(1)}%`);

    // Year-1 Cash-on-Cash
    const coc = firstYear.cashOnCashReturn;
    if (coc >= 20) {
      cashFlowScore += 7;
      strengths.push(`Strong Year-1 CoC: ${coc.toFixed(1)}%`);
    } else if (coc >= 12) {
      cashFlowScore += 5;
    } else if (coc >= 8) {
      cashFlowScore += 3;
    } else {
      cashFlowScore += 1;
      weaknesses.push(`Weak Year-1 cash-on-cash: ${coc.toFixed(1)}%`);
    }
    cashFlowNotes.push(`Year-1 CoC: ${coc.toFixed(1)}%`);
  } else if (sde > 0 && askingPrice > 0) {
    // Estimate basic cash flow without full model
    const capRate = (sde / askingPrice) * 100;
    cashFlowNotes.push(`Estimated cap rate (SDE/price): ${capRate.toFixed(1)}%`);
    if (capRate >= 25) cashFlowScore += 18;
    else if (capRate >= 20) cashFlowScore += 14;
    else if (capRate >= 15) cashFlowScore += 10;
    else cashFlowScore += 6;
  } else {
    cashFlowNotes.push("Cash flow model not available");
    weaknesses.push("Cannot evaluate cash flow without financial data");
  }

  // ─────────────────────────────────────────────
  // 3. MARKET (20 points)
  // ─────────────────────────────────────────────
  let marketScore = 0;
  const marketNotes: string[] = [];

  if (marketData) {
    // Renter percentage — higher is better for laundromats
    if (marketData.renterPercent !== undefined) {
      marketNotes.push(`Renter rate: ${marketData.renterPercent.toFixed(1)}%`);
      if (marketData.renterPercent >= 60) {
        marketScore += 7;
        strengths.push(`High renter concentration: ${marketData.renterPercent.toFixed(1)}%`);
      } else if (marketData.renterPercent >= 45) {
        marketScore += 5;
      } else if (marketData.renterPercent >= 30) {
        marketScore += 3;
      } else {
        marketScore += 1;
        weaknesses.push(`Low renter rate (${marketData.renterPercent.toFixed(1)}%) reduces laundromat demand`);
      }
    }

    // Competition
    const competitorCount = marketData.competitors?.length ?? 0;
    marketNotes.push(`Competitors within area: ${competitorCount}`);
    if (competitorCount === 0) {
      marketScore += 6;
      strengths.push("No direct competitors found in area");
    } else if (competitorCount <= 2) {
      marketScore += 4;
    } else if (competitorCount <= 4) {
      marketScore += 2;
    } else {
      marketScore += 0;
      weaknesses.push(`High competition: ${competitorCount} nearby laundromats`);
    }

    // Population density / size
    if (marketData.population !== undefined) {
      marketNotes.push(`City population: ${marketData.population.toLocaleString()}`);
      if (marketData.population >= 50000) {
        marketScore += 4;
      } else if (marketData.population >= 25000) {
        marketScore += 3;
      } else if (marketData.population >= 10000) {
        marketScore += 2;
      } else {
        marketScore += 1;
        weaknesses.push(`Small market (pop. ${marketData.population.toLocaleString()}) limits growth`);
      }
    }

    // Income level — lower income areas use laundromats more
    if (marketData.medianHouseholdIncome !== undefined) {
      marketNotes.push(
        `Median HH income: $${marketData.medianHouseholdIncome.toLocaleString()}`
      );
      if (marketData.medianHouseholdIncome < 45000) {
        marketScore += 3;
        strengths.push("Low-income market drives laundromat demand");
      } else if (marketData.medianHouseholdIncome < 65000) {
        marketScore += 2;
      } else {
        marketScore += 1;
      }
    }
  } else {
    marketScore = 10; // Neutral when no data
    marketNotes.push("Market data not available — using neutral score");
  }

  // ─────────────────────────────────────────────
  // 4. OPERATIONS (15 points)
  // ─────────────────────────────────────────────
  let opsScore = 0;
  const opsNotes: string[] = [];

  // Machine age
  const machineAge = listing.machines?.avgAgeYears;
  if (machineAge !== undefined) {
    opsNotes.push(`Avg machine age: ${machineAge} years`);
    if (machineAge <= 3) {
      opsScore += 6;
      strengths.push(`New machines (avg ${machineAge} years) reduces capex risk`);
    } else if (machineAge <= 6) {
      opsScore += 4;
    } else if (machineAge <= 10) {
      opsScore += 2;
      weaknesses.push(`Aging machines (${machineAge} years) — budget for replacements`);
    } else {
      opsScore += 0;
      redFlags.push(`Old machines (${machineAge}+ years) — major capex risk`);
    }
  } else {
    opsScore += 2; // Unknown, can't penalize too hard
    opsNotes.push("Machine age not specified");
  }

  // Machine count (more machines = larger, more profitable)
  const totalMachines =
    (listing.machines?.washers ?? 0) + (listing.machines?.dryers ?? 0);
  if (totalMachines > 0) {
    opsNotes.push(`Total machines: ${totalMachines}`);
    if (totalMachines >= 40) {
      opsScore += 3;
      strengths.push(`Large store: ${totalMachines} machines`);
    } else if (totalMachines >= 20) {
      opsScore += 2;
    } else {
      opsScore += 1;
    }
  }

  // Services (more service lines = more revenue diversification)
  const services = listing.services;
  if (services) {
    const serviceCount = [
      services.selfServe,
      services.washFold,
      services.pickupDelivery,
      services.commercialAccounts,
    ].filter(Boolean).length;

    opsNotes.push(`Service lines: ${serviceCount}`);
    if (serviceCount >= 3) {
      opsScore += 4;
      strengths.push(`Diversified services (${serviceCount} revenue streams)`);
    } else if (serviceCount >= 2) {
      opsScore += 2;
    } else {
      opsScore += 0;
    }

    if (services.pickupDelivery) {
      strengths.push("Pickup & delivery adds high-margin growth channel");
    }
  } else {
    opsScore += 2;
  }

  // Lease quality
  if (listing.leaseTerms) {
    opsNotes.push(`Lease: ${listing.leaseTerms}`);
    const lowerLease = listing.leaseTerms.toLowerCase();
    if (
      lowerLease.includes("10") ||
      lowerLease.includes("15") ||
      lowerLease.includes("20")
    ) {
      opsScore += 2;
      strengths.push("Long lease term provides location security");
    } else if (lowerLease.includes("5") || lowerLease.includes("7")) {
      opsScore += 1;
    } else {
      weaknesses.push("Short or unclear lease terms — verify before closing");
    }
  } else {
    opsNotes.push("Lease terms not specified");
    weaknesses.push("Missing lease information — critical to verify");
  }

  // ─────────────────────────────────────────────
  // 5. RISK (15 points)
  // ─────────────────────────────────────────────
  let riskScore = 15; // Start at max, deduct for risk factors
  const riskNotes: string[] = [];

  // SDE margin check
  if (grossRevenue > 0 && sde > 0) {
    const sdeMargin = (sde / grossRevenue) * 100;
    riskNotes.push(`SDE margin: ${sdeMargin.toFixed(1)}%`);
    if (sdeMargin >= 35) {
      strengths.push(`Healthy SDE margin: ${sdeMargin.toFixed(1)}%`);
    } else if (sdeMargin < 20) {
      riskScore -= 3;
      weaknesses.push(`Low SDE margin (${sdeMargin.toFixed(1)}%) leaves little buffer`);
    }
  }

  // Missing critical data
  const missingCritical = listing.missingFields.filter((f) =>
    ["askingPrice", "grossRevenue", "sde", "rent", "leaseTerms"].includes(f)
  );
  if (missingCritical.length > 0) {
    riskScore -= missingCritical.length * 2;
    weaknesses.push(
      `Missing critical fields: ${missingCritical.join(", ")}`
    );
  }

  // Low extraction confidence
  if (listing.extractionConfidence < 0.6) {
    riskScore -= 2;
    riskNotes.push(
      `Low data confidence: ${(listing.extractionConfidence * 100).toFixed(0)}%`
    );
    redFlags.push("Low data confidence — verify all figures with seller");
  }

  riskScore = Math.max(0, riskScore);
  riskNotes.push(
    `Extraction confidence: ${(listing.extractionConfidence * 100).toFixed(0)}%`
  );

  // ─────────────────────────────────────────────
  // Final Score
  // ─────────────────────────────────────────────
  const categories = {
    pricing: scoreCategory(pricingScore, 25, 0.25, "Pricing", pricingNotes),
    cashFlow: scoreCategory(cashFlowScore, 25, 0.25, "Cash Flow", cashFlowNotes),
    market: scoreCategory(marketScore, 20, 0.20, "Market", marketNotes),
    operations: scoreCategory(opsScore, 15, 0.15, "Operations", opsNotes),
    risk: scoreCategory(riskScore, 15, 0.15, "Risk Profile", riskNotes),
  };

  const totalScore =
    categories.pricing.score +
    categories.cashFlow.score +
    categories.market.score +
    categories.operations.score +
    categories.risk.score;

  let grade: DealScore["grade"];
  let recommendation: DealScore["recommendation"];

  if (totalScore >= 85) {
    grade = "A";
    recommendation = "Strong Buy";
  } else if (totalScore >= 70) {
    grade = "B";
    recommendation = "Buy";
  } else if (totalScore >= 55) {
    grade = "C";
    recommendation = "Watch";
  } else if (totalScore >= 40) {
    grade = "D";
    recommendation = "Pass";
  } else {
    grade = "F";
    recommendation = "Hard Pass";
  }

  // Override if red flags are serious
  if (redFlags.some((f) => f.includes("DSCR below 1.0"))) {
    recommendation = "Hard Pass";
    grade = "F";
  }

  return {
    totalScore: Math.round(totalScore * 10) / 10,
    grade,
    recommendation,
    categories,
    strengths,
    weaknesses,
    redFlags,
  };
}
