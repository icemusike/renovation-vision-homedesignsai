import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader } from 'lucide-react';
import { toast } from './Toast';

interface PhotoUploaderProps {
  onPhotoProcessed: (imageUrl: string) => void;
  budget: number;
  finishLevel: string;
  setIsLoading: (loading: boolean) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ 
  onPhotoProcessed, 
  budget, 
  finishLevel,
  setIsLoading
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    handleFile(file);
  };

  const handleFile = (file: File) => {
    // Check file type
    if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
      toast.error('Please upload a JPEG or PNG image');
      return;
    }
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const processImage = async () => {
    if (!preview) {
      toast.error('Please upload an image first');
      return;
    }

    setIsProcessing(true);
    setIsLoading(true);

    try {
      // In a real application, you would send the image to your backend
      // which would then call the OpenAI API. For this demo, we'll simulate
      // the response with a timeout.
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll use a placeholder image
      // In a real app, you would use the OpenAI API like this:
      /*
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Create a photorealistic interior design for a room with a ${finishLevel} finish level. 
                The renovation budget is ${budget}. Make it modern, stylish, and inviting.`,
        n: 1,
        size: "1024x1024",
      });
      
      const imageUrl = response.data[0].url;
      */
      
      // Using a placeholder image for the demo
      const designStyles = {
        'basic': 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        'mid-range': 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
        'premium': 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1453&q=80'
      };
      
      const imageUrl = designStyles[finishLevel as keyof typeof designStyles];
      
      toast.success('Design generated successfully!');
      onPhotoProcessed(imageUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          className="hidden" 
          accept=".jpg,.jpeg,.png"
          onChange={handleFileChange}
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <p className="text-sm text-gray-500">
            {isDragActive
              ? 'Drop the image here...'
              : 'Drag & drop a room photo, or click to select'}
          </p>
          <p className="text-xs text-gray-400">
            Supported formats: JPEG, PNG (max 5MB)
          </p>
        </div>
      </div>

      {preview && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
          <div className="relative rounded-lg overflow-hidden border border-gray-200">
            <img 
              src={preview} 
              alt="Room preview" 
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      )}

      <button
        onClick={processImage}
        disabled={!preview || isProcessing}
        className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white transition-all duration-150 ${
          !preview || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02]'
        }`}
      >
        {isProcessing ? (
          <>
            <Loader className="h-5 w-5 mr-2 animate-spin" />
            Generating Design...
          </>
        ) : (
          <>
            <ImageIcon className="h-5 w-5 mr-2" />
            Generate AI Design
          </>
        )}
      </button>
      
      <p className="text-xs text-gray-500 text-center mt-2">
        Our AI will generate a design concept based on your photo and budget of {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0,
        }).format(budget)}.
      </p>
    </div>
  );
};

export default PhotoUploader;
