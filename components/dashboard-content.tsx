"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, ArrowLeftRight, Search, Coins, Banknote, ArrowDown, ArrowUp, Zap, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DepositSheet } from "@/components/deposit-sheet"
import { ConvertSheet } from "@/components/convert-sheet"
import { WithdrawalSheet } from "@/components/withdrawal-sheet"
import { AutomateSheet } from "@/components/automate-sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { OnboardingCard } from "@/components/onboarding-card"
import { GatedActionButton } from "@/components/gated-action-button"
import { useOnboarding } from "@/lib/onboarding-context"
import { getIntroComplete, clearIntroData } from "@/lib/intro-data"

// Asset Icons
function USDIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none">
      <g clipPath="url(#usd-clip)">
        <path
          d="M25.0898 0.7566L25.6666 1.3334L23.6666 3.3334L21.9519 1.6188C18.8433 2.6465 15.9475 4.1366 13.3427 6.0096L13.9999 6.6667L11.9999 8.6667L11.1067 7.7735C10.1204 8.6249 9.1808 9.5289 8.3051 10.4931L9.8119 12L7.8119 14L6.4931 12.681C5.7468 13.6646 5.0589 14.6939 4.4285 15.7619L6 17.3333L4 19.3333L3.0428 18.3761C1.0942 22.5103 0 27.1266 0 32H32V0C29.6265 0 27.3161 0.2663 25.0898 0.7566Z"
          fill="#191977"
        />
        <path d="M49.686 5.3333C44.6189 1.966 38.54 0 32 0V5.3333H49.686Z" fill="white" />
        <path d="M32 10.6667H55.8453C54.03 8.63897 51.9606 6.84497 49.686 5.33337H32V10.6667Z" fill="#F0263C" />
        <path d="M32 16H59.7083C58.6024 14.0891 57.3087 12.3013 55.8452 10.6667H31.9999L32 16Z" fill="white" />
        <path d="M32 21.3333H62.1719C61.5129 19.4695 60.6847 17.6871 59.7083 16H32V21.3333Z" fill="#F0263C" />
        <path d="M32 26.6667H63.5492C63.2411 24.8312 62.7784 23.0487 62.172 21.3334H32.0001L32 26.6667Z" fill="white" />
        <path d="M32 32H64C64 30.1819 63.8405 28.402 63.5492 26.6667H32V32Z" fill="#F0263C" />
        <path
          d="M32 32H0C0 33.8181 0.1595 35.598 0.4508 37.3333H63.5491C63.8404 35.598 63.9999 33.818 63.9999 32H32Z"
          fill="white"
        />
        <path
          d="M1.82811 42.6667H62.1719C62.7784 40.9513 63.241 39.1689 63.5491 37.3334H0.450806C0.758906 39.1689 1.22171 40.9514 1.82811 42.6667Z"
          fill="#F0263C"
        />
        <path
          d="M4.29172 48H59.7084C60.6848 46.3128 61.513 44.5305 62.172 42.6667H1.82812C2.48712 44.5305 3.31532 46.3129 4.29172 48Z"
          fill="white"
        />
        <path
          d="M8.15475 53.3333H55.8452C57.3087 51.6987 58.6025 49.9109 59.7084 48H4.29175C5.39765 49.9109 6.69125 51.6987 8.15475 53.3333Z"
          fill="#F0263C"
        />
        <path d="M7.81201 20.6666L5.81201 22.6666L7.81201 24.6666L9.81201 22.6666L7.81201 20.6666Z" fill="white" />
        <path d="M15.6667 20.6666L13.6667 22.6666L15.6667 24.6666L17.6667 22.6666L15.6667 20.6666Z" fill="white" />
        <path d="M23.6667 20.6666L21.6667 22.6666L23.6667 24.6666L25.6667 22.6666L23.6667 20.6666Z" fill="white" />
        <path d="M15.6667 10L13.6667 12L15.6667 14L17.6667 12L15.6667 10Z" fill="white" />
        <path d="M23.6667 10L21.6667 12L23.6667 14L25.6667 12L23.6667 10Z" fill="white" />
        <path d="M4 25.9999L2 27.9999L4 29.9999L6 27.9999L4 25.9999Z" fill="white" />
        <path d="M12 25.9999L10 27.9999L12 29.9999L14 27.9999L12 25.9999Z" fill="white" />
        <path d="M19.8546 25.9999L17.8546 27.9999L19.8546 29.9999L21.8546 27.9999L19.8546 25.9999Z" fill="white" />
        <path d="M27.8546 25.9999L25.8546 27.9999L27.8546 29.9999L29.8546 27.9999L27.8546 25.9999Z" fill="white" />
        <path d="M12 15.3333L10 17.3333L12 19.3333L14 17.3333L12 15.3333Z" fill="white" />
        <path d="M19.8546 15.3333L17.8546 17.3333L19.8546 19.3333L21.8546 17.3333L19.8546 15.3333Z" fill="white" />
        <path d="M27.8546 15.3333L25.8546 17.3333L27.8546 19.3333L29.8546 17.3333L27.8546 15.3333Z" fill="white" />
        <path d="M19.8546 4.66663L17.8546 6.66663L19.8546 8.66663L21.8546 6.66663L19.8546 4.66663Z" fill="white" />
        <path d="M27.8546 4.66663L25.8546 6.66663L27.8546 8.66663L29.8546 6.66663L27.8546 4.66663Z" fill="white" />
        <path
          d="M9.81209 11.9999L8.30529 10.493C7.66869 11.1938 7.06619 11.9255 6.49329 12.6809L7.81209 13.9999L9.81209 11.9999Z"
          fill="white"
        />
        <path
          d="M6.00005 17.3332L4.42855 15.7618C3.92835 16.6094 3.46485 17.4806 3.04285 18.376L4.00005 19.3332L6.00005 17.3332Z"
          fill="white"
        />
        <path
          d="M14 6.66662L13.3428 6.00952C12.5708 6.56472 11.8252 7.15332 11.1068 7.77352L12 8.66672L14 6.66662Z"
          fill="white"
        />
        <path
          d="M25.6667 1.33327L25.0899 0.75647C24.0228 0.99147 22.9763 1.27997 21.952 1.61857L23.6667 3.33317L25.6667 1.33327Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="usd-clip">
          <rect width="64" height="64" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function USDCIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#usdc-clip)">
        <path
          d="M12 24C18.6274 24 24 18.6274 24 12C24 5.34996 18.65 0 12 0C5.34996 0 0 5.34996 0 12C0 18.6274 5.34996 24 12 24Z"
          fill="#2775CA"
        />
        <path
          d="M15.3001 4.80273H12.5885H9.68417C9.21662 4.80273 8.80577 5.14275 8.73492 5.6103L8.43742 7.5229V7.5371H7.02062C6.63812 7.5371 6.34057 7.8488 6.34057 8.21715C6.34057 8.59965 6.65227 8.8972 7.02062 8.91135H7.78567L7.13397 15.811L6.92147 17.1852L6.80812 17.922C6.72312 18.5029 7.16232 19.0271 7.75737 19.0271H8.66407H9.91082H10.9309C11.3984 19.0271 11.7951 18.687 11.8801 18.2195L12.4894 14.4368H12.8435H13.977C16.6546 14.4368 18.8365 12.2266 18.794 9.53475C18.7515 6.8854 16.5413 4.80273 13.9061 4.80273ZM9.61332 8.91135L13.8919 8.9255C14.2745 8.9255 14.6003 9.2372 14.6003 9.6339C14.6003 10.0164 14.2886 10.3423 13.8919 10.3423H9.38662L9.61332 8.91135ZM13.9203 13.0483H13.1977H12.8577H12.1352C11.6676 13.0483 11.2709 13.3884 11.1859 13.8559L10.5767 17.6528H8.25322L9.17412 11.7024H13.8919C15.0395 11.7024 15.9604 10.7673 15.9604 9.6339C15.9604 8.5005 15.0254 7.56545 13.8919 7.56545L9.83997 7.55125L10.0525 6.19115H13.9911C15.9179 6.19115 17.4764 7.77795 17.4339 9.70475C17.3772 11.5748 15.8046 13.0483 13.9203 13.0483Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="usdc-clip">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function USDGIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z"
        fill="#314012"
      />
      <path
        d="M20.9213 12.6507C20.5759 17.2661 16.7205 20.9035 12.0153 20.9035C7.08271 20.9035 3.08408 16.9061 3.08408 11.9751C3.08408 7.04413 7.08271 3.04676 12.0153 3.04676C16.7128 3.04676 20.5632 6.67221 20.9196 11.2769H16.6496C17.5816 9.21717 17.638 7.34582 16.6187 6.49075C15.1133 5.22802 11.832 6.65982 9.28958 9.68878C6.74718 12.7177 5.90648 16.1969 7.41183 17.4596C8.91718 18.7223 12.1985 17.2905 14.7409 14.2616C15.1841 13.7336 15.5756 13.1919 15.9119 12.6507H20.9213Z"
        fill="#C7E36C"
      />
      <path d="M12.6861 12.6507H16.2575L14.8784 14.4565L12.6861 13.5766V12.6507Z" fill="#C7E36C" />
    </svg>
  )
}

function PYUSDIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#pyusd-clip)">
        <path
          d="M12 24C18.6274 24 24 18.6274 24 12C24 5.3726 18.6274 0 12 0C5.3726 0 0 5.3726 0 12C0 18.6274 5.3726 24 12 24Z"
          fill="#0071F3"
        />
        <path
          d="M13.9061 4.80273H12.5885H9.68417C9.21662 4.80273 8.80577 5.14275 8.73492 5.6103L8.43742 7.5229V7.5371H7.02062C6.63812 7.5371 6.34057 7.8488 6.34057 8.21715C6.34057 8.59965 6.65227 8.8972 7.02062 8.91135H8.22487L8.01237 10.2289L7.99822 10.3281H6.58142C6.19892 10.3281 5.90137 10.6398 5.90137 11.0081C5.90137 11.3765 6.21307 11.6882 6.58142 11.6882H7.78567L7.13397 15.811L6.92147 17.1852L6.80812 17.922C6.72312 18.5029 7.16232 19.0271 7.75737 19.0271H8.66407H9.91082H10.9309C11.3984 19.0271 11.7951 18.687 11.8801 18.2195L12.4894 14.4368H12.8435H13.977C16.6546 14.4368 18.8365 12.2266 18.794 9.53475C18.7515 6.8854 16.5413 4.80273 13.9061 4.80273ZM9.61332 8.91135L13.8919 8.9255C14.2745 8.9255 14.6003 9.2372 14.6003 9.6339C14.6003 10.0164 14.2886 10.3423 13.8919 10.3423H9.38662L9.61332 8.91135ZM13.9203 13.0483H13.1977H12.8577H12.1352C11.6676 13.0483 11.2709 13.3884 11.1859 13.8559L10.5767 17.6528H8.25322L9.17412 11.7024H13.8919C15.0395 11.7024 15.9604 10.7673 15.9604 9.6339C15.9604 8.5005 15.0254 7.56545 13.8919 7.56545L9.83997 7.55125L10.0525 6.19115H13.9911C15.9179 6.19115 17.4764 7.77795 17.4339 9.70475C17.3772 11.5748 15.8046 13.0483 13.9203 13.0483Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="pyusd-clip">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

function USDPIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="#00A64F"
      />
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="url(#usdp-grad1)"
      />
      <path
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
        fill="url(#usdp-grad2)"
      />
      <path
        d="M14.1659 11.0874H13.1459V8.09522H17.5919V6.25922H13.1483V3.38342H10.8545V6.25922V6.27062H9.88733C7.79633 6.27062 6.05273 7.32722 6.05273 9.63062C6.05273 11.6454 7.58153 12.9132 9.83273 12.9132H10.8527V15.9048H6.40793V17.7408H10.8515V20.6172H13.1453V17.7294H14.1125C16.2035 17.7294 17.9471 16.6728 17.9471 14.3694C17.9471 12.3552 16.4183 11.0874 14.1659 11.0874ZM10.8515 12.912V11.088H10.1279C9.15653 11.088 8.36573 10.6788 8.36573 9.58802C8.36573 8.50802 9.11573 8.09762 10.1759 8.09762H10.8545V11.0898H13.1453V12.912H10.8515ZM13.8239 15.9048H13.1453V12.9126H13.8719C14.8433 12.9126 15.6341 13.3218 15.6341 14.4126C15.6341 15.4968 14.8841 15.9048 13.8239 15.9048Z"
        fill="white"
      />
      <defs>
        <radialGradient
          id="usdp-grad1"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(0.792 15.8328) scale(19.1982)"
        >
          <stop offset="0.09" stopColor="#00522C" />
          <stop offset="1" stopColor="#00522C" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="usdp-grad2"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(22.8612 7.7124) scale(19.1982)"
        >
          <stop stopColor="#8AD137" />
          <stop offset="1" stopColor="#8AD137" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  )
}

function ETHIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#eth-clip)">
        <path
          d="M11.9802 0C5.36374 0 0 5.36374 0 11.9802C0 18.5967 5.36374 23.9605 11.9802 23.9605C18.5967 23.9605 23.9605 18.5967 23.9605 11.9802C23.9605 5.36374 18.5967 0 11.9802 0Z"
          fill="black"
        />
        <path
          opacity="0.6"
          d="M11.9979 9.61353L6.375 12.1698L11.9979 15.4937L17.6219 12.1698L11.9979 9.61353Z"
          fill="white"
        />
        <path opacity="0.45" d="M6.37695 12.1698L11.9999 15.4938V9.61356V2.8396L6.37695 12.1698Z" fill="white" />
        <path opacity="0.8" d="M12 2.8396V9.61356V15.4938L17.6229 13.2365L12 2.8396Z" fill="white" />
        <path opacity="0.45" d="M6.375 13.2365L11.9979 21.1604V16.5583L6.375 13.2365Z" fill="white" />
        <path opacity="0.8" d="M11.998 16.5583V21.1604L17.6251 13.2365L11.998 16.5583Z" fill="white" />
      </g>
      <defs>
        <clipPath id="eth-clip">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  )
}

// Transaction Type Icons
function MintIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
      <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
      <path d="m2 16 6 6" />
      <circle cx="16" cy="9" r="2.9" />
      <circle cx="6" cy="5" r="3" />
    </svg>
  )
}

function RedeemIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" />
      <path d="M18 12h.01" />
      <path d="M19 22v-6" />
      <path d="m22 19-3-3-3 3" />
      <path d="M6 12h.01" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  )
}

function SwapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  )
}

function BankIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 18v-7" />
      <path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z" />
      <path d="M14 18v-7" />
      <path d="M18 18v-7" />
      <path d="M3 22h18" />
      <path d="M6 18v-7" />
    </svg>
  )
}

