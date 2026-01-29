"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/user-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/review", label: "Roast Code" },
  { href: "/github", label: "GitHub" },
  { href: "/history", label: "History" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <Flame className="h-6 w-6 text-orange-500" />
          <span className="hidden sm:inline">JoyViews</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 mx-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-500",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
