
#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

interface JsonArrayItem {
  Category: string;
  Name: string;
  Value: string; // Escaped JSON string
}

interface TransformedItem {
  key: string;
  category: string;
  name: string;
  value: any; // Parsed JSON object
  original: JsonArrayItem;
}

interface ChangeDetection {
  type: 'added' | 'removed' | 'modified';
  key: string;
  category: string;
  name: string;
  before?: any;
  after?: any;
  beforeItem?: JsonArrayItem;
  afterItem?: JsonArrayItem;
}

/**
 * Safely parse escaped JSON value
 */
function parseEscapedJson(escapedJsonString: string): any {
  try {
    return JSON.parse(escapedJsonString);
  } catch (error) {
    console.error(`Failed to parse escaped JSON: ${escapedJsonString}`, error);
    return null;
  }
}

/**
 * Transform raw JSON array into normalized structure
 */
function transformData(rawArray: JsonArrayItem[]): TransformedItem[] {
  return rawArray
    .map(item => {
      const parsedValue = parseEscapedJson(item.Value);
      if (parsedValue === null) {
        console.warn(`Skipping item with invalid JSON: ${item.Category}-${item.Name}`);
        return null;
      }
      
      return {
        key: `${item.Category}-${item.Name}`,
        category: item.Category,
        name: item.Name,
        value: parsedValue,
        original: item
      };
    })
    .filter((item): item is TransformedItem => item !== null);
}

/**
 * Find changes between two arrays
 */
function findChanges(beforeArray: TransformedItem[], afterArray: TransformedItem[]): ChangeDetection[] {
  const beforeMap = new Map(beforeArray.map(item => [item.key, item]));
  const afterMap = new Map(afterArray.map(item => [item.key, item]));
  
  const changes: ChangeDetection[] = [];
  
  // Find modifications and additions
  for (const [key, afterItem] of afterMap) {
    const beforeItem = beforeMap.get(key);
    
    if (!beforeItem) {
      // Added item
      changes.push({
        type: 'added',
        key,
        category: afterItem.category,
        name: afterItem.name,
        after: afterItem.value,
        afterItem: afterItem.original
      });
    } else if (JSON.stringify(beforeItem.value) !== JSON.stringify(afterItem.value)) {
      // Modified item
      changes.push({
        type: 'modified',
        key,
        category: afterItem.category,
        name: afterItem.name,
        before: beforeItem.value,
        after: afterItem.value,
        beforeItem: beforeItem.original,
        afterItem: afterItem.original
      });
    }
  }
  
  // Find removals
  for (const [key, beforeItem] of beforeMap) {
    if (!afterMap.has(key)) {
      changes.push({
        type: 'removed',
        key,
        category: beforeItem.category,
        name: beforeItem.name,
        before: beforeItem.value,
        beforeItem: beforeItem.original
      });
    }
  }
  
  return changes;
}

/**
 * Encode JSON object to base64 for URL parameters
 */
function encodeJsonForUrl(jsonObj: any): string {
  try {
    const jsonString = JSON.stringify(jsonObj, null, 2);
    return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonString))));
  } catch (error) {
    console.error('Error encoding JSON for URL:', error);
    return '';
  }
}

/**
 * Generate comparison URL for the tool
 */
function generateComparisonUrl(beforeJson: any, afterJson: any, baseUrl: string): string {
  const beforeParam = encodeJsonForUrl(beforeJson);
  const afterParam = encodeJsonForUrl(afterJson);
  
  return `${baseUrl}?before=${beforeParam}&after=${afterParam}#/json-compare`;
}

/**
 * Generate markdown comment for PR
 */
function generatePRComment(changes: ChangeDetection[], baseUrl: string): string {
  if (changes.length === 0) {
    return '## 🔍 JSON Comparison Analysis\n\nNo changes detected in JSON data.';
  }
  
  let comment = '## 🔍 JSON Comparison Analysis\n\n';
  comment += `Found **${changes.length}** change(s) in your JSON data:\n\n`;
  
  changes.forEach((change, index) => {
    const diffNum = index + 1;
    comment += `### Diff ${diffNum}: ${change.category} - ${change.name}\n`;
    comment += `**Type:** ${change.type.charAt(0).toUpperCase() + change.type.slice(1)}\n`;
    
    let beforeJson: any = {};
    let afterJson: any = {};
    
    switch (change.type) {
      case 'added':
        beforeJson = {};
        afterJson = change.after;
        comment += `**Status:** New item added\n`;
        break;
      case 'removed':
        beforeJson = change.before;
        afterJson = {};
        comment += `**Status:** Item removed\n`;
        break;
      case 'modified':
        beforeJson = change.before;
        afterJson = change.after;
        comment += `**Status:** Item modified\n`;
        break;
    }
    
    const comparisonUrl = generateComparisonUrl(beforeJson, afterJson, baseUrl);
    comment += `[📊 View Detailed Comparison](${comparisonUrl})\n\n`;
  });
  
  comment += '---\n';
  comment += `*Analysis completed at ${new Date().toISOString()}*\n`;
  comment += '*Click on the comparison links above to see detailed before/after diffs.*';
  
  return comment;
}

/**
 * Main function
 */
async function main() {
  try {
    const beforeFile = process.argv[2];
    const afterFile = process.argv[3];
    const baseUrl = process.argv[4] || 'https://your-comparison-tool.com';
    const outputFile = process.argv[5] || 'pr-comment.md';
    
    if (!beforeFile || !afterFile) {
      console.error('Usage: node analyze-json-changes.js <before-file> <after-file> [base-url] [output-file]');
      process.exit(1);
    }
    
    // Read and parse JSON files - FIXED: Proper JSON parsing
    const beforeRaw = fs.readFileSync(beforeFile, 'utf8');
    const afterRaw = fs.readFileSync(afterFile, 'utf8');
    
    console.log(`Raw before data type: ${typeof beforeRaw}`);
    console.log(`Raw after data type: ${typeof afterRaw}`);
    
    const beforeData: JsonArrayItem[] = JSON.parse(beforeRaw);
    const afterData: JsonArrayItem[] = JSON.parse(afterRaw);
    
    console.log(`Analyzing changes between ${beforeFile} and ${afterFile}`);
    console.log(`Before: ${beforeData.length} items, After: ${afterData.length} items`);
    
    // Transform data
    const beforeTransformed = transformData(beforeData);
    const afterTransformed = transformData(afterData);
    
    console.log(`Successfully parsed: Before: ${beforeTransformed.length} items, After: ${afterTransformed.length} items`);
    
    // Find changes
    const changes = findChanges(beforeTransformed, afterTransformed);
    
    console.log(`Found ${changes.length} changes`);
    changes.forEach(change => {
      console.log(`  - ${change.type}: ${change.category}-${change.name}`);
    });
    
    // Generate PR comment
    const prComment = generatePRComment(changes, baseUrl);
    
    // Write output
    fs.writeFileSync(outputFile, prComment);
    console.log(`PR comment written to ${outputFile}`);
    
    // Also output summary for GitHub Actions
    console.log(`::set-output name=changes_count::${changes.length}`);
    console.log(`::set-output name=has_changes::${changes.length > 0}`);
    
  } catch (error) {
    console.error('Error analyzing JSON changes:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
