"use client";

import { useEffect } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getOfferingsForCountry,
  getRecommendedOfferingIds,
} from "@/lib/intro-data";
import type { IntroFormState } from "./intro-modal";

interface StepRecommendationsProps {
  form: IntroFormState;
  updateForm: <K extends keyof IntroFormState>(
    field: K,
    value: IntroFormState[K]
  ) => void;
  onContinue: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function StepRecommendations({
  form,
  updateForm,
  onContinue,
  onBack,
  onSkip,
}: StepRecommendationsProps) {
  const country = form.countryOfIncorporation;
  const offerings = getOfferingsForCountry(country);
  const recommendedIds = getRecommendedOfferingIds(country);
  const recommended = offerings.filter((o) => recommendedIds.includes(o.id));

  // Pre-select recommended offerings when entering this step
  useEffect(() => {
    if (form.recommendedOfferings.length === 0) {
      updateForm("recommendedOfferings", recommendedIds);
      updateForm("selectedOfferings", recommendedIds);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleOffering = (id: string) => {
    const current = form.recommendedOfferings;
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    updateForm("recommendedOfferings", next);
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
          Recommendations for you
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          Based on your business details, these options will work best for your
          business.
        </p>

        <div className="mt-6 space-y-3">
          {recommended.map((offering) => {
            const checked = form.recommendedOfferings.includes(offering.id);
            return (
              <label
                key={offering.id}
                className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                  checked
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleOffering(offering.id)}
                  className="mt-0.5"
                />
                <div>
                  <p className="font-medium text-sm">{offering.label}</p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {offering.description}
                  </p>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 mt-auto">
        <button
          type="button"
          onClick={onSkip}
          className="text-primary text-sm font-medium hover:underline underline-offset-4"
        >
          Skip for now
        </button>
        <Button onClick={onContinue}>Continue</Button>
      </div>
    </div>
  );
}
