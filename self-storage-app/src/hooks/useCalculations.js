import { useMemo } from 'react';

export function useCalculations(formValues) {
  return useMemo(() => {
    const {
      purchasePrice,
      occupancyRate,
      currentNOI,
      stabilizedNOI,
      grossRevenue,
      populationGrowth,
      sqFtPerCapita,
      competitorCount,
      propertyTax,
      insurance,
      loanAmount,
      interestRate,
      amortizationYears,
      expansionPotential,
      capexEstimate,
      delinquencyRate,
      marketOccupancy,
    } = formValues;

    const price = parseFloat(purchasePrice) || 0;
    const noi = parseFloat(currentNOI) || 0;
    const stabNOI = parseFloat(stabilizedNOI) || 0;
    const loan = parseFloat(loanAmount) || 0;
    const rate = parseFloat(interestRate) / 100 || 0;
    const amort = parseFloat(amortizationYears) || 25;
    const equity = price - loan;

    // Cap rate
    const capRate = price > 0 ? (noi / price) * 100 : 0;
    const stabCapRate = price > 0 ? (stabNOI / price) * 100 : 0;

    // Monthly mortgage payment (standard amortization formula)
    const monthlyRate = rate / 12;
    const n = amort * 12;
    const monthlyPayment = loan > 0
      ? (loan * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1)
      : 0;
    const annualDebtService = monthlyPayment * 12;

    // DSCR
    const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;
    const stabDSCR = annualDebtService > 0 ? stabNOI / annualDebtService : 0;

    // Cash-on-cash
    const cashAfterDebt = noi - annualDebtService;
    const cashOnCash = equity > 0 ? (cashAfterDebt / equity) * 100 : 0;

    // NOI margin
    const rev = parseFloat(grossRevenue) || 1;
    const noiMargin = (noi / rev) * 100;

    // LTV
    const ltv = price > 0 ? (loan / price) * 100 : 0;

    // Risk scoring
    const scores = calculateRiskScores({
      occupancyRate: parseFloat(occupancyRate),
      capRate,
      dscr,
      populationGrowth: parseFloat(populationGrowth),
      sqFtPerCapita: parseFloat(sqFtPerCapita),
      competitorCount: parseFloat(competitorCount),
      delinquencyRate: parseFloat(delinquencyRate),
      marketOccupancy: parseFloat(marketOccupancy),
      expansionPotential: parseFloat(expansionPotential),
      ltv,
    });

    const weightedScore = calculateWeightedScore(scores);
    const recommendation = getRecommendation(weightedScore, scores);

    return {
      capRate: capRate.toFixed(2),
      stabCapRate: stabCapRate.toFixed(2),
      annualDebtService: Math.round(annualDebtService),
      monthlyPayment: Math.round(monthlyPayment),
      dscr: dscr.toFixed(2),
      stabDSCR: stabDSCR.toFixed(2),
      cashAfterDebt: Math.round(cashAfterDebt),
      cashOnCash: cashOnCash.toFixed(2),
      noiMargin: noiMargin.toFixed(1),
      ltv: ltv.toFixed(1),
      equity: Math.round(equity),
      scores,
      weightedScore: weightedScore.toFixed(1),
      recommendation,
    };
  }, [formValues]);
}

