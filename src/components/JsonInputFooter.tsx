
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext';

interface JsonInputFooterProps {
  isValid: boolean;
  hasValue: boolean;
}

const JsonInputFooter: React.FC<JsonInputFooterProps> = ({ 
  isValid,
  hasValue,
}) => {
  const { autoCompare } = useSettings();

  return (
    <CardFooter className="flex flex-col items-start">
      {!isValid && hasValue && (
        <p className="text-red-500 text-sm">Invalid JSON format</p>
      )}
      <p className="text-muted-foreground text-xs mt-2">
        JSON will be automatically processed for comparison. Paste any valid JSON, escaped or unescaped.
        {autoCompare ? " Auto-compare is enabled." : ""}
      </p>
    </CardFooter>
  );
};

export default JsonInputFooter;
