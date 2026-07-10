export type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  segments: DonutSegment[];
  size?: number;
};

export default function DonutChart({ segments, size = 180 }: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  if (total === 0) {
    return (
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        </svg>
        <div className="absolute text-center">
          <p className="text-2xl font-bold text-slate-900">0</p>
          <p className="text-xs text-slate-500">tickets</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="12" />
        {segments.map((segment) => {
          if (segment.value === 0) {
            return null;
          }

          const dash = (segment.value / total) * circumference;
          const circle = (
            <circle
              key={segment.label}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="12"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
            />
          );
          offset += dash;
          return circle;
        })}
      </svg>
      <div className="absolute text-center">
        <p className="text-2xl font-bold text-slate-900">{total}</p>
        <p className="text-xs text-slate-500">total</p>
      </div>
    </div>
  );
}
