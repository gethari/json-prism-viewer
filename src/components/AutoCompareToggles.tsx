import React from 'react';
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useSettings } from '@/contexts/SettingsContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Info } from 'lucide-react';

export function AutoCompareToggles() {
  const { autoCompare, setAutoCompare, autoScroll, setAutoScroll } = useSettings();

  // Combine both toggles to work together
  const handleCombinedToggle = (value: boolean) => {
    setAutoCompare(value);
    setAutoScroll(value);
  };

  const isBothEnabled = autoCompare && autoScroll;

  return (
    <div className="flex items-center justify-between w-full px-1 py-2">
      <div className="flex items-center space-x-2">
        <Switch
          id="auto-features"
          checked={isBothEnabled}
          onCheckedChange={handleCombinedToggle}
        />
        <Label htmlFor="auto-features" className="cursor-pointer">Auto Compare & Scroll</Label>
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info size={14} className="text-muted-foreground" />
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[320px] text-xs">
          When enabled, changes in JSON inputs will automatically trigger comparison
          and scroll both editors in sync.
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
