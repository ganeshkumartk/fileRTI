import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRTIContent(content: string, userDetails: any): string {
  return content
    .replace(/\[USER_NAME\]/g, userDetails?.name || '[Your Name]')
    .replace(/\[USER_CONTACT\]/g, userDetails?.contact || '[Your Contact]')
    .replace(/\[USER_EMAIL\]/g, userDetails?.email || '[Your Email]')
    .replace(/\[DATE\]/g, new Date().toLocaleDateString('en-IN'))
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

export function exportToPDF(content: string, filename: string = 'rti-application.pdf', signature?: string | null) {
  // Create professional PDF-ready HTML content
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { 
          font-family: 'Times New Roman', serif; 
          line-height: 1.6; 
          margin: 40px;
          color: #333;
          font-size: 12pt;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 20px;
        }
        .title { 
          font-size: 18pt; 
          font-weight: bold; 
          margin-bottom: 10px;
        }
        .subtitle { 
          font-size: 14pt; 
          color: #666;
          margin-bottom: 5px;
        }
        .content { 
          margin-top: 20px;
          white-space: pre-wrap;
          text-align: justify;
        }
        .footer {
          margin-top: 40px;
          text-align: right;
        }
        .signature-section {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
        }
        .signature-line {
          border-top: 1px solid #333;
          width: 200px;
          text-align: center;
          padding-top: 5px;
          font-size: 10pt;
        }
        @page { 
          margin: 2cm; 
          size: A4;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">RIGHT TO INFORMATION APPLICATION</div>
        <div class="subtitle">सूचना का अधिकार अधिनियम, 2005 के अंतर्गत</div>
        <div class="subtitle">Under the Right to Information Act, 2005</div>
      </div>
      <div class="content">${content.replace(/\n/g, '<br>')}</div>
      <div class="signature-section">
        <div>
          <div style="margin-bottom: 50px;">Date: ${new Date().toLocaleDateString('en-IN')}</div>
          <div>Place: _________________</div>
        </div>
        <div class="signature-line">
          ${signature ? `<img src="${signature}" style="height: 60px; margin-bottom: 10px;" />` : '<div style="height: 60px; border-bottom: 1px solid #000; margin-bottom: 10px;"></div>'}
          <div>Applicant Signature</div>
        </div>
      </div>
    </body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace('.pdf', '.html');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  // Also trigger print dialog for PDF generation
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

export function exportToWord(content: string, filename: string = 'rti-application.docx', signature?: string | null) {
  // Create proper Word document format
  const wordContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' 
      xmlns:w='urn:schemas-microsoft-com:office:word' 
      xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='UTF-8'>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>90</w:Zoom>
      <w:DoNotPromptForConvert/>
    </w:WordDocument>
  </xml>
  <style>
    body { 
      font-family: 'Times New Roman', serif; 
      font-size: 12pt; 
      line-height: 1.6; 
      margin: 1in;
    }
    .header { 
      text-align: center; 
      margin-bottom: 30pt;
      border-bottom: 2pt solid black;
      padding-bottom: 20pt;
    }
    .title { 
      font-size: 16pt; 
      font-weight: bold; 
      margin-bottom: 10pt;
    }
    .subtitle { 
      font-size: 12pt; 
      margin-bottom: 5pt;
    }
    .content { 
      margin-top: 20pt;
      text-align: justify;
    }
    .signature-section {
      margin-top: 50pt;
      display: table;
      width: 100%;
    }
    .signature-left {
      display: table-cell;
      width: 50%;
    }
    .signature-right {
      display: table-cell;
      width: 50%;
      text-align: right;
    }
    .signature-line {
      border-top: 1pt solid black;
      width: 200pt;
      text-align: center;
      padding-top: 5pt;
      margin-top: 30pt;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="title">RIGHT TO INFORMATION APPLICATION</div>
    <div class="subtitle">सूचना का अधिकार अधिनियम, 2005 के अंतर्गत</div>
    <div class="subtitle">Under the Right to Information Act, 2005</div>
  </div>
  <div class="content">${content.replace(/\n/g, '<br>')}</div>
  <div class="signature-section">
    <div class="signature-left">
      <div style="margin-bottom: 50pt;">Date: ${new Date().toLocaleDateString('en-IN')}</div>
      <div>Place: _________________</div>
    </div>
    <div class="signature-right">
      <div class="signature-line">
        ${signature ? `<img src="${signature}" style="height: 60pt; margin-bottom: 10pt;" />` : '<div style="height: 60pt; border-bottom: 1pt solid black; margin-bottom: 10pt; width: 200pt;"></div>'}
        <div>Applicant Signature</div>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  // Create proper Word-compatible content with BOM
  const blob = new Blob(['\ufeff', wordContent], { 
    type: 'application/msword'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.replace('.docx', '.doc');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
