import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const weeklyTransactions = [
  { day: "Sen", amount: 45000 },
  { day: "Sel", amount: 0 },
  { day: "Rab", amount: 75000 },
  { day: "Kam", amount: 32000 },
  { day: "Jum", amount: 89000 },
  { day: "Sab", amount: 156000 },
  { day: "Min", amount: 67000 },
];

const ProfileCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-br from-orange-500 to-red-500 relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/25">
              <span className="font-bold text-xl text-white">AR</span>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">Ahmad Rizky</h2>
            <p className="text-sm text-white/80 mt-1">
              Pecinta dimsum sejati yang suka mencoba berbagai varian
            </p>
          </div>
        </div>

        <div className="absolute bottom-4 right-6">
          <p className="text-xs text-white/70">Member sejak Januari 2024</p>
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
          <span>Total minggu ini: Rp 464.000</span>
          <span>Rata-rata: Rp 66.285/hari</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
