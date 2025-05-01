import jsPDF from 'jspdf';

interface PDFData {
  totalCost: number;
  projectedValue: number;
  roiPercent: number;
}

export const generatePDF = (data: PDFData) => {
  const { totalCost, projectedValue, roiPercent } = data;
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Create new PDF document
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(0, 0, 0);
  doc.text('Renovation Cost Estimate Summary', 105, 20, { align: 'center' });
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 35, 190, 35);
  
  // Add cost information
  doc.setFontSize(14);
  doc.text('Estimated Renovation Cost:', 20, 50);
  doc.setFontSize(16);
  doc.setTextColor(0, 102, 204);
  doc.text(formatCurrency(totalCost), 190, 50, { align: 'right' });
  
  // Add ROI information
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Return on Investment (ROI):', 20, 65);
  doc.setTextColor(0, 153, 51);
  doc.text(`${roiPercent}%`, 190, 65, { align: 'right' });
  
  // Add projected value
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Projected Added Value:', 20, 80);
  doc.setTextColor(0, 153, 51);
  doc.text(formatCurrency(projectedValue), 190, 80, { align: 'right' });
  
  // Add horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, 90, 190, 90);
  
  // Add notes
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Notes:', 20, 105);
  doc.setFontSize(10);
  doc.text('• This estimate is based on current market rates and may vary based on actual conditions.', 25, 115);
  doc.text('• The ROI calculation is an estimate based on typical market returns for similar renovations.', 25, 125);
  doc.text('• Consult with a professional contractor for a detailed quote before beginning work.', 25, 135);
  
  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Renovation Cost Estimator - For planning purposes only', 105, 280, { align: 'center' });
  
  // Save the PDF
  doc.save('renovation-estimate.pdf');
};
