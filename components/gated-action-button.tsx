"use client"

import * as React from "react"
import { Lock } from "lucide-react"
import { Button, type ButtonProps } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip"
import { useOnboarding } from "@/lib/onboarding-context"
import { cn } from "@/lib/utils"

interface GatedActionButtonProps extends ButtonProps {
  /** Name of the action for gating purposes */
  actionName: string
  /** Callback when the action is allowed to proceed */
  onAllowedAction?: () => void
  /** Show lock icon when gated */
  showLockIcon?: boolean
  /** Custom tooltip message when gated */
  gatedTooltip?: string
  children?: React.ReactNode
}

export function GatedActionButton({
  actionName,
  onAllowedAction,
  showLockIcon = false,
  gatedTooltip = "Complete onboarding to unlock this action",
  children,
  className,
  onClick,
  ...props
}: GatedActionButtonProps) {
  const { isOnboardingComplete, gateAction } = useOnboarding()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (gateAction(actionName)) {
      // Action allowed
      onClick?.(e)
      onAllowedAction?.()
    }
    // If gateAction returns false, user is redirected to the onboarding page
  }

  const button = (
    <Button
      onClick={handleClick}
      className={cn(
        !isOnboardingComplete && "relative",
        className
      )}
      {...props}
    >
      {showLockIcon && !isOnboardingComplete && (
        <Lock className="size-3 mr-1" />
      )}
      {children}
    </Button>
  )

  return (
    <TooltipProvider>
      {!isOnboardingComplete ? (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-[200px] text-center">
            <p className="text-xs">{gatedTooltip}</p>
          </TooltipContent>
        </Tooltip>
      ) : (
        button
      )}
    </TooltipProvider>
  )
}
