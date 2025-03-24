
// Utility functions for image classification

// Mock classification categories and patterns for demonstration purposes
const classificationPatterns = {
  places: [
    { pattern: /nature|outdoor|landscape/, label: 'Nature' },
    { pattern: /city|urban|building/, label: 'Urban' },
    { pattern: /beach|ocean|sea|water/, label: 'Beach' },
    { pattern: /mountain|hill/, label: 'Mountain' },
    { pattern: /indoor|room|house/, label: 'Indoor' },
  ],
  backgrounds: [
    { pattern: /plain|solid|blank/, label: 'Plain' },
    { pattern: /blur|bokeh/, label: 'Blurred' },
    { pattern: /gradient/, label: 'Gradient' },
    { pattern: /pattern|texture/, label: 'Textured' },
  ],
  subjects: [
    { pattern: /person|people|human|face/, label: 'Person' },
    { pattern: /animal|pet|wildlife/, label: 'Animal' },
    { pattern: /object|item|thing/, label: 'Object' },
    { pattern: /food|meal|dish/, label: 'Food' },
    { pattern: /plant|flower|tree/, label: 'Plant' },
  ],
  quality: [
    { pattern: /high quality|professional|good/, label: 'High Quality' },
    { pattern: /hdr|vibrant|colorful/, label: 'Vibrant' },
    { pattern: /sharp|clear|detailed/, label: 'Sharp' },
    { pattern: /artistic|creative/, label: 'Artistic' },
  ]
};

// Mock face detection function
// In a real implementation, this would use a library like face-api.js or TensorFlow.js
export const detectFaces = async (imageUrl: string): Promise<number> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For demonstration, we'll return a random number of faces between 0-3
  // with some higher probability for 0-1 faces
  const rand = Math.random();
  if (rand < 0.4) return 0;
  if (rand < 0.8) return 1;
  if (rand < 0.95) return 2;
  return 3;
};

// Generate tags based on image name, metadata, and simulated analysis
export const generateTags = async (
  filename: string, 
  fileType: string,
  fileSize: number
): Promise<string[]> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Convert filename to lowercase for pattern matching
  const lowerFilename = filename.toLowerCase();
  
  // Start with empty tags array
  const tags: string[] = [];
  
  // Check for matches in each category
  Object.values(classificationPatterns).forEach(category => {
    category.forEach(({ pattern, label }) => {
      if (pattern.test(lowerFilename)) {
        tags.push(label);
      }
    });
  });
  
  // Add file type tag
  const format = fileType.replace('image/', '').toUpperCase();
  tags.push(`Format: ${format}`);
  
  // Add size category
  if (fileSize < 500 * 1024) {
    tags.push('Small Size');
  } else if (fileSize < 2 * 1024 * 1024) {
    tags.push('Medium Size');
  } else {
    tags.push('Large Size');
  }
  
  // If few tags were found, add some random ones based on probabilities
  if (tags.length < 3) {
    const allLabels = Object.values(classificationPatterns)
      .flatMap(category => category.map(item => item.label));
    
    // Add random tags until we have at least 3
    while (tags.length < 3) {
      const randomLabel = allLabels[Math.floor(Math.random() * allLabels.length)];
      if (!tags.includes(randomLabel)) {
        tags.push(randomLabel);
      }
    }
  }
  
  return tags;
};

// Quality assessment function
export const assessImageQuality = async (): Promise<{ score: number; issue?: string }> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generate a quality score between 0-100
  const score = Math.floor(Math.random() * 100);
  
  // Return quality assessment with possible issue
  if (score < 40) {
    return { 
      score, 
      issue: 'Low quality or resolution'
    };
  } else if (score < 70) {
    return { 
      score, 
      issue: score < 55 ? 'Could be better composed' : 'Decent image quality'
    };
  } else {
    return { score };
  }
};

// Full image analysis function that combines all analyses
export const analyzeImage = async (
  file: File
): Promise<{
  tags: string[];
  faces: number;
  quality: { score: number; issue?: string };
}> => {
  try {
    // Create a URL for the image file
    const imageUrl = URL.createObjectURL(file);
    
    // Run all analyses in parallel
    const [tags, faces, quality] = await Promise.all([
      generateTags(file.name, file.type, file.size),
      detectFaces(imageUrl),
      assessImageQuality()
    ]);
    
    // Clean up the object URL
    URL.revokeObjectURL(imageUrl);
    
    return {
      tags,
      faces,
      quality
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    return {
      tags: ['Error: Failed to analyze'],
      faces: 0,
      quality: { score: 0, issue: 'Analysis failed' }
    };
  }
};
