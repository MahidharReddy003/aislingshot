
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight">
              TransparencyAI
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Explainable AI Experience Hub. Transparent, budget-aware personalization for the modern consumer.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/experiences/recommender" className="hover:text-primary transition-colors">Recommender</Link></li>
              <li><Link href="/experiences/assistant" className="hover:text-primary transition-colors">Assistant</Link></li>
              <li><Link href="/experiences/planner" className="hover:text-primary transition-colors">Planner</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4">Project</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/transparency" className="hover:text-primary transition-colors">Transparency</Link></li>
              <li><Link href="/pitch" className="hover:text-primary transition-colors">Pitch</Link></li>
              <li><Link href="/demo" className="hover:text-primary transition-colors">Demo</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 TransparencyAI. Created for "AI in Consumer Experiences" Hackathon.
          </p>
          <div className="flex items-center space-x-4 text-xs font-medium text-muted-foreground">
            <span>Built with Genkit & Firebase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
