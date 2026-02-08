"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowLeft, Info, Check, Copy, Zap, ArrowUpRight, Building, Repeat, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { ConvertType } from "@/components/convert-sheet"

interface ConvertWizardProps {
  type: ConvertType
  onBack: () => void
  onClose: () => void
}

const stablecoins = [
  {
    id: "USDC",
    label: "USDC",
    fullName: "USD Coin",
    issuer: "Circle",
    description: "Most widely supported stablecoin. Available on Ethereum, Solana, Base, and Polygon.",
    icon: "/images/crypto/usdc.svg",
    paxosIssued: false,
  },
  {
    id: "USDG",
    label: "USDG",
    fullName: "Global Dollar",
    issuer: "Paxos",
    description:
      "MAS-compliant stablecoin optimized for payments and settlements. Available on Ethereum, Solana, and Base.",
    icon: "/images/crypto/usdg.svg",
    paxosIssued: true,
  },
  {
    id: "PYUSD",
    label: "PYUSD",
    fullName: "PayPal USD",
    issuer: "Paxos",
    description: "Designed for payments with PayPal ecosystem integration. Available on Ethereum, Solana, and Stellar.",
    icon: "/images/crypto/pyusd.svg",
    paxosIssued: true,
  },
  {
    id: "USDP",
    label: "USDP",
    fullName: "Pax Dollar",
    issuer: "Paxos",
    description: "NYDFS-regulated stablecoin with proven track record. Available on Ethereum.",
    icon: "/images/crypto/usdp.svg",
    paxosIssued: true,
  },
]

const profiles = [
  {
    value: "treasury-ops",
    label: "Treasury Ops (XXXX-016af024)",
    balance: { USD: 1250000, USDC: 500000, USDG: 750000, PYUSD: 250000, USDP: 100000 },
  },
  {
    value: "corporate-funding",
    label: "Corporate Funding (XXXX-9b3c11de)",
    balance: { USD: 5000000, USDC: 2000000, USDG: 0, PYUSD: 0, USDP: 0 },
  },
  {
    value: "settlement-float",
    label: "Settlement Float (XXXX-4f8a2c79)",
    balance: { USD: 100000, USDC: 50000, USDG: 25000, PYUSD: 0, USDP: 0 },
  },
  {
    value: "revenue",
    label: "Revenue (XXXX-a1d7e503)",
    balance: { USD: 15000, USDC: 8000, USDG: 4000, PYUSD: 1500, USDP: 2500 },
  },
]

function FormField({
  label,
  tooltip,
  required,
  children,
}: {
  label: string
  tooltip?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <Label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive"> *</span>}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="size-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {children}
    </div>
  )
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="ghost" size="icon" className="size-6 shrink-0" onClick={handleCopy}>
      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
    </Button>
  )
}

