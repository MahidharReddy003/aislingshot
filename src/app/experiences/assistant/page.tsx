
"use client";

import { useState } from "react";
import { conversationalRecommendationAssistant, type ConversationalRecommendationAssistantOutput } from "@/ai/flows/conversational-recommendation-flow";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Speech, Send, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AssistantPage() {
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ConversationalRecommendationAssistantOutput | null>(null);

  const handleAnalyze = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const result = await conversationalRecommendationAssistant({ query });
      setAnalysis(result);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-2 rounded-xl bg-accent/30">
          <Speech className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Conversational Planner</h1>
          <p className="text-muted-foreground">Tell the AI what you're thinking in natural language.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-1 gap-8">
        <Card className="border-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Describe your perfect experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea 
              placeholder="e.g., I'm a student looking for a vegetarian lunch under ₹150 that's wheelchair accessible and quiet enough to study..."
              className="min-h-[120px] resize-none text-lg"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Mention budget, time, or specific needs.
              </p>
              <Button onClick={handleAnalyze} disabled={loading || !query.trim()}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Analyze Logic
              </Button>
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Reasoning Core
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-card">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Category Identified</p>
                <Badge variant="secondary" className="text-sm">{analysis.category || "General"}</Badge>
              </div>
              <div className="p-4 rounded-xl border bg-card">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Budget Constraint</p>
                <p className="text-lg font-semibold text-primary">{analysis.budget || "Not Specified"}</p>
              </div>
              <div className="p-4 rounded-xl border bg-card col-span-full">
                <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Extracted Preferences</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.preferences?.map((p, i) => (
                    <Badge key={i} variant="outline" className="bg-accent/10">{p}</Badge>
                  ))}
                  {(!analysis.preferences || analysis.preferences.length === 0) && <span className="text-sm italic">None identified</span>}
                </div>
              </div>
              {analysis.accessibilityNeeds && (
                <div className="p-4 rounded-xl border border-accent bg-accent/10 col-span-full flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Accessibility Priority</p>
                    <p className="text-sm font-medium">User has specific accessibility requirements</p>
                  </div>
                  <Shield className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>
            
            <div className="p-6 rounded-2xl bg-primary text-primary-foreground text-center">
              <p className="mb-4 text-sm opacity-80 italic">Logic correctly extracted? Now you can see why we recommend specific items based on these constraints.</p>
              <Button variant="secondary" onClick={() => window.location.href='/experiences/recommender'}>
                View Final Recommendation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Shield({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
  );
}
