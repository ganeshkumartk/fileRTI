import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun, Footer } from 'docx';
import { saveAs } from 'file-saver';
import dayjs from "dayjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

// Generate a proper UUID v4
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function formatDate(dateString: string): string {
  return dayjs(dateString).format("DD/MM/YYYY")
}

export function formatRTIContent(content: string, userDetails: any, signature?: string | null, place?: string): string {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });

  let formattedContent = content
    .replace(/\[YOUR NAME\]/g, userDetails?.name || '[Your Name]')
    .replace(/\[YOUR ADDRESS\]/g, userDetails?.address || '[Your Address]')
    .replace(/\[YOUR CONTACT\]/g, userDetails?.contact || '[Your Contact]')
    .replace(/\[YOUR EMAIL\]/g, userDetails?.email || '[Your Email]')
    .replace(/\[USER_NAME\]/g, userDetails?.name || '[Your Name]')
    .replace(/\[USER_CONTACT\]/g, userDetails?.contact || '[Your Contact]')
    .replace(/\[USER_EMAIL\]/g, userDetails?.email || '[Your Email]')
    .replace(/\[DATE\]/g, currentDate)
    .replace(/\[PLACE\]/g, place || '[Your City]')

  // Add professional closing if not present
  if (!formattedContent.includes('Yours faithfully')) {
    formattedContent += `\n\nI am enclosing the application fee of Rs. 10/- as required under the RTI Act.\n\nPlease provide the information within the stipulated time period of 30 days as per the provisions of the Right to Information Act, 2005.\n\nThank you for your cooperation.\n\nYours faithfully,\n\n${userDetails?.name || '[Your Name]'}\n${userDetails?.address || '[Your Address]'}\nContact: ${userDetails?.contact || '[Your Contact]'}${userDetails?.email ? `\nEmail: ${userDetails.email}` : ''}`;
  }

  if (signature) {
    formattedContent += `\n\n\nDate: ${currentDate}${place ? `\nPlace: ${place}` : ''}\n\n(Digital Signature Attached)`;
  }
  
  return formattedContent;
}

