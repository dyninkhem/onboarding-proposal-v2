"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { AutomateCardSelector } from "@/components/automate-card-selector"
import { AutomateWizard } from "@/components/automate-wizard"

export type AutomateTriggerType = "usd" | "crypto" | null

interface AutomateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AutomateSheet({ open, onOpenChange }: AutomateSheetProps) {
  const [selectedTrigger, setSelectedTrigger] = React.useState<AutomateTriggerType>(null)

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(() => setSelectedTrigger(null), 300)
  }

  const handleBack = () => {
    setSelectedTrigger(null)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex h-[95vh] flex-col gap-0 rounded-t-xl p-0 [&>button]:hidden">
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-4">
          <SheetTitle className="text-base font-medium">Automate</SheetTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="size-8">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto bg-muted p-6">
          {selectedTrigger === null ? (
            <AutomateCardSelector onSelect={setSelectedTrigger} onClose={handleClose} />
          ) : (
            <AutomateWizard triggerType={selectedTrigger} onBack={handleBack} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
