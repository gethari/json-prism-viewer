
import React, { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSettings } from '@/contexts/SettingsContext';
import { parseJsonSafely } from '@/utils/jsonFormatter';
import JsonInputHeader from './JsonInputHeader';
import JsonInputFooter from './JsonInputFooter';

interface JsonInputProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const JsonInput: React.FC<JsonInputProps> = ({
  title,
  value,
  onChange,
  placeholder,
  disabled = false,
  className,
}) => {
  const { toast } = useToast();
  const [isValid, setIsValid] = useState(true);
  const [textareaValue, setTextareaValue] = useState(value);
  const [fileSize, setFileSize] = useState(0);
  const { autoCompare } = useSettings();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextareaValue(newValue);
    
    // If the textarea is empty, just clear without validation
    if (!newValue.trim()) {
      setIsValid(true);
      onChange('');
      setFileSize(0);
      return;
    }
    
    validateJson(newValue);
    calculateSize(newValue);
  };

  const validateJson = (jsonString: string) => {
    const result = parseJsonSafely(jsonString);
    setIsValid(result.isValid);
    if (result.isValid && result.parsedValue) {
      onChange(result.parsedValue);
    }
  };

  const calculateSize = (text: string) => {
    // Calculate size in bytes (2 bytes per character in JavaScript strings)
    const size = new Blob([text]).size;
    setFileSize(size);
  };

  const handleClear = () => {
    setTextareaValue('');
    onChange('');
    setIsValid(true);
    setFileSize(0);
  };

  const handleCopy = () => {
    if (!value) return;
    
    navigator.clipboard.writeText(value).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The JSON has been copied to your clipboard",
      });
    });
  };

  // Handle pasting to allow multiple formats
  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText.trim()) return;
    
    const result = parseJsonSafely(pastedText);
    if (result.isValid && result.parsedValue) {
      e.preventDefault(); // Prevent default paste to handle it ourselves
      setTextareaValue(result.parsedValue);
      setIsValid(true);
      onChange(result.parsedValue);
      calculateSize(result.parsedValue);
      
      const statusMessage = autoCompare ? "JSON formatted and will be automatically compared" : "JSON formatted. Click Compare to view differences";
      toast({
        title: "JSON Formatted",
        description: statusMessage,
      });
    }
  };

  // Format the file size for display
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

  // Update textareaValue when the parent component updates the value prop
  useEffect(() => {
    setTextareaValue(value);
    calculateSize(value);
  }, [value]);

  return (
    <Card className={`w-full ${className || ''}`}>
      <JsonInputHeader 
        title={title}
        value={value}
        onCopy={handleCopy}
        onClear={handleClear}
        disabled={disabled}
        fileSize={formatFileSize(fileSize)}
      />
      <CardContent>
        <Textarea
          value={textareaValue}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder={placeholder || "Paste your JSON here..."}
          className={`h-[300px] font-mono ${!isValid && textareaValue ? 'border-red-500' : ''}`}
          disabled={disabled}
        />
      </CardContent>
      <JsonInputFooter 
        isValid={isValid}
        hasValue={!!textareaValue}
      />
    </Card>
  );
};

export default JsonInput;
