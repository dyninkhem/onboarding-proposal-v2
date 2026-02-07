"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowLeft, Info, AlertTriangle, Copy, Check, MoreVertical, Flag, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent } from "@/components/ui/card"
import type { DepositType } from "@/components/deposit-sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DepositWizardProps {
  type: DepositType
  onBack: () => void
}

const fiatNetworks = [
  {
    id: "WIRE_ABA",
    label: "Domestic Wire (ABA)",
    sublabel: "US banks only",
    description: "Use ABA routing number for transfers from US financial institutions. Typically same-day settlement.",
    icon: Flag,
    processingTime: "Same day if before 1:30pm EST",
  },
  {
    id: "WIRE_SWIFT",
    label: "International Wire (SWIFT)",
    sublabel: "Non-US banks",
    description: "Use SWIFT code for transfers from international banks. May take 2-5 business days.",
    icon: Globe,
    processingTime: "2-5 business days",
  },
  {
    id: "CUBIX",
    label: "CUBIX",
    sublabel: "Fast settlement",
    description: "For transfers from CUBIX-connected partners. CUBIX transfers are processed 24/7.",
    icon: Zap,
    processingTime: "Fast",
  },
]

const cryptoNetworks = [
  { id: "ETHEREUM", label: "Ethereum", icon: "/images/networks/ethereum.svg", avgConfirmation: "~12 confirmations" },
  { id: "SOLANA", label: "Solana", icon: "/images/networks/solana.svg", avgConfirmation: "~32 confirmations" },
  { id: "BASE", label: "Base", icon: "/images/networks/base.svg", avgConfirmation: "~12 confirmations" },
  { id: "POLYGON", label: "Polygon", icon: "/images/networks/polygon.svg", avgConfirmation: "~128 confirmations" },
  { id: "STELLAR", label: "Stellar", icon: "/images/networks/stellar.svg", avgConfirmation: "~5 seconds" },
]

const depositAssets = [
  { id: "USDC", label: "USDC", icon: "/images/crypto/usdc.svg" },
  { id: "USDG", label: "USDG", icon: "/images/crypto/usdg.svg" },
  { id: "PYUSD", label: "PYUSD", icon: "/images/crypto/pyusd.svg" },
  { id: "USDP", label: "USDP", icon: "/images/crypto/usdp.svg" },
  { id: "ETH", label: "ETH", icon: "/images/crypto/eth.svg" },
  { id: "SOL", label: "SOL", icon: "/images/crypto/sol.svg" },
]

const profiles = [
  { value: "treasury", label: "Treasury Ops (XXXX-016af024)" },
  { value: "corporate", label: "Corporate Funding (XXXX-9b3c11de)" },
  { value: "settlement", label: "Settlement Float (XXXX-4f8a2c79)" },
  { value: "revenue", label: "Revenue (XXXX-a1d7e503)" },
]

const wireInstructions = {
  WIRE_ABA: {
    bankName: "Customers Bank",
    routingNumber: "031318536",
    accountNumber: "1234567890",
    accountName: "Paxos Trust Company, LLC",
    memoId: "REF-2024-ABC123",
  },
  WIRE_SWIFT: {
    bankName: "Customers Bank",
    swiftCode: "CUBIUS33",
    intermediaryBank: "Bank of New York Mellon",
    intermediarySwift: "IRVTUS3N",
    accountNumber: "1234567890",
    accountName: "Paxos Trust Company, LLC",
    memoId: "REF-2024-ABC123",
  },
  CUBIX: {
    cubixNetworkId: "PAXOS-CUBIX-001",
    memoId: "REF-2024-ABC123",
  },
}

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
          {required && <span className="text-destructive">*</span>}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="size-3.5 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
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
    <Button variant="ghost" size="icon" className="size-6" onClick={handleCopy}>
      {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3 text-muted-foreground" />}
    </Button>
  )
}

