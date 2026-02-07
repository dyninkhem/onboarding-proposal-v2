"use client"

import type React from "react"
import Link from "next/link"

import { useState, useMemo } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Info, ArrowLeft, AlertTriangle, Check } from "lucide-react"
import { Spinner } from "@/components/ui/spinner"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"

type ViewState = "form" | "review" | "success"

interface Profile {
  id: string
  name: string
  maskedAccount: string
  balance: number
  currency: string
  isFiat?: boolean
}

interface Asset {
  id: string
  ticker: string
  name: string
  type: "fiat" | "crypto"
  balance: number
  balanceUsd: number
  networks?: string[]
  icon?: string
}

interface Network {
  id: string
  name: string
  addressPrefix: string
  icon?: string
}

interface SavedDestination {
  id: string
  type: "wallet" | "bank" | "profile"
  name: string
  address: string
  network?: string | null
  bankName?: string
}

interface SavedWallet {
  id: string
  name: string
  address: string
  network: string
}

const profiles: Profile[] = [
  {
    id: "1",
    name: "JPMORGAN CHASE BANK, NA",
    maskedAccount: "****3210",
    balance: 1250000,
    currency: "USD",
    isFiat: true,
  },
  {
    id: "2",
    name: "Hot Wallet A",
    maskedAccount: "Qp3K****mZ1a7tN8v2R",
    balance: 524000,
    currency: "USD",
    isFiat: false,
  },
  {
    id: "3",
    name: "Hot Wallet B",
    maskedAccount: "8hVa****Xc92Lm0PqW",
    balance: 89000,
    currency: "USD",
    isFiat: false,
  },
]

const assets: Asset[] = [
  {
    id: "usd",
    ticker: "USD",
    name: "US Dollar",
    type: "fiat",
    balance: 1250000,
    balanceUsd: 1250000,
    icon: "/images/flags/usd.svg",
  },
  {
    id: "usdg",
    ticker: "USDG",
    name: "Global Dollar",
    type: "crypto",
    balance: 50000,
    balanceUsd: 50000,
    networks: ["ethereum", "solana", "xlayer"],
    icon: "/images/crypto/usdg.svg",
  },
  {
    id: "pyusd",
    ticker: "PYUSD",
    name: "PayPal USD",
    type: "crypto",
    balance: 25000,
    balanceUsd: 25000,
    networks: ["ethereum", "solana", "stellar"],
    icon: "/images/crypto/pyusd.svg",
  },
  {
    id: "usdp",
    ticker: "USDP",
    name: "Pax Dollar",
    type: "crypto",
    balance: 100000,
    balanceUsd: 100000,
    networks: ["ethereum", "solana"],
    icon: "/images/crypto/usdp.svg",
  },
  {
    id: "usdc",
    ticker: "USDC",
    name: "USD Coin",
    type: "crypto",
    balance: 75000,
    balanceUsd: 75000,
    networks: ["ethereum", "solana", "base", "polygon"],
    icon: "/images/crypto/usdc.svg",
  },
]

const networks: Network[] = [
  { id: "ethereum", name: "Ethereum", addressPrefix: "0x", icon: "/images/networks/ethereum.svg" },
  { id: "solana", name: "Solana", addressPrefix: "", icon: "/images/networks/solana.svg" },
  { id: "base", name: "Base", addressPrefix: "0x", icon: "/images/networks/base.svg" },
  { id: "polygon", name: "Polygon", addressPrefix: "0x", icon: "/images/networks/polygon.svg" },
  { id: "stellar", name: "Stellar", addressPrefix: "G", icon: "/images/networks/stellar.svg" },
  { id: "xlayer", name: "XLayer", addressPrefix: "0x", icon: "/images/networks/xlayer.webp" },
]

const savedDestinations: SavedDestination[] = [
  { id: "1", type: "bank", name: "Acme Corp", bankName: "WELLS FARGO BANK, NA", address: "****3434", network: null },
  {
    id: "2",
    type: "bank",
    name: "Acme Treasury",
    bankName: "WELLS FARGO BANK, NA",
    address: "****1096",
    network: null,
  },
  {
    id: "3",
    type: "bank",
    name: "Acme Holdings",
    bankName: "JPMORGAN CHASE BANK, NA",
    address: "****3210",
    network: null,
  },
]

