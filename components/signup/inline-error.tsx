"use client";

import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type InlineErrorProps = {
  title: string;
  message: string;
  helper?: string;
  actions?: React.ReactNode;
};

export function InlineError({
  title,
  message,
  helper,
  actions,
}: InlineErrorProps) {
  return (
    <Alert variant="destructive" className="gap-2">
      <AlertCircle className="size-4 shrink-0" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <span className="block">{message}</span>
        {helper && (
          <span className="mt-1 block text-sm opacity-90">{helper}</span>
        )}
      </AlertDescription>
      {actions && (
        <div className="mt-2 flex flex-wrap items-center gap-2">{actions}</div>
      )}
    </Alert>
  );
}
