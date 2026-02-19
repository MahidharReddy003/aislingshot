
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Map, Clock, ArrowRight } from 'lucide-react';
import mockData from '@/app/lib/mock-data.json';
import { Button } from '@/components/ui/button';

export default function TravelPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Map className="text-teal-500" /> Travel Explorer
        </h1>
        <p className="text-muted-foreground">Nearby escapes within your time and budget bounds.</p>
      </div>

      <div className="space-y-4">
        {mockData.travel.map(place => (
          <Card key={place.id} className="hover:bg-accent/5 transition-colors border-2">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-teal-50 text-teal-700 hover:bg-teal-50 border-none uppercase text-[10px] tracking-widest font-bold">
                    {place.budget} Budget
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter flex items-center gap-1">
                    <Clock className="h-2 w-2" /> {place.time} Required
                  </span>
                </div>
                <CardTitle>{place.name}</CardTitle>
                <CardDescription>Approx. {place.distance} away from current location.</CardDescription>
              </div>
              <Button size="icon" variant="ghost">
                <ArrowRight className="h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
