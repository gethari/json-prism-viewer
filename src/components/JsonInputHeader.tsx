
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Trash, Copy, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface JsonInputHeaderProps {
  title: string;
  value: string;
  onCopy: () => void;
  onClear: () => void;
  disabled: boolean;
}

const JsonInputHeader: React.FC<JsonInputHeaderProps> = ({
  title,
  value,
  onCopy,
  onClear,
  disabled,
}) => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span>{title}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>JSON will be automatically processed for comparison. You can paste escaped or unescaped JSON.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onCopy} 
            disabled={!value || disabled}
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={onClear} 
            disabled={!value || disabled}
            title="Clear"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardTitle>
    </CardHeader>
  );
};

export default JsonInputHeader;
