
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EscapedJsonViewProps {
  originalJson: string;
  modifiedJson: string;
}

const EscapedJsonView: React.FC<EscapedJsonViewProps> = ({ originalJson, modifiedJson }) => {
  const [selectedSource, setSelectedSource] = useState<'original' | 'modified'>('modified');
  const [escapedJson, setEscapedJson] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const jsonToProcess = selectedSource === 'original' ? originalJson : modifiedJson;
    
    try {
      if (!jsonToProcess.trim()) {
        setEscapedJson('');
        return;
      }
      
      // Parse the JSON to ensure it's valid
      const parsedJson = JSON.parse(jsonToProcess);
      
      // Stringify without indentation to remove whitespace
      const compactJson = JSON.stringify(parsedJson);
      
      setEscapedJson(compactJson);
    } catch (error) {
      console.error('Error processing JSON:', error);
      setEscapedJson('Error: Invalid JSON');
    }
  }, [selectedSource, originalJson, modifiedJson]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(escapedJson).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The escaped JSON has been copied to your clipboard",
      });
    });
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Escaped JSON Output</span>
          <div className="flex items-center space-x-2">
            <Select value={selectedSource} onValueChange={(value: 'original' | 'modified') => setSelectedSource(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select JSON source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="original">Original JSON</SelectItem>
                <SelectItem value="modified">Modified JSON</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              disabled={!escapedJson}
              title="Copy to clipboard"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[150px] rounded-md border">
          <div className="p-4">
            <pre className="text-sm font-mono whitespace-pre-wrap break-all">
              {escapedJson}
            </pre>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default EscapedJsonView;
