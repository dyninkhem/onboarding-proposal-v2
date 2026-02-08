"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export interface OTPFormProps {
  value: string;
  onChange: (value: string) => void;
  onVerify: () => void;
  onResend?: () => void;
  email?: string;
  error?: string;
  codeError?: boolean;
  onCodeBlur?: () => void;
  resendCooldown?: number;
  loading?: boolean;
  verifyLabel?: string;
  resendLabel?: string;
  /** Slot count (default 6) */
  length?: number;
  /** Optional header content (e.g. step indicator) */
  headerExtra?: React.ReactNode;
  /** Optional footer actions (e.g. Back + Continue) */
  footer?: React.ReactNode;
}

export function OTPForm({
  value,
  onChange,
  onVerify,
  onResend,
  email,
  error,
  codeError,
  onCodeBlur,
  resendCooldown = 0,
  loading = false,
  verifyLabel = "Verify",
  resendLabel = "Resend",
  length = 6,
  headerExtra,
  footer,
}: OTPFormProps) {
  const valid = value.trim().length === length && /^\d+$/.test(value.trim());

  return (
    <Card className="w-full overflow-visible">
      <CardHeader>
        {headerExtra}
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          {email ? (
            <>
              We&apos;ve sent a 6-digit code to{" "}
              <strong className="font-semibold text-foreground">{email}</strong>
            </>
          ) : (
            "We sent a 6-digit code to your email."
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 overflow-visible">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (valid && !loading) onVerify();
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="otp">Verification code</FieldLabel>
              <div className="flex w-full py-2" onBlur={onCodeBlur}>
                <InputOTP
                  id="otp"
                  value={value}
                  onChange={onChange}
                  maxLength={length}
                  aria-invalid={codeError ? true : undefined}
                  containerClassName="w-full"
                >
                  <InputOTPGroup className="w-full gap-2.5 *:data-[slot=input-otp-slot]:h-14 *:data-[slot=input-otp-slot]:min-w-0 *:data-[slot=input-otp-slot]:flex-1 *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:text-lg *:data-[slot=input-otp-slot]:font-bold *:data-[slot=input-otp-slot]:font-mono">
                    {Array.from({ length: Math.floor(length / 2) }, (_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                    <InputOTPSeparator />
                    {Array.from(
                      { length: length - Math.floor(length / 2) },
                      (_, i) => (
                        <InputOTPSlot
                          key={i + Math.floor(length / 2)}
                          index={i + Math.floor(length / 2)}
                        />
                      )
                    )}
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <FieldDescription
                className={
                  codeError ? "text-destructive" : "text-muted-foreground"
                }
              >
                {codeError
                  ? "Enter a 6-digit code"
                  : "Enter the 6-digit code we sent to your email. Check your spam folder if you don't see it."}
              </FieldDescription>
            </Field>
            {footer != null ? (
              footer
            ) : (
              <Button
                type="submit"
                className="w-full"
                disabled={!valid || loading}
              >
                {loading ? "Verifying…" : verifyLabel}
              </Button>
            )}
            {onResend != null && (
              <FieldDescription className="text-center">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={onResend}
                  disabled={resendCooldown > 0}
                  className="text-primary underline underline-offset-4 hover:no-underline disabled:opacity-50"
                >
                  {resendCooldown > 0
                    ? `Resend (${resendCooldown}s)`
                    : resendLabel}
                </button>
              </FieldDescription>
            )}
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
