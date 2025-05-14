import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSettings, UnicodeQuoteOption } from '@/contexts/SettingsContext';
import { Separator } from '@/components/ui/separator';

export function UnicodeEscapeSettings() {
  const { 
    unicodeQuoteEscaping, 
    setUnicodeQuoteEscaping,
    escapeKeysInJson,
    setEscapeKeysInJson
  } = useSettings();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Unicode Quote Escaping</CardTitle>
        <CardDescription>
          Configure how quotes are escaped in JSON output
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="quote-escaping">Escape Mode</Label>
          <Select 
            value={unicodeQuoteEscaping} 
            onValueChange={(value) => setUnicodeQuoteEscaping(value as UnicodeQuoteOption)}
          >
            <SelectTrigger id="quote-escaping" className="w-full">
              <SelectValue placeholder="Select quote escaping mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None (No escaping)</SelectItem>
              <SelectItem value="single">Single Quotes Only (\')</SelectItem>
              <SelectItem value="both">Both Single and Double Quotes (\', \")</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">
            {unicodeQuoteEscaping === 'none' && "Keep all quotes in their original form"}
            {unicodeQuoteEscaping === 'single' && "Replace single quotes (') with Unicode escape (\\u0027)"}
            {unicodeQuoteEscaping === 'both' && "Replace both single (') and double (\") quotes with Unicode escapes"}
          </p>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="escape-keys">Escape Keys</Label>
            <p className="text-sm text-muted-foreground">
              Apply Unicode escaping to object keys as well as values
            </p>
          </div>
          <Switch
            id="escape-keys"
            checked={escapeKeysInJson}
            onCheckedChange={setEscapeKeysInJson}
          />
        </div>
      </CardContent>
    </Card>
  );
}
