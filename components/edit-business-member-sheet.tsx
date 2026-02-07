"use client"

import { useState } from "react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Save } from "lucide-react"

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

interface EditBusinessMemberSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member: BusinessMember | null
}

export function EditBusinessMemberSheet({
  open,
  onOpenChange,
  member,
}: EditBusinessMemberSheetProps) {
  const [isAccountOpener, setIsAccountOpener] = useState(false)
  const [isBeneficialOwner, setIsBeneficialOwner] = useState("yes")
  const [isAuthorizedUser, setIsAuthorizedUser] = useState("yes")
  const [hasManagementControl, setHasManagementControl] = useState("yes")

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Edit Business Member</SheetTitle>
          <SheetDescription>
            Please provide personal details on all business members of your Paxos entity.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Account Opener Checkbox */}
          <div className="flex items-center space-x-2 rounded-lg bg-muted/50 p-4">
            <Checkbox
              id="account-opener"
              checked={isAccountOpener}
              onCheckedChange={(checked) => setIsAccountOpener(checked === true)}
            />
            <Label htmlFor="account-opener" className="text-sm font-normal">
              This entry is for me, the account opener.
            </Label>
          </div>

          {/* Member Identification Section */}
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <div>
              <h3 className="text-base font-semibold">Member Identification</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Please ensure that the name entered below matches exactly how it appears on
                your/their ID.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="first-name">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="first-name"
                  defaultValue={member ? member.name.split(" ")[0] : ""}
                  placeholder="Enter first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="middle-name">Middle Name / Initial</Label>
                <Input id="middle-name" placeholder="Enter middle name or initial" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="last-name">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="last-name"
                defaultValue={member ? member.name.split(" ")[1] : ""}
                placeholder="Enter last name"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nationality">
                  Nationality <span className="text-destructive">*</span>
                </Label>
                <Select defaultValue="us">
                  <SelectTrigger id="nationality">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob">
                  Date of Birth <span className="text-destructive">*</span>
                </Label>
                <Select defaultValue="1986-02-04">
                  <SelectTrigger id="dob">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1986-02-04">1986-02-04</SelectItem>
                    <SelectItem value="1990-01-01">1990-01-01</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="id-country">
                  ID Country <span className="text-destructive">*</span>
                </Label>
                <Select defaultValue="us">
                  <SelectTrigger id="id-country">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="id-type">
                  ID Type <span className="text-destructive">*</span>
                </Label>
                <Select defaultValue="ssn">
                  <SelectTrigger id="id-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ssn">SSN</SelectItem>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="drivers-license">Driver's License</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="id-number">
                  ID <span className="text-destructive">*</span>
                </Label>
                <Input id="id-number" defaultValue="670-39-3999" placeholder="Enter ID number" />
                <p className="text-xs text-muted-foreground">
                  Format: xxxxxxxxx or xxx-xx-xxxx
                </p>
              </div>
            </div>
          </div>

          {/* Residence Address Section */}
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <h3 className="text-base font-semibold">Residence Address</h3>

            <div className="space-y-2">
              <Label htmlFor="country">
                Country <span className="text-destructive">*</span>
              </Label>
              <Select defaultValue="us">
                <SelectTrigger id="country">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="uk">United Kingdom</SelectItem>
                  <SelectItem value="ca">Canada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address-line-1">
                  Address Line 1 <span className="text-destructive">*</span>
                </Label>
                <Select defaultValue="123-main">
                  <SelectTrigger id="address-line-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="123-main">123 Main St</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address-line-2">Address Line 2</Label>
                <Input id="address-line-2" placeholder="Apt, suite, etc." />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">
                State / Province <span className="text-destructive">*</span>
              </Label>
              <Select defaultValue="ca">
                <SelectTrigger id="state">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">
                  City <span className="text-destructive">*</span>
                </Label>
                <Input id="city" defaultValue="San Francisco" placeholder="Enter city" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zip">
                  ZIP Code <span className="text-destructive">*</span>
                </Label>
                <Input id="zip" defaultValue="94105-1804" placeholder="Enter ZIP code" />
              </div>
            </div>
          </div>

          {/* Member Types Section */}
          <div className="space-y-4 rounded-lg border bg-card p-6">
            <div>
              <h3 className="text-base font-semibold">Member Types</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                A member must be assigned at least 1 user type below, but they may also have
                multiple types assigned to them.
              </p>
            </div>

            {/* Beneficial Owner Designation */}
            <div className="space-y-4 border-t pt-4">
              <h4 className="text-sm font-semibold">Beneficial Owner Designation</h4>

              <div className="space-y-3">
                <Label>
                  Is this person a beneficial owner (as described above)?
                  <span className="text-destructive">*</span>
                </Label>
                <RadioGroup value={isBeneficialOwner} onValueChange={setIsBeneficialOwner}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="bo-yes" />
                    <Label htmlFor="bo-yes" className="font-normal">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="bo-no" />
                    <Label htmlFor="bo-no" className="font-normal">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {isBeneficialOwner === "yes" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="bo-industry">
                        Employment Industry Sector <span className="text-destructive">*</span>
                      </Label>
                      <Select defaultValue="agriculture">
                        <SelectTrigger id="bo-industry">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="agriculture">Agriculture</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bo-wealth">
                        Source of Wealth <span className="text-destructive">*</span>
                      </Label>
                      <Select defaultValue="employment">
                        <SelectTrigger id="bo-wealth">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="employment">Employment Income</SelectItem>
                          <SelectItem value="investment">Investment Income</SelectItem>
                          <SelectItem value="inheritance">Inheritance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownership">% of Ownership</Label>
                    <Input id="ownership" type="number" defaultValue="100" placeholder="Enter percentage" />
                  </div>
                </>
              )}
            </div>

            {/* Authorized User Designation */}
            <div className="space-y-4 border-t pt-4">
              <div>
                <h4 className="text-sm font-semibold">Authorized User Designation</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  An authorized user is a natural person authorized to submit instructions and
                  otherwise act on behalf of the institution. Users in roles that move fiat or
                  crypto balances (Ex: Treasurers) that intend to use the product must also be
                  added as Authorized Users.
                </p>
              </div>

              <div className="space-y-3">
                <Label>
                  Is this person an authorized user as described above?
                  <span className="text-destructive">*</span>
                </Label>
                <RadioGroup value={isAuthorizedUser} onValueChange={setIsAuthorizedUser}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="au-yes" />
                    <Label htmlFor="au-yes" className="font-normal">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="au-no" />
                    <Label htmlFor="au-no" className="font-normal">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Management Control Designation */}
            <div className="space-y-4 border-t pt-4">
              <div>
                <h4 className="text-sm font-semibold">Persons with Management Control Designation</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-semibold">
                    You'll need to designate one of your entity users as a person with management
                    control.
                  </span>{" "}
                  This user should have significant responsibility to manage, control or direct the
                  legal entity, such as an executive officer or senior manager or any other
                  individual who regularly performs similar functions (e.g., Chief Executive
                  Officer, Chief Financial Officer, Chief Operating Officer, Managing Member,
                  General Partner, President, Vice President, or Treasurer).
                </p>
              </div>

              <div className="space-y-3">
                <Label>
                  Is this user a person with management control (as described above)?
                  <span className="text-destructive">*</span>
                </Label>
                <RadioGroup
                  value={hasManagementControl}
                  onValueChange={setHasManagementControl}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="mc-yes" />
                    <Label htmlFor="mc-yes" className="font-normal">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="mc-no" />
                    <Label htmlFor="mc-no" className="font-normal">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {hasManagementControl === "yes" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="mc-industry">
                      Employment Industry Sector <span className="text-destructive">*</span>
                    </Label>
                    <Select defaultValue="agriculture">
                      <SelectTrigger id="mc-industry">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agriculture">Agriculture</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mc-wealth">
                      Source of Wealth <span className="text-destructive">*</span>
                    </Label>
                    <Select defaultValue="employment">
                      <SelectTrigger id="mc-wealth">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="employment">Employment Income</SelectItem>
                        <SelectItem value="investment">Investment Income</SelectItem>
                        <SelectItem value="inheritance">Inheritance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 border-t pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button className="gap-2">
              <Save className="size-4" />
              Save
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
