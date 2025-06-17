import OpenAI from 'openai';
import { z } from 'zod';

// Get API key with proper error handling
const getApiKey = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error('GEMINI_API_KEY environment variable is not set');
    console.error('Available env vars:', Object.keys(process.env).filter(k => k.includes('GEMINI')));
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  
  // Handle URL-encoded keys
  try {
    return decodeURIComponent(key);
  } catch {
    return key;
  }
};

// Create client function to initialize at runtime
const createGeminiClient = () => {
  return new OpenAI({
    apiKey: getApiKey(),
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai",
    defaultHeaders: {
      'Content-Type': 'application/json'
    }
  });
};

// RTI Content Schema for structured output
export const RTIContentSchema = z.object({
  to_section: z.object({
    authority_type: z.enum(["CPIO", "SPIO"]).describe("Type of information officer"),
    department_name: z.string().describe("Full department/ministry name"),
    address: z.string().describe("Complete official address")
  }).describe("Properly formatted recipient information"),
  subject: z.string().describe("Professional subject line for the RTI application"),
  introduction: z.object({
    reason: z.string().describe("Possible reason or context for requesting information"),
    rti_reference: z.string().describe("Opening statement with Section 6(1) reference")
  }).describe("Introduction with reason and RTI Act reference"),
  information_requested: z.array(z.object({
    point: z.string().describe("Specific information point requested without justification")
  })).describe("Clean list of information being requested"),
  content_justification: z.array(z.object({
    information_point: z.string().describe("Reference to information point"),
    justification: z.string().describe("Why this specific information is needed and relevant")
  })).describe("Detailed justification for each information request"),
  legal_references: z.array(z.object({
    case_name: z.string().describe("Name of the case (CIC/SC/HC)"),
    citation: z.string().describe("Proper legal citation"),
    relevance: z.string().describe("How this case law supports the request")
  })).describe("Relevant case laws from CIC, Supreme Court, or High Courts only"),
  declaration: z.object({
    payment_options: z.array(z.string()).describe("Available payment methods for application fee"),
    declarations: z.array(z.string()).describe("Legal declarations and statements")
  }).describe("Declaration section with payment and legal statements"),
  formatting: z.object({
    tone: z.enum(["formal", "urgent", "followup"]).describe("Tone of the application"),
    structure: z.enum(["standard", "detailed", "brief"]).describe("Structure complexity"),
    emphasis: z.array(z.string()).describe("Key points to emphasize")
  }).describe("Formatting and presentation guidelines")
});

export type RTIContent = z.infer<typeof RTIContentSchema>;

