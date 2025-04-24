// src/components/charts/TrendsChart.tsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Brush,
} from "recharts";
import { CardWrapper } from "./CardWrapper";

export interface TrendsData {
  month: string;
  [key: string]: string | number;
}

// Define a fixed color palette
const COLORS = [
  "#1f77b4", // blue
  "#ff7f0e", // orange
  "#2ca02c", // green
  "#d62728", // red
  "#9467bd", // purple
  "#8c564b", // brown
  "#e377c2", // pink
  "#7f7f7f", // gray
  "#bcbd22", // olive
  "#17becf", // cyan
];

interface Props {
  data: TrendsData[];
}

export const TrendsChart: React.FC<Props> = ({ data }) => {
  const sourceKeys = data.length > 0
    ? Object.keys(data[0]).filter((key) => key !== "month")
    : [];

  return (
    <CardWrapper title="Monthly Trends">
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => `${value} kWh`} />
          <Legend />
          {sourceKeys.map((src, idx) => (
            <Line
              key={src}
              type="monotone"
              dataKey={src}
              stroke={COLORS[idx % COLORS.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
          <Brush dataKey="month" height={20} />
        </LineChart>
      </ResponsiveContainer>
    </CardWrapper>
  );
};
