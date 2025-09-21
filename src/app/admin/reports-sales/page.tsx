"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card } from "@/components/ui/card";

// Data dummy untuk berbagai periode
const data7Days = [
  { date: "Sen", pemasukan: 2400, pengeluaran: 1800 },
  { date: "Sel", pemasukan: 1398, pengeluaran: 2200 },
  { date: "Rab", pemasukan: 9800, pengeluaran: 1500 },
  { date: "Kam", pemasukan: 3908, pengeluaran: 2800 },
  { date: "Jum", pemasukan: 4800, pengeluaran: 1900 },
  { date: "Sab", pemasukan: 3800, pengeluaran: 2400 },
  { date: "Min", pemasukan: 4300, pengeluaran: 2100 },
];

const data30Days = [
  { date: "Minggu 1", pemasukan: 24000, pengeluaran: 18000 },
  { date: "Minggu 2", pemasukan: 32000, pengeluaran: 22000 },
  { date: "Minggu 3", pemasukan: 28000, pengeluaran: 19000 },
  { date: "Minggu 4", pemasukan: 35000, pengeluaran: 25000 },
];

const data3Months = [
  { date: "Bulan 1", pemasukan: 120000, pengeluaran: 85000 },
  { date: "Bulan 2", pemasukan: 135000, pengeluaran: 92000 },
  { date: "Bulan 3", pemasukan: 148000, pengeluaran: 98000 },
];

const chartConfig = {
  pemasukan: {
    label: "Pemasukan",
    color: "#3b82f6",
  },
  pengeluaran: {
    label: "Pengeluaran",
    color: "#1e40af",
  },
};

export default function FinancialDashboard() {
  const [timeFilter, setTimeFilter] = useState("7days");

  const getDataByFilter = () => {
    switch (timeFilter) {
      case "7days":
        return data7Days;
      case "30days":
        return data30Days;
      case "3months":
        return data3Months;
      default:
        return data7Days;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header dan Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-foreground">
            Laporan Keuangan
          </h1>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Hari Terakhir</SelectItem>
              <SelectItem value="30days">30 Hari Terakhir</SelectItem>
              <SelectItem value="3months">3 Bulan Terakhir</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chart Container */}
        <Card>
          <div className="w-full">
            <div className="mx-7 mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Grafik Pemasukan vs Pengeluaran
              </h2>
              <p className="text-sm text-muted-foreground">
                Perbandingan pemasukan dan pengeluaran untuk periode{" "}
                {timeFilter === "7days" && "7 hari terakhir"}
                {timeFilter === "30days" && "30 hari terakhir"}
                {timeFilter === "3months" && "3 bulan terakhir"}
              </p>
            </div>
            <ChartContainer config={chartConfig} className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getDataByFilter()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    className="text-muted-foreground"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => [
                          formatCurrency(value as number),
                          name === "pemasukan" ? "Pemasukan" : "Pengeluaran",
                        ]}
                      />
                    }
                  />
                  <Bar
                    dataKey="pemasukan"
                    fill="var(--color-pemasukan)"
                    radius={[4, 4, 0, 0]}
                    name="Pemasukan"
                  />
                  <Bar
                    dataKey="pengeluaran"
                    fill="var(--color-pengeluaran)"
                    radius={[4, 4, 0, 0]}
                    name="Pengeluaran"
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
