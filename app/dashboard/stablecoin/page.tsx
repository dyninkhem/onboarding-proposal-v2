"use client"

import { useState } from "react"
import Image from "next/image"
import { Plus, Minus, ArrowLeftRight, Link2, Copy, ExternalLink, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from "recharts"
import { IssuanceSheet } from "@/components/issuance-sheet"

const chartColors = {
  purple: "#8b5cf6",
  blue: "#3b82f6",
  teal: "#14b8a6",
  cyan: "#06b6d4",
  positive: "#22c55e",
  negative: "#ef4444",
  grid: "#27272a",
  text: "#a1a1aa",
}

// Mock data
const supplyData = [
  { month: "Feb", circulation: 5200000, treasury: 1800000 },
  { month: "Mar", circulation: 5800000, treasury: 2100000 },
  { month: "Apr", circulation: 6400000, treasury: 2400000 },
  { month: "May", circulation: 7100000, treasury: 2800000 },
  { month: "Jun", circulation: 7800000, treasury: 3200000 },
  { month: "Jul", circulation: 8200000, treasury: 3500000 },
  { month: "Aug", circulation: 8900000, treasury: 3900000 },
  { month: "Sep", circulation: 9400000, treasury: 4200000 },
  { month: "Oct", circulation: 9800000, treasury: 4500000 },
  { month: "Nov", circulation: 10200000, treasury: 4800000 },
  { month: "Dec", circulation: 10500000, treasury: 5100000 },
  { month: "Jan", circulation: 10500000, treasury: 5200000 },
]

const reserveData = [
  { name: "Total in Circulation", value: 10500000, fill: chartColors.purple },
  { name: "Reserves", cash: 6300000, treasuries: 4725000 },
]

const activityData = [
  { day: "Jan 1", amount: 250000 },
  { day: "Jan 3", amount: -120000 },
  { day: "Jan 5", amount: 180000 },
  { day: "Jan 7", amount: 320000 },
  { day: "Jan 9", amount: -80000 },
  { day: "Jan 11", amount: 150000 },
  { day: "Jan 13", amount: -200000 },
  { day: "Jan 15", amount: 280000 },
  { day: "Jan 17", amount: 90000 },
  { day: "Jan 19", amount: -150000 },
  { day: "Jan 21", amount: 420000 },
  { day: "Jan 23", amount: -60000 },
  { day: "Jan 25", amount: 180000 },
  { day: "Jan 27", amount: 220000 },
  { day: "Jan 29", amount: -100000 },
]

const chainDistribution = [
  { chain: "Ethereum", amount: 5200000, percentage: 49, icon: "/images/networks/ethereum.svg" },
  { chain: "Solana", amount: 3100000, percentage: 30, icon: "/images/networks/solana.svg" },
  { chain: "Base", amount: 2200000, percentage: 21, icon: "/images/networks/base.svg" },
]

const revenueData = [
  { month: "Feb", earnings: 8200 },
  { month: "Mar", earnings: 9100 },
  { month: "Apr", earnings: 8800 },
  { month: "May", earnings: 10200 },
  { month: "Jun", earnings: 11500 },
  { month: "Jul", earnings: 10800 },
  { month: "Aug", earnings: 12100 },
  { month: "Sep", earnings: 11900 },
  { month: "Oct", earnings: 13200 },
  { month: "Nov", earnings: 12800 },
  { month: "Dec", earnings: 14100 },
  { month: "Jan", earnings: 12450 },
]

const attestationYears = [
  { year: "2024", months: ["Oct", "Nov", "Dec"] },
  { year: "2025", months: ["Jan"] },
]

function formatCurrency(value: number) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

function formatAmount(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toLocaleString()
}

// Metric Card Component
function MetricCard({
  label,
  value,
  ticker,
  change,
  previousValue,
}: {
  label: string
  value: string
  ticker: string
  change?: number
  previousValue?: string
}) {
  return (
    <Card className="py-0">
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="font-mono text-xl font-bold text-foreground">{value}</span>
          <span className="text-sm text-muted-foreground">{ticker}</span>
        </div>
        {(change !== undefined || previousValue) && (
          <div className="mt-0.5 flex items-center gap-1.5">
            {change !== undefined && (
              <span className={`flex items-center text-xs ${change >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                {change >= 0 ? <TrendingUp className="mr-0.5 size-3" /> : <TrendingDown className="mr-0.5 size-3" />}
                {change >= 0 ? "+" : ""}
                {change}%
              </span>
            )}
            {previousValue && <span className="text-xs text-muted-foreground">({previousValue})</span>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function StablecoinDashboard() {
  const [issuanceOpen, setIssuanceOpen] = useState(false)

  return (
    <div className="flex flex-1 flex-col gap-3 p-4 pt-0">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Stablecoin Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            Monitor your issued stablecoin metrics, reserves, and activity
          </p>
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 bg-transparent text-xs"
            onClick={() => setIssuanceOpen(true)}
          >
            <Plus className="size-3" />
            Mint
          </Button>
          <Button variant="outline" size="sm" className="h-7 gap-1.5 bg-transparent text-xs">
            <Minus className="size-3" />
            Burn
          </Button>
          <Button variant="outline" size="sm" className="h-7 gap-1.5 bg-transparent text-xs">
            <ArrowLeftRight className="size-3" />
            Swap
          </Button>
          <Button variant="outline" size="sm" className="h-7 gap-1.5 bg-transparent text-xs">
            <Link2 className="size-3" />
            Add Chain
          </Button>
        </div>
      </div>

      {/* Row 1: Key Metrics - more compact */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="Total Supply" value="10.5M" ticker="USDG" change={12} previousValue="9.4M" />
        <MetricCard label="Circulating Supply" value="10.5M" ticker="USDG" change={8} previousValue="9.7M" />
        <MetricCard label="Total Minted" value="45.2M" ticker="USDG" />
        <MetricCard label="Total Burned" value="34.7M" ticker="USDG" />
      </div>

      {/* Row 2: Supply, Reserves, Chain Distribution - combined row */}
      <div className="grid grid-cols-12 gap-3">
        {/* Supply Over Time */}
        <Card className="col-span-5 py-0">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Supply Over Time</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="mb-2 flex items-center justify-end gap-3 text-[10px]">
              <div className="flex items-center gap-1">
                <div className="size-1.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">Circulation</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-1.5 rounded-full bg-blue-500" />
                <span className="text-muted-foreground">Treasury</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={supplyData}>
                <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" horizontal vertical={false} />
                <XAxis dataKey="month" stroke={chartColors.text} fontSize={9} tickLine={false} axisLine={false} />
                <YAxis
                  stroke={chartColors.text}
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v / 1000000}M`}
                  width={35}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 6,
                    fontSize: 11,
                  }}
                  formatter={(value: number) => [formatCurrency(value), ""]}
                />
                <Line type="monotone" dataKey="circulation" stroke={chartColors.purple} strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="treasury" stroke={chartColors.blue} strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reserve Composition */}
        <Card className="col-span-4 py-0">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Reserve Composition</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="mb-2 flex items-center justify-end gap-2 text-[10px]">
              <div className="flex items-center gap-1">
                <div className="size-1.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">Circ.</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-1.5 rounded-full bg-teal-500" />
                <span className="text-muted-foreground">Cash</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-1.5 rounded-full bg-cyan-500" />
                <span className="text-muted-foreground">Treasuries</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart
                data={[
                  { name: "Circ.", value: 10500000 },
                  { name: "Reserves", cash: 6300000, treasuries: 4725000 },
                ]}
              >
                <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" horizontal vertical={false} />
                <XAxis dataKey="name" stroke={chartColors.text} fontSize={9} tickLine={false} axisLine={false} />
                <YAxis
                  stroke={chartColors.text}
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${v / 1000000}M`}
                  width={35}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 6,
                    fontSize: 11,
                  }}
                  formatter={(value: number) => [formatCurrency(value), ""]}
                />
                <Bar dataKey="value" fill={chartColors.purple} radius={[3, 3, 0, 0]} />
                <Bar dataKey="cash" stackId="reserves" fill={chartColors.teal} />
                <Bar dataKey="treasuries" stackId="reserves" fill={chartColors.cyan} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Chain Distribution - inline */}
        <Card className="col-span-3 py-0">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Chain Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            <div className="space-y-2.5">
              {chainDistribution.map((chain) => (
                <div key={chain.chain} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <Image
                        src={chain.icon || "/placeholder.svg"}
                        alt={chain.chain}
                        width={14}
                        height={14}
                        className="rounded-full"
                      />
                      <span className="text-foreground">{chain.chain}</span>
                    </div>
                    <span className="text-muted-foreground">{chain.percentage}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500"
                      style={{ width: `${chain.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Activity, Revenue, Attestations - combined */}
      <div className="grid grid-cols-12 gap-3">
        {/* Mint/Burn Activity */}
        <Card className="col-span-5 py-0">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Mint/Burn Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={activityData}>
                <CartesianGrid stroke={chartColors.grid} strokeDasharray="3 3" horizontal vertical={false} />
                <XAxis
                  dataKey="day"
                  stroke={chartColors.text}
                  fontSize={8}
                  tickLine={false}
                  axisLine={false}
                  interval={2}
                />
                <YAxis
                  stroke={chartColors.text}
                  fontSize={9}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => formatAmount(Math.abs(v))}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 6,
                    fontSize: 11,
                  }}
                  formatter={(value: number) => [
                    `${value >= 0 ? "+" : ""}${formatAmount(value)} USDG`,
                    value >= 0 ? "Mint" : "Burn",
                  ]}
                />
                <Bar dataKey="amount" radius={[2, 2, 2, 2]}>
                  {activityData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.amount >= 0 ? chartColors.positive : chartColors.negative}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Treasury Revenue - compact */}
        <Card className="col-span-4 py-0">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Treasury Revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div>
                <p className="text-[10px] text-muted-foreground">This Month</p>
                <p className="font-mono text-sm font-bold text-foreground">$12,450</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">YTD</p>
                <p className="font-mono text-sm font-semibold text-foreground">$89,230</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground">Projected</p>
                <p className="font-mono text-sm font-semibold text-foreground">$148K</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColors.purple} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColors.purple} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke={chartColors.purple}
                  strokeWidth={1.5}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Reports - compact */}
        <Card className="col-span-3 py-0">
          <CardHeader className="p-3 pb-0">
            <CardTitle className="text-xs font-medium text-muted-foreground">Reserve Reports</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-2">
            <p className="mb-2 text-[10px] text-muted-foreground leading-tight">
              Monthly reports from independent accounting firm verifying reserves.
            </p>
            <div className="space-y-1.5">
              {attestationYears.map((year) => (
                <div key={year.year} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-muted-foreground">{year.year}</span>
                  <div className="flex gap-1.5">
                    {year.months.map((month) => (
                      <Button
                        key={month}
                        variant="link"
                        className="h-auto p-0 text-xs text-teal-500 hover:text-teal-400"
                      >
                        {month}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Recent Activity - compact table */}
      <Card className="py-0">
        <CardHeader className="p-3 pb-0">
          <CardTitle className="text-xs font-medium text-muted-foreground">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-8 px-3 text-xs text-muted-foreground">Type</TableHead>
                <TableHead className="h-8 px-3 text-xs text-muted-foreground">Amount</TableHead>
                <TableHead className="h-8 px-3 text-xs text-muted-foreground">Chain</TableHead>
                <TableHead className="h-8 px-3 text-xs text-muted-foreground">Address</TableHead>
                <TableHead className="h-8 px-3 text-xs text-muted-foreground">Time</TableHead>
                <TableHead className="h-8 px-3 text-right text-xs text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityData.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="px-3 py-2">
                    <Badge
                      variant={activity.amount >= 0 ? "default" : "destructive"}
                      className="text-[10px] px-1.5 py-0"
                    >
                      {activity.amount >= 0 ? "Mint" : "Burn"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-3 py-2 font-mono text-xs">{formatAmount(activity.amount)} USDG</TableCell>
                  <TableCell className="px-3 py-2 text-xs">Ethereum</TableCell>
                  <TableCell className="px-3 py-2 font-mono text-xs text-muted-foreground">0xab12...cd34</TableCell>
                  <TableCell className="px-3 py-2 text-xs text-muted-foreground">2 hours ago</TableCell>
                  <TableCell className="px-3 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" className="size-6 p-0">
                        <Copy className="size-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="size-6 p-0">
                        <ExternalLink className="size-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <IssuanceSheet open={issuanceOpen} onOpenChange={setIssuanceOpen} />
    </div>
  )
}
