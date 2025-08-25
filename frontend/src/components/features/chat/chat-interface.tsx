"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { useAppStore } from "@/lib/store";
import { apiClient } from "@/lib/api";

export function ChatInterface() {
  const [input, setInput] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    messages, 
    sessionId, 
    isLoading, 
    addMessage, 
    setLoading, 
    setSessionId 
  } = useAppStore();

  // Create session on mount
  useEffect(() => {
    if (!sessionId) {
      apiClient.createSession()
        .then(({ sessionId: newSessionId }) => {
          setSessionId(newSessionId);
        })
        .catch(() => {
          toast.error("Failed to initialize chat session");
        });
    }
  }, [sessionId, setSessionId]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Add user message
    addMessage({
      content: userMessage,
      isUser: true,
    });

    setLoading(true);

    try {
      const response = await apiClient.sendMessage(userMessage, sessionId);
      
      if (response.success) {
        addMessage({
          content: response.data.response,
          isUser: false,
          sources: response.data.sources,
        });
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
      addMessage({
        content: "I'm sorry, I encountered an error. Please try again.",
        isUser: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <Card className="flex flex-col h-[700px] w-full max-w-4xl border-0 shadow-2xl glass-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Bot className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">AI Assistant</h2>
          <Badge variant="secondary" className="ml-auto">
            {messages.length} messages
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Bot className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Welcome to RAG Assistant!
                </h3>
                <p className="text-muted-foreground max-w-md">
                  Upload some documents and start asking questions. I'll help you find answers based on your uploaded content.
                </p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 animate-fade-in ${
                    message.isUser ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {!message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.isUser
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                    
                    {message.sources && message.sources.length > 0 && (
                      <>
                        <Separator className="my-3" />
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            Sources:
                          </p>
                          {message.sources.map((source, index) => (
                            <div key={index} className="flex items-center space-x-2 text-xs">
                              <FileText className="h-3 w-3" />
                              <span className="font-medium">{source.fileName}</span>
                              <Badge variant="outline" className="text-xs">
                                {Math.round(source.score * 100)}% match
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                    
                    <p className="text-xs text-muted-foreground mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.isUser && (
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 border-t">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your documents..."
              className="flex-1 min-h-[44px] max-h-32 resize-none"
              disabled={isLoading || !sessionId}
            />
            <Button 
              type="submit" 
              disabled={!input.trim() || isLoading || !sessionId}
              size="icon"
              className="h-11 w-11"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
}