
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useUser, useFirestore } from '@/firebase';
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
    if (user) {
      setFormData(prev => ({ ...prev, name: user.displayName || '' }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        id: user.uid,
        email: user.email,
        hasCompletedSetup: true,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp()
      });

      toast({ title: 'Profile Created!', description: 'Redirecting to your dashboard...' });
      router.push('/dashboard');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card className="border-2">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <UserCircle className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Personalize Your Assistant</CardTitle>
          <CardDescription>We use these details to give you better recommendations.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" value={formData.age} onChange={e => setFormData({ ...formData, age: parseInt(e.target.value) })} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Your Location (e.g., Campus North)</Label>
              <Input id="location" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={v => setFormData({ ...formData, role: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                    <SelectItem value="Freelancer">Freelancer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="behavior">AI Behavior</Label>
                <Select value={formData.aiBehavior} onValueChange={v => setFormData({ ...formData, aiBehavior: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="friendly">Friendly</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Daily Budget (INR)</Label>
                <Input id="budget" type="number" value={formData.budgetPreference} onChange={e => setFormData({ ...formData, budgetPreference: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Available Hours / Day</Label>
                <Input id="time" type="number" value={formData.availableTime} onChange={e => setFormData({ ...formData, availableTime: parseInt(e.target.value) })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Interests</Label>
              <div className="grid grid-cols-3 gap-2 border p-3 rounded-lg bg-muted/20">
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
                    <label htmlFor={interest} className="text-sm font-medium leading-none cursor-pointer">{interest}</label>
                  </div>
                ))}
              </div>
            </div>

            <Button className="w-full" type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Setup
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
