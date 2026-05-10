"use client";
import { MarketData, Competitor } from "@/types/deal";

interface Props {
  data: MarketData;
  city?: string;
  state?: string;
}

function MetricRow({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="flex justify-between items-baseline py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="text-right">
        <span className="text-sm font-semibold text-gray-900">{value}</span>
        {sub && <div className="text-xs text-gray-400">{sub}</div>}
      </div>
    </div>
  );
}

function StarRating({ rating }: { rating?: number }) {
  if (!rating) return <span className="text-gray-400 text-xs">No rating</span>;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="text-yellow-500 text-sm">
      {"★".repeat(full)}
      {half ? "½" : ""}
      <span className="text-gray-400 text-xs ml-1">{rating.toFixed(1)}</span>
    </span>
  );
}

export function MarketDataCard({ data, city, state }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900">
          Market Data
        </h2>
        {city && state && (
          <p className="text-sm text-gray-500 mt-0.5">
            {city}, {state}
          </p>
        )}
      </div>

      <div className="p-6">
        {/* Demographics */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Demographics
          </h3>
          <div>
            {data.population !== undefined && (
              <MetricRow
                label="Population"
                value={data.population.toLocaleString()}
                sub={
                  data.populationGrowth5yr !== undefined
                    ? `${data.populationGrowth5yr > 0 ? "+" : ""}${data.populationGrowth5yr.toFixed(1)}% 5yr growth`
                    : undefined
                }
              />
            )}
            {data.householdCount !== undefined && (
              <MetricRow
                label="Households"
                value={data.householdCount.toLocaleString()}
              />
            )}
            {data.medianHouseholdIncome !== undefined && (
              <MetricRow
                label="Median HH Income"
                value={`$${data.medianHouseholdIncome.toLocaleString()}`}
              />
            )}
            {data.renterPercent !== undefined && (
              <MetricRow
                label="Renter Occupied"
                value={`${data.renterPercent.toFixed(1)}%`}
                sub="Higher = more laundromat demand"
              />
            )}
            {data.povertyRate !== undefined && (
              <MetricRow
                label="Poverty Rate"
                value={`${data.povertyRate.toFixed(1)}%`}
              />
            )}
          </div>

          {data.population === undefined &&
            data.householdCount === undefined && (
              <p className="text-sm text-gray-400 italic">
                No demographic data available for this location
              </p>
            )}
        </div>

        {/* Competitors */}
        {data.competitors && data.competitors.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Nearby Competitors ({data.competitors.length})
            </h3>
            <div className="space-y-3">
              {data.competitors.slice(0, 6).map((c: Competitor, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {c.name}
                    </div>
                    {c.address && (
                      <div className="text-xs text-gray-400 truncate">
                        {c.address}
                      </div>
                    )}
                    <StarRating rating={c.rating} />
                    {c.reviewCount !== undefined && (
                      <span className="text-xs text-gray-400 ml-1">
                        ({c.reviewCount} reviews)
                      </span>
                    )}
                  </div>
                  {c.distanceMiles !== undefined && (
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {c.distanceMiles} mi
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.competitors !== undefined && data.competitors.length === 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Competition
            </h3>
            <p className="text-sm text-emerald-600 font-medium">
              ✓ No competitors found in area
            </p>
          </div>
        )}

        {/* Notes */}
        {data.notes.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Analyst Notes
            </h3>
            <ul className="space-y-1.5">
              {data.notes.map((note, i) => (
                <li key={i} className="text-sm text-gray-600 flex gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Data sources */}
        {data.dataSources.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Sources: {data.dataSources.join(", ")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
