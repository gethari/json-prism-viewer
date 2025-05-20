
import React, { useEffect, useRef } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { 
  GitCompare, 
  FileJson, 
  Code, 
  Share2, 
  Download, 
  ArrowUpDown, 
  Laptop, 
  Moon,
  Sun,
  Zap,
  ExternalLink,
  CornerRightDown,
  Sparkles,
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

const AboutPage: React.FC = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  // Animation for staggered card entry
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll('.bento-card');
    if (cards) {
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate-fade-in');
        }, 100 * index);
      });
    }
  }, []);

  return (
    <>
      <Header />
      <div className="container py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
          <h1 className="text-4xl font-bold mb-4">About JSON Toolkit</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A powerful suite of tools to help developers work with JSON data efficiently
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div 
          ref={gridRef} 
          className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]"
        >
          {/* Feature 1 - JSON Compare - Large Card */}
          <Card className="bento-card opacity-0 col-span-1 md:col-span-4 lg:col-span-6 row-span-2 overflow-hidden group hover:shadow-lg transition-all duration-300 border border-indigo-100 dark:border-indigo-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 to-indigo-50/80 dark:from-indigo-950/40 dark:to-purple-950/40 z-0 transition-all duration-500 group-hover:scale-105"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <Badge className="bg-indigo-500 hover:bg-indigo-600 mb-2">Core Feature</Badge>
                <GitCompare className="h-8 w-8 text-indigo-500 transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <CardTitle className="text-2xl font-bold">JSON Comparison</CardTitle>
              <CardDescription className="text-muted-foreground">
                Compare two JSON objects side by side with intuitive visual highlighting
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 shadow-sm transform transition-transform duration-300 hover:scale-105">
                  <h3 className="text-sm font-semibold mb-1">Side-by-Side View</h3>
                  <p className="text-xs text-muted-foreground">Visually compare differences with clear highlights</p>
                </div>
                <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 shadow-sm transform transition-transform duration-300 hover:scale-105">
                  <h3 className="text-sm font-semibold mb-1">Unified View</h3>
                  <p className="text-xs text-muted-foreground">See all changes in a single consolidated view</p>
                </div>
              </div>
            </CardContent>
            <div className="absolute bottom-2 right-2 z-10">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <span className="text-xs text-indigo-500 dark:text-indigo-400 cursor-pointer inline-flex items-center">
                    <Sparkles className="h-3 w-3 mr-1" /> Learn more
                  </span>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Advanced Diff Visualization</h4>
                    <p className="text-xs">Our JSON comparison tool highlights additions, deletions, and modifications with color coding for quick analysis.</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="bg-background/50 text-xs">Syntax Highlighting</Badge>
                      <Badge variant="outline" className="bg-background/50 text-xs">Tree View</Badge>
                      <Badge variant="outline" className="bg-background/50 text-xs">Line-by-Line Diff</Badge>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-indigo-200/20 dark:bg-indigo-700/10 rounded-full blur-xl z-0"></div>
          </Card>

          {/* Feature 2 - Translation Checker */}
          <Card className="bento-card opacity-0 col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden group hover:shadow-lg transition-all duration-300 border border-amber-100 dark:border-amber-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/40 dark:to-orange-950/40 z-0 transition-all duration-500 group-hover:scale-105"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <Badge className="bg-amber-500 hover:bg-amber-600 mb-2">Core Feature</Badge>
                <FileJson className="h-7 w-7 text-amber-500 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <CardTitle>Translation Checker</CardTitle>
              <CardDescription className="text-muted-foreground">
                Identify missing translation keys
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-background/50">Missing Keys</Badge>
                <Badge variant="outline" className="bg-background/50">Untranslated</Badge>
              </div>
            </CardContent>
            <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-amber-200/30 dark:bg-amber-700/10 rounded-full blur-xl z-0"></div>
          </Card>

          {/* Feature 3 - Share as URL */}
          <Card className="bento-card opacity-0 col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden group hover:shadow-lg transition-all duration-300 border border-blue-100 dark:border-blue-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-cyan-50/80 dark:from-blue-950/40 dark:to-cyan-950/40 z-0 transition-all duration-500 group-hover:scale-105"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <Badge className="bg-blue-500 hover:bg-blue-600 mb-2">Sharing</Badge>
                <Share2 className="h-7 w-7 text-blue-500 transition-transform duration-300 group-hover:rotate-12" />
              </div>
              <CardTitle>Share as URL</CardTitle>
              <CardDescription className="text-muted-foreground">
                Generate shareable links
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-background/50">URL Encoding</Badge>
                <Badge variant="outline" className="bg-background/50">Base64</Badge>
              </div>
            </CardContent>
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-blue-200/30 dark:bg-blue-700/10 rounded-full blur-xl z-0"></div>
          </Card>

          {/* Feature 4 - Export Options */}
          <Card className="bento-card opacity-0 col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden group hover:shadow-lg transition-all duration-300 border border-green-100 dark:border-green-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 to-emerald-50/80 dark:from-green-950/40 dark:to-emerald-950/40 z-0 transition-all duration-500 group-hover:scale-105"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <Badge className="bg-green-500 hover:bg-green-600 mb-2">Utility</Badge>
                <Download className="h-7 w-7 text-green-500 transition-transform duration-300 group-hover:translate-y-1" />
              </div>
              <CardTitle>Export Options</CardTitle>
              <CardDescription className="text-muted-foreground">
                Download in various formats
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-background/50">Report</Badge>
                <Badge variant="outline" className="bg-background/50">JSON</Badge>
              </div>
            </CardContent>
            <div className="absolute -top-8 -left-8 w-16 h-16 bg-green-200/30 dark:bg-green-700/10 rounded-full blur-xl z-0"></div>
          </Card>

          {/* Feature 5 - Swap Content */}
          <Card className="bento-card opacity-0 col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden group hover:shadow-lg transition-all duration-300 border border-rose-100 dark:border-rose-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/80 to-pink-50/80 dark:from-rose-950/40 dark:to-pink-950/40 z-0 transition-all duration-500 group-hover:scale-105"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <Badge className="bg-rose-500 hover:bg-rose-600 mb-2">Utility</Badge>
                <ArrowUpDown className="h-7 w-7 text-rose-500 transition-transform duration-300 group-hover:translate-y-1" />
              </div>
              <CardTitle>Swap Content</CardTitle>
              <CardDescription className="text-muted-foreground">
                Switch between JSON sources
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-background/50">One-Click</Badge>
                <Badge variant="outline" className="bg-background/50">Reverse</Badge>
              </div>
            </CardContent>
            <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-rose-200/30 dark:bg-rose-700/10 rounded-full blur-xl z-0"></div>
          </Card>

          {/* Feature 6 - Theme Support - Medium Card */}
          <Card className="bento-card opacity-0 col-span-1 md:col-span-4 lg:col-span-6 row-span-2 overflow-hidden group hover:shadow-lg transition-all duration-300 border border-violet-100 dark:border-violet-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 to-purple-50/80 dark:from-violet-950/40 dark:to-purple-950/40 z-0 transition-all duration-500 group-hover:scale-105"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <Badge className="bg-violet-500 hover:bg-violet-600 mb-2">UI/UX</Badge>
                <div className="flex space-x-1">
                  <Sun className="h-7 w-7 text-amber-400 transition-all duration-500 group-hover:rotate-45" />
                  <Moon className="h-7 w-7 text-violet-500 transition-all duration-500 group-hover:-rotate-12" />
                  <Laptop className="h-7 w-7 text-gray-500 transition-all duration-500 group-hover:scale-110" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">Theme Support</CardTitle>
              <CardDescription className="text-muted-foreground">
                Choose between light, dark, or system theme to work comfortably in any environment
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 shadow-sm transform transition-transform duration-300 hover:scale-105">
                  <div className="flex justify-center mb-2">
                    <Sun className="h-5 w-5 text-amber-400" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1 text-center">Light Mode</h3>
                  <p className="text-xs text-muted-foreground text-center">Bright theme for daytime use</p>
                </div>
                <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 shadow-sm transform transition-transform duration-300 hover:scale-105">
                  <div className="flex justify-center mb-2">
                    <Moon className="h-5 w-5 text-violet-500" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1 text-center">Dark Mode</h3>
                  <p className="text-xs text-muted-foreground text-center">Easy on the eyes at night</p>
                </div>
                <div className="bg-white/60 dark:bg-black/20 rounded-lg p-3 shadow-sm transform transition-transform duration-300 hover:scale-105">
                  <div className="flex justify-center mb-2">
                    <Laptop className="h-5 w-5 text-gray-500" />
                  </div>
                  <h3 className="text-sm font-semibold mb-1 text-center">System</h3>
                  <p className="text-xs text-muted-foreground text-center">Follows your OS preferences</p>
                </div>
              </div>
            </CardContent>
            <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-violet-200/20 dark:bg-violet-700/10 rounded-full blur-xl z-0"></div>
            <div className="absolute -top-12 -left-12 w-24 h-24 bg-purple-200/20 dark:bg-purple-700/10 rounded-full blur-xl z-0"></div>
          </Card>

          {/* Feature 7 - Lightning Fast */}
          <Card className="bento-card opacity-0 col-span-1 md:col-span-6 lg:col-span-12 overflow-hidden group hover:shadow-lg transition-all duration-300 border border-sky-100 dark:border-sky-900/40">
            <div className="absolute inset-0 bg-gradient-to-br from-sky-50/80 to-blue-50/80 dark:from-sky-950/40 dark:to-blue-950/40 z-0 transition-all duration-500 group-hover:scale-105"></div>
            <CardHeader className="relative z-10">
              <div className="flex items-start justify-between">
                <Badge className="bg-sky-500 hover:bg-sky-600 mb-2">Performance</Badge>
                <Zap className="h-8 w-8 text-yellow-500 transition-all duration-300 group-hover:scale-125" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
              <CardDescription className="text-muted-foreground">
                Built with performance in mind to handle large JSON objects without slowing down your browser
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="outline" className="bg-background/50">Optimized Diff Algorithm</Badge>
                <Badge variant="outline" className="bg-background/50">Virtualized Rendering</Badge>
                <Badge variant="outline" className="bg-background/50">Lazy Loading</Badge>
                <Badge variant="outline" className="bg-background/50">File Size Comparison</Badge>
              </div>
            </CardContent>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-sky-200/20 dark:bg-sky-700/10 rounded-full blur-xl z-0"></div>
            <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-blue-200/20 dark:bg-blue-700/10 rounded-full blur-xl z-0"></div>
          </Card>

          {/* Interactive Carousel Section */}
          <div className="bento-card opacity-0 col-span-1 md:col-span-6 lg:col-span-12 relative">
            <AspectRatio ratio={16/5} className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/60 dark:to-slate-900/60 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <Carousel className="w-full h-full">
                <CarouselContent>
                  <CarouselItem className="flex items-center justify-center py-6 px-10">
                    <div className="text-center max-w-3xl mx-auto">
                      <h3 className="text-2xl font-bold mb-4">Designed for Developers</h3>
                      <p className="text-muted-foreground">
                        JSON Toolkit offers a comprehensive suite of tools that make working with JSON data efficient and painless.
                        Whether you're debugging APIs, validating schemas, or comparing data structures, we've got you covered.
                      </p>
                      <div className="flex items-center justify-center mt-6 space-x-4">
                        <Code className="h-6 w-6 text-primary" />
                        <CornerRightDown className="h-6 w-6 text-primary" />
                        <ExternalLink className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CarouselItem>
                  <CarouselItem className="flex items-center justify-center py-6 px-10">
                    <div className="text-center max-w-3xl mx-auto">
                      <h3 className="text-2xl font-bold mb-4">Open Source & Free</h3>
                      <p className="text-muted-foreground">
                        JSON Toolkit is completely free to use and open source. We believe in creating tools that help the developer
                        community without restrictions. Use it for personal or commercial projects with no limitations.
                      </p>
                      <div className="flex items-center justify-center mt-6 space-x-4">
                        <GitCompare className="h-6 w-6 text-primary" />
                        <FileJson className="h-6 w-6 text-primary" />
                        <Share2 className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                  </CarouselItem>
                </CarouselContent>
                <div className="absolute top-1/2 -translate-y-1/2 flex justify-between w-full px-2">
                  <CarouselPrevious className="relative left-0 bg-white/70 dark:bg-gray-800/70" />
                  <CarouselNext className="relative right-0 bg-white/70 dark:bg-gray-800/70" />
                </div>
              </Carousel>
            </AspectRatio>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
