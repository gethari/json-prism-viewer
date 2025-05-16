
// Helper functions for JSON diff viewer

export function unescapeJson(json: string): string {
  if (!json.trim()) return '';
  
  try {
    // Try parsing directly first
    JSON.parse(json);
    return json;
  } catch (e) {
    try {
      // If direct parsing fails, try unescaping
      return JSON.stringify(JSON.parse(`"${json.replace(/"/g, '\\"')}"`));
    } catch (e) {
      return json; // Return original if all parsing fails
    }
  }
}

export function formatJson(json: string): string {
  if (!json.trim()) return '';
  
  try {
    const obj = JSON.parse(json);
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    try {
      const unescaped = JSON.parse(`"${json.replace(/"/g, '\\"')}"`);
      const obj = JSON.parse(unescaped);
      return JSON.stringify(obj, null, 2);
    } catch (e) {
      return json;
    }
  }
}

export function parseJson(json: string): any {
  if (!json.trim()) return {};
  
  try {
    return JSON.parse(json);
  } catch (e) {
    try {
      const unescaped = JSON.parse(`"${json.replace(/"/g, '\\"')}"`);
      return JSON.parse(unescaped);
    } catch (e) {
      return {};
    }
  }
}

// Enhanced version of findChanges to track specific paths and values 
export function findChanges(original: any, modified: any, path = '') {
  const changes = {
    added: [] as string[],
    removed: [] as string[],
    changed: [] as string[],
    valueMap: {} as Record<string, { original: any; modified: any }>
  };
  
  // For different types or null/undefined scenarios
  if (original === undefined && modified !== undefined) {
    changes.added.push(path);
    changes.valueMap[path] = { original: undefined, modified };
    return changes;
  }
  
  if (original !== undefined && modified === undefined) {
    changes.removed.push(path);
    changes.valueMap[path] = { original, modified: undefined };
    return changes;
  }
  
  if (original === null && modified !== null) {
    changes.changed.push(path);
    changes.valueMap[path] = { original: null, modified };
    return changes;
  }
  
  if (original !== null && modified === null) {
    changes.changed.push(path);
    changes.valueMap[path] = { original, modified: null };
    return changes;
  }
  
  // Handle different types
  if (typeof original !== typeof modified) {
    changes.changed.push(path);
    changes.valueMap[path] = { original, modified };
    return changes;
  }
  
  // Handle arrays
  if (Array.isArray(original) && Array.isArray(modified)) {
    // Process arrays by index
    const maxLength = Math.max(original.length, modified.length);
    
    for (let i = 0; i < maxLength; i++) {
      const currentPath = path ? `${path}[${i}]` : `[${i}]`;
      
      if (i >= original.length) {
        changes.added.push(currentPath);
        changes.valueMap[currentPath] = { original: undefined, modified: modified[i] };
      } else if (i >= modified.length) {
        changes.removed.push(currentPath);
        changes.valueMap[currentPath] = { original: original[i], modified: undefined };
      } else if (typeof original[i] === 'object' && original[i] !== null && 
                typeof modified[i] === 'object' && modified[i] !== null) {
        // Recursively compare objects
        const nestedChanges = findChanges(original[i], modified[i], currentPath);
        changes.added = [...changes.added, ...nestedChanges.added];
        changes.removed = [...changes.removed, ...nestedChanges.removed];
        changes.changed = [...changes.changed, ...nestedChanges.changed];
        Object.assign(changes.valueMap, nestedChanges.valueMap);
      } else if (JSON.stringify(original[i]) !== JSON.stringify(modified[i])) {
        changes.changed.push(currentPath);
        changes.valueMap[currentPath] = { original: original[i], modified: modified[i] };
      }
    }
    
    return changes;
  }
  
  // Handle objects
  if (typeof original === 'object' && original !== null && 
      typeof modified === 'object' && modified !== null) {
    
    // Get all unique keys from both objects
    const allKeys = new Set([
      ...Object.keys(original), 
      ...Object.keys(modified)
    ]);
    
    for (const key of allKeys) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!(key in original)) {
        changes.added.push(currentPath);
        changes.valueMap[currentPath] = { original: undefined, modified: modified[key] };
      } else if (!(key in modified)) {
        changes.removed.push(currentPath);
        changes.valueMap[currentPath] = { original: original[key], modified: undefined };
      } else if (typeof original[key] === 'object' && original[key] !== null && 
                typeof modified[key] === 'object' && modified[key] !== null) {
        // Recursively compare objects
        const nestedChanges = findChanges(original[key], modified[key], currentPath);
        changes.added = [...changes.added, ...nestedChanges.added];
        changes.removed = [...changes.removed, ...nestedChanges.removed];
        changes.changed = [...changes.changed, ...nestedChanges.changed];
        Object.assign(changes.valueMap, nestedChanges.valueMap);
      } else if (JSON.stringify(original[key]) !== JSON.stringify(modified[key])) {
        changes.changed.push(currentPath);
        changes.valueMap[currentPath] = { original: original[key], modified: modified[key] };
      }
    }
    
    return changes;
  }
  
  // For primitive values that are different
  if (original !== modified) {
    if (path) {
      changes.changed.push(path);
      changes.valueMap[path] = { original, modified };
    }
  }
  
  return changes;
}

