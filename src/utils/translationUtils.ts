
import { parseJson } from './jsonUtils';

/**
 * Recursively finds all label keys in a configuration object and their corresponding translation keys
 * @param obj The configuration object to search
 * @param results Array to accumulate results
 * @returns Array of objects with label value and translation key
 */
function findLabelKeys(obj: any, results: {label: string, translationKey: string | null, path: any[]}[] = [], path: any[] = []): {label: string, translationKey: string | null, path: any[]}[] {
  if (!obj || typeof obj !== 'object') {
    return results;
  }

  // Check if this object has both a label property and a translationKeys.label property
  if (obj.label && typeof obj.label === 'string') {
    const translationKey = obj.translationKeys && obj.translationKeys.label 
      ? obj.translationKeys.label 
      : null;
    
    results.push({
      label: obj.label,
      translationKey,
      path: [...path]
    });
  }

  // Recursively search all properties
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => findLabelKeys(item, results, [...path, index]));
  } else {
    Object.entries(obj).forEach(([key, val]) => {
      if (val && typeof val === 'object') {
        findLabelKeys(val, results, [...path, key]);
      }
    });
  }

  return results;
}

/**
 * Generates a translation key from a label value
 * @param label The label text
 * @returns A standardized translation key
 */
function generateTranslationKey(label: string): string {
  // Convert to uppercase and replace spaces with underscores
  return label
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, '_') // Replace non-alphanumeric chars with underscores
    .replace(/_{2,}/g, '_') // Replace multiple underscores with a single one
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .trim();
}

/**
 * Find missing translations in the translation file based on labels in config
 * @param configJson The configuration JSON object or string
 * @param translationJson The translation JSON object or string
 * @returns Array of missing translation key-value pairs
 */
export function findMissingTranslations(configJson: any, translationJson: any): {key: string, value: string}[] {
  // Parse JSON if strings are provided
  const config = typeof configJson === 'string' ? parseJson(configJson) : configJson;
  const translations = typeof translationJson === 'string' ? parseJson(translationJson) : translationJson;

  if (!config || !translations) {
    return [];
  }

  // Find all label keys in the config
  const labelEntries = findLabelKeys(config);
  
  // Create a map of existing translation values to keys
  const existingTranslationsMap = new Map<string, string>();
  Object.entries(translations).forEach(([key, value]) => {
    if (typeof value === 'string') {
      existingTranslationsMap.set(value, key);
    }
  });

  // Check which translations are missing
  const missingTranslations: {key: string, value: string}[] = [];
  
  labelEntries.forEach(({ label, translationKey }) => {
    const value = label;
    
    // If we have a translationKey in the config, check if it exists in translations
    if (translationKey) {
      if (!translations[translationKey]) {
        missingTranslations.push({ key: translationKey, value });
      }
    } else {
      // If no translationKey is provided, check if the value exists in any key
      if (!existingTranslationsMap.has(value)) {
        // Generate a new key for this value
        const newKey = generateTranslationKey(value);
        missingTranslations.push({ key: newKey, value });
      }
      // If value exists but key doesn't match, we don't report it as missing
    }
  });
  
  return missingTranslations;
}

/**
 * Updates a configuration object with missing translation keys
 * @param configJson The configuration JSON object or string
 * @param missingTranslations Array of missing translation key-value pairs
 * @returns Updated configuration object with translation keys added
 */
export function updateConfigWithTranslationKeys(configJson: any, missingTranslations: {key: string, value: string}[]): any {
  // Parse JSON if string is provided
  const config = typeof configJson === 'string' ? parseJson(configJson) : configJson;
  if (!config) return config;
  
  // Create a map for quick lookup of missing translations
  const missingTranslationsMap = new Map<string, string>();
  missingTranslations.forEach(({ key, value }) => {
    missingTranslationsMap.set(value, key);
  });
  
  // Function to recursively update the configuration
  function updateObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    
    // If this object has a label property
    if (obj.label && typeof obj.label === 'string') {
      const label = obj.label;
      const key = missingTranslationsMap.get(label);
      
      // If this label has a missing translation key
      if (key) {
        // Create a new object with the properties in the order we want
        const newObj = { ...obj };
        
        // Re-order properties to put translationKeys right after label
        const orderedObj: any = {};
        
        // Add all keys in order, with translationKeys right after label
        Object.keys(newObj).forEach((objKey) => {
          if (objKey === 'label') {
            orderedObj[objKey] = newObj[objKey];
            // Add translationKeys immediately after label
            if (!newObj.translationKeys) {
              orderedObj.translationKeys = { label: key };
            } else {
              orderedObj.translationKeys = {
                ...newObj.translationKeys,
                label: key
              };
            }
          } else if (objKey !== 'translationKeys') { // Skip translationKeys as we've already added it
            orderedObj[objKey] = newObj[objKey];
          }
        });
        
        return orderedObj;
      }
    }
    
    // Recursively process all properties
    if (Array.isArray(obj)) {
      return obj.map(item => updateObject(item));
    } else {
      const result = { ...obj };
      Object.entries(result).forEach(([key, val]) => {
        if (val && typeof val === 'object') {
          result[key] = updateObject(val);
        }
      });
      return result;
    }
  }
  
  return updateObject(JSON.parse(JSON.stringify(config))); // Deep clone before modifying
}
