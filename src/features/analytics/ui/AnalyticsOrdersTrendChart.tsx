import { formatAnalyticsShortDate } from "@/features/analytics/domain/date-range";
import type { AnalyticsCsvRow } from "@/features/analytics/domain/csv";

type AnalyticsOrdersTrendChartProps = {
  rows: AnalyticsCsvRow[];
  chartAria: string;
  locale: string;
};

export function AnalyticsOrdersTrendChart({
  rows,
  chartAria,
  locale,
}: AnalyticsOrdersTrendChartProps) {
  const width = 800;
  const height = 260;
  const padding = { top: 24, right: 28, bottom: 28, left: 44 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const maxOrders = Math.max(...rows.map((row) => row.orderCount), 1);

  const points = rows.map((row, index) => {
    const x =
      rows.length === 1
        ? padding.left + plotWidth / 2
        : padding.left + (index / (rows.length - 1)) * plotWidth;
    const y = padding.top + plotHeight - (row.orderCount / maxOrders) * plotHeight;
    return { x, y, row };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const areaPath = `${linePath} L ${last?.x ?? padding.left} ${
    padding.top + plotHeight
  } L ${first?.x ?? padding.left} ${padding.top + plotHeight} Z`;
  const yTicks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-64 w-full"
      role="img"
      aria-label={chartAria}
    >
      <defs>
        <linearGradient id="analyticsAreaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#6366f1" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="analyticsLineStroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      {yTicks.map((ratio) => {
        const y = padding.top + plotHeight * (1 - ratio);
        return (
          <g key={ratio}>
            <line
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#f1f5f9"
              strokeDasharray="4 4"
            />
            <text x={padding.left - 10} y={y + 4} textAnchor="end" className="fill-slate-500 text-[11px]">
              {Math.round(maxOrders * ratio)}
            </text>
          </g>
        );
      })}
      <path d={areaPath} fill="url(#analyticsAreaFill)" />
      <path
        d={linePath}
        fill="none"
        stroke="url(#analyticsLineStroke)"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((point) => (
        <g key={point.row.date}>
          <circle cx={point.x} cy={point.y} r="5" fill="#3b82f6" opacity="0.25" />
          <circle cx={point.x} cy={point.y} r="4" fill="white" stroke="#3b82f6" strokeWidth="3" />
          <text
            x={point.x}
            y={height - 6}
            textAnchor="middle"
            className="fill-slate-500 text-[11px]"
          >
            {formatAnalyticsShortDate(point.row.date, locale)}
          </text>
        </g>
      ))}
    </svg>
  );
}
