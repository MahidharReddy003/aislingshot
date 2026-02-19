'use client';

import { useState, useRef, useEffect } from 'react';
import { chatWithAssistant } from '@/ai/flows/chat-assistant-flow';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Loader2, Sparkles, UserCircle, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const { user } = useUser();
  const db = useFirestore();
  
  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(profileRef);
  const { toast } = useToast();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I am your Smart Life Assistant. How can I help you plan your day or find something fun to do? I will also keep your health and budget in mind.' }
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !profile) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const sanitizedProfile = {
        name: profile.name,
        role: profile.role,
        interests: profile.interests,
        healthConditions: profile.healthConditions || [],
        location: profile.location,
        budgetPreference: profile.budgetPreference,
        aiBehavior: profile.aiBehavior,
        availableTime: profile.availableTime
      };

      const { response } = await chatWithAssistant({
        message: userMsg,
        userProfile: sanitizedProfile
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 pb-24 h-[calc(100vh-10rem)] flex flex-col">
      <div className="mb-12">
        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
          <MessageSquare className="text-pink-500 h-8 w-8" /> AI Assistant
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">Always personalized to your persona, health, and budget.</p>
      </div>

      <Card className="flex-1 overflow-hidden border-2 rounded-[2.5rem] flex flex-col shadow-xl bg-card">
        <ScrollArea className="flex-1 p-8">
          <div className="space-y-8">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="h-10 w-10 border-2 shadow-sm">
                    {m.role === 'assistant' ? (
                      <AvatarFallback className="bg-primary text-primary-foreground font-black"><Sparkles className="h-5 w-5" /></AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-muted"><UserCircle className="h-6 w-6" /></AvatarFallback>
                    )}
                  </Avatar>
                  <div className={`rounded-[2rem] px-6 py-4 text-sm font-medium leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-primary text-primary-foreground rounded-tr-none' 
                      : 'bg-muted rounded-tl-none border-2'
                  }`}>
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-4 items-center text-muted-foreground text-xs font-black uppercase tracking-widest italic animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin" /> Thinking...
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
        <div className="p-6 border-t bg-muted/20">
          <div className="flex gap-4">
            <Input 
              placeholder="Describe your needs or ask for a plan..." 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="bg-background h-14 border-2 rounded-2xl px-6 text-lg"
            />
            <Button onClick={handleSend} disabled={loading || !input.trim()} className="h-14 w-14 rounded-2xl p-0 shadow-lg transition-transform hover:scale-105 shrink-0">
              <Send className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
