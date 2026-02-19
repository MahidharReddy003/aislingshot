'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const INTERESTS = ['Food', 'Events', 'Shopping', 'Travel', 'Tech', 'Music', 'Outdoors'];

export default function ProfileSetupPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: existingProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const [formData, setFormData] = useState({
    name: '',
    age: 20,
    location: '',
    budgetPreference: 500,
    interests: [] as string[],
    role: 'Student',
    aiBehavior: 'friendly',
    availableTime: 4,
    currency: 'INR'
  });

  useEffect(() => {
    if (isUserLoading || isProfileLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    if (existingProfile) {
      // Pre-fill form if doc exists
      setFormData({
        name: existingProfile.name || '',
        age: existingProfile.age || 20,
        location: existingProfile.location || '',
        budgetPreference: existingProfile.budgetPreference || 500,
        interests: existingProfile.interests || [],
        role: existingProfile.role || 'Student',
        aiBehavior: existingProfile.aiBehavior || 'friendly',
        availableTime: existingProfile.availableTime || 4,
        currency: existingProfile.currency || 'INR'
      });

      // If setup already marked as completed, don't allow user to stay here
      if (existingProfile.hasCompletedSetup === true) {
        router.replace('/dashboard');
      }
    } else {
      // First time, pre-fill name from Auth
      setFormData(prev => ({ ...prev, name: user.displayName || '' }));
    }
  }, [user, isUserLoading, existingProfile, isProfileLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db) return;
    setLoading(true);

    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        id: user.uid,
        email: user.email,
        hasCompletedSetup: true,
        updatedAt: serverTimestamp(),
        createdAt: existingProfile?.createdAt || serverTimestamp()
      });

      toast({ title: 'Profile Updated!', description: 'Your SmartLife experience is ready.' });
      router.replace('/dashboard');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading || isProfileLoading || (user && existingProfile?.hasCompletedSetup === true)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-primary h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card className="border-2 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-muted/20 pb-8 border-b">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-primary/10">
              <UserCircle className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Personalize SmartLife</CardTitle>
          <CardDescription className="text-lg">We use these details to provide transparent, budget-aware recommendations.</CardDescription>
        </CardHeader>
        <CardContent className="pt-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold">Full Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required className="h-12 border-2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="font-bold">Age</Label>
                <Input id="age" type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })} required className="h-12 border-2" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="font-bold">Default Search Area (e.g., Campus North)</Label>
              <Input id="location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required className="h-12 border-2" />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="role" className="font-bold">Primary Role</Label>
                <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                  <SelectTrigger className="h-12 border-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Creator">Creator</SelectItem>
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="behavior" className="font-bold">AI Tone</Label>
                <Select value={formData.aiBehavior} onValueChange={v => setFormData({ ...formData, aiBehavior: v })}>
                  <SelectTrigger className="h-12 border-2"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly (Contextual)</SelectItem>
                    <SelectItem value="formal">Formal (Direct)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="budget" className="font-bold">Daily Spending Limit (INR)</Label>
                <Input id="budget" type="number" value={formData.budgetPreference} onChange={e => setFormData({ ...formData, budgetPreference: parseInt(e.target.value) })} className="h-12 border-2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time" className="font-bold">Typical Available Hours</Label>
                <Input id="time" type="number" value={formData.availableTime} onChange={e => setFormData({ ...formData, availableTime: parseInt(e.target.value) })} className="h-12 border-2" />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="font-bold">Areas of Interest</Label>
              <div className="grid grid-cols-3 gap-3 border-2 p-4 rounded-2xl bg-muted/10">
                {INTERESTS.map(interest => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={formData.interests.includes(interest)}
                      onCheckedChange={(checked) => {
                        if (checked) setFormData({ ...formData, interests: [...formData.interests, interest] });
                        else setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
                      }}
                    />
                    <label htmlFor={interest} className="text-sm font-semibold leading-none cursor-pointer">{interest}</label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.02]" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Activate SmartLife
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
