"use client";

import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepConfirmationProps {
  onComplete: () => void;
  onBack: () => void;
}

const NEXT_STEPS = [
  {
    number: 1,
    title: "Complete your setup",
    description:
      "Follow the steps in your setup guide to explore features that fit your business needs.",
  },
  {
    number: 2,
    title: "Submit for review",
    description:
      "When you're ready, submit your application for compliance review.",
  },
  {
    number: 3,
    title: "You're ready to go",
    description:
      "Once approved, start using Paxos services with your selected offerings.",
  },
];

export function StepConfirmation({ onComplete, onBack }: StepConfirmationProps) {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1">
        <button
          type="button"
          onClick={onBack}
          className="text-primary text-sm font-medium hover:underline underline-offset-4 inline-flex items-center gap-1 mb-4"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back
        </button>

        <h2 className="text-2xl font-semibold tracking-tight">
          Get started with your account
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          Your account is ready. Here&apos;s what comes next.
        </p>

        <div className="mt-8 relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-[24px] bottom-[24px] w-0.5 bg-primary/20" />

          <div className="space-y-8">
            {NEXT_STEPS.map((step) => (
              <div key={step.number} className="flex gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold relative z-10">
                  {step.number}
                </div>
                <div className="pt-0.5">
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 mt-auto">
        <Button className="w-full" onClick={onComplete}>
          Get started
        </Button>
      </div>
    </div>
  );
}
