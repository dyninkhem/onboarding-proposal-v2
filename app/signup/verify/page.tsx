"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OTPForm } from "@/components/otp-form";
import { Skeleton } from "@/components/ui/skeleton";
import { useSignupFlow } from "@/components/signup/signup-flow-context";

const RESEND_COOLDOWN_SEC = 60;

export default function SignupVerifyPage() {
  const router = useRouter();
  const { email, code, updateField } = useSignupFlow();
  const [localCode, setLocalCode] = useState(code);
  const [codeBlurred, setCodeBlurred] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [mounted, setMounted] = useState(false);
  const submittingRef = useRef(false);

  const codeValid = /^\d{6}$/.test(localCode.trim());
  const codeError = codeBlurred && !codeValid && localCode.trim().length > 0;

  const handleVerify = async () => {
    if (submittingRef.current || !codeValid) return;
    submittingRef.current = true;
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      updateField("code", localCode.trim());
      router.push("/signup/passkey");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !email) router.replace("/signup/email");
  }, [mounted, email, router]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(RESEND_COOLDOWN_SEC);
  };

  if (!mounted || !email) {
    return (
      <Card className="w-full overflow-visible">
        <CardHeader className="gap-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 flex-1" />
            ))}
          </div>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <OTPForm
      value={localCode}
      onChange={(v) => setLocalCode(v.replace(/\D/g, "").slice(0, 6))}
      onVerify={handleVerify}
      onResend={handleResend}
      email={email}
      codeError={codeError}
      onCodeBlur={() => setCodeBlurred(true)}
      resendCooldown={resendCooldown}
      loading={loading}
      verifyLabel="Continue"
      resendLabel="Resend"
      length={6}
      footer={
        <div>
          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={!codeValid}
            loading={loading}
          >
            Continue
          </Button>
        </div>
      }
    />
  );
}
