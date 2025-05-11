
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
      // As a last resort, try to fix common JSON errors
      try {
        // Sometimes JSON has trailing commas
        const fixedInput = input
          .replace(/,\s*}/g, '}')  // Remove trailing commas in objects
          .replace(/,\s*\]/g, ']'); // Remove trailing commas in arrays
        return JSON.parse(fixedInput);
      } catch (e3) {
        console.error("Failed to parse JSON:", e3);
        return null;
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
export function safeStringify(value: any): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch (e) {
    console.error("Error stringifying value:", e);
    return "";
  }
}
