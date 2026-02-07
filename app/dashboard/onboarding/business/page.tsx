"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CirclePlus, PanelLeft } from "lucide-react"
import { EditBusinessMemberSheet } from "@/components/edit-business-member-sheet"

interface BusinessMember {
  id: string
  name: string
  address: {
    street: string
    city: string
    state: string
    country: string
  }
  userTypes: string[]
}

export default function BusinessMembersPage() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<BusinessMember | null>(null)
  const [isTypesExpanded, setIsTypesExpanded] = useState(false)

  const members: BusinessMember[] = [
    {
      id: "1",
      name: "Jaylen Gadhia",
      address: {
        street: "123 Main St",
        city: "San Francisco",
        state: "CA",
        country: "USA",
      },
      userTypes: ["Account Opener", "Authorized User", "Beneficial Owner (100%)", "Management Control"],
    },
  ]

  const handleEdit = (member: BusinessMember) => {
    setSelectedMember(member)
    setIsSheetOpen(true)
  }

  const handleAddUser = () => {
    setSelectedMember(null)
    setIsSheetOpen(true)
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <PanelLeft className="size-5 text-muted-foreground" />
        <h1 className="text-3xl font-bold text-primary">Business Members</h1>
      </div>

      <p className="text-sm">
        Per regulatory requirements, we must ask you to provide personal details on all{" "}
        <span className="font-semibold">business members</span> of your Paxos entity. There are
        four different types of <span className="font-semibold">business members</span>, we will
        walk you through adding each.
      </p>

      {/* Business Member Types Collapsible */}
      <Card>
        <CardContent className="p-4">
          <button
            onClick={() => setIsTypesExpanded(!isTypesExpanded)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="font-semibold">Business Member Types</span>
            <svg
              className={`size-5 text-muted-foreground transition-transform ${
                isTypesExpanded ? "rotate-180" : ""
              }`}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isTypesExpanded && (
            <p className="mt-2 text-sm italic text-muted-foreground">
              *We'll update status of each type of member once you've added an entry that satisfies
              that requirement.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Full Name (Alias)</TableHead>
                <TableHead className="font-semibold">Residential Address</TableHead>
                <TableHead className="font-semibold">User Types</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {member.address.street}
                      <br />
                      {member.address.city}, {member.address.state}, {member.address.country}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {member.userTypes.map((type, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="link"
                      className="h-auto p-0 text-primary"
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-fit gap-2 bg-transparent"
        onClick={handleAddUser}
      >
        <CirclePlus className="size-4" />
        Add a User
      </Button>

      <EditBusinessMemberSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        member={selectedMember}
      />
    </div>
  )
}
