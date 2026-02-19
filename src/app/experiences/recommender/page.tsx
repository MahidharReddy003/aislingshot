"use client";

import { useState } from "react";
import Image from "next/image";
import { generateExplanation, type GenerateExplanationOutput } from "@/ai/flows/generate-explanation-flow";
import { refineExplanationWithFeedback, type RefineExplanationWithFeedbackOutput } from "@/ai/flows/refine-explanation-with-feedback-flow";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { 
  ThumbsUp, 
  ThumbsDown, 
  DollarSign, 
  RefreshCcw, 
  Info, 
  Sparkles, 
  Target,
  Scale,
  ListRestart,
  Loader2,
  Activity,
  ShieldCheck,
  ChevronRight,
  MessageSquare,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPlaceholderImageUrl } from "@/lib/placeholder-images";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

export default function RecommenderPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();

  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(profileRef);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateExplanationOutput | null>(null);
  
  const [persona, setPersona] = useState("Student");
  const [budget, setBudget] = useState(150);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(["Healthy"]);
  const [accessibility, setAccessibility] = useState(false);
  const [healthAware, setHealthAware] = useState(true);

  // Feedback State
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [refinedResponse, setRefinedResponse] = useState<RefineExplanationWithFeedbackOutput | null>(null);
  const [customFeedback, setCustomFeedback] = useState("");

  const handleRecommend = async () => {
    setLoading(true);
    setRefinedResponse(null);
    setCustomFeedback("");
    try {
      const output = await generateExplanation({
        userPersona: persona,
        preferences: selectedPrefs.join(", "),
        healthConditions: healthAware ? (profile?.healthConditions || []) : [],
        budget: budget,
        time: "Lunchtime",
        accessibility: accessibility ? "Wheelchair Accessible" : "None",
        recentChoices: ["Campus Deli", "Subway"]
      });
      setResult(output);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate recommendation.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (text: string) => {
    if (!result || !user || !db) return;
    setFeedbackLoading(true);
    try {
      const response = await refineExplanationWithFeedback({
        originalRecommendation: result.recommendation,
        originalExplanation: result.explanation,
        userFeedback: text,
        userPreferences: {
          budget: `₹${budget}`,
          accessibility: accessibility ? ["wheelchair accessible"] : [],
          preferenceType: selectedPrefs,
        }
      });

      setRefinedResponse(response);

      // Save to Firestore
      addDoc(collection(db, 'users', user.uid, 'feedback'), {
        recommendation: result.recommendation,
        feedback: text,
        refinedExplanation: response.refinedExplanation,
        userId: user.uid,
        createdAt: serverTimestamp()
      });

      toast({
        title: "Feedback Recorded",
        description: "The AI has refined its logic based on your input.",
      });
      setCustomFeedback("");
    } catch (error: any) {
      toast({
        title: "Feedback Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setFeedbackLoading(false);
    }
  };

  const togglePref = (p: string) => {
    setSelectedPrefs(prev => 
      prev.includes(p) ? prev.filter(i => i !== p) : [...prev, p]
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pb-24">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight mb-2">Smart Recommender</h1>
        <p className="text-muted-foreground">Adjust preferences and explore the AI reasoning behind every suggestion.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-2 shadow-sm rounded-[2.5rem]">
            <CardHeader className="bg-muted/30 border-b px-8 py-6">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Contextual Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 p-8">
              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Persona</Label>
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
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Budget cap</Label>
                  <span className="text-sm font-black">₹{budget}</span>
                </div>
                <Slider value={[budget]} max={1000} step={50} onValueChange={(val) => setBudget(val[0])} />
              </div>

              {profile?.healthConditions && profile.healthConditions.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border-2 border-primary/20">
                  <div className="space-y-0.5">
                    <Label className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1">
                      <Activity className="h-3 w-3" /> Health-Aware
                    </Label>
                    <p className="text-[10px] text-muted-foreground italic">Considering: {profile.healthConditions.join(', ')}</p>
                  </div>
                  <Switch checked={healthAware} onCheckedChange={setHealthAware} />
                </div>
              )}

              <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Thematic Focus</Label>
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
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Accessibility</Label>
                  <p className="text-[10px] text-muted-foreground">Strict filtering</p>
                </div>
                <Switch checked={accessibility} onCheckedChange={setAccessibility} />
              </div>

              <Button className="w-full h-14 rounded-2xl font-bold shadow-lg gap-2" onClick={handleRecommend} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Suggestion
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-8">
          {result ? (
            <>
              <Tabs defaultValue="explain" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <TabsList className="bg-muted p-1 border-2 rounded-2xl grid grid-cols-3 h-auto">
                  <TabsTrigger value="explain" className="rounded-xl py-3 font-bold gap-2"><Info className="h-4 w-4" /> Explain</TabsTrigger>
                  <TabsTrigger value="compare" className="rounded-xl py-3 font-bold gap-2"><Scale className="h-4 w-4" /> Compare</TabsTrigger>
                  <TabsTrigger value="alternatives" className="rounded-xl py-3 font-bold gap-2"><ListRestart className="h-4 w-4" /> Alternatives</TabsTrigger>
                </TabsList>

                <TabsContent value="explain" className="space-y-6">
                  <Card className="border-primary border-4 shadow-xl overflow-hidden rounded-[2.5rem] relative">
                    <div className="relative h-64 w-full bg-muted">
                      <Image 
                        src={getPlaceholderImageUrl(result.imageHint || 'hero-abstract')}
                        alt={result.recommendation}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      <div className="absolute top-6 right-8">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="icon" className="h-16 w-16 rounded-full shadow-2xl bg-primary hover:scale-110 transition-transform flex flex-col items-center justify-center p-0">
                              <Sparkles className="h-8 w-8" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-3xl border-2 sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-black flex items-center gap-2">
                                <Sparkles className="text-primary" /> AI Reasoning Breakdown
                              </DialogTitle>
                              <DialogDescription className="text-base font-medium text-foreground italic py-6 leading-relaxed">
                                {result.explanation}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-2 gap-4 mt-2">
                               <div className="p-4 rounded-2xl bg-muted/50 border space-y-1">
                                  <p className="text-[10px] font-black uppercase text-muted-foreground">Persona Context</p>
                                  <p className="font-bold text-sm">{persona}</p>
                               </div>
                               <div className="p-4 rounded-2xl bg-muted/50 border space-y-1">
                                  <p className="text-[10px] font-black uppercase text-muted-foreground">Health Guard</p>
                                  <p className="font-bold text-sm">{healthAware ? "Active" : "Disabled"}</p>
                               </div>
                               <div className="p-4 rounded-2xl bg-muted/50 border col-span-2 flex items-center justify-between">
                                  <div className="space-y-1">
                                     <p className="text-[10px] font-black uppercase text-muted-foreground">Match Confidence</p>
                                     <p className="font-bold text-sm">High Reliability</p>
                                  </div>
                                  <ShieldCheck className="h-6 w-6 text-green-500" />
                               </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="absolute bottom-6 left-8 text-white">
                        <Badge variant="outline" className="text-white border-white/30 font-bold uppercase text-[10px] mb-1">AI Curated Choice</Badge>
                        <h2 className="text-3xl font-black tracking-tight">{result.recommendation}</h2>
                      </div>
                    </div>
                    
                    <CardContent className="p-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 rounded-2xl bg-muted/30 border-2 text-center">
                          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Est. Cost</p>
                          <p className="text-lg font-bold">₹{result.costEstimate}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/30 border-2 text-center">
                          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Time</p>
                          <p className="text-lg font-bold">{result.timeEstimate}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-muted/30 border-2 text-center">
                          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Diversity</p>
                          <p className="text-lg font-bold">{result.diversityScore}%</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-primary text-primary-foreground border-2 border-primary text-center">
                          <p className="text-[10px] uppercase font-black opacity-70 tracking-widest mb-1">Match</p>
                          <p className="text-lg font-bold">98%</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-center p-5 bg-accent/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary border border-accent/20 animate-pulse">
                        <Sparkles className="h-4 w-4 mr-2" /> Click the logic icon above to see reasoning
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="compare">
                  <Card className="border-2 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                    <div>
                      <CardTitle className="mb-2 text-2xl font-black">Constraint Scorecard</CardTitle>
                      <CardDescription className="text-base">Visualizing how this recommendation balances your specific parameters.</CardDescription>
                    </div>
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest items-center">
                          <span className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-green-500" /> Budget Alignment</span>
                          <span className="text-primary">95%</span>
                        </div>
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden border">
                          <div className="h-full bg-green-500 w-[95%] transition-all duration-1000" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest items-center">
                          <span className="flex items-center gap-2"><Activity className="h-4 w-4 text-blue-500" /> Health Priority Match</span>
                          <span className="text-primary">100%</span>
                        </div>
                        <div className="h-3 w-full bg-muted rounded-full overflow-hidden border">
                          <div className="h-full bg-blue-500 w-[100%] transition-all duration-1000 shadow-sm" />
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="alternatives" className="space-y-4">
                  <div className="p-12 text-center text-muted-foreground border-4 border-dashed rounded-[2.5rem] bg-muted/5 flex flex-col items-center justify-center">
                    <div className="p-4 rounded-full bg-muted mb-4 opacity-50"><RefreshCcw className="h-8 w-8" /></div>
                    <p className="italic font-medium max-w-sm">The primary choice was prioritized to satisfy all active health, budget, and persona constraints simultaneously.</p>
                  </div>
                </TabsContent>
              </Tabs>

              {/* FEEDBACK SECTION */}
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Card className="border-2 rounded-[2.5rem] overflow-hidden bg-muted/10">
                  <CardHeader className="text-center py-8">
                    <CardTitle className="text-xl font-black">Help the AI learn</CardTitle>
                    <CardDescription>Your feedback directly refines the assistant's decision-making logic.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 px-8 pb-8">
                    {refinedResponse ? (
                      <div className="bg-primary text-primary-foreground p-8 rounded-[2rem] space-y-4 animate-in zoom-in duration-500">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-white/10"><Sparkles className="h-5 w-5" /></div>
                          <h4 className="font-bold">AI Adaptation Insight</h4>
                        </div>
                        <p className="text-sm italic leading-relaxed opacity-90">"{refinedResponse.refinedExplanation}"</p>
                        <div className="pt-4 border-t border-white/10">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-3">Actionable Improvements</p>
                          <div className="space-y-2">
                            {refinedResponse.actionableInsights.map((insight, idx) => (
                              <div key={idx} className="flex gap-2 text-xs font-medium">
                                <ChevronRight className="h-3 w-3 shrink-0 mt-0.5 text-accent" />
                                {insight}
                              </div>
                            ))}
                          </div>
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="w-full mt-4 font-bold rounded-xl"
                          onClick={() => setRefinedResponse(null)}
                        >
                          Provide More Feedback
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { type: 'Relevant', icon: ThumbsUp, color: 'hover:bg-green-50 hover:border-green-200' },
                            { type: 'Not useful', icon: ThumbsDown, color: 'hover:bg-red-50 hover:border-red-200' },
                            { type: 'Too expensive', icon: DollarSign, color: 'hover:bg-orange-50 hover:border-orange-200' },
                            { type: 'Too repetitive', icon: RefreshCcw, color: 'hover:bg-blue-50 hover:border-blue-200' }
                          ].map((btn) => (
                            <Button
                              key={btn.type}
                              variant="outline"
                              className={cn(
                                "h-auto flex-col gap-3 py-6 rounded-2xl border-2 transition-all",
                                btn.color
                              )}
                              disabled={feedbackLoading}
                              onClick={() => handleFeedback(btn.type)}
                            >
                              {feedbackLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <btn.icon className="h-6 w-6" />}
                              <span className="text-[10px] font-black uppercase tracking-tighter">{btn.type}</span>
                            </Button>
                          ))}
                        </div>

                        <div className="space-y-3">
                          <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <MessageSquare className="h-3 w-3" /> Share your detailed opinion
                          </Label>
                          <div className="flex gap-2">
                            <Textarea 
                              placeholder="Tell the AI what you really think about this recommendation..." 
                              value={customFeedback}
                              onChange={(e) => setCustomFeedback(e.target.value)}
                              className="bg-background min-h-[80px] rounded-2xl border-2"
                              disabled={feedbackLoading}
                            />
                            <Button 
                              onClick={() => handleFeedback(customFeedback)} 
                              disabled={feedbackLoading || !customFeedback.trim()}
                              className="h-auto aspect-square rounded-2xl px-4 shrink-0"
                            >
                              {feedbackLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="h-full min-h-[500px] border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-muted-foreground p-12 text-center opacity-40">
              <div className="p-6 rounded-full bg-muted mb-6"><Target className="h-16 w-16" /></div>
              <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">System Ready</h3>
              <p className="max-w-xs text-sm font-medium leading-relaxed">Define your context (Persona, Budget, Health) on the left. The AI will cross-reference its logic modules to find your best match.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
