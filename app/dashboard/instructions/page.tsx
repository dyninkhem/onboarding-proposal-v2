"use client"

import { Suspense, useState } from "react"
import { Search, ListFilter, Plus, ArrowLeftRight, Coins, Landmark, AlertCircle, Check, X } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { AutomateSheet } from "@/components/automate-sheet"

interface Instruction {
  id: string
  name: string
  type: "conversion" | "crypto" | "fiat"
  paxosAccount: string
  details: string
  isActive: boolean
  createdAt: string
  approvedBy: string
  tags?: string[] // Added optional tags field
}

interface PendingInstruction {
  id: string
  name: string
  type: "deposit" | "conversion"
  paxosAccount: string
  details: string
  createdAt: string
  tags?: string[] // Added optional tags field
}

const initialInstructions: Instruction[] = [
  {
    id: "1",
    name: "Auto-convert USD to Stablecoin",
    type: "conversion",
    paxosAccount: "PAXOS-ACC-001",
    details: "USD → USDG",
    isActive: true,
    createdAt: "12/11/2024",
    approvedBy: "Sarah Johnson",
  },
  {
    id: "2",
    name: "GBP to USD Treasury Operations",
    type: "conversion",
    paxosAccount: "PAXOS-ACC-005",
    details: "GBP → USD",
    isActive: false,
    createdAt: "11/11/2024",
    approvedBy: "Emily Rodriguez",
  },
  {
    id: "3",
    name: "Daily USD to USDG Sweep",
    type: "conversion",
    paxosAccount: "PAXOS-ACC-001",
    details: "USD → USDG",
    isActive: true,
    createdAt: "10/14/2024",
    approvedBy: "Sarah Johnson",
  },
  {
    id: "4",
    name: "JPY to USD Trading Desk",
    type: "conversion",
    paxosAccount: "PAXOS-ACC-008",
    details: "JPY → USD",
    isActive: false,
    createdAt: "9/9/2024",
    approvedBy: "Kevin Huang",
  },
  {
    id: "5",
    name: "EUR to USDG Settlement",
    type: "conversion",
    paxosAccount: "PAXOS-ACC-010",
    details: "EUR → USDG",
    isActive: true,
    createdAt: "8/14/2024",
    approvedBy: "Robert Kim",
  },
  {
    id: "6",
    name: "SGD to USD Asia Operations",
    type: "conversion",
    paxosAccount: "PAXOS-ACC-012",
    details: "SGD → USD",
    isActive: true,
    createdAt: "7/17/2024",
    approvedBy: "Thomas Zhang",
  },
  {
    id: "7",
    name: "USDC Deposit Address",
    type: "crypto",
    paxosAccount: "PAXOS-ACC-001",
    details: "Ethereum",
    isActive: true,
    createdAt: "12/1/2024",
    approvedBy: "Sarah Johnson",
  },
  {
    id: "8",
    name: "USDG Deposit Solana",
    type: "crypto",
    paxosAccount: "PAXOS-ACC-003",
    details: "Solana",
    isActive: true,
    createdAt: "11/15/2024",
    approvedBy: "Kevin Huang",
  },
  {
    id: "9",
    name: "BofA Wire Transfers",
    type: "fiat",
    paxosAccount: "PAXOS-ACC-002",
    details: "Bank of America ****5678",
    isActive: true,
    createdAt: "12/14/2024",
    approvedBy: "Emily Rodriguez",
  },
  {
    id: "10",
    name: "Chase Treasury Account",
    type: "fiat",
    paxosAccount: "PAXOS-ACC-004",
    details: "Chase ****1234",
    isActive: false,
    createdAt: "10/20/2024",
    approvedBy: "Robert Kim",
  },
]

