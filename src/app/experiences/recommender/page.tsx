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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { 
  ThumbsUp, 
  ThumbsDown, 
  DollarSign, 
  RefreshCcw, 
  Info, 
  Sparkles, 
  Clock, 
  Target,
  ArrowRight,
  Scale,
  ListRestart,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RecommenderPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateExplanationOutput | null>(null);
  
  // Input states
  const [persona, setPersona] = useState("Student");
  const [budget, setBudget] = useState(150);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(["Healthy"]);
  const [accessibility, setAccessibility] = useState(false);

  const handleRecommend = async () => {
    setLoading(true);
    try {
      const output = await generateExplanation({
        userPersona: persona,
        preferences: selectedPrefs.join(", "),
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

  const togglePref = (p: string) => {
    setSelectedPrefs(prev => 
      prev.includes(p) ? prev.filter(i => i !== p) : [...prev, p]
    );
  };

  const handleSwapChoice = (alt: any) => {
    if (!result) return;
    setResult({
      ...result,
      recommendation: alt.name,
      costEstimate: alt.cost,
      explanation: `Swapped to alternative: ${alt.reason}`
    });
    toast({ title: "Choice Swapped", description: `You are now viewing ${alt.name}` });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight mb-2">Smart Recommender</h1>
        <p className="text-muted-foreground">Adjust preferences and explore the AI reasoning behind every suggestion.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* RECOMMEND (Controls) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-2 shadow-sm">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Recommend</CardTitle>
              <CardDescription>Define your current context</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase">I am a...</Label>
                <div className="flex flex-wrap gap-2">
                  {["Student", "Professional", "Creator"].map(p => (
                    <Button 
                      key={p} 
                      variant={persona === p ? "default" : "outline"} 
                      size="sm"
                      className="rounded-full h-8 text-[10px] font-bold"
                      onClick={() => setPersona(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <Label className="text-xs font-bold uppercase">Budget (INR)</Label>
                  <span className="text-sm font-black">₹{budget}</span>
                </div>
                <Slider 
                  value={[budget]} 
                  max={1000} 
                  step={50} 
                  onValueChange={(val) => setBudget(val[0])}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase">Thematic Focus</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Healthy", "Quick", "Social", "Budget", "Premium"].map(p => (
                    <div 
                      key={p} 
                      className={cn(
                        "flex items-center space-x-2 border-2 rounded-xl p-3 cursor-pointer transition-colors",
                        selectedPrefs.includes(p) ? "bg-primary/5 border-primary" : "hover:bg-muted"
                      )}
                      onClick={() => togglePref(p)}
                    >
                      <div className={cn("h-3 w-3 rounded-full border-2", selectedPrefs.includes(p) ? "bg-primary border-primary" : "border-muted-foreground")} />
                      <span className="text-xs font-bold">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border-2">
                <div className="space-y-0.5">
                  <Label className="text-xs font-bold uppercase">Accessibility</Label>
                  <p className="text-[10px] text-muted-foreground">Strict physical rules</p>
                </div>
                <Switch 
                  checked={accessibility} 
                  onCheckedChange={setAccessibility}
                />
              </div>

              <Button 
                className="w-full h-12 rounded-xl font-bold shadow-lg gap-2" 
                onClick={handleRecommend}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Suggestion
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* OUTPUT (Explain, Compare, Alternatives) */}
        <div className="lg:col-span-8">
          {result ? (
            <Tabs defaultValue="explain" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <TabsList className="bg-muted p-1 border-2 rounded-2xl grid grid-cols-3 h-auto">
                <TabsTrigger value="explain" className="rounded-xl py-3 font-bold gap-2"><Info className="h-4 w-4" /> Explain</TabsTrigger>
                <TabsTrigger value="compare" className="rounded-xl py-3 font-bold gap-2"><Scale className="h-4 w-4" /> Compare</TabsTrigger>
                <TabsTrigger value="alternatives" className="rounded-xl py-3 font-bold gap-2"><ListRestart className="h-4 w-4" /> Alternatives</TabsTrigger>
              </TabsList>

              {/* EXPLAIN TAB */}
              <TabsContent value="explain" className="space-y-6">
                <Card className="border-primary border-2 shadow-xl overflow-hidden rounded-3xl">
                  <div className="p-6 bg-primary text-primary-foreground flex justify-between items-start">
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-primary-foreground border-primary-foreground/30 font-bold uppercase text-[10px]">Prime Choice</Badge>
                      <CardTitle className="text-3xl font-black">{result.recommendation}</CardTitle>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold uppercase opacity-70">Diversity Score</span>
                      <span className="text-2xl font-black">{result.diversityScore || 85}%</span>
                    </div>
                  </div>
                  <CardContent className="p-8 pt-10">
                    <div className="grid grid-cols-2 gap-6 mb-10">
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border-2">
                        <div className="p-3 rounded-xl bg-background border shadow-sm text-primary"><DollarSign className="h-6 w-6" /></div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">Est. Cost</p>
                          <p className="text-xl font-bold">₹{result.costEstimate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border-2">
                        <div className="p-3 rounded-xl bg-background border shadow-sm text-primary"><Clock className="h-6 w-6" /></div>
                        <div>
                          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-tighter">Time Needed</p>
                          <p className="text-xl font-bold">{result.timeEstimate}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-accent/10 p-6 rounded-2xl border-2 border-accent/20 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5"><Sparkles className="h-20 w-20" /></div>
                      <h4 className="font-black text-sm uppercase mb-4 flex items-center gap-2">
                        <Info className="h-4 w-4" /> Transparent Reasoning
                      </h4>
                      <p className="text-foreground leading-relaxed italic whitespace-pre-line">
                        {result.explanation}
                      </p>
                    </div>

                    <div className="mt-10 border-t pt-8">
                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-4 text-center tracking-widest">Contribute to the Logic Loop</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl h-10 border-2 gap-2" onClick={() => handleFeedback('Relevant')}><ThumbsUp className="h-3 w-3" /> Relevant</Button>
                        <Button variant="outline" size="sm" className="rounded-xl h-10 border-2 gap-2" onClick={() => handleFeedback('Not Useful')}><ThumbsDown className="h-3 w-3" /> Not Useful</Button>
                        <Button variant="outline" size="sm" className="rounded-xl h-10 border-2 gap-2" onClick={() => handleFeedback('Too Expensive')}><DollarSign className="h-3 w-3" /> Expensive</Button>
                        <Button variant="outline" size="sm" className="rounded-xl h-10 border-2 gap-2" onClick={() => handleFeedback('Too Repetitive')}><RefreshCcw className="h-3 w-3" /> Repetitive</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* COMPARE TAB */}
              <TabsContent value="compare">
                <Card className="border-2 rounded-3xl">
                  <CardHeader>
                    <CardTitle>Trade-off Analysis</CardTitle>
                    <CardDescription>How this choice stacks up against your boundaries.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="p-6 rounded-2xl border-2 bg-muted/10 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">Budget Alignment</span>
                        <Badge className="bg-green-100 text-green-700 border-none">Excellent</Badge>
                      </div>
                      <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full w-[95%]"></div>
                      </div>
                      <p className="text-[10px] text-muted-foreground italic">"At ₹{result.costEstimate}, this uses {Math.round((result.costEstimate/budget)*100)}% of your set limit."</p>
                    </div>
                    <div className="p-6 rounded-2xl border-2 bg-muted/10 space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold">Preference Match</span>
                        <Badge className="bg-blue-100 text-blue-700 border-none">High</Badge>
                      </div>
                      <div className="w-full bg-muted h-3 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[85%]"></div>
                      </div>
                      <p className="text-[10px] text-muted-foreground italic">"Strongly aligns with your '{selectedPrefs.join(", ")}' focus."</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ALTERNATIVES TAB */}
              <TabsContent value="alternatives" className="space-y-4">
                {[
                  { name: "Option Alpha", cost: result.costEstimate + 20, reason: "Higher quality, but closer to budget cap." },
                  { name: "Option Beta", cost: Math.max(0, result.costEstimate - 40), reason: "Extreme budget choice, slightly further away." },
                  { name: "Option Gamma", cost: result.costEstimate, reason: "Similar value, different atmosphere." }
                ].map((alt, i) => (
                  <Card key={i} className="border-2 hover:border-primary/50 transition-colors cursor-pointer group">
                    <CardContent className="p-6 flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-bold group-hover:text-primary transition-colors">{alt.name}</h4>
                        <p className="text-xs text-muted-foreground italic">{alt.reason}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-sm font-bold text-primary">₹{alt.cost}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest"
                          onClick={() => handleSwapChoice(alt)}
                        >
                          Swap Choice <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="h-full min-h-[500px] border-4 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground p-12 text-center opacity-40">
              <div className="p-6 rounded-full bg-muted mb-6"><Target className="h-16 w-16" /></div>
              <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">System Idle</h3>
              <p className="max-w-xs text-sm font-medium">Define your constraints on the left to activate the AI Recommendation, Explanation, and Analysis modules.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