function CopyAddressButton({ address }: { address: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="outline" className="gap-2 bg-card" onClick={handleCopy}>
      {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
      {copied ? "Copied!" : "Copy Address"}
    </Button>
  )
}

export function DepositWizard({ type, onBack }: DepositWizardProps) {
  const isUsd = type === "usd"

  // Fiat deposit state
  const [fiatStep, setFiatStep] = React.useState<"form" | "instructions">("form")
  const [fiatProfile, setFiatProfile] = React.useState("")
  const [fiatNetwork, setFiatNetwork] = React.useState("")
  const [referenceId, setReferenceId] = React.useState("")

  // Crypto deposit state
  const [cryptoStep, setCryptoStep] = React.useState<"form" | "instructions">("form")
  const [asset, setAsset] = React.useState("")
  const [cryptoNetwork, setCryptoNetwork] = React.useState("")
  const [cryptoProfile, setCryptoProfile] = React.useState("")

  // Fiat Form Step
  if (isUsd && fiatStep === "form") {
    const canProceed = fiatProfile && fiatNetwork

    return (
      <div className="mx-auto max-w-xl">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 -ml-2 gap-2 text-muted-foreground">
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Step 1 of 2</span>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">USD Deposit Details</h2>
          <p className="mt-2 text-muted-foreground">
            Select your destination profile and transfer method to receive your USD deposit instructions.
          </p>
        </div>

        <div className="space-y-6">
          <FormField
            label="Destination profile"
            tooltip="The Paxos profile where your deposit will be credited."
            required
          >
            <Select value={fiatProfile} onValueChange={setFiatProfile}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select profile" />
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

          <FormField label="Transfer method" tooltip="Choose how you'll send the wire transfer." required>
            <Select value={fiatNetwork} onValueChange={setFiatNetwork}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select transfer method" />
              </SelectTrigger>
              <SelectContent>
                {fiatNetworks.map((network) => (
                  <SelectItem key={network.id} value={network.id}>
                    <div className="flex items-center gap-2">
                      <network.icon className="size-4" />
                      {network.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Reference ID (optional)" tooltip="An optional reference for your records.">
            <Input
              placeholder="e.g., INV-2024-001"
              value={referenceId}
              onChange={(e) => setReferenceId(e.target.value)}
              className="bg-card"
            />
          </FormField>
        </div>

        <Button className="mt-8 w-full" size="lg" disabled={!canProceed} onClick={() => setFiatStep("instructions")}>
          Get Deposit Instructions
        </Button>
      </div>
    )
  }

  // Fiat Instructions Step
  if (isUsd && fiatStep === "instructions") {
    const selectedNetwork = fiatNetworks.find((n) => n.id === fiatNetwork)
    const selectedProfile = profiles.find((p) => p.value === fiatProfile)
    const instructions = wireInstructions[fiatNetwork as keyof typeof wireInstructions]

    return (
      <div className="mx-auto max-w-xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFiatStep("form")}
          className="mb-4 -ml-2 gap-2 text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Step 2 of 2</span>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Wire Instructions</h2>
          <p className="mt-2 text-muted-foreground">
            Share these banking details with your sender. The Memo ID is required for proper attribution.
          </p>
        </div>

        <Card className="mb-6 border-border bg-card">
          <CardContent className="p-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Deposit Summary</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Destination</span>
                <span className="text-sm font-medium">{selectedProfile?.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Method</span>
                <span className="text-sm font-medium">{selectedNetwork?.label}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Paxos Bank Details</h4>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Bank Name</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Customers Bank</span>
                </div>
              </div>

              {fiatNetwork === "WIRE_ABA" && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">ABA Routing Number</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">
                      {(instructions as typeof wireInstructions.WIRE_ABA).routingNumber}
                    </span>
                    <CopyButton value={(instructions as typeof wireInstructions.WIRE_ABA).routingNumber} />
                  </div>
                </div>
              )}

              {fiatNetwork === "WIRE_SWIFT" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">SWIFT Code</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">
                        {(instructions as typeof wireInstructions.WIRE_SWIFT).swiftCode}
                      </span>
                      <CopyButton value={(instructions as typeof wireInstructions.WIRE_SWIFT).swiftCode} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Intermediary Bank</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {(instructions as typeof wireInstructions.WIRE_SWIFT).intermediaryBank}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Intermediary SWIFT</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">
                        {(instructions as typeof wireInstructions.WIRE_SWIFT).intermediarySwift}
                      </span>
                      <CopyButton value={(instructions as typeof wireInstructions.WIRE_SWIFT).intermediarySwift} />
                    </div>
                  </div>
                </>
              )}

              {fiatNetwork === "CUBIX" && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">CUBIX Network ID</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium">
                      {(instructions as typeof wireInstructions.CUBIX).cubixNetworkId}
                    </span>
                    <CopyButton value={(instructions as typeof wireInstructions.CUBIX).cubixNetworkId} />
                  </div>
                </div>
              )}

              {fiatNetwork !== "CUBIX" && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account Number</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">
                        {(instructions as typeof wireInstructions.WIRE_ABA).accountNumber}
                      </span>
                      <CopyButton value={(instructions as typeof wireInstructions.WIRE_ABA).accountNumber} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Account Name</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {(instructions as typeof wireInstructions.WIRE_ABA).accountName}
                      </span>
                      <CopyButton value={(instructions as typeof wireInstructions.WIRE_ABA).accountName} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Critical Memo Warning */}
        <div className="mt-6 overflow-hidden rounded-lg border border-amber-300 dark:border-amber-800">
          <div className="flex items-center gap-2 bg-amber-400 px-4 py-2 dark:bg-amber-600">
            <AlertTriangle className="size-4 text-amber-900 dark:text-amber-100" />
            <span className="text-sm font-medium text-amber-900 dark:text-amber-100">Required: Memo ID</span>
          </div>
          <div className="bg-card p-4">
            <p className="text-sm text-foreground">
              <strong>Important</strong>: The sender must include the Memo ID in the wire instructions. Deposits without
              the correct memo may be delayed or returned.
            </p>
            <div className="mt-4">
              <Label className="mb-2 block text-sm font-medium text-foreground">Memo ID</Label>
              <div className="flex items-center justify-between rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2">
                <span className="font-mono text-sm font-medium">{instructions.memoId}</span>
                <CopyButton value={instructions.memoId} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="flex-1" size="lg" onClick={onBack}>
            Done
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent gap-2" size="lg">
            <Copy className="size-4" />
            Download Instructions as PDF
          </Button>
        </div>
      </div>
    )
  }

  // Crypto Form Step
  if (!isUsd && cryptoStep === "form") {
    const selectedAsset = depositAssets.find((a) => a.id === asset)
    const canProceed = asset && cryptoNetwork && cryptoProfile

    return (
      <div className="mx-auto max-w-xl">
        <Button variant="ghost" size="sm" onClick={onBack} className="mb-4 -ml-2 gap-2 text-muted-foreground">
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Step 1 of 2</span>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Crypto Deposit Details</h2>
          <p className="mt-2 text-muted-foreground">
            Select your asset, network, and destination profile to receive your deposit address.
          </p>
        </div>

        <div className="space-y-6">
          <FormField label="Asset" tooltip="The cryptocurrency you want to deposit." required>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {depositAssets.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    <div className="flex items-center gap-2">
                      <Image src={a.icon || "/placeholder.svg"} alt="" width={20} height={20} className="size-5" />
                      {a.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Network" tooltip="The blockchain network for your deposit." required>
            <Select value={cryptoNetwork} onValueChange={setCryptoNetwork}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                {cryptoNetworks.map((network) => (
                  <SelectItem key={network.id} value={network.id}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={network.icon || "/placeholder.svg"}
                        alt=""
                        width={20}
                        height={20}
                        className="size-5"
                      />
                      {network.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField
            label="Destination profile"
            tooltip="The Paxos profile where your deposit will be credited."
            required
          >
            <Select value={cryptoProfile} onValueChange={setCryptoProfile}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select profile" />
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
        </div>

        <Button className="mt-8 w-full" size="lg" disabled={!canProceed} onClick={() => setCryptoStep("instructions")}>
          Get Deposit Address
        </Button>
      </div>
    )
  }

  // Crypto Instructions Step
  if (!isUsd && cryptoStep === "instructions") {
    const selectedAsset = depositAssets.find((a) => a.id === asset)
    const selectedNetwork = cryptoNetworks.find((n) => n.id === cryptoNetwork)
    const selectedProfile = profiles.find((p) => p.value === cryptoProfile)

    // Mock deposit address
    const depositAddress =
      cryptoNetwork === "SOLANA" ? "7xKp9mNq2R5tLfV8sWzY3dNc6pQrJ4hKaB2C" : "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD73"

    return (
      <div className="mx-auto max-w-xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCryptoStep("form")}
          className="mb-4 -ml-2 gap-2 text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Step 2 of 2</span>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">Deposit Address</h2>
          <p className="mt-2 text-muted-foreground">
            Send your {selectedAsset?.label} to this address on {selectedNetwork?.label}. Double-check the address and
            network before sending.
          </p>
        </div>

        <Card className="mb-6 border-border bg-card">
          <CardContent className="p-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Deposit Summary</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Asset</span>
                <div className="flex items-center gap-2">
                  <Image src={selectedAsset?.icon || ""} alt="" width={16} height={16} className="size-4" />
                  <span className="text-sm font-medium">{selectedAsset?.label}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Network</span>
                <span className="text-sm font-medium">{selectedNetwork?.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Profile</span>
                <span className="text-sm font-medium">{selectedProfile?.label}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Your Deposit Address</h4>
            <p className="text-sm text-muted-foreground mb-4">
              This address is unique to your profile and can be reused for future {selectedAsset?.label} deposits on{" "}
              {selectedNetwork?.label}.
            </p>

            {/* QR Code */}
            <div className="flex flex-col items-center py-6">
              <div className="size-44 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">QR Code</span>
              </div>

              <p className="mt-6 text-sm text-muted-foreground">{selectedNetwork?.label} deposit address</p>
              <p className="mt-2 text-center font-mono text-lg font-medium break-all px-4">{depositAddress}</p>

              <div className="mt-6 flex items-center gap-2">
                <CopyAddressButton address={depositAddress} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9 bg-card">
                      <MoreVertical className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(depositAddress)}>
                      Copy address
                    </DropdownMenuItem>
                    <DropdownMenuItem>Generate new address</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Critical Warning */}
        <div className="mt-6 overflow-hidden rounded-lg border border-red-300 dark:border-red-800">
          <div className="flex items-center gap-2 bg-red-500 px-4 py-2 dark:bg-red-600">
            <AlertTriangle className="size-4 text-white" />
            <span className="text-sm font-medium text-white">Before you send</span>
          </div>
          <div className="bg-card p-4">
            <ul className="text-sm text-foreground space-y-1">
              <li>
                • Only send <strong>{selectedAsset?.label}</strong> to this address
              </li>
              <li>
                • Only use the <strong>{selectedNetwork?.label}</strong> network
              </li>
              <li>• Verify the address matches exactly</li>
              <li>
                • Sending incorrect assets = <strong>permanent loss</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Confirmation time */}
        <div className="mt-4 flex items-start gap-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0" />
          <span>
            Your deposit will be credited after {selectedNetwork?.avgConfirmation} (typical network confirmation time).
          </span>
        </div>

        <div className="mt-6 flex gap-3">
          <Button className="flex-1" size="lg" onClick={onBack}>
            Done
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent gap-2" size="lg">
            <Copy className="size-4" />
            Copy Address
          </Button>
        </div>
      </div>
    )
  }

  return null
}
