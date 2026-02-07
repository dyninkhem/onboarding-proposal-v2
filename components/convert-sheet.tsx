"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ConvertCardSelector } from "@/components/convert-card-selector"
import { ConvertWizard } from "@/components/convert-wizard"

export type ConvertType = "mint" | "redeem" | "swap" | null

interface ConvertSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ConvertSheet({ open, onOpenChange }: ConvertSheetProps) {
  const [selectedType, setSelectedType] = React.useState<ConvertType>(null)

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => setSelectedType(null), 300)
  }

  const handleBack = () => {
    setSelectedType(null)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex h-[95vh] flex-col gap-0 rounded-t-xl p-0 [&>button]:hidden">
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-4">
          <SheetTitle className="text-base font-medium">Convert</SheetTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="size-8">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto bg-muted p-6">
          {selectedType === null ? (
            <ConvertCardSelector onSelect={setSelectedType} />
          ) : (
            <ConvertWizard type={selectedType} onBack={handleBack} onClose={handleClose} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
