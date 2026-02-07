"use client"

import { useEffect, useState } from "react"
import type * as React from "react"
import type { LucideIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Switch } from "@/components/ui/switch"
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isToggle?: boolean
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && resolvedTheme) {
      setIsDark(resolvedTheme === "dark")
    }
  }, [mounted, resolvedTheme])

  const handleRowClick = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    setTheme(newIsDark ? "dark" : "light")
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.isToggle ? (
                <div
                  className="flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer"
                  onClick={handleRowClick}
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="size-4" />
                    <span>{item.title}</span>
                  </div>
                  <Switch className="scale-75 pointer-events-none" checked={isDark} onCheckedChange={() => {}} />
                </div>
              ) : (
                <a
                  href={item.url}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </a>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
