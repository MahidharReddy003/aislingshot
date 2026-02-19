
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Utensils, 
  Calendar, 
  ShoppingBag, 
  Map, 
  MessageSquare, 
  Clock, 
  ChevronRight,
  Sparkles,
  User,
  Loader2
} from 'lucide-react';
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const categories = [
  { id: 'food', name: 'Food', icon: Utensils, color: 'bg-orange-100 text-orange-600', href: '/food' },
  { id: 'events', name: 'Events', icon: Calendar, color: 'bg-blue-100 text-blue-600', href: '/events' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: 'bg-green-100 text-green-600', href: '/shopping' },
  { id: 'planner', name: 'Plan My Day', icon: Clock, color: 'bg-purple-100 text-purple-600', href: '/plan-my-day' },
  { id: 'travel', name: 'Travel', icon: Map, color: 'bg-teal-100 text-teal-600', href: '/travel' },
  { id: 'chat', name: 'AI Chat', icon: MessageSquare, color: 'bg-pink-100 text-pink-600', href: '/chat' },
];

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const userDocRef = user ? doc(db, 'users', user.uid) : null;
  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
    if (!isProfileLoading && user && !profile?.hasCompletedSetup) {
      router.push('/profile-setup');
    }
  }, [user, isUserLoading, profile, isProfileLoading, router]);

  if (isUserLoading || isProfileLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="flex min-h-screen bg-secondary/5">
      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Hello, {profile?.name || 'User'}!</h1>
              <p className="text-muted-foreground italic">"Your smart assistant is ready for a productive day."</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-4 py-2 bg-background border-2">
                Persona: {profile?.role || 'User'}
              </Badge>
              <Button asChild size="sm">
                <Link href="/settings">Edit Profile</Link>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Category Cards */}
            <div className="lg:col-span-2 space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <Link key={cat.id} href={cat.href}>
                    <Card className="hover:shadow-lg transition-all border-2 group h-full">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className={`p-3 rounded-xl mb-4 ${cat.color} group-hover:scale-110 transition-transform`}>
                          <cat.icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold">{cat.name}</h3>
                        <p className="text-[10px] text-muted-foreground mt-1">Explore options</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Weekly Budget */}
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Budget Tracker
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Weekly Spent</p>
                      <h3 className="text-2xl font-bold">₹1,240 <span className="text-sm font-normal text-muted-foreground">/ ₹{profile?.budgetPreference || 500 * 7}</span></h3>
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">On Track</Badge>
                  </div>
                  <Progress value={35} className="h-2" />
                  <p className="text-[10px] text-muted-foreground italic">You've saved roughly ₹240 this week compared to typical spending.</p>
                </CardContent>
              </Card>
            </div>

            {/* Side Sidebar widgets */}
            <div className="space-y-6">
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="text-lg">Recent activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { text: 'Generated lunch plan', time: '2h ago' },
                      { text: 'Saved "Tech Workshop"', time: '4h ago' },
                      { text: 'Profile updated', time: '1 day ago' }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3 text-sm border-l-2 border-primary/20 pl-4 py-1">
                        <div className="flex-1">
                          <p className="font-medium">{item.text}</p>
                          <p className="text-[10px] text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground">
                <CardHeader>
                  <CardTitle className="text-lg">AI Discovery</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="opacity-80 uppercase tracking-widest font-bold">Level: Balanced</span>
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <Progress value={65} className="bg-white/20 h-1.5" />
                    <p className="text-xs opacity-70 italic">Relevance improved by 10% based on your recent food feedback.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
