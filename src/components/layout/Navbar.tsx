
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  User, 
  Heart, 
  History, 
  Settings, 
  HelpCircle,
  LogOut,
  ChevronDown,
  Sparkles,
  Bookmark,
  Bell,
  Lock,
  Accessibility,
  Wallet,
  Settings2,
  Info,
  Wrench,
  ShieldCheck
} from "lucide-react";
import { useUser, useAuth, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { signOut } from "firebase/auth";
import { doc } from "firebase/firestore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUser();
  const auth = useAuth();
  const db = useFirestore();
  const router = useRouter();

  const profileRef = useMemoFirebase(() => {
    if (!user || !db) return null;
    return doc(db, 'users', user.uid);
  }, [user, db]);

  const { data: profile } = useDoc(profileRef);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const displayName = profile?.name || user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-primary">SmartLife</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/experiences/recommender"
                    className={cn(
                      "text-sm font-medium transition-colors hover:text-primary",
                      pathname.startsWith("/experiences") ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    Experiences
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-accent/50 rounded-full h-10">
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center border-2 border-primary/10">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden sm:inline font-bold text-sm text-primary">
                      {displayName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64 mt-2" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuGroup className="md:hidden">
                    <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Core Modules</DropdownMenuLabel>
                    <DropdownMenuItem asChild><Link href="/experiences/recommender"><Sparkles className="mr-2 h-4 w-4" /> Recommender</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/experiences/assistant"><Bell className="mr-2 h-4 w-4" /> Assistant</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/experiences/planner"><Info className="mr-2 h-4 w-4" /> Planner</Link></DropdownMenuItem>
                    <DropdownMenuItem asChild><Link href="/experiences/creator"><Wrench className="mr-2 h-4 w-4" /> Creator Tools</Link></DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </DropdownMenuGroup>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Saved</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem asChild>
                          <Link href="/saved">
                            <Heart className="mr-2 h-4 w-4" />
                            <span>Favorites</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/saved">
                            <Bookmark className="mr-2 h-4 w-4" />
                            <span>Collections</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <History className="mr-2 h-4 w-4" />
                      <span>History</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem asChild>
                          <Link href="/history">
                            <Sparkles className="mr-2 h-4 w-4" />
                            <span>Recommendations</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/history">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            <span>Feedback</span>
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="w-48">
                        <DropdownMenuItem asChild><Link href="/settings"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/settings"><Settings2 className="mr-2 h-4 w-4" />Preferences</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/settings"><Wallet className="mr-2 h-4 w-4" />Budget Rules</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/settings"><Sparkles className="mr-2 h-4 w-4" />Discovery</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/settings"><Accessibility className="mr-2 h-4 w-4" />Accessibility</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/settings/security"><Lock className="mr-2 h-4 w-4" />Security</Link></DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive focus:bg-destructive/5 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-sm font-medium text-muted-foreground hover:text-primary px-3 py-2"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow transition-all hover:bg-primary/90"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
