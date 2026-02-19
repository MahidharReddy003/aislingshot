
"use client";

import { useState } from "react";
import Image from "next/image";
import { generateExplanation, type GenerateExplanationOutput } from "@/ai/flows/generate-explanation-flow";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Loader2,
  FileText,
  MapPin,
  Image as ImageIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RecommenderPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateExplanationOutput | null>(null);
  
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-10">
        <h1 className="text-3xl font-black tracking-tight mb-2">Smart Recommender</h1>
        <p className="text-muted-foreground">Adjust preferences and explore the AI reasoning behind every suggestion.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-2 shadow-sm">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Contextual Inputs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
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

              <Button className="w-full h-12 rounded-xl font-bold shadow-lg gap-2" onClick={handleRecommend} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Generate Suggestion
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {result ? (
            <Tabs defaultValue="explain" className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <TabsList className="bg-muted p-1 border-2 rounded-2xl grid grid-cols-3 h-auto">
                <TabsTrigger value="explain" className="rounded-xl py-3 font-bold gap-2"><Info className="h-4 w-4" /> Explain</TabsTrigger>
                <TabsTrigger value="compare" className="rounded-xl py-3 font-bold gap-2"><Scale className="h-4 w-4" /> Compare</TabsTrigger>
                <TabsTrigger value="alternatives" className="rounded-xl py-3 font-bold gap-2"><ListRestart className="h-4 w-4" /> Alternatives</TabsTrigger>
              </TabsList>

              <TabsContent value="explain" className="space-y-6">
                <Card className="border-primary border-2 shadow-xl overflow-hidden rounded-3xl">
                  <div className="relative h-64 w-full bg-muted">
                    <Image 
                      src={`https://picsum.photos/seed/${result.imageHint}/1200/600`}
                      alt={result.recommendation}
                      fill
                      className="object-cover"
                      data-ai-hint={result.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-6 left-8 text-white space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-white border-white/30 font-bold uppercase text-[10px] mb-1">AI Curated Choice</Badge>
                          <h2 className="text-3xl font-black">{result.recommendation}</h2>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="p-4 rounded-2xl bg-muted/30 border-2">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Est. Cost</p>
                        <p className="text-lg font-bold">₹{result.costEstimate}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border-2">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Time</p>
                        <p className="text-lg font-bold">{result.timeEstimate}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-muted/30 border-2">
                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Diversity</p>
                        <p className="text-lg font-bold">{result.diversityScore}%</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-primary text-primary-foreground border-2 border-primary">
                        <p className="text-[10px] uppercase font-black opacity-70 tracking-widest mb-1">Match</p>
                        <p className="text-lg font-bold">High</p>
                      </div>
                    </div>

                    <div className="bg-accent/10 p-6 rounded-2xl border-2 border-accent/20 space-y-4">
                      <h4 className="font-black text-xs uppercase flex items-center gap-2 text-primary tracking-widest">
                        <Sparkles className="h-4 w-4" /> Reasoning Logic
                      </h4>
                      <p className="text-foreground leading-relaxed italic">
                        {result.explanation}
                      </p>
                    </div>

                    <div className="mt-8 space-y-4">
                      <h4 className="font-black text-[10px] uppercase tracking-widest text-muted-foreground">Attachments & Metadata</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-3 p-3 rounded-xl border bg-card">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium">Menu & Pricing Details</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl border bg-card">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="text-xs font-medium">Verified Location Pin</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 border-t pt-8">
                      <p className="text-[10px] font-black uppercase text-muted-foreground mb-4 text-center tracking-widest">Logic Feedback Loop</p>
                      <div className="flex flex-wrap justify-center gap-2">
                        {['Relevant', 'Not Useful', 'Expensive', 'Repetitive'].map(f => (
                          <Button key={f} variant="outline" size="sm" className="rounded-xl border-2 h-10 px-4 font-bold" onClick={() => handleFeedback(f)}>{f}</Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="compare">
                <Card className="border-2 rounded-3xl p-8 space-y-8">
                  <div>
                    <CardTitle className="mb-2">Trade-off Scorecard</CardTitle>
                    <CardDescription>Visualizing how this recommendation balances your constraints.</CardDescription>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                        <span>Budget Alignment</span>
                        <span>95%</span>
                      </div>
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 w-[95%]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                        <span>Preference Match</span>
                        <span>82%</span>
                      </div>
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[82%]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                        <span>Discovery Novelty</span>
                        <span>{result.diversityScore}%</span>
                      </div>
                      <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${result.diversityScore}%` }} />
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="alternatives" className="space-y-4">
                {[
                  { name: "Alternative A", reason: "Slightly cheaper, less social atmosphere.", icon: "coffee" },
                  { name: "Alternative B", reason: "Premium choice, matches accessibility needs perfectly.", icon: "star" }
                ].map((alt, i) => (
                  <Card key={i} className="border-2 hover:border-primary/50 transition-all cursor-pointer group p-6">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 bg-muted rounded-2xl overflow-hidden relative shrink-0">
                        <Image src={`https://picsum.photos/seed/${alt.icon}/100/100`} alt={alt.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg group-hover:text-primary transition-colors">{alt.name}</h4>
                        <p className="text-sm text-muted-foreground italic">{alt.reason}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="font-black uppercase text-[10px] tracking-widest">Swap Choice <ArrowRight className="ml-2 h-3 w-3" /></Button>
                    </div>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="h-full min-h-[500px] border-4 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground p-12 text-center opacity-40">
              <div className="p-6 rounded-full bg-muted mb-6"><Target className="h-16 w-16" /></div>
              <h3 className="text-2xl font-black mb-2 uppercase tracking-tight">System Ready</h3>
              <p className="max-w-xs text-sm font-medium">Input your current persona and budget to activate the AI reasoning modules.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
