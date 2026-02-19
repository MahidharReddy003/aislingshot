
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
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  Info,
  Eye,
  Activity,
  Camera,
  Calendar,
  Mail,
  ShieldCheck,
  History,
  Download,
  Trash2,
  RefreshCcw,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const INTERESTS = ['Food', 'Events', 'Shopping', 'Travel', 'Tech', 'Music', 'Outdoors'];

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
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('Student');
  const [location, setLocation] = useState('');

  // Local Settings states
  const [localInterests, setLocalInterests] = useState<string[]>([]);
  const [dailyBudget, setDailyBudget] = useState(500);
  const [weeklyBudget, setWeeklyBudget] = useState(3000);
  const [discoveryVal, setDiscoveryVal] = useState(50);

  const hasPasswordProvider = user?.providerData.some(p => p.providerId === 'password');

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setBio(profile.bio || '');
      setRole(profile.role || 'Student');
      setLocation(profile.location || '');
      setLocalInterests(profile.interests || []);
      setDailyBudget(profile.budgetPreference || 500);
      setWeeklyBudget(profile.weeklyBudget || 3000);
      setDiscoveryVal(profile.explorationLevel || 50);
    }
  }, [profile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDocRef || !user) return;
    
    const updates = {
      name,
      username: name,
      bio,
      role,
      location,
      updatedAt: serverTimestamp()
    };

    updateDocumentNonBlocking(userDocRef, updates);
    
    try {
      await updateProfile(user, { displayName: name });
    } catch (err) {
      console.error("Auth profile update failed", err);
    }

    toast({ title: 'Profile Updated', description: 'Your identity and bio have been synchronized successfully.' });
  };

  const handleSaveSettings = (updates: any, sectionName: string) => {
    if (!userDocRef) return;
    
    updateDocumentNonBlocking(userDocRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    toast({ title: 'Settings Saved', description: `${sectionName} preferences updated successfully.` });
  };

  const handlePfpUpdate = () => {
    if (!userDocRef) return;
    // Simulate PFP update by changing the seed for picsum
    const newSeed = Math.floor(Math.random() * 1000);
    const newPfp = `https://picsum.photos/seed/${newSeed}/400/400`;
    
    updateDocumentNonBlocking(userDocRef, {
      profileImage: newPfp,
      updatedAt: serverTimestamp()
    });
    
    toast({ title: 'Photo Updated', description: 'Your profile picture has been updated.' });
  };

  const handleDownloadData = () => {
    if (!profile) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `smartlife_data_${user?.uid}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast({ title: 'Data Ready', description: 'Your user data JSON has been generated and downloaded.' });
  };

  const handleClearHistory = () => {
    if (!userDocRef) return;
    updateDocumentNonBlocking(userDocRef, {
      explorationLevel: 50,
      updatedAt: serverTimestamp()
    });
    toast({ title: 'History Purged', description: 'Your recommendation logic history has been cleared.' });
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
        <h1 className="text-4xl font-black tracking-tight text-primary">Control Center</h1>
        <p className="text-muted-foreground mt-2 text-lg">Manage your persona, privacy, and AI constraints.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList className="bg-muted p-1 border grid grid-cols-4 md:grid-cols-8 h-auto gap-1 rounded-2xl shadow-inner">
          <TabsTrigger value="profile" className="rounded-xl py-3 gap-2"><User className="h-4 w-4" /> <span className="hidden lg:inline">Profile</span></TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-xl py-3 gap-2"><Settings2 className="h-4 w-4" /> <span className="hidden lg:inline">Preferences</span></TabsTrigger>
          <TabsTrigger value="budget" className="rounded-xl py-3 gap-2"><Wallet className="h-4 w-4" /> <span className="hidden lg:inline">Budget</span></TabsTrigger>
          <TabsTrigger value="discovery" className="rounded-xl py-3 gap-2"><Sparkles className="h-4 w-4" /> <span className="hidden lg:inline">Discovery</span></TabsTrigger>
          <TabsTrigger value="accessibility" className="rounded-xl py-3 gap-2"><Accessibility className="h-4 w-4" /> <span className="hidden lg:inline">Access</span></TabsTrigger>
          <TabsTrigger value="privacy" className="rounded-xl py-3 gap-2"><Shield className="h-4 w-4" /> <span className="hidden lg:inline">Privacy</span></TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl py-3 gap-2"><Bell className="h-4 w-4" /> <span className="hidden lg:inline">Alerts</span></TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl py-3 gap-2"><Lock className="h-4 w-4" /> <span className="hidden lg:inline">Security</span></TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader className="bg-muted/10">
              <CardTitle>Identity & Context</CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="relative group cursor-pointer" onClick={handlePfpUpdate}>
                    <Avatar className="h-24 w-24 border-2 border-background shadow-md">
                      <AvatarImage src={profile.profileImage || `https://picsum.photos/seed/${user?.uid}/400/400`} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white h-6 w-6" />
                    </div>
                  </div>
                  
                  <div className="flex-1 w-full space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Full Name</Label>
                        <Input value={name} onChange={e => setName(e.target.value)} className="h-12 border-2" />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Location</Label>
                        <Input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g., Campus North" className="h-12 border-2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Bio</Label>
                      <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell the AI about your day..." className="min-h-[100px] border-2 resize-none" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Your Primary Role</Label>
                      <Select value={role} onValueChange={setRole}>
                        <SelectTrigger className="h-12 border-2"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Student">Student</SelectItem>
                          <SelectItem value="Traveler">Traveler</SelectItem>
                          <SelectItem value="Creator">Creator</SelectItem>
                          <SelectItem value="Professional">Professional</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                   <Button type="submit" className="h-12 px-10 font-bold rounded-xl shadow-lg">Save Profile</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader className="bg-muted/10">
              <CardTitle className="text-sm font-bold uppercase tracking-widest">Account Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 grid sm:grid-cols-3 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Calendar className="h-3 w-3" /> Member Since</p>
                <p className="text-sm font-bold">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Mail className="h-3 w-3" /> Status</p>
                <Badge variant={user?.emailVerified ? 'default' : 'outline'}>{user?.emailVerified ? 'Verified' : 'Pending'}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1"><Shield className="h-3 w-3" /> Providers</p>
                <div className="flex gap-1">
                  {user?.providerData.map(p => (
                    <Badge key={p.providerId} variant="secondary" className="text-[9px] uppercase">{p.providerId.split('.')[0]}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Interests & Behavioral Matrix</CardTitle>
              <CardDescription>How the AI prioritizes categories and styles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">General Interests</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {INTERESTS.map(item => (
                    <div key={item} className="flex items-center space-x-3 p-3 border-2 rounded-xl hover:bg-muted/30 transition-colors">
                      <Checkbox 
                        id={`int-${item}`} 
                        checked={localInterests.includes(item)} 
                        onCheckedChange={(c) => {
                          if (c) setLocalInterests(prev => [...prev, item]);
                          else setLocalInterests(prev => prev.filter(i => i !== item));
                        }}
                      />
                      <label htmlFor={`int-${item}`} className="text-sm font-medium cursor-pointer">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 pt-6 border-t">
                <div className="space-y-4">
                  <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Food Style</Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger className="h-11 border-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthy">Healthy & Organic</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="budget">Budget Fast Food</SelectItem>
                      <SelectItem value="gourmet">Gourmet Explorer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-4">
                  <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Travel Style</Label>
                  <Select defaultValue="local">
                    <SelectTrigger className="h-11 border-2"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urban">Urban Walking</SelectItem>
                      <SelectItem value="local">Hidden Gems</SelectItem>
                      <SelectItem value="leisure">Leisurely & Relaxed</SelectItem>
                      <SelectItem value="adventure">High Adventure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 p-6 flex justify-end">
              <Button onClick={() => handleSaveSettings({ interests: localInterests }, 'Interests')} className="font-bold">Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Spending Controls</CardTitle>
              <CardDescription>Strict rules the AI must follow when planning.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10">
              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Daily Spending Cap</Label>
                  <span className="text-xl font-black">₹{dailyBudget}</span>
                </div>
                <Slider value={[dailyBudget]} max={2000} step={50} onValueChange={(val) => setDailyBudget(val[0])} />
              </div>
              <div className="space-y-6 pt-6 border-t">
                <div className="flex justify-between items-end">
                  <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Weekly Spending Cap</Label>
                  <span className="text-xl font-black">₹{weeklyBudget}</span>
                </div>
                <Slider value={[weeklyBudget]} max={10000} step={100} onValueChange={(val) => setWeeklyBudget(val[0])} />
              </div>
              <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t">
                <div className="flex items-center justify-between p-4 border-2 rounded-2xl">
                  <div className="space-y-1">
                    <Label className="font-bold">Hard Limit Toggle</Label>
                    <p className="text-[10px] text-muted-foreground">Reject any plans over budget.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border-2 rounded-2xl">
                  <div className="space-y-1">
                    <Label className="font-bold">Alert Threshold</Label>
                    <p className="text-[10px] text-muted-foreground">Notify at 80% usage.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/10 p-6 flex justify-end">
              <Button onClick={() => handleSaveSettings({ budgetPreference: dailyBudget, weeklyBudget }, 'Budget Rules')} className="font-bold">Apply Budget Rules</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="discovery" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Exploration Engine</CardTitle>
              <CardDescription>Balance routine comfort against novelty.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-10">
              <div className="space-y-8">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Personalization Bias</Label>
                    <p className="text-xs text-muted-foreground">
                      {discoveryVal < 30 ? 'Prioritize Familiarity' : discoveryVal > 70 ? 'High Discovery' : 'Balanced Logic'}
                    </p>
                  </div>
                  <span className="text-2xl font-black text-primary">{discoveryVal}%</span>
                </div>
                <Slider value={[discoveryVal]} max={100} step={10} onValueChange={(val) => setDiscoveryVal(val[0])} />
              </div>
              <div className="space-y-4 pt-6 border-t">
                <div className="flex items-center justify-between p-6 bg-primary/5 rounded-2xl border-2 border-primary/20">
                  <div className="space-y-1">
                    <Label className="font-bold flex items-center gap-2"><RefreshCcw className="h-4 w-4" /> Force Variety</Label>
                    <p className="text-xs text-muted-foreground">Always suggest something new once a day.</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="pt-6 text-center">
                  <Button variant="outline" className="text-destructive hover:bg-destructive/5 rounded-xl border-2" onClick={handleClearHistory}>
                    Reset Discovery Matrix
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Inclusion & UI Preferences</CardTitle>
              <CardDescription>Customize the interface and recommendation mobility.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { id: 'walking', title: 'Reduce Walking', desc: 'Prioritize locations with minimal travel distance.', icon: Accessibility },
                { id: 'time', title: 'Reduce Time-Sensitive', desc: 'Hide options with strict timing or limited duration.', icon: Clock },
                { id: 'contrast', title: 'High Contrast Mode', desc: 'Increase text weight and visibility.', icon: Eye },
                { id: 'simplified', title: 'Simplified UI', desc: 'Minimize animations and extra metadata.', icon: Info },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between p-5 border-2 rounded-2xl hover:bg-muted/10 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-muted border"><item.icon className="h-5 w-5 text-primary" /></div>
                    <div className="space-y-1">
                      <Label className="font-bold">{item.title}</Label>
                      <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                  <Switch />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Data Sovereignty</CardTitle>
              <CardDescription>Manage your history and export your stored patterns.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <Button variant="outline" className="h-16 rounded-2xl gap-3 border-2">
                  <Eye className="h-5 w-5" /> View Stored Data
                </Button>
                <Button variant="outline" className="h-16 rounded-2xl gap-3 border-2" onClick={handleDownloadData}>
                  <Download className="h-5 w-5" /> Download Data (JSON)
                </Button>
                <Button variant="outline" className="h-16 rounded-2xl gap-3 border-2 text-destructive hover:bg-destructive/5" onClick={handleClearHistory}>
                  <History className="h-5 w-5" /> Clear Logic History
                </Button>
                <Button variant="destructive" className="h-16 rounded-2xl gap-3 shadow-lg">
                  <Trash2 className="h-5 w-5" /> Delete Account Forever
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Engagement Channels</CardTitle>
              <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { title: 'Email Summaries', desc: 'Weekly digest of savings and plans.' },
                { title: 'Recommendation Alerts', desc: 'Instant pings for relevant events.' },
                { title: 'Budget Thresholds', desc: 'Alerts when nearing your spending caps.' },
                { title: 'Event Reminders', desc: 'Notifications for saved events.' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 border-2 rounded-2xl">
                  <div className="space-y-1">
                    <Label className="font-bold">{item.title}</Label>
                    <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={i % 2 === 0} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Card className="border-2 shadow-sm rounded-3xl">
            <CardHeader>
              <CardTitle>Authentication & Sessions</CardTitle>
              <CardDescription>Manage your password and linked providers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-6 bg-muted/20 rounded-2xl border-2">
                <div className="flex gap-4 items-center">
                  <div className="p-3 rounded-xl bg-background border-2">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-base font-bold">Password Management</Label>
                    <p className="text-xs text-muted-foreground">
                      {hasPasswordProvider ? "Password protection active." : "Set a password for email login."}
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" className="font-bold rounded-xl h-11 border-2">
                  <Link href="/settings/security">{hasPasswordProvider ? "Update" : "Set Password"}</Link>
                </Button>
              </div>
              <div className="pt-6 text-center">
                <Button variant="ghost" className="text-muted-foreground hover:bg-muted/50 rounded-xl h-12">
                  Logout from All Sessions
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-6">
              <Button onClick={handleLogout} variant="ghost" className="text-destructive font-bold gap-2">
                <LogOut className="h-4 w-4" /> Final Sign Out
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
