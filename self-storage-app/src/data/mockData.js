// Mock acquisition: DFW Self-Storage Facility
export const mockAcquisition = {
  // Deal basics
  propertyName: "Sundance Storage — Frisco, TX",
  address: "14820 Preston Rd, Frisco, TX 75035",
  market: "Dallas–Fort Worth",
  submarket: "Frisco / Collin County",
  totalSqFt: 68_500,
  totalUnits: 520,
  climateControlled: 310,
  nonClimate: 210,
  landAcres: 4.2,
  yearBuilt: 2008,
  lastRenovated: 2019,

  // Purchase assumptions
  purchasePrice: 8_200_000,
  closingCosts: 164_000,
  totalAcquisition: 8_364_000,

  // Current operations
  grossPotentialRent: 1_142_400,
  physicalOccupancy: 0.87,
  economicOccupancy: 0.83,
  currentNOI: 612_000,
  stabilizedNOI: 740_000,
  delinquencyRate: 0.024,
  avgRentPsf: 1.39,
  marketRentPsf: 1.52,

  // Financing
  loanAmount: 5_330_000,
  ltv: 0.65,
  interestRate: 0.0675,
  amortization: 25,
  loanTerm: 10,
  annualDebtService: 444_000,
  dscr: 1.38,
  cashOnCash: 0.101,
  capRate: 0.0746,

  // Market metrics
  populationGrowthRate: 0.038,
  householdGrowthRate: 0.031,
  sqFtPerCapita: 7.2,
  competitorCount: 6,
  newSupplyPipeline: 42_000,
  marketOccupancy: 0.912,
  reitPresence: "Public Storage — 2 locations within 3mi",

  // Expenses
  expenses: {
    propertyTax: 98_400,
    insurance: 41_200,
    payroll: 72_000,
    utilities: 38_500,
    maintenance: 24_000,
    marketing: 18_000,
    management: 61_200,
    software: 9_600,
    reserves: 13_700,
    other: 12_900,
  },

  // CapEx
  capex: {
    roofRepair: 45_000,
    asphaltSeal: 18_000,
    securityUpgrade: 22_000,
    lightingLED: 14_500,
    gateSystem: 8_500,
    paintExterior: 12_000,
    climateHVAC: 28_000,
    total: 148_000,
  },

  // Scoring
  scores: {
    marketAttractiveness: 88,
    occupancyQuality: 78,
    noiQuality: 72,
    competitionRisk: 65,
    expansionPotential: 80,
    infrastructureQuality: 71,
    financingViability: 85,
    managementComplexity: 82,
  },

  // Revenue optimization
  revenueOpportunities: {
    dynamicPricing: 48_000,
    insuranceRevenue: 22_000,
    adminFees: 8_400,
    lateFees: 11_200,
    rvBoatStorage: 18_000,
    digitalMarketing: 15_600,
    rateIncrease: 62_000,
  },
};

// NOI trend data
export const noiTrendData = [
  { year: "2021", noi: 498_000, revenue: 892_000 },
  { year: "2022", noi: 542_000, revenue: 948_000 },
  { year: "2023", noi: 580_000, revenue: 998_000 },
  { year: "2024", noi: 612_000, revenue: 1_042_000 },
  { year: "2025E", noi: 672_000, revenue: 1_098_000 },
  { year: "2026E", noi: 740_000, revenue: 1_158_000 },
];

// Occupancy trend
export const occupancyTrendData = [
  { month: "Jan", physical: 81, economic: 77 },
  { month: "Feb", physical: 82, economic: 78 },
  { month: "Mar", physical: 85, economic: 81 },
  { month: "Apr", physical: 87, economic: 83 },
  { month: "May", physical: 89, economic: 85 },
  { month: "Jun", physical: 91, economic: 87 },
  { month: "Jul", physical: 90, economic: 86 },
  { month: "Aug", physical: 88, economic: 84 },
  { month: "Sep", physical: 87, economic: 83 },
  { month: "Oct", physical: 86, economic: 82 },
  { month: "Nov", physical: 84, economic: 80 },
  { month: "Dec", physical: 83, economic: 79 },
];