const savedWallets: SavedWallet[] = [
  { id: "1", name: "Cold Storage", address: "0x1a2b3c4d5e6f7890abcdef1234567890abcdef12", network: "ethereum" },
  { id: "2", name: "Trading Wallet", address: "0x9876543210fedcba0987654321fedcba09876543", network: "ethereum" },
  { id: "3", name: "Solana Vault", address: "7nYB1k2MK8p5uJCVx3KPwBqNtGzf9r8mLsT2vWxYzAbc", network: "solana" },
  { id: "4", name: "Base Operations", address: "0xabcdef1234567890abcdef1234567890abcdef12", network: "base" },
  { id: "5", name: "Polygon Treasury", address: "0x1234567890abcdef1234567890abcdef12345678", network: "polygon" },
]

const weeklyLimit = {
  total: 500000,
  used: 125000,
  available: 375000,
}

const countries = [
  { id: "us", name: "United States" },
  { id: "uk", name: "United Kingdom" },
  { id: "ca", name: "Canada" },
  { id: "de", name: "Germany" },
  { id: "fr", name: "France" },
  { id: "jp", name: "Japan" },
  { id: "au", name: "Australia" },
  { id: "sg", name: "Singapore" },
  { id: "hk", name: "Hong Kong" },
  { id: "ch", name: "Switzerland" },
]

