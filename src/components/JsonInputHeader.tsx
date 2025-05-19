
import React from 'react';
import { CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, X } from 'lucide-react';

interface JsonInputHeaderProps {
  title: string;
  value: string;
  onCopy: () => void;
  onClear: () => void;
  disabled?: boolean;
  fileSize?: string;
}

const JsonInputHeader: React.FC<JsonInputHeaderProps> = ({
  title,
  value,
  onCopy,
  onClear,
  disabled = false,
  fileSize = ''
}) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b bg-muted/30">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <h3 className="text-sm font-medium flex-shrink-0">{title}</h3>
        {fileSize && <span className="text-xs text-muted-foreground font-mono">({fileSize})</span>}
      </div>
      <div className="flex items-center space-x-1">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCopy}
          disabled={disabled || !value}
          title="Copy to clipboard"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClear}
          disabled={disabled || !value}
          title="Clear content"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </CardHeader>
  );
};

export default JsonInputHeader;
