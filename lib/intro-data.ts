export type EntityType = "PTC" | "PTE" | "PME"

export type GeographyFilter = "all" | "us-only" | "non-us-only"

export interface Offering {
  id: string
  label: string
  description: string
  geographyFilter: GeographyFilter
  entityType: EntityType
  category: string
}

export const OFFERINGS: Offering[] = [
  {
    id: "stablecoin-access",
    label: "Access & distribute stablecoins (PYUSD, USDP, USDG)",
    description:
      "Access and distribute stablecoins at scale including PYUSD, USDP, USDG, and other stablecoins.",
    geographyFilter: "all",
    entityType: "PTC",
    category: "Stablecoin Solutions",
  },
  {
    id: "stablecoin-yield",
    label: "Earn yield on stablecoins (USDL)",
    description:
      "Earn yield on stablecoins through USDL, a yield-bearing stablecoin for non-US entities.",
    geographyFilter: "non-us-only",
    entityType: "PME",
    category: "Stablecoin Solutions",
  },
  {
    id: "custody",
    label: "Digital asset custody",
    description:
      "Create wallets and manage custody of digital assets for your business with institutional-grade security.",
    geographyFilter: "all",
    entityType: "PTC",
    category: "Custody",
  },
  {
    id: "trading",
    label: "Crypto trading (buy, sell, trade)",
    description:
      "Enable customers to buy, sell, and trade digital assets with deep liquidity and competitive pricing.",
    geographyFilter: "all",
    entityType: "PTC",
    category: "Trading",
  },
  {
    id: "payments",
    label: "Payments & remittance",
    description:
      "Build payment or remittance solutions using stablecoins for fast, low-cost global transfers.",
    geographyFilter: "all",
    entityType: "PTC",
    category: "Payments Solutions",
  },
  {
    id: "branded-stablecoin",
    label: "Launch a branded stablecoin",
    description:
      "Launch your own branded stablecoin backed by Paxos infrastructure and regulatory framework.",
    geographyFilter: "all",
    entityType: "PTC",
    category: "Stablecoin Solutions",
  },
  {
    id: "tokenized-gold",
    label: "Tokenized gold (PAXG)",
    description:
      "Access tokenized gold (PAXG) — each token is backed by one fine troy ounce of London Good Delivery gold.",
    geographyFilter: "all",
    entityType: "PTC",
    category: "Stablecoin Solutions",
  },
  {
    id: "gdn-partner",
    label: "Global Dollar Network partner",
    description:
      "Become a partner of the Global Dollar Network to access USDG distribution and ecosystem benefits.",
    geographyFilter: "all",
    entityType: "PTC",
    category: "Stablecoin Solutions",
  },
]

export interface IntroData {
  firstName: string
  lastName: string
  businessFunction: string
  countryOfIncorporation: string
  incorporationIdType: string
  incorporationId: string
  entityType: "PTC" | "PTE"
  hasUSDL: boolean
  selectedOfferings: string[]
  completedAt: string
}

const INTRO_COMPLETE_KEY = "intro-complete"
const INTRO_DATA_KEY = "intro-data"

export function isUS(country: string): boolean {
  return country === "US"
}

export function inferEntityType(country: string): "PTC" | "PTE" {
  return isUS(country) ? "PTC" : "PTE"
}

export function getOfferingsForCountry(country: string): Offering[] {
  const us = isUS(country)
  return OFFERINGS.filter((o) => {
    if (o.geographyFilter === "all") return true
    if (o.geographyFilter === "us-only") return us
    if (o.geographyFilter === "non-us-only") return !us
    return true
  })
}

export function getRecommendedOfferingIds(country: string): string[] {
  if (isUS(country)) {
    return ["stablecoin-access", "custody"]
  }
  return ["stablecoin-access", "stablecoin-yield"]
}

export function getIntroComplete(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(INTRO_COMPLETE_KEY) === "true"
}

export function getIntroData(): IntroData | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem(INTRO_DATA_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveIntroData(data: IntroData): void {
  if (typeof window === "undefined") return
  localStorage.setItem(INTRO_COMPLETE_KEY, "true")
  localStorage.setItem(INTRO_DATA_KEY, JSON.stringify(data))
}

export function saveIntroSkipped(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(INTRO_COMPLETE_KEY, "false")
}

export function clearIntroData(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(INTRO_COMPLETE_KEY)
  localStorage.removeItem(INTRO_DATA_KEY)
}
