
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
import { User, Shield, Bell, LogOut, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signOut } from 'firebase/auth';

export default function SettingsPage() {
  const { user, auth } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const userDocRef = user ? doc(db, 'users', user.uid) : null;
  const { data: profile, isLoading } = useDoc(userDocRef);

  const [saving, setSaving] = useState(false);

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

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-muted p-1 border">
          <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /> Profile</TabsTrigger>
          <TabsTrigger value="ai" className="gap-2"><Sparkles className="h-4 w-4" /> AI Preferences</TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2"><Shield className="h-4 w-4" /> Privacy</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /> Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Public Profile</CardTitle>
              <CardDescription>How your assistant identifies you.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" defaultValue={profile?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Default Location</Label>
                  <Input id="location" name="location" defaultValue={profile?.location} />
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

        <TabsContent value="ai">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>AI Behavior & Logic</CardTitle>
              <CardDescription>Customize the "Smart" in your assistant.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Budget Enforcement</Label>
                  <p className="text-xs text-muted-foreground">Strictly filter results above your daily cap.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Discovery Booster</Label>
                  <p className="text-xs text-muted-foreground">Prioritize novel experiences over familiar ones.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card className="border-2">
            <CardHeader>
              <CardTitle>Privacy & Data</CardTitle>
              <CardDescription>You are in full control of your data.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg text-sm italic">
                "We don't sell your data to third parties. Your personal preferences are only used to train your private AI assistant instance."
              </div>
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 border-destructive/20">
                Clear Personal History
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
