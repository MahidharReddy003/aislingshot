
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { doc, serverTimestamp } from 'firebase/firestore';
import { updateProfile, signOut } from 'firebase/auth';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking, useAuth } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
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
  Activity,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  // Identity State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');

  // Other settings state
  const [localInterests, setLocalInterests] = useState<string[]>([]);
  const [localHealth, setLocalHealth] = useState<string[]>([]);
  const [budgetVal, setBudgetVal] = useState(500);
  const [discoveryVal, setDiscoveryVal] = useState(50);

  const hasPasswordProvider = user?.providerData.some(p => p.providerId === 'password');
  const isGoogleUser = user?.providerData.some(p => p.providerId === 'google.com');

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setLocation(profile.location || '');
      setLocalInterests(profile.interests || []);
      setLocalHealth(profile.healthConditions || []);
      setBudgetVal(profile.budgetPreference || 500);
      setDiscoveryVal(profile.explorationLevel || 50);
    }
  }, [profile]);

  const handleNameChange = (val: string) => {
    setName(val);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDocRef || !user) return;
    
    const updates = {
      name,
      username: name, // Sync username with name internally
      location,
      updatedAt: serverTimestamp()
    };

    // Update Firestore
    updateDocumentNonBlocking(userDocRef, updates);
    
    // Update Firebase Auth Display Name to stay in sync
    try {
      await updateProfile(user, { displayName: name });
    } catch (err) {
      console.error("Auth profile update failed", err);
    }

    toast({ title: 'Identity Updated', description: 'Your profile and display name have been synchronized.' });
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

      {isGoogleUser && !hasPasswordProvider && (
        <Alert className="mb-8 border-2 border-primary/20 bg-primary/5">
          <Shield className="h-4 w-4 text-primary" />
          <AlertTitle className="font-bold">Account Security</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span>Secure your account by setting a password. This allows you to log in with your email even if Google is unavailable.</span>
            <Button asChild size="sm" className="font-bold shrink-0">
              <Link href="/settings/security">
                Set Password <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-muted p-1 border grid grid-cols-4 md:grid-cols-8 h-auto gap-1 rounded-2xl shadow-inner">
          <TabsTrigger value="profile" className="rounded-xl data-[state=active]:shadow-md gap-2 py-3"><User className="h-4 w-4" /> <span className="hidden md:inline">Profile</span></TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-xl data-[state=active]:shadow-md gap-2 py-3"><Settings2 className="h-4 w-4" /> <span className="hidden md:inline">Interests</span></TabsTrigger>
          <TabsTrigger value="budget" className="rounded-xl data-[state=active]:shadow-md gap-2 py-3"><Wallet className="h-4 w-4" /> <span className="hidden md:inline">Budget</span></TabsTrigger>
          <TabsTrigger value="discovery" className="rounded-xl data-[state=active]:shadow-md gap-2 py-3"><Sparkles className="h-4 w-4" /> <span className="hidden md:inline">Discovery</span></TabsTrigger>
          <TabsTrigger value="accessibility" className="rounded-xl data-[state=active]:shadow-md gap-2 py-3"><Accessibility className="h-4 w-4" /> <span className="hidden md:inline">Access</span></TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl data-[state=active]:shadow-md gap-2 py-3"><Lock className="h-4 w-4" /> <span className="hidden md:inline">Security</span></TabsTrigger>
          <TabsTrigger value="privacy" className="rounded-xl data-[state=active]:shadow-md gap-2 py-3"><Shield className="h-4 w-4" /> <span className="hidden md:inline">Privacy</span></TabsTrigger>
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
                    <Input id="name" value={name} onChange={e => handleNameChange(e.target.value)} placeholder="Enter your full name" className="h-12 border-2" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Search Location</Label>
                    <Input id="location" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Campus North" className="h-12 border-2" />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold uppercase text-[10px] tracking-widest text-muted-foreground">Email (Authenticated)</Label>
                    <Input value={user?.email || ''} disabled className="bg-muted h-12 border-2 opacity-60 cursor-not-allowed" />
                  </div>
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

        <TabsContent value="security" className="space-y-4">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Security & Access</CardTitle>
              <CardDescription>Manage how you access your SmartLife account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="flex items-center justify-between p-6 bg-muted/20 rounded-2xl border-2">
                <div className="flex gap-4 items-center">
                  <div className="p-3 rounded-xl bg-background border-2">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Password Protection</Label>
                    <p className="text-xs text-muted-foreground">
                      {hasPasswordProvider 
                        ? "You have a password set for this account." 
                        : "You are currently only using social login."}
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" className="font-bold rounded-xl h-11">
                  <Link href="/settings/security">
                    {hasPasswordProvider ? "Update Password" : "Set Password"}
                  </Link>
                </Button>
              </div>

              <div className="p-6 bg-muted/20 rounded-2xl border-2 space-y-4">
                <h4 className="font-bold flex items-center gap-2"><Shield className="h-4 w-4" /> Connected Accounts</h4>
                <div className="space-y-3">
                  {user?.providerData.map((provider) => (
                    <div key={provider.providerId} className="flex items-center justify-between py-2 border-b last:border-none">
                      <div className="flex items-center gap-3">
                        {provider.providerId === 'google.com' ? (
                          <svg className="h-4 w-4" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                        ) : (
                          <Lock className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium capitalize">
                          {provider.providerId.replace('.com', '')} Account
                        </span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] font-bold">Active</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
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
                      checked={profile[item.key as keyof typeof profile] as boolean} 
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
                    checked={profile[item.key as keyof typeof profile] as boolean} 
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
