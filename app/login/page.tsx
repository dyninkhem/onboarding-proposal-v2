"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { KeyRound, Building2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("");

  return (
    <div className="relative min-h-svh">
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover object-bottom"
          aria-hidden
        >
          <source src="/signup-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/40" aria-hidden />
      </div>
      <div className="relative z-10 flex min-h-svh flex-col items-center justify-center gap-8 p-8 md:p-12">
        <a href="/" className="flex items-center justify-center self-center">
          <Image
            src="/paxos-logo-whiteout.svg"
            alt="Paxos"
            width={170}
            height={48}
            className="h-10 w-auto"
            priority
            unoptimized
          />
        </a>
        <div className="flex w-full max-w-[400px] flex-col gap-8">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <p className="text-muted-foreground text-sm">
                Sign in to your Paxos account to continue.
              </p>
            </CardHeader>
            <CardContent className="flex flex-col gap-0">
              <FieldGroup>
                <Field>
                  <div className="flex w-full items-center justify-between gap-2">
                    <FieldLabel>Work email</FieldLabel>
                    <Link
                      href="/recover"
                      className="text-primary text-xs underline-offset-4 hover:underline"
                    >
                      Recover Account
                    </Link>
                  </div>
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
              </FieldGroup>

              <div className="flex flex-col gap-0 pt-4">
                {/* Continue with Passkey */}
                <Button
                  variant="default"
                  className="w-full"
                  disabled={!email.trim()}
                >
                  <KeyRound className="size-4" data-icon="inline-start" />
                  Continue with passkey
                </Button>

                {/* Continue with SSO */}
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={!email.trim()}
                >
                  <Building2 className="size-4" data-icon="inline-start" />
                  Continue with SSO
                </Button>
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <p className="text-muted-foreground text-sm">
                New to Paxos?{" "}
                <Link
                  href="/signup"
                  className="text-primary font-medium hover:underline underline-offset-4"
                >
                  Create account
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
