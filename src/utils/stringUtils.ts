// Function to calculate Levenshtein distance between two strings
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  // Initialize the matrix
  for (let i = 0; i <= a.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= b.length; j++) {
    matrix[0][j] = j;
  }

  // Fill the matrix
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1, // deletion
        matrix[i][j - 1] + 1, // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[a.length][b.length];
}

// Calculate string similarity (0-100%) - higher is more similar
export function stringSimilarity(a: string, b: string): number {
  if (a === b) return 100;
  if (a.length === 0 || b.length === 0) return 0;
  
  const distance = levenshteinDistance(a, b);
  const maxLength = Math.max(a.length, b.length);
  
  // Convert distance to similarity percentage
  return Math.round((1 - distance / maxLength) * 100);
}

// Find potential typos between two sets of strings
export function findPotentialTypos(
  configLabels: string[],
  translations: Record<string, string>,
  similarityThreshold: number = 85 // Default threshold for potential typos
): Array<{ configLabel: string; translationText: string; similarity: number }> {
  const potentialTypos: Array<{ configLabel: string; translationText: string; similarity: number }> = [];
  const translationValues = Object.values(translations);
  
  for (const configLabel of configLabels) {
    for (const translationText of translationValues) {
      // Skip exact matches
      if (configLabel === translationText) continue;
      
      const similarity = stringSimilarity(configLabel, translationText);
      
      // If similarity is high but not 100%, it might be a typo
      if (similarity >= similarityThreshold && similarity < 100) {
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
