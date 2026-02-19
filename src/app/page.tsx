
import Link from "next/link";
import { Sparkles, Shield, Clock, Smartphone, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 px-4 overflow-hidden">
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center rounded-full border bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2" />
            Hackathon Ready: AI Smart Life Assistant
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-primary mb-6">
            Your Life, <br />
            <span className="text-muted-foreground">Optimized by AI.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            A personalized assistant that understands your budget, schedule, and interests to plan your perfect day.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl bg-primary px-10 text-base font-semibold text-primary-foreground shadow-lg transition-all hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex h-12 items-center justify-center rounded-xl border-2 bg-background px-10 text-base font-semibold shadow-sm hover:bg-accent"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-3xl border-2 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600">
              <Smartphone className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Smart Onboarding</h3>
            <p className="text-sm text-muted-foreground">Tell us your budget, role, and interests. We do the rest.</p>
          </div>
          <div className="p-8 rounded-3xl border-2 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Dynamic Day Planning</h3>
            <p className="text-sm text-muted-foreground">"I have ₹200 and 2 hours." Our AI finds the perfect match.</p>
          </div>
          <div className="p-8 rounded-3xl border-2 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Trust-First AI</h3>
            <p className="text-sm text-muted-foreground">Transparent logic. No hidden data selling. Full user control.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-8 italic">"Stop searching. Start living."</h2>
          <Link href="/signup" className="inline-flex h-14 items-center justify-center rounded-2xl bg-white text-primary px-12 text-lg font-bold shadow-xl hover:scale-105 transition-transform">
            Try AI Assistant Now <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
