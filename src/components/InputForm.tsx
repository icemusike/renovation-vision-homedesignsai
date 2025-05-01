import React, { useState, useRef } from 'react';
import { Calculator, Home, Paintbrush, MapPin, Ruler, Zap } from 'lucide-react';
import { toast } from './Toast';

interface InputFormProps {
  onCalculate: (size: number, finishQuality: string, location: string) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onCalculate }) => {
  const [size, setSize] = useState<number>(1000);
  const [finishQuality, setFinishQuality] = useState<string>('mid');
  const [location, setLocation] = useState<string>('suburban');
  const [unit, setUnit] = useState<'ft' | 'm'>('ft');
  const [isOptimizing, setIsOptimizing] = useState(false);

  // Convert between ft² and m²
  const convertSize = (value: number, toUnit: 'ft' | 'm') => {
    if (toUnit === 'ft' && unit === 'm') {
      // Convert m² to ft²
      return Math.round(value * 10.764);
    } else if (toUnit === 'm' && unit === 'ft') {
      // Convert ft² to m²
      return Math.round(value / 10.764);
    }
    return value;
  };

  const handleUnitChange = (newUnit: 'ft' | 'm') => {
    if (newUnit !== unit) {
      const convertedSize = convertSize(size, newUnit);
      setSize(convertedSize);
      setUnit(newUnit);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Always convert to ft² for calculation if currently in m²
    const sizeInFt = unit === 'm' ? convertSize(size, 'ft') : size;
    onCalculate(sizeInFt, finishQuality, location);
  };

  const optimizeBudget = () => {
    setIsOptimizing(true);
    
    // Simulate AI budget optimization
    setTimeout(() => {
      // In a real app, this would use an AI model to suggest optimal budget allocation
      const optimizedQuality = size > 2000 ? 'basic' : size > 1000 ? 'mid' : 'premium';
      const optimizedLocation = location;
      
      setFinishQuality(optimizedQuality);
      
      // Show recommendation
      toast.success('Budget optimized based on your space size!');
      setIsOptimizing(false);
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <div className="flex items-center mb-4">
          <div className="bg-blue-100 p-2 rounded-full">
            <Home className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-900">House Size</h3>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="size" className="block text-sm font-medium text-gray-700">
              {unit === 'ft' ? 'Square Footage (ft²)' : 'Square Meters (m²)'}
            </label>
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => handleUnitChange('ft')}
                className={`px-3 py-1 text-xs font-medium rounded-l-md ${
                  unit === 'ft'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ft²
              </button>
              <button
                type="button"
                onClick={() => handleUnitChange('m')}
                className={`px-3 py-1 text-xs font-medium rounded-r-md ${
                  unit === 'm'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                m²
              </button>
            </div>
          </div>
          <div className="relative mt-1 rounded-md shadow-sm">
            <input
              type="number"
              id="size"
              name="size"
              min={unit === 'ft' ? '100' : '10'}
              max={unit === 'ft' ? '10000' : '1000'}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              required
              className="block w-full rounded-md border-gray-300 pl-4 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-12 border"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span className="text-gray-500 sm:text-sm">{unit === 'ft' ? 'ft²' : 'm²'}</span>
            </div>
          </div>
          <div className="mt-2">
            <input
              type="range"
              min={unit === 'ft' ? '100' : '10'}
              max={unit === 'ft' ? '10000' : '1000'}
              step={unit === 'ft' ? '100' : '10'}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{unit === 'ft' ? '100 ft²' : '10 m²'}</span>
              <span>{unit === 'ft' ? '5000 ft²' : '500 m²'}</span>
              <span>{unit === 'ft' ? '10000 ft²' : '1000 m²'}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 border-t border-blue-100 pt-4">
          <div className="flex items-center mb-2">
            <Ruler className="h-4 w-4 text-blue-600 mr-2" />
            <p className="text-sm font-medium text-gray-700">Upload Floor Plan</p>
          </div>
          <FloorPlanUploader onSizeDetected={setSize} unit={unit} />
        </div>
      </div>

      <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-2 rounded-full">
              <Paintbrush className="h-5 w-5 text-indigo-600" />
            </div>
            <h3 className="ml-3 text-lg font-medium text-gray-900">Finish Quality</h3>
          </div>
          
          <button
            type="button"
            onClick={optimizeBudget}
            disabled={isOptimizing}
            className="inline-flex items-center px-3 py-1.5 border border-indigo-300 text-xs font-medium rounded-md text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isOptimizing ? (
              <>
                <div className="animate-spin h-3 w-3 border-2 border-indigo-600 border-t-transparent rounded-full mr-1"></div>
                Optimizing...
              </>
            ) : (
              <>
                <Zap className="h-3 w-3 mr-1" />
                AI Optimize
              </>
            )}
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <input
              type="radio"
              id="basic"
              name="finishQuality"
              value="basic"
              checked={finishQuality === 'basic'}
              onChange={() => setFinishQuality('basic')}
              className="sr-only peer"
            />
            <label
              htmlFor="basic"
              className="flex flex-col items-center justify-center p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:text-gray-600 hover:bg-gray-50"
            >
              <span className="w-full text-lg font-semibold text-center">Basic</span>
              <span className="w-full text-sm text-center mt-1">$80/ft²</span>
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="mid"
              name="finishQuality"
              value="mid"
              checked={finishQuality === 'mid'}
              onChange={() => setFinishQuality('mid')}
              className="sr-only peer"
            />
            <label
              htmlFor="mid"
              className="flex flex-col items-center justify-center p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:text-gray-600 hover:bg-gray-50"
            >
              <span className="w-full text-lg font-semibold text-center">Mid-range</span>
              <span className="w-full text-sm text-center mt-1">$120/ft²</span>
            </label>
          </div>
          <div>
            <input
              type="radio"
              id="premium"
              name="finishQuality"
              value="premium"
              checked={finishQuality === 'premium'}
              onChange={() => setFinishQuality('premium')}
              className="sr-only peer"
            />
            <label
              htmlFor="premium"
              className="flex flex-col items-center justify-center p-4 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:text-gray-600 hover:bg-gray-50"
            >
              <span className="w-full text-lg font-semibold text-center">Premium</span>
              <span className="w-full text-sm text-center mt-1">$180/ft²</span>
            </label>
          </div>
        </div>
        
        {finishQuality === 'basic' && (
          <div className="mt-3 bg-blue-50 rounded-md p-2 text-xs text-blue-700">
            <strong>AI Insight:</strong> Basic finishes are cost-effective but may need replacement sooner. Consider mid-range for high-traffic areas.
          </div>
        )}
        
        {finishQuality === 'mid' && (
          <div className="mt-3 bg-blue-50 rounded-md p-2 text-xs text-blue-700">
            <strong>AI Insight:</strong> Mid-range finishes offer the best balance of quality and value, with good durability for most homes.
          </div>
        )}
        
        {finishQuality === 'premium' && (
          <div className="mt-3 bg-blue-50 rounded-md p-2 text-xs text-blue-700">
            <strong>AI Insight:</strong> Premium finishes add the most value in luxury markets. Focus premium materials in kitchens and bathrooms for best ROI.
          </div>
        )}
      </div>

      <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
        <div className="flex items-center mb-4">
          <div className="bg-purple-100 p-2 rounded-full">
            <MapPin className="h-5 w-5 text-purple-600" />
          </div>
          <h3 className="ml-3 text-lg font-medium text-gray-900">Location</h3>
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Property Location
          </label>
          <select
            id="location"
            name="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="block w-full rounded-md border-gray-300 py-3 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm border"
          >
            <option value="urban">Urban Area (+10% cost)</option>
            <option value="suburban">Suburban Area (standard cost)</option>
            <option value="rural">Rural Area (-5% cost)</option>
          </select>
        </div>
        
        <div className="mt-3 bg-purple-50 rounded-md p-2 text-xs text-purple-700 border border-purple-200">
          <strong>Location Impact:</strong> {location === 'urban' 
            ? 'Urban areas have higher labor and permit costs, but may see better ROI.'
            : location === 'suburban' 
              ? 'Suburban areas offer balanced costs and typically good renovation returns.'
              : 'Rural areas have lower labor costs but may see more modest value increases.'}
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-150 ease-in-out transform hover:scale-[1.02]"
        >
          <Calculator className="h-5 w-5 mr-2" />
          Calculate My Estimate
        </button>
      </div>
    </form>
  );
};

// Floor Plan Uploader Component
interface FloorPlanUploaderProps {
  onSizeDetected: (size: number) => void;
  unit: 'ft' | 'm';
}

const FloorPlanUploader: React.FC<FloorPlanUploaderProps> = ({ onSizeDetected, unit }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    
    // Simulate floor plan analysis
    setIsAnalyzing(true);
    setTimeout(() => {
      // In a real app, this would be an API call to analyze the floor plan
      // For demo purposes, we'll generate a random size
      const detectedSizeFt = Math.floor(Math.random() * 3000) + 1000;
      const detectedSize = unit === 'ft' ? detectedSizeFt : Math.round(detectedSizeFt / 10.764);
      onSizeDetected(detectedSize);
      setIsAnalyzing(false);
      toast.success(`Floor plan analyzed! Detected size: ${detectedSize} ${unit === 'ft' ? 'ft²' : 'm²'}`);
    }, 1500);
    
    return () => URL.revokeObjectURL(objectUrl);
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
      const file = e.dataTransfer.files[0];
      
      // Check file type
      if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('application/pdf')) {
        toast.error('Please upload a JPEG, PNG, or PDF file');
        return;
      }
      
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      // Simulate floor plan analysis
      setIsAnalyzing(true);
      setTimeout(() => {
        const detectedSizeFt = Math.floor(Math.random() * 3000) + 1000;
        const detectedSize = unit === 'ft' ? detectedSizeFt : Math.round(detectedSizeFt / 10.764);
        onSizeDetected(detectedSize);
        setIsAnalyzing(false);
        toast.success(`Floor plan analyzed! Detected size: ${detectedSize} ${unit === 'ft' ? 'ft²' : 'm²'}`);
      }, 1500);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="space-y-3">
      <div 
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <p className="mb-1 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">Floor plan (PNG, JPG, PDF)</p>
        </div>
        <input 
          ref={fileInputRef}
          id="floor-plan-upload" 
          type="file" 
          className="hidden" 
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleFileChange}
        />
      </div>
      
      {isAnalyzing && (
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-sm text-blue-600">Analyzing floor plan...</span>
        </div>
      )}
      
      {preview && !isAnalyzing && (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden border border-gray-200">
            <img src={preview} alt="Floor plan preview" className="h-full w-full object-cover" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Floor plan uploaded</p>
            <p className="text-xs text-green-600">Measurements extracted successfully</p>
          </div>
        </div>
      )}
      
      <p className="text-xs text-gray-500">
        Our AI will automatically extract the square {unit === 'ft' ? 'footage' : 'meters'} from your floor plan.
      </p>
    </div>
  );
};

export default InputForm;