export function getWordCount(text: string): number {
  if (!text || text.trim().length === 0) return 0;
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

export function validateRTICompliance(content: string): {
  isCompliant: boolean;
  issues: string[];
  score: number;
} {
  const issues: string[] = []
  let score = 100

  // Check for essential RTI elements
  if (!content.includes('Right to Information Act, 2005')) {
    issues.push('Missing reference to RTI Act 2005')
    score -= 20
  }

  if (!content.includes('Public Information Officer')) {
    issues.push('Missing addressee (Public Information Officer)')
    score -= 15
  }

  if (content.length < 100) {
    issues.push('Application too brief')
    score -= 10
  }

  if (content.length > 3000) {
    issues.push('Application exceeds character limit')
    score -= 10
  }

  return {
    isCompliant: issues.length === 0,
    issues,
    score: Math.max(score, 0)
  }
}

export async function exportToPDF(content: string, filename: string = 'rti-application.pdf', signature?: string | null, userDetails?: any, place?: string) {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });

  // Clean content from HTML tags and remove standard RTI text to avoid duplication
  let cleanContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  
  // Remove standard RTI texts that are already added by the PDF generator
  const standardTextsToRemove = [
    'I am enclosing the application fee of Rs. 10/- as required under the RTI Act.',
    'Please provide the information within the stipulated time period of 30 days as per the provisions of the Right to Information Act, 2005.',
    'Thank you for your cooperation.',
    'Yours faithfully,',
    'Dear Sir/Madam,',
    'Respected Sir/Madam,',
    userDetails?.departmentName || '[Department Name]',
    'To,',
    'To:',
    'The Public Information Officer,',
    'Subject: Request for Information under RTI Act 2005',
    'Subject:',
    'Request for Information under RTI Act 2005',
    `I, ${userDetails?.name || '[Your Name]'}, a citizen of India, hereby request the following information under the Right to Information Act, 2005:`,
    'I, , a citizen of India, hereby request the following information under the :',
    'I, , a citizen of India, hereby request the following information under the',
    'a citizen of India, hereby request the following information under the',
    'hereby request the following information under the',
    'citizen of India, hereby request the following information',
    'APPLICATION FOR INFORMATION UNDER',
    'RIGHT TO INFORMATION ACT, 2005',
    '(As per Section 6(1) of RTI Act 2005)',
    // Remove user details to prevent duplication
    userDetails?.name || '',
    userDetails?.address || '',
    userDetails?.contact || '',
    userDetails?.email || '',
    `Address: ${userDetails?.address || ''}`,
    `Contact: ${userDetails?.contact || ''}`,
    `Email: ${userDetails?.email || ''}`,
    'Contact:',
    'Email:',
    'Address:'
  ];
  
  // Remove each standard text (case insensitive)
  standardTextsToRemove.forEach(text => {
    const regex = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    cleanContent = cleanContent.replace(regex, '');
  });
  
  // Remove additional patterns with regex
  cleanContent = cleanContent.replace(/Subject:\s*Request for Information under RTI Act 2005/gi, '');
  cleanContent = cleanContent.replace(/Subject:\s*/gi, '');
  cleanContent = cleanContent.replace(/I,\s*,?\s*a citizen of India,?\s*hereby request the following information under the\s*:?/gi, '');
  cleanContent = cleanContent.replace(/I,\s*[^,]*,?\s*a citizen of India,?\s*hereby request the following information under the Right to Information Act,?\s*2005:?/gi, '');
  cleanContent = cleanContent.replace(/a citizen of India,?\s*hereby request the following information/gi, '');
  cleanContent = cleanContent.replace(/hereby request the following information under/gi, '');
  cleanContent = cleanContent.replace(/citizen of India,?\s*hereby request/gi, '');
  
  // Remove malformed patterns that occur with place/date processing
  cleanContent = cleanContent.replace(/I,\s*,\s*:/gi, '');
  cleanContent = cleanContent.replace(/I,\s*,\s*$/gi, '');
  cleanContent = cleanContent.replace(/I,\s*:\s*$/gi, '');
  cleanContent = cleanContent.replace(/^,\s*:/gi, '');
  cleanContent = cleanContent.replace(/^:\s*$/gi, '');
  
  // Remove date patterns, place patterns, signature patterns
  cleanContent = cleanContent.replace(/Date:\s*\d{2}\/\d{2}\/\d{4}/gi, '');
  cleanContent = cleanContent.replace(/Place:\s*\[.*?\]/gi, '');
  cleanContent = cleanContent.replace(/Place:\s*\w+/gi, '');
  cleanContent = cleanContent.replace(/\(Digital Signature Attached\)/gi, '');
  cleanContent = cleanContent.replace(/\(Signature\)/gi, '');
  
  // Clean up extra whitespace and line breaks
  cleanContent = cleanContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim();

  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = 20;

  // Header
  pdf.setFontSize(16);
  pdf.setFont('times', 'bold');
  pdf.text('APPLICATION FOR INFORMATION UNDER', pageWidth/2, yPosition, { align: 'center' });
  yPosition += 8;
  pdf.text('RIGHT TO INFORMATION ACT, 2005', pageWidth/2, yPosition, { align: 'center' });
  yPosition += 6;
  pdf.setFontSize(10);
  pdf.setFont('times', 'normal');
  pdf.text('(As per Section 6(1) of RTI Act 2005)', pageWidth/2, yPosition, { align: 'center' });
  yPosition += 20;

  // To section
  pdf.setFontSize(12);
  pdf.setFont('times', 'bold');
  pdf.text('To,', margin, yPosition);
  yPosition += 6;
  pdf.setFont('times', 'normal');
  pdf.text('The Public Information Officer,', margin + 5, yPosition);
  yPosition += 6;
  pdf.setFont('times', 'bold');
  pdf.text(userDetails?.departmentName || '[Department Name]', margin + 5, yPosition);
  yPosition += 15;

  // Subject
  pdf.setFont('times', 'bold');
  pdf.text('Subject: ', margin, yPosition);
  pdf.setFont('times', 'normal');
  pdf.text('Request for Information under RTI Act 2005', margin + 20, yPosition);
  yPosition += 15;

  // Salutation
  pdf.setFont('times', 'bold');
  pdf.text('Respected Sir/Madam,', margin, yPosition);
  yPosition += 15;

  // Main content
  pdf.setFont('times', 'normal');
  const introText = `I, ${userDetails?.name || '[Your Name]'}, a citizen of India, hereby request the following information under the Right to Information Act, 2005:`;
  const introLines = pdf.splitTextToSize(introText, pageWidth - 2 * margin);
  for (let line of introLines) {
    pdf.text(line, margin, yPosition);
    yPosition += 6;
  }
  yPosition += 8;

  // User content - Clean paragraph format
  if (cleanContent) {
    const contentLines = pdf.splitTextToSize(cleanContent, pageWidth - 2 * margin);
    for (let line of contentLines) {
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 6;
    }
  }
  yPosition += 8;

  // Standard RTI text
  const standardTexts = [
    'I am enclosing the application fee of Rs. 10/- as required under the RTI Act.',
    'Please provide the information within the stipulated time period of 30 days as per the provisions of the Right to Information Act, 2005.',
    'Thank you for your cooperation.'
  ];

  for (let text of standardTexts) {
    const lines = pdf.splitTextToSize(text, pageWidth - 2 * margin);
    for (let line of lines) {
      if (yPosition > pageHeight - 50) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, margin, yPosition);
      yPosition += 6;
    }
    yPosition += 6;
  }
  yPosition += 12;

  // Signature section - All right aligned
  const signatureX = pageWidth - margin - 30;
  pdf.text('Yours faithfully,', signatureX, yPosition);
  yPosition += 16;

  // Signature area - Right aligned
  if (signature) {
    // Add signature image if available
    try {
      pdf.addImage(signature, 'PNG', signatureX, yPosition - 15, 50, 15);
    } catch (e) {
      // Fallback if signature can't be added
      pdf.text('(Signature)', signatureX, yPosition);
    }
  } else {
    pdf.text('(Signature)', signatureX, yPosition);
  }
  
  pdf.setFont('times', 'bold');
  pdf.text(userDetails?.name || '[Your Name]', signatureX, yPosition + 8);
  
  // Date and Place - Left aligned
  pdf.setFont('times', 'normal');
  pdf.text(`Date: ${currentDate}`, margin, yPosition + 15);
  let datePlaceHeight = 14;
  if (place) {
    pdf.text(`Place: ${place}`, margin, yPosition + 22);
    datePlaceHeight = 20;
  }

  // Applicant contact info - Bottom with proper spacing and formatting
  if (userDetails?.address || userDetails?.contact || userDetails?.email) {
    yPosition += datePlaceHeight + 12;
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 20;
    }
    
    pdf.setFontSize(10);
    pdf.setFont('times', 'normal');
    
    if (userDetails?.address) {
      // Split address into multiple lines if too long
      const addressLines = pdf.splitTextToSize(`Address: ${userDetails.address}`, pageWidth - 2 * margin);
      for (let line of addressLines) {
        pdf.text(line, margin, yPosition);
        yPosition += 5;
      }
      yPosition += 2;
    }
    if (userDetails?.contact) {
      pdf.text(`Contact: ${userDetails.contact}`, margin, yPosition);
      yPosition += 7;
    }
    if (userDetails?.email) {
      pdf.text(`Email: ${userDetails.email}`, margin, yPosition);
    }
  }

  // Footer
  pdf.setFontSize(8);
  pdf.setFont('times', 'italic');
  pdf.text('This Application is generated by FileRTI platform in compliance with the Right to Information Act, 2005', pageWidth/2, pageHeight - 10, { align: 'center' });

  pdf.save(filename);
}

