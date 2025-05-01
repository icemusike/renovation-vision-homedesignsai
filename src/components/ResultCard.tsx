import React from 'react';
import { Download, TrendingUp, DollarSign, Percent } from 'lucide-react';
import { motion } from 'framer-motion';
import { generatePDF } from '../utils/pdf';

interface ResultCardProps {
  totalCost: number;
  projectedValue: number;
  roiPercent: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ totalCost, projectedValue, roiPercent }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleDownloadPDF = () => {
    generatePDF({
      totalCost,
      projectedValue,
      roiPercent,
    });
  };

  return (
    <div className="bg-white overflow-hidden rounded-2xl shadow-lg border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <h3 className="text-xl font-bold text-white">Your Renovation Estimate</h3>
      </div>
      
      <div className="p-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <div className="flex items-center justify-center">
            <div className="bg-blue-100 rounded-full p-4">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <p className="text-center text-sm font-medium text-gray-500 mt-2">Total Estimated Cost</p>
          <p className="text-center text-5xl font-extrabold text-gray-900 mt-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            {formatCurrency(totalCost)}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-600 font-medium">ROI</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{roiPercent}%</p>
            <p className="text-xs text-gray-500 mt-1">Return on Investment</p>
          </div>
          
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center mb-2">
              <Percent className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-purple-600 font-medium">Value</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(projectedValue)}</p>
            <p className="text-xs text-gray-500 mt-1">Projected Added Value</p>
          </div>
        </div>
        
        <button
          onClick={handleDownloadPDF}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-all duration-150"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Detailed PDF Report
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
