"use client";

import Link from "next/link";
import { useState, useRef } from "react";
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
import { useSignupFlow } from "@/components/signup/signup-flow-context";

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function SignupPage() {
  const router = useRouter();
  const { updateField } = useSignupFlow();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const submittingRef = useRef(false);

  const emailValid = email.trim().length > 0 && isValidEmail(email);
  const emailError =
    emailBlurred && !emailValid && email.trim().length > 0
      ? "Please enter a valid email address."
      : null;

  const formValid =
    emailValid && password.trim().length >= 1 && companyName.trim().length >= 1;

  const handleSubmit = async () => {
    if (submittingRef.current || !formValid) return;
    submittingRef.current = true;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      updateField("email", email.trim());
      updateField("password", password);
      updateField("companyName", companyName.trim());
      router.push("/signup/success");
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
          Create a Paxos account to get started.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-0">
        <FieldGroup>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailBlurred(true)}
              aria-invalid={emailError ? true : undefined}
            />
            {emailError && (
              <FieldDescription className="text-destructive">
                {emailError}
              </FieldDescription>
            )}
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Company name</FieldLabel>
            <Input
              type="text"
              placeholder="Your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </Field>
        </FieldGroup>
        <div className="pt-4">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={!formValid}
            loading={loading}
          >
            Create Account
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
