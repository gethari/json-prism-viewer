import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './hooks/use-theme';
import JsonCompare from './pages/JsonCompare';
import TranslationChecker from './pages/TranslationChecker';

const queryClient = new QueryClient();
// Using process.env.NODE_ENV to determine if in production
const basename = process.env.NODE_ENV === 'production' ? '/json-prism-viewer' : '';
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="json-prism-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={basename}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/json-compare" element={<JsonCompare />} />
            <Route path="/translation-checker" element={<TranslationChecker />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
