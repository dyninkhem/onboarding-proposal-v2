"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";
import { useSignupFlow } from "@/components/signup/signup-flow-context";

export default function SignupSuccessPage() {
  const router = useRouter();
  const { companyName, clearState } = useSignupFlow();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const showTimer = setTimeout(() => setShow(true), 50);
    // Clear signup state and redirect after 2 seconds
    const redirectTimer = setTimeout(() => {
      clearState();
      router.push("/dashboard");
    }, 2000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(redirectTimer);
    };
  }, [clearState, router]);

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 text-center transition-all duration-500 ${show ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2Icon className="text-primary size-8" />
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-white">Account created</h1>
        <p className="text-sm text-white/70">
          Welcome to Paxos{companyName ? `, ${companyName}` : ""}. Taking you to
          your dashboard...
        </p>
      </div>
    </div>
  );
}
