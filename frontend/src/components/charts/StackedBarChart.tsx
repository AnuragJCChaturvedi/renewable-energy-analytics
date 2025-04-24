// src/components/charts/StackedBarChart.tsx
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { CardWrapper } from "./CardWrapper";
import { TrendsData } from "./TrendsChart";

const COLORS = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

interface Props {
  data: TrendsData[];
}

export const StackedBarChart: React.FC<Props> = ({ data }) => {
  const sourceKeys = data.length > 0
    ? Object.keys(data[0]).filter((key) => key !== "month")
    : [];

  return (
    <CardWrapper title="Source Composition (Stacked)">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          {sourceKeys.map((src, idx) => (
            <Bar
              key={src}
              dataKey={src}
              stackId="a"
              fill={COLORS[idx % COLORS.length]}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </CardWrapper>
  );
};
