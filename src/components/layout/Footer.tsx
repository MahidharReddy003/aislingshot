import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/30">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight">
              SmartLife
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              AI Life Assistant. Personalized, budget-aware experiences for your daily life.
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
            <h3 className="text-sm font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/transparency" className="hover:text-primary transition-colors">How it Works</Link></li>
              <li><Link href="/signup" className="hover:text-primary transition-colors">Create Account</Link></li>
              <li><Link href="/login" className="hover:text-primary transition-colors">Sign In</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 SmartLife. Your Personalized AI Assistant.
          </p>
          <div className="flex items-center space-x-4 text-xs font-medium text-muted-foreground">
            <span>Built with Genkit & Firebase</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
