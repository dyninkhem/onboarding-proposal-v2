"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { OTPForm } from "@/components/otp-form";
import { useSignupFlow } from "@/components/signup/signup-flow-context";

const RESEND_COOLDOWN_SEC = 60;

export default function SignupVerifyPage() {
  const router = useRouter();
  const { email, code, updateField } = useSignupFlow();
  const [localCode, setLocalCode] = useState(code);
  const [codeBlurred, setCodeBlurred] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
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
    if (resendCooldown <= 0) return;
    const t = setInterval(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCooldown]);

  useEffect(() => {
    if (!email) router.replace("/signup/email");
  }, [email, router]);

  const handleResend = () => {
    if (resendCooldown > 0) return;
    setResendCooldown(RESEND_COOLDOWN_SEC);
  };

  if (!email) return null;

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
