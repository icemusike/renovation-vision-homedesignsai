import React from 'react';
import { motion } from 'framer-motion';
import { Download, Share2 } from 'lucide-react';
import { toast } from './Toast';

interface AIDesignPreviewProps {
  imageUrl: string;
}

const AIDesignPreview: React.FC<AIDesignPreviewProps> = ({ imageUrl }) => {
  const handleDownload = () => {
    // Create a temporary link
    const link = document.createElement('a');
    link.href = imageUrl;
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
          url: imageUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(imageUrl);
      toast.success('Design URL copied to clipboard!');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white">AI Design Concept</h3>
      </div>
      
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="rounded-xl overflow-hidden shadow-md mb-4">
            <img 
              src={imageUrl} 
              alt="AI-generated design" 
              className="w-full h-64 object-cover"
            />
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            This AI-generated design concept shows how your space could look after renovation. 
            The design is tailored to your budget and selected finish level.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={handleDownload}
              className="flex-1 flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </button>
            
            <button
              onClick={handleShare}
              className="flex-1 flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AIDesignPreview;
