import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge";
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

/**
 * Exports RTI content to PDF format
 * @param content - HTML content from editor
 * @param filename - Output filename (optional)
 * @param signature - Base64 signature image (optional)
 * @param userDetails - User details for document (optional)
 */
export async function exportToPDF(content: string, filename: string = 'rti-application.pdf', signature?: string | null, userDetails?: any) {
  try {
    // Dynamic import to avoid SSR issues with React-PDF
    const { pdf } = await import('@react-pdf/renderer');
    const { createRTIPDFDocument } = await import('./pdf');
    
    // Create the PDF document with userDetails
    const documentElement = createRTIPDFDocument(content, signature, userDetails);
    
    // Generate PDF blob
    const blob = await pdf(documentElement).toBlob();
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('Failed to generate PDF');
  }
}



export async function exportToWord(content: string, filename: string = 'rti-application.docx', signature?: string | null, userDetails?: any) {
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
  
  // Process signature in content
  let processedContent = content;
  if (signature) {
    processedContent = processedContent.replace(/\[Digital Signature\]/gi, '[Signature Attached]');
  }
  
  // Function to convert HTML content to DOCX paragraphs
  const convertHTMLToParagraphs = (htmlContent: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    return plainText.split('\n').filter(line => line.trim()).map(line => 
      new Paragraph({
        children: [
          new TextRun({
            text: line.trim(),
            size: 24,
          }),
        ],
        spacing: { after: 200 },
      })
    );
  };
  
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
        
        // TipTap content - Convert HTML to paragraphs
        ...(processedContent ? convertHTMLToParagraphs(processedContent) : []),
        
        // Signature section if signature exists
        ...(signature ? [
          new Paragraph({
            children: [createSignatureElement()],
            alignment: AlignmentType.RIGHT,
            spacing: { after: 200 },
          })
        ] : []),

        
        // Date - Left aligned
        new Paragraph({
          children: [
            new TextRun({
              text: `Date: ${currentDate}`,
              size: 22,
            }),
          ],
          alignment: AlignmentType.LEFT,
          spacing: { after: 200 },
        }),
        
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
