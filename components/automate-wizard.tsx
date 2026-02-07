"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { ArrowLeft, CheckCircle2, AlertTriangle } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// ============================================
// CONSTANTS (from spec)
// ============================================

const FIAT_NETWORKS = [
  { id: "WIRE_ABA", label: "Wire (ABA)", description: "US domestic wire" },
  { id: "WIRE_SWIFT", label: "Wire (SWIFT)", description: "International wire" },
  { id: "CUBIX", label: "CUBIX", description: "Paxos internal network" },
]

const STABLECOINS = [
  { id: "USDC", label: "USDC", icon: "/images/crypto/usdc.svg", networks: ["ETHEREUM", "SOLANA", "BASE", "POLYGON"] },
  { id: "USDG", label: "USDG", icon: "/images/crypto/usdg.svg", networks: ["ETHEREUM", "SOLANA", "BASE"] },
  { id: "PYUSD", label: "PYUSD", icon: "/images/crypto/pyusd.svg", networks: ["ETHEREUM", "SOLANA", "STELLAR"] },
  { id: "USDP", label: "USDP", icon: "/images/crypto/usdp.svg", networks: ["ETHEREUM"] },
]

const NETWORKS = [
  { id: "ETHEREUM", label: "Ethereum", icon: "/images/networks/ethereum.svg" },
  { id: "SOLANA", label: "Solana", icon: "/images/networks/solana.svg" },
  { id: "BASE", label: "Base", icon: "/images/networks/base.svg" },
  { id: "POLYGON", label: "Polygon", icon: "/images/networks/ethereum.svg" },
  { id: "STELLAR", label: "Stellar", icon: "/images/networks/ethereum.svg" },
]

const DESTINATION_TYPES = [
  { id: "wallet", label: "Wallet" },
  { id: "bank", label: "Bank" },
  { id: "profile", label: "Paxos Profile" },
]

// ============================================
// MOCK DATA (from spec)
// ============================================

const PROFILES = [
  { id: "profile_1", name: "Treasury Ops", account_id: "XXXX-016af024", is_primary: true },
  { id: "profile_2", name: "Corporate Funding", account_id: "XXXX-9b3c11de", is_primary: false },
  { id: "profile_3", name: "Settlement Float", account_id: "XXXX-4f8a2c79", is_primary: false },
  { id: "profile_4", name: "Revenue", account_id: "XXXX-a1d7e503", is_primary: false },
]

const SAVED_WALLETS = [
  { id: "wallet_1", name: "Treasury Wallet", address: "0x8B3D...4f2A", networks: ["ETHEREUM", "BASE", "POLYGON"] },
  { id: "wallet_2", name: "Cold Storage", address: "0x1F9A...8c3B", networks: ["ETHEREUM"] },
  { id: "wallet_3", name: "Solana Vault", address: "7xKp...9mNq", networks: ["SOLANA"] },
]

const SAVED_BANKS = [
  { id: "bank_1", name: "Chase", last_four: "4521", icon: "/images/icons/bank.svg" },
  { id: "bank_2", name: "Bank of America", last_four: "7832", icon: "/images/icons/bank.svg" },
]

// ============================================
// TYPES
// ============================================

type FlowType = "usd" | "crypto"
type Step = "step1" | "step2" | "step3" | "success"
type ActionType = "convert_hold" | "convert_transfer"
type DestinationType = "wallet" | "bank" | "profile"

