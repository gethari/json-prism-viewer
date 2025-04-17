
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash, Copy, Info } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface JsonInputProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const JsonInput: React.FC<JsonInputProps> = ({ title, value, onChange, placeholder }) => {
  const { toast } = useToast();
  const [isValid, setIsValid] = useState(true);
  const [textareaValue, setTextareaValue] = useState(value);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextareaValue(newValue);
    
    // If the textarea is empty, just clear without validation
    if (!newValue.trim()) {
      setIsValid(true);
      onChange('');
      return;
    }
    
    validateJson(newValue);
  };

  const validateJson = (jsonString: string) => {
    const result = parseJsonSafely(jsonString);
    setIsValid(result.isValid);
    if (result.isValid && result.parsedValue) {
      onChange(result.parsedValue);
    }
  };

  const parseJsonSafely = (input: string) => {
    if (!input.trim()) {
      return { isValid: true, parsed: false, parsedValue: '' };
    }

    // Approach 1: Direct parsing (for valid JSON)
    try {
      const parsed = JSON.parse(input);
      return { isValid: true, parsed: true, parsedValue: JSON.stringify(parsed, null, 2) };
    } catch (e) {
      // Continue to other approaches if direct parsing fails
    }
    
    // Approach 2: For escaped JSON strings with escaped quotes like {\"key\":\"value\"}
    try {
      // Replace escaped quotes with actual quotes
      const fixedJson = input.replace(/\\"/g, '"');
      const parsed = JSON.parse(fixedJson);
      return { isValid: true, parsed: true, parsedValue: JSON.stringify(parsed, null, 2) };
    } catch (e) {
      // Continue to other approaches if this fails
    }
    
    // Approach 3: For JSON strings that need to be unescaped first
    try {
      // Try to parse as a JSON string (with outer quotes)
      const unescaped = JSON.parse(`"${input.replace(/"/g, '\\"')}"`);
      try {
        const parsed = JSON.parse(unescaped);
        return { isValid: true, parsed: true, parsedValue: JSON.stringify(parsed, null, 2) };
      } catch (e) {
        // If unescaped string isn't valid JSON
      }
    } catch (e) {
      // Not a valid JSON string that can be unescaped
    }
    
    // Approach 4: Some APIS might double-escape the JSON
    try {
      const doubleUnescaped = input.replace(/\\\\/g, '\\').replace(/\\"/g, '"');
      const parsed = JSON.parse(doubleUnescaped);
      return { isValid: true, parsed: true, parsedValue: JSON.stringify(parsed, null, 2) };
    } catch (e) {
      // All approaches failed
    }
    
    return { isValid: false, parsed: false, parsedValue: null };
  };

  const handleClear = () => {
    setTextareaValue('');
    onChange('');
    setIsValid(true);
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
      toast({
        title: "JSON Formatted",
        description: "Pasted JSON has been automatically formatted",
      });
    }
  };

  // Update textareaValue when the parent component updates the value prop
  React.useEffect(() => {
    setTextareaValue(value);
  }, [value]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>{title}</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>JSON will be automatically processed for comparison. You can paste escaped or unescaped JSON.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleCopy} 
              disabled={!value}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleClear} 
              disabled={!value}
              title="Clear"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={textareaValue}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder={placeholder || "Paste your JSON here..."}
          className={`h-[300px] font-mono ${!isValid && textareaValue ? 'border-red-500' : ''}`}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        {!isValid && textareaValue && (
          <p className="text-red-500 text-sm">Invalid JSON format</p>
        )}
        <p className="text-muted-foreground text-xs mt-2">
          JSON will be automatically processed for comparison. Paste any valid JSON, escaped or unescaped.
        </p>
      </CardFooter>
    </Card>
  );
};

export default JsonInput;
