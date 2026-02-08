"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { InlineError } from "@/components/signup/inline-error";
import { useSignupFlow } from "@/components/signup/signup-flow-context";

export default function SignupTermsPage() {
  const router = useRouter();
  const { email, termsAccepted, updateField } = useSignupFlow();
  const [localTermsAccepted, setLocalTermsAccepted] =
    useState(termsAccepted);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

  const formValid = localTermsAccepted;

  const handleFinish = async () => {
    if (submittingRef.current || !formValid) return;
    submittingRef.current = true;
    setSubmitError(null);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      updateField("termsAccepted", localTermsAccepted);
      router.push("/signup/success");
    } catch (error) {
      setSubmitError("generic");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  const handleBack = () => {
    router.push("/signup/personal");
  };

  useEffect(() => {
    if (!email) router.replace("/signup/email");
  }, [email, router]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Terms & Conditions
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Please review and accept our terms and conditions. Note that these
            terms do not replace those that may be included in separately
            negotiated agreements.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md border">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-medium">Terms and Conditions</span>
              <Button variant="ghost" size="icon" asChild>
                <a
                  href="/terms-and-conditions.pdf"
                  download
                  aria-label="Download Terms and Conditions"
                >
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>
            <div className="h-[360px] overflow-y-auto p-6">
              <div className="space-y-8">
                <div className="flex justify-center">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600" />
                    <span className="text-muted-foreground text-lg font-medium">
                      PAXOS
                    </span>
                  </div>
                </div>

                <h1 className="text-center text-3xl font-semibold text-emerald-600">
                  Paxos Dashboard Terms and Conditions
                </h1>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Table of Contents</h2>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        TERMS AND CONDITIONS FOR PLATFORM SERVICES
                      </span>
                      <span>2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        SCHEDULE 1: PAXOS GLOBAL TERMS AND CONDITIONS
                      </span>
                      <span>15</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        SCHEDULE 2: US DOLLAR-BACKED STABLECOIN TERMS AND
                        CONDITIONS
                      </span>
                      <span>17</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        SCHEDULE 3: PAX GOLD TERMS AND CONDITIONS
                      </span>
                      <span>29</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        SCHEDULE 4: TRADING TERMS AND CONDITIONS
                      </span>
                      <span>38</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        SCHEDULE 5: ANTI-MONEY LAUNDERING/KNOW YOUR CUSTOMER
                        (AML/KYC) DISCLOSURE
                      </span>
                      <span>52</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        SCHEDULE 6: MARKET MANIPULATION PROTECTION
                      </span>
                      <span>55</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-8">
                  <h2 className="text-xl font-bold">
                    TERMS AND CONDITIONS FOR PLATFORM SERVICES
                  </h2>
                  <p className="text-sm leading-relaxed">
                    These Terms and Conditions for Platform Services (these
                    &quot;Terms&quot;) are entered into between Paxos Trust
                    Company, LLC (&quot;PTC&quot;), Paxos International Pte. Ltd.
                    (&quot;PIPL&quot;), Paxos UK Ltd. (&quot;PUK&quot;), Paxos
                    Issuance Europe Oy (&quot;PIE&quot;) and Bruntal S.A. (dba
                    Paxos Uruguay) (&quot;PUY&quot;), (collectively,
                    &quot;Paxos,&quot; &quot;we,&quot; &quot;us&quot; or
                    &quot;our&quot;) and you as a registered user of the Paxos
                    Platform (as defined below) (also referred to herein as a
                    &quot;Customer&quot;). A &quot;Party&quot; means each of Paxos
                    and you.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              Agree to our Terms & Conditions
            </h3>
            {submitError && (
              <InlineError
                error={submitError === "generic" ? "generic" : "unknown"}
              />
            )}
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={localTermsAccepted}
                onCheckedChange={(checked) =>
                  setLocalTermsAccepted(checked === true)
                }
                id="terms"
                className="mt-0.5"
              />
              <span className="text-muted-foreground text-sm">
                I have read and agree to the Paxos General Terms and
                Conditions. <span className="text-destructive">*</span>
              </span>
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={loading}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={handleFinish}
              disabled={!formValid}
              loading={loading}
              className="flex-1"
            >
              Finish
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
