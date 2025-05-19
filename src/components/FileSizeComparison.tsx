
import React from 'react';
import { Button } from './ui/button';
import { FileBarChart } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface FileSizeComparisonProps {
  originalSize: number;
  modifiedSize: number;
}

const FileSizeComparison: React.FC<FileSizeComparisonProps> = ({
  originalSize,
  modifiedSize
}) => {
  const calculateDifference = (): {
    difference: number;
    percentChange: number;
    increased: boolean;
  } => {
    const difference = modifiedSize - originalSize;
    const increased = difference > 0;
    
    // Calculate percentage change
    let percentChange = 0;
    if (originalSize > 0) {
      percentChange = Math.abs((difference / originalSize) * 100);
    } else if (modifiedSize > 0) {
      percentChange = 100; // When original is 0 and modified is not
    }
    
    return {
      difference: Math.abs(difference),
      percentChange,
      increased
    };
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  const { difference, percentChange, increased } = calculateDifference();
  
  // Don't show anything if both sizes are 0
  if (originalSize === 0 && modifiedSize === 0) {
    return null;
  }
  
  const tooltipContent = () => {
    if (originalSize === modifiedSize) {
      return "Both JSON files are exactly the same size";
    }
    
    const changeText = increased ? "increased" : "decreased";
    return `Modified JSON has ${changeText} by ${formatFileSize(difference)} (${percentChange.toFixed(1)}%)`;
  };

  const getChangeColorClass = () => {
    if (originalSize === modifiedSize) return "text-blue-500 dark:text-blue-400";
    return increased ? "text-red-500 dark:text-red-400" : "text-green-500 dark:text-green-400";
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-1 ${getChangeColorClass()}`}
        >
          <FileBarChart className="h-4 w-4" />
          <span className="text-xs">
            Size: {increased ? '+' : '-'}{formatFileSize(difference)} ({percentChange.toFixed(1)}%)
          </span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p className="text-sm">{tooltipContent()}</p>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="text-xs">
            <span className="font-semibold">Original:</span> {formatFileSize(originalSize)}
          </div>
          <div className="text-xs">
            <span className="font-semibold">Modified:</span> {formatFileSize(modifiedSize)}
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

export default FileSizeComparison;
