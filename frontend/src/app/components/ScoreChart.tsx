"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = [
  "hsl(12, 76%, 61%)",   // chart-1
  "hsl(173, 58%, 39%)",  // chart-2
  "hsl(197, 37%, 24%)",  // chart-3
  "hsl(43, 74%, 66%)",   // chart-4
  "hsl(27, 87%, 67%)",   // chart-5
];

export default function ScoreChart({ data }: { data: any[] }) {
  return (
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value} points`, "Score"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}