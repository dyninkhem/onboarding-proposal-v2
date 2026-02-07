"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FingerprintIcon } from "lucide-react";

type PasskeyModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onFailure: () => void;
};

const METHODS = [
  "Face ID (iPhone, Mac)",
  "Touch ID (Mac)",
  "Windows Hello",
  "Android biometrics",
  "Hardware security key",
];

export function PasskeyModal({
  open,
  onOpenChange,
  onSuccess,
  onFailure,
}: PasskeyModalProps) {
  const [simulating, setSimulating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSimulate = async () => {
    setSimulating(true);
    await new Promise((r) => setTimeout(r, 800));
    setSuccess(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSimulating(false);
    setSuccess(false);
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={!simulating}
        className="sm:max-w-md"
        overlayClassName="bg-black/30"
      >
        <DialogHeader>
          <DialogTitle>
            {success ? "Passkey created" : "Creating your passkey"}
          </DialogTitle>
          <DialogDescription>
            {success ? (
              "Your passkey is set up. You can use it to sign in securely."
            ) : (
              <>
                We&apos;ll use your device&apos;s built-in security to create a
                passkey. No passwords to remember.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        {simulating && !success && (
          <div className="space-y-2">
            <div className="bg-muted/50 h-1 w-full overflow-hidden rounded-full">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  animation: "passkey-progress 0.8s ease-out forwards",
                }}
              />
            </div>
            <p className="text-muted-foreground text-center text-sm">
              Creating…
            </p>
          </div>
        )}
        {success && (
          <div
            className="flex flex-col items-center gap-3 py-2"
            style={{
              animation: "passkey-success-in 0.6s ease-out forwards",
            }}
          >
            <FingerprintIcon
              className="text-primary size-10"
              style={{
                animation: "passkey-check-in 0.6s ease-out 0.05s forwards",
                opacity: 0,
              }}
            />
            <p className="text-muted-foreground text-center text-sm">
              Redirecting you to the next step…
            </p>
          </div>
        )}
        {!simulating && !success && (
          <>
            <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
              {METHODS.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <DialogFooter>
              <Button onClick={handleSimulate} disabled={simulating}>
                Simulate Passkey Creation
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
