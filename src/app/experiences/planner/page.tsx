
"use client";

import { Calendar, Users, MapPin, Clock, Search, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PlannerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">Campus Experience Planner</h1>
          <p className="text-muted-foreground">Find clubs, events, and workshops with transparent matching.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10 w-64" placeholder="Search events..." />
          </div>
          <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {[
            { title: "Design Society Meetup", tag: "Design", cost: "Free", time: "2h", match: "98%" },
            { title: "AI Hackathon Launch", tag: "Tech", cost: "₹100", time: "All Day", match: "94%" },
            { title: "Sustainability Workshop", tag: "Ethics", cost: "Free", time: "1.5h", match: "89%" }
          ].map((item, i) => (
            <Card key={i} className="group hover:border-primary transition-colors">
              <CardContent className="p-0">
                <div className="flex items-start">
                  <div className="w-24 h-24 bg-accent/20 rounded-l-lg flex items-center justify-center">
                    <Calendar className="h-8 w-8 text-primary opacity-40" />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between mb-2">
                      <Badge variant="secondary">{item.tag}</Badge>
                      <span className="text-xs font-bold text-primary flex items-center gap-1">
                        <Users className="h-3 w-3" /> {item.match} Match
                      </span>
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{item.title}</h3>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Campus Hall B</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {item.time}</span>
                      <span className="font-bold text-primary">{item.cost}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader>
              <CardTitle className="text-lg">Weekly Trust Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Planned Budget</span>
                  <span>₹500.00</span>
                </div>
                <div className="flex justify-between items-center text-sm font-bold">
                  <span>Remaining</span>
                  <span>₹120.00</span>
                </div>
                <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-accent h-full w-[76%]"></div>
                </div>
                <p className="text-[10px] opacity-70">You have spent 76% of your weekly entertainment budget.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
