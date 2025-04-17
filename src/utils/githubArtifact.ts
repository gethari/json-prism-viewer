
interface ArtifactData {
  file: string;
  index: number;
  before: Record<string, any>;
  after: Record<string, any>;
  meta?: Record<string, any>;
}

export async function fetchGitHubArtifact(url: string): Promise<ArtifactData | null> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch artifact: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Validate the structure of the artifact data
    if (!data.before || !data.after) {
      throw new Error("Invalid artifact format: missing 'before' or 'after' properties");
    }
    
    return data as ArtifactData;
  } catch (error) {
    console.error("Error fetching GitHub artifact:", error);
    return null;
  }
}
