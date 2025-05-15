
import React from 'react';
import { Toggle } from '@/components/ui/toggle';
import { useSettings } from '@/contexts/SettingsContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GitCompare } from 'lucide-react';

const AutoCompareToggles: React.FC = () => {
  const { autoCompare, setAutoCompare, autoScroll, setAutoScroll } = useSettings();

  const handleToggleChange = (pressed: boolean) => {
    setAutoCompare(pressed);
    setAutoScroll(pressed);
  };

  return (
    <div className="flex space-x-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Toggle
              aria-label="Toggle auto-compare and auto-scroll"
              pressed={autoCompare}
              onPressedChange={handleToggleChange}
              className="flex items-center"
            >
              <GitCompare className="h-4 w-4 mr-1" />
              <span className="text-xs">Auto-compare & Scroll</span>
            </Toggle>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Automatically compare JSON and scroll to results when both inputs are provided</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default AutoCompareToggles;
