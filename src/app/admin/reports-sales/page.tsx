"use client";

import { useCallback, useEffect, useState } from "react";
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
import supabase from "@/lib/supabase/client";

type TimeFilter = "7days" | "30days" | "3months";

interface FinancialPoint {
  date: string;
  pemasukan: number;
  pengeluaran: number;
}

interface FinancialOrder {
  total_amount: number;
  status: string;
  created_at: string | null;
}

interface FinancialExpense {
  amount: number;
  date: string | null;
}

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
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("7days");
  const [chartData, setChartData] = useState<FinancialPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFinancialData = useCallback(async (filter: TimeFilter) => {
    try {
      setIsLoading(true);
      setError(null);

      const days = filter === "7days" ? 7 : filter === "30days" ? 30 : 90;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - (days - 1));

      const startISO = startDate.toISOString();
      const startDateStr = startISO.split("T")[0];

      const [ordersRes, expensesRes] = await Promise.all([
        supabase
          .from("orders")
          .select("total_amount, status, created_at")
          .eq("status", "completed")
          .gte("created_at", startISO),
        supabase
          .from("expenses")
          .select("amount, date")
          .gte("date", startDateStr),
      ]);

      if (ordersRes.error) {
        throw new Error(ordersRes.error.message);
      }

      if (expensesRes.error) {
        throw new Error(expensesRes.error.message);
      }

      const buckets: Record<string, FinancialPoint> = {};

      for (let i = 0; i < days; i++) {
        const current = new Date(startDate);
        current.setDate(startDate.getDate() + i);
        const key = current.toISOString().split("T")[0];
        const label = current.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "2-digit",
        });

        buckets[key] = {
          date: label,
          pemasukan: 0,
          pengeluaran: 0,
        };
      }

      const orders: FinancialOrder[] = (ordersRes.data ?? []) as FinancialOrder[];
      const expenses: FinancialExpense[] = (expensesRes.data ?? []) as FinancialExpense[];

      orders.forEach((order) => {
        if (!order.created_at) return;
        const date = new Date(order.created_at);
        const key = date.toISOString().split("T")[0];
        const bucket = buckets[key];
        if (!bucket) return;

        const amount = Number(order.total_amount) || 0;
        bucket.pemasukan += amount;
      });

      expenses.forEach((exp) => {
        if (!exp.date) return;
        const key = exp.date as string;
        const bucket = buckets[key];
        if (!bucket) return;

        const amount = Number(exp.amount) || 0;
        bucket.pengeluaran += amount;
      });

      const result = Object.values(buckets);
      setChartData(result);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Gagal memuat laporan keuangan"
      );
      setChartData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFinancialData(timeFilter);
  }, [fetchFinancialData, timeFilter]);

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
          <h1 className="text-3xl font-bold text-foreground">Laporan Keuangan</h1>
          <Select
            value={timeFilter}
            onValueChange={(val) => setTimeFilter(val as TimeFilter)}
          >
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

        {isLoading && !error && (
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        )}

        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

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
                  data={chartData}
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
