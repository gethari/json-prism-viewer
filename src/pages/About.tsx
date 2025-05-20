
import React from 'react';
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
  FileSearch,
} from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <>
      <Header />
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">About JSON Toolkit</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A powerful suite of tools to help developers work with JSON data efficiently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 - JSON Compare */}
          <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-indigo-950/40 dark:to-purple-950/40 rounded-xl p-6 shadow-sm border border-indigo-100 dark:border-indigo-900 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-indigo-500 hover:bg-indigo-600 mb-2">Core Feature</Badge>
                <h2 className="text-2xl font-bold">JSON Comparison</h2>
              </div>
              <GitCompare className="h-8 w-8 text-indigo-500" />
            </div>
            <p className="text-muted-foreground mb-4">
              Compare two JSON objects side by side to identify differences, additions, and deletions with intuitive visual highlighting.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background/50">Diff Visualization</Badge>
              <Badge variant="outline" className="bg-background/50">Side-by-Side View</Badge>
              <Badge variant="outline" className="bg-background/50">Unified View</Badge>
            </div>
          </div>

          {/* Feature 2 - Translation Checker */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 rounded-xl p-6 shadow-sm border border-amber-100 dark:border-amber-900 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-amber-500 hover:bg-amber-600 mb-2">Core Feature</Badge>
                <h2 className="text-2xl font-bold">Translation Checker</h2>
              </div>
              <FileJson className="h-8 w-8 text-amber-500" />
            </div>
            <p className="text-muted-foreground mb-4">
              Identify missing translation keys and validate localization files to ensure complete coverage.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background/50">Missing Keys</Badge>
              <Badge variant="outline" className="bg-background/50">Untranslated Content</Badge>
            </div>
          </div>

          {/* Feature 3 - Share as URL */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/40 dark:to-cyan-950/40 rounded-xl p-6 shadow-sm border border-blue-100 dark:border-blue-900 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-blue-500 hover:bg-blue-600 mb-2">Sharing</Badge>
                <h2 className="text-2xl font-bold">Share as URL</h2>
              </div>
              <Share2 className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-muted-foreground mb-4">
              Generate shareable links to your JSON comparisons for easy collaboration with team members.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background/50">URL Encoding</Badge>
              <Badge variant="outline" className="bg-background/50">Base64</Badge>
            </div>
          </div>

          {/* Feature 4 - Export */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 rounded-xl p-6 shadow-sm border border-green-100 dark:border-green-900 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-green-500 hover:bg-green-600 mb-2">Utility</Badge>
                <h2 className="text-2xl font-bold">Export Options</h2>
              </div>
              <Download className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-muted-foreground mb-4">
              Export your comparison results in different formats for documentation or further analysis.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background/50">Download Report</Badge>
              <Badge variant="outline" className="bg-background/50">JSON Format</Badge>
            </div>
          </div>

          {/* Feature 5 - Swap Content */}
          <div className="bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40 rounded-xl p-6 shadow-sm border border-rose-100 dark:border-rose-900 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-rose-500 hover:bg-rose-600 mb-2">Utility</Badge>
                <h2 className="text-2xl font-bold">Swap Content</h2>
              </div>
              <ArrowUpDown className="h-8 w-8 text-rose-500" />
            </div>
            <p className="text-muted-foreground mb-4">
              Easily swap the original and modified JSON content to view differences from a different perspective.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background/50">One-Click Swap</Badge>
              <Badge variant="outline" className="bg-background/50">Reverse Comparison</Badge>
            </div>
          </div>

          {/* Feature 6 - Theme Switching */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/40 dark:to-purple-950/40 rounded-xl p-6 shadow-sm border border-violet-100 dark:border-violet-900 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-violet-500 hover:bg-violet-600 mb-2">UI/UX</Badge>
                <h2 className="text-2xl font-bold">Theme Support</h2>
              </div>
              <div className="flex space-x-1">
                <Sun className="h-8 w-8 text-amber-400" />
                <Moon className="h-8 w-8 text-violet-500" />
                <Laptop className="h-8 w-8 text-gray-500" />
              </div>
            </div>
            <p className="text-muted-foreground mb-4">
              Choose between light, dark, or system theme to work comfortably in any environment.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background/50">Light Mode</Badge>
              <Badge variant="outline" className="bg-background/50">Dark Mode</Badge>
              <Badge variant="outline" className="bg-background/50">System Preference</Badge>
            </div>
          </div>

          {/* Feature 7 - Performance */}
          <div className="col-span-1 lg:col-span-3 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/40 dark:to-blue-950/40 rounded-xl p-6 shadow-sm border border-sky-100 dark:border-sky-900 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-sky-500 hover:bg-sky-600 mb-2">Performance</Badge>
                <h2 className="text-2xl font-bold">Lightning Fast</h2>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-muted-foreground mb-4">
              Built with performance in mind to handle large JSON objects without slowing down your browser.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-background/50">Optimized Diff Algorithm</Badge>
              <Badge variant="outline" className="bg-background/50">Virtualized Rendering</Badge>
              <Badge variant="outline" className="bg-background/50">Lazy Loading</Badge>
              <Badge variant="outline" className="bg-background/50">File Size Comparison</Badge>
            </div>
          </div>

          {/* Analytics Recommendations Section */}
          <div className="col-span-1 md:col-span-3 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/60 dark:to-slate-900/60 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <Badge className="bg-gray-500 hover:bg-gray-600 mb-2">Recommendations</Badge>
                <h2 className="text-2xl font-bold">Analytics Integration</h2>
              </div>
              <FileSearch className="h-8 w-8 text-gray-500" />
            </div>
            <p className="text-muted-foreground mb-4">
              Recommended open-source, self-hosted analytics solutions that respect privacy:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-2">Umami</h3>
                <p className="text-sm text-muted-foreground mb-3">Simple, fast, privacy-focused alternative to Google Analytics</p>
                <a href="https://umami.is/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">Learn more →</a>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-2">Plausible</h3>
                <p className="text-sm text-muted-foreground mb-3">Lightweight and open-source web analytics without cookies</p>
                <a href="https://plausible.io/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">Learn more →</a>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-lg mb-2">Matomo</h3>
                <p className="text-sm text-muted-foreground mb-3">Powerful web analytics platform with extensive features</p>
                <a href="https://matomo.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">Learn more →</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutPage;
