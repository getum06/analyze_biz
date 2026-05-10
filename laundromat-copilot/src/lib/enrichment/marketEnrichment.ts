import { MarketData, Competitor } from "@/types/deal";

export interface MarketEnrichmentInput {
  address?: string;
  city: string;
  state: string;
  radiusMiles?: number;
}

// Census ACS API - free, no key required for basic lookups
async function fetchCensusData(
  city: string,
  state: string
): Promise<Partial<MarketData>> {
  const dataSources: string[] = [];
  const notes: string[] = [];

  try {
    // Get FIPS state code from state abbreviation
    const stateCodeMap: Record<string, string> = {
      AL: "01", AK: "02", AZ: "04", AR: "05", CA: "06", CO: "08",
      CT: "09", DE: "10", FL: "12", GA: "13", HI: "15", ID: "16",
      IL: "17", IN: "18", IA: "19", KS: "20", KY: "21", LA: "22",
      ME: "23", MD: "24", MA: "25", MI: "26", MN: "27", MS: "28",
      MO: "29", MT: "30", NE: "31", NV: "32", NH: "33", NJ: "34",
      NM: "35", NY: "36", NC: "37", ND: "38", OH: "39", OK: "40",
      OR: "41", PA: "42", RI: "44", SC: "45", SD: "46", TN: "47",
      TX: "48", UT: "49", VT: "50", VA: "51", WA: "53", WV: "54",
      WI: "55", WY: "56", DC: "11",
    };

    const stateFips = stateCodeMap[state.toUpperCase()];
    if (!stateFips) {
      notes.push(`Unknown state abbreviation: ${state}`);
      return { notes, dataSources };
    }

    // ACS 5-Year Estimates - Subject Tables
    // B25003: Tenure (owner vs renter), B19013: Median household income
    // B01003: Total population, B11001: Household count, B17001: Poverty status
    const censusVars = [
      "B01003_001E",  // Total population
      "B19013_001E",  // Median household income
      "B25003_001E",  // Total occupied housing units
      "B25003_002E",  // Owner occupied
      "B25003_003E",  // Renter occupied
      "B11001_001E",  // Total households
      "B17001_002E",  // Below poverty level
    ].join(",");

    // Search for place by city name within state
    const placeSearchUrl = `https://api.census.gov/data/2022/acs/acs5?get=${censusVars}&for=place:*&in=state:${stateFips}`;

    const response = await fetch(placeSearchUrl, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      notes.push("Census API request failed");
      return { notes, dataSources };
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length < 2) {
      notes.push("No Census data found for this location");
      return { notes, dataSources };
    }

    // Find matching place by city name (case-insensitive partial match)
    const header = data[0] as string[];
    const rows = data.slice(1) as string[][];
    const cityLower = city.toLowerCase();

    // Census place names include "city", "town", etc.
    // We need to compare against "place" field but Census doesn't return name by default
    // Use a targeted city lookup
    const placeNameUrl = `https://api.census.gov/data/2022/acs/acs5?get=NAME,${censusVars}&for=place:*&in=state:${stateFips}`;
    const namedResponse = await fetch(placeNameUrl, {
      signal: AbortSignal.timeout(10000),
    });

    if (!namedResponse.ok) {
      notes.push("Census named place lookup failed");
      return { notes, dataSources };
    }

    const namedData = await namedResponse.json();
    const namedHeader = namedData[0] as string[];
    const namedRows = namedData.slice(1) as string[][];

    const nameIdx = namedHeader.indexOf("NAME");
    const popIdx = namedHeader.indexOf("B01003_001E");
    const incomeIdx = namedHeader.indexOf("B19013_001E");
    const totalHousingIdx = namedHeader.indexOf("B25003_001E");
    const renterIdx = namedHeader.indexOf("B25003_003E");
    const householdsIdx = namedHeader.indexOf("B11001_001E");
    const povertyIdx = namedHeader.indexOf("B17001_002E");

    // Find best matching row
    let bestMatch: string[] | null = null;
    let bestScore = 0;

    for (const row of namedRows) {
      const placeName = (row[nameIdx] || "").toLowerCase();
      if (placeName.includes(cityLower)) {
        // Prefer exact city name matches
        const exactMatch = placeName.startsWith(cityLower + " ");
        const score = exactMatch ? 2 : 1;
        if (score > bestScore) {
          bestScore = score;
          bestMatch = row;
        }
      }
    }

    if (!bestMatch) {
      notes.push(`No Census data found for ${city}, ${state}. Using state-level data.`);
      return { notes, dataSources };
    }

    const population = parseInt(bestMatch[popIdx]) || undefined;
    const medianIncome = parseInt(bestMatch[incomeIdx]) || undefined;
    const totalHousing = parseInt(bestMatch[totalHousingIdx]) || 1;
    const renterUnits = parseInt(bestMatch[renterIdx]) || 0;
    const households = parseInt(bestMatch[householdsIdx]) || undefined;
    const povertyCount = parseInt(bestMatch[povertyIdx]) || 0;

    const renterPercent =
      totalHousing > 0 ? (renterUnits / totalHousing) * 100 : undefined;
    const povertyRate =
      population && population > 0
        ? (povertyCount / population) * 100
        : undefined;

    dataSources.push("U.S. Census Bureau, ACS 5-Year Estimates (2022)");

    return {
      population,
      medianHouseholdIncome: medianIncome,
      renterPercent: renterPercent ? Math.round(renterPercent * 10) / 10 : undefined,
      householdCount: households,
      povertyRate: povertyRate ? Math.round(povertyRate * 10) / 10 : undefined,
      notes,
      dataSources,
    };
  } catch (err) {
    notes.push(
      `Census data unavailable: ${err instanceof Error ? err.message : "Unknown error"}`
    );
    return { notes, dataSources };
  }
}

