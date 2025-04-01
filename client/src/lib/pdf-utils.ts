import { Resume } from '@shared/schema';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generateResumePdf(resumeElement: HTMLElement, resume: Resume): Promise<void> {
  try {
    // Create a canvas from the resume element
    const canvas = await html2canvas(resumeElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    // Create a PDF document (A4 size)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // A4 dimensions in mm (width: 210mm, height: 297mm)
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Add the image to the PDF
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    // Save the PDF with the resume name
    const fileName = `${resume.title.replace(/\s+/g, '_')}_resume.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
}

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    // For simplicity, we'll just read the file as text in this example
    // In a real implementation, you would use a PDF parsing library like pdf.js or pdf-parse
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = (event) => {
        if (event.target?.result) {
          // Simulate extracting text from PDF
          // In a real implementation, you would parse the PDF content
          resolve("Extracted text from PDF would appear here");
        } else {
          reject(new Error("Failed to read file contents"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      
      reader.readAsText(file);
    });
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}