import { Users, TrendingUp, Handshake, Target } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-primary">Transparent, Budget-Aware Personalization</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          SmartLife is redefining how we interact with AI. We believe that technology should work for you, respecting your boundaries and explaining its reasoning.
        </p>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">The Vision: Explainable AI</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            In an era where AI influences everything from the food we eat to the trips we take, trust is the new currency. We believe that <strong>Explainability is the missing link</strong> between raw data and long-term user satisfaction.
          </p>
        </section>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <Handshake className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">Building Trust</h3>
            <p className="text-sm text-muted-foreground">
              By revealing the logic behind recommendations, we increase user confidence and transparency in every interaction.
            </p>
          </div>
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <Target className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">Empowering Choice</h3>
            <p className="text-sm text-muted-foreground">
              Budget and accessibility aren't just filters; they're non-negotiable human constraints that our AI respects at its core.
            </p>
          </div>
        </div>

        <section className="bg-secondary/50 rounded-3xl p-8 md:p-12">
          <h2 className="text-2xl font-bold mb-6">Our Principles</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1"><TrendingUp className="h-5 w-5" /></div>
              <div>
                <h4 className="font-bold">Transparent Decision Making</h4>
                <p className="text-sm text-muted-foreground">Every recommendation comes with a "Why This?" breakdown, explaining budget and preference alignment.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1"><Users className="h-5 w-5" /></div>
              <div>
                <h4 className="font-bold">User-Centric Feedback</h4>
                <p className="text-sm text-muted-foreground">Our feedback loop allows the engine to refine preferences based on your direct input, not just opaque patterns.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center pt-8">
          <h2 className="text-3xl font-bold mb-6 italic">"AI that listens is helpful. AI that explains is trustworthy."</h2>
          <div className="flex justify-center gap-4">
            <Link href="/signup" className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:scale-105">
              Get Started Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
