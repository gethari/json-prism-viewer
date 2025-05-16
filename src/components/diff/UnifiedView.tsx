
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import DiffChangeSummary from './DiffChangeSummary';
import DiffLegend from './DiffLegend';

interface UnifiedViewProps {
  changes: any;
}

const UnifiedView: React.FC<UnifiedViewProps> = ({ changes }) => {
  return (
    <div className="relative">
      <ScrollArea className="h-[500px] rounded-md border">
        <div className="p-4">
          <DiffChangeSummary changes={changes} />
          <DiffLegend />
        </div>
      </ScrollArea>
    </div>
  );
};

export default UnifiedView;
