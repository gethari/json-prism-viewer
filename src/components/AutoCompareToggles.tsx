
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { useSettings } from '@/contexts/SettingsContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GitCompare, ArrowDown } from 'lucide-react';

const AutoCompareToggles: React.FC = () => {
  const { autoCompare, setAutoCompare, autoScroll, setAutoScroll } = useSettings();

  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              aria-label="Toggle auto-compare"
              pressed={autoCompare}
              onPressedChange={setAutoCompare}
              className="flex items-center"
            >
              <GitCompare className="h-4 w-4 mr-1" />
              <span className="text-xs">Auto-compare</span>
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Automatically compare JSON when both are provided</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              aria-label="Toggle auto-scroll"
              pressed={autoScroll}
              onPressedChange={setAutoScroll}
              className="flex items-center"
            >
              <ArrowDown className="h-4 w-4 mr-1" />
              <span className="text-xs">Auto-scroll</span>
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Automatically scroll to comparison results</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AutoCompareToggles;
