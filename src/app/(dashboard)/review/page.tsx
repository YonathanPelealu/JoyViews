"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeInput } from "@/components/review/code-input";
import { ProviderSelector } from "@/components/review/provider-selector";
import { ReviewResult } from "@/components/review/review-result";
import { toast } from "@/hooks/use-toast";
import { Loader2, Flame, Skull } from "lucide-react";
import type { ReviewResult as ReviewResultType } from "@/lib/ai/providers";

export default function ReviewPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("auto");
  const [provider, setProvider] = useState("mock");
  const [model, setModel] = useState("mock-roaster");
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ReviewResultType | null>(null);

  const handleSubmit = async () => {
    if (!code.trim()) {
      toast({
        title: "Hold up!",
        description: "You need to actually paste some code to roast",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/ai/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language: language === "auto" ? undefined : language,
          provider,
          model,
          title: title || undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to process roast");
      }

      const data = await response.json();
      setResult(data.result);

      toast({
        title: "Roast Complete! 🔥",
        description: "Your code has been thoroughly destroyed",
      });
    } catch (error) {
      toast({
        title: "Oops!",
        description:
          error instanceof Error ? error.message : "Even the AI couldn't handle your code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Flame className="h-8 w-8 text-orange-500" />
          Roast My Code
        </h1>
        <p className="text-muted-foreground mt-1">
          Paste your code below and prepare to have your feelings hurt (constructively)
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>The Victim (Your Code)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title (optional)</Label>
                <Input
                  id="title"
                  placeholder="e.g., My masterpiece that definitely works"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <CodeInput
                code={code}
                language={language}
                onCodeChange={setCode}
                onLanguageChange={setLanguage}
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Choose Your Roaster</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProviderSelector
                provider={provider}
                model={model}
                onProviderChange={setProvider}
                onModelChange={setModel}
                disabled={isLoading}
              />

              <Button
                onClick={handleSubmit}
                disabled={isLoading || !code.trim()}
                className="w-full bg-orange-500 hover:bg-orange-600"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Preparing savage feedback...
                  </>
                ) : (
                  <>
                    <Flame className="mr-2 h-4 w-4" />
                    Roast This Code
                  </>
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Warning: Our AI has zero chill. Proceed at your own risk.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div>
          {result ? (
            <ReviewResult result={result} />
          ) : (
            <Card className="h-full min-h-[400px] flex items-center justify-center border-dashed border-2 border-orange-500/30">
              <CardContent className="text-center text-muted-foreground">
                <Skull className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Waiting for a victim...</p>
                <p className="text-sm">
                  Paste your code and click &quot;Roast This Code&quot;
                </p>
                <p className="text-xs mt-4 italic">
                  &quot;The code you write today will be the legacy you regret tomorrow&quot;
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
