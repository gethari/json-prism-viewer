
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowDownToLine,
  ArrowsUpDown,
  Copy,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import FileSizeComparison from './FileSizeComparison';

interface JsonCompareToolbarProps {
  originalJson: string;
  modifiedJson: string;
  setOriginalJson: (json: string) => void;
  setModifiedJson: (json: string) => void;
  setShowDiff: (show: boolean) => void;
}

const JsonCompareToolbar: React.FC<JsonCompareToolbarProps> = ({
  originalJson,
  modifiedJson,
  setOriginalJson,
  setModifiedJson,
  setShowDiff,
}) => {
  const { toast } = useToast();
  const { autoCompare } = useSettings();
  
  const handleCompare = () => {
    if (!originalJson.trim() || !modifiedJson.trim()) {
      toast({
        title: "Missing input",
        description: "Please provide both original and modified JSON data.",
        variant: "destructive",
      });
      return;
    }
    
    setShowDiff(true);
    toast({
      title: "Comparing JSON",
      description: "Displaying the difference between the two JSON inputs.",
    });
  };
  
  const handleClear = () => {
    setOriginalJson('');
    setModifiedJson('');
    setShowDiff(false);
    toast({
      title: "Content cleared",
      description: "Both JSON inputs have been cleared.",
    });
  };
  
  const handleSwap = () => {
    const temp = originalJson;
    setOriginalJson(modifiedJson);
    setModifiedJson(temp);
    toast({
      title: "Inputs swapped",
      description: "Original and modified JSON have been swapped.",
    });
  };
  
  // Calculate file sizes in bytes
  const getByteSize = (str: string): number => {
    if (!str) return 0;
    return new Blob([str]).size;
  };
  
  const originalSize = getByteSize(originalJson);
  const modifiedSize = getByteSize(modifiedJson);
  
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2 justify-between">
      <div className="flex flex-wrap items-center gap-2">
        <Button 
          onClick={handleCompare}
          disabled={!originalJson || !modifiedJson || autoCompare}
        >
          <Copy className="mr-2 h-4 w-4" /> Compare
        </Button>
        <Button 
          variant="outline" 
          onClick={handleSwap}
          disabled={!originalJson && !modifiedJson}
        >
          <ArrowsUpDown className="mr-2 h-4 w-4" /> Swap
        </Button>
        <Button 
          variant="outline" 
          onClick={handleClear}
          disabled={!originalJson && !modifiedJson}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Clear All
        </Button>
        <FileSizeComparison 
          originalSize={originalSize}
          modifiedSize={modifiedSize}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          title="Download JSON comparison report"
        >
          <ArrowDownToLine className="mr-2 h-4 w-4" /> Export
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setShowDiff(false);
            setTimeout(() => setShowDiff(true), 100);
          }}
          title="Refresh comparison view"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>
    </div>
  );
};

export default JsonCompareToolbar;
