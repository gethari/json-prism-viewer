
import { parseJson } from './jsonUtils';
import { stringSimilarity } from './stringUtils';

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

  // Check if this object has a label property with an exact match
  if (obj.hasOwnProperty('label') && typeof obj.label === 'string') {
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
      findLabelKeys(val, results, [...path, key]);
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
 * Find translations that need to be added to the translation file or need keys in the config
 * @param configJson The configuration JSON object or string
 * @param translationJson The translation JSON object or string
 * @returns Array of translation key-value pairs with a flag indicating if they already exist in translations
 */
export function findMissingTranslations(configJson: any, translationJson: any): {key: string, value: string, existsInTranslations: boolean}[] {
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

  // Translations that need attention (either missing or need keys in config)
  const translationsToProcess: {key: string, value: string, existsInTranslations: boolean}[] = [];
  
  labelEntries.forEach(({ label, translationKey }) => {
    const value = label;
    
    // If we have a translationKey in the config, check if it exists in translations
    if (translationKey) {
      if (!translations[translationKey]) {
        translationsToProcess.push({ key: translationKey, value, existsInTranslations: false });
      }
    } else {
      // If no translationKey is provided, check if the value exists in any key
      if (!existingTranslationsMap.has(value)) {
        // Generate a new key for this value
        const newKey = generateTranslationKey(value);
        translationsToProcess.push({ key: newKey, value, existsInTranslations: false });
      } else {
        // The value exists in translations but has no key in the config
        // Add it to the list with the existing translation key from the translations file
        const existingKey = existingTranslationsMap.get(value);
        if (existingKey) {
          translationsToProcess.push({ key: existingKey, value, existsInTranslations: true });
        }
      }
    }
  });
  
  return translationsToProcess;
}

/**
 * Updates a configuration object with translation keys
 * @param configJson The configuration JSON object or string
 * @param translationsToProcess Array of translation key-value pairs with existence flag
 * @returns Updated configuration object with translation keys added
 */
export function updateConfigWithTranslationKeys(
  configJson: any, 
  translationsToProcess: {key: string, value: string, existsInTranslations: boolean}[]
): any {
  // Parse JSON if string is provided
  const config = typeof configJson === 'string' ? parseJson(configJson) : configJson;
  if (!config) return config;
  
  // Create a map for quick lookup of translations that need keys
  const translationsMap = new Map<string, string>();
  for (const { key, value } of translationsToProcess) {
    translationsMap.set(value, key);
  }
  
  // Function to recursively update the configuration
  function updateObject(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    
    let result: any;
    
    if (Array.isArray(obj)) {
      return obj.map(item => updateObject(item));
    } else {
      // Create new object to maintain property order
      result = {};
      
      // Check for the exact label property
      const hasLabel = Object.prototype.hasOwnProperty.call(obj, 'label') && typeof obj.label === 'string';
      const label = hasLabel ? obj.label : null;
      
      // Needs a translation key if:
      // 1. It has a label
      // 2. The label is in our translations map
      // 3. There's no existing translationKeys.label OR the existing one is itself nested
      const existingTranslationKey = hasLabel && obj.translationKeys?.label 
        ? obj.translationKeys.label 
        : null;
      const hasNestedTranslationKeys = obj.translationKeys && obj.translationKeys.translationKeys;
      
      const needsTranslationKey = hasLabel && label && translationsMap.has(label) && 
        (!existingTranslationKey || hasNestedTranslationKeys);
      
      // Process each property in order
      for (const [key, value] of Object.entries(obj)) {
        if (key === 'translationKeys' && hasNestedTranslationKeys) {
          // Fix nested translationKeys by flattening the structure
          result[key] = {
            label: existingTranslationKey
          };
        } else {
          // For all other keys, process normally
          result[key] = key === 'label' ? value : updateObject(value);
          
          // Immediately after adding the label, add or update translationKeys if needed
          if (key === 'label' && needsTranslationKey && label) {
            const translationKey = translationsMap.get(label);
            
            // Either create a new translationKeys object or update the existing one
            if (!result.translationKeys) {
              result.translationKeys = { label: translationKey };
            } else if (!hasNestedTranslationKeys) {
              // If existing translationKeys doesn't itself have a nested structure, just update the label
              result.translationKeys = {
                ...result.translationKeys,
                label: translationKey
              };
            }
            // If it has a nested structure, it was already fixed in the block above
          }
        }
      }
      
      return result;
    }
  }
  
  return updateObject(JSON.parse(JSON.stringify(config))); // Deep clone before modifying
}

/**
 * Extract all label values from a configuration object
 * @param configJson The configuration JSON object or string
 * @returns Array of all label values found in the config
 */
export function extractAllLabels(configJson: any): string[] {
  // Parse JSON if string is provided
  const config = typeof configJson === 'string' ? parseJson(configJson) : configJson;
  if (!config) return [];
  
  // Use findLabelKeys to get all label entries
  const labelEntries = findLabelKeys(config);
  
  // Extract just the label values
  return labelEntries.map(entry => entry.label);
}

/**
 * Find potential typos between config labels and translations
 * @param configJson The configuration JSON object or string
 * @param translationJson The translation JSON object or string 
 * @returns Array of potential typo matches with similarity scores
 */
export function findPotentialTypos(configJson: any, translationJson: any): Array<{configLabel: string, translationText: string, similarity: number}> {
  // Import on demand to avoid circular dependencies
  
  
  // Parse JSON if strings are provided
  const config = typeof configJson === 'string' ? parseJson(configJson) : configJson;
  const translations = typeof translationJson === 'string' ? parseJson(translationJson) : translationJson;
  
  if (!config || !translations) return [];
  
  const configLabels = extractAllLabels(config);
  const translationValues = Object.values(translations) as string[];
  const potentialTypos: Array<{configLabel: string, translationText: string, similarity: number}> = [];
  
  // Check each config label against each translation value
  for (const configLabel of configLabels) {
    for (const translationText of translationValues) {
      // Skip exact matches
      if (configLabel === translationText) continue;
      
      const similarity = stringSimilarity(configLabel, translationText);
      
      // If similarity is high but not 100%, it might be a typo
      if (similarity >= 85 && similarity < 100) {
        potentialTypos.push({
          configLabel,
          translationText,
          similarity
        });
      }
    }
  }
  
  // Sort by similarity (highest first)
  return potentialTypos.sort((a, b) => b.similarity - a.similarity);
}
