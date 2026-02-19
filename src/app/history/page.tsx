
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  History, 
  Sparkles, 
  ThumbsUp, 
  ThumbsDown, 
  DollarSign, 
  Clock, 
  Info,
  Calendar,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

const HISTORY_DATA = [
  {
    id: 'h1',
    title: 'Burger Hub Lunch',
    type: 'Recommendation',
    date: 'Today, 12:45 PM',
    cost: '₹180',
    feedback: 'Relevant',
    explanation: 'Selected based on your "Quick" and "Healthy" preferences within a ₹200 budget. Matches your active "Student" persona location context.'
  },
  {
    id: 'h2',
    title: 'Chat Session: Daily Planning',
    type: 'AI Chat',
    date: 'Today, 09:15 AM',
    cost: 'N/A',
    feedback: 'Not Provided',
    explanation: 'Assistant response prioritized "Balanced Discovery" logic to suggest activities you haven\'t tried in the last 7 days.'
  },
  {
    id: 'h3',
    title: 'Sustainability Workshop',
    type: 'Event Discovery',
    date: 'Yesterday, 4:20 PM',
    cost: 'Free',
    feedback: 'Too Repetitive',
    explanation: 'Recommended due to your "Education" interest. However, your feedback indicates a need for higher "Discovery Level" in future event suggestions.'
  },
  {
    id: 'h4',
    title: 'Heritage Museum Trip',
    type: 'Travel Suggestion',
    date: 'Oct 24, 2024',
    cost: '₹250',
    feedback: 'Relevant',
    explanation: 'Filtered by "Low Mobility Priority" and "Budget Rules". High diversity score (85%) because you haven\'t visited a cultural site this month.'
  }
];

export default function HistoryPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight text-primary flex items-center gap-3">
          <History className="h-8 w-8 text-muted-foreground" /> Your History
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Every recommendation, chat, and feedback loop recorded for transparency.</p>
      </div>

      <div className="space-y-6">
        {HISTORY_DATA.map((item) => (
          <Card key={item.id} className="border-2 overflow-hidden">
            <div className="p-4 bg-muted/30 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-background border shadow-sm">
                  {item.type.includes('Chat') ? <MessageSquare className="h-4 w-4 text-pink-500" /> : <Sparkles className="h-4 w-4 text-primary" />}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.type}</p>
                  <p className="text-[10px] text-muted-foreground">{item.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={item.feedback === 'Relevant' ? 'default' : 'outline'} className="text-[10px] font-bold">
                  Feedback: {item.feedback}
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <div className="flex gap-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> {item.cost}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {item.type.includes('Chat') ? '5 min session' : 'Activity'}</span>
                  </div>
                </div>
                <Button variant="ghost" className="rounded-xl h-10 gap-2 hover:bg-primary/5">
                  Replay Experience <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              <Accordion type="single" collapsible className="mt-6 border-t pt-4">
                <AccordionItem value="explanation" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-primary">
                      <Info className="h-4 w-4" /> Why was this shown?
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2">
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 italic text-sm text-foreground leading-relaxed">
                      {item.explanation}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button variant="outline" className="border-2 rounded-xl h-12 px-8 font-bold text-muted-foreground">
          Load More Interactions
        </Button>
      </div>
    </div>
  );
}
