"use client";

export function StepIndicator({
  step,
  label,
}: {
  step: 1 | 2 | 3 | 4;
  label: string;
}) {
  return (
    <p className="text-muted-foreground text-sm">
      Step {step} of 4 – {label}
    </p>
  );
}
