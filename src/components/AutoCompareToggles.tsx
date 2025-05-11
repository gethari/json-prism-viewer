
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/contexts/SettingsContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GitCompareArrows, ArrowDownIcon } from 'lucide-react';

const AutoCompareToggles: React.FC = () => {
  const { autoCompare, setAutoCompare, autoScroll, setAutoScroll } = useSettings();

  return (
    <div className="flex space-x-6 items-center mt-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2">
              <Switch 
                id="auto-compare" 
                checked={autoCompare} 
                onCheckedChange={setAutoCompare} 
              />
              <Label htmlFor="auto-compare" className="cursor-pointer flex items-center gap-1">
                <GitCompareArrows className="h-4 w-4" /> Auto Compare
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Automatically compare JSON when content changes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-2">
              <Switch 
                id="auto-scroll" 
                checked={autoScroll} 
                onCheckedChange={setAutoScroll}
                disabled={!autoCompare}
              />
              <Label htmlFor="auto-scroll" className="cursor-pointer flex items-center gap-1">
                <ArrowDownIcon className="h-4 w-4" /> Auto Scroll
              </Label>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Automatically scroll to comparison after JSON changes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AutoCompareToggles;
