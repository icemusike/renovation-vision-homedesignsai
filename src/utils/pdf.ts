import jsPDF from 'jspdf';

interface PDFData {
  totalCost: number;
  projectedValue: number;
  roiPercent: number;
  selectedRooms?: string[];
}

export const generatePDF = (data: PDFData) => {
  const { totalCost, projectedValue, roiPercent, selectedRooms = [] } = data;
  
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
  
  // Add title with blue color
  doc.setFontSize(24);
  doc.setTextColor(59, 130, 246); // Blue color
  doc.text('Renovation Cost Estimate', 105, 20, { align: 'center' });
  
  // Add subtitle
  doc.setFontSize(14);
  doc.setTextColor(107, 114, 128); // Gray color
  doc.text('Detailed Financial Analysis', 105, 30, { align: 'center' });
  
  // Add date
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 40, { align: 'center' });
  
  // Add horizontal line
  doc.setDrawColor(229, 231, 235); // Light gray
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);
  
  // Add summary section
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55); // Dark gray
  doc.text('Investment Summary', 20, 60);
  
  // Add cost information with styled box
  doc.setFillColor(243, 244, 246); // Light gray background
  doc.roundedRect(20, 65, 170, 25, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128); // Gray
  doc.text('Total Renovation Cost:', 30, 75);
  
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246); // Blue
  doc.text(formatCurrency(totalCost), 170, 75, { align: 'right' });
  
  // Add ROI information
  doc.setFillColor(243, 244, 246); // Light gray background
  doc.roundedRect(20, 95, 170, 25, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128); // Gray
  doc.text('Return on Investment (ROI):', 30, 105);
  
  doc.setFontSize(14);
  doc.setTextColor(16, 185, 129); // Green
  doc.text(`${roiPercent}%`, 170, 105, { align: 'right' });
  
  // Add projected value
  doc.setFillColor(243, 244, 246); // Light gray background
  doc.roundedRect(20, 125, 170, 25, 3, 3, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128); // Gray
  doc.text('Projected Added Value:', 30, 135);
  
  doc.setFontSize(14);
  doc.setTextColor(16, 185, 129); // Green
  doc.text(formatCurrency(projectedValue), 170, 135, { align: 'right' });
  
  // Add selected rooms section if rooms are selected
  let yPos = 165;
  
  if (selectedRooms && selectedRooms.length > 0) {
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55); // Dark gray
    doc.text('Selected Rooms for Renovation', 20, yPos);
    
    // Add selected rooms list
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    
    yPos += 10;
    selectedRooms.forEach((room, index) => {
      doc.setTextColor(59, 130, 246); // Blue
      doc.text(`• ${room}`, 30, yPos);
      yPos += 7;
    });
    
    yPos += 10;
  }
  
  // Add room breakdown section
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55); // Dark gray
  doc.text('Room-by-Room Breakdown', 20, yPos);
  
  // Add room cost table
  const rooms = [
    { name: 'Kitchen', percent: 25, cost: totalCost * 0.25 },
    { name: 'Bathrooms', percent: 20, cost: totalCost * 0.20 },
    { name: 'Living Areas', percent: 15, cost: totalCost * 0.15 },
    { name: 'Bedrooms', percent: 15, cost: totalCost * 0.15 },
    { name: 'Flooring', percent: 10, cost: totalCost * 0.10 },
    { name: 'Other Areas', percent: 15, cost: totalCost * 0.15 }
  ];
  
  // Table header
  doc.setFillColor(243, 244, 246);
  doc.rect(20, yPos + 5, 170, 10, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text('Room Type', 30, yPos + 12);
  doc.text('% of Budget', 100, yPos + 12);
  doc.text('Estimated Cost', 150, yPos + 12);
  
  // Table rows
  yPos += 22;
  rooms.forEach((room, index) => {
    const isEven = index % 2 === 0;
    if (!isEven) {
      doc.setFillColor(249, 250, 251);
      doc.rect(20, yPos - 7, 170, 10, 'F');
    }
    
    doc.setTextColor(31, 41, 55);
    doc.text(room.name, 30, yPos);
    doc.text(`${room.percent}%`, 100, yPos);
    doc.text(formatCurrency(room.cost), 150, yPos);
    
    yPos += 10;
  });
  
  // Add recommendations section
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55); // Dark gray
  doc.text('AI Recommendations', 20, yPos + 15);
  
  // Add recommendations
  doc.setFillColor(237, 242, 255); // Light blue background
  doc.roundedRect(20, yPos + 20, 170, 50, 3, 3, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor(59, 130, 246); // Blue
  doc.text('Budget Optimization:', 30, yPos + 30);
  
  doc.setFontSize(9);
  doc.setTextColor(31, 41, 55); // Dark gray
  
  let recommendationText = '';
  if (totalCost < 75000) {
    recommendationText = 'Consider focusing on high-impact areas like kitchens and bathrooms to maximize ROI. With your budget, mid-range finishes offer the best value.';
  } else if (totalCost < 150000) {
    recommendationText = 'Your budget allows for quality finishes in primary spaces. Consider premium finishes in kitchens and bathrooms, with mid-range elsewhere.';
  } else {
    recommendationText = 'With your premium budget, focus on architectural details and custom features that will set your property apart in the luxury market.';
  }
  
  const splitRecommendation = doc.splitTextToSize(recommendationText, 150);
  doc.text(splitRecommendation, 30, yPos + 40);
  
  // Add timeline estimate
  doc.setFontSize(10);
  doc.setTextColor(59, 130, 246); // Blue
  doc.text('Estimated Timeline:', 30, yPos + 55);
  
  doc.setFontSize(9);
  doc.setTextColor(31, 41, 55); // Dark gray
  
  let timelineText = '';
  if (totalCost < 75000) {
    timelineText = 'Estimated completion time: 2-3 months';
  } else if (totalCost < 150000) {
    timelineText = 'Estimated completion time: 3-5 months';
  } else {
    timelineText = 'Estimated completion time: 5-8 months';
  }
  
  doc.text(timelineText, 30, yPos + 65);
  
  // Add footer
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175); // Light gray
  doc.text('Generated by Renovation Vision • For planning purposes only', 105, 280, { align: 'center' });
  doc.text('Consult with a professional contractor for accurate quotes', 105, 285, { align: 'center' });
  
  // Save the PDF
  doc.save('renovation-estimate.pdf');
};
