import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Trash, Copy, Clipboard, Info } from 'lucide-react';
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

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    // Attempt to auto-escape the JSON if needed
    let processedValue = newValue;
    if (newValue.trim() !== '') {
      processedValue = newValue;
    }
    
    onChange(processedValue);
    
    if (processedValue.trim() === '') {
      setIsValid(true);
      return;
    }
    
    validateJson(processedValue);
  };

  const validateJson = (jsonString: string) => {
    // Try various ways to parse the JSON
    const result = parseJsonSafely(jsonString);
    setIsValid(result.isValid);
  };

  // Helper function that tries multiple approaches to parse JSON
  const parseJsonSafely = (input: string) => {
    // Approach 1: Direct parsing (for valid JSON)
    try {
      JSON.parse(input);
      return { isValid: true, parsed: true };
    } catch (e) {
      // Continue to other approaches
    }
    
    // Approach 2: For escaped JSON strings with escaped quotes like {\"key\":\"value\"}
    try {
      const fixedJson = input.replace(/\\"/g, '"');
      JSON.parse(fixedJson);
      return { isValid: true, parsed: true };
    } catch (e) {
      // Continue to other approaches
    }
    
    // Approach 3: For JSON strings that need to be unescaped first
    try {
      // Try to parse as a JSON string (with outer quotes)
      const unescaped = JSON.parse(`"${input.replace(/"/g, '\\"')}"`);
      try {
        JSON.parse(unescaped);
        return { isValid: true, parsed: true };
      } catch (e) {
        // The unescaped string is not valid JSON
      }
    } catch (e) {
      // Not a valid JSON string that can be unescaped
    }
    
    // If we've tried all approaches and none worked, it's invalid
    return { isValid: false, parsed: false };
  };

  const tryAutoEscapeJson = (input: string): string => {
    return input; // We'll keep the input as is and focus on validation
  };

  const handleClear = () => {
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

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      
      if (text.trim() === '') {
        toast({
          variant: "destructive",
          title: "Empty clipboard",
          description: "Your clipboard is empty",
        });
        return;
      }
      
      onChange(text);
      validateJson(text);
      
      const result = parseJsonSafely(text);
      if (result.isValid) {
        toast({
          title: "Valid JSON imported",
          description: "Content has been pasted and validated successfully",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Invalid JSON format",
          description: "The pasted content is not a valid JSON in any format",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Clipboard Error",
        description: "Failed to read from clipboard. Make sure you've granted permission.",
      });
    }
  };

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
        <div className="mb-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={pasteFromClipboard}
            className="w-full flex justify-center"
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Import from Clipboard
          </Button>
        </div>
        <Textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder || "Paste your JSON here..."}
          className={`h-[300px] font-mono ${!isValid && value ? 'border-red-500' : ''}`}
        />
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        {!isValid && value && (
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
