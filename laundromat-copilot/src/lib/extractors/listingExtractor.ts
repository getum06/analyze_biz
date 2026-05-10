import OpenAI from "openai";
import { ExtractedListing } from "@/types/deal";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ExtractorInput {
  url?: string;
  manualText?: string;
  assetType: "laundromat";
}

async function scrapeUrl(url: string): Promise<string> {
  // Try a lightweight fetch+parse approach first (works for most listing sites)
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
      },
      signal: AbortSignal.timeout(20000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    // Strip HTML tags to get readable text
    const text = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
      .replace(/&#\d+;/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    if (text.length < 200) {
      throw new Error("Insufficient text extracted");
    }

    // Return first 12000 chars to stay within token limits
    return text.substring(0, 12000);
  } catch (err) {
    throw new Error(
      `Failed to scrape URL: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

async function extractWithPlaywright(url: string): Promise<string> {
  // Dynamic import to avoid loading playwright in environments where it's not needed
  try {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    });
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    const text = await page.evaluate(() => document.body.innerText);
    await browser.close();
    return text.substring(0, 12000);
  } catch {
    throw new Error("Playwright extraction failed");
  }
}

const EXTRACTION_PROMPT = `You are a commercial real estate and business acquisition expert specializing in laundromat investments. 

Extract structured data from the following laundromat listing text. Be precise and only extract information that is explicitly stated.

Rules:
1. Do NOT invent or estimate missing values - leave them as null
2. Convert price ranges to midpoints (e.g., "$400K-$500K" → 450000)
3. Strip formatting from numbers (e.g., "$1,200,000" → 1200000)
4. For confidence: rate 0.0-1.0 based on data completeness and clarity
5. List all missing important fields in missingFields array

Return ONLY valid JSON matching this exact schema:
{
  "businessName": string | null,
  "address": string | null,
  "city": string | null,
  "state": string | null,
  "askingPrice": number | null,
  "grossRevenue": number | null,
  "sde": number | null,
  "ebitda": number | null,
  "rent": number | null,
  "leaseTerms": string | null,
  "squareFeet": number | null,
  "employees": number | null,
  "machines": {
    "washers": number | null,
    "dryers": number | null,
    "avgAgeYears": number | null
  },
  "services": {
    "selfServe": boolean | null,
    "washFold": boolean | null,
    "pickupDelivery": boolean | null,
    "commercialAccounts": boolean | null
  },
  "sellerNotes": string | null,
  "extractionConfidence": number,
  "missingFields": string[]
}`;

export async function extractListing(
  input: ExtractorInput
): Promise<ExtractedListing> {
  let rawText: string;
  let sourceUrl = input.url || "manual-entry";

  if (input.manualText) {
    rawText = input.manualText;
  } else if (input.url) {
    // Try lightweight fetch first, fall back to Playwright
    try {
      rawText = await scrapeUrl(input.url);
    } catch {
      try {
        rawText = await extractWithPlaywright(input.url);
      } catch {
        throw new Error(
          "Could not scrape the URL. Please try pasting the listing text manually."
        );
      }
    }
  } else {
    throw new Error("Either url or manualText must be provided");
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: EXTRACTION_PROMPT },
      {
        role: "user",
        content: `Extract laundromat listing data from this text:\n\n${rawText}`,
      },
    ],
    response_format: { type: "json_object" },
    temperature: 0.1,
  });

  const raw = completion.choices[0].message.content;
  if (!raw) throw new Error("OpenAI returned empty response");

  const parsed = JSON.parse(raw);

  return {
    businessName: parsed.businessName ?? undefined,
    address: parsed.address ?? undefined,
    city: parsed.city ?? undefined,
    state: parsed.state ?? undefined,
    askingPrice: parsed.askingPrice ?? undefined,
    grossRevenue: parsed.grossRevenue ?? undefined,
    sde: parsed.sde ?? undefined,
    ebitda: parsed.ebitda ?? undefined,
    rent: parsed.rent ?? undefined,
    leaseTerms: parsed.leaseTerms ?? undefined,
    squareFeet: parsed.squareFeet ?? undefined,
    employees: parsed.employees ?? undefined,
    machines: parsed.machines
      ? {
          washers: parsed.machines.washers ?? undefined,
          dryers: parsed.machines.dryers ?? undefined,
          avgAgeYears: parsed.machines.avgAgeYears ?? undefined,
        }
      : undefined,
    services: parsed.services
      ? {
          selfServe: parsed.services.selfServe ?? undefined,
          washFold: parsed.services.washFold ?? undefined,
          pickupDelivery: parsed.services.pickupDelivery ?? undefined,
          commercialAccounts: parsed.services.commercialAccounts ?? undefined,
        }
      : undefined,
    sellerNotes: parsed.sellerNotes ?? undefined,
    sourceUrl,
    extractionConfidence: parsed.extractionConfidence ?? 0.5,
    missingFields: parsed.missingFields ?? [],
  };
}
