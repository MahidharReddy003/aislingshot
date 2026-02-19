'use client';

import { useState, useEffect } from 'react';
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
  Eye,
  Trash2,
  AlertCircle
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
  const [localInterests, setLocalInterests] = useState<string[]>([]);
  const [budgetVal, setBudgetVal] = useState(500);
  const [discoveryVal, setDiscoveryVal] = useState(50);

  useEffect(() => {
    if (profile) {
      setLocalInterests(profile.interests || []);
      setBudgetVal(profile.budgetPreference || 500);
    }
  }, [profile]);

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
      toast({ title: 'Identity Updated', description: 'Your profile changes have been saved.' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async (updates: any, sectionName: string) => {
    if (!userDocRef) return;
    setSaving(true);
    try {
      await updateDoc(userDocRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      toast({ title: 'Settings Saved', description: `${sectionName} preferences updated successfully.` });
    } catch (error: any) {
      toast({ title: 'Save Failed', description: error.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    if (!auth) return;
    await signOut(auth);
    router.replace('/login');
  };

  if (isLoading || !profile) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-primary">SmartLife Control Center</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage your persona, privacy, and AI constraints with full transparency.</p>
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
              <CardTitle>Identity & Context</CardTitle>
              <CardDescription>How the SmartLife assistant identifies your daily environment.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Full Name</Label>
                    <Input id="name" name="name" defaultValue={profile?.name} placeholder="Enter your name" className="h-12 border-2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Search Location</Label>
                    <Input id="location" name="location" defaultValue={profile?.location} placeholder="e.g., Campus North" className="h-12 border-2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Email (Authenticated)</Label>
                  <Input value={user?.email || ''} disabled className="bg-muted h-12 border-2 opacity-60 cursor-not-allowed" />
                </div>
                <div className="pt-6 border-t flex justify-between items-center">
                  <Button type="button" variant="ghost" onClick={handleLogout} className="text-destructive hover:bg-destructive/5 gap-2 px-6 h-12">
                    <LogOut className="h-4 w-4" /> Sign Out
                  </Button>
                  <Button type="submit" disabled={saving} className="h-12 px-10 font-bold rounded-xl shadow-lg">
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Identity
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
              <CardTitle>Interests & AI Behavior</CardTitle>
              <CardDescription>Refine the thematic priority and tone of your SmartLife assistant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 py-6">
              <div className="space-y-4">
                <Label className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Thematic Focus</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {INTERESTS.map(item => (
                    <div key={item} className="flex items-center space-x-3 p-4 border-2 rounded-2xl hover:bg-muted/20 transition-colors">
                      <Checkbox 
                        id={`check-${item}`} 
                        checked={localInterests.includes(item)} 
                        onCheckedChange={(checked) => {
                          if (checked) setLocalInterests(prev => [...prev, item]);
                          else setLocalInterests(prev => prev.filter(i => i !== item));
                        }}
                      />
                      <label htmlFor={`check-${item}`} className="text-sm font-bold leading-none cursor-pointer">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t">
                <Label className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Assistant Response Tone</Label>
                <div className="flex flex-wrap gap-3">
                  {['Friendly', 'Formal', 'Concise'].map(style => (
                    <Button 
                      key={style}
                      variant={profile?.aiBehavior === style.toLowerCase() ? 'default' : 'outline'} 
                      className="rounded-2xl px-8 h-12 border-2 font-bold"
                      onClick={() => handleSaveSettings({ aiBehavior: style.toLowerCase() }, 'AI Tone')}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2 italic flex items-center gap-2">
                  <Info className="h-3 w-3" /> "Friendly" provides deep logic and emojis. "Concise" gives direct, data-only reasoning.
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-6">
              <Button 
                onClick={() => handleSaveSettings({ interests: localInterests }, 'Preferences')} 
                disabled={saving} 
                className="w-full h-12 rounded-xl font-bold"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Apply Interest Matrix
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* BUDGET TAB */}
        <TabsContent value="budget" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Budget Hard-Rules</CardTitle>
              <CardDescription>Define the non-negotiable financial constraints the AI must respect.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 py-6">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <Label className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Maximum Daily Spend</Label>
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
                    <Label className="text-base font-bold">Strict Budget Enforcement</Label>
                    <p className="text-xs text-muted-foreground">AI will never show options that exceed your cap by even ₹1.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-6 bg-muted/20 rounded-2xl border-2">
                  <div className="space-y-1">
                    <Label className="text-base font-bold">Rolling Savings Bonus</Label>
                    <p className="text-xs text-muted-foreground">Unspent daily budget adds to your weekend 'exploratory' pool.</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-6">
              <Button 
                onClick={() => handleSaveSettings({ budgetPreference: budgetVal }, 'Budget')} 
                disabled={saving} 
                className="w-full h-12 rounded-xl font-bold"
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Lock Budget Rules
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* DISCOVERY TAB */}
        <TabsContent value="discovery" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Discovery & Filter Bubble Control</CardTitle>
              <CardDescription>Balance known comfort against the novelty of unexplored territory.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 py-6">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <Label className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Exploration Bias</Label>
                  <span className="text-lg font-black text-primary uppercase">
                    {discoveryVal < 30 ? 'Conservative' : discoveryVal > 70 ? 'High Discovery' : 'Balanced'}
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
                  <span>Reliable Favorites</span>
                  <span>Wild & Unknown</span>
                </div>
              </div>
              <div className="p-6 bg-primary/5 rounded-2xl border-2 border-primary/10 flex items-center justify-between gap-6">
                <div className="space-y-1">
                  <Label className="text-base font-bold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Anti-Stagnation Guard</Label>
                  <p className="text-xs text-muted-foreground">Force at least one high-diversity suggestion per day to prevent filter bubbles.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-6">
              <Button onClick={() => handleSaveSettings({ explorationLevel: discoveryVal }, 'Discovery')} disabled={saving} className="w-full h-12 rounded-xl font-bold">Refresh Exploration Logic</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* ACCESSIBILITY TAB */}
        <TabsContent value="accessibility" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Inclusion & Visual Profiling</CardTitle>
              <CardDescription>Ensure SmartLife adaptively respects your physical and cognitive needs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 py-6">
              {[
                { title: 'Low Mobility Priority', desc: 'Prioritize locations with ramp access and minimal walking.', icon: Accessibility },
                { title: 'Time-Critical Alerts', desc: 'Haptic feedback for time-sensitive activity start windows.', icon: Bell },
                { title: 'High Contrast Mode', desc: 'Increase text weight and button prominence for clarity.', icon: Eye },
                { title: 'Plain-Language Logic', desc: 'Simplify AI explanations into direct bullet points.', icon: Info }
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
              <Button onClick={() => handleSaveSettings({}, 'Accessibility')} disabled={saving} className="w-full h-12 rounded-xl font-bold">Save Inclusive Profile</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* PRIVACY TAB */}
        <TabsContent value="privacy" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader className="bg-accent/10 border-b pb-8">
              <div className="flex items-center gap-3 text-primary mb-2">
                <Shield className="h-6 w-6" />
                <CardTitle>Transparency & Data Promise</CardTitle>
              </div>
              <CardDescription className="text-primary/70 leading-relaxed font-medium">
                We only process data to refine your local experience. We never sell profile clusters to advertisers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
              <div className="flex items-center justify-between p-4 border-2 rounded-2xl">
                <div className="space-y-1">
                  <Label className="font-bold">Anonymized Telemetry</Label>
                  <p className="text-xs text-muted-foreground">Contribute non-identifiable logic patterns to improve global models.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 border-2 rounded-2xl">
                <div className="space-y-1">
                  <Label className="font-bold">On-Device Logic Priority</Label>
                  <p className="text-xs text-muted-foreground">Perform more processing locally for extreme privacy (may be slower).</p>
                </div>
                <Switch />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <Button variant="outline" className="h-12 rounded-xl font-bold border-2 gap-2">
                  <History className="h-4 w-4" /> Clear Local Cache
                </Button>
                <Button variant="outline" className="h-12 rounded-xl font-bold border-2 text-destructive border-destructive/20 hover:bg-destructive/5 gap-2">
                  <Trash2 className="h-4 w-4" /> Factory Reset AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Proactive Logic Engagement</CardTitle>
              <CardDescription>Determine when the assistant is permitted to offer unsolicited logic.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 py-6">
              {[
                { title: 'Budget Threshold Alerts', desc: 'Notify when current activity consumes 80% of daily cap.', default: true },
                { title: 'Smart Gap Fillers', desc: 'Suggest mini-activities when a calendar gap is detected.', default: true },
                { title: 'Transparency Reports', desc: 'Weekly summary of how your feedback changed AI logic.', default: false },
                { title: 'Contextual Queries', desc: 'Allow AI to ask for feedback immediately after a saved event.', default: true }
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
              <Button onClick={() => handleSaveSettings({}, 'Notifications')} disabled={saving} className="w-full h-12 rounded-xl font-bold">Update Alert Engine</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-12 p-6 bg-yellow-50 border-2 border-yellow-100 rounded-3xl flex gap-4 items-start">
        <AlertCircle className="h-6 w-6 text-yellow-600 shrink-0 mt-1" />
        <div>
          <h4 className="font-bold text-yellow-900">User Control Overrides</h4>
          <p className="text-sm text-yellow-800 leading-relaxed">
            Settings marked with "Hard Rules" take absolute precedence over the AI recommendation engine. 
            If your budget is set to ₹500, SmartLife will never present an option costing ₹501, even if it is a 100% preference match.
          </p>
        </div>
      </div>
    </div>
  );
}
