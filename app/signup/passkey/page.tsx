"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InlineError } from "@/components/signup/inline-error";
import { PasskeyModal } from "@/components/signup/passkey-modal";
import { useSignupFlow } from "@/components/signup/signup-flow-context";
import { ShieldIcon } from "lucide-react";

export default function SignupPasskeyPage() {
  const router = useRouter();
  const { email } = useSignupFlow();
  const [modalOpen, setModalOpen] = useState(false);
  const [passkeyError, setPasskeyError] = useState(false);
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);

  const handlePasskeySuccess = () => {
    router.push("/signup/business");
  };

  const handlePasskeyFailure = () => {
    setPasskeyError(true);
  };

  const handleCreatePasskey = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setPasskeyError(false);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setModalOpen(true);
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  };

  useEffect(() => {
    if (!email) router.replace("/signup/email");
  }, [email, router]);

  if (!email) return null;

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create a passkey</CardTitle>
          <p className="text-muted-foreground text-sm">
            You&apos;ll need to create a passkey to sign in securely.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-0">
          {passkeyError && (
            <InlineError
              title="Couldn't create passkey"
              message="We weren't able to create a passkey on this device"
              helper="Make sure your device supports passkeys and try again. You may need to enable biometrics or set up a device PIN"
              actions={
                <>
                  <Button
                    variant="default"
                    size="nova"
                    onClick={() => {
                      setPasskeyError(false);
                      setModalOpen(true);
                    }}
                  >
                    Try again
                  </Button>
                  <a
                    href="https://support.google.com/accounts/answer/13548313"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm underline underline-offset-4 hover:no-underline"
                  >
                    Learn more about passkeys
                  </a>
                </>
              }
            />
          )}
          <div className="bg-muted/50 flex items-start gap-2 rounded-md border p-4 text-sm">
            <ShieldIcon className="size-4 shrink-0 mt-0.5" />
            <p className="text-muted-foreground">
              A passkey is a phishing-resistant way to sign in. It uses your
              device&apos;s biometrics or PIN instead of a password, so
              it&apos;s more secure and easier to use.
            </p>
          </div>
          <div className="pt-4">
            <Button
              className="w-full"
              onClick={handleCreatePasskey}
              loading={loading}
            >
              Create Passkey
            </Button>
          </div>
        </CardContent>
      </Card>
      <PasskeyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handlePasskeySuccess}
        onFailure={handlePasskeyFailure}
      />
    </>
  );
}
