'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { HelpCircle, Info, Sparkles, ShieldCheck, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function HelpPage() {
  const faqs = [
    {
      q: "How does the AI understand my budget?",
      a: "SmartLife AI processes your explicit 'Daily Spending Limit' set in your profile. We use rule-based constraint filtering to ensure every suggestion stays within your boundaries."
    },
    {
      q: "What is 'Discovery Level'?",
      a: "This setting balances your routine favorites against new, unexplored territory. A higher discovery level means the AI will take more risks to find things you haven't seen before."
    },
    {
      q: "Is my data being sold?",
      a: "Absolutely not. SmartLife follows a strict 'No-Sell' protocol. Your data is used exclusively to improve the contextual relevance of your assistant's logic."
    },
    {
      q: "How do I reset my preferences?",
      a: "You can reset your onboarding or clear specific interest matrices in the Privacy section of your settings."
    }
  ];

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <div className="inline-flex p-3 rounded-2xl bg-accent/30 text-primary mb-4">
          <HelpCircle className="h-10 w-10" />
        </div>
        <h1 className="text-4xl font-black tracking-tight text-primary">Support & Resources</h1>
        <p className="text-muted-foreground mt-4 text-lg">Everything you need to master your SmartLife assistant.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {[
          { title: 'How It Works', desc: 'The science behind our explainable AI logic.', icon: Info, href: '/transparency' },
          { title: 'FAQ', desc: 'Quick answers to common questions.', icon: HelpCircle, href: '#faq' },
          { title: 'Community', desc: 'Connect with other SmartLife users.', icon: MessageSquare, href: '#' }
        ].map((box, i) => (
          <Link key={i} href={box.href} className="group" shadow-sm="true">
            <Card className="h-full border-2 hover:border-primary transition-all hover:shadow-md cursor-pointer rounded-[2rem]">
              <CardHeader>
                <box.icon className="h-6 w-6 text-primary mb-2 group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg">{box.title}</CardTitle>
                <CardDescription className="text-xs">{box.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div id="faq" className="space-y-8 mb-16">
        <div className="flex items-center gap-3 border-b pb-4">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-2 rounded-2xl mb-4 px-6 overflow-hidden bg-card">
              <AccordionTrigger className="hover:no-underline font-bold text-left py-6">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pt-2 pb-6 italic text-base">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <Card className="bg-primary text-primary-foreground rounded-[3rem] overflow-hidden border-none shadow-xl">
        <CardContent className="p-12 text-center">
          <Sparkles className="h-12 w-12 mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Still have questions?</h2>
          <p className="text-primary-foreground/70 mb-10 max-w-md mx-auto text-lg">
            Our support team is here to help you get the most out of your AI experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" className="h-14 px-10 font-bold gap-2 rounded-2xl shadow-lg">
              <Mail className="h-5 w-5" /> Contact Support
            </Button>
            <Button variant="outline" className="h-14 px-10 font-bold bg-white/10 border-white/20 hover:bg-white/20 text-white rounded-2xl" asChild>
              <Link href="/transparency">Read Protocol</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
