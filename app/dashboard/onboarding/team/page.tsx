"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function PricingAndFeesPage() {
  const [agreedToPricing, setAgreedToPricing] = useState(false)

  const transferFees = [
    { asset: "Domestic Deposits", fee: "FREE" },
    { asset: "Domestic Withdrawal", fee: "$20" },
    { asset: "International Deposit", fee: "FREE" },
    { asset: "International Withdrawal", fee: "$30" },
  ]

  const bookTransfers = [
    { type: "Standard Book Transfer", price: "FREE" },
    { type: "Priority Book Transfer", price: "$5" },
    { type: "Instant Book Transfer", price: "$10" },
  ]

  const conversionFees = [
    { pair: "USD to USDP", fee: "0.10%" },
    { pair: "USDP to USD", fee: "0.10%" },
    { pair: "USD to PYUSD", fee: "0.10%" },
    { pair: "PYUSD to USD", fee: "0.10%" },
  ]

  const monthlyFees = [
    { service: "Platform Access", fee: "FREE" },
    { service: "API Access", fee: "FREE" },
    { service: "Premium Support", fee: "$100" },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Pricing and Fees</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and agree to Paxos pricing and fees structure
        </p>
      </div>

      <div className="grid gap-6">
        {/* Transfer Fees Section */}
        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-base">I. Wire Transfer Fees</CardTitle>
            <CardDescription>Fees for deposits and withdrawals via wire transfer</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">Asset</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-right">Transfer Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transferFees.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.asset}</TableCell>
                    <TableCell className="text-right font-semibold">{item.fee}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Book Transfers Section */}
        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-base">II. Book Transfers</CardTitle>
            <CardDescription>Internal transfers between Paxos accounts</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">Transfer Type</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookTransfers.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.type}</TableCell>
                    <TableCell className="text-right font-semibold">{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Conversion Fees Section */}
        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-base">III. Conversion Fees</CardTitle>
            <CardDescription>Fees for converting between USD and stablecoins</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">Conversion Pair</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-right">Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {conversionFees.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.pair}</TableCell>
                    <TableCell className="text-right font-semibold">{item.fee}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Monthly Fees Section */}
        <Card>
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-base">IV. Monthly Service Fees</CardTitle>
            <CardDescription>Recurring monthly charges for platform services</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary">
                  <TableHead className="text-primary-foreground font-semibold">Service</TableHead>
                  <TableHead className="text-primary-foreground font-semibold text-right">Monthly Fee</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyFees.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.service}</TableCell>
                    <TableCell className="text-right font-semibold">{item.fee}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Agreement Section */}
        <Card>
          <CardContent className="flex items-start gap-3 p-6">
            <Checkbox
              id="pricing-agreement"
              checked={agreedToPricing}
              onCheckedChange={(checked) => setAgreedToPricing(checked === true)}
            />
            <div className="flex-1">
              <Label htmlFor="pricing-agreement" className="text-sm font-medium cursor-pointer">
                Opt into our Pricing & Fees
              </Label>
              <p className="text-sm text-muted-foreground mt-1">
                I have read and agree to Paxos pricing and fees. <span className="text-destructive">*</span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Button variant="outline">Back</Button>
          <Button variant="outline">Save for later</Button>
          <Button disabled={!agreedToPricing}>Continue</Button>
        </div>
      </div>
    </div>
  )
}
