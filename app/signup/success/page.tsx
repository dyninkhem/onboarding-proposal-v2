"use client";

import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSignupFlow } from "@/components/signup/signup-flow-context";
import {
  CheckCircle2Icon,
  ChevronRightIcon,
  FileCheckIcon,
  LayoutDashboardIcon,
} from "lucide-react";

export default function SignupSuccessPage() {
  const { businessName } = useSignupFlow();

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="flex justify-center">
          <CheckCircle2Icon className="text-primary size-12" />
        </div>
        <CardTitle className="text-xl">Welcome to Paxos</CardTitle>
        <p className="text-muted-foreground text-sm">
          You&apos;ve successfully created a Paxos account for{" "}
          {businessName || "your business"}.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-0">
        <p className="font-medium text-sm">What&apos;s next?</p>
        <div className="flex flex-col gap-3 pt-4 -mx-6 px-6 group-data-[size=sm]/card:-mx-4 group-data-[size=sm]/card:px-4">
          <Link
            href="/dashboard"
            className="bg-card hover:bg-muted/50 border border-border rounded-lg p-4 flex flex-col gap-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-center gap-2">
              <LayoutDashboardIcon className="text-muted-foreground size-4 shrink-0" />
              <span className="font-medium text-sm">Continue to Dashboard</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Start managing your digital assets and explore your account
            </p>
            <span className="text-primary text-sm font-medium inline-flex items-center gap-1">
              Go to Dashboard
              <ChevronRightIcon className="size-4" />
            </span>
          </Link>
          <Link
            href="/dashboard/onboarding"
            className="bg-card hover:bg-muted/50 border border-border rounded-lg p-4 flex flex-col gap-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex items-center gap-2">
              <FileCheckIcon className="text-muted-foreground size-4 shrink-0" />
              <span className="font-medium text-sm">
                Complete business verification
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Submit KYB documents to unlock full account capabilities
            </p>
            <span className="text-primary text-sm font-medium inline-flex items-center gap-1">
              Start verification
              <ChevronRightIcon className="size-4" />
            </span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