// Sample data
const assetBalances = [
  {
    icon: USDIcon,
    name: "US Dollar",
    ticker: "USD",
    quantity: "45,231.89",
    notionalValue: "$45,231.89",
    actions: ["Withdraw", "Deposit"],
  },
  {
    icon: USDCIcon,
    name: "USD Coin",
    ticker: "USDC",
    quantity: "50,000.00",
    notionalValue: "$50,000.00",
    actions: ["Withdraw", "Deposit"],
  },
  {
    icon: USDGIcon,
    name: "Global Dollar",
    ticker: "USDG",
    quantity: "25,000.00",
    notionalValue: "$25,000.00",
    actions: ["Withdraw", "Deposit"],
  },
  {
    icon: PYUSDIcon,
    name: "PayPal USD",
    ticker: "PYUSD",
    quantity: "15,000.00",
    notionalValue: "$15,000.00",
    actions: ["Withdraw", "Deposit"],
  },
  {
    icon: USDPIcon,
    name: "Pax Dollar",
    ticker: "USDP",
    quantity: "10,000.00",
    notionalValue: "$10,000.00",
    actions: ["Withdraw", "Deposit"],
  },
  {
    icon: ETHIcon,
    name: "Ethereum",
    ticker: "ETH",
    quantity: "2.00",
    notionalValue: "$6,420.00",
    actions: ["Withdraw", "Deposit"],
  },
]

const recentTransactions = [
  {
    type: "Mint",
    subtype: "USD → USDC",
    asset: "USDC",
    amount: "+50,000.00",
    notionalValue: "$50,000.00",
    status: "completed",
    date: "Jan 14, 2026",
    time: "2:34 PM",
    icon: MintIcon,
  },
  {
    type: "Send",
    subtype: "to 0x3482c...608c4",
    asset: "USDG",
    amount: "-10,000.00",
    notionalValue: "$10,000.00",
    status: "completed",
    date: "Jan 14, 2026",
    time: "11:20 AM",
    icon: SwapIcon,
  },
  {
    type: "Deposit",
    subtype: "Wire (ABA)",
    asset: "USD",
    amount: "+100,000.00",
    notionalValue: "$100,000.00",
    status: "processing",
    date: "Jan 14, 2026",
    time: "9:15 AM",
    icon: BankIcon,
  },
  {
    type: "Redeem",
    subtype: "PYUSD → USD",
    asset: "USD",
    amount: "+25,000.00",
    notionalValue: "$25,000.00",
    status: "completed",
    date: "Jan 12, 2026",
    time: "4:45 PM",
    icon: RedeemIcon,
  },
  {
    type: "Withdraw",
    subtype: "to Bank",
    asset: "USD",
    amount: "-15,000.00",
    notionalValue: "$15,000.00",
    status: "completed",
    date: "Jan 12, 2026",
    time: "10:30 AM",
    icon: BankIcon,
  },
  {
    type: "Mint",
    subtype: "USD → USDP",
    asset: "USDP",
    amount: "+5,000.00",
    notionalValue: "$5,000.00",
    status: "completed",
    date: "Jan 11, 2026",
    time: "3:20 PM",
    icon: MintIcon,
  },
]

