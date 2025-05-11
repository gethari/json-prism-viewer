
/**
 * Utilities for handling diff visualization
 */

/**
 * Format summary text for diff changes
 */
export const formatSummaryText = (summary: {
  additions: number;
  deletions: number;
  changes: number;
}) => {
  const parts = [];
  if (summary.additions > 0) parts.push(`${summary.additions} addition${summary.additions !== 1 ? 's' : ''}`);
  if (summary.deletions > 0) parts.push(`${summary.deletions} deletion${summary.deletions !== 1 ? 's' : ''}`);
  if (summary.changes > 0) parts.push(`${summary.changes} change${summary.changes !== 1 ? 's' : ''}`);
  
  return parts.length > 0 ? parts.join(', ') : 'No changes detected';
};

/**
 * Calculate diff summary between two JSON objects
 */
export const calculateDiffSummary = (originalJson: string, modifiedJson: string) => {
  try {
    const original = JSON.parse(originalJson || '{}');
    const modified = JSON.parse(modifiedJson || '{}');
    
    // Count additions, deletions and changes
    const originalKeys = new Set(Object.keys(original));
    const modifiedKeys = new Set(Object.keys(modified));
    
    let additions = 0;
    let deletions = 0;
    let changes = 0;
    
    // Count additions
    for (const key of modifiedKeys) {
      if (!originalKeys.has(key)) {
        additions++;
      }
    }
    
    // Count deletions
    for (const key of originalKeys) {
      if (!modifiedKeys.has(key)) {
        deletions++;
      }
    }
    
    // Count changes
    for (const key of originalKeys) {
      if (modifiedKeys.has(key) && JSON.stringify(original[key]) !== JSON.stringify(modified[key])) {
        changes++;
      }
    }
    
    return { additions, deletions, changes };
  } catch (error) {
    console.error("Error calculating diff summary:", error);
    return { additions: 0, deletions: 0, changes: 0 };
  }
};
