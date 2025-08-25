"use client";

import { DocumentUpload } from "@/components/features/upload/document-upload";
import { ChatInterface } from "@/components/features/chat/chat-interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, Zap, TrendingUp, Shield, Clock } from "lucide-react";
import { useAppStore } from "@/lib/store";

export default function Home() {
  const { uploadedDocuments } = useAppStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
            <Zap className="h-4 w-4" />
            <span>Powered by Gemini AI</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="gradient-text">Intelligent Document</span>
            <br />
            <span className="text-foreground">Assistant</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your documents into conversational knowledge. Upload, analyze, and chat with your content using state-of-the-art AI technology.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Shield className="h-4 w-4 mr-2" />
              Secure & Private
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Clock className="h-4 w-4 mr-2" />
              Lightning Fast
            </Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Advanced AI
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents</CardTitle>
              <FileText className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{uploadedDocuments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Ready for analysis
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Model</CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">Gemini</div>
              <p className="text-xs text-muted-foreground mt-1">
                Latest AI technology
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversations</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">∞</div>
              <p className="text-xs text-muted-foreground mt-1">
                Unlimited chats
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="text-center xl:text-left">
              <h2 className="text-3xl font-semibold mb-3 gradient-text">Upload Documents</h2>
              <p className="text-muted-foreground text-lg">
                Start by uploading PDF documents to build your knowledge base.
              </p>
            </div>
            
            <DocumentUpload />

            {/* Document List */}
            {uploadedDocuments.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Your Knowledge Base</span>
                    <Badge variant="secondary">{uploadedDocuments.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                    {uploadedDocuments.map((doc, index) => (
                      <div key={doc.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{doc.fileName}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.chunkCount} chunks • {new Date(doc.uploadTime).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-200">
                          ✓ Ready
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Chat Section */}
          <div className="space-y-6">
            <div className="text-center xl:text-left">
              <h2 className="text-3xl font-semibold mb-3 gradient-text">AI Assistant</h2>
              <p className="text-muted-foreground text-lg">
                Ask questions and get intelligent answers from your documents.
              </p>
            </div>
            
            <ChatInterface />
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 text-center">
          <h3 className="text-3xl font-semibold mb-4 gradient-text">Why Choose RAG Assistant?</h3>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Experience the future of document intelligence with our advanced AI-powered platform.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-xl mb-3">Lightning Fast</h4>
              <p className="text-muted-foreground">
                Get instant answers with advanced vector search and AI processing in milliseconds.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-xl mb-3">Smart Analysis</h4>
              <p className="text-muted-foreground">
                Advanced document chunking and embedding for superior context understanding.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold text-xl mb-3">Natural Conversations</h4>
              <p className="text-muted-foreground">
                Chat naturally with context-aware responses and precise source citations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}