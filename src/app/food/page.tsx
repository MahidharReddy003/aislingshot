
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, Star, MapPin, Sparkles, Loader2 } from 'lucide-react';
import mockData from '@/app/lib/mock-data.json';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

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
    <div className="container max-w-4xl mx-auto py-12 px-4 pb-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Utensils className="text-orange-500" /> Food Hub
          </h1>
          <p className="text-muted-foreground">Top choices near your location based on your persona.</p>
        </div>
        <Button onClick={handleAIRecommend} disabled={loading} className="gap-2 rounded-xl h-11">
          {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
          AI Recommendation
        </Button>
      </div>

      {recommendation && (
        <Card className="mb-8 border-2 border-primary bg-primary/5 animate-in fade-in slide-in-from-top-4 rounded-2xl overflow-hidden shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Contextual AI Insight</span>
            </div>
            <p className="text-lg italic text-foreground leading-relaxed">"{recommendation}"</p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {mockData.food.map(item => (
          <Card key={item.id} className="hover:shadow-lg transition-all border-2 rounded-3xl overflow-hidden">
            <CardHeader className="pb-2 bg-muted/10 border-b">
              <div className="flex justify-between items-start">
                <Badge variant="secondary" className="rounded-lg">{item.category}</Badge>
                <div className="flex items-center gap-1 text-sm font-black text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
                  <Star className="h-3 w-3 fill-current" /> {item.rating}
                </div>
              </div>
              <CardTitle className="text-2xl mt-3">{item.name}</CardTitle>
              <CardDescription className="flex items-center gap-1 font-medium">
                <MapPin className="h-3 w-3 text-muted-foreground" /> {item.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Starts from</span>
                  <span className="text-2xl font-black text-primary">₹{item.price}</span>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-2 rounded-xl px-6 h-11 font-bold hover:bg-primary hover:text-primary-foreground transition-all">
                      View Menu
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] rounded-3xl">
                    <DialogHeader className="pb-4 border-b">
                      <DialogTitle className="text-2xl font-black flex items-center gap-2">
                        <Utensils className="h-6 w-6 text-orange-500" />
                        {item.name}
                      </DialogTitle>
                      <DialogDescription className="font-medium">
                        Standard menu items and estimated pricing.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                      <div className="space-y-3">
                        {item.menu?.map((menuItem, idx) => (
                          <div key={idx} className="flex justify-between items-center p-4 border-2 rounded-2xl bg-card hover:bg-muted/30 transition-colors shadow-sm">
                            <span className="font-bold text-sm">{menuItem.item}</span>
                            <span className="font-black text-primary bg-primary/5 px-3 py-1 rounded-full text-xs">₹{menuItem.price}</span>
                          </div>
                        ))}
                        {(!item.menu || item.menu.length === 0) && (
                          <div className="text-center py-12">
                            <Utensils className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                            <p className="text-muted-foreground italic font-medium">Menu is currently being updated by the vendor.</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest">
                        Prices may vary based on location
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
