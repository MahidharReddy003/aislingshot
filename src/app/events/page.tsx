
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Info } from 'lucide-react';
import mockData from '@/app/lib/mock-data.json';

export default function EventsPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="text-blue-500" /> Nearby Events
        </h1>
        <p className="text-muted-foreground">Workshops, meetups, and fests happening soon.</p>
      </div>

      <div className="grid gap-4">
        {mockData.events.map(event => (
          <Card key={event.id} className="hover:border-primary transition-colors border-2">
            <CardContent className="p-0 flex flex-col sm:flex-row">
              <div className="w-full sm:w-32 bg-muted flex flex-col items-center justify-center p-4 border-r">
                <span className="text-2xl font-bold">{event.time}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Start Time</span>
              </div>
              <div className="flex-1 p-6">
                <div className="flex justify-between mb-2">
                  <Badge variant="secondary">{event.category}</Badge>
                  <span className="text-sm font-bold text-primary">{event.cost === 0 ? 'FREE' : `₹${event.cost}`}</span>
                </div>
                <CardTitle className="text-xl">{event.name}</CardTitle>
                <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.distance}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
