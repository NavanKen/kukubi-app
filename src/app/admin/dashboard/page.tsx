"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Package, ShoppingCart, Store, DollarSign } from "lucide-react";

// Dummy data for different time periods
const generateData = (period: string) => {
  const baseProductData = [
    { name: "Dimsum Ayam", value: 150 },
    { name: "Dimsum Udang", value: 120 },
    { name: "Dimsum Kepiting", value: 90 },
    { name: "Dimsum Ikan", value: 75 },
    { name: "Dimsum Sayur", value: 60 },
  ];

  const baseOrderData = [
    { name: "Senin", online: 45, offline: 30 },
    { name: "Selasa", online: 52, offline: 28 },
    { name: "Rabu", online: 48, offline: 35 },
    { name: "Kamis", online: 61, offline: 42 },
    { name: "Jumat", online: 55, offline: 38 },
    { name: "Sabtu", online: 67, offline: 45 },
    { name: "Minggu", online: 58, offline: 40 },
  ];

  const multiplier = period === "7" ? 1 : period === "30" ? 4.2 : 12.5;

  return {
    productData: baseProductData.map((item) => ({
      ...item,
      value: Math.round(item.value * multiplier),
    })),
    orderData: baseOrderData.map((item) => ({
      ...item,
      online: Math.round(item.online * multiplier),
      offline: Math.round(item.offline * multiplier),
    })),
    kpiData: {
      totalProducts: Math.round(495 * multiplier),
      totalOnline: Math.round(386 * multiplier),
      totalOffline: Math.round(258 * multiplier),
      totalRevenue: Math.round(15750000 * multiplier),
    },
  };
};

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState("7");
  const data = generateData(timePeriod);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">7 Hari Terakhir</SelectItem>
              <SelectItem value="30">30 Hari Terakhir</SelectItem>
              <SelectItem value="90">3 Bulan Terakhir</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList>
            <TabsTrigger value="products">Produk Terlaris</TabsTrigger>
            <TabsTrigger value="orders">Order Paling Banyak</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Produk Terlaris</CardTitle>
                <CardDescription>
                  Data penjualan produk dimsum dalam{" "}
                  {timePeriod === "7"
                    ? "7 hari"
                    : timePeriod === "30"
                    ? "30 hari"
                    : "3 bulan"}{" "}
                  terakhir
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ChartContainer
                  config={{
                    value: {
                      label: "Jumlah Terjual",
                      color: "hsl(217.2 91.2% 59.8%)",
                    },
                  }}
                  className="h-[400px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.productData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="value"
                        fill="hsl(217.2 91.2% 59.8%)"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card className="overflow-hidden">
              <CardHeader>
                <CardTitle>Perbandingan Order Online vs Offline</CardTitle>
                <CardDescription>
                  Perbandingan jumlah order online dan offline dalam{" "}
                  {timePeriod === "7"
                    ? "7 hari"
                    : timePeriod === "30"
                    ? "30 hari"
                    : "3 bulan"}{" "}
                  terakhir
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ChartContainer
                  config={{
                    online: {
                      label: "Online",
                      color: "hsl(217.2 91.2% 59.8%)",
                    },
                    offline: {
                      label: "Offline",
                      color: "hsl(221.2 83.2% 53.3%)",
                    },
                  }}
                  className="h-[400px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.orderData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorOnline"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(217.2 91.2% 59.8%)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(217.2 91.2% 59.8%)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorOffline"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(221.2 83.2% 53.3%)"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(221.2 83.2% 53.3%)"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="online"
                        stackId="1"
                        stroke="hsl(217.2 91.2% 59.8%)"
                        fill="url(#colorOnline)"
                        name="Online"
                      />
                      <Area
                        type="monotone"
                        dataKey="offline"
                        stackId="1"
                        stroke="hsl(221.2 83.2% 53.3%)"
                        fill="url(#colorOffline)"
                        name="Offline"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Produk Terjual
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.kpiData.totalProducts.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground">
                Dalam{" "}
                {timePeriod === "7"
                  ? "7 hari"
                  : timePeriod === "30"
                  ? "30 hari"
                  : "3 bulan"}{" "}
                terakhir
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Order Online
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.kpiData.totalOnline.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground">
                Dalam{" "}
                {timePeriod === "7"
                  ? "7 hari"
                  : timePeriod === "30"
                  ? "30 hari"
                  : "3 bulan"}{" "}
                terakhir
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Order Offline
              </CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.kpiData.totalOffline.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground">
                Dalam{" "}
                {timePeriod === "7"
                  ? "7 hari"
                  : timePeriod === "30"
                  ? "30 hari"
                  : "3 bulan"}{" "}
                terakhir
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Pendapatan
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatCurrency(data.kpiData.totalRevenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                Dalam{" "}
                {timePeriod === "7"
                  ? "7 hari"
                  : timePeriod === "30"
                  ? "30 hari"
                  : "3 bulan"}{" "}
                terakhir
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
