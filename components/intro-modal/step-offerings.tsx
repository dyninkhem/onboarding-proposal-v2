"use client";

import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getOfferingsForCountry } from "@/lib/intro-data";
import type { IntroFormState } from "./intro-modal";

interface StepOfferingsProps {
  form: IntroFormState;
  updateForm: <K extends keyof IntroFormState>(
    field: K,
    value: IntroFormState[K]
  ) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function StepOfferings({
  form,
  updateForm,
  onContinue,
  onBack,
}: StepOfferingsProps) {
  const offerings = getOfferingsForCountry(form.countryOfIncorporation);

  const toggleOffering = (id: string) => {
    const current = form.selectedOfferings;
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    updateForm("selectedOfferings", next);
  };

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
          Are there other ways you want to use Paxos?
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          This step is optional. You can always change this later.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {offerings.map((offering) => {
            const selected = form.selectedOfferings.includes(offering.id);
            return (
              <Tooltip key={offering.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => toggleOffering(offering.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      selected
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:border-muted-foreground/30"
                    }`}
                  >
                    {selected && (
                      <svg
                        className="size-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                    {offering.label}
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-[280px] text-xs"
                >
                  {offering.description}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      <div className="pt-6 mt-auto">
        <Button className="w-full" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
