"use client"

import { DollarSign, Coins } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import type { AutomateTriggerType } from "@/components/automate-sheet"

interface AutomateCardSelectorProps {
  onSelect: (type: AutomateTriggerType) => void
  onClose?: () => void
}

const automateOptions = [
  {
    id: "usd" as const,
    title: "USD Deposit",
    sublabel: "Wire or CUBIX transfers",
    icon: DollarSign,
  },
  {
    id: "crypto" as const,
    title: "Crypto Deposit",
    sublabel: "Stablecoin on supported networks",
    icon: Coins,
  },
]

export function AutomateCardSelector({ onSelect, onClose }: AutomateCardSelectorProps) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Create Automation Rule</h2>
        <p className="mt-2 text-muted-foreground">
          Set up automatic processing for incoming deposits. When funds arrive, they'll be converted and routed based on
          your instructions.
        </p>
      </div>

      <p className="mb-4 text-sm font-medium text-foreground">What type of deposit will trigger this rule?</p>

      <div className="flex flex-col gap-3">
        {automateOptions.map((option) => (
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

      <div className="mt-6 text-left">
        <Link
          href="/dashboard/instructions"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          onClick={onClose}
        >
          View existing automation rules →
        </Link>
      </div>
    </div>
  )
}
