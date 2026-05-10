export interface MachineData {
  washers?: number;
  dryers?: number;
  avgAgeYears?: number;
}

export interface ServiceData {
  selfServe?: boolean;
  washFold?: boolean;
  pickupDelivery?: boolean;
  commercialAccounts?: boolean;
}

export interface ExtractedListing {
  businessName?: string;
  address?: string;
  city?: string;
  state?: string;
  askingPrice?: number;
  grossRevenue?: number;
  sde?: number;
  ebitda?: number;
  rent?: number;
  leaseTerms?: string;
  squareFeet?: number;
  employees?: number;
  machines?: MachineData;
  services?: ServiceData;
  sellerNotes?: string;
  sourceUrl: string;
  extractionConfidence: number;
  missingFields: string[];
}

export interface Competitor {
  name: string;
  address?: string;
  rating?: number;
  reviewCount?: number;
  distanceMiles?: number;
}

export interface MarketData {
  population?: number;
  populationGrowth5yr?: number;
  medianHouseholdIncome?: number;
  renterPercent?: number;
  householdCount?: number;
  povertyRate?: number;
  competitors?: Competitor[];
  crimeIndex?: number;
  trafficCounts?: number;
  notes: string[];
  dataSources: string[];
}

export interface CashFlowYear {
  year: number;
  grossRevenue: number;
  revenueGrowth: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: {
    rent: number;
    utilities: number;
    labor: number;
    maintenance: number;
    supplies: number;
    insurance: number;
    marketing: number;
    other: number;
    total: number;
  };
  ebitda: number;
  ebitdaMargin: number;
  depreciation: number;
  ebit: number;
  interestExpense: number;
  debtService: number;
  netIncome: number;
  freeCashFlow: number;
  cashOnCashReturn: number;
  dscr: number;
}

export interface FinancingStructure {
  downPayment: number;
  sbaLoanAmount: number;
  sbaRate: number;
  sbaTerm: number;
  sellerFinancingAmount: number;
  sellerFinancingRate: number;
  sellerFinancingTerm: number;
  totalDebt: number;
  annualDebtService: number;
}

export interface CashFlowModel {
  dealId?: string;
  askingPrice: number;
  financing: FinancingStructure;
  assumptions: {
    revenueGrowthRate: number;
    cogsPercent: number;
    rentEscalation: number;
    maintenanceReservePercent: number;
    exitMultiple: number;
    holdingPeriodYears: number;
  };
  years: CashFlowYear[];
  summary: {
    totalInvestment: number;
    totalCashFlow: number;
    irr: number;
    moic: number;
    averageDSCR: number;
    minDSCR: number;
    exitValue: number;
    totalReturn: number;
  };
}

export interface DealScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  notes: string[];
}

export interface DealScore {
  totalScore: number;
  grade: "A" | "B" | "C" | "D" | "F";
  recommendation: "Strong Buy" | "Buy" | "Watch" | "Pass" | "Hard Pass";
  categories: {
    pricing: DealScoreCategory;
    cashFlow: DealScoreCategory;
    market: DealScoreCategory;
    operations: DealScoreCategory;
    risk: DealScoreCategory;
  };
  strengths: string[];
  weaknesses: string[];
  redFlags: string[];
}

export interface InvestmentMemo {
  dealId?: string;
  generatedAt: string;
  executiveSummary: string;
  dealOverview: string;
  financialAnalysis: string;
  marketAnalysis: string;
  operationsAssessment: string;
  investmentThesis: string;
  riskFactors: string;
  dealStructure: string;
  recommendation: string;
  nextSteps: string[];
}

export interface FullDealAnalysis {
  listing: ExtractedListing;
  marketData?: MarketData;
  cashFlowModel?: CashFlowModel;
  dealScore?: DealScore;
  investmentMemo?: InvestmentMemo;
}
