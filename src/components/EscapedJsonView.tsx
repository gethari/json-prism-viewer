
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { createJsonOutputFormats } from '@/utils/jsonFormatter';

interface EscapedJsonViewProps {
  originalJson: string;
  modifiedJson: string;
}

const EscapedJsonView: React.FC<EscapedJsonViewProps> = ({ originalJson, modifiedJson }) => {
  const [selectedSource, setSelectedSource] = useState<'original' | 'modified'>('modified');
  const [jsonOutput, setJsonOutput] = useState<{
    compact: string;
    escaped: string;
  }>({ compact: '', escaped: '' });
  const { toast } = useToast();

  useEffect(() => {
    const jsonToProcess = selectedSource === 'original' ? originalJson : modifiedJson;
    
    try {
      if (!jsonToProcess.trim()) {
        setJsonOutput({ compact: '', escaped: '' });
        return;
      }
      
      const outputs = createJsonOutputFormats(jsonToProcess);
      setJsonOutput(outputs);
      
    } catch (error) {
      console.error('Error processing JSON:', error);
      setJsonOutput({ 
        compact: 'Error: Invalid JSON', 
        escaped: 'Error: Invalid JSON'
      });
    }
  }, [selectedSource, originalJson, modifiedJson]);

  const copyToClipboard = (content: string, label: string) => {
    navigator.clipboard.writeText(content).then(() => {
      toast({
        title: "Copied to clipboard",
        description: `The ${label} JSON has been copied to your clipboard`,
      });
    });
  };

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>JSON Output Formats</span>
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
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="compact">
          <TabsList className="mb-4">
            <TabsTrigger value="compact">Compact JSON</TabsTrigger>
            <TabsTrigger value="escaped">Escaped JSON</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compact">
            <div className="flex justify-end mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(jsonOutput.compact, "compact")}
                disabled={!jsonOutput.compact}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            </div>
            <ScrollArea className="h-[150px] rounded-md border">
              <div className="p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                  {jsonOutput.compact}
                </pre>
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="escaped">
            <div className="flex justify-end mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(jsonOutput.escaped, "escaped")}
                disabled={!jsonOutput.escaped}
                title="Copy to clipboard"
              >
                <Copy className="h-4 w-4 mr-2" /> Copy
              </Button>
            </div>
            <ScrollArea className="h-[150px] rounded-md border">
              <div className="p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap break-all">
                  {jsonOutput.escaped}
                </pre>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EscapedJsonView;
