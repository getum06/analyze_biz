import {
  CashFlowModel,
  CashFlowYear,
  FinancingStructure,
  ExtractedListing,
} from "@/types/deal";

export interface CashFlowModelInput {
  listing: ExtractedListing;
  holdingPeriodYears?: number;
  // Financing overrides
  downPaymentPercent?: number;
  sbaRate?: number;
  sbaTerm?: number;
  sellerFinancingPercent?: number;
  sellerFinancingRate?: number;
  sellerFinancingTerm?: number;
  // Operating assumption overrides
  revenueGrowthRate?: number;
  cogsPercent?: number;
  rentEscalation?: number;
  exitMultiple?: number;
}

function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal <= 0 || annualRate <= 0 || termYears <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const n = termYears * 12;
  return (
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
    (Math.pow(1 + monthlyRate, n) - 1)
  );
}

function computeIRR(cashFlows: number[]): number {
  // Newton-Raphson method for IRR
  let rate = 0.1;
  for (let i = 0; i < 100; i++) {
    let npv = 0;
    let dnpv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + rate, t);
      dnpv += (-t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
    }
    const newRate = rate - npv / dnpv;
    if (Math.abs(newRate - rate) < 0.0001) return newRate * 100;
    rate = newRate;
  }
  return rate * 100;
}

// Laundromat-specific operating expense benchmarks
function estimateOperatingExpenses(
  grossRevenue: number,
  rent: number,
  year: number,
  rentEscalation: number
): CashFlowYear["operatingExpenses"] {
  // Industry benchmarks for laundromats (% of gross revenue)
  const escalatedRent = rent * Math.pow(1 + rentEscalation / 100, year - 1);

  const utilities = grossRevenue * 0.22; // Utilities ~22% (gas/water/electric major cost)
  const labor = grossRevenue * 0.08;     // Labor ~8% (mostly self-serve)
  const maintenance = grossRevenue * 0.06; // Machine maintenance ~6%
  const supplies = grossRevenue * 0.02;    // Supplies ~2%
  const insurance = grossRevenue * 0.02;   // Insurance ~2%
  const marketing = grossRevenue * 0.01;   // Marketing ~1%
  const other = grossRevenue * 0.03;       // Misc ~3%

  const total =
    escalatedRent +
    utilities +
    labor +
    maintenance +
    supplies +
    insurance +
    marketing +
    other;

  return {
    rent: Math.round(escalatedRent),
    utilities: Math.round(utilities),
    labor: Math.round(labor),
    maintenance: Math.round(maintenance),
    supplies: Math.round(supplies),
    insurance: Math.round(insurance),
    marketing: Math.round(marketing),
    other: Math.round(other),
    total: Math.round(total),
  };
}