export default function TransferPage() {
  const [sourceId, setSourceId] = useState("")
  const [assetId, setAssetId] = useState("")
  const [networkId, setNetworkId] = useState("")
  const [destinationType, setDestinationType] = useState<"saved" | "new" | "profile">("saved")
  const [destinationId, setDestinationId] = useState("")
  const [destinationAddress, setDestinationAddress] = useState("")
  const [amount, setAmount] = useState("")
  const [displayAmount, setDisplayAmount] = useState("")
  const [note, setNote] = useState("")
  const [viewState, setViewState] = useState<ViewState>("form")
  const [isSuccessLoading, setIsSuccessLoading] = useState(false)

  // Fiat account sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [sheetNetwork, setSheetNetwork] = useState<"bank_wire" | "cubix" | "">("")

  const [isWalletSheetOpen, setIsWalletSheetOpen] = useState(false)
  const [walletNetwork, setWalletNetwork] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [walletName, setWalletName] = useState("")

  // Bank Wire fields
  const [fiatAccountType, setFiatAccountType] = useState<"aba" | "swift" | "">("")
  const [routingNumber, setRoutingNumber] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [bankName, setBankName] = useState("")
  const [bankCountry, setBankCountry] = useState("")
  const [memo, setMemo] = useState("")
  const [recipientType, setRecipientType] = useState<"individual" | "institution" | "">("")
  const [enableIntermediary, setEnableIntermediary] = useState(false)

  // CUBIX fields
  const [cubixAccountId, setCubixAccountId] = useState("")
  const [cubixRecipientType, setCubixRecipientType] = useState<"individual" | "institution" | "">("")

  const selectedProfile = useMemo(() => profiles.find((p) => p.id === sourceId), [sourceId])
  const selectedAsset = useMemo(() => assets.find((a) => a.id === assetId), [assetId])
  const selectedNetwork = useMemo(() => networks.find((n) => n.id === networkId), [networkId])
  const selectedDestination = useMemo(() => {
    if (destinationType === "saved") {
      return savedDestinations.find((d) => d.id === destinationId)
    }
    return null
  }, [destinationType, destinationId])

  const selectedWallet = useMemo(() => {
    if (destinationType === "saved" && !selectedProfile?.isFiat) {
      return savedWallets.find((w) => w.id === destinationId)
    }
    return null
  }, [destinationType, destinationId, selectedProfile?.isFiat])

  const isCryptoSource = selectedProfile && !selectedProfile.isFiat

  const availableAssets = useMemo(() => {
    if (!selectedProfile) return assets
    if (selectedProfile.isFiat) {
      return assets.filter((a) => a.type === "fiat")
    }
    return assets.filter((a) => a.type === "crypto")
  }, [selectedProfile])

  const availableNetworks = useMemo(() => {
    if (!selectedAsset?.networks) return []
    return networks.filter((n) => selectedAsset.networks?.includes(n.id))
  }, [selectedAsset])

  const availableWallets = useMemo(() => {
    if (!networkId) return savedWallets
    return savedWallets.filter((w) => w.network === networkId)
  }, [networkId])

  const amountNum = Number.parseFloat(amount) || 0
  const isCrypto = selectedAsset?.type === "crypto"
  const hasDestination = destinationType === "saved" ? !!destinationId : !!destinationAddress

  const showAsset = !!sourceId
  const showNetwork = showAsset && !!assetId && isCrypto
  const showDestination = showAsset && !!assetId && (isCrypto ? !!networkId : true)
  const showAmount = showDestination && hasDestination

  const remainingAfterTransfer = useMemo(() => {
    return weeklyLimit.available - amountNum
  }, [amountNum])

  const maxAmount = selectedAsset?.balance || 0
  const isOverBalance = amountNum > maxAmount
  const isFormValid =
    sourceId && assetId && hasDestination && amountNum > 0 && !isOverBalance && (isCrypto ? !!networkId : true)

  const formatBalance = (balance: number, currency: string) => {
    if (currency === "USD") {
      return `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`
    }
    return `${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${currency}`
  }

  const formatWithCommas = (value: string) => {
    const parts = value.split(".")
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return parts.join(".")
  }

  const truncateAddress = (address: string) => {
    if (address.length <= 12) return address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const handleSourceChange = (value: string) => {
    setSourceId(value)
    setAssetId("")
    setNetworkId("")
    setDestinationId("")
    setDestinationAddress("")
    setAmount("")
    setDisplayAmount("")
    setNote("")
    setDestinationType("saved")
  }

  const handleAssetChange = (value: string) => {
    setAssetId(value)
    setNetworkId("")
    setDestinationId("")
    setDestinationAddress("")
    setAmount("")
    setDisplayAmount("")
    setNote("")
  }

  const handleNetworkChange = (value: string) => {
    setNetworkId(value)
    setDestinationId("")
    setDestinationAddress("")
  }

  const handleDestinationTypeChange = (value: string) => {
    setDestinationType(value as "saved" | "new" | "profile")
    setDestinationId("")
    setDestinationAddress("")
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const rawValue = inputValue.replace(/,/g, "").replace(/[^0-9.]/g, "")
    const parts = rawValue.split(".")
    const sanitizedValue = parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : rawValue
    setAmount(sanitizedValue)
    if (sanitizedValue) {
      setDisplayAmount(formatWithCommas(sanitizedValue))
    } else {
      setDisplayAmount("")
    }
  }

  const handleReviewClick = (e: React.FormEvent) => {
    e.preventDefault()
    if (isFormValid) {
      setViewState("review")
    }
  }

  const handleBackFromReview = () => {
    setViewState("form")
  }

  const handleConfirmTransfer = () => {
    setIsSuccessLoading(true)
    setViewState("success")
    setTimeout(() => {
      setIsSuccessLoading(false)
    }, 3000)
  }

  const handleMakeAnotherTransfer = () => {
    setSourceId("")
    setAssetId("")
    setNetworkId("")
    setDestinationId("")
    setDestinationAddress("")
    setAmount("")
    setDisplayAmount("")
    setNote("")
    setViewState("form")
  }

  const getEstimatedArrival = () => {
    if (isCrypto) {
      return "1-2 minutes"
    }
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() + 1)
    const endDate = new Date(today)
    endDate.setDate(today.getDate() + 5)

    const startMonth = startDate.toLocaleDateString("en-US", { month: "long" })
    const endMonth = endDate.toLocaleDateString("en-US", { month: "long" })

    if (startMonth === endMonth) {
      return `${startMonth} ${startDate.getDate()}-${endDate.getDate()}, ${startDate.getFullYear()}`
    }
    return `${startDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} - ${endDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
  }

  const handleNetworkButtonClick = (network: "bank_wire" | "cubix") => {
    setSheetNetwork(network)
    setIsSheetOpen(true)
    setFiatAccountType("")
    setRoutingNumber("")
    setAccountNumber("")
    setBankName("")
    setBankCountry("")
    setMemo("")
    setRecipientType("")
    setEnableIntermediary(false)
    setCubixAccountId("")
    setCubixRecipientType("")
  }

  const handleSheetNetworkChange = (network: "bank_wire" | "cubix") => {
    setSheetNetwork(network)
    setFiatAccountType("")
    setRoutingNumber("")
    setAccountNumber("")
    setBankName("")
    setBankCountry("")
    setMemo("")
    setRecipientType("")
    setEnableIntermediary(false)
    setCubixAccountId("")
    setCubixRecipientType("")
  }

  const handleOpenWalletSheet = () => {
    setWalletNetwork(networkId)
    setWalletAddress("")
    setWalletName("")
    setIsWalletSheetOpen(true)
  }

  const handleAddWallet = () => {
    setDestinationAddress(walletAddress)
    setIsWalletSheetOpen(false)
  }

  const isSheetFormValid = useMemo(() => {
    if (sheetNetwork === "cubix") {
      return cubixAccountId && cubixRecipientType
    }
    if (sheetNetwork === "bank_wire") {
      return fiatAccountType && routingNumber && accountNumber && bankName && bankCountry && recipientType
    }
    return false
  }, [
    sheetNetwork,
    cubixAccountId,
    cubixRecipientType,
    fiatAccountType,
    routingNumber,
    accountNumber,
    bankName,
    bankCountry,
    recipientType,
  ])

  const isWalletFormValid = useMemo(() => {
    return walletNetwork && walletAddress && walletName
  }, [walletNetwork, walletAddress, walletName])

  const handleAddAccount = () => {
    setDestinationAddress(sheetNetwork)
    setIsSheetOpen(false)
  }

  const getAddressPlaceholder = (network: string) => {
    const net = networks.find((n) => n.id === network)
    if (!net) return "Enter wallet address"
    if (net.addressPrefix === "0x") return "0x..."
    if (net.addressPrefix === "G") return "G..."
    return "Enter wallet address"
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                {viewState === "form" ? (
                  <BreadcrumbPage>Transfer</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href="#" onClick={handleMakeAnotherTransfer}>
                    Transfer
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {viewState === "review" && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Review</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
              {viewState === "success" && (
                <>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Confirmation</BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              )}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {viewState === "form" ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Transfer</CardTitle>
              <CardDescription>Move fiat or crypto off the Paxos platform or between Profiles.</CardDescription>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <form className="space-y-6 max-w-md" onSubmit={handleReviewClick}>
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Label htmlFor="source">Source</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="size-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>Decide where you want to transfer assets from.</TooltipContent>
                      </Tooltip>
                    </div>
                    <Select value={sourceId} onValueChange={handleSourceChange}>
                      <SelectTrigger id="source" className="w-full">
                        <SelectValue placeholder="Select source profile" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.name} {profile.maskedAccount}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedProfile && (
                      <p className="text-xs text-muted-foreground">
                        Available balance: {formatBalance(selectedProfile.balance, selectedProfile.currency)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="asset" className={!showAsset ? "text-muted-foreground" : ""}>
                      Asset
                    </Label>
                    <Select value={assetId} onValueChange={handleAssetChange} disabled={!showAsset}>
                      <SelectTrigger id="asset" className="w-full">
                        <SelectValue placeholder="Select asset" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAssets.map((asset) => (
                          <SelectItem key={asset.id} value={asset.id}>
                            <span className="flex items-center gap-2">
                              {asset.icon && (
                                <img src={asset.icon || "/placeholder.svg"} alt="" className="size-4 rounded-sm" />
                              )}
                              <span>
                                {asset.ticker} - {asset.name}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {isCrypto && (
                    <div className="space-y-2">
                      <Label htmlFor="network" className={!showNetwork ? "text-muted-foreground" : ""}>
                        Network
                      </Label>
                      <Select value={networkId} onValueChange={handleNetworkChange} disabled={!assetId}>
                        <SelectTrigger id="network" className="w-full">
                          <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableNetworks.map((network) => (
                            <SelectItem key={network.id} value={network.id}>
                              <span className="flex items-center gap-2">
                                {network.icon && (
                                  <img
                                    src={network.icon || "/placeholder.svg"}
                                    alt=""
                                    className="size-4 rounded-full"
                                  />
                                )}
                                <span>{network.name}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {showDestination && (
                    <div className="space-y-3.5">
                      <Label>Destination</Label>
                      <Tabs value={destinationType} onValueChange={handleDestinationTypeChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="saved">Saved</TabsTrigger>
                          <TabsTrigger value="new">{isCryptoSource ? "New Wallet" : "New Account"}</TabsTrigger>
                          <TabsTrigger value="profile">Profile ID</TabsTrigger>
                        </TabsList>
                      </Tabs>

                      {destinationType === "saved" && !isCryptoSource && (
                        <Select value={destinationId} onValueChange={setDestinationId}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select destination" />
                          </SelectTrigger>
                          <SelectContent>
                            {savedDestinations.map((dest) => (
                              <SelectItem key={dest.id} value={dest.id}>
                                <span className="flex items-center justify-between w-full gap-4">
                                  <span className="font-medium">{dest.name}</span>
                                  <span className="text-muted-foreground text-sm">
                                    {dest.bankName} {dest.address}
                                  </span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {destinationType === "saved" && isCryptoSource && (
                        <Select value={destinationId} onValueChange={setDestinationId}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select destination wallet" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableWallets.map((wallet) => (
                              <SelectItem key={wallet.id} value={wallet.id}>
                                <span className="flex items-center justify-between w-full gap-4">
                                  <span className="font-medium">{wallet.name}</span>
                                  <span className="text-muted-foreground text-sm">
                                    {truncateAddress(wallet.address)}
                                  </span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}

                      {destinationType === "new" && !isCryptoSource && (
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => handleNetworkButtonClick("bank_wire")}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <span>+</span>
                            <span>Add new Bank Wire Account</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleNetworkButtonClick("cubix")}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <span>+</span>
                            <span>Add new CUBIX Account</span>
                          </button>
                        </div>
                      )}

                      {destinationType === "new" && isCryptoSource && (
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={handleOpenWalletSheet}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <span>+</span>
                            <span>Add new Wallet</span>
                          </button>
                        </div>
                      )}

                      {destinationType === "profile" && (
                        <Input
                          placeholder="Enter Profile ID"
                          value={destinationAddress}
                          onChange={(e) => setDestinationAddress(e.target.value)}
                        />
                      )}
                    </div>
                  )}

                  {showAmount && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <div className="relative">
                          <Input
                            id="amount"
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={displayAmount}
                            onChange={handleAmountChange}
                            className={isOverBalance ? "border-destructive" : ""}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground uppercase">
                            {selectedAsset?.ticker}
                          </span>
                        </div>
                        {isOverBalance ? (
                          <p className="text-xs text-destructive">Insufficient balance</p>
                        ) : amountNum > 0 && selectedAsset?.type === "crypto" ? (
                          <p className="text-xs text-muted-foreground">
                            ≈ $
                            {((amountNum / selectedAsset.balance) * selectedAsset.balanceUsd).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}{" "}
                            USD
                          </p>
                        ) : null}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-sm font-medium">Weekly limit</span>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Info className="size-4 text-muted-foreground cursor-help" />
                                </TooltipTrigger>
                                <TooltipContent>Transfer limits reset on a rolling 7-day basis.</TooltipContent>
                              </Tooltip>
                            </div>
                            <p className="text-xs text-muted-foreground">Based on a rolling 7-day window.</p>
                          </div>
                          <div className="text-right space-y-1">
                            <p className="text-sm font-medium">
                              ${weeklyLimit.available.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
                              <span className="font-normal text-muted-foreground">Available</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ${weeklyLimit.total.toLocaleString("en-US", { minimumFractionDigits: 2 })} Total limit
                            </p>
                          </div>
                        </div>
                        <div className="h-2 w-full rounded-full overflow-hidden bg-gray-200">
                          <div
                            className="h-full transition-all duration-300 bg-gray-900"
                            style={{ width: `${((weeklyLimit.total - weeklyLimit.used) / weeklyLimit.total) * 100}%` }}
                          />
                        </div>
                      </div>

                      {isCryptoSource && (
                        <div className="flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                          <AlertTriangle className="size-5 mt-0.5 shrink-0" />
                          <p className="text-sm">
                            Please verify the wallet address and network carefully. Transfers to incorrect addresses
                            cannot be reversed.
                          </p>
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="note">Memo (Optional)</Label>
                        <Textarea
                          id="note"
                          placeholder="Add a note for this transfer"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          maxLength={256}
                          className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground text-right">{note.length}/256</p>
                      </div>
                    </>
                  )}

                  <Button type="submit" className="w-full" disabled={!isFormValid}>
                    Review Transfer
                  </Button>
                </form>
              </TooltipProvider>
            </CardContent>
          </Card>
        ) : viewState === "review" ? (
          <Card>
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={handleBackFromReview} className="size-8">
                  <ArrowLeft className="size-4" />
                </Button>
                <CardTitle className="text-xl">Review Transfer</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="max-w-md rounded-md border p-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">From</span>
                  <span className="font-medium">
                    {selectedProfile?.name} {selectedProfile?.maskedAccount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">To</span>
                  <span className="font-medium">
                    {selectedWallet
                      ? `${selectedWallet.name}   ${truncateAddress(selectedWallet.address)}`
                      : selectedDestination
                        ? `${selectedDestination.name} ${selectedDestination.address}`
                        : destinationAddress}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{isCryptoSource ? "Network" : "Transfer method"}</span>
                  <span className="font-medium flex items-center gap-2">
                    {isCryptoSource && selectedNetwork?.icon && (
                      <img src={selectedNetwork.icon || "/placeholder.svg"} alt="" className="size-4 rounded-sm" />
                    )}
                    {isCryptoSource ? selectedNetwork?.name : "Wire Transfer"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Asset</span>
                  <span className="font-medium flex items-center gap-2">
                    {selectedAsset?.icon && (
                      <img src={selectedAsset.icon || "/placeholder.svg"} alt="" className="size-4 rounded-sm" />
                    )}
                    {selectedAsset?.ticker} - {selectedAsset?.name}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    {selectedAsset?.ticker === "USD" ? "$" : ""}
                    {displayAmount}
                    {selectedAsset?.ticker !== "USD" ? ` ${selectedAsset?.ticker}` : ""}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Fee</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between text-sm">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">
                    {selectedAsset?.ticker === "USD" ? "$" : ""}
                    {displayAmount}
                    {selectedAsset?.ticker !== "USD" ? ` ${selectedAsset?.ticker}` : ""}
                  </span>
                </div>
              </div>

              <div className="max-w-md flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 p-3 text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
                <AlertTriangle className="size-5 mt-0.5 shrink-0" />
                <p className="text-sm">
                  {isCryptoSource
                    ? `Transfers on ${selectedNetwork?.name} typically complete within 1-2 minutes. Ensure the destination wallet supports ${selectedAsset?.ticker}.`
                    : "Please verify the account details. Bank transfers typically complete within 1-3 business days."}
                </p>
              </div>

              <div className="max-w-md flex gap-3 pt-4">
                <Button onClick={handleConfirmTransfer} className="flex-1">
                  Confirm Transfer
                </Button>
                <Button variant="outline" onClick={handleBackFromReview} className="flex-1 bg-transparent">
                  Back
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="text-left">
            <CardHeader>
              {isSuccessLoading ? (
                <div className="flex justify-start py-8">
                  <Spinner className="size-12 text-primary" />
                </div>
              ) : (
                <>
                  <div className="flex justify-start mb-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Check className="size-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-3xl text-left">Your transfer is on the way</CardTitle>
                  <CardDescription className="text-left">
                    {isCryptoSource
                      ? `The transfer should complete within ${getEstimatedArrival()}.`
                      : `The money should arrive between ${getEstimatedArrival()}.`}
                  </CardDescription>
                </>
              )}
            </CardHeader>
            {!isSuccessLoading && (
              <CardContent className="space-y-6 text-left">
                <div className="max-w-md rounded-md border p-4 space-y-2 text-left">
                  <p className="text-sm text-muted-foreground">
                    Transfer from {selectedProfile?.name} to{" "}
                    {selectedWallet?.name || selectedDestination?.name || destinationAddress}
                  </p>
                  <p className="text-3xl font-semibold">
                    {selectedAsset?.ticker === "USD" ? "$" : ""}
                    {displayAmount}
                    {selectedAsset?.ticker !== "USD" ? ` ${selectedAsset?.ticker}` : ""}
                  </p>
                </div>

                <div className="max-w-md flex gap-3">
                  <Button variant="outline" onClick={handleMakeAnotherTransfer} className="flex-1 bg-transparent">
                    Make Another Transfer
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>

      {/* Fiat Account Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-card">
          <SheetHeader>
            <SheetTitle>Add a Fiat Account</SheetTitle>
            <SheetDescription>Add a new fiat account for off-platform transfers.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto space-y-6 py-4 px-4 bg-card">
            {/* Select Network */}
            <div className="space-y-2">
              <Label>
                Select Network <span className="text-destructive">*</span>
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={sheetNetwork === "bank_wire" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSheetNetworkChange("bank_wire")}
                >
                  Bank Wire
                </Button>
                <Button
                  type="button"
                  variant={sheetNetwork === "cubix" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSheetNetworkChange("cubix")}
                >
                  CUBIX
                </Button>
              </div>
            </div>

            {/* CUBIX Fields */}
            {sheetNetwork === "cubix" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cubix-account-id">
                    Account ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cubix-account-id"
                    placeholder="Enter Account ID"
                    value={cubixAccountId}
                    onChange={(e) => setCubixAccountId(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Recipient Details</Label>
                  <Label>
                    Who owns the account, an individual or an institution? <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup
                    value={cubixRecipientType}
                    onValueChange={(v) => setCubixRecipientType(v as "individual" | "institution")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="cubix-individual" />
                      <Label htmlFor="cubix-individual" className="font-normal">
                        Individual
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="institution" id="cubix-institution" />
                      <Label htmlFor="cubix-institution" className="font-normal">
                        Institution
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            {/* Bank Wire Fields */}
            {sheetNetwork === "bank_wire" && (
              <>
                <div className="space-y-2">
                  <Label>
                    Fiat Account Type <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup value={fiatAccountType} onValueChange={(v) => setFiatAccountType(v as "aba" | "swift")}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="aba" id="aba" />
                      <Label htmlFor="aba" className="font-normal">
                        ABA
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="swift" id="swift" />
                      <Label htmlFor="swift" className="font-normal">
                        Swift
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="routing-number">
                    Routing Number <span className="text-destructive">*</span>
                  </Label>
                  <Input id="routing-number" value={routingNumber} onChange={(e) => setRoutingNumber(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-number">
                    Account Number <span className="text-destructive">*</span>
                  </Label>
                  <Input id="account-number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank-name">
                    Bank Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="bank-name"
                    placeholder="Enter a descriptive title for this bank account"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank-country">
                    Bank Country <span className="text-destructive">*</span>
                  </Label>
                  <Select value={bankCountry} onValueChange={setBankCountry}>
                    <SelectTrigger id="bank-country">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="memo">Memo</Label>
                  <Textarea id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} />
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Recipient Details</Label>
                  <Label>
                    Who owns the account, an individual or an institution? <span className="text-destructive">*</span>
                  </Label>
                  <RadioGroup
                    value={recipientType}
                    onValueChange={(v) => setRecipientType(v as "individual" | "institution")}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="individual" id="individual" />
                      <Label htmlFor="individual" className="font-normal">
                        Individual
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="institution" id="institution" />
                      <Label htmlFor="institution" className="font-normal">
                        Institution
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Intermediary Bank</Label>
                  <div className="flex items-center space-x-2">
                    <Switch id="intermediary" checked={enableIntermediary} onCheckedChange={setEnableIntermediary} />
                    <Label htmlFor="intermediary" className="font-normal">
                      Enable Intermediary Bank
                    </Label>
                  </div>
                </div>
              </>
            )}
          </div>

          <SheetFooter className="border-t pt-4 mt-auto">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAccount} disabled={!isSheetFormValid}>
              Add Account
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Sheet open={isWalletSheetOpen} onOpenChange={setIsWalletSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-card">
          <SheetHeader>
            <SheetTitle>Add a Wallet</SheetTitle>
            <SheetDescription>Select a network to add your destination.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto space-y-6 py-4 px-4 bg-card">
            {/* Network Selection */}
            <div className="space-y-2">
              <Label>
                Network <span className="text-destructive">*</span>
              </Label>
              <RadioGroup value={walletNetwork} onValueChange={setWalletNetwork}>
                {availableNetworks.map((network) => (
                  <div key={network.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={network.id} id={`wallet-network-${network.id}`} />
                    <Label htmlFor={`wallet-network-${network.id}`} className="font-normal">
                      {network.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Wallet Address */}
            {walletNetwork && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="wallet-address">
                    Wallet Address <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="wallet-address"
                    placeholder={getAddressPlaceholder(walletNetwork)}
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="wallet-name">
                    Wallet Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="wallet-name"
                    placeholder="Enter a descriptive name for this wallet"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <SheetFooter className="border-t pt-4 mt-auto">
            <Button variant="outline" onClick={() => setIsWalletSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddWallet} disabled={!isWalletFormValid}>
              Add Wallet
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
