
import React from 'react';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, Expand, Copy, ArrowLeftRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DiffViewerControlsProps {
  originalJson: string;
  modifiedJson: string;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  openInNewTab: () => void;
}

const DiffViewerControls: React.FC<DiffViewerControlsProps> = ({
  originalJson,
  modifiedJson,
  increaseFontSize,
  decreaseFontSize,
  openInNewTab
}) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `The ${type} JSON has been copied to your clipboard`,
      });
    });
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={decreaseFontSize}
          title="Decrease font size"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={increaseFontSize}
          title="Increase font size"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={openInNewTab}
          title="Open in new tab for better viewing"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute top-4 right-4 z-10 flex space-x-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => copyToClipboard(originalJson, 'original')}
          className="h-8 w-8 bg-white/90 dark:bg-gray-800/90"
          title="Copy original JSON"
        >
          <Copy className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => copyToClipboard(modifiedJson, 'modified')}
          className="h-8 w-8 bg-white/90 dark:bg-gray-800/90"
          title="Copy modified JSON"
        >
          <ArrowLeftRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default DiffViewerControls;
