"use client"

import { Wallet, Landmark } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import type { WithdrawalType } from "@/components/withdrawal-sheet"

interface WithdrawalCardSelectorProps {
  onSelect: (type: WithdrawalType) => void
}

const withdrawalOptions = [
  {
    id: "bank" as const,
    title: "USD (Fiat)",
    sublabel: "Wire to bank account or CUBIX",
    icon: Landmark,
  },
  {
    id: "wallet" as const,
    title: "Crypto / Stablecoin",
    sublabel: "On-chain transfer to external wallet",
    icon: Wallet,
  },
]

export function WithdrawalCardSelector({ onSelect }: WithdrawalCardSelectorProps) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Withdraw Funds</h2>
        <p className="mt-2 text-muted-foreground">
          Send funds from your Paxos account. Choose your withdrawal method and destination.
        </p>
      </div>

      <p className="mb-4 text-sm font-medium text-foreground">What would you like to withdraw?</p>

      <div className="flex flex-col gap-3">
        {withdrawalOptions.map((option) => (
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
          Withdrawals to external destinations may incur network fees. Paxos doesn't charge additional withdrawal fees.
        </AlertDescription>
      </Alert>
    </div>
  )
}
