
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

  const { data: profile, isLoading } = useDoc(profileRef);
  const { toast } = useToast();

  const [budget, setBudget] = useState(200);
  const [time, setTime] = useState(120);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 pb-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Clock className="text-purple-500 h-8 w-8" /> Day Planner
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Personalized plans that fit your budget and schedule.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4">
          <Card className="border-2 rounded-[2.5rem] shadow-sm overflow-hidden sticky top-24">
            <CardHeader className="bg-muted/30 border-b p-8">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-muted-foreground">Constraints</CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="budget" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Budget Cap</Label>
                  <span className="font-black text-primary">₹{budget}</span>
                </div>
                <Input id="budget" type="number" value={budget} onChange={e => setBudget(parseInt(e.target.value) || 0)} className="h-12 border-2 rounded-xl" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="time" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Minutes Available</Label>
                  <span className="font-black text-primary">{time} min</span>
                </div>
                <Input id="time" type="number" value={time} onChange={e => setTime(parseInt(e.target.value) || 0)} className="h-12 border-2 rounded-xl" />
              </div>

              {profile?.healthConditions && profile.healthConditions.length > 0 && (
                <div className="p-5 bg-primary/5 rounded-2xl border-2 border-primary/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-1 mb-2">
                    <Activity className="h-3 w-3" /> Health Guards Active
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {profile.healthConditions.map(h => (
                      <Badge key={h} variant="outline" className="text-[9px] h-4 bg-white border-primary/20">{h}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <Button onClick={handlePlan} className="w-full h-14 gap-2 rounded-2xl font-black shadow-lg transition-all hover:scale-105" disabled={loading || !profile}>
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                Generate Itinerary
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
              <Card className="border-primary border-4 shadow-2xl rounded-[3rem] overflow-hidden bg-primary text-primary-foreground relative">
                <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="h-32 w-32" /></div>
                <CardContent className="p-10">
                  <h3 className="text-3xl font-black mb-4 tracking-tight">Today's AI Strategy</h3>
                  <p className="text-lg opacity-80 italic leading-relaxed">"{result.summary}"</p>
                  <div className="flex items-center gap-8 mt-8 pt-8 border-t border-white/20">
                    <div className="flex flex-col">
                       <span className="text-[10px] uppercase opacity-60 font-black tracking-widest">Total Spend</span>
                       <span className="text-3xl font-black">₹{result.totalCost}</span>
                    </div>
                     <div className="flex flex-col">
                       <span className="text-[10px] uppercase opacity-60 font-black tracking-widest">Logic Steps</span>
                       <span className="text-3xl font-black">{result.activities.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-8">
                {result.activities.map((act: any, idx: number) => (
                  <Card key={idx} className="border-2 rounded-[2.5rem] overflow-hidden hover:shadow-xl transition-all group">
                    <CardContent className="p-0 flex flex-col md:flex-row">
                      <div className="relative w-full md:w-72 h-64 md:h-auto shrink-0 overflow-hidden">
                        <Image 
                          src={getPlaceholderImageUrl(act.imageHint || 'hero-abstract')} 
                          alt={act.title} 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-6 left-6">
                          <Badge className="bg-white text-primary border-none font-black shadow-xl h-10 w-10 flex items-center justify-center p-0 rounded-xl text-lg">
                            {idx + 1}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex-1 p-10 flex flex-col">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex gap-2">
                            <Badge variant="secondary" className="font-black uppercase text-[10px] tracking-widest">{act.cost === 0 ? 'Free' : `₹${act.cost}`}</Badge>
                            <Badge variant="outline" className="font-black uppercase text-[10px] tracking-widest border-2">{act.durationMinutes} min</Badge>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="icon" className="h-16 w-16 rounded-full shadow-xl bg-primary hover:scale-110 transition-transform">
                                <Sparkles className="h-8 w-8" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-[2rem] border-2 sm:max-w-[500px] p-8">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-black flex items-center gap-2">
                                  <Sparkles className="text-primary" /> Logic Breakdown
                                </DialogTitle>
                                <DialogDescription className="text-base font-medium text-foreground py-6 leading-relaxed italic">
                                  {act.reason}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="p-6 bg-muted/30 rounded-2xl border-2 space-y-2">
                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Activity Detail</p>
                                <p className="text-lg font-black">{act.title}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">{act.description}</p>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <h3 className="text-3xl font-black mb-3 group-hover:text-primary transition-colors">{act.title}</h3>
                        <p className="text-muted-foreground leading-relaxed flex-1">{act.description}</p>
                        
                        <div className="mt-8 pt-6 border-t flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary">
                           <span>Selected for: {profile.role}</span>
                           <span className="text-muted-foreground opacity-60">Phase {idx + 1} of Day</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-4 border-dashed rounded-[3rem] flex flex-col items-center justify-center text-muted-foreground p-12 text-center opacity-40">
              <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center mb-6">
                <Clock className="h-12 w-12" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tight mb-2">Itinerary Idle</h3>
              <p className="max-w-xs text-lg font-medium">Define your constraints. The AI will cross-reference your budget, time, persona, and health needs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
