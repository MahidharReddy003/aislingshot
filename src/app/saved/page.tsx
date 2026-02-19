
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  FolderHeart, 
  Bookmark, 
  MapPin, 
  Clock, 
  Utensils, 
  Calendar, 
  ExternalLink,
  Plus,
  MoreVertical
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const SAVED_ITEMS = [
  { id: '1', title: 'Spicy Canteen', type: 'food', location: 'Campus North', cost: '₹150', category: 'Indian', date: 'Saved yesterday' },
  { id: '2', title: 'Sunset Point', type: 'travel', location: '5km away', cost: 'Low Budget', category: 'Nature', date: 'Saved 2 days ago' },
  { id: '3', title: 'Design Society Meetup', type: 'event', location: 'Campus Hall B', cost: 'Free', category: 'Education', date: 'Saved 1 week ago' },
  { id: '4', title: 'Pasta Palace', type: 'food', location: 'East Wing', cost: '₹300', category: 'Italian', date: 'Saved 2 weeks ago' },
];

const COLLECTIONS = [
  { id: 'c1', name: 'Cheap Student Meals', count: 12, icon: Utensils, color: 'text-orange-500 bg-orange-100' },
  { id: 'c2', name: 'Weekend Trips', count: 5, icon: MapPin, color: 'text-teal-500 bg-teal-100' },
  { id: 'c3', name: 'Club Resources', count: 8, icon: FolderHeart, color: 'text-purple-500 bg-purple-100' },
];

export default function SavedPage() {
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-primary">Your Library</h1>
          <p className="text-muted-foreground mt-2 text-lg">Curated recommendations and custom collections.</p>
        </div>
        <Button className="h-12 px-6 rounded-xl font-bold shadow-lg gap-2">
          <Plus className="h-4 w-4" /> Create Collection
        </Button>
      </div>

      <Tabs defaultValue="favorites" className="space-y-8">
        <TabsList className="bg-muted p-1 border rounded-2xl w-full sm:w-auto grid grid-cols-2">
          <TabsTrigger value="favorites" className="rounded-xl px-8 py-3 gap-2">
            <Heart className="h-4 w-4" /> Favorites
          </TabsTrigger>
          <TabsTrigger value="collections" className="rounded-xl px-8 py-3 gap-2">
            <Bookmark className="h-4 w-4" /> Collections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="favorites" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SAVED_ITEMS.map((item) => (
              <Card key={item.id} className="border-2 hover:shadow-md transition-all group overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="capitalize">{item.type}</Badge>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl mt-2 group-hover:text-primary transition-colors">{item.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {item.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-primary">{item.cost}</span>
                    <span className="text-muted-foreground text-[10px] uppercase tracking-widest">{item.category}</span>
                  </div>
                  <div className="pt-4 border-t flex justify-between items-center">
                    <span className="text-[10px] text-muted-foreground font-medium italic">{item.date}</span>
                    <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs gap-1">
                      View Details <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collections" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLLECTIONS.map((col) => (
              <Card key={col.id} className="border-2 hover:border-primary/50 cursor-pointer transition-all">
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className={`p-5 rounded-3xl mb-6 ${col.color}`}>
                    <col.icon className="h-8 w-8" />
                  </div>
                  <h3 className="font-bold text-xl">{col.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{col.count} Items Saved</p>
                  <Button variant="ghost" className="mt-6 w-full rounded-xl hover:bg-primary/5">Open Folder</Button>
                </CardContent>
              </Card>
            ))}
            <button className="border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/20 hover:text-primary transition-all">
              <Plus className="h-10 w-10 mb-2 opacity-20" />
              <span className="font-bold">New Collection</span>
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
