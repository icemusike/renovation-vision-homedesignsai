import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ChevronRight, ArrowLeft } from 'lucide-react';
import InputForm from './components/InputForm';
import ResultCard from './components/ResultCard';
import CostChart from './components/CostChart';
import PhotoUploader from './components/PhotoUploader';
import AIDesignPreview from './components/AIDesignPreview';
import { ToastContainer, toast } from './components/Toast';

interface EstimationResult {
  totalCost: number;
  projectedValue: number;
  roiPercent: number;
}

function App() {
  const [result, setResult] = useState<EstimationResult | null>(null);
  const [step, setStep] = useState<'input' | 'photo' | 'result'>('input');
  const [designImage, setDesignImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateEstimation = (
    size: number,
    finishQuality: string,
    location: string
  ) => {
    // Base cost per square foot based on finish quality
    const baseCostPerSqFt = {
      basic: 80,
      mid: 120,
      premium: 180,
    }[finishQuality];

    // Location multiplier
    const locationMultiplier = {
      urban: 1.1,
      suburban: 1.0,
      rural: 0.95,
    }[location];

    // Calculate total cost
    const totalCost = size * baseCostPerSqFt * locationMultiplier;

    // Calculate ROI percentage
    let roiPercent = 100;
    if (totalCost <= 75000) {
      roiPercent = 120;
    } else if (totalCost <= 150000) {
      roiPercent = 110;
    }

    // Calculate projected value
    const projectedValue = totalCost * (roiPercent / 100);

    setResult({
      totalCost,
      projectedValue,
      roiPercent,
    });

    toast.success('Estimate calculated successfully!');
    setStep('photo');
  };

  const handlePhotoProcessed = (imageUrl: string) => {
    setDesignImage(imageUrl);
    setStep('result');
  };

  const handleBack = () => {
    if (step === 'result') {
      setStep('photo');
    } else if (step === 'photo') {
      setStep('input');
    }
  };

  const handleReset = () => {
    setResult(null);
    setDesignImage(null);
    setStep('input');
    toast.success('Started new estimate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white p-2 rounded-full shadow-md">
            <Home className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="ml-3 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Renovation Vision
          </h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                step === 'input' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                1
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Details</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center">
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                step === 'photo' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                2
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Photo</p>
              </div>
            </div>
            <div className="hidden sm:block">
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center">
              <div className={`rounded-full h-10 w-10 flex items-center justify-center ${
                step === 'result' ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
              }`}>
                3
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Results</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        {step !== 'input' && (
          <button 
            onClick={handleBack}
            className="mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </button>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Your Details</h2>
                  <InputForm onCalculate={calculateEstimation} />
                </div>
              </motion.div>
            )}

            {step === 'photo' && result && (
              <motion.div
                key="photo"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload a Room Photo</h2>
                  <p className="text-gray-600 mb-6">
                    Upload a photo of your room to get an AI-generated design preview based on your renovation budget.
                  </p>
                  <PhotoUploader 
                    onPhotoProcessed={handlePhotoProcessed} 
                    budget={result.totalCost}
                    finishLevel={result.totalCost > 150000 ? "premium" : result.totalCost > 75000 ? "mid-range" : "basic"}
                    setIsLoading={setIsLoading}
                  />
                </div>
              </motion.div>
            )}

            {step === 'result' && result && designImage && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <ResultCard 
                      totalCost={result.totalCost} 
                      projectedValue={result.projectedValue} 
                      roiPercent={result.roiPercent} 
                    />
                    
                    <div className="mt-6">
                      <CostChart 
                        totalCost={result.totalCost} 
                        projectedValue={result.projectedValue} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <AIDesignPreview imageUrl={designImage} />
                    
                    <div className="mt-6">
                      <button
                        onClick={handleReset}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Start New Estimate
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2023 Renovation Vision. All rights reserved.</p>
          <p className="mt-1">Estimates are for planning purposes only. Consult with a professional contractor for accurate quotes.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
