import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Resume } from '@shared/schema';

export async function generateResumePdf(resumeElement: HTMLElement, resume: Resume): Promise<void> {
  try {
    // Create PDF instance
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    // Get the scaling factor based on PDF size vs element size
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Generate canvas from HTML element
    const canvas = await html2canvas(resumeElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false,
      allowTaint: true,
    });
    
    // Calculate proper scaling to fit in PDF
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Split into multiple pages if needed
    if (imgHeight > pdfHeight) {
      let remainingHeight = canvas.height;
      let position = 0;
      
      while (remainingHeight > 0) {
        // Calculate height of the current slice
        const sliceHeight = Math.min(
          remainingHeight,
          (canvas.width * pdfHeight) / pdfWidth
        );
        
        // Create a temporary canvas for the slice
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = sliceHeight;
        
        // Draw the slice onto the temporary canvas
        const ctx = tempCanvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(
            canvas,
            0, position, canvas.width, sliceHeight,
            0, 0, canvas.width, sliceHeight
          );
        }
        
        // Add the slice to the PDF
        const imgData = tempCanvas.toDataURL('image/png');
        if (position > 0) {
          pdf.addPage();
        }
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        // Update position and remaining height
        position += sliceHeight;
        remainingHeight -= sliceHeight;
      }
    } else {
      // Add the entire canvas to the PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
    }
    
    // Save PDF with the resume name
    pdf.save(`${resume.title || 'resume'}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('pdf', file);
    
    const response = await fetch('/api/extract-pdf', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to extract text from PDF');
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    throw error;
  }
}
