"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { type ChartDataPoint } from "../../types";
import { type PieLabelRenderProps } from "recharts";

const COLORS = [
  "hsl(173, 58%, 39%)", // chart-2 (Good score)
  "hsl(215, 28%, 18%)", // A neutral dark color for the remainder
];

// FIX 1: Move the custom component function outside of the main component.
// This prevents it from being redefined on every render.
const CustomPieLabel = ({ name, percent, x, y }: PieLabelRenderProps) => {
  if (name === 'Remaining' || !percent || percent === 0) {
    return null;
  }
  const percentage = (percent * 100).toFixed(0);
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      dominantBaseline="central"
      fill="white"
      fontSize="24"
      fontWeight="bold"
    >
      {`${percentage}%`}
    </text>
  );
};

export default function ScoreChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            innerRadius={70}
            fill="#8884d8"
            dataKey="value"
            // FIX 2: Pass the function itself, not a JSX instance.
            label={CustomPieLabel}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                stroke={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value} points`, "Score"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}