import Link from "next/link"
import { UserPlus, LogIn, LayoutDashboard, Sparkles } from "lucide-react"

export default function ConsolePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-8 bg-background p-8">
      <div className="flex flex-col items-center gap-3">
        <img
          src="/images/paxos-logo.png"
          alt="Paxos"
          height={32}
          style={{ height: 32, width: "auto" }}
        />
        <p className="text-muted-foreground text-sm">Prototype Console</p>
      </div>
      <div className="flex w-full max-w-sm flex-col gap-3">
        <Link
          href="/signup"
          className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <UserPlus className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">Sign Up</span>
            <span className="text-muted-foreground text-xs">
              Create a new Paxos account
            </span>
          </div>
        </Link>
        <Link
          href="/login"
          className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <LogIn className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">Sign In</span>
            <span className="text-muted-foreground text-xs">
              Sign in to your existing account
            </span>
          </div>
        </Link>
        <Link
          href="/dashboard"
          className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <LayoutDashboard className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">Dashboard</span>
            <span className="text-muted-foreground text-xs">
              Go directly to the dashboard
            </span>
          </div>
        </Link>
        <Link
          href="/dashboard?intro=1"
          className="group flex items-center gap-4 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Sparkles className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-sm">Intro Modal</span>
            <span className="text-muted-foreground text-xs">
              Open the intro setup modal on dashboard
            </span>
          </div>
        </Link>
      </div>
    </div>
  )
}
