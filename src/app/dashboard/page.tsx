
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Sparkles, 
  History, 
  Heart, 
  Settings, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  DollarSign, 
  Target,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    if (user?.displayName) {
      setUserName(user.displayName);
    } else if (user?.email) {
      setUserName(user.email.split('@')[0]);
    }
  }, [user]);

  // Mock data for recommendations
  const recentRecommendations = [
    { id: 1, title: 'Urban Garden Cafe', category: 'Meal', cost: '₹250', match: '98%', time: '15m ago' },
    { id: 2, title: 'Tech Innovation Hub', category: 'Event', cost: 'Free', match: '94%', time: '2h ago' },
    { id: 3, title: 'Mountain Weekend Escape', category: 'Travel', cost: '₹2,400', match: '89%', time: 'Yesterday' },
  ];

  // Mock data for activity
  const recentActivity = [
    { id: 1, type: 'feedback', text: 'You rated "Healthy Bowl" as Highly Relevant', time: '1h ago' },
    { id: 2, type: 'save', text: 'Saved "Summer Hackathon" to "Tech Events"', time: '4h ago' },
    { id: 3, type: 'preference', text: 'Updated budget preference to ₹500/day', time: '1 day ago' },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/10">
      {/* Sidebar Navigation */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background sticky top-16 h-[calc(100vh-4rem)]">
        <nav className="flex-1 space-y-1 p-4">
          {[
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, active: true },
            { name: 'Experiences', href: '/experiences/recommender', icon: Sparkles },
            { name: 'Saved', href: '/saved', icon: Heart },
            { name: 'History', href: '/history', icon: History },
            { name: 'Settings', href: '/app/settings', icon: Settings },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                item.active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Card className="bg-accent/30 border-none shadow-none">
            <CardContent className="p-4">
              <p className="text-xs font-bold uppercase text-muted-foreground mb-2">Pro Tip</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Adjust your "Discovery Level" in settings to find more novel options.
              </p>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {isUserLoading ? '...' : userName}!</h1>
              <p className="text-muted-foreground">Here's what our AI found for you today.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline">
                <Link href="/experiences/recommender">
                  <Plus className="h-4 w-4 mr-2" /> New Experience
                </Link>
              </Button>
            </div>
          </div>

          {/* Top Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Weekly Savings</p>
                  <DollarSign className="h-4 w-4 text-green-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">₹240</h3>
                  <span className="text-xs font-medium text-green-500 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +12%
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">New Discoveries</p>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">14</h3>
                  <span className="text-xs font-medium text-muted-foreground">This week</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-muted-foreground">Relevance Score</p>
                  <Target className="h-4 w-4 text-blue-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">96%</h3>
                  <span className="text-xs font-medium text-green-500 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-1" /> Improved
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium opacity-80">Discovery Level</p>
                  <TrendingUp className="h-4 w-4 opacity-80" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-end">
                    <h3 className="text-2xl font-bold italic">Balanced</h3>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-70">Customized</span>
                  </div>
                  <Progress value={65} className="bg-white/20 h-1.5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Recommendations */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Recent Recommendations</h2>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/history">View All <ChevronRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {recentRecommendations.length > 0 ? (
                  recentRecommendations.map((rec) => (
                    <Card key={rec.id} className="group hover:shadow-md transition-all cursor-pointer border-2 hover:border-primary/50">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start mb-2">
                          <Badge variant="secondary" className="text-[10px]">{rec.category}</Badge>
                          <span className="text-[10px] text-muted-foreground">{rec.time}</span>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">{rec.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-primary">{rec.cost}</span>
                          <span className="text-xs font-semibold flex items-center text-muted-foreground">
                            <Target className="h-3 w-3 mr-1 text-primary" /> {rec.match} Match
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
                    <Sparkles className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm font-medium">No recommendations yet.</p>
                    <p className="text-xs">Start an experience to see suggestions here.</p>
                  </div>
                )}
              </div>

              {/* Budget Usage Section */}
              <div className="pt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Budget Usage Summary</CardTitle>
                    <CardDescription>Monthly entertainment & experience limit</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">Monthly Limit</span>
                        <span className="font-bold">₹5,000.00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Spent so far</span>
                        <span className="text-primary font-semibold">₹3,120.50</span>
                      </div>
                      <Progress value={62} className="h-2" />
                      <p className="text-[10px] text-muted-foreground italic">You have 38% of your budget remaining for this period.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <Card className="h-fit">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {recentActivity.map((activity, idx) => (
                      <div key={activity.id} className="flex gap-4 relative">
                        {idx !== recentActivity.length - 1 && (
                          <div className="absolute left-[11px] top-7 bottom-[-24px] w-px bg-border" />
                        )}
                        <div className={`mt-1 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === 'feedback' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'save' ? 'bg-red-100 text-red-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {activity.type === 'feedback' ? <Target className="h-3 w-3" /> :
                           activity.type === 'save' ? <Heart className="h-3 w-3" /> :
                           <Clock className="h-3 w-3" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-snug">{activity.text}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                    {recentActivity.length === 0 && (
                      <div className="text-center py-8">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-20" />
                        <p className="text-sm text-muted-foreground">No recent activity.</p>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-6" size="sm">
                    View Full History
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Profile Info */}
              <Card className="bg-accent/10 border-accent/20">
                <CardContent className="p-4 flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>{userName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{userName}</p>
                    <p className="text-xs text-muted-foreground">Persona: Student</p>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/app/settings"><Settings className="h-4 w-4" /></Link>
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