function calculateRiskScores({
  occupancyRate, capRate, dscr, populationGrowth,
  sqFtPerCapita, competitorCount, delinquencyRate,
  marketOccupancy, expansionPotential, ltv,
}) {
  // Market Attractiveness (pop growth, market occupancy)
  let marketScore = 50;
  if (populationGrowth > 3) marketScore += 25;
  else if (populationGrowth > 1.5) marketScore += 15;
  if (marketOccupancy > 90) marketScore += 20;
  else if (marketOccupancy > 85) marketScore += 10;
  if (sqFtPerCapita < 7) marketScore += 15;
  else if (sqFtPerCapita > 10) marketScore -= 15;
  marketScore = Math.min(100, Math.max(0, marketScore));

  // Occupancy Quality
  let occScore = 40;
  if (occupancyRate > 90) occScore += 40;
  else if (occupancyRate > 85) occScore += 30;
  else if (occupancyRate > 80) occScore += 20;
  else if (occupancyRate > 75) occScore += 10;
  if (delinquencyRate < 2) occScore += 20;
  else if (delinquencyRate < 3.5) occScore += 10;
  else if (delinquencyRate > 5) occScore -= 10;
  occScore = Math.min(100, Math.max(0, occScore));

  // NOI Quality / Cap Rate
  let noiScore = 40;
  if (capRate > 7.5) noiScore += 35;
  else if (capRate > 6.5) noiScore += 25;
  else if (capRate > 5.5) noiScore += 15;
  else if (capRate < 4.5) noiScore -= 10;
  noiScore = Math.min(100, Math.max(0, noiScore));

  // Competition Risk (inverted — fewer competitors = better)
  let compScore = 70;
  if (competitorCount <= 3) compScore += 25;
  else if (competitorCount <= 5) compScore += 10;
  else if (competitorCount > 8) compScore -= 25;
  else if (competitorCount > 6) compScore -= 10;
  compScore = Math.min(100, Math.max(0, compScore));

  // Expansion Potential
  const expScore = Math.min(100, Math.max(0, parseFloat(expansionPotential) || 50));

  // Financing Viability
  let finScore = 50;
  if (dscr > 1.4) finScore += 35;
  else if (dscr > 1.25) finScore += 20;
  else if (dscr > 1.1) finScore += 10;
  else if (dscr < 1.0) finScore -= 30;
  if (ltv < 60) finScore += 15;
  else if (ltv > 75) finScore -= 15;
  finScore = Math.min(100, Math.max(0, finScore));

  return {
    marketAttractiveness: Math.round(marketScore),
    occupancyQuality: Math.round(occScore),
    noiQuality: Math.round(noiScore),
    competitionRisk: Math.round(compScore),
    expansionPotential: Math.round(expScore),
    financingViability: Math.round(finScore),
  };
}

function calculateWeightedScore(scores) {
  const weights = {
    marketAttractiveness: 0.22,
    occupancyQuality: 0.20,
    noiQuality: 0.20,
    competitionRisk: 0.14,
    expansionPotential: 0.12,
    financingViability: 0.12,
  };
  return Object.entries(weights).reduce((sum, [key, w]) => sum + (scores[key] || 0) * w, 0);
}

function getRecommendation(score, scores) {
  const criticalIssues = [];
  const strengths = [];

  if (scores.financingViability < 40) criticalIssues.push("Financing viability is critically low — DSCR or LTV out of range.");
  if (scores.occupancyQuality < 40) criticalIssues.push("Occupancy quality is below threshold — high delinquency or low physical occupancy.");
  if (scores.noiQuality < 40) criticalIssues.push("NOI quality is weak — cap rate may not justify acquisition price.");
  if (scores.marketAttractiveness > 75) strengths.push("Strong population & household growth support long-term demand.");
  if (scores.expansionPotential > 75) strengths.push("Expansion potential adds significant upside to stabilized value.");
  if (scores.financingViability > 75) strengths.push("Solid debt coverage and favorable LTV support risk-adjusted returns.");

  if (criticalIssues.length > 0) {
    return {
      rating: "Reject",
      color: "red",
      label: "Reject",
      description: "Critical underwriting criteria are not met. This deal does not meet minimum investment thresholds.",
      issues: criticalIssues,
      strengths,
    };
  }

  if (score >= 75) {
    return {
      rating: "Strong Buy",
      color: "green",
      label: "Strong Buy",
      description: "All major criteria exceeded. Market fundamentals, occupancy, NOI, and financing align for a high-conviction acquisition.",
      issues: [],
      strengths,
    };
  }

  if (score >= 62) {
    return {
      rating: "Moderate Buy",
      color: "blue",
      label: "Moderate Opportunity",
      description: "Solid fundamentals with manageable risks. Recommend proceeding to full due diligence with focus on identified risk areas.",
      issues: [],
      strengths,
    };
  }

  if (score >= 50) {
    return {
      rating: "Investigate",
      color: "yellow",
      label: "Investigate Further",
      description: "Mixed signals across key criteria. Additional due diligence required before proceeding. Address flagged items before committing capital.",
      issues: criticalIssues,
      strengths,
    };
  }

  return {
    rating: "High Risk",
    color: "orange",
    label: "High Risk",
    description: "Multiple risk factors present. Deal requires significant repricing or concession improvements before it meets investment criteria.",
    issues: criticalIssues,
    strengths,
  };
}
