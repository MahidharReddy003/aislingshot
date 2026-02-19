
import { ShieldCheck, Eye, EyeOff, Scale, Fingerprint, Database } from "lucide-react";

export default function TransparencyPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="text-center mb-16">
        <div className="inline-flex p-3 rounded-full bg-accent/30 text-primary mb-4">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Our Transparency Protocol</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We believe you should own your data and understand the algorithms that shape your experiences.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-20">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Eye className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-bold">Data We Use</h2>
          </div>
          <ul className="space-y-4">
            {[
              "Real-time session preferences",
              "Explicitly stated budget constraints",
              "Voluntary accessibility requirements",
              "Your direct feedback on past results"
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground p-3 bg-secondary/20 rounded-lg">
                <Database className="h-4 w-4 mt-0.5 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <EyeOff className="h-6 w-6 text-red-500" />
            <h2 className="text-xl font-bold">Data We DON'T Use</h2>
          </div>
          <ul className="space-y-4">
            {[
              "Personal identity (names, emails)",
              "Private browsing history",
              "Location tracking without consent",
              "Contact lists or social graphs"
            ].map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-muted-foreground p-3 bg-secondary/20 rounded-lg">
                <Fingerprint className="h-4 w-4 mt-0.5 text-primary" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-primary text-primary-foreground rounded-3xl p-10 md:p-16 mb-20">
        <h2 className="text-3xl font-bold mb-8">How Recommendations Are Generated</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">1</div>
            <h4 className="font-bold">Constraint Filtering</h4>
            <p className="text-sm opacity-80">We instantly discard any options that exceed your budget or violate your accessibility needs.</p>
          </div>
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">2</div>
            <h4 className="font-bold">Weighted Scoring</h4>
            <p className="text-sm opacity-80">Our engine ranks remaining options based on their alignment with your active preferences.</p>
          </div>
          <div className="space-y-3">
            <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">3</div>
            <h4 className="font-bold">Diversity Balancing</h4>
            <p className="text-sm opacity-80">To prevent "filter bubbles," we inject variety by preferring items you haven't recently experienced.</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Scale className="h-6 w-6" />
              Anti-Filter Bubble Logic
            </h2>
            <p className="text-muted-foreground mb-4">
              AI systems often create feedback loops where users only see things they already like. This leads to stagnation.
            </p>
            <p className="text-muted-foreground">
              Our "Discovery" algorithm calculates a 'Diversity Score' for every choice. We prioritize recommendations that sit at the intersection of your preferences and new, unexplored territory.
            </p>
          </div>
          <div className="bg-secondary/30 border p-8 rounded-2xl">
            <div className="space-y-4">
              <div className="h-2 w-3/4 bg-primary/20 rounded"></div>
              <div className="h-2 w-full bg-primary/20 rounded"></div>
              <div className="h-2 w-1/2 bg-accent rounded animate-pulse"></div>
              <p className="text-xs font-mono text-center pt-4 uppercase tracking-tighter opacity-50">Discovery Engine Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