export function ConvertWizard({ type, onBack, onClose }: ConvertWizardProps) {
  const [step, setStep] = React.useState<"configure" | "review" | "success">("configure")

  // Mint state
  const [mintProfile, setMintProfile] = React.useState("")
  const [mintTargetAsset, setMintTargetAsset] = React.useState("")
  const [mintAmount, setMintAmount] = React.useState("")
  const [mintRefId, setMintRefId] = React.useState("")

  // Redeem state
  const [redeemProfile, setRedeemProfile] = React.useState("")
  const [redeemSourceAsset, setRedeemSourceAsset] = React.useState("")
  const [redeemAmount, setRedeemAmount] = React.useState("")
  const [redeemRefId, setRedeemRefId] = React.useState("")

  // Swap state
  const [swapProfile, setSwapProfile] = React.useState("")
  const [swapSourceAsset, setSwapSourceAsset] = React.useState("")
  const [swapTargetAsset, setSwapTargetAsset] = React.useState("")
  const [swapAmount, setSwapAmount] = React.useState("")
  const [swapRefId, setSwapRefId] = React.useState("")

  const [transactionId] = React.useState(() => `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`)

  // Helper functions
  const getBalance = (profileId: string, assetId: string) => {
    const profile = profiles.find((p) => p.value === profileId)
    if (!profile) return 0
    return profile.balance[assetId as keyof typeof profile.balance] || 0
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const getStablecoinBalances = (profileId: string) => {
    return stablecoins.filter((s) => getBalance(profileId, s.id) > 0)
  }

  // Validation
  const isMintValid =
    mintProfile &&
    mintTargetAsset &&
    mintAmount &&
    Number.parseFloat(mintAmount) > 0 &&
    Number.parseFloat(mintAmount) <= getBalance(mintProfile, "USD")
  const isRedeemValid =
    redeemProfile &&
    redeemSourceAsset &&
    redeemAmount &&
    Number.parseFloat(redeemAmount) > 0 &&
    Number.parseFloat(redeemAmount) <= getBalance(redeemProfile, redeemSourceAsset)
  const isSwapValid =
    swapProfile &&
    swapSourceAsset &&
    swapTargetAsset &&
    swapAmount &&
    swapSourceAsset !== swapTargetAsset &&
    Number.parseFloat(swapAmount) > 0 &&
    Number.parseFloat(swapAmount) <= getBalance(swapProfile, swapSourceAsset)

  const getTitle = () => {
    switch (type) {
      case "mint":
        return "Mint Stablecoin"
      case "redeem":
        return "Redeem Stablecoin"
      case "swap":
        return "Swap Stablecoins"
      default:
        return "Convert"
    }
  }

  const getSubtitle = () => {
    switch (type) {
      case "mint":
        return "Convert USD to a stablecoin of your choice. The conversion is instant and your new stablecoin balance will be available immediately."
      case "redeem":
        return "Convert stablecoin back to USD. Your stablecoin will be burned and an equivalent amount of USD credited to your balance."
      case "swap":
        return "Exchange one stablecoin for another. This is a two-step conversion (stablecoin → USD → stablecoin) that settles instantly as a single transaction."
      default:
        return ""
    }
  }

  // ============ MINT CONFIGURE ============
  if (type === "mint" && step === "configure") {
    const selectedProfile = profiles.find((p) => p.value === mintProfile)
    const usdBalance = selectedProfile ? selectedProfile.balance.USD : 0

    return (
      <div className="mx-auto max-w-xl">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 -ml-2 gap-2 text-muted-foreground">
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="text-sm text-muted-foreground mb-2">Step 1 of 2</div>
          <h2 className="text-2xl font-semibold text-foreground">{getTitle()}</h2>
          <p className="mt-2 text-muted-foreground">{getSubtitle()}</p>
        </div>

        <div className="flex flex-col gap-6">
          <FormField label="Profile" tooltip="Select the profile where this conversion will take place." required>
            <Select value={mintProfile} onValueChange={setMintProfile}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select a profile" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {mintProfile && (
            <FormField label="From" tooltip="Your USD balance will be debited for this conversion.">
              <div className="flex items-center justify-between rounded-md border border-border bg-muted/50 p-3">
                <div className="flex items-center gap-2">
                  <Image src="/images/flags/usd.svg" alt="USD" width={24} height={24} className="size-6" />
                  <span className="font-medium">USD</span>
                </div>
                <span className="text-sm text-muted-foreground">Available: ${formatCurrency(usdBalance)}</span>
              </div>
            </FormField>
          )}

          {mintProfile && (
            <FormField label="To" tooltip="Choose which stablecoin to mint." required>
              <RadioGroup value={mintTargetAsset} onValueChange={setMintTargetAsset} className="flex flex-col gap-3">
                {stablecoins.map((coin) => (
                  <Label
                    key={coin.id}
                    htmlFor={`mint-${coin.id}`}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors bg-white ${
                      mintTargetAsset === coin.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                    }`}
                  >
                    <RadioGroupItem value={coin.id} id={`mint-${coin.id}`} />
                    <Image
                      src={coin.icon || "/placeholder.svg"}
                      alt={coin.label}
                      width={32}
                      height={32}
                      className="size-8"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{coin.label}</span>
                        <span className="text-sm text-muted-foreground">
                          — {coin.fullName} by {coin.issuer}
                        </span>
                        {coin.paxosIssued && (
                          <Badge variant="outline" className="bg-background text-xs font-normal">
                            Paxos-issued
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </FormField>
          )}

          {mintTargetAsset && (
            <FormField
              label="Amount"
              tooltip="Enter the USD amount to convert. You'll receive the exact same amount in your chosen stablecoin."
              required
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  className="bg-card pl-7 pr-16"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 h-6 -translate-y-1/2 px-2 text-xs text-primary"
                  onClick={() => setMintAmount(usdBalance.toString())}
                >
                  Max
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Available: ${formatCurrency(usdBalance)} USD</p>
            </FormField>
          )}

          {mintAmount && Number.parseFloat(mintAmount) > 0 && (
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">You'll Receive</span>
                <span className="text-lg font-semibold">
                  {formatCurrency(Number.parseFloat(mintAmount))} {mintTargetAsset}
                </span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Exchange Rate</span>
                  <span>1 USD = 1 {mintTargetAsset}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee</span>
                  <span className="text-emerald-600">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Settlement</span>
                  <span>Instant</span>
                </div>
              </div>
            </div>
          )}

          <Button className="mt-4 w-full" size="lg" disabled={!isMintValid} onClick={() => setStep("review")}>
            Review Conversion →
          </Button>
        </div>
      </div>
    )
  }

  // ============ REDEEM CONFIGURE ============
  if (type === "redeem" && step === "configure") {
    const selectedProfile = profiles.find((p) => p.value === redeemProfile)
    const availableStablecoins = redeemProfile ? getStablecoinBalances(redeemProfile) : []
    const sourceBalance = redeemSourceAsset ? getBalance(redeemProfile, redeemSourceAsset) : 0

    return (
      <div className="mx-auto max-w-xl">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 -ml-2 gap-2 text-muted-foreground">
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="text-sm text-muted-foreground mb-2">Step 1 of 2</div>
          <h2 className="text-2xl font-semibold text-foreground">{getTitle()}</h2>
          <p className="mt-2 text-muted-foreground">{getSubtitle()}</p>
        </div>

        <div className="flex flex-col gap-6">
          <FormField label="Profile" tooltip="Select the profile where this conversion will take place." required>
            <Select
              value={redeemProfile}
              onValueChange={(v) => {
                setRedeemProfile(v)
                setRedeemSourceAsset("")
                setRedeemAmount("")
              }}
            >
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select a profile" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {redeemProfile && availableStablecoins.length === 0 && (
            <div className="rounded-md border border-dashed border-border p-6 text-center">
              <p className="text-sm font-medium text-foreground">No stablecoin balance</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You don't have any stablecoins in this profile. Mint or deposit stablecoins first.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 bg-transparent"
                onClick={() => {
                  onBack()
                }}
              >
                Mint Stablecoin
              </Button>
            </div>
          )}

          {redeemProfile && availableStablecoins.length > 0 && (
            <FormField label="From" tooltip="Select which stablecoin to redeem." required>
              <RadioGroup
                value={redeemSourceAsset}
                onValueChange={setRedeemSourceAsset}
                className="flex flex-col gap-3"
              >
                {availableStablecoins.map((coin) => (
                  <Label
                    key={coin.id}
                    htmlFor={`redeem-${coin.id}`}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                      redeemSourceAsset === coin.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                    }`}
                  >
                    <RadioGroupItem value={coin.id} id={`redeem-${coin.id}`} />
                    <Image
                      src={coin.icon || "/placeholder.svg"}
                      alt={coin.label}
                      width={32}
                      height={32}
                      className="size-8"
                    />
                    <div className="flex-1">
                      <span className="font-medium">{coin.label}</span>
                      <span className="ml-2 text-sm text-muted-foreground">— {coin.fullName}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Available: {formatCurrency(getBalance(redeemProfile, coin.id))}
                    </span>
                  </Label>
                ))}
              </RadioGroup>
            </FormField>
          )}

          {redeemSourceAsset && (
            <FormField label="To" tooltip="You'll receive USD credited to your balance.">
              <div className="flex items-center justify-between rounded-md border border-border bg-muted/50 p-3">
                <div className="flex items-center gap-2">
                  <Image src="/images/flags/usd.svg" alt="USD" width={24} height={24} className="size-6" />
                  <span className="font-medium">USD</span>
                </div>
              </div>
            </FormField>
          )}

          {redeemSourceAsset && (
            <FormField label="Amount" tooltip="Enter the stablecoin amount to redeem." required>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(e.target.value)}
                  className="bg-card pr-16"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 h-6 -translate-y-1/2 px-2 text-xs text-primary"
                  onClick={() => setRedeemAmount(sourceBalance.toString())}
                >
                  Max
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Available: {formatCurrency(sourceBalance)} {redeemSourceAsset}
              </p>
            </FormField>
          )}

          {redeemAmount && Number.parseFloat(redeemAmount) > 0 && (
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">You'll Receive</span>
                <span className="text-lg font-semibold">${formatCurrency(Number.parseFloat(redeemAmount))} USD</span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Exchange Rate</span>
                  <span>1 {redeemSourceAsset} = 1 USD</span>
                </div>
                <div className="flex justify-between">
                  <span>Fee</span>
                  <span className="text-emerald-600">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Settlement</span>
                  <span>Instant</span>
                </div>
              </div>
            </div>
          )}

          <Button className="mt-4 w-full" size="lg" disabled={!isRedeemValid} onClick={() => setStep("review")}>
            Review Conversion →
          </Button>
        </div>
      </div>
    )
  }

  // ============ SWAP CONFIGURE ============
  if (type === "swap" && step === "configure") {
    const availableStablecoins = swapProfile ? getStablecoinBalances(swapProfile) : []
    const sourceBalance = swapSourceAsset ? getBalance(swapProfile, swapSourceAsset) : 0
    const swapTargets = stablecoins.filter((s) => s.id !== swapSourceAsset)

    return (
      <div className="mx-auto max-w-xl">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 -ml-2 gap-2 text-muted-foreground">
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="text-sm text-muted-foreground mb-2">Step 1 of 2</div>
          <h2 className="text-2xl font-semibold text-foreground">{getTitle()}</h2>
          <p className="mt-2 text-muted-foreground">{getSubtitle()}</p>
        </div>

        <div className="flex flex-col gap-6">
          <FormField label="Profile" tooltip="Select the profile where this swap will take place." required>
            <Select
              value={swapProfile}
              onValueChange={(v) => {
                setSwapProfile(v)
                setSwapSourceAsset("")
                setSwapTargetAsset("")
                setSwapAmount("")
              }}
            >
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select a profile" />
              </SelectTrigger>
              <SelectContent>
                {profiles.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          {swapProfile && availableStablecoins.length === 0 && (
            <div className="rounded-md border border-dashed border-border p-6 text-center">
              <p className="text-sm font-medium text-foreground">No stablecoin balance</p>
              <p className="mt-1 text-xs text-muted-foreground">
                You don't have any stablecoins in this profile to swap.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 bg-transparent"
                onClick={() => {
                  onBack()
                }}
              >
                Mint Stablecoin
              </Button>
            </div>
          )}

          {swapProfile && availableStablecoins.length > 0 && (
            <FormField label="From" tooltip="Select which stablecoin you want to swap away." required>
              <RadioGroup
                value={swapSourceAsset}
                onValueChange={(v) => {
                  setSwapSourceAsset(v)
                  setSwapTargetAsset("")
                }}
                className="flex flex-col gap-3"
              >
                {availableStablecoins.map((coin) => (
                  <Label
                    key={coin.id}
                    htmlFor={`swap-from-${coin.id}`}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                      swapSourceAsset === coin.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                    }`}
                  >
                    <RadioGroupItem value={coin.id} id={`swap-from-${coin.id}`} />
                    <Image
                      src={coin.icon || "/placeholder.svg"}
                      alt={coin.label}
                      width={32}
                      height={32}
                      className="size-8"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{coin.label}</span>
                        <span className="text-sm text-muted-foreground">— {coin.fullName}</span>
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </FormField>
          )}

          {swapSourceAsset && (
            <FormField label="To" tooltip="Select which stablecoin you want to receive." required>
              <RadioGroup value={swapTargetAsset} onValueChange={setSwapTargetAsset} className="flex flex-col gap-3">
                {swapTargets.map((coin) => (
                  <Label
                    key={coin.id}
                    htmlFor={`swap-to-${coin.id}`}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                      swapTargetAsset === coin.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent"
                    }`}
                  >
                    <RadioGroupItem value={coin.id} id={`swap-to-${coin.id}`} />
                    <Image
                      src={coin.icon || "/placeholder.svg"}
                      alt={coin.label}
                      width={32}
                      height={32}
                      className="size-8"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{coin.label}</span>
                        <span className="text-sm text-muted-foreground">— {coin.fullName}</span>
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </FormField>
          )}

          {swapTargetAsset && (
            <FormField label="Amount" tooltip="Enter the amount to swap." required>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  className="bg-card pr-16"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 h-6 -translate-y-1/2 px-2 text-xs text-primary"
                  onClick={() => setSwapAmount(sourceBalance.toString())}
                >
                  Max
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Available: {formatCurrency(sourceBalance)} {swapSourceAsset}
              </p>
            </FormField>
          )}

          {swapAmount && Number.parseFloat(swapAmount) > 0 && swapTargetAsset && (
            <div className="rounded-md bg-muted p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">You'll Receive</span>
                <span className="text-lg font-semibold">
                  {formatCurrency(Number.parseFloat(swapAmount))} {swapTargetAsset}
                </span>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Exchange Rate</span>
                  <span>
                    1 {swapSourceAsset} = 1 {swapTargetAsset}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Fee</span>
                  <span className="text-emerald-600">$0.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Settlement</span>
                  <span>Instant</span>
                </div>
              </div>
            </div>
          )}

          <Button className="mt-4 w-full" size="lg" disabled={!isSwapValid} onClick={() => setStep("review")}>
            Review Swap →
          </Button>
        </div>
      </div>
    )
  }

  // ============ REVIEW STEP ============
  if (step === "review") {
    const getReviewContent = () => {
      if (type === "mint") {
        const profile = profiles.find((p) => p.value === mintProfile)
        const coin = stablecoins.find((s) => s.id === mintTargetAsset)
        return {
          title: "Review Mint",
          subtitle: "Please review your conversion details. Once confirmed, this conversion will settle instantly.",
          fromAsset: "USD",
          fromAmount: mintAmount,
          fromIcon: "/images/flags/usd.svg",
          toAsset: mintTargetAsset,
          toAmount: mintAmount,
          toIcon: coin?.icon || "",
          profile: profile?.label || "",
          buttonLabel: "Confirm Mint",
        }
      }
      if (type === "redeem") {
        const profile = profiles.find((p) => p.value === redeemProfile)
        const coin = stablecoins.find((s) => s.id === redeemSourceAsset)
        return {
          title: "Review Redemption",
          subtitle: "Please review your conversion details. Once confirmed, this conversion will settle instantly.",
          fromAsset: redeemSourceAsset,
          fromAmount: redeemAmount,
          fromIcon: coin?.icon || "",
          toAsset: "USD",
          toAmount: redeemAmount,
          toIcon: "/images/flags/usd.svg",
          profile: profile?.label || "",
          buttonLabel: "Confirm Redemption",
        }
      }
      // swap
      const profile = profiles.find((p) => p.value === swapProfile)
      const sourceCoin = stablecoins.find((s) => s.id === swapSourceAsset)
      const targetCoin = stablecoins.find((s) => s.id === swapTargetAsset)
      return {
        title: "Review Swap",
        subtitle: "Please review your swap details. This swap will settle instantly as a single atomic transaction.",
        fromAsset: swapSourceAsset,
        fromAmount: swapAmount,
        fromIcon: sourceCoin?.icon || "",
        toAsset: swapTargetAsset,
        toAmount: swapAmount,
        toIcon: targetCoin?.icon || "",
        profile: profile?.label || "",
        buttonLabel: "Confirm Swap",
      }
    }

    const content = getReviewContent()

    return (
      <div className="mx-auto max-w-xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep("configure")}
          className="mb-4 -ml-2 gap-2 text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="text-sm text-muted-foreground mb-2">Step 2 of 2</div>
          <h2 className="text-2xl font-semibold text-foreground">{content.title}</h2>
          <p className="mt-2 text-muted-foreground">{content.subtitle}</p>
        </div>

        {/* Conversion Visual */}
        <div className="mb-6 flex items-center justify-center gap-4 rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col items-center gap-2">
            <Image
              src={content.fromIcon || "/placeholder.svg"}
              alt={content.fromAsset}
              width={40}
              height={40}
              className="size-10"
            />
            <span className="text-lg font-semibold">{formatCurrency(Number.parseFloat(content.fromAmount))}</span>
            <span className="text-sm text-muted-foreground">{content.fromAsset}</span>
          </div>
          <div className="text-2xl text-muted-foreground">→</div>
          <div className="flex flex-col items-center gap-2">
            <Image
              src={content.toIcon || "/placeholder.svg"}
              alt={content.toAsset}
              width={40}
              height={40}
              className="size-10"
            />
            <span className="text-lg font-semibold">{formatCurrency(Number.parseFloat(content.toAmount))}</span>
            <span className="text-sm text-muted-foreground">{content.toAsset}</span>
          </div>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Conversion Details</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Profile</span>
                <span className="text-sm font-medium">{content.profile}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">You're Converting</span>
                <span className="text-sm font-medium">
                  {formatCurrency(Number.parseFloat(content.fromAmount))} {content.fromAsset}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">You'll Receive</span>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(Number.parseFloat(content.toAmount))} {content.toAsset}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Exchange Rate</span>
                <span className="text-sm font-medium">1:1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fee</span>
                <span className="text-sm font-medium text-emerald-600">Free</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-4 flex items-start gap-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
          <Zap className="mt-0.5 size-4 shrink-0" />
          <span>
            This conversion will settle instantly. Your {content.toAsset} balance will be available immediately.
          </span>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" size="lg" onClick={() => setStep("configure")}>
            Back
          </Button>
          <Button className="flex-1" size="lg" onClick={() => setStep("success")}>
            {content.buttonLabel}
          </Button>
        </div>
      </div>
    )
  }

  // ============ SUCCESS STEP ============
  const getSuccessContent = () => {
    if (type === "mint") {
      const coin = stablecoins.find((s) => s.id === mintTargetAsset)
      return {
        title: "Mint Successful",
        description: `You've minted ${formatCurrency(Number.parseFloat(mintAmount))} ${mintTargetAsset} from your USD balance.`,
        targetAsset: mintTargetAsset,
        targetIcon: coin?.icon || "",
      }
    }
    if (type === "redeem") {
      return {
        title: "Redemption Successful",
        description: `You've redeemed ${formatCurrency(Number.parseFloat(redeemAmount))} ${redeemSourceAsset} for $${formatCurrency(Number.parseFloat(redeemAmount))} USD.`,
        targetAsset: "USD",
        targetIcon: "/images/flags/usd.svg",
      }
    }
    const coin = stablecoins.find((s) => s.id === swapTargetAsset)
    return {
      title: "Swap Successful",
      description: `You've swapped ${formatCurrency(Number.parseFloat(swapAmount))} ${swapSourceAsset} for ${formatCurrency(Number.parseFloat(swapAmount))} ${swapTargetAsset}.`,
      targetAsset: swapTargetAsset,
      targetIcon: coin?.icon || "",
    }
  }

  const successContent = getSuccessContent()

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
          <CheckCircle className="size-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">{successContent.title}</h2>
        <p className="mt-2 text-muted-foreground">{successContent.description}</p>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <h4 className="mb-3 text-sm font-semibold text-foreground">Transaction Details</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Transaction ID</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium">{transactionId}</span>
                <CopyButton value={transactionId} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm font-medium text-emerald-600">Settled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Completed</span>
              <span className="text-sm font-medium" suppressHydrationWarning>{new Date().toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Next */}
      <div className="mt-6">
        <h4 className="mb-3 text-sm font-semibold text-foreground">What's Next?</h4>
        <div className="flex flex-col gap-2">
          {(type === "mint" || type === "swap") && (
            <Card className="cursor-pointer py-3 transition-colors hover:bg-accent">
              <CardContent className="flex items-center gap-3 px-4">
                <div className="flex size-8 items-center justify-center rounded-md border border-border bg-background">
                  <ArrowUpRight className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Withdraw {successContent.targetAsset}</p>
                  <p className="text-xs text-muted-foreground">Send to an external wallet</p>
                </div>
              </CardContent>
            </Card>
          )}
          {type === "redeem" && (
            <Card className="cursor-pointer py-3 transition-colors hover:bg-accent">
              <CardContent className="flex items-center gap-3 px-4">
                <div className="flex size-8 items-center justify-center rounded-md border border-border bg-background">
                  <Building className="size-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Withdraw USD</p>
                  <p className="text-xs text-muted-foreground">Send to your bank account</p>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="cursor-pointer py-3 transition-colors hover:bg-accent" onClick={onBack}>
            <CardContent className="flex items-center gap-3 px-4">
              <div className="flex size-8 items-center justify-center rounded-md border border-border bg-background">
                <Repeat className="size-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Another Conversion</p>
                <p className="text-xs text-muted-foreground">Mint, redeem, or swap</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Button className="mt-6 w-full" size="lg" onClick={onClose}>
        Back to Dashboard
      </Button>
    </div>
  )
}