// Estimate population growth using Census comparison data
async function fetchPopulationGrowth(
  city: string,
  state: string,
  currentPopulation?: number
): Promise<{ growth5yr?: number; notes: string[] }> {
  const notes: string[] = [];
  if (!currentPopulation) return { notes };

  try {
    const stateCodeMap: Record<string, string> = {
      AL: "01", AK: "02", AZ: "04", AR: "05", CA: "06", CO: "08",
      CT: "09", DE: "10", FL: "12", GA: "13", HI: "15", ID: "16",
      IL: "17", IN: "18", IA: "19", KS: "20", KY: "21", LA: "22",
      ME: "23", MD: "24", MA: "25", MI: "26", MN: "27", MS: "28",
      MO: "29", MT: "30", NE: "31", NV: "32", NH: "33", NJ: "34",
      NM: "35", NY: "36", NC: "37", ND: "38", OH: "39", OK: "40",
      OR: "41", PA: "42", RI: "44", SC: "45", SD: "46", TN: "47",
      TX: "48", UT: "49", VT: "50", VA: "51", WA: "53", WV: "54",
      WI: "55", WY: "56", DC: "11",
    };

    const stateFips = stateCodeMap[state.toUpperCase()];
    if (!stateFips) return { notes };

    // Get 2017 ACS data for comparison (5-year growth)
    const url2017 = `https://api.census.gov/data/2017/acs/acs5?get=NAME,B01003_001E&for=place:*&in=state:${stateFips}`;
    const response = await fetch(url2017, {
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return { notes };

    const data = await response.json();
    const cityLower = city.toLowerCase();

    const nameIdx = 0;
    const popIdx = 1;

    let oldPop: number | undefined;
    for (const row of data.slice(1) as string[][]) {
      const placeName = (row[nameIdx] || "").toLowerCase();
      if (placeName.includes(cityLower)) {
        oldPop = parseInt(row[popIdx]) || undefined;
        break;
      }
    }

    if (oldPop && oldPop > 0) {
      const growth5yr = ((currentPopulation - oldPop) / oldPop) * 100;
      return {
        growth5yr: Math.round(growth5yr * 10) / 10,
        notes: [],
      };
    }
  } catch {
    notes.push("Could not fetch historical population data");
  }

  return { notes };
}

// Google Places API for competitor laundromats
async function fetchCompetitors(
  city: string,
  state: string,
  radiusMiles: number = 3
): Promise<{ competitors: Competitor[]; notes: string[] }> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const notes: string[] = [];

  if (!apiKey) {
    notes.push("Google Places API key not configured. Competitor data unavailable.");
    return { competitors: [], notes };
  }

  try {
    // First geocode the city
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      `${city}, ${state}`
    )}&key=${apiKey}`;

    const geocodeResponse = await fetch(geocodeUrl, {
      signal: AbortSignal.timeout(10000),
    });
    const geocodeData = await geocodeResponse.json();

    if (
      geocodeData.status !== "OK" ||
      !geocodeData.results?.[0]?.geometry?.location
    ) {
      notes.push("Could not geocode location for competitor search");
      return { competitors: [], notes };
    }

    const { lat, lng } = geocodeData.results[0].geometry.location;
    const radiusMeters = Math.round(radiusMiles * 1609.34);

    // Search for laundromats nearby
    const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&keyword=laundromat&key=${apiKey}`;

    const placesResponse = await fetch(placesUrl, {
      signal: AbortSignal.timeout(10000),
    });
    const placesData = await placesResponse.json();

    if (placesData.status !== "OK") {
      notes.push(`Places API returned: ${placesData.status}`);
      return { competitors: [], notes };
    }

    const competitors: Competitor[] = (placesData.results || [])
      .slice(0, 10)
      .map((place: {
        name: string;
        vicinity?: string;
        rating?: number;
        user_ratings_total?: number;
        geometry?: { location?: { lat: number; lng: number } };
      }) => {
        // Calculate approximate distance
        let distanceMiles: number | undefined;
        if (place.geometry?.location) {
          const dLat = place.geometry.location.lat - lat;
          const dLng = place.geometry.location.lng - lng;
          const distKm =
            Math.sqrt(dLat * dLat + dLng * dLng) * 111; // rough km
          distanceMiles = Math.round((distKm * 0.621371) * 10) / 10;
        }

        return {
          name: place.name,
          address: place.vicinity,
          rating: place.rating,
          reviewCount: place.user_ratings_total,
          distanceMiles,
        };
      });

    return { competitors, notes: [] };
  } catch (err) {
    notes.push(
      `Competitor search failed: ${err instanceof Error ? err.message : "Unknown error"}`
    );
    return { competitors: [], notes };
  }
}

