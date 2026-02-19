
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, MapPin, CheckCircle2 } from 'lucide-react';
import mockData from '@/app/lib/mock-data.json';

export default function ShoppingPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <ShoppingBag className="text-green-500" /> Smart Shopping
        </h1>
        <p className="text-muted-foreground">Discover stores that align with your budget rules.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockData.shopping.map(store => (
          <Card key={store.id} className="hover:shadow-md transition-all border-2">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline">{store.type}</Badge>
                {store.budgetFriendly && (
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                    Budget Match
                  </Badge>
                )}
              </div>
              <CardTitle className="text-lg">{store.name}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {store.location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3 text-primary" /> Personalized for your profile
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
