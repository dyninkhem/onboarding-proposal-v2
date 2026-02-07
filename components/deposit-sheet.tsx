"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { DepositCardSelector } from "@/components/deposit-card-selector"
import { DepositWizard } from "@/components/deposit-wizard"

export type DepositType = "usd" | "crypto" | null

interface DepositSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DepositSheet({ open, onOpenChange }: DepositSheetProps) {
  const [selectedType, setSelectedType] = React.useState<DepositType>(null)

  const handleClose = () => {
    onOpenChange(false)
    // Reset state after animation completes
    setTimeout(() => setSelectedType(null), 300)
  }

  const handleBack = () => {
    setSelectedType(null)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex h-[95vh] flex-col gap-0 rounded-t-xl p-0 [&>button]:hidden">
        {/* Custom header matching Figma */}
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-4">
          <SheetTitle className="text-base font-medium">Deposit</SheetTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="size-8">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>

        {/* Content area with muted background */}
        <div className="flex-1 overflow-y-auto bg-muted p-6">
          {selectedType === null ? (
            <DepositCardSelector onSelect={setSelectedType} />
          ) : (
            <DepositWizard type={selectedType} onBack={handleBack} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