export function buildCashFlowModel(input: CashFlowModelInput): CashFlowModel {
  const { listing } = input;
  const holdingPeriodYears = input.holdingPeriodYears ?? 10;

  // Base financials - use SDE or EBITDA, prefer SDE for small biz
  const askingPrice = listing.askingPrice ?? 0;
  const grossRevenue = listing.grossRevenue ?? 0;
  const sde = listing.sde ?? listing.ebitda ?? 0;
  const monthlyRent = listing.rent ?? 0;
  const annualRent = monthlyRent * 12;

  // Assumptions
  const revenueGrowthRate = input.revenueGrowthRate ?? 3.0; // 3% annual growth
  const cogsPercent = input.cogsPercent ?? 5;               // ~5% COGS for laundromats (minimal inventory)
  const rentEscalation = input.rentEscalation ?? 3.0;       // 3% annual rent increases
  const exitMultiple = input.exitMultiple ?? 3.5;            // Exit at 3.5x SDE

  // Financing structure
  const downPaymentPercent = input.downPaymentPercent ?? 10;
  const downPayment = askingPrice * (downPaymentPercent / 100);

  // SBA 7(a) for laundromats
  const sbaRate = input.sbaRate ?? 8.5;
  const sbaTerm = input.sbaTerm ?? 10;

  // Seller financing as % of price (if any)
  const sellerFinancingPercent = input.sellerFinancingPercent ?? 10;
  const sellerFinancingRate = input.sellerFinancingRate ?? 6.0;
  const sellerFinancingTerm = input.sellerFinancingTerm ?? 5;

  const sellerFinancingAmount = askingPrice * (sellerFinancingPercent / 100);
  const sbaLoanAmount = askingPrice - downPayment - sellerFinancingAmount;

  const sbaMonthlyPayment = calculateMonthlyPayment(
    sbaLoanAmount,
    sbaRate,
    sbaTerm
  );
  const sellerMonthlyPayment = calculateMonthlyPayment(
    sellerFinancingAmount,
    sellerFinancingRate,
    sellerFinancingTerm
  );

  const annualDebtService =
    (sbaMonthlyPayment + sellerMonthlyPayment) * 12;

  const financing: FinancingStructure = {
    downPayment: Math.round(downPayment),
    sbaLoanAmount: Math.round(sbaLoanAmount),
    sbaRate,
    sbaTerm,
    sellerFinancingAmount: Math.round(sellerFinancingAmount),
    sellerFinancingRate,
    sellerFinancingTerm,
    totalDebt: Math.round(sbaLoanAmount + sellerFinancingAmount),
    annualDebtService: Math.round(annualDebtService),
  };

  // Build year-by-year projections
  const years: CashFlowYear[] = [];

  // Initial depreciation estimate: machines depreciated over 7-10 years
  // Estimate machine value at ~30% of purchase price for used laundromat
  const machineEstimatedValue = askingPrice * 0.3;
  const annualDepreciation = machineEstimatedValue / 7; // 7-year MACRS

  for (let year = 1; year <= holdingPeriodYears; year++) {
    const yearRevenue =
      grossRevenue * Math.pow(1 + revenueGrowthRate / 100, year - 1);
    const cogs = yearRevenue * (cogsPercent / 100);
    const grossProfit = yearRevenue - cogs;

    const opEx = estimateOperatingExpenses(
      yearRevenue,
      annualRent,
      year,
      rentEscalation
    );

    const ebitda = grossProfit - opEx.total;
    const ebitdaMargin = yearRevenue > 0 ? (ebitda / yearRevenue) * 100 : 0;

    // Depreciation only applies in years 1-7
    const yearDepreciation = year <= 7 ? annualDepreciation : 0;
    const ebit = ebitda - yearDepreciation;

    // Debt service decreases as seller financing is paid off
    let yearDebtService = annualDebtService;
    if (year > sellerFinancingTerm) {
      // Seller financing paid off
      yearDebtService = sbaMonthlyPayment * 12;
    }
    if (year > sbaTerm) {
      // SBA paid off too
      yearDebtService = 0;
    }

    // Interest expense (simplified: average outstanding balance)
    const sbaInterest =
      year <= sbaTerm
        ? (sbaLoanAmount * (1 - (year - 1) / sbaTerm)) * (sbaRate / 100) * 0.5
        : 0;
    const sellerInterest =
      year <= sellerFinancingTerm
        ? (sellerFinancingAmount * (1 - (year - 1) / sellerFinancingTerm)) *
          (sellerFinancingRate / 100) *
          0.5
        : 0;
    const interestExpense = sbaInterest + sellerInterest;

    const netIncome = ebit - interestExpense;
    const freeCashFlow = ebitda - yearDebtService;
    const cashOnCashReturn =
      downPayment > 0 ? (freeCashFlow / downPayment) * 100 : 0;
    const dscr = yearDebtService > 0 ? ebitda / yearDebtService : 999;

    years.push({
      year,
      grossRevenue: Math.round(yearRevenue),
      revenueGrowth: year === 1 ? 0 : revenueGrowthRate,
      cogs: Math.round(cogs),
      grossProfit: Math.round(grossProfit),
      operatingExpenses: opEx,
      ebitda: Math.round(ebitda),
      ebitdaMargin: Math.round(ebitdaMargin * 10) / 10,
      depreciation: Math.round(yearDepreciation),
      ebit: Math.round(ebit),
      interestExpense: Math.round(interestExpense),
      debtService: Math.round(yearDebtService),
      netIncome: Math.round(netIncome),
      freeCashFlow: Math.round(freeCashFlow),
      cashOnCashReturn: Math.round(cashOnCashReturn * 10) / 10,
      dscr: Math.round(dscr * 100) / 100,
    });
  }

  // Summary calculations
  const totalCashFlow = years.reduce((sum, y) => sum + y.freeCashFlow, 0);
  const exitYearEbitda = years[holdingPeriodYears - 1].ebitda;
  const exitValue = exitYearEbitda * exitMultiple;
  const totalReturn = totalCashFlow + exitValue - downPayment;

  // IRR calculation
  const irrCashFlows = [-downPayment, ...years.map((y) => y.freeCashFlow)];
  // Add exit value to final cash flow
  irrCashFlows[irrCashFlows.length - 1] += exitValue;
  const irr = computeIRR(irrCashFlows);

  const moic =
    downPayment > 0 ? (totalCashFlow + exitValue) / downPayment : 0;
  const avgDSCR =
    years.reduce((sum, y) => sum + (y.dscr < 999 ? y.dscr : 0), 0) /
    years.filter((y) => y.debtService > 0).length || 0;
  const minDSCR = Math.min(
    ...years.filter((y) => y.debtService > 0).map((y) => y.dscr)
  );

  return {
    askingPrice,
    financing,
    assumptions: {
      revenueGrowthRate,
      cogsPercent,
      rentEscalation,
      maintenanceReservePercent: 6,
      exitMultiple,
      holdingPeriodYears,
    },
    years,
    summary: {
      totalInvestment: Math.round(downPayment),
      totalCashFlow: Math.round(totalCashFlow),
      irr: Math.round(irr * 10) / 10,
      moic: Math.round(moic * 100) / 100,
      averageDSCR: Math.round(avgDSCR * 100) / 100,
      minDSCR: Math.round((minDSCR === Infinity ? 0 : minDSCR) * 100) / 100,
      exitValue: Math.round(exitValue),
      totalReturn: Math.round(totalReturn),
    },
  };
}