// Revenue mix
export const revenueMixData = [
  { name: "Climate Control", value: 58, color: "#1e40af" },
  { name: "Standard Units", value: 28, color: "#3b82f6" },
  { name: "Insurance", value: 6, color: "#10b981" },
  { name: "Fees & Other", value: 5, color: "#6366f1" },
  { name: "RV/Boat", value: 3, color: "#94a3b8" },
];

// Expense breakdown
export const expenseData = [
  { category: "Property Tax", amount: 98_400, benchmark: 85_000, pct: 9.4 },
  { category: "Management", amount: 61_200, benchmark: 58_000, pct: 5.9 },
  { category: "Payroll", amount: 72_000, benchmark: 68_000, pct: 6.9 },
  { category: "Insurance", amount: 41_200, benchmark: 38_000, pct: 4.0 },
  { category: "Utilities", amount: 38_500, benchmark: 35_000, pct: 3.7 },
  { category: "Maintenance", amount: 24_000, benchmark: 22_000, pct: 2.3 },
  { category: "Marketing", amount: 18_000, benchmark: 20_000, pct: 1.7 },
  { category: "Software", amount: 9_600, benchmark: 9_000, pct: 0.9 },
  { category: "Reserves", amount: 13_700, benchmark: 14_000, pct: 1.3 },
  { category: "Other", amount: 12_900, benchmark: 11_000, pct: 1.2 },
];

// Competitive landscape
export const competitorData = [
  { name: "Public Storage", distance: "1.2mi", occupancy: 94, sqft: 82000, climate: true, rating: 4.3 },
  { name: "Extra Space Storage", distance: "2.1mi", occupancy: 91, sqft: 65000, climate: true, rating: 4.5 },
  { name: "CubeSmart", distance: "2.8mi", occupancy: 88, sqft: 54000, climate: true, rating: 4.1 },
  { name: "Uncle Bob's", distance: "3.1mi", occupancy: 78, sqft: 38000, climate: false, rating: 3.8 },
  { name: "Store Right", distance: "3.5mi", occupancy: 82, sqft: 44000, climate: false, rating: 3.9 },
  { name: "StorageMart", distance: "4.0mi", occupancy: 86, sqft: 51000, climate: true, rating: 4.0 },
];

// Sensitivity table: cap rate vs NOI
export const sensitivityData = {
  nois: [580_000, 612_000, 650_000, 700_000, 740_000],
  capRates: [0.065, 0.070, 0.075, 0.080, 0.085],
  values: [
    [8_923_077, 8_285_714, 7_733_333, 7_250_000, 6_823_529],
    [8_285_714, 7_692_308, 7_176_471, 6_733_333, 6_337_209],
    [7_733_333, 7_176_471, 6_703_704, 6_285_714, 5_913_725],
    [7_250_000, 6_733_333, 6_285_714, 5_892_308, 5_543_353],
    [6_823_529, 6_337_209, 5_913_725, 5_543_353, 5_213_529],
  ],
};

// Market scoring weights
export const scorecardWeights = [
  { category: "Market Attractiveness", weight: 20, score: 88 },
  { category: "Occupancy Quality", weight: 18, score: 78 },
  { category: "NOI Quality", weight: 17, score: 72 },
  { category: "Competition Risk", weight: 12, score: 65 },
  { category: "Expansion Potential", weight: 10, score: 80 },
  { category: "Infrastructure Quality", weight: 10, score: 71 },
  { category: "Financing Viability", weight: 8, score: 85 },
  { category: "Management Complexity", weight: 5, score: 82 },
];

export const defaultFormValues = {
  purchasePrice: 8200000,
  occupancyRate: 87,
  currentNOI: 612000,
  stabilizedNOI: 740000,
  grossRevenue: 1042000,
  populationGrowth: 3.8,
  sqFtPerCapita: 7.2,
  competitorCount: 6,
  propertyTax: 98400,
  insurance: 41200,
  loanAmount: 5330000,
  interestRate: 6.75,
  amortizationYears: 25,
  expansionPotential: 80,
  capexEstimate: 148000,
  delinquencyRate: 2.4,
  marketOccupancy: 91.2,
};
