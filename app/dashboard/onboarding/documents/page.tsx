"use client"

import { useState } from "react"
import { FileText, Plus, Pencil, Eye, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type DocumentStatus = "approved" | "under_review" | "pending" | "expired"

interface Document {
  id: string
  name: string
  category: string
  dateUploaded: string
  uploadedBy: string
  status: DocumentStatus
}

const documents: Document[] = [
  {
    id: "1",
    name: "Ownership Structure",
    category: "Corporate Documents",
    dateUploaded: "2/14/2024",
    uploadedBy: "John Smith",
    status: "approved",
  },
  {
    id: "2",
    name: "Articles of Incorporation",
    category: "Corporate Documents",
    dateUploaded: "2/9/2024",
    uploadedBy: "Sarah Johnson",
    status: "approved",
  },
  {
    id: "3",
    name: "Proof of Address",
    category: "Verification Documents",
    dateUploaded: "2/29/2024",
    uploadedBy: "Michael Brown",
    status: "under_review",
  },
  {
    id: "4",
    name: "Proof of Funds",
    category: "Financial Documents",
    dateUploaded: "3/4/2024",
    uploadedBy: "Emily Davis",
    status: "pending",
  },
  {
    id: "5",
    name: "Sarah Johnson - ID",
    category: "Identity Documents",
    dateUploaded: "1/19/2024",
    uploadedBy: "Sarah Johnson",
    status: "expired",
  },
  {
    id: "6",
    name: "Paxos Terms & Conditions",
    category: "Legal Documents",
    dateUploaded: "2/14/2024",
    uploadedBy: "System Admin",
    status: "approved",
  },
  {
    id: "7",
    name: "Paxos Pricing",
    category: "Financial Documents",
    dateUploaded: "2/29/2024",
    uploadedBy: "System Admin",
    status: "approved",
  },
]

const statusConfig: Record<
  DocumentStatus,
  { label: string; className: string }
> = {
  approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  under_review: {
    label: "Under Review",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  pending: {
    label: "Pending",
    className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  },
  expired: {
    label: "Expired",
    className: "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
  },
}

function StatusBadge({ status }: { status: DocumentStatus }) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  )
}

export default function DocumentsPage() {
  const [docs] = useState<Document[]>(documents)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2 text-base font-medium">
            <FileText className="size-5" />
            Documents
          </CardTitle>
          <Button size="sm" variant="outline">
            <Plus className="size-4" />
            Upload Document
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-xs font-medium text-muted-foreground">Name</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Category</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Date Uploaded</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Uploaded By</TableHead>
                <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.name}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.category}</TableCell>
                  <TableCell className="text-muted-foreground tabular-nums">{doc.dateUploaded}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.uploadedBy}</TableCell>
                  <TableCell>
                    <StatusBadge status={doc.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8">
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8">
                        <Eye className="size-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8">
                        <Download className="size-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
