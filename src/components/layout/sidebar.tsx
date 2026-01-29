"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Flame,
  LayoutDashboard,
  FileCode2,
  GitPullRequest,
  History,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/review", label: "Roast Code", icon: Flame },
  { href: "/github", label: "Roast PRs", icon: GitPullRequest },
  { href: "/history", label: "Burn History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-muted/30">
      <div className="flex h-14 items-center gap-2 px-6 border-b">
        <Flame className="h-6 w-6 text-orange-500" />
        <span className="font-bold">JoyViews</span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-orange-500 text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground text-center italic">
          &quot;Your code is bad and you should feel bad&quot;
        </p>
      </div>
    </aside>
  );
}