function formatContentForPDF(content: string, userDetails?: any): string {
  // First, remove standard RTI texts from HTML content (including their HTML tags)
  let htmlContent = content;
  
  const standardTextsToRemove = [
    'I am enclosing the application fee of Rs. 10/- as required under the RTI Act.',
    'Please provide the information within the stipulated time period of 30 days as per the provisions of the Right to Information Act, 2005.',
    'Thank you for your cooperation.',
    'Yours faithfully,',
    'Dear Sir/Madam,',
    'Respected Sir/Madam,',
    userDetails?.departmentName || '[Department Name]',
    'To,',
    'To:',
    'The Public Information Officer,',
    'Subject: Request for Information under RTI Act 2005',
    'Subject:',
    'Request for Information under RTI Act 2005',
    `I, ${userDetails?.name || '[Your Name]'}, a citizen of India, hereby request the following information under the Right to Information Act, 2005:`,
    'I, , a citizen of India, hereby request the following information under the :',
    'I, , a citizen of India, hereby request the following information under the',
    'a citizen of India, hereby request the following information under the',
    'hereby request the following information under the',
    'citizen of India, hereby request the following information',
    'APPLICATION FOR INFORMATION UNDER',
    'RIGHT TO INFORMATION ACT, 2005',
    '(As per Section 6(1) of RTI Act 2005)',
    // Remove user details to prevent duplication
    userDetails?.name || '',
    userDetails?.address || '',
    userDetails?.contact || '',
    userDetails?.email || '',
    `Address: ${userDetails?.address || ''}`,
    `Contact: ${userDetails?.contact || ''}`,
    `Email: ${userDetails?.email || ''}`,
    'Contact:',
    'Email:',
    'Address:'
  ];
  
  // Remove each standard text from HTML (including HTML tags that contain only these texts)
  standardTextsToRemove.forEach(text => {
    if (text && text.trim()) {
      const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Remove HTML elements that contain only this text (with optional whitespace and line breaks)
      const htmlTagRegex = new RegExp(`<[^>]*>\\s*${escapedText}\\s*<\\/[^>]*>`, 'gi');
      htmlContent = htmlContent.replace(htmlTagRegex, '');
      
      // Remove HTML paragraphs, divs, spans that contain this text
      const pTagRegex = new RegExp(`<p[^>]*>\\s*${escapedText}\\s*<\\/p>`, 'gi');
      const divTagRegex = new RegExp(`<div[^>]*>\\s*${escapedText}\\s*<\\/div>`, 'gi');
      const spanTagRegex = new RegExp(`<span[^>]*>\\s*${escapedText}\\s*<\\/span>`, 'gi');
      
      htmlContent = htmlContent.replace(pTagRegex, '');
      htmlContent = htmlContent.replace(divTagRegex, '');
      htmlContent = htmlContent.replace(spanTagRegex, '');
      
      // Remove the text itself (case insensitive)
      const textRegex = new RegExp(escapedText, 'gi');
      htmlContent = htmlContent.replace(textRegex, '');
    }
  });
  
  // Remove empty HTML tags that might be left behind
  htmlContent = htmlContent.replace(/<([^>]+)>\s*<\/\1>/gi, '');
  htmlContent = htmlContent.replace(/<p>\s*<\/p>/gi, '');
  htmlContent = htmlContent.replace(/<div>\s*<\/div>/gi, '');
  htmlContent = htmlContent.replace(/<span>\s*<\/span>/gi, '');
  htmlContent = htmlContent.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<br/>'); // Multiple br tags to single
  htmlContent = htmlContent.replace(/<br\s*\/?>\s*$/gi, ''); // br at end of content
  htmlContent = htmlContent.replace(/^\s*<br\s*\/?>/gi, ''); // br at start of content
  htmlContent = htmlContent.replace(/<br\s*\/?>(\s*<br\s*\/?>)+/gi, '<br/>'); // Multiple consecutive br tags
  
  // Remove malformed patterns that occur with place/date processing
  htmlContent = htmlContent.replace(/I,\s*,\s*:/gi, '');
  htmlContent = htmlContent.replace(/I,\s*,\s*$/gi, '');
  htmlContent = htmlContent.replace(/I,\s*:\s*$/gi, '');
  htmlContent = htmlContent.replace(/^,\s*:/gi, '');
  htmlContent = htmlContent.replace(/^:\s*$/gi, '');
  
  // Remove HTML tags and format for PDF
  let cleanContent = htmlContent
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');

  // Structure the content professionally
  const lines = cleanContent.split('\n').filter(line => line.trim());
  let formattedContent = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('To,') || line.startsWith('To:')) {
      formattedContent += `<div class="to-section"><p><strong>${line}</strong></p>`;
      // Add next few lines as address
      let j = i + 1;
      while (j < lines.length && !lines[j].startsWith('Subject') && !lines[j].startsWith('Dear')) {
        if (lines[j].trim()) {
          formattedContent += `<p>${lines[j].trim()}</p>`;
        }
        j++;
      }
      formattedContent += '</div>';
      i = j - 1;
    } else if (line.startsWith('Subject:')) {
      formattedContent += `<p class="subject">${line}</p>`;
    } else if (line.startsWith('Dear ') || line.startsWith('Respected ')) {
      formattedContent += `<p class="salutation">${line}</p>`;
    } else if (line.includes('hereby request') || line.includes('following information')) {
      formattedContent += `<p>${line}</p>`;
      // Check if next lines are the main request
      if (i + 1 < lines.length && !lines[i + 1].startsWith('I am enclosing')) {
        formattedContent += '<div class="main-request">';
        let j = i + 1;
        while (j < lines.length && !lines[j].startsWith('I am enclosing') && !lines[j].startsWith('Please provide')) {
          if (lines[j].trim()) {
            formattedContent += `<p>${lines[j].trim()}</p>`;
          }
          j++;
        }
        formattedContent += '</div>';
        i = j - 1;
      }
    } else if (line.startsWith('Yours faithfully') || line.startsWith('Thank you')) {
      formattedContent += `<div class="closing"><p>${line}</p>`;
      // Add remaining lines as closing
      let j = i + 1;
      while (j < lines.length) {
        if (lines[j].trim() && !lines[j].includes('Date:') && !lines[j].includes('Place:')) {
          formattedContent += `<p>${lines[j].trim()}</p>`;
        }
        j++;
      }
      formattedContent += '</div>';
      break;
    } else if (line && !line.includes('Date:') && !line.includes('Place:')) {
      formattedContent += `<p>${line}</p>`;
    }
  }

  return formattedContent;
}

