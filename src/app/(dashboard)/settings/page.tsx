"use client";

import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Github, Mail, User } from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();

  const initials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your account information from GitHub
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={session?.user?.image || undefined}
                alt={session?.user?.name || "User"}
              />
              <AvatarFallback className="text-lg">{initials || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium">{session?.user?.name}</p>
              <p className="text-sm text-muted-foreground">
                {session?.user?.email}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground w-24">Name</span>
              <span>{session?.user?.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground w-24">Email</span>
              <span>{session?.user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Github className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground w-24">Provider</span>
              <Badge variant="secondary">GitHub</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>AI Provider Configuration</CardTitle>
          <CardDescription>
            API keys are managed through environment variables
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <span className="font-medium">OpenAI</span>
              <Badge variant="outline">GPT-4o, GPT-4o Mini</Badge>
            </div>
            <Badge
              variant={
                process.env.NEXT_PUBLIC_HAS_OPENAI === "true"
                  ? "success"
                  : "secondary"
              }
            >
              {process.env.NEXT_PUBLIC_HAS_OPENAI === "true"
                ? "Configured"
                : "Not Configured"}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <span className="font-medium">Anthropic</span>
              <Badge variant="outline">Claude 3.5 Sonnet, Haiku</Badge>
            </div>
            <Badge
              variant={
                process.env.NEXT_PUBLIC_HAS_ANTHROPIC === "true"
                  ? "success"
                  : "secondary"
              }
            >
              {process.env.NEXT_PUBLIC_HAS_ANTHROPIC === "true"
                ? "Configured"
                : "Not Configured"}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            To configure AI providers, set the OPENAI_API_KEY and
            ANTHROPIC_API_KEY environment variables.
          </p>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About JoyViews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            JoyViews is an AI-powered code review assistant that helps developers
            write better code.
          </p>
          <p>
            Built with Next.js 14, TypeScript, Tailwind CSS, and powered by
            OpenAI and Anthropic.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
