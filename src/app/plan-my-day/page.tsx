'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { planDay } from '@/ai/flows/plan-day-flow';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Clock, DollarSign, Sparkles, Loader2, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPlaceholderImageUrl } from '@/lib/placeholder-images';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

export default function PlanMyDayPage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(profileRef);
  const { toast } = useToast();

  const [budget, setBudget] = useState(0);
  const [time, setTime] = useState(120);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (profile) {
      if (profile.budgetPreference !== undefined) setBudget(profile.budgetPreference);
      if (profile.availableTime !== undefined) setTime(profile.availableTime * 60);
    }
  }, [profile]);

  const handlePlan = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      const output = await planDay({
        budget,
        timeAvailable: time,
        userProfile: {
          interests: profile.interests || [],
          healthConditions: profile.healthConditions || [],
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

  if (isProfileLoading && !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium">Loading your profile logic...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 pb-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-5xl font-black tracking-tighter flex items-center gap-4">
            <Clock className="text-purple-500 h-10 w-10" /> Day Planner
          </h1>
          <p className="text-muted-foreground mt-2 text-xl">Personalized itineraries that respect your budget and health needs.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <Card className="border-2 rounded-[2.5rem] shadow-sm overflow-hidden sticky top-24">
            <CardHeader className="bg-muted/30 border-b p-8">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Planning Constraints</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label htmlFor="budget" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Budget (INR)</Label>
                  <span className="font-black text-primary text-lg">₹{budget}</span>
                </div>
                <Input id="budget" type="number" value={budget} onChange={e => setBudget(parseInt(e.target.value) || 0)} className="h-14 border-2 rounded-2xl text-lg font-bold" />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label htmlFor="time" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Available Time</Label>
                  <span className="font-black text-primary text-lg">{time} min</span>
                </div>
                <Input id="time" type="number" value={time} onChange={e => setTime(parseInt(e.target.value) || 0)} className="h-14 border-2 rounded-2xl text-lg font-bold" />
              </div>

              {profile?.healthConditions && profile.healthConditions.length > 0 && (
                <div className="p-6 bg-primary/5 rounded-[2rem] border-2 border-primary/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 mb-3">
                    <Activity className="h-4 w-4" /> Health-First Logic Active
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.healthConditions.map(h => (
                      <Badge key={h} variant="outline" className="text-[10px] h-6 bg-white border-primary/20 rounded-lg">{h}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={handlePlan} className="w-full h-16 gap-3 rounded-[2rem] font-black text-lg shadow-xl transition-all hover:scale-[1.02]" disabled={loading || !profile}>
                {loading ? <Loader2 className="animate-spin h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
                Generate Plan
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-8 duration-700">
              <Card className="border-primary border-4 shadow-2xl rounded-[3rem] overflow-hidden bg-primary text-primary-foreground relative">
                <div className="absolute top-0 right-0 p-12 opacity-10"><Sparkles className="h-40 w-40" /></div>
                <CardContent className="p-12">
                  <h3 className="text-3xl font-black mb-6 tracking-tight">AI Strategy Breakdown</h3>
                  <p className="text-xl opacity-90 italic leading-relaxed">"{result.summary}"</p>
                  <div className="flex items-center gap-10 mt-10 pt-10 border-t border-white/20">
                    <div className="flex flex-col">
                       <span className="text-[10px] uppercase opacity-70 font-black tracking-widest">Total Spend</span>
                       <span className="text-4xl font-black">₹{result.totalCost}</span>
                    </div>
                     <div className="flex flex-col">
                       <span className="text-[10px] uppercase opacity-70 font-black tracking-widest">Total Duration</span>
                       <span className="text-4xl font-black">{result.activities.reduce((acc: number, curr: any) => acc + curr.durationMinutes, 0)} min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-10">
                {result.activities.map((act: any, idx: number) => (
                  <Card key={idx} className="border-2 rounded-[3rem] overflow-hidden hover:shadow-2xl transition-all group bg-card">
                    <CardContent className="p-0 flex flex-col md:flex-row">
                      <div className="relative w-full md:w-80 h-72 md:h-auto shrink-0 overflow-hidden">
                        <Image 
                          src={getPlaceholderImageUrl(act.imageHint || 'hero-abstract')} 
                          alt={act.title} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute top-8 left-8">
                          <Badge className="bg-white text-primary border-none font-black shadow-2xl h-12 w-12 flex items-center justify-center p-0 rounded-2xl text-xl">
                            {idx + 1}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-1 p-12 flex flex-col">
                        <div className="flex justify-between items-start mb-8">
                          <div className="flex gap-3">
                            <Badge variant="secondary" className="font-black uppercase text-[10px] tracking-widest px-4 py-1.5 rounded-full">{act.cost === 0 ? 'Free' : `₹${act.cost}`}</Badge>
                            <Badge variant="outline" className="font-black uppercase text-[10px] tracking-widest border-2 px-4 py-1.5 rounded-full">{act.durationMinutes} min</Badge>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="icon" className="h-16 w-16 rounded-full shadow-xl bg-primary hover:scale-110 transition-transform border-4 border-white/20">
                                <Sparkles className="h-8 w-8 text-primary-foreground" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-[2.5rem] border-2 sm:max-w-[500px] p-10">
                              <DialogHeader>
                                <DialogTitle className="text-3xl font-black flex items-center gap-3">
                                  <Sparkles className="text-primary h-8 w-8" /> Reasoning
                                </DialogTitle>
                                <div className="py-8">
                                  <p className="text-lg font-medium text-foreground py-6 leading-relaxed italic border-y border-muted-foreground/10 my-4">
                                    "{act.reason}"
                                  </p>
                                </div>
                              </DialogHeader>
                              <div className="p-8 bg-muted/30 rounded-[2rem] border-2 space-y-4">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Selected Experience</p>
                                <p className="text-2xl font-black text-primary leading-tight">{act.title}</p>
                                <p className="text-base text-muted-foreground leading-relaxed">{act.description}</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <h3 className="text-4xl font-black mb-4 group-hover:text-primary transition-colors leading-tight">{act.title}</h3>
                        <p className="text-lg text-muted-foreground leading-relaxed flex-1">{act.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[600px] border-4 border-dashed rounded-[4rem] flex flex-col items-center justify-center text-muted-foreground p-16 text-center opacity-40 bg-muted/5">
              <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center mb-8 shadow-inner">
                <Clock className="h-16 w-16" />
              </div>
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-4">Itinerary Engine Ready</h3>
              <p className="max-w-md text-xl font-medium leading-relaxed">Define your constraints on the left. The AI will then assemble a perfectly synced plan based on your persona and health profile.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