// Helper function to extract meaningful paths from a line in formatted JSON
export function getPathFromLine(line: string, jsonLines: string[], lineIndex: number): string | null {
  // Skip empty lines or lines with only brackets/braces
  const trimmedLine = line.trim();
  if (!trimmedLine || trimmedLine === '{' || trimmedLine === '}' || 
      trimmedLine === '[' || trimmedLine === ']' || 
      trimmedLine === ',' || trimmedLine === '') {
    return null;
  }
  
  // Extract the property name if available
  const propertyMatch = line.match(/"([^"]+)"\s*:/);
  if (!propertyMatch) return null;
  
  const propertyName = propertyMatch[1];
  
  // Calculate indentation level
  const indentLevel = line.search(/\S|$/);
  
  // Start building the path from the current line going upward
  let path = propertyName;
  let arrayPath = '';
  let inArray = false;
  
  // Check if we're inside an array
  for (let i = lineIndex - 1; i >= 0; i--) {
    const prevLine = jsonLines[i];
    const prevIndent = prevLine.search(/\S|$/);
    
    // Skip empty lines
    if (prevLine.trim() === '') continue;
    
    // If we find a line with less indentation
    if (prevIndent < indentLevel) {
      const arrayMatch = prevLine.match(/^\s*"([^"]+)"\s*:\s*\[/);
      if (arrayMatch) {
        // We're in an array
        inArray = true;
        arrayPath = arrayMatch[1];
        
        // Count how many array items we've passed to determine index
        let arrayIndex = 0;
        let itemIndent = indentLevel;
        for (let j = i + 1; j < lineIndex; j++) {
          const itemLine = jsonLines[j];
          // If this line has the same indentation as our target and contains an object/value
          if (itemLine.search(/\S|$/) === itemIndent && 
              (itemLine.includes('{') || itemLine.includes('[') || 
               itemLine.includes('"') || /true|false|null|\d/.test(itemLine))) {
            arrayIndex++;
          }
        }
        
        return `${arrayPath}[${arrayIndex-1}]${path ? '.' + path : ''}`;
      }
      
      // If it's an object property
      const propertyMatch = prevLine.match(/"([^"]+)"\s*:/);
      if (propertyMatch) {
        if (inArray) {
          // We're already tracking an array path
          return `${arrayPath}${path ? '.' + path : ''}`;
        } else {
          // Normal object property
          path = `${propertyMatch[1]}.${path}`;
        }
      }
    }
  }
  
  return path;
}

export function getLineStatus(line: string, lineIndex: number, isOriginal: boolean, formattedOriginal: string, formattedModified: string, changes: any) {
  if (!line.trim() || line.trim() === '{' || line.trim() === '}' || 
      line.trim() === '[' || line.trim() === ']' || line.trim() === ',') {
    return null;
  }
  
  const jsonLines = isOriginal ? formattedOriginal.split('\n') : formattedModified.split('\n');
  const path = getPathFromLine(line, jsonLines, lineIndex);
  
  if (!path) return null;
  
  // Check exact path match
  if (changes.added.includes(path)) {
    return isOriginal ? null : 'added';
  }
  
  if (changes.removed.includes(path)) {
    return isOriginal ? 'removed' : null;
  }
  
  if (changes.changed.includes(path)) {
    return 'changed';
  }
  
  // Check if the path is a parent of any changes
  const isPrefixOfAdd = changes.added.some((p: string) => p.startsWith(`${path}.`) || p.startsWith(`${path}[`));
  const isPrefixOfRemove = changes.removed.some((p: string) => p.startsWith(`${path}.`) || p.startsWith(`${path}[`));
  const isPrefixOfChange = changes.changed.some((p: string) => p.startsWith(`${path}.`) || p.startsWith(`${path}[`));
  
  if (isPrefixOfAdd && !isOriginal) return 'added';
  if (isPrefixOfRemove && isOriginal) return 'removed';
  if (isPrefixOfChange) return 'changed';
  
  return null;
}
