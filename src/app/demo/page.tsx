
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Plane, LayoutTemplate, ArrowRight, ShieldCheck } from "lucide-react";

const personas = [
  {
    id: "Student",
    title: "The Campus Student",
    desc: "Balancing tight budgets, academic schedules, and club involvement.",
    image: PlaceHolderImages.find(img => img.id === "persona-student"),
    icon: User
  },
  {
    id: "Traveler",
    title: "The Urban Traveler",
    desc: "Seeking authentic, accessible, and high-value city experiences.",
    image: PlaceHolderImages.find(img => img.id === "persona-traveler"),
    icon: Plane
  },
  {
    id: "Creator",
    title: "The Club Creator",
    desc: "Managing diverse events and growing community trust.",
    image: PlaceHolderImages.find(img => img.id === "persona-creator"),
    icon: LayoutTemplate
  }
];

export default function DemoLanding() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Select Your Demo Persona</h1>
        <p className="text-muted-foreground">
          Every persona interacts with our AI differently. Choose one to start your journey into explainable personalization.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {personas.map((persona) => (
          <Card 
            key={persona.id}
            className={`overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
              selected === persona.id ? "border-primary shadow-xl scale-105" : "hover:border-accent hover:shadow-md"
            }`}
            onClick={() => setSelected(persona.id)}
          >
            <div className="relative h-48 bg-muted">
              {persona.image && (
                <Image 
                  src={persona.image.imageUrl} 
                  alt={persona.image.description} 
                  fill 
                  className="object-cover opacity-80"
                  data-ai-hint={persona.image.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                <persona.icon className="h-5 w-5" />
                <span className="font-bold">{persona.id}</span>
              </div>
            </div>
            <CardContent className="pt-6">
              <h3 className="text-xl font-bold mb-2">{persona.title}</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {persona.desc}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Demo Scenario</span>
                {selected === persona.id && <ShieldCheck className="h-5 w-5 text-primary animate-in zoom-in" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="p-8 rounded-2xl bg-secondary/30 border max-w-xl text-center">
          <h4 className="font-bold mb-2">Ready to see the logic?</h4>
          <p className="text-sm text-muted-foreground mb-6">
            Once you launch the demo, you'll be able to adjust budgets, preferences, and discovery levels to see exactly how our transparency engine adapts.
          </p>
          <Button 
            size="lg" 
            className="w-full sm:w-auto h-12 px-10" 
            disabled={!selected}
            onClick={() => window.location.href = `/experiences/recommender?persona=${selected}`}
          >
            Launch Experience <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          {!selected && <p className="mt-4 text-xs text-red-500 font-medium">Please select a persona to continue</p>}
        </div>
      </div>
    </div>
  );
}
