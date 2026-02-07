"use client"

import { Banknote, Coins } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import type { DepositType } from "@/components/deposit-sheet"

interface DepositCardSelectorProps {
  onSelect: (type: DepositType) => void
}

const depositOptions = [
  {
    id: "usd" as const,
    title: "USD (Fiat)",
    sublabel: "Bank wire or CUBIX transfer",
    icon: Banknote,
  },
  {
    id: "crypto" as const,
    title: "Crypto / Stablecoin",
    sublabel: "On-chain transfer",
    icon: Coins,
  },
]

export function DepositCardSelector({ onSelect }: DepositCardSelectorProps) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Deposit Funds</h2>
        <p className="mt-2 text-muted-foreground">
          Add funds to your Paxos account. Choose your deposit method and we'll provide the instructions you need to
          complete the transfer.
        </p>
      </div>

      <p className="mb-4 text-sm font-medium text-foreground">What would you like to deposit?</p>

      <div className="flex flex-col gap-3">
        {depositOptions.map((option) => (
          <Card
            key={option.id}
            className="cursor-pointer py-4 transition-colors hover:bg-accent"
            onClick={() => onSelect(option.id)}
          >
            <CardContent className="flex items-center gap-4 px-4">
              <div className="flex size-10 items-center justify-center rounded-md border border-border bg-background">
                <option.icon className="size-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{option.title}</h3>
                <p className="text-sm text-muted-foreground">{option.sublabel}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert className="mt-6 border-border bg-muted/50">
        <Info className="size-4" />
        <AlertDescription>
          USD wire transfers are not processed on weekends and on US banking holidays. CUBIX transfers are processed 24/7.
        </AlertDescription>
      </Alert>
    </div>
  )
}
