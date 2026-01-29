"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

export function LoginButton() {
  return (
    <Button
      onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
      className="w-full"
      size="lg"
    >
      <Github className="mr-2 h-5 w-5" />
      Continue with GitHub
    </Button>
  );
}
