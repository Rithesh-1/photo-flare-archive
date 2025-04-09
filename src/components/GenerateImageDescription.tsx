
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface GenerateImageDescriptionProps {
  imageUrl: string;
  onDescriptionGenerated: (description: string) => void;
}

const GenerateImageDescription: React.FC<GenerateImageDescriptionProps> = ({ 
  imageUrl, 
  onDescriptionGenerated 
}) => {
  const [loading, setLoading] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');

  const generateDescription = async () => {
    // This would be connected to OpenAI's API in a real implementation
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we're generating a mock description
      const descriptions = [
        "A serene landscape photo capturing the golden hour over mountains, with warm sunlight casting long shadows across the valley.",
        "A vibrant portrait of a person smiling at the camera, with natural lighting highlighting their features against a blurred background.",
        "An abstract composition featuring geometric shapes in bold colors, creating a dynamic visual pattern.",
        "A close-up nature photograph showing intricate details of a flower petal with morning dew drops.",
        "A stunning cityscape at night with illuminated buildings creating a metropolitan skyline.",
      ];
      
      const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
      setGeneratedDescription(randomDescription);
      onDescriptionGenerated(randomDescription);
      
      toast.success("Description generated successfully");
    } catch (error) {
      console.error("Error generating description:", error);
      toast.error("Failed to generate description");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Description Generator
        </h3>
        <Button
          size="sm"
          onClick={generateDescription}
          disabled={loading}
          className="gap-1.5"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </div>

      {generatedDescription && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Textarea
            value={generatedDescription}
            onChange={(e) => setGeneratedDescription(e.target.value)}
            className="min-h-[80px] resize-y"
            placeholder="Generated description will appear here..."
          />
          <p className="text-xs text-muted-foreground mt-1">
            Edit the generated description if needed
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default GenerateImageDescription;
