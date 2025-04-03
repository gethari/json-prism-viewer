
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
      processedValue = tryAutoEscapeJson(newValue);
    }
    
    onChange(processedValue);
    
    if (processedValue.trim() === '') {
      setIsValid(true);
      return;
    }
    
    validateJson(processedValue);
  };

  const validateJson = (jsonString: string) => {
    try {
      // Try to parse as direct JSON first
      JSON.parse(jsonString);
      setIsValid(true);
    } catch (e1) {
      try {
        // If that fails, try to parse as escaped JSON by unescaping it first
        const unescaped = JSON.parse(`"${jsonString.replace(/"/g, '\\"')}"`);
        try {
          // Check if the unescaped string is valid JSON
          JSON.parse(unescaped);
          setIsValid(true);
        } catch (e2) {
          // If already escaped JSON with double escaped quotes like {\"key\":\"value\"}
          // Let's try one more approach
          try {
            // Replace escaped quotes with actual quotes and try parsing
            const fixedJson = jsonString.replace(/\\"/g, '"');
            JSON.parse(fixedJson);
            setIsValid(true);
          } catch (e3) {
            setIsValid(false);
          }
        }
      } catch (e) {
        setIsValid(false);
      }
    }
  };

  const tryAutoEscapeJson = (input: string): string => {
    // Try parsing as direct JSON first
    try {
      JSON.parse(input);
      return input; // Already valid JSON, return as is
    } catch (e1) {
      // Not valid direct JSON, try other formats
      
      // Try to see if it's an escaped JSON string
      try {
        const unescaped = JSON.parse(`"${input.replace(/"/g, '\\"')}"`);
        try {
          // Check if the unescaped string is valid JSON
          JSON.parse(unescaped);
          return input; // Already in a valid escaped format
        } catch (e) {
          // The unescaped string is not valid JSON
        }
      } catch (e2) {
        // Not a valid JSON string that can be unescaped
        
        // Check if it's an already escaped JSON with escaped quotes like {\"key\":\"value\"}
        try {
          // Replace escaped quotes with actual quotes and try parsing
          const fixedJson = input.replace(/\\"/g, '"');
          JSON.parse(fixedJson);
          return input; // It's valid when fixed, return as is since we'll fix during processing
        } catch (e3) {
          // Not a valid JSON even with quote fixing
        }
      }
      
      // Not valid JSON in any format, return as is
      return input;
    }
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
      
      // Try to auto-escape if needed
      const processedText = tryAutoEscapeJson(text);
      
      onChange(processedText);
      validateJson(processedText);
      
      toast({
        title: "Imported from clipboard",
        description: "Content has been pasted and automatically processed",
      });
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