// Enhanced RTI Generation with structured output
export async function generateRTIWithStructuredOutput({
  query,
  department,
  applicantDetails,
  tone = "formal",
  useThinking = false,
  context
}: {
  query: string;
  department: string;
  applicantDetails?: {
    name?: string;
    address?: string;
    phone?: string;
    email?: string;
  };
  tone?: "formal" | "urgent" | "followup";
  useThinking?: boolean;
  context?: string;
}) {
  try {
    const systemPrompt = `You are an expert RTI (Right to Information) application generator for India. Create professional, legally compliant RTI applications following the RTI Act 2005.

Key Requirements:
- Follow RTI Act 2005 guidelines strictly
- Use formal, respectful language
- Include relevant case laws from CIC/Supreme Court/High Courts only
- Structure information clearly with proper formatting
- Ensure compliance with Indian legal standards
- Make applications specific and actionable
- Avoid repetition in To section
- Provide clear justifications for information requests
- Include proper declarations with payment options
- Write reason as a continuation phrase (lowercase, no period) that flows naturally in sentence: "I hereby request information related to [your reason]"
- Ensure proper sentence structure and avoid arbitrary capitalization
- When dealing with compliance issues, delays, or lack of implementation, use specific keywords like "compliance", "non-compliance", "delay", "lack of", "failure" in the reason
- For transparency/accountability requests, use keywords like "transparency", "accountability", "monitoring"
${useThinking ? '\n- Think step-by-step about the legal requirements and structure the application carefully\n- Consider the specific department and context when crafting the application\n- Ensure maximum compliance and minimal rejection risk' : ''}

CRITICAL: You must respond with a valid JSON object that follows this exact structure:
{
  "to_section": {
    "authority_type": "CPIO|SPIO",
    "department_name": "Full department/ministry name",
    "address": "Complete official address"
  },
  "subject": "Professional subject line for the RTI application",
  "introduction": {
    "reason": "Brief reason phrase (lowercase, no period) that flows in sentence - e.g. 'understanding birth registration procedures'",
    "rti_reference": "Opening statement with Section 6(1) reference"
  },
  "information_requested": [
    {
      "point": "Specific information point requested without justification"
    }
  ],
  "content_justification": [
    {
      "information_point": "Reference to information point",
      "justification": "Why this specific information is needed and relevant"
    }
  ],
  "legal_references": [
    {
      "case_name": "Name of the case (CIC/SC/HC)",
      "citation": "Proper legal citation",
      "relevance": "How this case law supports the request"
    }
  ],
  "declaration": {
    "payment_options": ["Available payment methods for application fee"],
    "declarations": ["Legal declarations and statements"]
  },
  "formatting": {
    "tone": "formal|urgent|followup",
    "structure": "standard|detailed|brief",
    "emphasis": ["Key points to emphasize"]
  }
}

DO NOT wrap this object in an array. Return ONLY the single JSON object above.
Generate a structured RTI application that government officials will take seriously and respond to promptly.`;

    const userPrompt = `Create an RTI application with the following details:

Query: ${query}
Department: ${department}
${context ? `Additional Context: ${context}` : ''}
${applicantDetails?.name ? `Applicant: ${applicantDetails.name}` : ''}
Tone: ${tone}

Ensure the application is professional, legally sound, and follows RTI Act 2005 requirements. Include relevant case laws from CIC, Supreme Court, or High Courts that support the information request.`;

    const client = createGeminiClient();
    
    const requestBody: any = {
      model: "gemini-2.0-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: {
        type: "json_object"
      }
    };

    // Note: Thinking config is not supported in OpenAI-compatible interface
    // The enhanced reasoning is built into the system prompt instead

    console.log('Making Gemini API request with body:', JSON.stringify(requestBody, null, 2));
    
    const response = await client.chat.completions.create(requestBody);

    const messageContent = response.choices[0].message.content;
    
    if (!messageContent) {
      throw new Error('Failed to generate content');
    }

    let structuredContent: RTIContent;
    try {
      structuredContent = JSON.parse(messageContent);
      structuredContent = RTIContentSchema.parse(structuredContent);
    } catch (parseError) {
      console.error('Failed to parse structured content:', parseError);
      console.error('Raw message content:', messageContent);
      throw new Error('Failed to generate structured content');
    }

    return {
      structured: structuredContent,
      formatted: formatRTIForTiptap(structuredContent, applicantDetails),
      thinking: useThinking ? "Enhanced reasoning applied during generation for better compliance and structure." : null
    };

  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate RTI application');
  }
}

// Helper function to determine department context based on content
function getDepartmentContext(content: RTIContent): string {
  const reason = content.introduction.reason.toLowerCase();
  const emphasis = content.formatting.emphasis || [];
  
  // Check for compliance, non-compliance, or process issues
  if (reason.includes('compliance') || reason.includes('non-compliance') || 
      reason.includes('violation') || reason.includes('breach')) {
    return 'compliance with statutory functions and processes of your department';
  }
  
  // Check for lack of implementation or delays
  if (reason.includes('lack of') || reason.includes('delay') || 
      reason.includes('pending') || reason.includes('failure')) {
    return 'implementation and execution of mandated functions by your department';
  }
  
  // Check for transparency and accountability issues
  if (reason.includes('transparency') || reason.includes('accountability') || 
      reason.includes('audit') || reason.includes('monitoring')) {
    return 'functioning and accountability mechanisms of your department';
  }
  
  // Check for policy or procedural information
  if (reason.includes('policy') || reason.includes('procedure') || 
      reason.includes('guideline') || reason.includes('rule')) {
    return 'policies, procedures and operational guidelines of your department';
  }
  
  // Check if it's about specific processes mentioned in emphasis
  if (emphasis.some(item => item.toLowerCase().includes('function') || 
                           item.toLowerCase().includes('process'))) {
    return 'specific functions and processes as detailed in the information requested';
  }
  
  // Default generic case
  return 'functions and processes of your department';
}

