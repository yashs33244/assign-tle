"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Upcoming",
      href: "/",
      icon: <Calendar className="h-4 w-4 mr-2" />,
      active: pathname === "/",
    },
    {
      label: "Profile",
      href: "/profile",
      icon: <User className="h-4 w-4 mr-2" />,
      active: pathname === "/profile",
    },
    {
      label: "Admin",
      href: "/admin",
      icon: <Settings className="h-4 w-4 mr-2" />,
      active: pathname === "/admin",
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">Contest Tracker</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-2 lg:space-x-4 flex-1 justify-center">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant={item.active ? "default" : "ghost"}
                className={cn(
                  "text-sm",
                  item.active ? "bg-primary text-primary-foreground" : ""
                )}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            </Link>
          ))}
        </nav>
        <div className="flex items-center justify-end space-x-2">
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}