export async function exportToWord(content: string, filename: string = 'rti-application.docx', signature?: string | null, userDetails?: any, place?: string) {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  });
  
  // First, remove standard RTI texts from HTML content (including their HTML tags)
  let htmlContent = content;
  
  const standardTextsToRemove = [
    'I am enclosing the application fee of Rs. 10/- as required under the RTI Act.',
    'Please provide the information within the stipulated time period of 30 days as per the provisions of the Right to Information Act, 2005.',
    'Thank you for your cooperation.',
    'Yours faithfully,',
    'Dear Sir/Madam,',
    'Respected Sir/Madam,',
    userDetails?.departmentName || '[Department Name]',
    'To,',
    'To:',
    'The Public Information Officer,',
    'Subject: Request for Information under RTI Act 2005',
    'Subject:',
    'Request for Information under RTI Act 2005',
    `I, ${userDetails?.name || '[Your Name]'}, a citizen of India, hereby request the following information under the Right to Information Act, 2005:`,
    'I, , a citizen of India, hereby request the following information under the :',
    'I, , a citizen of India, hereby request the following information under the',
    'a citizen of India, hereby request the following information under the',
    'hereby request the following information under the',
    'citizen of India, hereby request the following information',
    'APPLICATION FOR INFORMATION UNDER',
    'RIGHT TO INFORMATION ACT, 2005',
    '(As per Section 6(1) of RTI Act 2005)',
    // Remove user details to prevent duplication
    userDetails?.name || '',
    userDetails?.address || '',
    userDetails?.contact || '',
    userDetails?.email || '',
    `Address: ${userDetails?.address || ''}`,
    `Contact: ${userDetails?.contact || ''}`,
    `Email: ${userDetails?.email || ''}`,
    'Contact:',
    'Email:',
    'Address:'
  ];
  
  // Remove each standard text from HTML (including HTML tags that contain only these texts)
  standardTextsToRemove.forEach(text => {
    if (text && text.trim()) {
      const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Remove HTML elements that contain only this text (with optional whitespace and line breaks)
      const htmlTagRegex = new RegExp(`<[^>]*>\\s*${escapedText}\\s*<\\/[^>]*>`, 'gi');
      htmlContent = htmlContent.replace(htmlTagRegex, '');
      
      // Remove HTML paragraphs, divs, spans that contain this text
      const pTagRegex = new RegExp(`<p[^>]*>\\s*${escapedText}\\s*<\\/p>`, 'gi');
      const divTagRegex = new RegExp(`<div[^>]*>\\s*${escapedText}\\s*<\\/div>`, 'gi');
      const spanTagRegex = new RegExp(`<span[^>]*>\\s*${escapedText}\\s*<\\/span>`, 'gi');
      
      htmlContent = htmlContent.replace(pTagRegex, '');
      htmlContent = htmlContent.replace(divTagRegex, '');
      htmlContent = htmlContent.replace(spanTagRegex, '');
      
      // Remove the text itself (case insensitive)
      const textRegex = new RegExp(escapedText, 'gi');
      htmlContent = htmlContent.replace(textRegex, '');
    }
  });
  
  // Remove empty HTML tags that might be left behind
  htmlContent = htmlContent.replace(/<([^>]+)>\s*<\/\1>/gi, '');
  htmlContent = htmlContent.replace(/<p>\s*<\/p>/gi, '');
  htmlContent = htmlContent.replace(/<div>\s*<\/div>/gi, '');
  htmlContent = htmlContent.replace(/<span>\s*<\/span>/gi, '');
  htmlContent = htmlContent.replace(/<br\s*\/?>\s*<br\s*\/?>/gi, '<br/>'); // Multiple br tags to single
  htmlContent = htmlContent.replace(/<br\s*\/?>\s*$/gi, ''); // br at end of content
  htmlContent = htmlContent.replace(/^\s*<br\s*\/?>/gi, ''); // br at start of content
  htmlContent = htmlContent.replace(/<br\s*\/?>(\s*<br\s*\/?>)+/gi, '<br/>'); // Multiple consecutive br tags
  
  // Remove malformed patterns that occur with place/date processing
  htmlContent = htmlContent.replace(/I,\s*,\s*:/gi, '');
  htmlContent = htmlContent.replace(/I,\s*,\s*$/gi, '');
  htmlContent = htmlContent.replace(/I,\s*:\s*$/gi, '');
  htmlContent = htmlContent.replace(/^,\s*:/gi, '');
  htmlContent = htmlContent.replace(/^:\s*$/gi, '');
  
  // Clean content from HTML tags and convert entities
  let cleanContent = htmlContent.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
  
  // Remove date patterns, place patterns, signature patterns
  cleanContent = cleanContent.replace(/Date:\s*\d{2}\/\d{2}\/\d{4}/gi, '');
  cleanContent = cleanContent.replace(/Place:\s*\[.*?\]/gi, '');
  cleanContent = cleanContent.replace(/Place:\s*\w+/gi, '');
  cleanContent = cleanContent.replace(/\(Digital Signature Attached\)/gi, '');
  cleanContent = cleanContent.replace(/\(Signature\)/gi, '');
  
  // Clean up extra whitespace and line breaks
  cleanContent = cleanContent.replace(/\n\s*\n\s*\n/g, '\n\n').trim();
  
  // Helper function to create signature element
  const createSignatureElement = () => {
    if (signature) {
      try {
        // Extract base64 data and convert to buffer
        const base64Data = signature.includes(',') ? signature.split(',')[1] : signature;
        return new ImageRun({
          data: Buffer.from(base64Data, 'base64'),
          transformation: {
            width: 150,
            height: 50,
          },
          type: 'png',
        });
      } catch (error) {
        // Fallback to text if image fails
        return new TextRun({
          text: "(Digital Signature)",
          size: 20,
          italics: true,
        });
      }
    } else {
      return new TextRun({
        text: "(Signature)",
        size: 20,
      });
    }
  };
  
  const doc = new Document({
    sections: [{
      properties: {},
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "This Application is generated by FileRTI platform in compliance with the Right to Information Act, 2005",
                  size: 16,
                  italics: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        }),
      },
      children: [
        // Header
        new Paragraph({
          children: [
            new TextRun({
              text: "APPLICATION FOR INFORMATION UNDER",
              bold: true,
              size: 28,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "RIGHT TO INFORMATION ACT, 2005",
              bold: true,
              size: 28,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "As per Section 6(1) of RTI Act 2005",
              italics: true,
              size: 20,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 },
        }),
        
        // To Section
        new Paragraph({
          children: [
            new TextRun({
              text: "To,",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "The Public Information Officer,",
              size: 24,
            }),
          ],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: userDetails?.departmentName || "[Department Name]",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { after: 400 },
        }),
        
        // Subject
        new Paragraph({
          children: [
            new TextRun({
              text: "Subject: ",
              bold: true,
              size: 24,
            }),
            new TextRun({
              text: "Request for Information under RTI Act 2005",
              size: 24,
            }),
          ],
          spacing: { after: 400 },
        }),
        
        // Salutation
        new Paragraph({
          children: [
            new TextRun({
              text: "Respected Sir/Madam,",
              bold: true,
              size: 24,
            }),
          ],
          spacing: { after: 400 },
        }),
        
        // Main content
        new Paragraph({
          children: [
            new TextRun({
              text: `I, ${userDetails?.name || '[Your Name]'}, a citizen of India, hereby request the following information under the Right to Information Act, 2005:`,
              size: 24,
            }),
          ],
          spacing: { after: 400 },
        }),
        
        // User content - Clean paragraph format
        ...(cleanContent ? [new Paragraph({
          children: [
            new TextRun({
              text: cleanContent,
              size: 24,
            }),
          ],
          spacing: { after: 400 },
        })] : []),
        
        // Standard RTI text
        new Paragraph({
          children: [
            new TextRun({
              text: "I am enclosing the application fee of Rs. 10/- as required under the RTI Act.",
              size: 24,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Please provide the information within the stipulated time period of 30 days as per the provisions of the Right to Information Act, 2005.",
              size: 24,
            }),
          ],
          spacing: { after: 200 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Thank you for your cooperation.",
              size: 24,
            }),
          ],
          spacing: { after: 600 },
        }),
        
        // Signature section - Right aligned
        new Paragraph({
          children: [
            new TextRun({
              text: "Yours faithfully,",
              size: 24,
            }),
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 300 },
        }),
        // Signature image or placeholder
        new Paragraph({
          children: [createSignatureElement()],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: userDetails?.name || '[Your Name]',
              bold: true,
              size: 24,
            }),
          ],
          alignment: AlignmentType.RIGHT,
          spacing: { after: 200 },
        }),

        
        // Date and place - Left aligned
        new Paragraph({
          children: [
            new TextRun({
              text: `Date: ${currentDate}`,
              size: 22,
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 100 },
        }),
        ...(place ? [new Paragraph({
          children: [
            new TextRun({
              text: `Place: ${place}`,
              size: 22,
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 200 },
        })] : [new Paragraph({
          children: [new TextRun({ text: "", size: 22 })],
          spacing: { after: 200 },
        })]),
        
        // Applicant contact info
        ...(userDetails?.address ? [new Paragraph({
          children: [
            new TextRun({
              text: `Address: ${userDetails.address}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })] : []),
        ...(userDetails?.contact ? [new Paragraph({
          children: [
            new TextRun({
              text: `Contact: ${userDetails.contact}`,
              size: 20,
            }),
          ],
          spacing: { after: 100 },
        })] : []),
        ...(userDetails?.email ? [new Paragraph({
          children: [
            new TextRun({
              text: `Email: ${userDetails.email}`,
              size: 20,
            }),
          ],
          spacing: { after: 200 },
        })] : []),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  saveAs(new Blob([buffer]), filename);
}
