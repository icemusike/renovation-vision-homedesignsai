import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, RefreshCw, Palette } from 'lucide-react';
import { toast } from './Toast';

interface AIDesignPreviewProps {
  imageUrl: string;
}

const AIDesignPreview: React.FC<AIDesignPreviewProps> = ({ imageUrl }) => {
  const [isGeneratingVariation, setIsGeneratingVariation] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<'modern' | 'minimalist' | 'traditional'>('modern');
  const [currentImage, setCurrentImage] = useState(imageUrl);

  const handleDownload = () => {
    // Create a temporary link
    const link = document.createElement('a');
    link.href = currentImage;
    link.download = 'renovation-design.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Design downloaded successfully!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Renovation Design',
          text: 'Check out this AI-generated renovation design!',
          url: currentImage,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(currentImage);
      toast.success('Design URL copied to clipboard!');
    }
  };

  const generateVariation = () => {
    setIsGeneratingVariation(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // In a real app, this would call the OpenAI API with a different seed or style
      const variations = {
        modern: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
        minimalist: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        traditional: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1453&q=80'
      };
      
      // Cycle through styles
      const nextStyle = currentStyle === 'modern' 
        ? 'minimalist' 
        : currentStyle === 'minimalist' 
          ? 'traditional' 
          : 'modern';
      
      setCurrentStyle(nextStyle);
      setCurrentImage(variations[nextStyle]);
      setIsGeneratingVariation(false);
      toast.success(`Generated ${nextStyle} style variation!`);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">AI Design Concept</h3>
        <div className="bg-white bg-opacity-20 rounded-md px-3 py-1">
          <span className="text-xs font-medium text-white capitalize">{currentStyle} Style</span>
        </div>
      </div>
      
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-xl overflow-hidden shadow-md mb-4">
            <img 
              src={currentImage} 
              alt="AI-generated design" 
              className="w-full h-64 object-cover"
            />
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            This AI-generated design concept shows how your space could look after renovation. 
            The design is tailored to your budget and selected finish level.
          </p>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <button
              onClick={handleDownload}
              className="flex justify-center items-center py-2 px-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="h-4 w-4 mr-1" />
              <span className="truncate">Download</span>
            </button>
            
            <button
              onClick={handleShare}
              className="flex justify-center items-center py-2 px-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Share2 className="h-4 w-4 mr-1" />
              <span className="truncate">Share</span>
            </button>
            
            <button
              onClick={generateVariation}
              disabled={isGeneratingVariation}
              className="flex justify-center items-center py-2 px-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingVariation ? (
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Palette className="h-4 w-4 mr-1" />
              )}
              <span className="truncate">New Style</span>
            </button>
          </div>
          
          <div className="bg-indigo-50 rounded-lg p-3">
            <p className="text-xs text-indigo-700">
              <strong>AI Tip:</strong> This {currentStyle} style design emphasizes 
              {currentStyle === 'modern' 
                ? ' clean lines and open spaces with a focus on functionality.' 
                : currentStyle === 'minimalist' 
                  ? ' simplicity and decluttered spaces with neutral colors.' 
                  : ' classic elements with warm colors and natural materials.'}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIDesignPreview;
