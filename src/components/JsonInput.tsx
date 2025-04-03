
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Trash, Copy } from 'lucide-react';

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
    onChange(newValue);
    
    if (newValue.trim() === '') {
      setIsValid(true);
      return;
    }
    
    try {
      // Try to parse as direct JSON first
      JSON.parse(newValue);
      setIsValid(true);
    } catch (e) {
      try {
        // If that fails, try to parse as escaped JSON
        JSON.parse(JSON.parse(`"${newValue.replace(/"/g, '\\"')}"`));
        setIsValid(true);
      } catch (e) {
        setIsValid(false);
      }
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{title}</span>
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
          value={value}
          onChange={handleChange}
          placeholder={placeholder || "Paste your JSON here..."}
          className={`h-[300px] font-mono ${!isValid && value ? 'border-red-500' : ''}`}
        />
      </CardContent>
      <CardFooter>
        {!isValid && value && (
          <p className="text-red-500 text-sm">Invalid JSON format</p>
        )}
      </CardFooter>
    </Card>
  );
};

export default JsonInput;
