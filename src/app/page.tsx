import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Zap,
  Shield,
  GitBranch,
  ChevronRight,
  Github,
  Skull,
  MessageSquare,
} from "lucide-react";

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Flame className="h-7 w-7 text-orange-500" />
            JoyViews
          </div>
          <Link href="/login">
            <Button>
              <Github className="mr-2 h-4 w-4" />
              Sign in with GitHub
            </Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="py-20 md:py-32 bg-gradient-to-b from-orange-500/5 to-transparent">
          <div className="container text-center space-y-6">
            <div className="flex justify-center gap-2 text-6xl mb-4">
              <span>🔥</span>
              <span>💀</span>
              <span>🎤</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Get Your Code
              <br />
              <span className="text-orange-500">Absolutely Roasted</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered code reviews with the brutal honesty of a stand-up comedian.
              We&apos;ll destroy your code with savage feedback that&apos;s actually helpful.
              <span className="font-semibold"> Warning: Your ego may not survive.</span>
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Roast My Code
                  <Flame className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  See Examples
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Sample Roasts */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-2xl font-bold text-center mb-8">
              Sample Roasts From Our AI 🎤
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-background p-4 rounded-lg border border-orange-500/20">
                <p className="italic text-muted-foreground">
                  &ldquo;This code has more bugs than a rainforest. Did you write this with your eyes closed?&rdquo;
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg border border-orange-500/20">
                <p className="italic text-muted-foreground">
                  &ldquo;I&apos;ve seen better error handling in a toddler&apos;s first HTML page.&rdquo;
                </p>
              </div>
              <div className="bg-background p-4 rounded-lg border border-orange-500/20">
                <p className="italic text-muted-foreground">
                  &ldquo;This function is so long, it needs its own zip code.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Get Roasted by Us?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-background p-6 rounded-lg border">
                <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Roasts</h3>
                <p className="text-muted-foreground">
                  Get brutally honest feedback in seconds. Our AI doesn&apos;t hold back -
                  it&apos;ll find every bug, bad practice, and questionable life choice in your code.
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg border">
                <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Actually Helpful
                </h3>
                <p className="text-muted-foreground">
                  Behind every savage roast is real technical feedback. We&apos;ll make you
                  laugh while teaching you to write better code. It&apos;s like having a
                  comedian senior dev.
                </p>
              </div>

              <div className="bg-background p-6 rounded-lg border">
                <div className="h-12 w-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-4">
                  <GitBranch className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  GitHub Integration
                </h3>
                <p className="text-muted-foreground">
                  Connect your GitHub and let us roast your pull requests directly.
                  Your teammates will thank you (or maybe not).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl mb-3">📝</div>
                <h3 className="font-semibold mb-1">1. Paste Code</h3>
                <p className="text-sm text-muted-foreground">Drop your code (if you dare)</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🤖</div>
                <h3 className="font-semibold mb-1">2. AI Analyzes</h3>
                <p className="text-sm text-muted-foreground">GPT-4 or Claude judges you</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🔥</div>
                <h3 className="font-semibold mb-1">3. Get Roasted</h3>
                <p className="text-sm text-muted-foreground">Receive savage feedback</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📈</div>
                <h3 className="font-semibold mb-1">4. Improve</h3>
                <p className="text-sm text-muted-foreground">Actually learn something</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20">
          <div className="container text-center space-y-6">
            <Skull className="h-16 w-16 mx-auto text-orange-500" />
            <h2 className="text-3xl font-bold">Ready to Face the Truth?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Your code isn&apos;t going to roast itself. Sign in with GitHub and
              let our AI comedian tear your code apart (constructively).
            </p>
            <Link href="/login">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                <Github className="mr-2 h-4 w-4" />
                Bring It On
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">
              Free to use. No credit card required. Just thick skin.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            JoyViews - Code Roasting as a Service
          </div>
          <p>Built with Next.js and zero chill</p>
        </div>
      </footer>
    </div>
  );
}
