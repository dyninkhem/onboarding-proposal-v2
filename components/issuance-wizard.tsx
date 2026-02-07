"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowLeft, Check, Copy, Upload, Loader2, ExternalLink, CircleDot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface IssuanceWizardProps {
  onClose: () => void
}

// Chain options
const CHAINS = [
  { id: "ethereum", name: "Ethereum", token: "ETH", icon: "/images/networks/ethereum.svg" },
  { id: "avalanche", name: "Avalanche", token: "AVAX", icon: "/images/crypto/eth.svg" },
  { id: "base", name: "Base", token: "ETH", icon: "/images/networks/base.svg" },
  { id: "optimism", name: "Optimism", token: "ETH", icon: "/images/crypto/eth.svg" },
  { id: "arbitrum", name: "Arbitrum", token: "ETH", icon: "/images/crypto/eth.svg" },
  { id: "polygon", name: "Polygon", token: "MATIC", icon: "/images/crypto/eth.svg" },
  { id: "solana", name: "Solana", token: "SOL", icon: "/images/networks/solana.svg" },
  { id: "stellar", name: "Stellar", token: "XLM", icon: "/images/crypto/eth.svg" },
  { id: "celo", name: "Celo", token: "CELO", icon: "/images/crypto/eth.svg" },
]

// Custodial wallet address (mock)
const CUSTODIAL_ADDRESS = "0xcdEA8B2c1e9F4a7d5b3E6f8C9D2A1B4E7F0C352A"

type Step = 1 | 2 | 3 | 4

