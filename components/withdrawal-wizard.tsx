"use client"

import * as React from "react"
import Image from "next/image"
import { ArrowLeft, Info, Copy, Check, ExternalLink, AlertTriangle, Plus, Flag, Globe, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import type { WithdrawalType } from "@/components/withdrawal-sheet"

interface WithdrawalWizardProps {
  type: WithdrawalType
  onBack: () => void
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

// Fiat withdrawal networks per spec
const fiatNetworks = [
  {
    id: "WIRE_ABA",
    label: "Domestic Wire (ABA)",
    sublabel: "US banks only",
    description: "Same-day or next business day settlement",
    icon: Flag,
    processingTime: "Same day if before 1:30pm EST",
  },
  {
    id: "WIRE_SWIFT",
    label: "International Wire (SWIFT)",
    sublabel: "Non-US banks",
    description: "2-5 business days settlement",
    icon: Globe,
    processingTime: "2-5 business days",
  },
  {
    id: "CUBIX",
    label: "CUBIX",
    sublabel: "Instant settlement",
    description: "For CUBIX-connected partners only",
    icon: Zap,
    processingTime: "Instant",
  },
]

// Crypto assets per spec
const cryptoAssets = [
  {
    id: "USDC",
    label: "USDC",
    networks: ["ETHEREUM", "SOLANA", "BASE", "POLYGON"],
    icon: "/images/crypto/usdc.svg",
  },
  {
    id: "USDG",
    label: "USDG",
    networks: ["ETHEREUM", "SOLANA", "BASE"],
    icon: "/images/crypto/usdg.svg",
  },
  {
    id: "PYUSD",
    label: "PYUSD",
    networks: ["ETHEREUM", "SOLANA", "STELLAR"],
    icon: "/images/crypto/pyusd.svg",
  },
  {
    id: "USDP",
    label: "USDP",
    networks: ["ETHEREUM"],
    icon: "/images/crypto/usdp.svg",
  },
  {
    id: "ETH",
    label: "Ethereum",
    networks: ["ETHEREUM"],
    icon: "/images/crypto/eth.svg",
  },
  {
    id: "SOL",
    label: "Solana",
    networks: ["SOLANA"],
    icon: "/images/crypto/sol.svg",
  },
]

const cryptoNetworks = [
  { id: "ETHEREUM", label: "Ethereum", icon: "/images/networks/ethereum.svg", requiresMemo: false },
  { id: "SOLANA", label: "Solana", icon: "/images/networks/solana.svg", requiresMemo: false },
  { id: "BASE", label: "Base", icon: "/images/networks/base.svg", requiresMemo: false },
  { id: "POLYGON", label: "Polygon", icon: "/images/crypto/eth.svg", requiresMemo: false },
  { id: "STELLAR", label: "Stellar", icon: "/images/crypto/sol.svg", requiresMemo: true },
]

const profiles = [
  {
    value: "treasury-ops",
    label: "Treasury Ops (XXXX-016af024)",
    balance: { USD: 50000, USDC: 25000, USDG: 10000, PYUSD: 5000, USDP: 7000, ETH: 2.5, SOL: 100 },
  },
  {
    value: "corporate-funding",
    label: "Corporate Funding (XXXX-9b3c11de)",
    balance: { USD: 30000, USDC: 15000, USDG: 8000, PYUSD: 3000, USDP: 5000, ETH: 1.2, SOL: 50 },
  },
  {
    value: "settlement-float",
    label: "Settlement Float (XXXX-4f8a2c79)",
    balance: { USD: 20000, USDC: 10000, USDG: 5000, PYUSD: 2000, USDP: 3000, ETH: 0.8, SOL: 25 },
  },
  {
    value: "revenue",
    label: "Revenue (XXXX-a1d7e503)",
    balance: { USD: 15000, USDC: 8000, USDG: 4000, PYUSD: 1500, USDP: 2500, ETH: 0.5, SOL: 10 },
  },
]

const bankAccounts = [
  {
    id: "chase",
    label: "Chase ****4521",
    bank: "Chase",
    method: "Wire (ABA)",
    status: "APPROVED",
    supportedNetworks: ["WIRE_ABA"],
  },
  {
    id: "bofa",
    label: "Bank of America ****8842",
    bank: "Bank of America",
    method: "Wire (ABA)",
    status: "APPROVED",
    supportedNetworks: ["WIRE_ABA"],
  },
  {
    id: "hsbc",
    label: "HSBC UK ****7799",
    bank: "HSBC UK",
    method: "Wire (SWIFT)",
    status: "APPROVED",
    supportedNetworks: ["WIRE_SWIFT"],
  },
  {
    id: "cubix-partner",
    label: "CUBIX Partner ****1122",
    bank: "CUBIX Network",
    method: "CUBIX",
    status: "APPROVED",
    supportedNetworks: ["CUBIX"],
  },
]

const savedWalletAddresses = [
  {
    id: "treasury-eth",
    label: "Treasury Hot Wallet",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD73",
    network: "ETHEREUM",
    verified: true,
  },
  {
    id: "ops-sol",
    label: "Operations Wallet",
    address: "7xKp9mNq2R5tLfV8sWzY3dNc6pQrJ4hKaB2C",
    network: "SOLANA",
    verified: true,
  },
]

const stablecoinConversionOptions = [
  { id: "none", label: "USD (No conversion needed)" },
  { id: "USDC", label: "Convert from USDC" },
  { id: "USDG", label: "Convert from USDG" },
  { id: "PYUSD", label: "Convert from PYUSD" },
  { id: "USDP", label: "Convert from USDP" },
]

type WizardStep = "form" | "review" | "success"

export function WithdrawalWizard({ type, onBack }: WithdrawalWizardProps) {
  const [step, setStep] = React.useState<WizardStep>("form")

  // Fiat withdrawal state
  const [fiatProfile, setFiatProfile] = React.useState("")
  const [fiatNetwork, setFiatNetwork] = React.useState("")
  const [fiatBankAccount, setFiatBankAccount] = React.useState("")
  const [fiatAmount, setFiatAmount] = React.useState("")
  const [fiatConversion, setFiatConversion] = React.useState("none")
  const [fiatRefId, setFiatRefId] = React.useState("")

  // Crypto withdrawal state
  const [cryptoProfile, setCryptoProfile] = React.useState("")
  const [cryptoAsset, setCryptoAsset] = React.useState("")
  const [cryptoNetwork, setCryptoNetwork] = React.useState("")
  const [destinationType, setDestinationType] = React.useState<"saved" | "manual">("manual")
  const [savedAddressId, setSavedAddressId] = React.useState("")
  const [manualAddress, setManualAddress] = React.useState("")
  const [memo, setMemo] = React.useState("")
  const [cryptoAmount, setCryptoAmount] = React.useState("")
  const [cryptoRefId, setCryptoRefId] = React.useState("")

  // Review state
  const [acknowledged, setAcknowledged] = React.useState(false)

  // Generated ID
  const [transactionId] = React.useState(() => `WTH-${Math.random().toString(36).substring(2, 10).toUpperCase()}`)

  const isWallet = type === "wallet"

  // Get available networks for selected crypto asset
  const availableCryptoNetworks = React.useMemo(() => {
    if (!cryptoAsset) return cryptoNetworks
    const assetData = cryptoAssets.find((a) => a.id === cryptoAsset)
    if (!assetData) return cryptoNetworks
    return cryptoNetworks.filter((n) => assetData.networks.includes(n.id))
  }, [cryptoAsset])

  // Get available bank accounts for selected fiat network
  const availableBankAccounts = React.useMemo(() => {
    if (!fiatNetwork) return bankAccounts.filter((b) => b.status === "APPROVED")
    return bankAccounts.filter((b) => b.status === "APPROVED" && b.supportedNetworks.includes(fiatNetwork))
  }, [fiatNetwork])

  // Get available saved addresses for selected network
  const availableSavedAddresses = React.useMemo(() => {
    if (!cryptoNetwork) return savedWalletAddresses
    return savedWalletAddresses.filter((a) => a.network === cryptoNetwork)
  }, [cryptoNetwork])

  // Check if memo is required
  const requiresMemo = React.useMemo(() => {
    const network = cryptoNetworks.find((n) => n.id === cryptoNetwork)
    return network?.requiresMemo || false
  }, [cryptoNetwork])

  // Reset dependent fields when parent changes
  React.useEffect(() => {
    if (cryptoAsset && cryptoNetwork) {
      const assetData = cryptoAssets.find((a) => a.id === cryptoAsset)
      if (assetData && !assetData.networks.includes(cryptoNetwork)) {
        setCryptoNetwork("")
      }
    }
  }, [cryptoAsset, cryptoNetwork])

  React.useEffect(() => {
    if (fiatNetwork && fiatBankAccount) {
      const account = bankAccounts.find((b) => b.id === fiatBankAccount)
      if (account && !account.supportedNetworks.includes(fiatNetwork)) {
        setFiatBankAccount("")
      }
    }
  }, [fiatNetwork, fiatBankAccount])

  // Balance helpers
  const getAvailableBalance = (profileId: string, assetId: string) => {
    const profile = profiles.find((p) => p.value === profileId)
    if (!profile) return 0
    return profile.balance[assetId as keyof typeof profile.balance] || 0
  }

  // Validation
  const isFiatFormValid = fiatProfile && fiatNetwork && fiatBankAccount && fiatAmount
  const isCryptoFormValid =
    cryptoProfile &&
    cryptoAsset &&
    cryptoNetwork &&
    (destinationType === "saved" ? savedAddressId : manualAddress) &&
    cryptoAmount &&
    (!requiresMemo || memo)

  // Fiat Form
  if (!isWallet && step === "form") {
    const selectedBank = bankAccounts.find((b) => b.id === fiatBankAccount)
    const selectedNetwork = fiatNetworks.find((n) => n.id === fiatNetwork)

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
          <h2 className="text-2xl font-semibold text-foreground">USD Withdrawal</h2>
          <p className="mt-2 text-muted-foreground">
            Withdraw USD to your linked bank account. Choose your transfer method and destination.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Source Profile */}
          <FormField
            label="Source Profile"
            tooltip="Select the profile to withdraw from. You'll see the available USD balance."
            required
          >
            <Select value={fiatProfile} onValueChange={setFiatProfile}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select source profile" />
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

          {/* Source Asset - for stablecoin auto-convert */}
          {fiatProfile && (
            <FormField
              label="Source Asset"
              tooltip="Choose USD to withdraw directly, or select a stablecoin to auto-convert before sending."
            >
              <Select value={fiatConversion} onValueChange={setFiatConversion}>
                <SelectTrigger className="w-full bg-card">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {stablecoinConversionOptions.map((opt) => (
                    <SelectItem key={opt.id} value={opt.id}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fiatConversion !== "none" && (
                <p className="text-xs text-muted-foreground">
                  Your {fiatConversion} will be converted to USD before sending.
                </p>
              )}
            </FormField>
          )}

          {/* Transfer Method - Radio Cards */}
          {fiatProfile && (
            <FormField
              label="Transfer Method"
              tooltip="Choose how you want to send funds. This determines which bank accounts are available."
              required
            >
              <RadioGroup value={fiatNetwork} onValueChange={setFiatNetwork} className="flex flex-col gap-3">
                {fiatNetworks.map((network) => (
                  <Label
                    key={network.id}
                    htmlFor={`fiat-${network.id}`}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
                      fiatNetwork === network.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent",
                    )}
                  >
                    <RadioGroupItem value={network.id} id={`fiat-${network.id}`} className="mt-1" />
                    <div className="flex flex-1 items-start gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                        <network.icon className="size-5 text-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{network.label}</span>
                          <span className="text-xs text-muted-foreground">({network.sublabel})</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{network.description}</p>
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </FormField>
          )}

          {/* Destination Bank Account */}
          {fiatNetwork && (
            <FormField
              label="Destination Account"
              tooltip="Select a linked bank account to receive the funds. Only accounts compatible with your selected method are shown."
              required
            >
              <Select value={fiatBankAccount} onValueChange={setFiatBankAccount}>
                <SelectTrigger className="w-full bg-card">
                  <SelectValue placeholder="Select bank account">
                    {selectedBank && (
                      <div className="flex items-center gap-2">
                        <span>{selectedBank.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {availableBankAccounts.length > 0 ? (
                    availableBankAccounts.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        <div className="flex items-center gap-2">
                          <span>{b.label}</span>
                          <span className="text-xs text-muted-foreground">({b.method})</span>
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground">
                      No accounts available for this transfer method
                    </div>
                  )}
                </SelectContent>
              </Select>
              <Button variant="link" className="h-auto w-fit gap-1 p-0 text-sm text-primary">
                <Plus className="size-3" />
                Add new bank account
              </Button>
            </FormField>
          )}

          {/* Amount */}
          {fiatBankAccount && (
            <FormField
              label="Amount"
              tooltip="Enter the amount to withdraw. The full amount will be sent to your bank (no withdrawal fees)."
              required
            >
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={fiatAmount}
                  onChange={(e) => setFiatAmount(e.target.value)}
                  className="bg-card pl-7 pr-16"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 h-6 -translate-y-1/2 px-2 text-xs text-primary"
                  onClick={() => {
                    const balance =
                      fiatConversion === "none"
                        ? getAvailableBalance(fiatProfile, "USD")
                        : getAvailableBalance(fiatProfile, fiatConversion)
                    setFiatAmount(balance.toString())
                  }}
                >
                  Max
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Available:{" "}
                {(fiatConversion === "none"
                  ? getAvailableBalance(fiatProfile, "USD")
                  : getAvailableBalance(fiatProfile, fiatConversion)
                ).toLocaleString()}{" "}
                {fiatConversion === "none" ? "USD" : fiatConversion}
              </p>
            </FormField>
          )}

          {/* Reference ID */}
          {fiatAmount && (
            <FormField
              label="Reference ID (Optional)"
              tooltip="Add a reference for your records. This may also appear on your bank statement."
            >
              <Input
                placeholder="e.g., vendor-payment-001"
                value={fiatRefId}
                onChange={(e) => setFiatRefId(e.target.value)}
                className="bg-card"
                maxLength={100}
              />
            </FormField>
          )}

          {/* Processing time notice */}
          {selectedNetwork && (
            <div className="flex items-start gap-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" />
              <span>
                <strong>Processing time:</strong> {selectedNetwork.processingTime}
              </span>
            </div>
          )}

          <Button className="mt-4 w-full" size="lg" disabled={!isFiatFormValid} onClick={() => setStep("review")}>
            Review Withdrawal →
          </Button>
        </div>
      </div>
    )
  }

  // Crypto Form
  if (isWallet && step === "form") {
    const selectedAsset = cryptoAssets.find((a) => a.id === cryptoAsset)
    const selectedNetwork = cryptoNetworks.find((n) => n.id === cryptoNetwork)

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
          <h2 className="text-2xl font-semibold text-foreground">Crypto Withdrawal</h2>
          <p className="mt-2 text-muted-foreground">
            Send crypto to an external wallet. Double-check the address and network before sending.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {/* Source Profile */}
          <FormField
            label="Source Profile"
            tooltip="Select the profile to withdraw from. You'll see available balances for each asset."
            required
          >
            <Select value={cryptoProfile} onValueChange={setCryptoProfile}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select source profile" />
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

          {/* Asset */}
          {cryptoProfile && (
            <FormField
              label="Asset"
              tooltip="Select the cryptocurrency or stablecoin to withdraw. Available balance shown."
              required
            >
              <Select value={cryptoAsset} onValueChange={setCryptoAsset}>
                <SelectTrigger className="w-full bg-card">
                  <SelectValue placeholder="Select asset">
                    {selectedAsset && (
                      <div className="flex items-center gap-2">
                        <Image
                          src={selectedAsset.icon || "/placeholder.svg"}
                          alt={selectedAsset.label}
                          width={20}
                          height={20}
                          className="size-5"
                        />
                        <span>
                          {selectedAsset.label} — Available:{" "}
                          {getAvailableBalance(cryptoProfile, selectedAsset.id).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {cryptoAssets.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={a.icon || "/placeholder.svg"}
                          alt={a.label}
                          width={20}
                          height={20}
                          className="size-5"
                        />
                        <span>
                          {a.label} — Available: {getAvailableBalance(cryptoProfile, a.id).toLocaleString()}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          )}

          {/* Network */}
          {cryptoAsset && (
            <FormField
              label="Network"
              tooltip="Select the blockchain network. Make sure your destination wallet supports this network."
              required
            >
              <RadioGroup value={cryptoNetwork} onValueChange={setCryptoNetwork} className="flex flex-col gap-3">
                {availableCryptoNetworks.map((network) => (
                  <Label
                    key={network.id}
                    htmlFor={`network-${network.id}`}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors",
                      cryptoNetwork === network.id ? "border-primary bg-primary/5" : "border-border hover:bg-accent",
                    )}
                  >
                    <RadioGroupItem value={network.id} id={`network-${network.id}`} />
                    <Image
                      src={network.icon || "/placeholder.svg"}
                      alt={network.label}
                      width={24}
                      height={24}
                      className="size-6"
                    />
                    <div className="flex-1">
                      <span className="font-medium">{network.label}</span>
                      {network.requiresMemo && <span className="ml-2 text-xs text-amber-600">(Memo required)</span>}
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </FormField>
          )}

          {/* Destination Type Toggle */}
          {cryptoNetwork && (
            <FormField
              label="Destination"
              tooltip="Choose a saved address for faster withdrawals, or enter a new address manually."
              required
            >
              <div className="flex gap-2 mb-3">
                <Button
                  variant={destinationType === "saved" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDestinationType("saved")}
                  disabled={availableSavedAddresses.length === 0}
                >
                  Saved Address
                </Button>
                <Button
                  variant={destinationType === "manual" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDestinationType("manual")}
                >
                  Manual Entry
                </Button>
              </div>

              {destinationType === "saved" ? (
                <Select value={savedAddressId} onValueChange={setSavedAddressId}>
                  <SelectTrigger className="w-full bg-card">
                    <SelectValue placeholder="Select saved address" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSavedAddresses.length > 0 ? (
                      availableSavedAddresses.map((addr) => (
                        <SelectItem key={addr.id} value={addr.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{addr.label}</span>
                            <span className="font-mono text-xs text-muted-foreground truncate max-w-[250px]">
                              {addr.address}
                            </span>
                          </div>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-muted-foreground">No saved addresses for this network</div>
                    )}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  placeholder="Enter wallet address"
                  value={manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="bg-card font-mono"
                />
              )}
            </FormField>
          )}

          {/* Memo / Tag for Stellar */}
          {requiresMemo && (
            <FormField
              label="Memo / Tag"
              tooltip="Required for Stellar network. The recipient may provide this to identify your deposit."
              required
            >
              <Input
                placeholder="Enter memo or tag"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="bg-card"
              />
            </FormField>
          )}

          {/* Amount */}
          {(destinationType === "saved" ? savedAddressId : manualAddress) && (!requiresMemo || memo) && (
            <FormField
              label="Amount"
              tooltip="Enter the amount to send. Network fees will be deducted from your balance separately."
              required
            >
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.00"
                  value={cryptoAmount}
                  onChange={(e) => setCryptoAmount(e.target.value)}
                  className="bg-card pr-16"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 h-6 -translate-y-1/2 px-2 text-xs text-primary"
                  onClick={() => setCryptoAmount(getAvailableBalance(cryptoProfile, cryptoAsset).toString())}
                >
                  Max
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Available: {getAvailableBalance(cryptoProfile, cryptoAsset).toLocaleString()} {cryptoAsset}
              </p>
            </FormField>
          )}

          {/* Reference ID */}
          {cryptoAmount && (
            <FormField
              label="Reference ID (Optional)"
              tooltip="Add an internal reference for your records. This is not sent on-chain."
            >
              <Input
                placeholder="e.g., treasury-sweep-001"
                value={cryptoRefId}
                onChange={(e) => setCryptoRefId(e.target.value)}
                className="bg-card"
                maxLength={100}
              />
            </FormField>
          )}

          {/* Network warning */}
          {cryptoNetwork && manualAddress && (
            <div className="flex items-start gap-2 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>
                <strong>Warning:</strong> Ensure the destination address supports{" "}
                <strong>{selectedAsset?.label}</strong> on <strong>{selectedNetwork?.label}</strong>. Sending to an
                incompatible address will result in <strong>permanent loss of funds</strong>.
              </span>
            </div>
          )}

          <Button className="mt-4 w-full" size="lg" disabled={!isCryptoFormValid} onClick={() => setStep("review")}>
            Review Withdrawal →
          </Button>
        </div>
      </div>
    )
  }

  // Review Step
  if (step === "review") {
    const getReviewContent = () => {
      if (isWallet) {
        const asset = cryptoAssets.find((a) => a.id === cryptoAsset)
        const network = cryptoNetworks.find((n) => n.id === cryptoNetwork)
        const profile = profiles.find((p) => p.value === cryptoProfile)
        const address =
          destinationType === "saved"
            ? savedWalletAddresses.find((a) => a.id === savedAddressId)?.address
            : manualAddress

        return {
          title: "Review Crypto Withdrawal",
          subtitle: "Please verify all details carefully. This transaction cannot be reversed.",
          rows: [
            { label: "From Profile", value: profile?.label || "" },
            { label: "Asset", value: `${cryptoAmount} ${cryptoAsset}`, highlight: true },
            { label: "Network", value: network?.label || "" },
            { label: "To Address", value: address || "", monospace: true, truncate: true },
            ...(requiresMemo ? [{ label: "Memo", value: memo }] : []),
            { label: "Network Fee", value: "~$2.50 (estimated)" },
            ...(cryptoRefId ? [{ label: "Reference", value: cryptoRefId }] : []),
          ],
          buttonLabel: "Confirm & Send",
          warning: "Double-check the destination address. Crypto sent to the wrong address cannot be recovered.",
        }
      }

      // Fiat
      const bank = bankAccounts.find((b) => b.id === fiatBankAccount)
      const network = fiatNetworks.find((n) => n.id === fiatNetwork)
      const profile = profiles.find((p) => p.value === fiatProfile)

      return {
        title: "Review USD Withdrawal",
        subtitle: "Please verify all details before confirming.",
        rows: [
          { label: "From Profile", value: profile?.label || "" },
          ...(fiatConversion !== "none"
            ? [{ label: "Converting", value: `${fiatAmount} ${fiatConversion} → USD` }]
            : []),
          { label: "Amount", value: `$${Number(fiatAmount).toLocaleString()} USD`, highlight: true },
          { label: "Method", value: network?.label || "" },
          { label: "To Account", value: bank?.label || "" },
          { label: "Processing", value: network?.processingTime || "" },
          ...(fiatRefId ? [{ label: "Reference", value: fiatRefId }] : []),
        ],
        buttonLabel: "Confirm & Send",
      }
    }

    const content = getReviewContent()

    return (
      <div className="mx-auto max-w-xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setStep("form")}
          className="mb-4 -ml-2 gap-2 text-muted-foreground"
        >
          <ArrowLeft className="size-4" />
          Back
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>Step 2 of 2</span>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">{content.title}</h2>
          <p className="mt-2 text-muted-foreground">{content.subtitle}</p>
        </div>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Withdrawal Summary</h4>
            <div className="space-y-3">
              {content.rows.map((row, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{row.label}</span>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      row.highlight && "text-foreground",
                      row.monospace && "font-mono text-xs",
                      row.truncate && "max-w-[200px] truncate",
                    )}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Warning */}
        {content.warning && (
          <div className="mt-6 overflow-hidden rounded-lg border border-red-300 dark:border-red-800">
            <div className="flex items-center gap-2 bg-red-500 px-4 py-2 dark:bg-red-600">
              <AlertTriangle className="size-4 text-white" />
              <span className="text-sm font-medium text-white">Critical Warning</span>
            </div>
            <div className="bg-card p-4">
              <p className="text-sm text-foreground">{content.warning}</p>
            </div>
          </div>
        )}

        {/* Acknowledge */}
        <div className="mt-6 flex items-start gap-3">
          <Checkbox id="acknowledge" checked={acknowledged} onCheckedChange={(v) => setAcknowledged(v === true)} />
          <Label htmlFor="acknowledge" className="text-sm leading-relaxed text-muted-foreground">
            I confirm all details are correct and understand this withdrawal cannot be reversed.
          </Label>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent" size="lg" onClick={() => setStep("form")}>
            Back
          </Button>
          <Button className="flex-1" size="lg" disabled={!acknowledged} onClick={() => setStep("success")}>
            {content.buttonLabel}
          </Button>
        </div>
      </div>
    )
  }

  // Success Step
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground">Withdrawal Submitted</h2>
        <p className="mt-2 text-muted-foreground">
          Your {isWallet ? "crypto" : "USD"} withdrawal has been submitted and is being processed.
        </p>
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
              <span className="text-sm font-medium text-amber-600">PENDING</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated Arrival</span>
              <span className="text-sm font-medium">
                {isWallet
                  ? "5-30 minutes"
                  : fiatNetwork === "CUBIX"
                    ? "Instant"
                    : fiatNetwork === "WIRE_ABA"
                      ? "Same day"
                      : "2-5 business days"}
              </span>
            </div>
            {isWallet && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Transaction Hash</span>
                <span className="text-sm text-muted-foreground italic">Pending broadcast...</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex gap-3">
        {isWallet && (
          <Button variant="outline" className="flex-1 gap-2 bg-transparent" size="lg">
            <ExternalLink className="size-4" />
            View on Explorer
          </Button>
        )}
        <Button className="flex-1" size="lg" onClick={onBack}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}
