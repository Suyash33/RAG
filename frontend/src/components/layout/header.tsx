"use client";

import { Brain, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 mx-auto">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Brain className="h-8 w-8 text-primary" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">
              RAG Assistant
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              AI-Powered Document Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <span>Navigation</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-8">
                <Button variant="ghost" className="justify-start" onClick={() => setIsOpen(false)}>
                  🏠 Home
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => setIsOpen(false)}>
                  📚 Documents
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => setIsOpen(false)}>
                  💬 Chat History
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => setIsOpen(false)}>
                  ❓ Help & Support
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}