function PendingApprovalsTable({
  data,
  onApprove,
  onReject,
}: {
  data: PendingInstruction[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
}) {
  if (data.length === 0) return null

  return (
    <div className="mx-6 mb-6 rounded-lg border bg-card">
      <div className="flex items-center gap-2 p-4 border-b">
        <AlertCircle className="size-5 text-muted-foreground" />
        <span className="font-medium text-foreground">Awaiting Approval ({data.length})</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Paxos Account</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((instruction) => (
            <TableRow key={instruction.id}>
              <TableCell className="font-medium">{instruction.name}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {instruction.type}
                </Badge>
              </TableCell>
              <TableCell>{instruction.paxosAccount}</TableCell>
              <TableCell>{instruction.details}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {instruction.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{instruction.createdAt}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      onApprove(instruction.id)
                    }}
                  >
                    <Check className="size-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      onReject(instruction.id)
                    }}
                  >
                    <X className="size-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function InstructionsTable({
  data,
  onRowClick,
}: { data: Instruction[]; onRowClick: (instruction: Instruction) => void }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Paxos Account</TableHead>
          <TableHead>Direction</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Approved by</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
              No automations found
            </TableCell>
          </TableRow>
        ) : (
          data.map((instruction) => (
            <TableRow
              key={instruction.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => onRowClick(instruction)}
            >
              <TableCell className="font-medium">{instruction.name}</TableCell>
              <TableCell>{instruction.paxosAccount}</TableCell>
              <TableCell>{instruction.details}</TableCell>
              <TableCell>
                {instruction.isActive ? (
                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                    Active
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">Pending</Badge>
                )}
              </TableCell>
              <TableCell>{instruction.createdAt}</TableCell>
              <TableCell className="text-right">{instruction.approvedBy}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

function InstructionsContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("conversions")

  const [isAutomateSheetOpen, setIsAutomateSheetOpen] = useState(false)

  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
  const [selectedInstruction, setSelectedInstruction] = useState<Instruction | null>(null)

  const [pendingInstructions, setPendingInstructions] = useState<PendingInstruction[]>([])
  const [approvedInstructions, setApprovedInstructions] = useState<Instruction[]>(initialInstructions)

  const profiles = [
    { id: "profile-1", name: "Primary Treasury Account" },
    { id: "profile-2", name: "Operations Account" },
    { id: "profile-3", name: "Settlement Account" },
    { id: "profile-4", name: "Trading Desk Account" },
  ]

  const handleRowClick = (instruction: Instruction) => {
    setSelectedInstruction(instruction)
    setIsDetailSheetOpen(true)
  }

  const handleApprove = (id: string) => {
    const pending = pendingInstructions.find((i) => i.id === id)
    if (pending) {
      const newApprovedInstruction: Instruction = {
        id: `approved-${Date.now()}`,
        name: pending.name,
        type: pending.type === "deposit" ? "fiat" : "conversion",
        paxosAccount: pending.paxosAccount,
        details: pending.details,
        isActive: true,
        createdAt: pending.createdAt,
        approvedBy: "Current User",
        tags: pending.tags,
      }
      setApprovedInstructions((prev) => [newApprovedInstruction, ...prev])

      if (pending.type === "deposit") {
        setActiveTab("fiat")
      } else {
        setActiveTab("conversions")
      }
    }
    setPendingInstructions((prev) => prev.filter((i) => i.id !== id))
  }

  const handleReject = (id: string) => {
    setPendingInstructions((prev) => prev.filter((i) => i.id !== id))
  }

  const filterBySearch = (items: Instruction[]) =>
    items.filter(
      (instruction) =>
        instruction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instruction.paxosAccount.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instruction.details.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  const conversionInstructions = filterBySearch(approvedInstructions.filter((i) => i.type === "conversion"))
  const cryptoInstructions = filterBySearch(approvedInstructions.filter((i) => i.type === "crypto"))
  const fiatInstructions = filterBySearch(approvedInstructions.filter((i) => i.type === "fiat"))

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Automations</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="w-full rounded-lg border bg-card">
          <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex flex-col gap-1">
              <h2 className="font-semibold text-foreground text-2xl">Automations</h2>
              <p className="text-sm text-muted-foreground">
                Manage deposit and conversion automations for your Paxos accounts
              </p>
            </div>
            <Button onClick={() => setIsAutomateSheetOpen(true)}>
              <Plus className="size-4" />
              Automate
            </Button>
          </div>

          <Separator />

          <PendingApprovalsTable data={pendingInstructions} onApprove={handleApprove} onReject={handleReject} />

          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <TabsList>
                  <TabsTrigger
                    value="conversions"
                    className="data-[state=active]:border data-[state=active]:border-muted-foreground/50"
                  >
                    <ArrowLeftRight className="size-4" />
                    Conversions
                  </TabsTrigger>
                  <TabsTrigger
                    value="crypto"
                    className="data-[state=active]:border data-[state=active]:border-muted-foreground/50"
                  >
                    <Coins className="size-4" />
                    Crypto Deposit
                  </TabsTrigger>
                  <TabsTrigger
                    value="fiat"
                    className="data-[state=active]:border data-[state=active]:border-muted-foreground/50"
                  >
                    <Landmark className="size-4" />
                    Fiat Deposit
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <InputGroup>
                    <InputGroupAddon>
                      <Search className="size-4" />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="Search"
                      className="w-full sm:w-[200px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </InputGroup>
                  <Button variant="outline">
                    <ListFilter className="size-4" />
                    Filters
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <TabsContent value="conversions">
                  <InstructionsTable data={conversionInstructions} onRowClick={handleRowClick} />
                </TabsContent>
                <TabsContent value="crypto">
                  <InstructionsTable data={cryptoInstructions} onRowClick={handleRowClick} />
                </TabsContent>
                <TabsContent value="fiat">
                  <InstructionsTable data={fiatInstructions} onRowClick={handleRowClick} />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      <AutomateSheet open={isAutomateSheetOpen} onOpenChange={setIsAutomateSheetOpen} />

      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col bg-card">
          <SheetHeader>
            <SheetTitle>{selectedInstruction?.name || "Instruction Details"}</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto py-4 px-4 bg-card">{/* Blank content for now */}</div>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default function InstructionsPage() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center">Loading...</div>}>
      <InstructionsContent />
    </Suspense>
  )
}
