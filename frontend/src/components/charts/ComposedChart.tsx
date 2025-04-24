import React from "react";
import {
  ResponsiveContainer,
  ComposedChart as ReComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { CardWrapper } from "./CardWrapper";

export interface ComposedData {
  month: string;
  total: number;
  highlight: number;
}

interface Props {
  data: ComposedData[];
  highlightLabel: string;
}

export const ComposedChart: React.FC<Props> = ({ data, highlightLabel }) => (
  <CardWrapper title={`Total vs. ${highlightLabel.charAt(0).toUpperCase() + highlightLabel.slice(1)}`}>
    <ResponsiveContainer width="100%" height={250}>
      <ReComposedChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip formatter={(value: number, name: string) => [`${value} kWh`, name]} />
        <Legend />
        <Bar dataKey="total" name="Total kWh" barSize={20} />
        <Line
          type="monotone"
          dataKey="highlight"
          name={highlightLabel}
          strokeWidth={3}
          dot={false}
        />
      </ReComposedChart>
    </ResponsiveContainer>
  </CardWrapper>
);
