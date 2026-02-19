
'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Map, Clock, ArrowRight, MapPin, Compass, Sparkles } from 'lucide-react';
import mockData from '@/app/lib/mock-data.json';
import { getPlaceholderImageUrl } from '@/lib/placeholder-images';

export default function TravelPage() {
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 pb-24">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
            <Map className="text-teal-500 h-8 w-8" /> Travel Explorer
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">Nearby escapes within your time and budget bounds.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {mockData.travel.map(place => (
          <Card key={place.id} className="hover:shadow-xl transition-all border-2 rounded-[2.5rem] overflow-hidden flex flex-col group">
            <div className="relative h-64 w-full overflow-hidden">
              <Image 
                src={getPlaceholderImageUrl(place.imageId || 'travel-sunset')} 
                alt={place.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 flex items-center gap-3">
                <Badge className="bg-teal-500/90 text-white">
                  {place.budget} Budget
                </Badge>
                <div className="flex items-center gap-1 text-sm font-black text-white bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                  <Compass className="h-3 w-3 text-primary" /> {place.time} trip
                </div>
              </div>
            </div>
            
            <CardHeader className="pb-2 pt-6 px-8">
              <div className="flex justify-between items-center mb-1">
                <div className="flex gap-2">
                  {place.features.map((f, i) => (
                    <Badge key={i} variant="secondary" className="rounded-lg font-bold uppercase text-[10px] tracking-widest">{f}</Badge>
                  ))}
                </div>
                <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Best: {place.bestTime}
                </span>
              </div>
              <CardTitle className="text-3xl font-black mt-2">{place.name}</CardTitle>
              <div className="flex items-center gap-1 font-bold text-muted-foreground text-xs mt-3">
                <MapPin className="h-3 w-3 text-primary" /> Approx. {place.distance} away
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 pb-8 px-8 mt-auto">
              <div className="flex justify-between items-center pt-6 border-t">
                <p className="text-xs text-muted-foreground italic font-medium">Recommended based on mobility needs</p>
                <Button variant="outline" className="border-2 rounded-2xl px-8 h-12 font-bold hover:bg-primary hover:text-primary-foreground transition-all shadow-sm">
                  View Route
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
