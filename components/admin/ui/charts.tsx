"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const GOLD = "#a9812e";
const GOLD_LIGHT = "#c9a227";
const INK = "#241c12";
const MUTED = "#8c8270";
const BORDER = "#d8c9a3";
const DONUT_COLORS = ["#a9812e", "#c9a227", "#8c8270", "#5c441c", "#d8c9a3"];

const tooltipStyle = {
  background: "#faf6ec",
  border: `1px solid ${BORDER}`,
  borderRadius: 0,
  fontSize: 13,
  color: INK,
};

export function SalesAreaChart({ data }: { data: { label: string; revenue: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={GOLD} stopOpacity={0.35} />
            <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={BORDER} vertical={false} />
        <XAxis dataKey="label" stroke={MUTED} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke={MUTED} fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey="revenue" stroke={GOLD} strokeWidth={2} fill="url(#salesFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function OrderStatusDonut({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85} paddingAngle={2}>
          {data.map((_, i) => (
            <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ fontSize: 12, color: MUTED }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function TopProductsBar({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
        <XAxis type="number" stroke={MUTED} fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="name"
          stroke={MUTED}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" fill={GOLD_LIGHT} radius={[0, 2, 2, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
