import Image from "next/image";

import { SignupFlowProvider } from "@/components/signup/signup-flow-context";

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SignupFlowProvider>
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
            {children}
          </div>
        </div>
      </div>
    </SignupFlowProvider>
  );
}
