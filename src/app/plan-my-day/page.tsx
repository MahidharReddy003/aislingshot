
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { planDay } from '@/ai/flows/plan-day-flow';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Clock, DollarSign, Sparkles, Loader2, Target, CheckCircle, FileText, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PlanMyDayPage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: profile, isLoading } = useDoc(profileRef);
  const { toast } = useToast();

  const [budget, setBudget] = useState(200);
  const [time, setTime] = useState(120);
  const [loading, setLoading] = useState(false);
  const [savingPlan, setSavingPlan] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handlePlan = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const output = await planDay({
        budget,
        timeAvailable: time,
        userProfile: {
          interests: profile.interests || [],
          location: profile.location || 'Unknown',
          role: profile.role || 'User'
        }
      });
      setResult(output);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async () => {
    if (!user || !db || !result) return;
    setSavingPlan(true);
    try {
      const plansRef = collection(db, 'users', user.uid, 'plans');
      await addDoc(plansRef, {
        planData: JSON.stringify(result),
        userId: user.uid,
        createdAt: serverTimestamp()
      });
      toast({ title: 'Plan Saved', description: 'This day plan has been added to your library.' });
    } catch (error: any) {
      toast({ title: 'Save Failed', description: error.message, variant: 'destructive' });
    } finally {
      setSavingPlan(false);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">AI Day Planner</h1>
        <p className="text-muted-foreground">Personalized plans that fit your budget and schedule.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Card className="border-2 sticky top-24">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Plan Constraints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="budget" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Budget (₹)</Label>
                  <span className="font-bold">₹{budget}</span>
                </div>
                <Input id="budget" type="number" value={budget} onChange={e => setBudget(parseInt(e.target.value) || 0)} className="h-11 border-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="time" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Free Time (min)</Label>
                  <span className="font-bold">{time} min</span>
                </div>
                <Input id="time" type="number" value={time} onChange={e => setTime(parseInt(e.target.value) || 0)} className="h-11 border-2" />
              </div>
              <Button onClick={handlePlan} className="w-full h-12 gap-2 rounded-xl font-bold shadow-lg" disabled={loading || !profile}>
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                Draft Plan
              </Button>
              {!profile && !isLoading && <p className="text-[10px] text-red-500 text-center italic font-medium">Please complete profile setup first.</p>}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="border-none bg-primary text-primary-foreground shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="h-24 w-24" /></div>
                <CardHeader className="p-8">
                  <h3 className="text-2xl font-black mb-2 tracking-tight">Today's Itinerary</h3>
                  <p className="text-primary-foreground/80 italic leading-relaxed">"{result.summary}"</p>
                  <div className="pt-6 flex gap-6 text-xs font-black uppercase tracking-[0.2em]">
                    <span className="flex items-center gap-2"><DollarSign className="h-4 w-4" /> Total Cost: ₹{result.totalCost}</span>
                    <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> Duration: {result.activities.reduce((acc: any, curr: any) => acc + curr.durationMinutes, 0)}m</span>
                  </div>
                </CardHeader>
              </Card>

              <div className="space-y-4">
                {result.activities.map((act: any, idx: number) => (
                  <Card key={idx} className="border-2 rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all group shadow-sm">
                    <CardContent className="p-0 flex flex-col md:flex-row">
                      <div className="relative w-full md:w-56 h-48 md:h-auto shrink-0 bg-muted">
                        <Image 
                          src={`https://picsum.photos/seed/${act.imageHint}/400/400`} 
                          alt={act.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          data-ai-hint={act.imageHint}
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-white/90 text-primary border-none font-black shadow-sm h-8 w-8 flex items-center justify-center p-0 rounded-lg">
                            {idx + 1}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-1 p-8">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="font-bold uppercase text-[10px] tracking-widest">{act.cost === 0 ? 'Free' : `₹${act.cost}`}</Badge>
                            <Badge variant="outline" className="font-bold uppercase text-[10px] tracking-widest">{act.durationMinutes} min</Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full border">
                              <FileText className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full border">
                              <Share2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <h3 className="text-2xl font-black mb-2 group-hover:text-primary transition-colors">{act.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{act.description}</p>
                        
                        <Accordion type="single" collapsible>
                          <AccordionItem value="logic" className="border-none">
                            <AccordionTrigger className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-4 py-2.5 rounded-xl hover:no-underline border border-primary/10 transition-all hover:bg-primary/10">
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4" /> AI Choice Analysis
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 px-4 italic text-sm text-foreground leading-relaxed border-l-2 border-primary/20 ml-2 mt-2">
                              {act.reason}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1 border-2 h-14 rounded-2xl font-black uppercase tracking-widest gap-2" onClick={handleSavePlan} disabled={savingPlan}>
                  {savingPlan ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                  Save Library
                </Button>
                <Button className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest gap-2 shadow-xl">
                  <Share2 className="h-4 w-4" /> Share Plan
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[450px] border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center text-muted-foreground p-12 text-center opacity-40">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                <Clock className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Itinerary Logic Idle</h3>
              <p className="max-w-xs text-sm font-medium">Define your constraints on the left. The AI will cross-reference your budget, time, and persona to build a transparent plan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