// Format structured content for TipTap editor
function formatRTIForTiptap(content: RTIContent, applicantDetails?: any): string {
  const currentDate = new Date().toLocaleDateString("en-IN");
  const applicantName = applicantDetails?.name || '[Name]';
  const applicantAddress = applicantDetails?.address || '[Address]';
  const applicantPhone = applicantDetails?.phone || '[Phone]';
  const applicantEmail = applicantDetails?.email || '[Email]';
  
  const html = `
    <div class="rti-application">
      <h3>To,<br>
      The ${content.to_section.authority_type},<br>
      ${content.to_section.department_name},<br>
      ${content.to_section.address}</h3>
      
      <p><strong>Subject:</strong> ${content.subject}</p>
      
      <p>Respected Sir/Madam,</p>
      
      <p>I, <strong>${applicantName}</strong>, a citizen of India, hereby request the following specific information related to <strong>${content.introduction.reason.toLowerCase().replace(/\.$/, '')}</strong> under Section 6(1) of the Right to Information Act, 2005, pertaining to the <strong>${getDepartmentContext(content)}</strong>.</p>
      
      <p><strong>Information Requested:</strong></p>
      <ol>
        ${content.information_requested.map(item => 
          `<li>${item.point}</li>`
        ).join('')}
      </ol>
      
      <p>I am enclosing the application fee of Rs. 10/- as required under the RTI Act through one of the following approved payment methods:</p>
      
      <p>${content.declaration.payment_options.join('<br>')}</p>
      
      <h2 style="text-align: center;">Declaration</h2>
      
      <p>I declare that I am a citizen of India. I hereby affirm that the information sought is for my personal use and not for commercial purposes. I undertake to use the information received responsibly and in accordance with the law.</p>
      
      <p>I request that the information be provided to me as soon as possible, and within the statutory time frame of 30 days as stipulated in the RTI Act, 2005.</p>
      
      <p>I state that the information sought does not fall within the restriction contained in Section 8 & 9 of the RTI Act and to the best of my knowledge it pertains to your office. If not, kindly transfer to relevant Public Authority under Section 6(3) of the RTI Act, 2005.</p>
      
      <p>Thank you for your attention to this matter. I look forward to receiving the requested information promptly.</p>
      
      <p><strong>Yours faithfully,</strong></p>
      
      <p><strong>[Digital Signature]</strong></p>
      
      <p><strong>Applicant:</strong> ${applicantName}</p>
      
      <p><strong>Address:</strong> ${applicantAddress}</p>
      
      <p><strong>Phone:</strong> ${applicantPhone}</p>
      
      <p><strong>Email:</strong> ${applicantEmail}</p>
      
      <p><strong>[Date:</strong> ${currentDate}]</p>
    </div>
  `;
  
  return html;
}

// Stream RTI generation for real-time updates
export async function generateRTIStream({
  query,
  department,
  applicantDetails,
  onUpdate
}: {
  query: string;
  department: string;
  applicantDetails?: any;
  onUpdate: (content: string) => void;
}) {
  try {
    const systemPrompt = `Generate a professional RTI application following RTI Act 2005 guidelines. Stream the content progressively for real-time updates.`;
    
    const userPrompt = `Create RTI application for: ${query} to ${department}`;

    const client = createGeminiClient();
    const stream = await client.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      stream: true,
    });

    let fullContent = '';
    
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      fullContent += delta;
      
      if (delta) {
        onUpdate(fullContent);
      }
    }

    return fullContent;
    
  } catch (error) {
    console.error('Streaming error:', error);
    throw new Error('Failed to stream RTI generation');
  }
}

