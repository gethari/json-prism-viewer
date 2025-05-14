
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { GitCompare, FileJson } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { SettingsProvider } from '@/contexts/SettingsContext';

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="container py-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">JSON Prism Tools</h1>
            <p className="text-muted-foreground">Powerful utilities for working with JSON data</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* JSON Compare Tool Card */}
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GitCompare className="mr-2 h-6 w-6" />
                  JSON Compare
                </CardTitle>
                <CardDescription>
                  Compare two JSON documents and visualize their differences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Upload or paste two JSON documents to see a detailed comparison. 
                  Supports various JSON formats including escaped strings.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/json-compare')}
                >
                  Open Tool
                </Button>
              </CardFooter>
            </Card>
            
            {/* Translation Keys Tool Card */}
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileJson className="mr-2 h-6 w-6" />
                  Translation Keys Checker
                </CardTitle>
                <CardDescription>
                  Find missing translation keys in your localization files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Compare your configuration JSON with a translation file to identify 
                  missing labels. Automatically generate key-value pairs for missing translations.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => navigate('/translation-checker')}
                >
                  Open Tool
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
