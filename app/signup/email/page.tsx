"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
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

const DEMO_EXISTING_EMAIL = "existing@paxos.com";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function SignupEmailPage() {
  const router = useRouter();
  const { email, updateField } = useSignupFlow();
  const [localEmail, setLocalEmail] = useState(email);
  const [blurred, setBlurred] = useState(false);
  const [submitError, setSubmitError] = useState<"exists" | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const submittingRef = useRef(false);
  useEffect(() => setMounted(true), []);

  const valid = localEmail.trim().length > 0 && isValidEmail(localEmail);
  const error = blurred && !valid && localEmail.trim().length > 0
    ? "Please enter a valid email address."
    : null;

  const handleContinue = async () => {
    if (submittingRef.current || !valid) return;
    submittingRef.current = true;
    setSubmitError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      if (localEmail.trim().toLowerCase() === DEMO_EXISTING_EMAIL) {
        setSubmitError("exists");
        return;
      }
      updateField("email", localEmail.trim());
      router.push("/signup/verify");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
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
              Email
              {mounted && (
                <InfoTooltip content="This will be your primary login." />
              )}
            </FieldLabel>
            <Input
              type="email"
              placeholder="you@example.com"
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              onBlur={() => setBlurred(true)}
              aria-invalid={error ? true : undefined}
            />
            {error && (
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