interface AutomateWizardProps {
  triggerType: FlowType
  onBack: () => void
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getNetworksForAsset(assetId: string) {
  const stablecoin = STABLECOINS.find((s) => s.id === assetId)
  if (!stablecoin) return []
  return NETWORKS.filter((n) => stablecoin.networks.includes(n.id))
}

function getConversionOptions(sourceAsset: string | null) {
  // All stablecoins + USD, excluding source
  const options = [
    { id: "USD", label: "USD", icon: "/images/flags/usd.svg" },
    ...STABLECOINS.map((s) => ({ id: s.id, label: s.label, icon: s.icon })),
  ]
  return options.filter((o) => o.id !== sourceAsset)
}

// ============================================
// FORM FIELD COMPONENT
// ============================================

function FormField({
  label,
  helper,
  required,
  children,
}: {
  label: string
  helper?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label className="text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
      {helper && <p className="text-xs text-muted-foreground">{helper}</p>}
    </div>
  )
}

// ============================================
// MAIN COMPONENT
// ============================================

export function AutomateWizard({ triggerType, onBack }: AutomateWizardProps) {
  const isUsd = triggerType === "usd"

  // Step state
  const [step, setStep] = useState<Step>("step1")

  // Step 1: Source fields
  const [fiatNetwork, setFiatNetwork] = useState<string>("")
  const [sourceAsset, setSourceAsset] = useState<string>("")
  const [sourceNetwork, setSourceNetwork] = useState<string>("")
  const [profileId, setProfileId] = useState<string>("profile_1")

  // Step 2: Action fields
  const [actionType, setActionType] = useState<ActionType>("convert_hold")
  const [destinationAsset, setDestinationAsset] = useState<string>("USDC")
  const [destinationType, setDestinationType] = useState<DestinationType>("wallet")
  const [walletId, setWalletId] = useState<string>("")
  const [walletNetwork, setWalletNetwork] = useState<string>("")
  const [bankId, setBankId] = useState<string>("")
  const [destinationProfileId, setDestinationProfileId] = useState<string>("")

  // Step 3: Review fields
  const [nickname, setNickname] = useState<string>("")

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const availableSourceNetworks = useMemo(() => {
    return getNetworksForAsset(sourceAsset)
  }, [sourceAsset])

  const conversionOptions = useMemo(() => {
    return getConversionOptions(isUsd ? null : sourceAsset)
  }, [isUsd, sourceAsset])

  const availableWalletNetworks = useMemo(() => {
    if (destinationAsset === "USD") return []
    return getNetworksForAsset(destinationAsset)
  }, [destinationAsset])

  const otherProfiles = useMemo(() => {
    return PROFILES.filter((p) => p.id !== profileId)
  }, [profileId])

  // ============================================
  // VALIDATION
  // ============================================

  const isStep1Valid = useMemo(() => {
    if (isUsd) {
      return fiatNetwork !== "" && profileId !== ""
    }
    return sourceAsset !== "" && sourceNetwork !== "" && profileId !== ""
  }, [isUsd, fiatNetwork, sourceAsset, sourceNetwork, profileId])

  const isStep2Valid = useMemo(() => {
    if (actionType === "convert_hold") {
      return destinationAsset !== ""
    }
    // convert_transfer
    if (destinationType === "wallet") {
      return destinationAsset !== "" && walletId !== "" && walletNetwork !== ""
    }
    if (destinationType === "bank") {
      return bankId !== ""
    }
    if (destinationType === "profile") {
      return destinationAsset !== "" && destinationProfileId !== "" && destinationProfileId !== profileId
    }
    return false
  }, [actionType, destinationType, destinationAsset, walletId, walletNetwork, bankId, destinationProfileId, profileId])

  const isStep3Valid = useMemo(() => {
    return nickname.trim().length > 0
  }, [nickname])

  // ============================================
  // NAVIGATION
  // ============================================

  const handleBack = () => {
    if (step === "step1") {
      onBack()
    } else if (step === "step2") {
      setStep("step1")
    } else if (step === "step3") {
      setStep("step2")
    }
  }

  const handleContinue = () => {
    if (step === "step1" && isStep1Valid) {
      setStep("step2")
    } else if (step === "step2" && isStep2Valid) {
      setStep("step3")
    } else if (step === "step3" && isStep3Valid) {
      setStep("success")
    }
  }

  // Reset dependent fields when source asset changes
  const handleSourceAssetChange = (value: string) => {
    setSourceAsset(value)
    setSourceNetwork("")
  }

  // Reset wallet network when destination asset changes
  const handleDestinationAssetChange = (value: string) => {
    setDestinationAsset(value)
    setWalletNetwork("")
  }

  // Auto-set destination asset to USD when bank is selected
  const handleDestinationTypeChange = (value: DestinationType) => {
    setDestinationType(value)
    if (value === "bank") {
      setDestinationAsset("USD")
    }
  }

  // ============================================
  // TITLE & SUBTITLE
  // ============================================

  const getTitle = () => {
    const prefix = isUsd ? "USD Deposit" : "Crypto Deposit"
    if (step === "step1") return `${prefix} — Source`
    if (step === "step2") return `${prefix} — Action`
    if (step === "step3") return `${prefix} — Review`
    if (step === "success") return "Rule Created"
    return ""
  }

  const getStepIndicator = () => {
    if (step === "step1") return "Step 1 of 3"
    if (step === "step2") return "Step 2 of 3"
    if (step === "step3") return "Step 3 of 3"
    return ""
  }

  // ============================================
  // SUMMARY TEXT
  // ============================================

  const getSourceSummary = () => {
    const profile = PROFILES.find((p) => p.id === profileId)
    if (isUsd) {
      const network = FIAT_NETWORKS.find((n) => n.id === fiatNetwork)
      return `USD via ${network?.label || fiatNetwork} to ${profile?.name || ""}`
    }
    const asset = STABLECOINS.find((s) => s.id === sourceAsset)
    const network = NETWORKS.find((n) => n.id === sourceNetwork)
    return `${asset?.label || sourceAsset} on ${network?.label || sourceNetwork} to ${profile?.name || ""}`
  }

  const getActionSummary = () => {
    if (actionType === "convert_hold") {
      return `Convert to ${destinationAsset} and hold`
    }
    // convert_transfer
    if (destinationType === "wallet") {
      const wallet = SAVED_WALLETS.find((w) => w.id === walletId)
      const network = NETWORKS.find((n) => n.id === walletNetwork)
      return `Convert to ${destinationAsset} and send to ${wallet?.name || ""} on ${network?.label || walletNetwork}`
    }
    if (destinationType === "bank") {
      const bank = SAVED_BANKS.find((b) => b.id === bankId)
      return `Convert to USD and withdraw to ${bank?.name || ""} ****${bank?.last_four || ""}`
    }
    if (destinationType === "profile") {
      const destProfile = PROFILES.find((p) => p.id === destinationProfileId)
      return `Convert to ${destinationAsset} and transfer to ${destProfile?.name || ""}`
    }
    return ""
  }

  // ============================================
  // RENDER: STEP 1 - SOURCE
  // ============================================

  const renderStep1 = () => (
    <div className="flex flex-col gap-6">
      {isUsd ? (
        <>
          <FormField label="Fiat Network" helper="How the sender will transfer USD to Paxos" required>
            <Select value={fiatNetwork} onValueChange={setFiatNetwork}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                {FIAT_NETWORKS.map((network) => (
                  <SelectItem key={network.id} value={network.id}>
                    {network.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </>
      ) : (
        <>
          <FormField label="Asset" helper="The stablecoin you'll receive" required>
            <Select value={sourceAsset} onValueChange={handleSourceAssetChange}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {STABLECOINS.map((coin) => (
                  <SelectItem key={coin.id} value={coin.id}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={coin.icon || "/placeholder.svg"}
                        alt={coin.label}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span>{coin.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>

          <FormField label="Network" helper="The blockchain network for this deposit" required>
            <Select value={sourceNetwork} onValueChange={setSourceNetwork} disabled={!sourceAsset}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select network" />
              </SelectTrigger>
              <SelectContent>
                {availableSourceNetworks.map((network) => (
                  <SelectItem key={network.id} value={network.id}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={network.icon || "/placeholder.svg"}
                        alt={network.label}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span>{network.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </>
      )}

      <FormField label="Profile" helper="The account that will receive and process the deposit" required>
        <Select value={profileId} onValueChange={setProfileId}>
          <SelectTrigger className="w-full bg-card">
            <SelectValue placeholder="Select profile" />
          </SelectTrigger>
          <SelectContent>
            {PROFILES.map((profile) => (
              <SelectItem key={profile.id} value={profile.id}>
                <span>
                  {profile.name} <span className="text-muted-foreground">({profile.account_id})</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FormField>
    </div>
  )

  // ============================================
  // RENDER: STEP 2 - ACTION
  // ============================================

  const renderStep2 = () => {
    const actionLabel = isUsd
      ? "When USD arrives, what should happen?"
      : `When ${sourceAsset} arrives on ${NETWORKS.find((n) => n.id === sourceNetwork)?.label || sourceNetwork}, what should happen?`

    const showDestinationAsset = actionType !== null && destinationType !== "bank"
    const showDestinationType = actionType === "convert_transfer"
    const showWalletFields = actionType === "convert_transfer" && destinationType === "wallet"
    const showBankFields = actionType === "convert_transfer" && destinationType === "bank"
    const showProfileFields = actionType === "convert_transfer" && destinationType === "profile"

    const selectedProfile = PROFILES.find((p) => p.id === profileId)

    return (
      <div className="flex flex-col gap-6">
        {/* Action Type */}
        <FormField label={actionLabel} required>
          <RadioGroup
            value={actionType}
            onValueChange={(v) => setActionType(v as ActionType)}
            className="flex flex-col gap-3"
          >
            <Label
              htmlFor="convert_hold"
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors bg-card",
                actionType === "convert_hold" ? "border-primary bg-primary/5" : "border-input hover:bg-accent",
              )}
            >
              <RadioGroupItem value="convert_hold" id="convert_hold" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Convert & Hold</p>
                  {selectedProfile && (
                    <Badge variant="outline" className="bg-background font-normal">
                      {selectedProfile.name}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {isUsd
                    ? "Convert to stablecoin and keep in this profile"
                    : "Convert to another asset and keep in this profile"}
                </p>
              </div>
            </Label>
            <Label
              htmlFor="convert_transfer"
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors bg-card",
                actionType === "convert_transfer" ? "border-primary bg-primary/5" : "border-input hover:bg-accent",
              )}
            >
              <RadioGroupItem value="convert_transfer" id="convert_transfer" />
              <div>
                <p className="font-medium">Convert & Transfer</p>
                <p className="text-sm text-muted-foreground">
                  {isUsd
                    ? "Convert to stablecoin and send to another destination"
                    : "Convert to another asset and send to a destination"}
                </p>
              </div>
            </Label>
          </RadioGroup>
        </FormField>

        {/* Destination Asset */}
        {showDestinationAsset && (
          <FormField label="Convert to" required>
            <Select value={destinationAsset} onValueChange={handleDestinationAssetChange}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {conversionOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    <div className="flex items-center gap-2">
                      <Image
                        src={option.icon || "/placeholder.svg"}
                        alt={option.label}
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span>{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        )}

        {/* Destination Type */}
        {showDestinationType && (
          <FormField label="Send to" required>
            <RadioGroup
              value={destinationType}
              onValueChange={(v) => handleDestinationTypeChange(v as DestinationType)}
              className="flex gap-2"
            >
              {DESTINATION_TYPES.map((type) => (
                <Label
                  key={type.id}
                  htmlFor={type.id}
                  className={cn(
                    "flex flex-1 cursor-pointer items-center justify-center rounded-lg border px-4 py-2 text-sm transition-colors",
                    destinationType === type.id ? "border-primary bg-primary/5" : "border-input hover:bg-accent",
                  )}
                >
                  <RadioGroupItem value={type.id} id={type.id} className="sr-only" />
                  {type.label}
                </Label>
              ))}
            </RadioGroup>
          </FormField>
        )}

        {/* Wallet Fields */}
        {showWalletFields && (
          <>
            <FormField label="Destination address" required>
              <Select value={walletId} onValueChange={setWalletId}>
                <SelectTrigger className="w-full bg-card">
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent>
                  {SAVED_WALLETS.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No saved addresses</div>
                  ) : (
                    SAVED_WALLETS.map((wallet) => (
                      <SelectItem key={wallet.id} value={wallet.id}>
                        {wallet.name} ({wallet.address})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </FormField>

            <FormField label="Network" required>
              <Select value={walletNetwork} onValueChange={setWalletNetwork} disabled={!destinationAsset}>
                <SelectTrigger className="w-full bg-card">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  {availableWalletNetworks.map((network) => (
                    <SelectItem key={network.id} value={network.id}>
                      <div className="flex items-center gap-2">
                        <Image
                          src={network.icon || "/placeholder.svg"}
                          alt={network.label}
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                        <span>{network.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
          </>
        )}

        {/* Bank Fields */}
        {showBankFields && (
          <>
            <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950">
              <AlertTriangle className="mt-0.5 size-4 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                To withdraw to a bank, funds will be converted to USD.
              </p>
            </div>

            <FormField label="Bank account" required>
              <Select value={bankId} onValueChange={setBankId}>
                <SelectTrigger className="w-full bg-card">
                  <SelectValue placeholder="Select bank account" />
                </SelectTrigger>
                <SelectContent>
                  {SAVED_BANKS.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">No saved accounts</div>
                  ) : (
                    SAVED_BANKS.map((bank) => (
                      <SelectItem key={bank.id} value={bank.id}>
                        <div className="flex items-center gap-2">
                          <Image
                            src={bank.icon || "/placeholder.svg"}
                            alt={bank.name}
                            width={20}
                            height={20}
                            className="rounded-full"
                          />
                          <span>
                            {bank.name} ****{bank.last_four}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </FormField>
          </>
        )}

        {/* Profile Fields */}
        {showProfileFields && (
          <FormField label="Destination profile" required>
            <Select value={destinationProfileId} onValueChange={setDestinationProfileId}>
              <SelectTrigger className="w-full bg-card">
                <SelectValue placeholder="Select profile" />
              </SelectTrigger>
              <SelectContent>
                {otherProfiles.length === 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">No other profiles available</div>
                ) : (
                  otherProfiles.map((profile) => (
                    <SelectItem key={profile.id} value={profile.id}>
                      <span>
                        {profile.name} <span className="text-muted-foreground">({profile.account_id})</span>
                      </span>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </FormField>
        )}
      </div>
    )
  }

  // ============================================
  // RENDER: STEP 3 - REVIEW
  // ============================================

  const renderStep3 = () => (
    <div className="flex flex-col gap-6">
      <FormField label="Rule name" helper="A nickname to identify this automation rule" required>
        <Input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="e.g., Daily USDC to Treasury"
          className="bg-card"
        />
      </FormField>

      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="mb-3 text-sm font-medium">Summary</p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-medium text-foreground">Source:</span>
            <span>{getSourceSummary()}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-medium text-foreground">Action:</span>
            <span>{getActionSummary()}</span>
          </div>
        </div>
      </div>
    </div>
  )

  // ============================================
  // RENDER: SUCCESS
  // ============================================

  const renderSuccess = () => (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 py-8 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
        <CheckCircle2 className="size-8 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div>
        <h2 className="text-xl font-semibold">Rule Created Successfully</h2>
        <p className="mt-2 text-muted-foreground">Your automation rule "{nickname}" has been created.</p>
      </div>

      <div className="w-full rounded-lg border bg-muted/50 p-4 text-left">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-medium text-foreground">Source:</span>
            <span className="text-muted-foreground">{getSourceSummary()}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="shrink-0 font-medium text-foreground">Action:</span>
            <span className="text-muted-foreground">{getActionSummary()}</span>
          </div>
        </div>
      </div>

      <Card className="w-full">
        <CardContent className="p-4">
          <h3 className="mb-2 font-medium">What&apos;s next?</h3>
          <p className="text-sm text-muted-foreground">
            This rule is now pending approval. Once approved by an authorized user, it will automatically process
            incoming deposits according to your configuration.
          </p>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={onBack}>
        Done
      </Button>
    </div>
  )

  // ============================================
  // MAIN RENDER
  // ============================================

  if (step === "success") {
    return <div className="mx-auto flex max-w-xl flex-col">{renderSuccess()}</div>
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="size-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">{getTitle()}</h1>
          <p className="text-sm text-muted-foreground">{getStepIndicator()}</p>
        </div>
      </div>

      {/* Form Content */}
      {step === "step1" && renderStep1()}
      {step === "step2" && renderStep2()}
      {step === "step3" && renderStep3()}

      {/* Footer */}
      <div className="flex justify-end gap-3 border-t pt-4">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button
          onClick={handleContinue}
          disabled={
            (step === "step1" && !isStep1Valid) ||
            (step === "step2" && !isStep2Valid) ||
            (step === "step3" && !isStep3Valid)
          }
        >
          {step === "step3" ? "Create Rule" : "Continue"}
        </Button>
      </div>
    </div>
  )
}
