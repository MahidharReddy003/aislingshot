
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  History
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';

const INTERESTS = ['Food', 'Events', 'Shopping', 'Travel', 'Tech', 'Music', 'Outdoors'];

export default function SettingsPage() {
  const { user, auth } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const userDocRef = user ? doc(db, 'users', user.uid) : null;
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

  const handleMockSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({ title: 'Changes Saved', description: 'Your preferences have been updated locally.' });
    }, 800);
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container max-w-5xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings & Control</h1>
        <p className="text-muted-foreground">Manage your persona, privacy, and how the AI interacts with your life.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted p-1 border grid grid-cols-4 md:grid-cols-7 h-auto">
          <TabsTrigger value="profile" className="gap-2 py-2"><User className="h-4 w-4" /> <span className="hidden md:inline">Profile</span></TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2 py-2"><Settings2 className="h-4 w-4" /> <span className="hidden md:inline">Prefs</span></TabsTrigger>
          <TabsTrigger value="budget" className="gap-2 py-2"><Wallet className="h-4 w-4" /> <span className="hidden md:inline">Budget</span></TabsTrigger>
          <TabsTrigger value="discovery" className="gap-2 py-2"><Sparkles className="h-4 w-4" /> <span className="hidden md:inline">Discovery</span></TabsTrigger>
          <TabsTrigger value="accessibility" className="gap-2 py-2"><Accessibility className="h-4 w-4" /> <span className="hidden md:inline">Access</span></TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2 py-2"><Lock className="h-4 w-4" /> <span className="hidden md:inline">Privacy</span></TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2 py-2"><Bell className="h-4 w-4" /> <span className="hidden md:inline">Alerts</span></TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
              <CardDescription>How your assistant identifies you and your primary role.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" defaultValue={profile?.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Default Location</Label>
                    <Input id="location" name="location" defaultValue={profile?.location} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input value={user?.email || ''} disabled className="bg-muted" />
                  <p className="text-[10px] text-muted-foreground">Email cannot be changed for security reasons.</p>
                </div>
                <div className="pt-4 flex justify-between items-center">
                  <Button type="button" variant="destructive" onClick={handleLogout} className="gap-2">
                    <LogOut className="h-4 w-4" /> Logout
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle>Interests & Personality</CardTitle>
              <CardDescription>Fine-tune what categories the AI prioritizes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Active Interests</Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {INTERESTS.map(item => (
                    <div key={item} className="flex items-center space-x-2">
                      <Checkbox id={`check-${item}`} defaultChecked={profile?.interests?.includes(item)} />
                      <label htmlFor={`check-${item}`} className="text-sm font-medium leading-none cursor-pointer">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <Label>AI Interaction Style</Label>
                <div className="flex gap-2">
                  <Button variant={profile?.aiBehavior === 'friendly' ? 'default' : 'outline'} size="sm">Friendly</Button>
                  <Button variant={profile?.aiBehavior === 'formal' ? 'default' : 'outline'} size="sm">Formal</Button>
                  <Button variant="outline" size="sm">Concise</Button>
                </div>
              </div>
              <Button onClick={handleMockSave} disabled={saving} className="w-full">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget" className="space-y-4">
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle>Budget Rules</CardTitle>
              <CardDescription>Set spending limits and how strictly they are enforced.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Daily Spending Cap (₹)</Label>
                  <span className="font-bold">₹{budgetVal}</span>
                </div>
                <Slider 
                  value={[budgetVal]} 
                  max={2000} 
                  step={50} 
                  onValueChange={(val) => setBudgetVal(val[0])} 
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                <div className="space-y-0.5">
                  <Label>Strict Enforcement</Label>
                  <p className="text-xs text-muted-foreground">If enabled, the AI will never show results above your cap.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border">
                <div className="space-y-0.5">
                  <Label>Weekly Roll-over</Label>
                  <p className="text-xs text-muted-foreground">Unspent daily budget adds to your weekend allowance.</p>
                </div>
                <Switch />
              </div>
              <Button onClick={handleMockSave} disabled={saving} className="w-full">Apply Budget Rules</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discovery" className="space-y-4">
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle>Discovery & Variety</CardTitle>
              <CardDescription>Control the balance between familiar favorites and new territory.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Discovery Level</Label>
                  <span className="font-bold text-primary">{discoveryVal < 30 ? 'Familiar' : discoveryVal > 70 ? 'High Discovery' : 'Balanced'}</span>
                </div>
                <Slider 
                  value={[discoveryVal]} 
                  max={100} 
                  step={10} 
                  onValueChange={(val) => setDiscoveryVal(val[0])} 
                />
                <div className="flex justify-between text-[10px] text-muted-foreground uppercase font-bold px-1">
                  <span>Safe & Known</span>
                  <span>Wild & New</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2"><Sparkles className="h-3 w-3 text-primary" /> Anti-Filter Bubble</Label>
                  <p className="text-xs text-muted-foreground">Force the AI to suggest at least one radical discovery daily.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button onClick={handleMockSave} disabled={saving} className="w-full">Update Discovery Engine</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle>Accessibility Standards</CardTitle>
              <CardDescription>Tailor the platform UI and recommendations for specific needs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Walking Mode</Label>
                  <p className="text-xs text-muted-foreground">Prioritize locations with minimal travel or ramps.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Time-Sensitive Alerts</Label>
                  <p className="text-xs text-muted-foreground">Audible alerts for nearing event start times.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>High Contrast UI</Label>
                  <p className="text-xs text-muted-foreground">Increase legibility across all experience screens.</p>
                </div>
                <Switch />
              </div>
              <Button onClick={handleMockSave} disabled={saving} className="w-full">Save Accessibility</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle>Privacy & Data Ownership</CardTitle>
              <CardDescription>You are in full control of how your data is used.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-accent/10 border border-accent/20 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Shield className="h-4 w-4 text-primary" />
                  Transparency Promise
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We only use your data to improve your personal AI model. We never sell your preferences to third-party advertisers. All history can be cleared instantly.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Anonymous Telemetry</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Local Cache Only</Label>
                  <Switch />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <Button variant="outline" className="gap-2"><History className="h-4 w-4" /> Clear History</Button>
                <Button variant="outline" className="text-destructive border-destructive/20 hover:bg-destructive/10">Reset All Data</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card className="border-2 shadow-sm">
            <CardHeader>
              <CardTitle>Smart Alerts</CardTitle>
              <CardDescription>Control when the assistant reaches out to you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Budget Alerts</Label>
                  <p className="text-xs text-muted-foreground">Notify when I reach 80% of my daily limit.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Discovery Pings</Label>
                  <p className="text-xs text-muted-foreground">Suggest new activities when I have free time.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Trust Reports</Label>
                  <p className="text-xs text-muted-foreground">Email summary of my savings and discoveries.</p>
                </div>
                <Switch />
              </div>
              <Button onClick={handleMockSave} disabled={saving} className="w-full">Save Notification Rules</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
