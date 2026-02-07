"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ConvertType } from "@/components/convert-sheet"

interface ConvertCardSelectorProps {
  onSelect: (type: ConvertType) => void
}

const convertOptions = [
  {
    id: "mint" as const,
    title: "Mint",
    sublabel: "USD → Stablecoin",
    description: "Convert your USD balance to a stablecoin token.",
    icon: "/images/icons/mint.svg",
  },
  {
    id: "redeem" as const,
    title: "Redeem",
    sublabel: "Stablecoin → USD",
    description: "Convert your stablecoin balance back to USD.",
    icon: "/images/icons/redeem.svg",
  },
  {
    id: "swap" as const,
    title: "Swap",
    sublabel: "Stablecoin ↔ Stablecoin",
    description: "Exchange one stablecoin for another.",
    icon: "/images/icons/swap.svg",
  },
]

export function ConvertCardSelector({ onSelect }: ConvertCardSelectorProps) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Convert</h2>
        <p className="mt-2 text-muted-foreground">
          Convert between USD and stablecoins instantly at 1:1 with no fees. All conversions settle immediately within
          your profile.
        </p>
      </div>

      <p className="mb-4 text-sm font-medium text-foreground">What would you like to do?</p>

      <div className="flex flex-col gap-3">
        {convertOptions.map((option) => (
          <Card
            key={option.id}
            className="cursor-pointer py-4 transition-colors hover:bg-accent"
            onClick={() => onSelect(option.id)}
          >
            <CardContent className="flex gap-4 px-4 items-center">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                <Image
                  src={option.icon || "/placeholder.svg"}
                  alt={option.title}
                  width={20}
                  height={20}
                  className="text-foreground"
                />
              </div>
              <div className="flex-1 my-0 py-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-medium text-foreground">{option.title}</h3>
                  <Badge variant="outline" className="bg-background font-normal">
                    {option.sublabel}
                  </Badge>
                </div>
                <p className="text-muted-foreground text-sm mt-0">{option.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
