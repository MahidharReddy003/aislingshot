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
  Loader2,
  TrendingUp,
  Settings
} from 'lucide-react';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const categories = [
  { id: 'food', name: 'Food Hub', icon: Utensils, color: 'bg-orange-100 text-orange-600', href: '/food' },
  { id: 'events', name: 'Nearby Events', icon: Calendar, color: 'bg-blue-100 text-blue-600', href: '/events' },
  { id: 'shopping', name: 'Smart Shopping', icon: ShoppingBag, color: 'bg-green-100 text-green-600', href: '/shopping' },
  { id: 'planner', name: 'Day Planner', icon: Clock, color: 'bg-purple-100 text-purple-600', href: '/plan-my-day' },
  { id: 'travel', name: 'Travel Explorer', icon: Map, color: 'bg-teal-100 text-teal-600', href: '/travel' },
  { id: 'chat', name: 'AI Chat', icon: MessageSquare, color: 'bg-pink-100 text-pink-600', href: '/chat' },
];

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();
  const router = useRouter();

  const userDocRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (isUserLoading || isProfileLoading) return;

    if (!user) {
      router.replace('/login');
      return;
    }

    // Only redirect if we are sure the profile setup is explicitly incomplete
    if (profile && profile.hasCompletedSetup === false) {
      console.log("Profile explicitly incomplete, redirecting to setup...");
      router.replace('/profile-setup');
    } else if (!profile) {
      // If document doesn't exist at all, also go to setup
      console.log("No profile found, redirecting to setup...");
      router.replace('/profile-setup');
    }
  }, [user, isUserLoading, profile, isProfileLoading, router]);

  // Show loader while we are making up our minds
  if (isUserLoading || isProfileLoading || !user || !profile?.hasCompletedSetup) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse font-medium">Syncing your SmartLife experience...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-secondary/5 pb-20">
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-primary">
                Welcome back, {profile?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-muted-foreground mt-1 text-lg">
                Your SmartLife assistant has curated some choices for your {profile.role?.toLowerCase() || 'day'}.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Active Persona</span>
                <span className="text-sm font-semibold">{profile.role || 'Member'}</span>
              </div>
              <Button asChild variant="outline" className="border-2 rounded-xl h-12 px-6">
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Control Center
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Primary Grid */}
            <div className="lg:col-span-8 space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {categories.map((cat) => (
                  <Link key={cat.id} href={cat.href}>
                    <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 group h-full cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center text-center">
                        <div className={`p-4 rounded-2xl mb-4 ${cat.color} group-hover:scale-110 transition-transform shadow-sm`}>
                          <cat.icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-bold text-sm md:text-base">{cat.name}</h3>
                        <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">Enter Section</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Weekly Budget Tracker */}
              <Card className="border-2 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 border-b">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Weekly Budget Summary
                    </CardTitle>
                    <Badge className="bg-green-100 text-green-700 border-none px-3">On Track</Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">Spent This Week</p>
                      <div className="flex items-baseline gap-2">
                        <h3 className="text-4xl font-black text-primary">₹1,240</h3>
                        <span className="text-muted-foreground font-medium">/ ₹{(profile.budgetPreference || 500) * 7} cap</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-green-600 uppercase mb-1">Estimated Savings</p>
                      <p className="text-xl font-bold">₹420 <span className="text-xs text-muted-foreground">vs. avg</span></p>
                    </div>
                  </div>
                  <Progress value={35} className="h-3 rounded-full" />
                  <div className="grid grid-cols-3 gap-4 pt-2">
                    <div className="text-center p-3 rounded-xl bg-muted/20 border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Dining</p>
                      <p className="font-bold text-sm">₹650</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/20 border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Travel</p>
                      <p className="font-bold text-sm">₹320</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-muted/20 border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">Other</p>
                      <p className="font-bold text-sm">₹270</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Widgets */}
            <div className="lg:col-span-4 space-y-6">
              <Card className="border-2 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {[
                      { text: 'Generated 2h lunch plan', time: 'Just now', icon: Sparkles },
                      { text: 'Profile updated: Interests', time: '2 hours ago', icon: User },
                      { text: 'Explored "Sunset Point"', time: 'Yesterday', icon: Map }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 p-4 hover:bg-muted/10 transition-colors">
                        <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                          <item.icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium leading-tight">{item.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tighter">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t text-center">
                    <Button variant="link" className="text-xs h-auto p-0 text-muted-foreground" asChild>
                      <Link href="/history">View Full History</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-primary text-primary-foreground border-none shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Sparkles className="h-24 w-24" />
                </div>
                <CardHeader>
                  <CardTitle className="text-lg">AI Discovery Engine</CardTitle>
                  <CardDescription className="text-primary-foreground/60">Balancing routine and exploration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 relative z-10">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                      <span>Level: Balanced</span>
                      <span>65% Search Score</span>
                    </div>
                    <Progress value={65} className="bg-white/20 h-2" />
                  </div>
                  <p className="text-xs text-primary-foreground/80 leading-relaxed italic">
                    "We've improved recommendation relevance by 12% based on your feedback from last night's meal."
                  </p>
                  <Button variant="secondary" className="w-full font-bold h-11" asChild>
                    <Link href="/settings">Tune Discovery</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