export async function enrichMarketData(
  input: MarketEnrichmentInput
): Promise<MarketData> {
  const { city, state, radiusMiles = 3 } = input;

  const [censusData, competitorData] = await Promise.all([
    fetchCensusData(city, state),
    fetchCompetitors(city, state, radiusMiles),
  ]);

  // Fetch population growth if we have current population
  let growthData: { growth5yr?: number; notes: string[] } = { notes: [] };
  if (censusData.population) {
    growthData = await fetchPopulationGrowth(
      city,
      state,
      censusData.population
    );
  }

  const allNotes = [
    ...(censusData.notes || []),
    ...(competitorData.notes || []),
    ...(growthData.notes || []),
  ];

  const allSources = [...(censusData.dataSources || [])];
  if (competitorData.competitors.length > 0) {
    allSources.push("Google Places API");
  }

  // Add contextual notes based on data
  if (censusData.renterPercent !== undefined) {
    if (censusData.renterPercent > 50) {
      allNotes.push(
        `High renter concentration (${censusData.renterPercent.toFixed(1)}%) is favorable for laundromat demand`
      );
    } else if (censusData.renterPercent < 30) {
      allNotes.push(
        `Low renter rate (${censusData.renterPercent.toFixed(1)}%) may indicate weaker laundromat demand`
      );
    }
  }

  if (censusData.medianHouseholdIncome !== undefined) {
    if (censusData.medianHouseholdIncome < 50000) {
      allNotes.push(
        `Below-median household income ($${censusData.medianHouseholdIncome.toLocaleString()}) supports strong laundromat usage`
      );
    }
  }

  if (competitorData.competitors.length > 0) {
    allNotes.push(
      `Found ${competitorData.competitors.length} competitor laundromats within ${radiusMiles} miles`
    );
  }

  return {
    population: censusData.population,
    populationGrowth5yr: growthData.growth5yr,
    medianHouseholdIncome: censusData.medianHouseholdIncome,
    renterPercent: censusData.renterPercent,
    householdCount: censusData.householdCount,
    povertyRate: censusData.povertyRate,
    competitors: competitorData.competitors,
    notes: allNotes,
    dataSources: allSources,
  };
}
