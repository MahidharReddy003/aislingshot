'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingBag, MapPin, CheckCircle2, Star, Clock } from 'lucide-react';
import mockData from '@/app/lib/mock-data.json';
import { getPlaceholderImageUrl } from '@/lib/placeholder-images';

export default function ShoppingPage() {
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 pb-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <ShoppingBag className="text-green-500 h-8 w-8" /> Smart Shopping
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Discover stores that align with your budget rules.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockData.shopping.map(store => (
          <Card key={store.id} className="hover:shadow-xl transition-all border-2 rounded-[2.5rem] overflow-hidden flex flex-col group">
            <div className="relative h-64 w-full overflow-hidden">
              <Image 
                src={getPlaceholderImageUrl(store.imageId || 'hero-abstract')} 
                alt={store.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 flex items-center gap-3">
                {store.budgetFriendly && (
                  <Badge className="bg-green-500/90 text-white">
                    Budget Match
                  </Badge>
                )}
                <div className="flex items-center gap-1 text-sm font-black text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> 4.5
                </div>
              </div>
            </div>
            
            <CardHeader className="pb-2 pt-6 px-8">
              <div className="flex justify-between items-center mb-1">
                <Badge variant="secondary" className="rounded-lg font-bold uppercase text-[10px] tracking-widest">{store.type}</Badge>
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {store.hours}
                </span>
              </div>
              <CardTitle className="text-3xl font-black mt-2">{store.name}</CardTitle>
              <div className="flex items-center gap-1 font-bold text-muted-foreground text-xs mt-3">
                <MapPin className="h-3 w-3 text-primary" /> {store.location}
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 pb-8 px-8 mt-auto">
              <div className="flex justify-between items-center pt-6 border-t">
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> Personalized choice
                </div>
                <Button variant="outline" className="border-2 rounded-2xl px-6 h-10 font-bold hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                  Visit Store
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
