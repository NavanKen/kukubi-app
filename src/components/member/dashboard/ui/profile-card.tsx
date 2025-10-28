"use client";

import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { IUserProfile } from "@/types/auth.type";
import { IOrders } from "@/types/orders.types";
import { useEffect, useState } from "react";

interface ProfileCardProps {
  profile: IUserProfile | null;
  orders: IOrders[];
}

const ProfileCard = ({ profile, orders }: ProfileCardProps) => {
  const [weeklyTransactions, setWeeklyTransactions] = useState<
    { day: string; amount: number }[]
  >([]);
  const [totalWeek, setTotalWeek] = useState(0);
  const [avgDaily, setAvgDaily] = useState(0);

  useEffect(() => {
    if (orders.length > 0) {
      calculateWeeklyData();
    }
  }, [orders]);

  const calculateWeeklyData = () => {
    const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const today = new Date();
    const weekData = days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return { day, amount: 0, date };
    });

    // Calculate amounts for each day
    orders.forEach((order) => {
      if (order.status === "completed" && order.created_at) {
        const orderDate = new Date(order.created_at);
        const dayIndex = weekData.findIndex(
          (d) =>
            d.date.toDateString() === orderDate.toDateString()
        );
        if (dayIndex !== -1) {
          weekData[dayIndex].amount += order.total_amount;
        }
      }
    });

    const total = weekData.reduce((sum, d) => sum + d.amount, 0);
    const avg = total / 7;

    setWeeklyTransactions(weekData.map(({ day, amount }) => ({ day, amount })));
    setTotalWeek(total);
    setAvgDaily(avg);
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-br from-orange-500 to-red-500 relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/25">
              <span className="font-bold text-xl text-white">
                {profile?.name
                  ? profile.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "U"}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">
              {profile?.name || "User"}
            </h2>
            <p className="text-sm text-white/80 mt-1">
              {profile?.bio || "Selamat datang di Kukubi"}
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 right-6">
          <p className="text-xs text-white/70">
            Member sejak{" "}
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString("id-ID", {
                  month: "long",
                  year: "numeric",
                })
              : ""}
          </p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Transaksi 7 Hari Terakhir
          </h3>
          <span className="text-sm text-gray-500">Dalam Rupiah</span>
        </div>

        <ChartContainer
          config={{
            amount: {
              label: "Jumlah Transaksi",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[200px] w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={weeklyTransactions}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ea580c" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => [
                      `Rp ${value.toLocaleString("id-ID")}`,
                      "Transaksi",
                    ]}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#ea580c"
                strokeWidth={2}
                fill="url(#colorAmount)"
                dot={{ fill: "#ea580c", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "#ea580c",
                  strokeWidth: 2,
                  fill: "#fff",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <span>Total minggu ini: Rp {totalWeek.toLocaleString("id-ID")}</span>
          <span>Rata-rata: Rp {Math.round(avgDaily).toLocaleString("id-ID")}/hari</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
