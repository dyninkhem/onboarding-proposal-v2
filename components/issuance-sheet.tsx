"use client"
import { X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { IssuanceWizard } from "@/components/issuance-wizard"

interface IssuanceSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function IssuanceSheet({ open, onOpenChange }: IssuanceSheetProps) {
  const handleClose = () => {
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex h-[95vh] flex-col gap-0 rounded-t-xl p-0 [&>button]:hidden">
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-6 py-4">
          <SheetTitle className="text-base font-medium">Create Stablecoin</SheetTitle>
          <Button variant="ghost" size="icon" onClick={handleClose} className="size-8">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto bg-muted">
          <IssuanceWizard onClose={handleClose} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