function FormField({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        <Label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
      </div>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
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
    <Button variant="ghost" size="icon" className="size-8" onClick={handleCopy}>
      {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
    </Button>
  )
}

export function IssuanceWizard({ onClose }: IssuanceWizardProps) {
  const [step, setStep] = React.useState<Step>(1)

  // Step 1 fields
  const [ticker, setTicker] = React.useState("")
  const [name, setName] = React.useState("")
  const [logo, setLogo] = React.useState<File | null>(null)
  const [logoPreview, setLogoPreview] = React.useState<string | null>(null)
  const [mintAmount, setMintAmount] = React.useState("")
  const [chain, setChain] = React.useState("")
  const [destinationType, setDestinationType] = React.useState<"custodial" | "external">("custodial")
  const [externalAddress, setExternalAddress] = React.useState("")

  // Step 2 fields
  const [agreedToTerms, setAgreedToTerms] = React.useState(false)

  // Step 3 fields
  const [fundingMethod, setFundingMethod] = React.useState<"wallet" | "wire" | "balance">("wallet")
  const [fundsConfirmed, setFundsConfirmed] = React.useState(false)
  const [fundingStatus, setFundingStatus] = React.useState<"pending" | "ready">("pending")

  // Step 4 fields
  const [deploymentStatus, setDeploymentStatus] = React.useState<"deploying" | "minting" | "confirming" | "success">(
    "deploying",
  )

  // Validation
  const isValidTicker = /^[A-Z]{3,5}$/.test(ticker)
  const isValidName = name.length >= 3 && name.length <= 50
  const isValidAmount = Number(mintAmount.replace(/,/g, "")) >= 100000
  const chainSelected = chain !== ""
  const destinationValid =
    destinationType === "custodial" || (destinationType === "external" && externalAddress.length > 10)

  // Progressive disclosure
  const showSection2 = isValidTicker && isValidName
  const showSection3 = showSection2 && isValidAmount && chainSelected
  const canProceedStep1 = showSection3 && destinationValid

  // Format amount with commas
  const formatAmount = (value: string) => {
    const num = value.replace(/[^0-9]/g, "")
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintAmount(formatAmount(e.target.value))
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogo(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const selectedChain = CHAINS.find((c) => c.id === chain)
  const numericAmount = Number(mintAmount.replace(/,/g, "")) || 0
  const usdValue = numericAmount.toLocaleString("en-US", { style: "currency", currency: "USD" })
  const destinationAddress = destinationType === "custodial" ? CUSTODIAL_ADDRESS : externalAddress

  React.useEffect(() => {
    if (step === 3 && fundingStatus === "pending") {
      const timer = setTimeout(() => {
        setFundingStatus("ready")
        setFundsConfirmed(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [step, fundingStatus])

  // Simulate deployment
  React.useEffect(() => {
    if (step === 4 && deploymentStatus === "deploying") {
      const timer1 = setTimeout(() => setDeploymentStatus("minting"), 1000)
      const timer2 = setTimeout(() => setDeploymentStatus("confirming"), 2000)
      const timer3 = setTimeout(() => setDeploymentStatus("success"), 3000)
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [step, deploymentStatus])

  const handleNext = () => {
    if (step < 4) {
      setStep((s) => (s + 1) as Step)
    }
  }

  const handleBack = () => {
    if (step === 1) {
      onClose()
    } else {
      setStep((s) => (s - 1) as Step)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return canProceedStep1
      case 2:
        return agreedToTerms
      case 3:
        return fundsConfirmed
      case 4:
        return deploymentStatus === "success"
      default:
        return false
    }
  }

  const getTitle = () => {
    if (step === 1) return "Create Stablecoin"
    if (step === 2) return "Review & Confirm"
    if (step === 3) return "Fund Reserves"
    if (step === 4) return deploymentStatus === "success" ? "Issuance Complete" : "Deploying"
    return ""
  }

  const getStepIndicator = () => {
    if (step === 4 && deploymentStatus === "success") return ""
    return `Step ${step} of 4`
  }

  // Step 1: Create & Configure
  const renderStep1 = () => (
    <div className="space-y-6">
      {/* Live preview header */}
      <div className="flex items-center gap-4 pb-4 border-b border-border">
        <div className="relative size-16 rounded-full bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
          {logoPreview ? (
            <Image src={logoPreview || "/placeholder.svg"} alt="Logo preview" fill className="object-cover" />
          ) : (
            <span className="text-2xl font-bold text-muted-foreground">{ticker.slice(0, 2) || "?"}</span>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold">{name || "Your Stablecoin"}</h3>
          <p className="text-muted-foreground">{ticker || "TICKER"}</p>
        </div>
      </div>

      {/* Section 1: Always visible */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Ticker Symbol" required>
            <Input
              placeholder="USDC"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase().slice(0, 5))}
              className="uppercase bg-card"
            />
            {ticker && !isValidTicker && <p className="text-xs text-destructive">3-5 uppercase letters required</p>}
          </FormField>

          <FormField label="Name" required>
            <Input
              className="bg-card"
              placeholder="USD Coin"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 50))}
            />
          </FormField>
        </div>

        <FormField label="Logo" hint="PNG or JPG, max 1MB">
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
            <Upload className="size-6 text-muted-foreground mb-2" />
            <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
            <input type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogoUpload} />
          </label>
        </FormField>
      </div>

      {/* Section 2: Reveals when ticker + name valid */}
      <div
        className={cn(
          "space-y-4 transition-all duration-150",
          showSection2
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none h-0 overflow-hidden",
        )}
      >
        <div className="border-t border-border pt-6" />

        <FormField label="Mint Amount" required hint={numericAmount > 0 ? `≈ ${usdValue}` : "Minimum 100,000"}>
          <Input placeholder="1,000,000" value={mintAmount} onChange={handleAmountChange} />
          {mintAmount && !isValidAmount && <p className="text-xs text-destructive">Minimum mint amount is 100,000</p>}
        </FormField>

        <FormField label="Chain" required>
          <Select value={chain} onValueChange={setChain}>
            <SelectTrigger className="w-full bg-card">
              <SelectValue placeholder="Select chain" />
            </SelectTrigger>
            <SelectContent>
              {CHAINS.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  <div className="flex items-center gap-2">
                    <Image
                      src={c.icon || "/placeholder.svg"}
                      alt={c.name}
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span>{c.name}</span>
                    <Badge variant="outline" className="text-xs ml-2">
                      {c.token}
                    </Badge>
                    <span className="text-xs text-emerald-600 ml-auto">● Mainnet</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      {/* Section 3: Reveals when amount + chain valid */}
      <div
        className={cn(
          "space-y-4 transition-all duration-150",
          showSection3
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none h-0 overflow-hidden",
        )}
      >
        <div className="border-t border-border pt-6" />

        <FormField label="Destination Address" required>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2">
              {destinationType === "custodial" ? (
                <>
                  <span className="font-mono text-sm truncate">
                    {CUSTODIAL_ADDRESS.slice(0, 10)}...{CUSTODIAL_ADDRESS.slice(-4)}
                  </span>
                  <CopyButton value={CUSTODIAL_ADDRESS} />
                  <Badge variant="secondary">Custodial</Badge>
                </>
              ) : (
                <Input
                  placeholder="0x..."
                  value={externalAddress}
                  onChange={(e) => setExternalAddress(e.target.value)}
                  className="border-0 p-0 h-auto focus-visible:ring-0"
                />
              )}
            </div>
            <Select value={destinationType} onValueChange={(v) => setDestinationType(v as "custodial" | "external")}>
              <SelectTrigger className="w-[140px] bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="custodial">Custodial</SelectItem>
                <SelectItem value="external">External</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FormField>
      </div>
    </div>
  )

  // Step 2: Review & Confirm
  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Stablecoin Details */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Stablecoin Details</h4>
            <Button variant="link" size="sm" onClick={() => setStep(1)}>
              Edit
            </Button>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative size-12 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <Image src={logoPreview || "/placeholder.svg"} alt="Logo" fill className="object-cover" />
              ) : (
                <span className="font-bold text-muted-foreground">{ticker.slice(0, 2)}</span>
              )}
            </div>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-muted-foreground">{ticker}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deployment Details */}
      <Card className="border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold">Deployment Details</h4>
            <Button variant="link" size="sm" onClick={() => setStep(1)}>
              Edit
            </Button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Chain</span>
              <div className="flex items-center gap-2">
                {selectedChain && (
                  <Image
                    src={selectedChain.icon || "/placeholder.svg"}
                    alt={selectedChain.name}
                    width={16}
                    height={16}
                  />
                )}
                <span>{selectedChain?.name}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mint Amount</span>
              <span>
                {mintAmount} {ticker}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Destination</span>
              <span className="font-mono text-xs">
                {destinationAddress.slice(0, 10)}...{destinationAddress.slice(-4)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reserve Management */}
      <Card className="border-border bg-muted/50">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">Reserve Management</h4>
          <p className="text-sm text-muted-foreground mb-3">
            Your stablecoin will be 100% backed by cash, cash equivalents, and short-duration U.S. treasuries held in
            segregated accounts.
          </p>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-600" />
              Monthly attestation reports
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-600" />
              Treasury revenue sharing
            </li>
            <li className="flex items-center gap-2">
              <Check className="size-4 text-emerald-600" />
              Real-time redemption
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Terms */}
      <div className="flex items-start gap-3 p-4 rounded-lg border border-border">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
        />
        <label htmlFor="terms" className="text-sm cursor-pointer">
          I agree to the{" "}
          <a href="#" className="text-primary underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary underline">
            Reserve Agreement
          </a>
        </label>
      </div>
    </div>
  )

  // Step 3: Fund Reserves
  const renderStep3 = () => (
    <div className="space-y-6">
      <Card className="border-border">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-1">Required Funding</h4>
          <p className="text-2xl font-bold">{usdValue}</p>
          <p className="text-sm text-muted-foreground">
            to mint {mintAmount} {ticker}
          </p>
        </CardContent>
      </Card>

      <FormField label="Funding Method">
        <div className="space-y-2">
          {[
            { id: "wallet", label: "Wallet Transfer", desc: "Send from connected wallet" },
            { id: "wire", label: "Wire Transfer", desc: "Bank wire (1-2 business days)" },
            { id: "balance", label: "Existing Balance", desc: "Use available USD balance" },
          ].map((method) => (
            <label
              key={method.id}
              className={cn(
                "flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors",
                fundingMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent",
              )}
            >
              <input
                type="radio"
                name="fundingMethod"
                value={method.id}
                checked={fundingMethod === method.id}
                onChange={(e) => setFundingMethod(e.target.value as "wallet" | "wire" | "balance")}
                className="sr-only"
              />
              <div
                className={cn(
                  "size-4 rounded-full border-2",
                  fundingMethod === method.id ? "border-primary bg-primary" : "border-muted-foreground",
                )}
              >
                {fundingMethod === method.id && <div className="size-full rounded-full bg-primary" />}
              </div>
              <div>
                <p className="font-medium">{method.label}</p>
                <p className="text-sm text-muted-foreground">{method.desc}</p>
              </div>
            </label>
          ))}
        </div>
      </FormField>

      {/* Funding Status */}
      <Card className="border-border">
        <CardContent className="p-4">
          <h4 className="font-semibold mb-3">Funding Status</h4>
          <div className="flex items-center gap-3">
            {fundingStatus === "pending" && (
              <>
                <Loader2 className="size-5 text-muted-foreground animate-spin" />
                <div>
                  <p className="font-medium">Processing</p>
                  <p className="text-sm text-muted-foreground">Verifying funds...</p>
                </div>
              </>
            )}
            {fundingStatus === "ready" && (
              <>
                <div className="size-5 rounded-full bg-emerald-600 flex items-center justify-center">
                  <Check className="size-3 text-white" />
                </div>
                <div>
                  <p className="font-medium text-emerald-600">Ready</p>
                  <p className="text-sm text-muted-foreground">Funds confirmed</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Step 4: Deploying / Success
  const renderStep4 = () => {
    if (deploymentStatus === "success") {
      return (
        <div className="space-y-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="size-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <Check className="size-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">
                {mintAmount} {ticker} Issued
              </h3>
              <p className="text-muted-foreground">Your stablecoin is now live on {selectedChain?.name}</p>
            </div>
          </div>

          <Card className="border-border text-left">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Contract Address</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs">0x7a3B...9f2E</span>
                  <CopyButton value="0x7a3B4c5D6e7F8a9B0c1D2E3F4a5B6c7D8e9f2E" />
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction</span>
                <a href="#" className="flex items-center gap-1 text-primary text-xs">
                  View on Explorer <ExternalLink className="size-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-muted/50 text-left">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2">What&apos;s Next?</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Add liquidity on decentralized exchanges</li>
                <li>• Integrate with your payment systems</li>
                <li>• Monitor reserves in the dashboard</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Deploying state
    const steps = [
      { id: "deploying", label: "Deploying contract" },
      { id: "minting", label: "Minting tokens" },
      { id: "confirming", label: "Confirming transaction" },
    ]

    const currentIndex = steps.findIndex((s) => s.id === deploymentStatus)

    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="size-12 animate-spin text-primary" />
          <p className="text-lg font-medium">Deploying your stablecoin...</p>
        </div>

        <Card className="border-border">
          <CardContent className="p-4 space-y-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center gap-3">
                {index < currentIndex ? (
                  <Check className="size-5 text-emerald-600" />
                ) : index === currentIndex ? (
                  <Loader2 className="size-5 animate-spin text-primary" />
                ) : (
                  <CircleDot className="size-5 text-muted-foreground" />
                )}
                <span className={cn(index <= currentIndex ? "text-foreground" : "text-muted-foreground")}>
                  {s.label}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border px-6 py-4">
        <Button variant="ghost" size="icon" onClick={handleBack} className="shrink-0">
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{getTitle()}</h2>
          {getStepIndicator() && <p className="text-sm text-muted-foreground">{getStepIndicator()}</p>}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-xl">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}
        </div>
      </div>

      {/* Footer */}
      {!(step === 4 && deploymentStatus === "success") && (
        <div className="border-t border-border px-6 py-4">
          <div className="mx-auto flex max-w-xl gap-3">
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleBack}>
              {step === 1 ? "Cancel" : "Back"}
            </Button>
            <Button
              className="flex-1"
              disabled={!canProceed()}
              onClick={step === 4 && deploymentStatus === "success" ? onClose : handleNext}
            >
              {step === 2 ? "Confirm & Fund" : step === 3 ? "Deploy" : "Continue"}
            </Button>
          </div>
        </div>
      )}

      {/* Success footer */}
      {step === 4 && deploymentStatus === "success" && (
        <div className="border-t border-border px-6 py-4">
          <div className="mx-auto max-w-xl">
            <Button className="w-full" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
