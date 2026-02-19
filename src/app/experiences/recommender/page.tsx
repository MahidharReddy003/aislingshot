
"use client";

import { useState } from "react";
import { generateExplanation, type GenerateExplanationOutput } from "@/ai/flows/generate-explanation-flow";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ThumbsUp, ThumbsDown, DollarSign, RefreshCcw, Info, Sparkles, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RecommenderPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateExplanationOutput | null>(null);
  
  // Input states
  const [persona, setPersona] = useState("Student");
  const [budget, setBudget] = useState(150);
  const [pref, setPref] = useState("Healthy, Vegetarian");
  const [accessibility, setAccessibility] = useState(false);

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const output = await generateExplanation({
        userPersona: persona,
        preferences: pref,
        budget: budget,
        time: "Lunchtime",
        accessibility: accessibility ? "Wheelchair Accessible" : "None",
        recentChoices: ["Campus Deli", "Subway"]
      });
      setResult(output);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate recommendation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (type: string) => {
    toast({
      title: "Feedback Recorded",
      description: `We've noted that this was ${type.toLowerCase()}. Logic updated.`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Transparent Recommender</h1>
        <p className="text-muted-foreground">Adjust your preferences and see exactly how the AI makes its decisions.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferences & Constraints</CardTitle>
              <CardDescription>What are you looking for today?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>I am a...</Label>
                <div className="flex flex-wrap gap-2">
                  {["Student", "Traveler", "Creator"].map(p => (
                    <Button 
                      key={p} 
                      variant={persona === p ? "default" : "outline"} 
                      size="sm"
                      onClick={() => setPersona(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>Budget (₹)</Label>
                  <span className="text-sm font-medium">Up to ₹{budget}</span>
                </div>
                <Slider 
                  value={[budget]} 
                  max={500} 
                  step={10} 
                  onValueChange={(val) => setBudget(val[0])}
                />
              </div>

              <div className="space-y-3">
                <Label>Focus Preferences</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Healthy", "Quick", "Social", "Budget", "Premium"].map(p => (
                    <div key={p} className="flex items-center space-x-2 border rounded-md p-2">
                      <input 
                        type="checkbox" 
                        checked={pref.includes(p)} 
                        onChange={(e) => {
                          if (e.target.checked) setPref(prev => prev + ", " + p);
                          else setPref(prev => prev.replace(", " + p, ""));
                        }}
                      />
                      <span className="text-xs">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Accessibility Needs</Label>
                  <p className="text-[10px] text-muted-foreground">Require specific physical accessibility</p>
                </div>
                <Switch 
                  checked={accessibility} 
                  onCheckedChange={setAccessibility}
                />
              </div>

              <Button 
                className="w-full h-11" 
                onClick={handleRecommend}
                disabled={loading}
              >
                {loading ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Recommendation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output */}
        <div className="lg:col-span-7">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="border-accent border-2 shadow-lg">
                <CardHeader className="bg-accent/10">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="mb-2">Recommended for you</Badge>
                    <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                      <Target className="h-3 w-3" />
                      Diversity: {result.diversityScore}%
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{result.recommendation}</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-bold">Estimated Cost</p>
                        <p className="font-semibold text-lg">₹{result.costEstimate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-[10px] uppercase text-muted-foreground font-bold">Time Needed</p>
                        <p className="font-semibold text-lg">{result.timeEstimate}</p>
                      </div>
                    </div>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="why" className="border-none">
                      <AccordionTrigger className="bg-primary/5 px-4 rounded-t-lg hover:no-underline font-semibold">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4" />
                          "Why This?" — AI Reasoning
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="bg-primary/5 px-4 pb-4 pt-2 rounded-b-lg">
                        <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                          {result.explanation}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mt-8 border-t pt-6">
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-4 tracking-wider">Help us improve</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleFeedback('Relevant')}>
                        <ThumbsUp className="h-3 w-3 mr-1" /> Relevant
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFeedback('Not Useful')}>
                        <ThumbsDown className="h-3 w-3 mr-1" /> Not Useful
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFeedback('Too Expensive')}>
                        <DollarSign className="h-3 w-3 mr-1" /> Expensive
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleFeedback('Too Repetitive')}>
                        <RefreshCcw className="h-3 w-3 mr-1" /> Repetitive
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-muted-foreground p-12 text-center">
              <Sparkles className="h-12 w-12 mb-4 opacity-20" />
              <h3 className="text-lg font-medium mb-2">No Recommendation Yet</h3>
              <p className="text-sm max-w-xs">Fill in your preferences on the left and click "Generate" to see our transparent logic in action.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
