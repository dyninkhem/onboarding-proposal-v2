"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import { getIntroComplete, saveIntroData, saveIntroSkipped } from "@/lib/intro-data";
import type { IntroData } from "@/lib/intro-data";
import { inferEntityType } from "@/lib/intro-data";
import { StepBusiness } from "./step-business";
import { StepRecommendations } from "./step-recommendations";
import { StepOfferings } from "./step-offerings";
import { StepConfirmation } from "./step-confirmation";

export interface IntroFormState {
  firstName: string;
  lastName: string;
  businessFunction: string;
  countryOfIncorporation: string;
  incorporationIdType: string;
  incorporationId: string;
  recommendedOfferings: string[];
  selectedOfferings: string[];
}

const initialFormState: IntroFormState = {
  firstName: "",
  lastName: "",
  businessFunction: "",
  countryOfIncorporation: "",
  incorporationIdType: "",
  incorporationId: "",
  recommendedOfferings: [],
  selectedOfferings: [],
};

export function IntroModal() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<IntroFormState>(initialFormState);

  useEffect(() => {
    if (!getIntroComplete()) {
      setOpen(true);
    }
    const handler = () => {
      setStep(1);
      setForm(initialFormState);
      setOpen(true);
    };
    window.addEventListener("open-intro-modal", handler);
    return () => window.removeEventListener("open-intro-modal", handler);
  }, []);

  const updateForm = useCallback(
    <K extends keyof IntroFormState>(field: K, value: IntroFormState[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSkip = useCallback(() => {
    saveIntroSkipped();
    setOpen(false);
  }, []);

  const handleComplete = useCallback(() => {
    const entityType = inferEntityType(form.countryOfIncorporation);
    const data: IntroData = {
      firstName: form.firstName,
      lastName: form.lastName,
      businessFunction: form.businessFunction,
      countryOfIncorporation: form.countryOfIncorporation,
      incorporationIdType: form.incorporationIdType,
      incorporationId: form.incorporationId,
      entityType,
      hasUSDL: form.selectedOfferings.includes("stablecoin-yield"),
      selectedOfferings: form.selectedOfferings,
      completedAt: new Date().toISOString(),
    };
    saveIntroData(data);
    setOpen(false);
  }, [form]);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleSkip();
    }}>
      <DialogPortal>
        <DialogOverlay />
        <DialogPrimitive.Content
          aria-label="Introduction setup"
          className="fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%] w-full max-w-4xl rounded-xl border bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_0.8fr] min-h-[560px]">
            {/* Left panel: form content */}
            <div className="flex flex-col p-8 overflow-y-auto">
              {step === 1 && (
                <StepBusiness
                  form={form}
                  updateForm={updateForm}
                  onContinue={() => setStep(2)}
                  onSkip={handleSkip}
                />
              )}
              {step === 2 && (
                <StepRecommendations
                  form={form}
                  updateForm={updateForm}
                  onContinue={() => setStep(3)}
                  onBack={() => setStep(1)}
                  onSkip={handleSkip}
                />
              )}
              {step === 3 && (
                <StepOfferings
                  form={form}
                  updateForm={updateForm}
                  onContinue={() => setStep(4)}
                  onBack={() => setStep(2)}
                />
              )}
              {step === 4 && (
                <StepConfirmation
                  onComplete={handleComplete}
                  onBack={() => setStep(3)}
                />
              )}
            </div>

            {/* Right panel: branded illustration */}
            <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-sky-100 via-purple-50 to-pink-100 p-8">
              <div className="w-full max-w-[280px] rounded-xl bg-white/80 backdrop-blur-sm shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex size-8 items-center justify-center rounded-md bg-emerald-500 text-white text-xs font-bold">
                    P
                  </div>
                  <span className="font-semibold text-gray-900">
                    paxos
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="size-2 rounded-full bg-emerald-400" />
                  paxos.com
                </div>
                <div className="mt-6 space-y-3">
                  <div className="h-3 w-3/4 rounded bg-gray-100" />
                  <div className="h-3 w-1/2 rounded bg-gray-100" />
                  <div className="h-3 w-5/6 rounded bg-gray-100" />
                </div>
              </div>
            </div>
          </div>

          {/* Close button */}
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