const automationRules = [
  {
    name: "Auto-mint USDC",
    account: "Primary Profile",
    direction: "USD → USDC",
    status: "active",
    created: "Jan 10",
    approvedBy: "J. Smith",
  },
  {
    name: "Treasury sweep",
    account: "Treasury",
    direction: "USDG → Wallet",
    status: "active",
    created: "Jan 8",
    approvedBy: "A. Lee",
  },
  {
    name: "Payroll funding",
    account: "Operations",
    direction: "USD → USDC → Bank",
    status: "pending",
    created: "Jan 5",
    approvedBy: "—",
  },
  {
    name: "Client payments",
    account: "Primary Profile",
    direction: "USDC (ETH) → Hold",
    status: "active",
    created: "Dec 28",
    approvedBy: "M. Chen",
  },
  {
    name: "Emergency reserve",
    account: "Treasury",
    direction: "USD (SWIFT) → USDP",
    status: "pending",
    created: "Dec 15",
    approvedBy: "—",
  },
]

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { className: string; label: string }> = {
    completed: {
      className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
      label: "Completed",
    },
    processing: { className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400", label: "Processing" },
    failed: { className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400", label: "Failed" },
    active: { className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400", label: "Active" },
    pending: { className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400", label: "Pending" },
    rejected: { className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400", label: "Rejected" },
  }
  const variant = variants[status] || variants.pending
  return (
    <Badge variant="secondary" className={variant.className}>
      {variant.label}
    </Badge>
  )
}

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState("conversions")
  const [depositOpen, setDepositOpen] = useState(false)
  const [convertOpen, setConvertOpen] = useState(false)
  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [automateOpen, setAutomateOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  useEffect(() => {
    setSelectedDate(new Date())
  }, [])
  const { gateAction, isOnboardingComplete } = useOnboarding()

  const [showIntroPrompt, setShowIntroPrompt] = useState(false)

  useEffect(() => {
    const complete = getIntroComplete()
    if (!complete) {
      setShowIntroPrompt(true)
    }
  }, [])

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <div className="flex flex-wrap gap-2 rounded-none">
          <GatedActionButton
            className="rounded-full"
            size="sm"
            actionName="Convert"
            onAllowedAction={() => setConvertOpen(true)}
            gatedTooltip="Complete onboarding to convert assets"
          >
            <ArrowLeftRight className="size-4" />
            Convert
          </GatedActionButton>
          <GatedActionButton
            className="rounded-full"
            size="sm"
            actionName="Deposit"
            onAllowedAction={() => setDepositOpen(true)}
            gatedTooltip="Complete onboarding to deposit funds"
          >
            <ArrowDown className="size-4" />
            Deposit
          </GatedActionButton>
          <GatedActionButton
            className="rounded-full"
            size="sm"
            actionName="Withdraw"
            onAllowedAction={() => setWithdrawOpen(true)}
            gatedTooltip="Complete onboarding to withdraw funds"
          >
            <ArrowUp className="size-4" />
            Withdraw
          </GatedActionButton>
          <GatedActionButton
            className="rounded-full"
            size="sm"
            actionName="Automate"
            onAllowedAction={() => setAutomateOpen(true)}
            gatedTooltip="Complete onboarding to set up automations"
          >
            <Zap className="size-4" />
            Automate
          </GatedActionButton>
        </div>
      </div>

      {/* Onboarding Card */}
      <OnboardingCard />

      {showIntroPrompt && (
        <Card className="border-primary/20 bg-primary/5 py-3">
          <CardContent className="flex items-center justify-between px-4">
            <div>
              <p className="text-sm font-medium">Customize your setup</p>
              <p className="text-muted-foreground text-xs">
                Tell us about your business to get personalized recommendations.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                clearIntroData()
                window.location.reload()
              }}
            >
              Get started
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Summary/Balance Card - Zero State */}
      <Card className="py-4">
        <CardContent className="flex flex-col gap-4 px-4 sm:flex-row sm:items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-fit gap-2 bg-transparent">
                <CalendarIcon className="size-4" />
                {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Today"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
            </PopoverContent>
          </Popover>
          <div className="hidden h-10 w-px bg-border sm:block" />
          <div className="grid flex-1 grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Total on-platform value</p>
              <p className="text-2xl font-semibold text-muted-foreground">$0.00</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">USD available</p>
              <p className="text-2xl font-semibold text-muted-foreground">$0.00</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Stablecoins available</p>
              <p className="text-2xl font-semibold text-muted-foreground">$0.00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Balances and Recent Transactions */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Asset Balances Card - Empty State */}
        <Card className="py-4">
          <CardHeader className="my-0 flex flex-row items-center justify-between px-4 pb-0">
            <div>
              <CardTitle className="text-base">Asset Balances</CardTitle>
              <CardDescription>Your on-platform holdings</CardDescription>
            </div>
            <div className="flex w-[140px] justify-end">
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <Coins className="size-6 text-muted-foreground" />
              </div>
              <p className="mb-1 text-sm font-medium">No assets yet</p>
              <p className="mb-4 max-w-[200px] text-xs text-muted-foreground">
                Make your first deposit to start building your portfolio
              </p>
              <GatedActionButton
                size="sm"
                actionName="Deposit"
                onAllowedAction={() => setDepositOpen(true)}
                gatedTooltip="Complete onboarding to deposit funds"
              >
                <ArrowDown className="size-4" />
                Make a Deposit
              </GatedActionButton>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions Card - Empty State */}
        <Card className="py-4">
          <CardHeader className="my-0 flex flex-row items-center justify-between px-4 pb-0">
            <div>
              <CardTitle className="text-base">Recent Transactions</CardTitle>
              <CardDescription>Latest activity on your account</CardDescription>
            </div>
            <div className="flex w-[90px] justify-end">
              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                <Clock className="size-6 text-muted-foreground" />
              </div>
              <p className="mb-1 text-sm font-medium">No transactions yet</p>
              <p className="max-w-[280px] text-xs text-muted-foreground">
                Your transaction history will appear here once you make your first transfer
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Automation Rules Section - Empty States */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Automations</CardTitle>
            <CardDescription>View and manage instructions for depositing fiat and other assets</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <TabsList>
                <TabsTrigger value="conversions" className="gap-2">
                  <ArrowLeftRight className="size-4" />
                  Conversions
                </TabsTrigger>
                <TabsTrigger value="crypto" className="gap-2">
                  <Coins className="size-4" />
                  Crypto Deposit
                </TabsTrigger>
                <TabsTrigger value="fiat" className="gap-2">
                  <Banknote className="size-4" />
                  Fiat Deposit
                </TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                  <Input placeholder="Search" className="h-9 w-[200px] pl-8" />
                </div>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <ArrowUp className="size-4" />
                  Filters
                </Button>
              </div>
            </div>

            <TabsContent value="conversions" className="mt-4">
              <div className="rounded-lg border">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                    <ArrowLeftRight className="size-6 text-muted-foreground" />
                  </div>
                  <p className="mb-1 text-sm font-medium">No conversion automations</p>
                  <p className="mb-4 max-w-[280px] text-xs text-muted-foreground">
                    Set up automatic conversions between USD and stablecoins to streamline your operations
                  </p>
                  <GatedActionButton
                    size="sm"
                    actionName="Automate"
                    onAllowedAction={() => setAutomateOpen(true)}
                    gatedTooltip="Complete onboarding to create automations"
                  >
                    <Zap className="size-4" />
                    Create Automation
                  </GatedActionButton>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="crypto" className="mt-4">
              <div className="rounded-lg border">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                    <Coins className="size-6 text-muted-foreground" />
                  </div>
                  <p className="mb-1 text-sm font-medium">No crypto deposit addresses</p>
                  <p className="mb-4 max-w-[280px] text-xs text-muted-foreground">
                    Create deposit addresses to receive crypto assets on supported networks
                  </p>
                  <GatedActionButton
                    size="sm"
                    actionName="Automate"
                    onAllowedAction={() => setAutomateOpen(true)}
                    gatedTooltip="Complete onboarding to create automations"
                  >
                    <Zap className="size-4" />
                    Create Automation
                  </GatedActionButton>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fiat" className="mt-4">
              <div className="rounded-lg border">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
                    <Banknote className="size-6 text-muted-foreground" />
                  </div>
                  <p className="mb-1 text-sm font-medium">No fiat deposit instructions</p>
                  <p className="mb-4 max-w-[280px] text-xs text-muted-foreground">
                    Set up wire transfer instructions to deposit USD from your bank account
                  </p>
                  <GatedActionButton
                    size="sm"
                    actionName="Automate"
                    onAllowedAction={() => setAutomateOpen(true)}
                    gatedTooltip="Complete onboarding to create automations"
                  >
                    <Zap className="size-4" />
                    Create Automation
                  </GatedActionButton>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sheet components for flows */}
      <DepositSheet open={depositOpen} onOpenChange={setDepositOpen} />
      <ConvertSheet open={convertOpen} onOpenChange={setConvertOpen} />
      <WithdrawalSheet open={withdrawOpen} onOpenChange={setWithdrawOpen} />
      <AutomateSheet open={automateOpen} onOpenChange={setAutomateOpen} />
    </div>
  )
}
