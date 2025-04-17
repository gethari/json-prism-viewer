
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Github } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchGitHubArtifact } from '@/utils/githubArtifact';

interface GitHubArtifactLoaderProps {
  onArtifactLoaded: (originalJson: string, modifiedJson: string) => void;
  setShowDiff: (show: boolean) => void;
}

const GitHubArtifactLoader: React.FC<GitHubArtifactLoaderProps> = ({ 
  onArtifactLoaded, 
  setShowDiff 
}) => {
  const [artifactUrl, setArtifactUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFetchArtifact = async () => {
    if (!artifactUrl.trim()) {
      toast({
        variant: "destructive",
        title: "URL Required",
        description: "Please enter a GitHub artifact URL",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const artifactData = await fetchGitHubArtifact(artifactUrl);
      
      if (!artifactData) {
        toast({
          variant: "destructive",
          title: "Failed to fetch artifact",
          description: "Could not retrieve or parse the GitHub artifact",
        });
        return;
      }
      
      // Set the JSON data
      onArtifactLoaded(
        JSON.stringify(artifactData.before, null, 2),
        JSON.stringify(artifactData.after, null, 2)
      );
      
      // Show the diff view automatically
      setShowDiff(true);
      
      toast({
        title: "Artifact Loaded",
        description: `Successfully loaded artifact from ${artifactData.file || 'GitHub'}`,
      });
      
      // If there's metadata, log it to console for debugging purposes
      if (artifactData.meta) {
        console.log("Artifact metadata:", artifactData.meta);
      }
    } catch (error) {
      console.error("Error loading artifact:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load the GitHub artifact. Check the console for details.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-6 p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
      <h3 className="text-lg font-medium mb-2 flex items-center">
        <Github className="h-5 w-5 mr-2" />
        Load from GitHub Artifact
      </h3>
      <div className="flex gap-3">
        <Input
          placeholder="Enter GitHub artifact URL"
          value={artifactUrl}
          onChange={(e) => setArtifactUrl(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleFetchArtifact}
          disabled={isLoading || !artifactUrl.trim()}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading
            </span>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Fetch
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Provide the URL to a GitHub artifact JSON file with "before" and "after" properties.
      </p>
    </div>
  );
};

export default GitHubArtifactLoader;
