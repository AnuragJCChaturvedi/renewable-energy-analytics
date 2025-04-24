// src/components/charts/PieChart.tsx
import React from "react";
import {
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { CardWrapper } from "./CardWrapper";

export interface SummaryData {
  source: string;
  kwh: number;
}

// Use the same palette
const PIE_COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

interface Props {
  data: SummaryData[];
}

export const PieChart: React.FC<Props> = ({ data }) => (
  <CardWrapper title="Total Share by Source">
    <ResponsiveContainer width="100%" height={300}>
      <RePieChart>
        <Pie
          data={data}
          dataKey="kwh"
          nameKey="source"
          outerRadius={100}
          innerRadius={60}
          label={(entry) => `${entry.source}: ${((entry.kwh / data.reduce((sum, d) => sum + d.kwh, 0)) * 100).toFixed(1)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${value.toLocaleString()} kWh`} />
        <Legend verticalAlign="bottom" height={36} />
      </RePieChart>
    </ResponsiveContainer>
  </CardWrapper>
);