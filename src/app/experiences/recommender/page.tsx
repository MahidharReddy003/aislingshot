'use client';

import { useState, useEffect } from "react";
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

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateExplanationOutput | null>(null);
  
  // INTERCONNECTED DATA: Initialize with profile values
  const [persona, setPersona] = useState("Student");
  const [budget, setBudget] = useState(150);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(["Healthy"]);
  const [accessibility, setAccessibility] = useState(false);
  const [healthAware, setHealthAware] = useState(true);

  // Sync profile data when it loads
  useEffect(() => {
    if (profile) {
      if (profile.budgetPreference !== undefined) setBudget(profile.budgetPreference);
      if (profile.role) setPersona(profile.role);
      if (profile.interests && profile.interests.length > 0) setSelectedPrefs(profile.interests);
    }
  }, [profile]);

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

  if (isProfileLoading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Loading AI Persona...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl pb-24">
      <div className="mb-12">
        <h1 className="text-5xl font-black tracking-tighter mb-2">Smart Recommender</h1>
        <p className="text-muted-foreground text-lg">Adjust your constraints and explore the AI logic behind every suggestion.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-2 shadow-sm rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-muted/30 border-b px-8 py-6">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Contextual Constraints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Persona</Label>
                <div className="flex flex-wrap gap-2">
                  {["Student", "Professional", "Creator", "Traveler"].map(p => (
                    <Button 
                      key={p} 
                      variant={persona === p ? "default" : "outline"} 
                      size="sm"
                      className="rounded-full h-9 px-4 text-xs font-bold"
                      onClick={() => setPersona(p)}
                    >
                      {p}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <Label className="font-black text-xs uppercase tracking-widest text-muted-foreground">Budget Cap</Label>
                  <span className="text-xl font-black text-primary">₹{budget}</span>
                </div>
                <Slider value={[budget]} max={2000} step={50} onValueChange={(val) => setBudget(val[0])} className="py-2" />
              </div>

              {profile?.healthConditions && profile.healthConditions.length > 0 && (
                <div className="flex items-center justify-between p-5 bg-primary/5 rounded-[2rem] border-2 border-primary/20">
                  <div className="space-y-1">
                    <Label className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <Activity className="h-4 w-4" /> Health-Aware Mode
                    </Label>
                    <p className="text-[10px] text-muted-foreground italic line-clamp-1">Considering: {profile.healthConditions.join(', ')}</p>
                  </div>
                  <Switch checked={healthAware} onCheckedChange={setHealthAware} />
                </div>
              )}

              <div className="space-y-4">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">Preference Focus</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["Healthy", "Quick", "Social", "Budget", "Premium", "Outdoor"].map(p => (
                    <div 
                      key={p} 
                      className={cn(
                        "flex items-center space-x-3 border-2 rounded-2xl p-4 cursor-pointer transition-all hover:scale-[1.02]",
                        selectedPrefs.includes(p) ? "bg-primary/5 border-primary" : "hover:bg-muted"
                      )}
                      onClick={() => togglePref(p)}
                    >
                      <div className={cn("h-4 w-4 rounded-full border-2", selectedPrefs.includes(p) ? "bg-primary border-primary" : "border-muted-foreground")} />
                      <span className="text-sm font-bold">{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-5 bg-muted/20 rounded-[2rem] border-2">
                <div className="space-y-1">
                  <Label className="font-bold">Accessibility Priority</Label>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">Strict Filtering</p>
                </div>
                <Switch checked={accessibility} onCheckedChange={setAccessibility} />
              </div>

              <Button className="w-full h-16 rounded-[2rem] font-black text-lg shadow-xl gap-3 transition-transform hover:scale-[1.02]" onClick={handleRecommend} disabled={loading}>
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
                Generate Discovery
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700">
              <Tabs defaultValue="explain" className="space-y-8">
                <TabsList className="bg-muted p-1.5 border-2 rounded-[2rem] grid grid-cols-3 h-auto max-w-md mx-auto">
                  <TabsTrigger value="explain" className="rounded-[1.5rem] py-4 font-black gap-2"><Info className="h-5 w-5" /> Logic</TabsTrigger>
                  <TabsTrigger value="compare" className="rounded-[1.5rem] py-4 font-black gap-2"><Scale className="h-5 w-5" /> Compare</TabsTrigger>
                  <TabsTrigger value="alternatives" className="rounded-[1.5rem] py-4 font-black gap-2"><ListRestart className="h-5 w-5" /> More</TabsTrigger>
                </TabsList>

                <TabsContent value="explain" className="space-y-8">
                  <Card className="border-primary border-4 shadow-2xl overflow-hidden rounded-[3rem] relative group">
                    <div className="relative h-[30rem] w-full bg-muted overflow-hidden">
                      <Image 
                        src={getPlaceholderImageUrl(result.imageHint || 'hero-abstract')}
                        alt={result.recommendation}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                      
                      <div className="absolute top-10 right-10">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="icon" className="h-20 w-20 rounded-full shadow-2xl bg-primary hover:scale-110 transition-transform flex flex-col items-center justify-center p-0 border-4 border-white/20">
                              <Sparkles className="h-10 w-10 text-primary-foreground" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-[2.5rem] border-2 sm:max-w-[550px] p-10">
                            <DialogHeader>
                              <DialogTitle className="text-3xl font-black flex items-center gap-3">
                                <Sparkles className="text-primary h-8 w-8" /> Why this choice?
                              </DialogTitle>
                              <div className="py-8">
                                <p className="text-lg font-medium text-foreground italic leading-relaxed">
                                  "{result.explanation}"
                                </p>
                              </div>
                            </DialogHeader>
                            
                            <div className="space-y-6 pt-6 border-t">
                              <p className="text-xs font-black uppercase tracking-widest text-muted-foreground text-center">Help refine the engine</p>
                              
                              {refinedResponse ? (
                                <div className="bg-primary text-primary-foreground p-8 rounded-[2rem] space-y-4 animate-in zoom-in duration-500 shadow-xl">
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4" />
                                    <h4 className="font-black text-xs uppercase tracking-widest">Logic Adaptation Active</h4>
                                  </div>
                                  <p className="text-sm italic leading-relaxed opacity-90">{refinedResponse.refinedExplanation}</p>
                                  <div className="pt-4 space-y-2">
                                    {refinedResponse.actionableInsights.map((insight, idx) => (
                                      <div key={idx} className="flex gap-2 text-[10px] font-bold opacity-80 bg-white/10 p-2 rounded-lg">
                                        <Activity className="h-3 w-3 shrink-0" /> {insight}
                                      </div>
                                    ))}
                                  </div>
                                  <Button variant="secondary" size="sm" onClick={() => setRefinedResponse(null)} className="w-full text-[10px] h-10 font-black rounded-xl uppercase">Provide More Feedback</Button>
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-4 gap-3">
                                     <Button variant="outline" onClick={() => handleFeedback('Relevant')} disabled={feedbackLoading} className="rounded-2xl h-14 border-2"><ThumbsUp className="h-5 w-5" /></Button>
                                     <Button variant="outline" onClick={() => handleFeedback('Not useful')} disabled={feedbackLoading} className="rounded-2xl h-14 border-2"><ThumbsDown className="h-5 w-5" /></Button>
                                     <Button variant="outline" onClick={() => handleFeedback('Too expensive')} disabled={feedbackLoading} className="rounded-2xl h-14 border-2"><DollarSign className="h-5 w-5" /></Button>
                                     <Button variant="outline" onClick={() => handleFeedback('Too repetitive')} disabled={feedbackLoading} className="rounded-2xl h-14 border-2"><RefreshCcw className="h-5 w-5" /></Button>
                                  </div>

                                  <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                      <MessageSquare className="h-3 w-3" /> Custom Opinion
                                    </Label>
                                    <div className="flex gap-3">
                                      <Textarea 
                                        placeholder="Tell us what you really think..." 
                                        value={customFeedback}
                                        onChange={(e) => setCustomFeedback(e.target.value)}
                                        className="min-h-[80px] text-sm bg-muted/30 border-2 rounded-2xl resize-none"
                                        disabled={feedbackLoading}
                                      />
                                      <Button onClick={() => handleFeedback(customFeedback)} disabled={feedbackLoading || !customFeedback.trim()} className="h-auto w-16 rounded-2xl shrink-0 shadow-lg">
                                        {feedbackLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="absolute bottom-10 left-10 text-white space-y-2">
                        <Badge variant="outline" className="text-white border-white/40 bg-white/10 backdrop-blur-md px-4 py-1.5 font-black uppercase text-[10px] tracking-widest">Logic-Matched Suggestion</Badge>
                        <h2 className="text-5xl font-black tracking-tighter">{result.recommendation}</h2>
                      </div>
                    </div>
                    
                    <CardContent className="p-10">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="p-6 rounded-[2rem] bg-muted/40 border-2 text-center shadow-inner">
                          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Est. Cost</p>
                          <p className="text-2xl font-black text-primary">₹{result.costEstimate}</p>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-muted/40 border-2 text-center shadow-inner">
                          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Time Focus</p>
                          <p className="text-2xl font-black text-primary">{result.timeEstimate}</p>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-muted/40 border-2 text-center shadow-inner">
                          <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Diversity</p>
                          <p className="text-2xl font-black text-primary">{result.diversityScore}%</p>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-primary text-primary-foreground border-4 border-primary/20 text-center shadow-xl">
                          <p className="text-[10px] uppercase font-black opacity-70 tracking-widest mb-1">AI Match</p>
                          <p className="text-2xl font-black">98%</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="h-full min-h-[600px] border-4 border-dashed rounded-[3.5rem] flex flex-col items-center justify-center text-muted-foreground p-16 text-center opacity-40 bg-muted/5">
              <div className="p-10 rounded-full bg-muted mb-8 shadow-inner"><Target className="h-20 w-20" /></div>
              <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Discovery System Idle</h3>
              <p className="max-w-md text-lg font-medium leading-relaxed">Adjust your persona, budget, and health context on the left. The AI will then cross-reference its logic modules to find your highest matching experience.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
