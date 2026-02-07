"use client";

import Link from "next/link";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InlineError } from "@/components/signup/inline-error";
import { useSignupFlow } from "@/components/signup/signup-flow-context";
import { InfoTooltip } from "@/components/ui/tooltip";

const PERSONAL_DOMAINS = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "icloud.com",
  "aol.com",
  "mail.com",
  "protonmail.com",
];

const DEMO_EXISTING_EMAIL = "existing@paxos.com";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isPersonalEmail(value: string): boolean {
  const domain = value.trim().split("@")[1]?.toLowerCase();
  return !!domain && PERSONAL_DOMAINS.includes(domain);
}

export default function SignupEmailPage() {
  const router = useRouter();
  const { email, updateField } = useSignupFlow();
  const [localEmail, setLocalEmail] = useState(email);
  const [touched, setTouched] = useState(false);
  const [blurred, setBlurred] = useState(false);
  const [submitError, setSubmitError] = useState<"exists" | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const runValidation = useCallback(() => {
    if (!localEmail.trim()) return { valid: false, error: null };
    if (!isValidEmail(localEmail))
      return { valid: false, error: "Please enter a valid email address." };
    if (isPersonalEmail(localEmail))
      return {
        valid: false,
        error: "Please use your company email for business accounts",
      };
    return { valid: true, error: null };
  }, [localEmail]);

  const { valid, error } = runValidation();
  const showError = blurred && !valid && error;

  const handleBlur = () => {
    setBlurred(true);
    setTouched(true);
  };

  const handleContinue = async () => {
    setSubmitError(null);
    if (!valid) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    if (localEmail.trim().toLowerCase() === DEMO_EXISTING_EMAIL) {
      setSubmitError("exists");
      setLoading(false);
      return;
    }
    updateField("email", localEmail.trim());
    setLoading(false);
    router.push("/signup/verify");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Sign Up Your Business</CardTitle>
        <p className="text-muted-foreground text-sm">
          Create a Paxos account to get started. We&apos;ll verify your email
          and guide you through setup.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-0">
        {submitError === "exists" && (
          <InlineError
            title="Account already exists"
            message="An account with this email already exists"
            helper="Try signing in instead, or use a different email address"
            actions={
              <>
                <Button variant="default" size="nova" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitError(null);
                    setLocalEmail("");
                    setBlurred(false);
                  }}
                  className="text-primary text-sm underline underline-offset-4 hover:no-underline"
                >
                  Use different email
                </button>
              </>
            }
          />
        )}
        <FieldGroup>
          <Field>
            <FieldLabel className="inline-flex items-center gap-1.5">
              Work email
              {mounted && (
                <InfoTooltip content="Use your company email address. This will be your primary login." />
              )}
            </FieldLabel>
            <Input
              type="email"
              placeholder="you@company.com"
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              onBlur={handleBlur}
              aria-invalid={showError ? true : undefined}
            />
            {showError && (
              <FieldDescription className="text-destructive">
                {error}
              </FieldDescription>
            )}
          </Field>
        </FieldGroup>
        <div className="pt-4">
          <Button
            className="w-full"
            onClick={handleContinue}
            disabled={!valid}
            loading={loading}
          >
            Start Application
          </Button>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-muted-foreground text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
