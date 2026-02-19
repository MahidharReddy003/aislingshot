
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, Star, MapPin, Sparkles, Loader2 } from 'lucide-react';
import mockData from '@/app/lib/mock-data.json';
import { useToast } from '@/hooks/use-toast';

export default function FoodPage() {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAIRecommend = () => {
    setLoading(true);
    // Simulate AI thinking
    setTimeout(() => {
      const option = mockData.food[Math.floor(Math.random() * mockData.food.length)];
      setRecommendation(`I suggest ${option.name}! It's a great match for your budget and is highly rated for its ${option.category} menu.`);
      setLoading(false);
      toast({ title: 'AI Suggestion Ready!', description: `Try ${option.name} today.` });
    }, 1500);
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Utensils className="text-orange-500" /> Food Hub
          </h1>
          <p className="text-muted-foreground">Top choices near your campus location.</p>
        </div>
        <Button onClick={handleAIRecommend} disabled={loading} className="gap-2">
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          AI Recommendation
        </Button>
      </div>

      {recommendation && (
        <Card className="mb-8 border-2 border-primary bg-primary/5 animate-in fade-in slide-in-from-top-4">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-primary">AI Insights</span>
            </div>
            <p className="text-lg italic text-foreground">{recommendation}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {mockData.food.map(item => (
          <Card key={item.id} className="hover:shadow-md transition-all">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <Badge variant="secondary">{item.category}</Badge>
                <div className="flex items-center gap-1 text-sm font-bold text-yellow-600">
                  <Star className="h-3 w-3 fill-current" /> {item.rating}
                </div>
              </div>
              <CardTitle className="text-xl mt-2">{item.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {item.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary">₹{item.price}</span>
                <Button variant="outline" size="sm">View Menu</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
