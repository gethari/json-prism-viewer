
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileJson, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { faker } from '@faker-js/faker';

interface JsonCompareToolbarProps {
  originalJson: string;
  modifiedJson: string;
  setOriginalJson: (json: string) => void;
  setModifiedJson: (json: string) => void;
  setShowDiff: (show: boolean) => void;
}

const JsonCompareToolbar: React.FC<JsonCompareToolbarProps> = ({
  originalJson,
  modifiedJson,
  setOriginalJson,
  setModifiedJson,
  setShowDiff,
}) => {
  const { toast } = useToast();

  const handleCompare = () => {
    if (originalJson.trim() && modifiedJson.trim()) {
      setShowDiff(true);
    }
  };

  const generateRandomProduct = () => {
    return {
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      price: parseFloat(faker.commerce.price()),
      inStock: faker.datatype.boolean(),
      createdAt: faker.date.recent().toISOString(),
      colors: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.color.human()),
      categories: Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () => faker.commerce.department()),
      details: {
        weight: `${faker.number.float({ min: 0.1, max: 10, precision: 0.1 })}kg`,
        dimensions: `${faker.number.int({ min: 5, max: 30 })}x${faker.number.int({ min: 5, max: 30 })}x${faker.number.int({ min: 5, max: 30 })}`,
        material: faker.commerce.productMaterial(),
        manufacturer: faker.company.name(),
        countryOfOrigin: faker.location.country(),
      },
      ratings: Array.from({ length: faker.number.int({ min: 3, max: 10 }) }, () => ({
        userId: faker.string.uuid(),
        score: faker.number.int({ min: 1, max: 5 }),
        comment: faker.lorem.sentence(),
      })),
    };
  };

  const generateModifiedProduct = (original: any) => {
    const modified = { ...original };
    
    // Make random modifications
    modified.name = faker.commerce.productName();
    modified.price = parseFloat(faker.commerce.price());
    modified.inStock = !original.inStock;
    
    // Modify some colors (remove one, add one)
    if (modified.colors.length > 0) {
      modified.colors = [...modified.colors];
      modified.colors.pop();
      modified.colors.push(faker.color.human());
    }
    
    // Add a new field
    modified.popularity = faker.number.float({ min: 0, max: 1, precision: 0.01 });
    
    // Modify details
    modified.details = {
      ...modified.details,
      weight: `${faker.number.float({ min: 0.1, max: 10, precision: 0.1 })}kg`,
      shipping: {
        service: faker.company.name(),
        estimatedDays: faker.number.int({ min: 1, max: 10 }),
      }
    };
    
    // Remove a key
    if (modified.ratings) {
      delete modified.ratings;
    }
    
    return modified;
  };

  const handleSampleData = () => {
    const originalProduct = generateRandomProduct();
    const modifiedProduct = generateModifiedProduct(originalProduct);
    
    setOriginalJson(JSON.stringify(originalProduct, null, 2));
    setModifiedJson(JSON.stringify(modifiedProduct, null, 2));
    
    toast({
      title: "Random Data Generated",
      description: "Sample JSON data created with random differences",
    });
  };

  const generateShareableUrl = () => {
    if (!originalJson.trim() || !modifiedJson.trim()) {
      toast({
        variant: "destructive",
        title: "Missing Data",
        description: "Both original and modified JSON are required to generate a URL",
      });
      return;
    }

    try {
      // Parse the JSON strings
      const beforeObj = JSON.parse(originalJson);
      const afterObj = JSON.parse(modifiedJson);
      
      // Encode the objects as base64
      const beforeBase64 = btoa(JSON.stringify(beforeObj));
      const afterBase64 = btoa(JSON.stringify(afterObj));
      
      // Generate the URL with the encoded parameters
      const baseUrl = window.location.origin + window.location.pathname;
      const shareableUrl = `${baseUrl}?before=${encodeURIComponent(beforeBase64)}&after=${encodeURIComponent(afterBase64)}`;
      
      // Copy to clipboard
      navigator.clipboard.writeText(shareableUrl).then(() => {
        toast({
          title: "URL Copied to Clipboard",
          description: "Share this URL to let others see the same comparison",
        });
      });
    } catch (error) {
      console.error("Error generating shareable URL:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate a shareable URL. Check that your JSON is valid.",
      });
    }
  };

  return (
    <div className="mt-6 flex items-center justify-center space-x-4">
      <Button 
        onClick={handleCompare}
        disabled={!originalJson.trim() || !modifiedJson.trim()}
        className="w-32"
      >
        <FileJson className="mr-2 h-4 w-4" />
        Compare
      </Button>
      <Button 
        variant="outline" 
        onClick={handleSampleData}
        className="w-32"
      >
        Load Sample
      </Button>
      <Button 
        variant="outline" 
        onClick={generateShareableUrl}
        className="w-auto"
        title="Generate a shareable URL with the current comparison"
      >
        <Clipboard className="mr-2 h-4 w-4" />
        Share as URL
      </Button>
    </div>
  );
};

export default JsonCompareToolbar;
