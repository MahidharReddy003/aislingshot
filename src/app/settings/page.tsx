
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, serverTimestamp } from 'firebase/firestore';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking, useAuth } from '@/firebase';
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
  AlertCircle,
  Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';

const INTERESTS = ['Food', 'Events', 'Shopping', 'Travel', 'Tech', 'Music', 'Outdoors'];
const HEALTH_TAGS = ['Diabetes', 'Vegan', 'Gluten-Free', 'Knee Pain', 'Asthma', 'Peanut Allergy'];

export default function SettingsPage() {
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const userDocRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: profile, isLoading } = useDoc(userDocRef);

  const [localInterests, setLocalInterests] = useState<string[]>([]);
  const [localHealth, setLocalHealth] = useState<string[]>([]);
  const [budgetVal, setBudgetVal] = useState(500);
  const [discoveryVal, setDiscoveryVal] = useState(50);

  useEffect(() => {
    if (profile) {
      setLocalInterests(profile.interests || []);
      setLocalHealth(profile.healthConditions || []);
      setBudgetVal(profile.budgetPreference || 500);
      setDiscoveryVal(profile.explorationLevel || 50);
    }
  }, [profile]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDocRef) return;
    
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const updates = {
      name: formData.get('name'),
      location: formData.get('location'),
      updatedAt: serverTimestamp()
    };

    updateDocumentNonBlocking(userDocRef, updates);
    toast({ title: 'Identity Updated', description: 'Your profile changes have been applied.' });
  };

  const handleSaveSettings = (updates: any, sectionName: string) => {
    if (!userDocRef) return;
    
    updateDocumentNonBlocking(userDocRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    toast({ title: 'Settings Saved', description: `${sectionName} preferences updated successfully.` });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
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

        <TabsContent value="profile" className="space-y-4">
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
                  <Button type="submit" className="h-12 px-10 font-bold rounded-xl shadow-lg">
                    Update Identity
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
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
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-6">
              <Button 
                onClick={() => handleSaveSettings({ interests: localInterests }, 'Preferences')} 
                className="w-full h-12 rounded-xl font-bold"
              >
                Apply Interest Matrix
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
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
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-6">
              <Button 
                onClick={() => handleSaveSettings({ budgetPreference: budgetVal }, 'Budget')} 
                className="w-full h-12 rounded-xl font-bold"
              >
                Lock Budget Rules
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="discovery" className="space-y-4">
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
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 border-t p-6">
              <Button onClick={() => handleSaveSettings({ explorationLevel: discoveryVal }, 'Discovery')} className="w-full h-12 rounded-xl font-bold">Refresh Exploration Logic</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Inclusion & Health Profile</CardTitle>
              <CardDescription>Manage dietary needs and health conditions for precise AI filtering.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 py-6">
              <div className="space-y-4">
                <Label className="font-bold flex items-center gap-2">
                  <Activity className="h-4 w-4 text-primary" /> Health & Dietary Constraints
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-2 p-6 rounded-2xl bg-muted/20">
                  {HEALTH_TAGS.map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`set-health-${tag}`} 
                        checked={localHealth.includes(tag)} 
                        onCheckedChange={(checked) => {
                          if (checked) setLocalHealth(prev => [...prev, tag]);
                          else setLocalHealth(prev => prev.filter(h => h !== tag));
                        }}
                      />
                      <label htmlFor={`set-health-${tag}`} className="text-sm font-bold leading-none cursor-pointer">{tag}</label>
                    </div>
                  ))}
                </div>
                <Button 
                  size="sm"
                  onClick={() => handleSaveSettings({ healthConditions: localHealth }, 'Health Constraints')}
                  className="rounded-xl"
                >
                  Save Health Matrix
                </Button>
              </div>

              <div className="pt-6 border-t space-y-4">
                {[
                  { key: 'lowMobility', title: 'Low Mobility Priority', desc: 'Prioritize locations with ramp access and minimal walking.', icon: Accessibility },
                  { key: 'highContrast', title: 'High Contrast Mode', desc: 'Increase text weight and button prominence for clarity.', icon: Eye },
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
                    <Switch 
                      checked={profile[item.key]} 
                      onCheckedChange={(c) => handleSaveSettings({ [item.key]: c }, item.title)} 
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
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
                <Switch checked={profile?.telemetry} onCheckedChange={(c) => handleSaveSettings({ telemetry: c }, 'Telemetry')} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Proactive Logic Engagement</CardTitle>
              <CardDescription>Determine when the assistant is permitted to offer unsolicited logic.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 py-6">
              {[
                { key: 'budgetAlerts', title: 'Budget Threshold Alerts', desc: 'Notify when current activity consumes 80% of daily cap.' },
                { key: 'smartGaps', title: 'Smart Gap Fillers', desc: 'Suggest mini-activities when a calendar gap is detected.' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-6 bg-muted/20 rounded-2xl border-2">
                  <div className="space-y-1">
                    <Label className="text-base font-bold">{item.title}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch 
                    checked={profile[item.key]} 
                    onCheckedChange={(c) => handleSaveSettings({ [item.key]: c }, item.title)} 
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
