
/**
 * Utilities for handling JSON data in the application
 */

/**
 * Attempts to parse JSON from various formats
 * Handles raw JSON, escaped JSON strings, and stringified JSON
 */
export function parseJson(input: string): any {
  if (!input || !input.trim()) {
    return null;
  }
  
  try {
    // First, try direct parsing
    return JSON.parse(input);
  } catch (e) {
    try {
      // If that fails, try unescaping then parsing
      const unescaped = JSON.parse(`"${input.replace(/"/g, '\\"')}"`);
      return JSON.parse(unescaped);
    } catch (e2) {
      // Second, try to fix common JSON errors
      try {
        // Sometimes JSON has trailing commas
        const fixedInput = input
          .replace(/,\s*}/g, '}')  // Remove trailing commas in objects
          .replace(/,\s*\]/g, ']'); // Remove trailing commas in arrays
        return JSON.parse(fixedInput);
      } catch (e3) {
        // Third, try handling single quotes
        try {
          const singleQuotesFixed = input
            .replace(/'/g, '"')  // Replace single quotes with double quotes
            .replace(/([a-zA-Z0-9_]+):/g, '"$1":'); // Add quotes to keys
          return JSON.parse(singleQuotesFixed);
        } catch (e4) {
          console.error("Failed to parse JSON:", e4);
          return null;
        }
      }
    }
  }
}

/**
 * Format JSON string with proper indentation
 */
export function formatJson(json: string): string {
  const parsed = parseJson(json);
  if (parsed === null) {
    return json; // Return original if parsing failed
  }
  return JSON.stringify(parsed, null, 2);
}

/**
 * Safely stringifies a value to JSON
 */
export function safeStringify(value: any, space = 2): string {
  try {
    return JSON.stringify(value, replacer, space);
  } catch (e) {
    console.error("Error stringifying value:", e);
    return "";
  }
}

/**
 * Custom replacer function for JSON.stringify to handle circular references
 */
function replacer(key: string, value: any): any {
  if (typeof value === 'object' && value !== null) {
    // Handle circular reference
    const seen = new WeakSet();
    return (function replaceValue(currentValue: any) {
      if (typeof currentValue === 'object' && currentValue !== null) {
        if (seen.has(currentValue)) {
          return '[Circular Reference]';
        }
        seen.add(currentValue);
        
        if (Array.isArray(currentValue)) {
          return currentValue.map(v => replaceValue(v));
        } else {
          const result: Record<string, any> = {};
          for (const k in currentValue) {
            if (Object.prototype.hasOwnProperty.call(currentValue, k)) {
              result[k] = replaceValue(currentValue[k]);
            }
          }
          return result;
        }
      }
      return currentValue;
    })(value);
  }
  return value;
}

/**
 * Detects if the input is valid JSON
 */
export function isValidJson(input: string): boolean {
  return parseJson(input) !== null;
}

/**
 * Computes the difference between two JSON objects
 * Returns an object with properties:
 * - additions: keys present in modified but not in original
 * - deletions: keys present in original but not in modified
 * - changes: keys present in both but with different values
 */
export function computeJsonDiff(originalJson: string, modifiedJson: string): {
  additions: string[];
  deletions: string[];
  changes: string[];
} {
  try {
    const original = parseJson(originalJson || '{}');
    const modified = parseJson(modifiedJson || '{}');
    
    if (!original || !modified) {
      return {
        additions: [],
        deletions: [],
        changes: []
      };
    }
    
    const originalKeys = new Set(Object.keys(original));
    const modifiedKeys = new Set(Object.keys(modified));
    
    const additions = [...modifiedKeys].filter(key => !originalKeys.has(key));
    const deletions = [...originalKeys].filter(key => !modifiedKeys.has(key));
    const changes = [...originalKeys].filter(key => 
      modifiedKeys.has(key) && 
      JSON.stringify(original[key]) !== JSON.stringify(modified[key])
    );
    
    return { additions, deletions, changes };
  } catch (error) {
    console.error("Error computing JSON diff:", error);
    return {
      additions: [],
      deletions: [],
      changes: []
    };
  }
}
