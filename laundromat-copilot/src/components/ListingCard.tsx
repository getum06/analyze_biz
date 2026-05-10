"use client";
import { ExtractedListing } from "@/types/deal";

interface Props {
  listing: ExtractedListing;
}

function Field({
  label,
  value,
  highlight,
}: {
  label: string;
  value?: string | number;
  highlight?: boolean;
}) {
  if (value === undefined || value === null) return null;
  return (
    <div
      className={`flex justify-between items-baseline py-2 border-b border-gray-100 last:border-0 ${
        highlight ? "bg-blue-50 -mx-2 px-2 rounded" : ""
      }`}
    >
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-blue-700" : "text-gray-900"}`}>
        {value}
      </span>
    </div>
  );
}

function fmt(n?: number): string {
  if (n === undefined) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function ListingCard({ listing }: Props) {
  const sde = listing.sde ?? listing.ebitda;
  const multiple =
    listing.askingPrice && sde ? listing.askingPrice / sde : undefined;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {listing.businessName || "Unnamed Laundromat"}
            </h2>
            {(listing.city || listing.state) && (
              <p className="text-sm text-gray-500 mt-0.5">
                {[listing.address, listing.city, listing.state]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400">Confidence</div>
            <div
              className={`text-sm font-bold ${
                listing.extractionConfidence >= 0.7
                  ? "text-emerald-600"
                  : listing.extractionConfidence >= 0.5
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {Math.round(listing.extractionConfidence * 100)}%
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Key financials */}
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Key Financials
          </h3>
          <Field label="Asking Price" value={fmt(listing.askingPrice)} highlight />
          <Field label="Gross Revenue" value={fmt(listing.grossRevenue)} />
          <Field label="SDE" value={fmt(listing.sde)} highlight />
          <Field label="EBITDA" value={fmt(listing.ebitda)} />
          {multiple && (
            <div className="flex justify-between items-baseline py-2 border-b border-gray-100">
              <span className="text-sm text-gray-500">SDE Multiple</span>
              <span
                className={`text-sm font-bold ${
                  multiple <= 3 ? "text-emerald-600" : multiple <= 4 ? "text-yellow-600" : "text-red-600"
                }`}
              >
                {multiple.toFixed(2)}x
              </span>
            </div>
          )}
        </div>

        {/* Operations */}
        <div className="mb-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Operations
          </h3>
          <Field
            label="Monthly Rent"
            value={listing.rent ? fmt(listing.rent) + "/mo" : undefined}
          />
          <Field label="Lease Terms" value={listing.leaseTerms} />
          <Field
            label="Square Feet"
            value={
              listing.squareFeet
                ? `${listing.squareFeet.toLocaleString()} sq ft`
                : undefined
            }
          />
          <Field label="Employees" value={listing.employees} />
        </div>

        {/* Equipment */}
        {listing.machines && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Equipment
            </h3>
            <Field label="Washers" value={listing.machines.washers} />
            <Field label="Dryers" value={listing.machines.dryers} />
            <Field
              label="Avg Machine Age"
              value={
                listing.machines.avgAgeYears
                  ? `${listing.machines.avgAgeYears} years`
                  : undefined
              }
            />
          </div>
        )}

        {/* Services */}
        {listing.services && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Services
            </h3>
            <div className="flex flex-wrap gap-2">
              {listing.services.selfServe && (
                <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  Self-Serve
                </span>
              )}
              {listing.services.washFold && (
                <span className="px-2.5 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  Wash & Fold
                </span>
              )}
              {listing.services.pickupDelivery && (
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
                  Pickup & Delivery
                </span>
              )}
              {listing.services.commercialAccounts && (
                <span className="px-2.5 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium">
                  Commercial
                </span>
              )}
            </div>
          </div>
        )}

        {/* Seller notes */}
        {listing.sellerNotes && (
          <div className="mb-5">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Seller Notes
            </h3>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
              {listing.sellerNotes}
            </p>
          </div>
        )}

        {/* Missing fields */}
        {listing.missingFields.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-yellow-600 uppercase tracking-wide mb-2">
              Missing Data
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {listing.missingFields.map((f) => (
                <span
                  key={f}
                  className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs rounded border border-yellow-200"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {listing.sourceUrl && listing.sourceUrl !== "manual-entry" && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <a
            href={listing.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline truncate block"
          >
            {listing.sourceUrl}
          </a>
        </div>
      )}
    </div>
  );
}
