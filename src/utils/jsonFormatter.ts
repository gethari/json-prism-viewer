
/**
 * Utility functions for parsing and formatting JSON in various formats
 */

/**
 * Attempts to parse JSON using multiple approaches to handle different formats
 * @param input - The JSON string to parse
 * @returns Object with parsing results
 */
export const parseJsonSafely = (input: string) => {
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