// Validate generated content for RTI compliance
export function validateRTICompliance(content: string): {
  isCompliant: boolean;
  issues: string[];
  suggestions: string[];
  score: number;
  compliance_analysis: string;
} {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;
  let compliance_points: string[] = [];
  
  // Basic content check
  if (!content || content.trim().length === 0) {
    issues.push('No content to analyze');
    return {
      isCompliant: false,
      issues,
      suggestions: ['Add content to your RTI application'],
      score: 0,
      compliance_analysis: 'Please add content to analyze compliance.'
    };
  }
  
  // CRITICAL REQUIREMENTS (Major deductions)
  
  // 1. RTI Act Reference (MANDATORY - 25% deduction)
  if (!content.includes('Right to Information Act') && !content.includes('RTI Act')) {
    issues.push('Missing mandatory RTI Act reference');
    score -= 25;
  } else {
    compliance_points.push('Contains RTI Act reference');
  }
  
  // 2. Proper Authority (MANDATORY - 20% deduction)
  if (!content.includes('CPIO') && !content.includes('SPIO') && !content.includes('Public Information Officer')) {
    issues.push('Missing proper authority address (CPIO/SPIO)');
    score -= 20;
  } else {
    compliance_points.push('Addresses correct authority');
  }
  
  // 3. Declaration Section (MANDATORY - 20% deduction)
  if (!content.includes('Declaration') && !content.includes('declare') && !content.includes('I hereby affirm')) {
    issues.push('Missing mandatory declaration section');
    score -= 20;
  } else {
    compliance_points.push('Contains declaration');
  }
  
  // 4. Fee Information (MANDATORY - 15% deduction)
  if (!content.includes('Rs. 10/-') && !content.includes('application fee') && !content.includes('₹10')) {
    issues.push('Missing prescribed fee information');
    score -= 15;
  } else {
    compliance_points.push('Mentions application fee');
  }
  
  // IMPORTANT REQUIREMENTS (Medium deductions)
  
  // 5. Section 6(1) Reference (IMPORTANT - 10% deduction)
  if (!content.includes('Section 6(1)') && !content.includes('Sec 6(1)')) {
    issues.push('Missing Section 6(1) legal basis');
    score -= 10;
  } else {
    compliance_points.push('Includes Section 6(1) reference');
  }
  
  // 6. Specific Information Request (IMPORTANT - 10% deduction)
  if (!content.includes('Information Requested') && !content.includes('following information') && !content.includes('details') && content.length < 500) {
    issues.push('Lacks specific information requests');
    score -= 10;
  } else {
    compliance_points.push('Contains specific information requests');
  }
  
  // 7. Response Timeline (IMPORTANT - 8% deduction)
  if (!content.includes('30 days') && !content.includes('stipulated time') && !content.includes('time frame')) {
    issues.push('Missing response timeline requirement');
    score -= 8;
  } else {
    compliance_points.push('Mentions response timeline');
  }
  
  // COMPLIANCE ENHANCEMENTS (Smaller deductions)
  
  // 8. Section 8 & 9 Exemptions (5% deduction)
  if (!content.includes('Section 8') && !content.includes('Section 9')) {
    suggestions.push('Add Section 8 & 9 exemption clause');
    score -= 5;
  } else {
    compliance_points.push('References exemption sections');
  }
  
  // 9. Proper Salutation (3% deduction)
  if (!content.includes('Sir/Madam') && !content.includes('Respected Sir') && !content.includes('Dear Sir')) {
    suggestions.push('Use proper formal salutation');
    score -= 3;
  } else {
    compliance_points.push('Uses formal salutation');
  }
  
  // 10. Subject Line (3% deduction)
  if (!content.includes('Subject:') && !content.includes('Re:')) {
    suggestions.push('Add clear subject line');
    score -= 3;
  } else {
    compliance_points.push('Includes subject line');
  }
  
  // 11. Date (3% deduction)
  if (!content.includes('Date:') && !content.includes('[Date') && !content.includes('date')) {
    suggestions.push('Include application date');
    score -= 3;
  } else {
    compliance_points.push('Includes date');
  }
  
  // 12. Applicant Details (5% deduction)
  if (!content.includes('Applicant:') && !content.includes('Name:') && !content.includes('Address:')) {
    suggestions.push('Include complete applicant details');
    score -= 5;
  } else {
    compliance_points.push('Contains applicant details');
  }
  
  // CONTENT QUALITY CHECKS
  
  // 13. Adequate Length (5% deduction)
  if (content.length < 400) {
    issues.push('Application too brief for legal compliance');
    score -= 5;
  } else if (content.length > 300) {
    compliance_points.push('Adequate content length');
  }
  
  // 14. Professional Language (2% deduction)
  if (content.includes('please') || content.includes('kindly') || content.includes('request you')) {
    suggestions.push('Use assertive legal language instead of pleading');
    score -= 2;
  }
  
  // STRICT COMPLIANCE THRESHOLD
  const isCompliant = score >= 90 && issues.length === 0; // Even stricter threshold
  
  // Generate realistic compliance analysis
  const overallAssessment = 
    score >= 95 ? 'This RTI application demonstrates exceptional legal compliance and follows all mandatory requirements.' :
    score >= 85 ? 'This RTI application meets essential compliance requirements with minor areas for improvement.' :
    score >= 70 ? 'This RTI application has basic compliance but lacks several important elements.' :
    score >= 50 ? 'This RTI application requires significant improvements to meet legal standards.' :
    'This RTI application fails to meet basic RTI Act requirements and needs complete revision.';

  const statusDescription = 
    score >= 95 ? 'Excellent application with minimal rejection risk.' :
    score >= 85 ? 'Good application that should be accepted by most authorities.' :
    score >= 70 ? 'Acceptable application but may face scrutiny or delays.' :
    score >= 50 ? 'Weak application with high risk of rejection or return.' :
    'Application likely to be rejected without major revisions.';

  const compliance_analysis = `${overallAssessment} ${statusDescription} Key strengths: ${compliance_points.slice(0, 3).join(', ')}.${
    issues.length > 0 ? ` Critical issues: ${issues.slice(0, 2).join(', ')}.` : ''
  }`;
  
  return {
    isCompliant,
    issues,
    suggestions,
    score: Math.max(0, score),
    compliance_analysis
  };
} 