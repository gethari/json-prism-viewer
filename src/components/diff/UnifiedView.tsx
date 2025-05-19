
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import DiffChangeSummary from './DiffChangeSummary';
import DiffLegend from './DiffLegend';
import { FileBarChart } from 'lucide-react';

interface UnifiedViewProps {
  changes: any;
  originalSize?: number;
  modifiedSize?: number;
}

const UnifiedView: React.FC<UnifiedViewProps> = ({ 
  changes,
  originalSize,
  modifiedSize
}) => {
  // Function to format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0 || bytes === undefined) return '0 B';
    
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
  };
  
  // Calculate size difference if both sizes are provided
  const renderSizeDifference = () => {
    if (originalSize === undefined || modifiedSize === undefined) return null;
    
    const difference = modifiedSize - originalSize;
    const increased = difference > 0;
    
    let percentChange = 0;
    if (originalSize > 0) {
      percentChange = Math.abs((difference / originalSize) * 100);
    } else if (modifiedSize > 0) {
      percentChange = 100;
    }
    
    const differenceText = increased ? '+' : '-';
    const colorClass = increased 
      ? "text-red-500 dark:text-red-400" 
      : "text-green-500 dark:text-green-400";
    
    return (
      <div className="flex items-center gap-2 text-sm mt-2 mb-4">
        <FileBarChart className="h-4 w-4 text-blue-500" />
        <div>
          <span className="font-semibold">Size comparison: </span>
          <span>Original: {formatFileSize(originalSize)}</span>
          <span className="mx-2">→</span>
          <span>Modified: {formatFileSize(modifiedSize)}</span>
          <span className="mx-2">|</span>
          <span className={`font-mono ${colorClass}`}>
            {differenceText}{formatFileSize(Math.abs(difference))} ({percentChange.toFixed(1)}%)
          </span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="relative">
      <ScrollArea className="h-[500px] rounded-md border">
        <div className="p-4">
          {renderSizeDifference()}
          <DiffChangeSummary changes={changes} />
          <DiffLegend />
        </div>
      </ScrollArea>
    </div>
  );
};

export default UnifiedView;
