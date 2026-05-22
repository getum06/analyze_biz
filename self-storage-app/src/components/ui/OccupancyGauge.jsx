import { motion } from 'framer-motion';

export function OccupancyGauge({ value, label = "Occupancy", size = 160 }) {
  const radius = 54;
  const circumference = Math.PI * radius; // half circle
  const pct = Math.min(100, Math.max(0, value)) / 100;
  const dashOffset = circumference * (1 - pct);

  const color = value >= 90 ? '#10b981' : value >= 82 ? '#3b82f6' : value >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center" style={{ width: size }}>
      <div style={{ width: size, height: size / 2 + 20, position: 'relative' }}>
        <svg width={size} height={size / 2 + 20} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
          {/* Track */}
          <path
            d={`M ${size * 0.1} ${size / 2} A ${radius} ${radius} 0 0 1 ${size * 0.9} ${size / 2}`}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
            strokeLinecap="round"
          />
          {/* Fill */}
          <motion.path
            d={`M ${size * 0.1} ${size / 2} A ${radius} ${radius} 0 0 1 ${size * 0.9} ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
          {/* Center text */}
          <text x={size / 2} y={size / 2 - 2} textAnchor="middle" fontSize="20" fontWeight="700" fill={color}>
            {value}%
          </text>
          <text x={size / 2} y={size / 2 + 16} textAnchor="middle" fontSize="10" fill="#94a3b8">
            {label}
          </text>
        </svg>
      </div>
    </div>
  );
}
