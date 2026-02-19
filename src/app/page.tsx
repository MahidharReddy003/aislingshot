
import Link from "next/link";
import { Shield, Target, Lightbulb, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === "hero-abstract");

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center rounded-full border bg-accent/30 px-3 py-1 text-sm font-medium text-primary mb-6 animate-in fade-in slide-in-from-bottom-3 duration-1000">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
            Empowering Consumer Trust
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            AI That Recommends — <br className="hidden md:block" />
            <span className="text-muted-foreground">And Explains Why.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 animate-in fade-in slide-in-from-bottom-5 duration-1000">
            Personalized experiences across retail, travel, campus life, and media — with full transparency and budget respect.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <Link
              href="/demo"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              Try Demo
            </Link>
            <Link
              href="/transparency"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-lg border bg-background px-8 text-base font-semibold shadow-sm transition-all hover:bg-muted"
            >
              See How It Works
            </Link>
          </div>
        </div>
        
        {/* Decorative background element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 opacity-10">
          {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
            />
          )}
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">The Transparency Gap</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Most modern AI recommendation engines are "black boxes." They offer suggestions without explaining their logic, leading to user skepticism, filter bubbles, and hidden costs.
            </p>
            <ul className="space-y-4">
              {[
                "Opaque decision-making processes",
                "Lack of budget awareness",
                "Static, repetitive filter bubbles",
                "Erosion of user trust"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-muted-foreground">
                  <div className="mt-1 h-5 w-5 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                    <span className="text-xs font-bold">✕</span>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-secondary/30 rounded-2xl p-8 md:p-12 border border-border/50 shadow-sm">
            <h2 className="text-3xl font-bold mb-6">Our Solution</h2>
            <p className="text-lg text-muted-foreground mb-8">
              We've built an explainable AI architecture that prioritizes transparency, user control, and ethical personalization.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Shield, title: "Trust", desc: "Clear reasoning for every choice." },
                { icon: Target, title: "Precision", desc: "Budget-aware constraints." },
                { icon: Lightbulb, title: "Discovery", desc: "Anti-filter bubble logic." },
                { icon: Users, title: "Ethics", desc: "User-centric data privacy." }
              ].map((feature, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <h4 className="font-semibold">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Real-World Experiences</h2>
          <p className="text-muted-foreground">Explore how explainable AI transforms everyday consumer interactions.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Smart Canteen", desc: "Budget-aware meal planning for students.", href: "/experiences/recommender" },
            { title: "Campus Events", desc: "Diverse discovery of university clubs.", href: "/experiences/planner" },
            { title: "Travel Guide", desc: "Transparent planning for the modern traveler.", href: "/experiences/assistant" },
            { title: "Creator Hub", desc: "AI tools for collaborative club growth.", href: "/experiences/creator" }
          ].map((card, i) => (
            <Link 
              key={i} 
              href={card.href}
              className="group p-6 rounded-xl border bg-card hover:bg-secondary/30 transition-all hover:shadow-md"
            >
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary">{card.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{card.desc}</p>
              <div className="flex items-center text-xs font-semibold text-primary">
                Explore <ArrowRight className="ml-1 h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Highlight */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Built on Foundation of Trust</h2>
          <p className="max-w-2xl mx-auto text-primary-foreground/80 mb-10 text-lg">
            Our platform doesn't just provide answers; it provides understanding. By revealing the 'Why' behind every suggestion, we empower users to make informed decisions.
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold mb-2">100%</span>
              <span className="text-sm opacity-70 uppercase tracking-widest">Transparent</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold mb-2">0</span>
              <span className="text-sm opacity-70 uppercase tracking-widest">Hidden Fees</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold mb-2">360°</span>
              <span className="text-sm opacity-70 uppercase tracking-widest">User Control</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
