"use client";

import { useCallback, useEffect, useState } from "react";
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
import supabase from "@/lib/supabase/client";

type TimePeriod = "7" | "30" | "90";

interface ProductDataItem {
  name: string;
  value: number;
}

interface OrderChartItem {
  name: string;
  online: number;
  offline: number;
}

interface KpiData {
  totalProducts: number;
  totalOnline: number;
  totalOffline: number;
  totalRevenue: number;
}

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("7");
  const [productData, setProductData] = useState<ProductDataItem[]>([]);
  const [orderData, setOrderData] = useState<OrderChartItem[]>([]);
  const [kpiData, setKpiData] = useState<KpiData>({
    totalProducts: 0,
    totalOnline: 0,
    totalOffline: 0,
    totalRevenue: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (period: TimePeriod) => {
    try {
      setIsLoading(true);
      setError(null);

      const days = period === "7" ? 7 : period === "30" ? 30 : 90;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - (days - 1));

      const startISO = startDate.toISOString();

      const {
        data: orders,
        error: ordersError,
      } = await supabase
        .from("orders")
        .select("id, order_type, status, total_amount, created_at")
        .eq("status", "completed")
        .gte("created_at", startISO);

      if (ordersError) {
        throw new Error(ordersError.message);
      }

      const safeOrders = (orders ?? []) as any[];

      if (safeOrders.length === 0) {
        setProductData([]);
        setOrderData([]);
        setKpiData({
          totalProducts: 0,
          totalOnline: 0,
          totalOffline: 0,
          totalRevenue: 0,
        });
        return;
      }

      const orderIds = safeOrders
        .map((order) => Number(order.id))
        .filter((id) => !Number.isNaN(id));

      let items: any[] = [];

      if (orderIds.length > 0) {
        const {
          data: orderItems,
          error: orderItemsError,
        } = await supabase
          .from("order_items")
          .select(
            `
            quantity,
            product_id,
            order_id,
            products (
              name
            )
          `
          )
          .in("order_id", orderIds);

        if (orderItemsError) {
          throw new Error(orderItemsError.message);
        }

        items = (orderItems ?? []) as any[];
      }

      const productMap = new Map<string, number>();
      items.forEach((item) => {
        const name = item.products?.name || "Produk";
        const quantity = typeof item.quantity === "number" ? item.quantity : 0;
        productMap.set(name, (productMap.get(name) || 0) + quantity);
      });

      const productDataResult: ProductDataItem[] = Array.from(
        productMap.entries()
      )
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      type OrderBucket = {
        date: Date;
        online: number;
        offline: number;
      };

      const orderMap = new Map<string, OrderBucket>();

      safeOrders.forEach((order) => {
        if (!order.created_at) return;

        const date = new Date(order.created_at);
        const key = date.toISOString().split("T")[0];

        const bucket =
          orderMap.get(key) ||
          {
            date,
            online: 0,
            offline: 0,
          };

        if (order.order_type === "online") {
          bucket.online += 1;
        } else if (order.order_type === "offline") {
          bucket.offline += 1;
        }

        orderMap.set(key, bucket);
      });

      const orderDataResult: OrderChartItem[] = Array.from(orderMap.values())
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((item) => ({
          name: item.date.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "2-digit",
          }),
          online: item.online,
          offline: item.offline,
        }));

      let totalProducts = 0;
      items.forEach((item) => {
        if (typeof item.quantity === "number") {
          totalProducts += item.quantity;
        }
      });

      let totalOnline = 0;
      let totalOffline = 0;
      let totalRevenue = 0;

      safeOrders.forEach((order) => {
        if (order.order_type === "online") {
          totalOnline += 1;
        } else if (order.order_type === "offline") {
          totalOffline += 1;
        }

        if (typeof order.total_amount === "number") {
          totalRevenue += order.total_amount;
        }
      });

      setProductData(productDataResult);
      setOrderData(orderDataResult);
      setKpiData({
        totalProducts,
        totalOnline,
        totalOffline,
        totalRevenue,
      });
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Gagal memuat data dashboard"
      );
      setProductData([]);
      setOrderData([]);
      setKpiData({
        totalProducts: 0,
        totalOnline: 0,
        totalOffline: 0,
        totalRevenue: 0,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(timePeriod);
  }, [fetchDashboardData, timePeriod]);

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
          <Select
            value={timePeriod}
            onValueChange={(val) => setTimePeriod(val as TimePeriod)}
          >
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

        {isLoading && !error && (
          <p className="text-sm text-muted-foreground">Memuat data...</p>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}

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
                      data={productData}
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
                      data={orderData}
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
                {kpiData.totalProducts.toLocaleString("id-ID")}
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
                {kpiData.totalOnline.toLocaleString("id-ID")}
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
                {kpiData.totalOffline.toLocaleString("id-ID")}
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
                {formatCurrency(kpiData.totalRevenue)}
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
