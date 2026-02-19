
import { Speech, Users, TrendingUp, Handshake, Target } from "lucide-react";
import Link from "next/link";

export default function PitchPage() {
  return (
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <div className="mb-16">
        <Badge className="mb-4">Hackathon Submission</Badge>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">AI in Consumer Experiences – Transparent, Budget-Aware Personalization</h1>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold mb-4">The Thesis: Why Explainable AI?</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            In an era where AI influences everything from the food we eat to the trips we take, trust is the new currency. Black-box algorithms alienate users. We believe that <strong>Explainability is the missing link</strong> between raw data and long-term loyalty.
          </p>
        </section>

        <div className="grid sm:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl border bg-card shadow-sm space-y-4">
            <Handshake className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-bold">Building Trust</h3>
            <p className="text-sm text-muted-foreground">
              By revealing the logic behind recommendations, we reduce "Algorithm Aversion" and increase user confidence in the platform.
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
          <h2 className="text-2xl font-bold mb-6">Competitive Advantage</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="mt-1"><TrendingUp className="h-5 w-5" /></div>
              <div>
                <h4 className="font-bold">Higher Conversion</h4>
                <p className="text-sm text-muted-foreground">Users who understand why a product is recommended are 3x more likely to interact with it.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="mt-1"><Users className="h-5 w-5" /></div>
              <div>
                <h4 className="font-bold">Better Data Quality</h4>
                <p className="text-sm text-muted-foreground">Our transparent feedback loop provides high-intent data that allows the engine to refine preferences more accurately.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="text-center pt-8">
          <h2 className="text-3xl font-bold mb-6 italic">"AI that listens is helpful. AI that explains is trustworthy."</h2>
          <div className="flex justify-center gap-4">
            <Link href="/demo" className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground transition-all hover:scale-105">
              Launch Demo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-accent/20 px-2.5 py-0.5 text-xs font-semibold text-primary ${className}`}>
      {children}
    </span>
  );
}
