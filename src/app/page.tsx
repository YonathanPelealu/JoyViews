import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AnimatedRoasts } from "@/components/landing/animated-roasts";
import { AnimatedCounter } from "@/components/landing/animated-counter";
import {
  Flame,
  Zap,
  GitBranch,
  Github,
  Skull,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Code2,
  Trophy,
  Users,
  Star,
} from "lucide-react";

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-float-delayed" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <div className="relative">
              <Flame className="h-8 w-8 text-orange-500 animate-pulse" />
              <div className="absolute inset-0 h-8 w-8 bg-orange-500/20 rounded-full blur-md" />
            </div>
            <span className="gradient-text font-extrabold">JoyViews</span>
          </div>
          <Link href="/login">
            <Button className="bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all">
              <Github className="mr-2 h-4 w-4" />
              Sign in
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 lg:py-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              {/* Floating Emojis */}
              <div className="flex justify-center items-center gap-4 md:gap-8 mb-8">
                <span className="text-5xl md:text-7xl animate-float">🔥</span>
                <span className="text-5xl md:text-7xl animate-float-delayed animation-delay-200">💀</span>
                <span className="text-5xl md:text-7xl animate-float animation-delay-400">🎤</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight animate-fade-in-up">
                Get Your Code
                <br />
                <span className="gradient-text">Absolutely Roasted</span>
              </h1>

              {/* Subheading */}
              <p className="mt-6 text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
                AI-powered code reviews with the brutal honesty of a stand-up comedian.
                <span className="font-semibold text-foreground"> Your ego may not survive.</span>
              </p>

              {/* CTA Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
                <Link href="/login">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-lg px-8 py-6 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105 transition-all animate-pulse-glow"
                  >
                    <Flame className="mr-2 h-5 w-5" />
                    Roast My Code
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="#how-it-works">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto text-lg px-8 py-6 hover:bg-muted hover-lift"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    See How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground animate-fade-in-up animation-delay-400">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <Code2 className="h-4 w-4 text-orange-500" />
                  <span>GPT-4 & Claude</span>
                </div>
                <div className="flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  <span>GitHub Integration</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Animated Roasts Showcase */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Live Roasts Preview 🎤
              </h2>
              <p className="text-muted-foreground">Real savage feedback from our AI</p>
            </div>
            <AnimatedRoasts />
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center hover-lift p-6 rounded-2xl bg-background/50">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text">
                  <AnimatedCounter end={10000} suffix="+" />
                </div>
                <p className="text-muted-foreground mt-2">Lines Roasted</p>
              </div>
              <div className="text-center hover-lift p-6 rounded-2xl bg-background/50">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text">
                  <AnimatedCounter end={500} suffix="+" />
                </div>
                <p className="text-muted-foreground mt-2">Devs Humbled</p>
              </div>
              <div className="text-center hover-lift p-6 rounded-2xl bg-background/50">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text">
                  <AnimatedCounter end={99} suffix="%" />
                </div>
                <p className="text-muted-foreground mt-2">Savage Rate</p>
              </div>
              <div className="text-center hover-lift p-6 rounded-2xl bg-background/50">
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text">
                  <AnimatedCounter end={100} suffix="%" />
                </div>
                <p className="text-muted-foreground mt-2">Actually Helpful</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Why Get <span className="gradient-text">Roasted</span> by Us?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Because constructive criticism is boring. We make it entertaining AND educational.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {/* Feature 1 */}
              <div className="group p-8 rounded-2xl border bg-background/50 hover-lift hover:border-orange-500/50 transition-all">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Instant Roasts</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get brutally honest feedback in seconds. Our AI doesn&apos;t hold back -
                  it finds every bug, bad practice, and questionable life choice in your code.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group p-8 rounded-2xl border bg-background/50 hover-lift hover:border-orange-500/50 transition-all">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">Actually Helpful</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Behind every savage roast is real technical feedback. We make you laugh
                  while teaching you to write better code. Like having a comedian senior dev.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group p-8 rounded-2xl border bg-background/50 hover-lift hover:border-orange-500/50 transition-all">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <GitBranch className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">GitHub Integration</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect your GitHub and let us roast your pull requests directly.
                  Your teammates will thank you (or maybe not).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                How It <span className="gradient-text">Works</span>
              </h2>
              <p className="text-lg text-muted-foreground">Four simple steps to enlightenment (and humiliation)</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { emoji: "📝", step: "1", title: "Paste Code", desc: "Drop your code (if you dare)" },
                { emoji: "🤖", step: "2", title: "AI Analyzes", desc: "GPT-4 or Claude judges you" },
                { emoji: "🔥", step: "3", title: "Get Roasted", desc: "Receive savage feedback" },
                { emoji: "📈", step: "4", title: "Level Up", desc: "Actually learn something" },
              ].map((item, index) => (
                <div
                  key={item.step}
                  className="relative text-center group"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Connector line */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-orange-500/50 to-transparent" />
                  )}

                  <div className="relative">
                    <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">
                      {item.emoji}
                    </div>
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial/Social Proof */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Developers Say
              </h2>
              <p className="text-muted-foreground">After their egos recovered</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { quote: "I've never laughed so hard while crying about my code quality.", name: "Anonymous Dev", role: "Survivor" },
                { quote: "It called my function 'a war crime against readability'. It wasn't wrong.", name: "Humbled Engineer", role: "Reformed" },
                { quote: "10/10 would get roasted again. My code is actually better now.", name: "Repeat Offender", role: "Masochist" },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl border bg-background/50 hover-lift"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="italic text-muted-foreground mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-3xl mx-auto text-center">
              {/* Decorative elements */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <Skull className="h-20 w-20 text-orange-500 animate-bounce-subtle" />
              </div>

              <div className="pt-16">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                  Ready to Face the <span className="gradient-text">Truth</span>?
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
                  Your code isn&apos;t going to roast itself. Sign in with GitHub and
                  let our AI comedian tear your code apart (constructively).
                </p>

                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600 text-lg px-10 py-7 shadow-2xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 transition-all animate-pulse-glow"
                  >
                    <Github className="mr-2 h-5 w-5" />
                    Bring It On
                    <Flame className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <p className="mt-6 text-sm text-muted-foreground">
                  Free to use. No credit card required. Just thick skin.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-semibold">JoyViews</span>
              <span>- Code Roasting as a Service</span>
            </div>
            <p>Built with Next.js and zero chill 🔥</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
