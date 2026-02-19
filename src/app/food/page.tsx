
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Utensils, Star, MapPin, Sparkles, Loader2, Clock, Info, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import mockData from '@/app/lib/mock-data.json';
import { useToast } from '@/hooks/use-toast';
import { getPlaceholderImageUrl } from '@/lib/placeholder-images';
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
  const [recommendation, setRecommendation] = useState<{name: string, reason: string} | null>(null);
  const { toast } = useToast();

  const handleAIRecommend = () => {
    setLoading(true);
    setTimeout(() => {
      const option = mockData.food[Math.floor(Math.random() * mockData.food.length)];
      setRecommendation({
        name: option.name,
        reason: `I suggest ${option.name}! It's a great match for your budget and is highly rated for its ${option.category} menu. Based on your profile, this is a top choice for a healthy student meal.`
      });
      setLoading(false);
      toast({ title: 'AI Suggestion Ready!', description: `Try ${option.name} today.` });
    }, 1500);
  };

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 pb-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Utensils className="text-orange-500 h-8 w-8" /> Food Hub
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">SmartLife curated dining options near you.</p>
        </div>
        <Button onClick={handleAIRecommend} disabled={loading} className="gap-2 rounded-2xl h-14 px-8 shadow-lg transition-all hover:scale-105">
          {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
          AI Recommendation
        </Button>
      </div>

      {recommendation && (
        <Card className="mb-12 border-2 border-primary bg-primary/5 animate-in fade-in slide-in-from-top-4 rounded-3xl overflow-hidden shadow-sm relative group">
          <CardContent className="p-8 flex items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-xs font-black uppercase tracking-widest text-primary">AI Highlight: {recommendation.name}</span>
              </div>
              <p className="text-xl italic text-foreground leading-relaxed font-medium">"I think you'll love {recommendation.name} for lunch today."</p>
            </div>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-primary hover:scale-110 transition-transform flex-shrink-0">
                  <Sparkles className="h-7 w-7" />
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl border-2">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black flex items-center gap-2">
                    <Sparkles className="text-primary" /> Why {recommendation.name}?
                  </DialogTitle>
                  <DialogDescription className="text-base font-medium text-foreground py-6 leading-relaxed italic">
                    {recommendation.reason}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {mockData.food.map(item => (
          <Card key={item.id} className="hover:shadow-xl transition-all border-2 rounded-[2.5rem] overflow-hidden flex flex-col group">
            <div className="relative h-64 w-full overflow-hidden">
              <Image 
                src={getPlaceholderImageUrl(item.imageId || 'restaurant-street')} 
                alt={item.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 flex items-center gap-3">
                <Badge className={item.isOpen ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"}>
                  {item.isOpen ? "Open Now" : "Closed"}
                </Badge>
                <div className="flex items-center gap-1 text-sm font-black text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {item.rating}
                </div>
              </div>
            </div>
            
            <CardHeader className="pb-2 pt-6 px-8">
              <div className="flex justify-between items-center mb-1">
                <Badge variant="secondary" className="rounded-lg font-bold uppercase text-[10px] tracking-widest">{item.category}</Badge>
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {item.timings}
                </span>
              </div>
              <CardTitle className="text-3xl font-black mt-2">{item.name}</CardTitle>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2 line-clamp-2">
                {item.description}
              </p>
              <div className="flex items-center gap-1 font-bold text-muted-foreground text-xs mt-3">
                <MapPin className="h-3 w-3 text-primary" /> {item.location}
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 pb-8 px-8 mt-auto">
              <div className="flex justify-between items-center pt-6 border-t">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Entry Price</span>
                  <span className="text-3xl font-black text-primary">₹{item.price}</span>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-2 rounded-2xl px-8 h-12 font-bold hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                      View Menu
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] rounded-[2rem] p-0 overflow-hidden border-2">
                    <div className="relative h-48 w-full">
                       <Image 
                        src={getPlaceholderImageUrl(item.imageId || 'restaurant-street')} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-end p-8">
                        <DialogTitle className="text-3xl font-black text-white">{item.name} Menu</DialogTitle>
                      </div>
                    </div>
                    <div className="p-8">
                      <DialogHeader className="mb-6">
                        <DialogDescription className="text-base font-medium">
                          {item.description}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {item.menu?.map((menuItem: any, idx: number) => (
                          <div key={idx} className={`p-4 border-2 rounded-3xl transition-all ${menuItem.isAvailable ? 'bg-card hover:bg-muted/30 shadow-sm' : 'bg-muted/50 opacity-60'}`}>
                            <div className="flex gap-4">
                              <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden bg-muted">
                                <Image 
                                  src={getPlaceholderImageUrl(menuItem.imageId || 'hero-abstract')} 
                                  alt={menuItem.item}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                  <h4 className="font-bold text-lg truncate">{menuItem.item}</h4>
                                  <span className="font-black text-primary text-sm whitespace-nowrap">₹{menuItem.price}</span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed italic line-clamp-2 mt-1">{menuItem.description}</p>
                                <div className="mt-2">
                                  {menuItem.isAvailable ? (
                                    <Badge variant="outline" className="text-[10px] text-green-600 border-green-200 bg-green-50 uppercase tracking-tighter">
                                      <CheckCircle2 className="h-2 w-2 mr-1" /> Available
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="text-[10px] text-red-600 border-red-200 bg-red-50 uppercase tracking-tighter">
                                      <XCircle className="h-2 w-2 mr-1" /> Sold Out
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-8 pb-8 flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                      <Info className="h-3 w-3" /> Timings: {item.timings}
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
