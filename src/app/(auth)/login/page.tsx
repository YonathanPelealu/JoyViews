import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/auth/login-button";
import { Flame, Zap, MessageSquare, GitBranch } from "lucide-react";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-500 to-red-600 p-12 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Flame className="h-8 w-8" />
            JoyViews
          </h1>
          <p className="text-white/80 mt-2">
            Code Roasting as a Service
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                Instant Roasts
              </h3>
              <p className="text-white/70 text-sm">
                Our AI will tear your code apart faster than you can say &ldquo;it works on my machine&rdquo;
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                Savage but Helpful
              </h3>
              <p className="text-white/70 text-sm">
                Every roast comes with real feedback. We hurt your feelings AND make you better.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-white/10 rounded-lg">
              <GitBranch className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                GitHub Integration
              </h3>
              <p className="text-white/70 text-sm">
                Roast your PRs before your teammates do it for you
              </p>
            </div>
          </div>
        </div>

        <p className="text-white/60 text-sm">
          For developers who can take a joke (and some constructive criticism)
        </p>
      </div>

      {/* Right side - Login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:hidden">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              <Flame className="h-8 w-8 text-orange-500" />
              JoyViews
            </h1>
            <p className="text-muted-foreground mt-2">
              Code Roasting as a Service
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Ready to get roasted?</h2>
              <p className="text-muted-foreground mt-2">
                Sign in to submit your code to the roast
              </p>
            </div>

            <LoginButton />

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                By signing in, you accept that your code will be judged harshly but fairly.
              </p>
              <p className="text-xs text-muted-foreground">
                Side effects may include: improved code quality, wounded pride, and uncontrollable laughter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
