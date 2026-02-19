
'use client';

import { useState } from 'react';
import { planDay } from '@/ai/flows/plan-day-flow';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Clock, DollarSign, Sparkles, Loader2, Target, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function PlanMyDayPage() {
  const { user } = useUser();
  const db = useFirestore();
  const { data: profile } = useDoc(user ? doc(db, 'users', user.uid) : null);
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
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">AI Day Planner</h1>
        <p className="text-muted-foreground">Personalized plans that fit your budget and schedule.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <Card className="border-2 sticky top-24">
            <CardHeader>
              <CardTitle>Constraints</CardTitle>
              <CardDescription>What are we working with?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="budget">Budget (₹)</Label>
                  <span className="font-bold">₹{budget}</span>
                </div>
                <Input id="budget" type="number" value={budget} onChange={e => setBudget(parseInt(e.target.value))} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="time">Available Time (min)</Label>
                  <span className="font-bold">{time} min</span>
                </div>
                <Input id="time" type="number" value={time} onChange={e => setTime(parseInt(e.target.value))} />
              </div>
              <Button onClick={handlePlan} className="w-full h-12 gap-2" disabled={loading || !profile}>
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                Generate Plan
              </Button>
              {!profile && <p className="text-[10px] text-red-500 text-center italic">Please complete profile setup first.</p>}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          {result ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="p-6 rounded-2xl bg-primary text-primary-foreground">
                <h3 className="text-xl font-bold mb-2">Plan Summary</h3>
                <p className="text-sm opacity-90 italic">{result.summary}</p>
                <div className="mt-4 flex gap-4 text-xs font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> Total: ₹{result.totalCost}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Time: {result.activities.reduce((acc: any, curr: any) => acc + curr.durationMinutes, 0)} min</span>
                </div>
              </div>

              <div className="grid gap-4">
                {result.activities.map((act: any, idx: number) => (
                  <Card key={idx} className="border-2 hover:border-primary/50 transition-colors">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <Badge variant="outline" className="px-2">Activity {idx + 1}</Badge>
                        <span className="text-xs font-bold text-primary">₹{act.cost}</span>
                      </div>
                      <CardTitle className="text-xl mt-2">{act.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{act.description}</p>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="logic" className="border-none">
                          <AccordionTrigger className="text-xs font-bold text-primary bg-primary/5 px-3 py-2 rounded-lg hover:no-underline">
                            <div className="flex items-center gap-2">
                              <Target className="h-3 w-3" /> Why This? (AI Reasoning)
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-3 px-3 italic text-sm text-muted-foreground">
                            {act.reason}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="w-full gap-2 border-2">
                <CheckCircle className="h-4 w-4" /> Save This Plan
              </Button>
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-4 border-dashed rounded-3xl flex flex-col items-center justify-center text-muted-foreground p-12 text-center opacity-40">
              <Clock className="h-16 w-16 mb-4" />
              <h3 className="text-xl font-bold">Your Day Awaits</h3>
              <p className="max-w-xs">Enter your budget and free time to get a perfectly balanced AI-curated experience.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
