
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, 
  Shield, 
  Bell, 
  LogOut, 
  Loader2, 
  Sparkles, 
  Wallet, 
  Accessibility, 
  Settings2,
  Lock,
  History,
  Info,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';

const INTERESTS = ['Food', 'Events', 'Shopping', 'Travel', 'Tech', 'Music', 'Outdoors'];

export default function SettingsPage() {
  const { user, auth } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const userDocRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: profile, isLoading } = useDoc(userDocRef);

  const [saving, setSaving] = useState(false);
  const [budgetVal, setBudgetVal] = useState(profile?.budgetPreference || 500);
  const [discoveryVal, setDiscoveryVal] = useState(50);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDocRef) return;
    setSaving(true);
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      await updateDoc(userDocRef, {
        name: formData.get('name'),
        location: formData.get('location'),
        updatedAt: serverTimestamp()
      });
      toast({ title: 'Settings Updated', description: 'Your profile changes have been saved.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const handleMockSave = (section: string) => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: 'Changes Saved', description: `${section} preferences have been updated successfully.` });
    }, 800);
  };

  if (isLoading || !profile) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-primary">Control Center</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage your SmartLife persona, privacy, and AI constraints.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-muted p-1 border grid grid-cols-4 md:grid-cols-7 h-auto gap-1 rounded-2xl shadow-inner">
          <TabsTrigger value="profile" className="rounded-xl data-[state=active]:shadow-md gap-2 py-3"><User className="h-4 w-4" /> <span className="hidden md:inline">Profile</span></TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-xl data-[state=active]:shadow-md gap-2 py-3"><Settings2 className="h-4 w-4" /> <span className="hidden md:inline">Interests</span></TabsTrigger>
          <TabsTrigger value="budget" className="rounded-xl data-[state=active]:shadow-md gap-2 py-3"><Wallet className="h-4 w-4" /> <span className="hidden md:inline">Budget</span></TabsTrigger>
          <TabsTrigger value="discovery" className="rounded-xl data-[state=active]:shadow-md gap-2 py-3"><Sparkles className="h-4 w-4" /> <span className="hidden md:inline">Discovery</span></TabsTrigger>
          <TabsTrigger value="accessibility" className="rounded-xl data-[state=active]:shadow-md gap-2 py-3"><Accessibility className="h-4 w-4" /> <span className="hidden md:inline">Access</span></TabsTrigger>
          <TabsTrigger value="privacy" className="rounded-xl data-[state=active]:shadow-md gap-2 py-3"><Lock className="h-4 w-4" /> <span className="hidden md:inline">Privacy</span></TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:shadow-md gap-2 py-3"><Bell className="h-4 w-4" /> <span className="hidden md:inline">Alerts</span></TabsTrigger>
        </TabsList>

        {/* PROFILE TAB */}
        <TabsContent value="profile" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/20 pb-8">
              <CardTitle>Identity & Role</CardTitle>
              <CardDescription>How the AI assistant identifies you and identifies your daily context.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Full Name</Label>
                    <Input id="name" name="name" defaultValue={profile?.name} placeholder="Enter your name" className="h-12 border-2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Default Search Radius</Label>
                    <Input id="location" name="location" defaultValue={profile?.location} placeholder="e.g., Campus North" className="h-12 border-2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Email Address</Label>
                  <Input value={user?.email || ''} disabled className="bg-muted h-12 border-2 opacity-60 cursor-not-allowed" />
                  <p className="text-[10px] text-muted-foreground italic">Email is tied to your primary authentication and cannot be changed here.</p>
                </div>
                <div className="pt-6 border-t flex justify-between items-center">
                  <Button type="button" variant="ghost" onClick={handleLogout} className="text-destructive hover:bg-destructive/5 gap-2 px-6 h-12">
                    <LogOut className="h-4 w-4" /> Logout Session
                  </Button>
                  <Button type="submit" disabled={saving} className="h-12 px-10 font-bold rounded-xl shadow-lg">
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PREFERENCES TAB */}
        <TabsContent value="preferences" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Interests & AI Personality</CardTitle>
              <CardDescription>Tailor the tone and content priority of your SmartLife assistant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 py-6">
              <div className="space-y-4">
                <Label className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Active Priority Interests</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {INTERESTS.map(item => (
                    <div key={item} className="flex items-center space-x-3 p-4 border-2 rounded-2xl hover:bg-muted/20 transition-colors">
                      <Checkbox id={`check-${item}`} defaultChecked={profile?.interests?.includes(item)} />
                      <label htmlFor={`check-${item}`} className="text-sm font-bold leading-none cursor-pointer">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t">
                <Label className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Assistant Interaction Style</Label>
                <div className="flex flex-wrap gap-3">
                  {['Friendly', 'Formal', 'Concise'].map(style => (
                    <Button 
                      key={style}
                      variant={profile?.aiBehavior === style.toLowerCase() ? 'default' : 'outline'} 
                      className="rounded-2xl px-8 h-12 border-2 font-bold"
                      onClick={() => handleMockSave(`Style: ${style}`)}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2 italic flex items-center gap-2">
                  <Info className="h-3 w-3" /> "Friendly" adds context and emojis. "Concise" focuses on raw facts and direct reasoning.
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-6">
              <Button onClick={() => handleMockSave('Preferences')} disabled={saving} className="w-full h-12 rounded-xl font-bold">Apply Style Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* BUDGET TAB */}
        <TabsContent value="budget" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Budget Guardrails</CardTitle>
              <CardDescription>Strict constraints the AI must respect when suggesting activities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 py-6">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <Label className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Daily Spending Cap</Label>
                  <span className="text-2xl font-black text-primary">₹{budgetVal}</span>
                </div>
                <Slider 
                  value={[budgetVal]} 
                  max={2000} 
                  step={50} 
                  onValueChange={(val) => setBudgetVal(val[0])} 
                  className="py-4"
                />
              </div>
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between p-6 bg-muted/20 rounded-2xl border-2">
                  <div className="space-y-1">
                    <Label className="text-base font-bold">Strict Enforcement</Label>
                    <p className="text-xs text-muted-foreground">Filter out any result that exceeds your cap by even ₹1.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-6 bg-muted/20 rounded-2xl border-2">
                  <div className="space-y-1">
                    <Label className="text-base font-bold">Weekly Rollover</Label>
                    <p className="text-xs text-muted-foreground">Unspent daily budget automatically adds to your weekend limit.</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-6">
              <Button onClick={() => handleMockSave('Budget')} disabled={saving} className="w-full h-12 rounded-xl font-bold">Update Guardrails</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* DISCOVERY TAB */}
        <TabsContent value="discovery" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Discovery Engine</CardTitle>
              <CardDescription>Balance your familiar favorites with the thrill of new territory.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 py-6">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <Label className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Discovery Bias</Label>
                  <span className="text-lg font-black text-primary uppercase">
                    {discoveryVal < 30 ? 'Conservative' : discoveryVal > 70 ? 'Exploratory' : 'Balanced'}
                  </span>
                </div>
                <Slider 
                  value={[discoveryVal]} 
                  max={100} 
                  step={10} 
                  onValueChange={(val) => setDiscoveryVal(val[0])} 
                  className="py-4"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-black uppercase tracking-tighter px-1">
                  <span>Safe & Known</span>
                  <span>Wild & Unknown</span>
                </div>
              </div>
              <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/10 flex items-center justify-between gap-6">
                <div className="space-y-1">
                  <Label className="text-base font-bold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Anti-Filter Bubble</Label>
                  <p className="text-xs text-muted-foreground">Force at least one completely new category suggestion per day to prevent stagnation.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-6">
              <Button onClick={() => handleMockSave('Discovery')} disabled={saving} className="w-full h-12 rounded-xl font-bold">Refresh Engine Logic</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ACCESSIBILITY TAB */}
        <TabsContent value="accessibility" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Inclusion & Visibility</CardTitle>
              <CardDescription>Ensure SmartLife recommendations and UI adapt to your physical needs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 py-6">
              {[
                { title: 'Low Walking Mode', desc: 'Prioritize locations within 500m of transit or with ramp access.', icon: Accessibility },
                { title: 'Time-Sensitive Alerts', desc: 'Haptic and visual warnings for activity start times.', icon: Bell },
                { title: 'High Contrast UI', desc: 'Increase text legibility and button prominence.', icon: Eye },
                { title: 'Simplified Descriptions', desc: 'Use direct, simple language for all AI explanations.', icon: Info }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-muted/20 rounded-2xl border-2">
                  <div className="flex gap-4 items-center">
                    <div className="p-3 rounded-xl bg-background border-2">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-0.5">
                      <Label className="text-base font-bold">{item.title}</Label>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              ))}
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-6">
              <Button onClick={() => handleMockSave('Accessibility')} disabled={saving} className="w-full h-12 rounded-xl font-bold">Save Accessibility Profile</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* PRIVACY TAB */}
        <TabsContent value="privacy" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader className="bg-accent/10 border-b pb-8">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Shield className="h-6 w-6" />
                <CardTitle>Transparency Promise</CardTitle>
              </div>
              <CardDescription className="text-primary/70 leading-relaxed font-medium">
                We only use your interaction data to refine your personalized local models. We never sell your data to third parties.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
              <div className="flex items-center justify-between p-4 border-2 rounded-2xl">
                <div className="space-y-1">
                  <Label className="font-bold">Anonymous Telemetry</Label>
                  <p className="text-xs text-muted-foreground">Share non-identifiable usage patterns to improve global AI models.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border-2 rounded-2xl">
                <div className="space-y-1">
                  <Label className="font-bold">Local Model Priority</Label>
                  <p className="text-xs text-muted-foreground">Perform more processing on-device for extreme privacy (may be slower).</p>
                </div>
                <Switch />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <Button variant="outline" className="h-12 rounded-xl font-bold border-2 gap-2">
                  <History className="h-4 w-4" /> Clear History
                </Button>
                <Button variant="outline" className="h-12 rounded-xl font-bold border-2 text-destructive border-destructive/20 hover:bg-destructive/5">
                  Reset Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Proactive Alerts</CardTitle>
              <CardDescription>Choose when the assistant is allowed to reach out to you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 py-6">
              {[
                { title: 'Budget Milestone Alerts', desc: 'Notify when I reach 80% of my daily spending cap.', default: true },
                { title: 'Smart Gap Discovery', desc: 'Suggest activities when I have a free gap in my calendar.', default: true },
                { title: 'Weekly Insight Reports', desc: 'Email summaries of my savings and discoveries.', default: false },
                { title: 'Contextual Prompting', desc: 'Allow AI to ask for feedback immediately after a saved activity.', default: true }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-muted/20 rounded-2xl border-2">
                  <div className="space-y-1">
                    <Label className="text-base font-bold">{item.title}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.default} />
                </div>
              ))}
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-6">
              <Button onClick={() => handleMockSave('Notifications')} disabled={saving} className="w-full h-12 rounded-xl font-bold">Save Alert Rules</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
