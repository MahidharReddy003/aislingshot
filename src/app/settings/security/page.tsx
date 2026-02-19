
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmailAuthProvider, linkWithCredential, updatePassword } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Lock, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function SecurityPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const hasPasswordProvider = user?.providerData.some(p => p.providerId === 'password');

  const getStrength = (p: string) => {
    if (!p) return 0;
    let s = 0;
    if (p.length > 6) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: 'Validation Error', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Validation Error', description: 'Password must be at least 6 characters.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      if (!user) throw new Error("No authenticated user found.");

      if (hasPasswordProvider) {
        await updatePassword(user, password);
        toast({ title: 'Success', description: 'Your password has been updated.' });
      } else {
        if (!user.email) throw new Error("User email not found for linking.");
        const credential = EmailAuthProvider.credential(user.email, password);
        await linkWithCredential(user, credential);
        toast({ title: 'Success', description: 'You can now log in using email and password.' });
      }
      setSuccess(true);
      setTimeout(() => router.push('/settings'), 2000);
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        toast({ 
          title: 'Security Alert', 
          description: 'This action requires a recent login. Please log out and back in to continue.', 
          variant: 'destructive' 
        });
      } else {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (isUserLoading) return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
  if (!user) {
    router.replace('/login');
    return null;
  }

  return (
    <div className="container max-w-xl mx-auto py-20 px-4">
      <Link href="/settings" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Settings
      </Link>

      <Card className="border-2 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="text-center bg-muted/20 pb-8 border-b">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-primary/10">
              <Lock className="h-10 w-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">{hasPasswordProvider ? "Update Password" : "Set Account Password"}</CardTitle>
          <CardDescription className="text-base italic">
            {hasPasswordProvider 
              ? "Change your current password." 
              : "Create a password for your account so you can log in without social providers."}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-10">
          {success ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-10 animate-in fade-in zoom-in duration-500">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <div className="text-center">
                <h3 className="text-xl font-bold">Password Securely Set</h3>
                <p className="text-muted-foreground mt-2">Redirecting you back to settings...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSetPassword} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="pass" className="font-bold">New Password</Label>
                <Input 
                  id="pass" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="h-12 border-2" 
                />
                
                {password && (
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Strength: {strengthLabels[strength]}</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden flex gap-0.5">
                      {[...Array(4)].map((_, i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "h-full flex-1 transition-all duration-300",
                            i <= strength ? strengthColors[strength] : "bg-muted"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm" className="font-bold">Confirm Password</Label>
                <Input 
                  id="confirm" 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  required 
                  className="h-12 border-2" 
                />
              </div>

              {!hasPasswordProvider && (
                <div className="p-4 bg-primary/5 rounded-2xl border-2 border-primary/10 flex gap-3 items-start">
                  <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    This will link a password to your <strong>{user.email}</strong> account.
                  </p>
                </div>
              )}

              <Button className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.02]" type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {hasPasswordProvider ? "Update Password" : "Link Password Provider"}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="bg-muted/10 border-t p-6 text-center">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black italic text-center w-full">
            SmartLife Security Protocol Active
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
