import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 60,
    paddingRight: 60,
    fontFamily: 'Times-Roman',
    fontSize: 11,
    lineHeight: 1.6,
    color: '#000000',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: '1 solid #E5E5E5',
  },
  headerTitle: {
    fontSize: 15,
    fontFamily: 'Times-Bold',
    marginBottom: 6,
    textTransform: 'uppercase',
    lineHeight: 1.2,
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 9,
    backgroundColor: '#F3F4F6',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 8,
    color: '#374151',
    fontFamily: 'Times-Italic',
    textAlign: 'center',
    alignSelf: 'center',
  },
  contentContainer: {
    flex: 1,
    marginBottom: 24,
  },
  paragraph: {
    marginBottom: 14,
    textAlign: 'justify',
    fontSize: 11,
    lineHeight: 1.7,
  },
  paragraphBold: {
    marginBottom: 12,
    textAlign: 'left',
    fontSize: 11,
    lineHeight: 1.6,
    fontFamily: 'Times-Bold',
  },
  addressLine: {
    marginBottom: 4,
    textAlign: 'left',
    fontSize: 11,
    lineHeight: 1.4,
    fontFamily: 'Times-Bold',
  },
  subjectLine: {
    marginBottom: 16,
    marginTop: 8,
    fontFamily: 'Times-Bold',
    fontSize: 11,
  },
  bold: {
    fontFamily: 'Times-Bold',
  },
  italic: {
    fontFamily: 'Times-Italic',
  },
  underline: {
    textDecoration: 'underline',
  },
  listItem: {
    marginBottom: 12,
    fontSize: 11,
    lineHeight: 1.6,
    flexDirection: 'row',
    marginLeft: 32,
    alignItems: 'flex-start',
  },
  listNumber: {
    width: 20,
    fontSize: 11,
    lineHeight: 1.6,
    textAlign: 'left',
    marginTop: 0,
  },
  listContent: {
    flex: 1,
    fontSize: 11,
    lineHeight: 1.6,
    textAlign: 'justify',
    paddingLeft: 6,
    marginTop: 0,
  },
  signature: {
    alignSelf: 'flex-start',
    marginTop: 4,
    marginBottom: 4,
  },
  signatureImage: {
    maxWidth: 120,
    maxHeight: 40,
    objectFit: 'contain',
  },
  declarationHeading: {
    fontFamily: 'Times-Bold',
    fontSize: 14,
    textTransform: 'uppercase',
    textAlign: 'center',
    letterSpacing: 1,
  },
  applicantDetails: {
    marginTop: 20,
    borderTop: '1 solid #E5E5E5',
    paddingTop: 16,
  },
  applicantRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  applicantLabel: {
    fontFamily: 'Times-Bold',
    width: 60,
    fontSize: 10,
  },
  applicantValue: {
    flex: 1,
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    fontFamily: 'Times-Italic',
    borderTop: '1 solid #CCC',
    paddingTop: 8,
    color: '#666',
  },
});

/**
 * Advanced HTML parser for TipTap content
 * Converts HTML from TipTap editor to React-PDF components with proper styling
 */
const parseHTMLToReactPDF = (htmlString: string) => {
  // Create DOM parser
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  
  let keyCounter = 0;
  let orderedListCounter = 0; // Global counter for ordered lists
  const elements: React.ReactElement[] = [];
  
  const processTextNode = (text: string): string => {
    return text.replace(/\u00A0/g, ' '); // Replace &nbsp; with regular spaces
  };
  
  // Function to format addresses by splitting on commas - ONLY for actual addresses
  const formatAddress = (text: string): React.ReactElement => {
    if (!text.includes(',')) {
      return <Text key={keyCounter++}>{text}</Text>;
    }
    
    const parts = text.split(',').map(part => part.trim()).filter(part => part);
    const formattedText = parts.join(',\n');
    
    return (
      <Text key={keyCounter++}>
        {formattedText}
      </Text>
    );
  };
  
  const processNode = (node: Node, inheritedStyles: any = {}, parentContext: string = ''): React.ReactElement | string | null => {
    // Text nodes
    if (node.nodeType === Node.TEXT_NODE) {
      const text = processTextNode(node.textContent || '');
      if (!text.trim()) return null;
      return text;
    }
    
    // Element nodes
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as Element;
      const tagName = element.tagName.toLowerCase();
      const textContent = element.textContent || '';
      
      // Process child nodes
      const children = Array.from(element.childNodes)
        .map(child => processNode(child, inheritedStyles, parentContext))
        .filter(child => child !== null && child !== '');
      
      const flatChildren = children;
      
      // Skip empty elements
      if (flatChildren.length === 0 && !['br', 'hr'].includes(tagName)) {
        return null;
      }
      
      // Build styles based on element and inheritance
      let elementStyles = { ...inheritedStyles };
      
      switch (tagName) {
        case 'h3':
        case 'h2':
        case 'h1':
          // Handle Address sections in headings (like <h3>To,<br>...</h3>)
          const trimmedText = textContent.trim();
          
          // Handle Declaration in headings
          if (trimmedText.toLowerCase() === 'declaration' || 
              (trimmedText.toLowerCase().includes('declaration') && trimmedText.length < 20)) {
            return (
              <View key={keyCounter++} style={{ 
                width: '100%', 
                alignItems: 'center', 
                marginTop: 16, 
                marginBottom: 16,
                justifyContent: 'center',
                flexDirection: 'row'
              }}>
                <Text style={styles.declarationHeading}>
                  DECLARATION
                </Text>
              </View>
            );
          }
          
          if (trimmedText.includes('To,') || trimmedText.includes('The SPIO') || 
              trimmedText.includes('Department')) {
            
            // Parse the inner HTML to handle <br> tags properly
            const innerHTML = element.innerHTML;
            let addressText = innerHTML
              .replace(/<br\s*\/?>/gi, ',') // Convert <br> to commas
              .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
              .replace(/&nbsp;/g, ' '); // Replace &nbsp;
            
            // Split by commas and clean up
            const addressParts = addressText.split(',')
              .map(part => part.trim())
              .filter(part => part && part !== ',');
            
            return (
              <View key={keyCounter++} style={{ marginBottom: 16 }}>
                {addressParts.map((part, index) => (
                  <Text key={`addr-${keyCounter++}-${index}`} style={styles.addressLine}>
                    {part}{index < addressParts.length - 1 ? ',' : ''}
                  </Text>
                ))}
              </View>
            );
          }
          
          // Regular heading
          return (
            <Text key={keyCounter++} style={{
              ...styles.paragraphBold,
              fontSize: tagName === 'h1' ? 14 : tagName === 'h2' ? 13 : 12,
              marginBottom: 16,
            }}>
              {flatChildren}
            </Text>
          );
          
        case 'p':
        case 'div':
          // Handle Declaration specially - FORCE CENTER with View wrapper
          const pText = textContent.trim();
          
          if (pText.toLowerCase() === 'declaration' || 
              (pText.toLowerCase().includes('declaration') && pText.length < 20)) {
            return (
              <View key={keyCounter++} style={{ 
                width: '100%', 
                alignItems: 'center', 
                marginTop: 16, 
                marginBottom: 16,
                justifyContent: 'center',
                flexDirection: 'row'
              }}>
                <Text style={styles.declarationHeading}>
                  DECLARATION
                </Text>
              </View>
            );
          }
          
          // Handle Subject line
          if (pText.startsWith('Subject:')) {
            return (
              <Text key={keyCounter++} style={styles.subjectLine}>
                {flatChildren}
              </Text>
            );
          }
          
          // Handle other bold/important lines
          if (pText.startsWith('Respected') || 
              pText.startsWith('Dear') ||
              pText.startsWith('Yours faithfully') ||
              pText.startsWith('Thank you')) {
            return (
              <Text key={keyCounter++} style={styles.paragraphBold}>
                {flatChildren}
              </Text>
            );
          }
          
          // Regular paragraph
          return (
            <Text key={keyCounter++} style={styles.paragraph}>
              {flatChildren}
            </Text>
          );
          
        case 'strong':
        case 'b':
          elementStyles.fontFamily = 'Times-Bold';
          return (
            <Text key={keyCounter++} style={elementStyles}>
              {flatChildren}
            </Text>
          );
          
        case 'em':
        case 'i':
          elementStyles.fontFamily = 'Times-Italic';
          return (
            <Text key={keyCounter++} style={elementStyles}>
              {flatChildren}
            </Text>
          );
          
        case 'u':
          elementStyles.textDecoration = 'underline';
          return (
            <Text key={keyCounter++} style={elementStyles}>
              {flatChildren}
            </Text>
          );
          
        case 'br':
          return '\n';
          
        case 'ul':
        case 'ol':
          orderedListCounter = 0;
          return (
            <View key={keyCounter++} style={{ marginBottom: 16 }}>
              {flatChildren}
            </View>
          );
          
        case 'li':
          orderedListCounter++;
          
          // Enhanced detection for Information Requested sections
          let isInformationRequested = false;
          let currentElement: Element | null = element;
          
          while (currentElement && !isInformationRequested) {
            const parentText = currentElement.textContent || '';
            if (parentText.toLowerCase().includes('information requested')) {
              isInformationRequested = true;
              break;
            }
            currentElement = currentElement.parentElement;
          }
          
          // Also check content patterns
          if (!isInformationRequested) {
            const itemText = textContent.toLowerCase();
            isInformationRequested = itemText.includes('provide') || 
                                   itemText.includes('list of all') ||
                                   itemText.includes('details of') ||
                                   itemText.includes('copies of') ||
                                   itemText.includes('furnish');
          }
          
          const listMarker = isInformationRequested ? `${orderedListCounter}.` : '•';
          
          return (
            <View key={keyCounter++} style={styles.listItem}>
              <Text style={styles.listNumber}>{listMarker}</Text>
              <Text style={styles.listContent}>{flatChildren}</Text>
            </View>
          );
          
        case 'h4':
        case 'h5':
        case 'h6':
          return (
            <Text key={keyCounter++} style={{
              ...styles.paragraphBold,
              fontSize: 12,
              marginBottom: 16,
              ...elementStyles
            }}>
              {flatChildren}
            </Text>
          );
          
        case 'span':
          const spanStyle = element.getAttribute('style') || '';
          if (spanStyle.includes('font-weight: bold') || spanStyle.includes('font-weight:bold')) {
            elementStyles.fontFamily = 'Times-Bold';
          }
          if (spanStyle.includes('font-style: italic') || spanStyle.includes('font-style:italic')) {
            elementStyles.fontFamily = 'Times-Italic';
          }
          if (spanStyle.includes('text-decoration: underline')) {
            elementStyles.textDecoration = 'underline';
          }
          
          return flatChildren.length === 1 && typeof flatChildren[0] === 'string' 
            ? flatChildren[0] 
            : (
              <Text key={keyCounter++} style={elementStyles}>
                {flatChildren}
              </Text>
            );
            
        default:
          return flatChildren.length === 1 && typeof flatChildren[0] === 'string' 
            ? flatChildren[0] 
            : (
              <Text key={keyCounter++} style={elementStyles}>
                {flatChildren}
              </Text>
            );
      }
    }
    
    return null;
  };
  
  // Process body content
  Array.from(doc.body.childNodes).forEach(node => {
    const element = processNode(node);
    if (element && typeof element !== 'string') {
      elements.push(element);
    } else if (typeof element === 'string' && element.trim()) {
      const text = element.trim();
      // Check if this is a standalone Declaration
      if (text.toLowerCase() === 'declaration' || 
          (text.toLowerCase().includes('declaration') && text.length < 20)) {
        elements.push(
          <View key={keyCounter++} style={{ 
            width: '100%', 
            alignItems: 'center', 
            marginTop: 16, 
            marginBottom: 16,
            justifyContent: 'center',
            flexDirection: 'row'
          }}>
            <Text style={styles.declarationHeading}>
              DECLARATION
            </Text>
          </View>
        );
      } else {
        elements.push(
          <Text key={keyCounter++} style={styles.paragraph}>
            {element}
          </Text>
        );
      }
    }
  });
  
  return elements;
};

/**
 * Process content with signature handling
 * Handles signature placement and content splitting for PDF generation
 */
const processContentForPDF = (htmlContent: string, signature?: string | null) => {
  // Clean up the HTML first
  let cleanHTML = htmlContent
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/>\s+</g, '><') // Remove spaces between tags
    .trim();
  
  // Check if applicant details are present in the content
  const hasApplicantInContent = /Applicant:/i.test(cleanHTML);
  
  // Handle signature placement
  const signaturePlaceholder = /\[Digital Signature\]/gi;
  const hasSignaturePlaceholder = signaturePlaceholder.test(cleanHTML);
  
  if (hasSignaturePlaceholder) {
    const parts = cleanHTML.split(signaturePlaceholder);
    return {
      beforeSignature: parseHTMLToReactPDF(parts[0] || ''),
      hasSignature: !!signature,
      afterSignature: parseHTMLToReactPDF(parts[1] || ''),
      hasApplicantInContent
    };
  } else {
    // No signature placeholder, put signature after "Yours faithfully"
    const faithfullyRegex = /(Yours\s+faithfully[,.]?)/i;
    if (faithfullyRegex.test(cleanHTML)) {
      const parts = cleanHTML.split(faithfullyRegex);
      const beforePart = parts[0] + (parts[1] || '');
      const afterPart = parts.slice(2).join('');
      
      return {
        beforeSignature: parseHTMLToReactPDF(beforePart),
        hasSignature: !!signature,
        afterSignature: parseHTMLToReactPDF(afterPart),
        hasApplicantInContent
      };
    } else {
      // No "Yours faithfully" found, put signature at the end
      return {
        beforeSignature: parseHTMLToReactPDF(cleanHTML),
        hasSignature: !!signature,
        afterSignature: [],
        hasApplicantInContent
      };
    }
  }
};

/**
 * Creates a professional RTI PDF document
 * @param content - HTML content from TipTap editor
 * @param signature - Base64 signature image (optional)
 * @param userDetails - User details for applicant section
 * @returns React-PDF Document component
 */
export const createRTIPDFDocument = (content: string, signature?: string | null, userDetails?: any) => {
  
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const processedContent = processContentForPDF(content, signature);
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            Application for Information under{'\n'}
            Right to Information Act, 2005
          </Text>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
            <View style={{ 
              backgroundColor: '#F3F4F6', 
              paddingVertical: 2, 
              paddingHorizontal: 8, 
              borderRadius: 8,
              alignSelf: 'center'
            }}>
              <Text style={{ 
                fontSize: 9, 
                color: '#374151', 
                fontFamily: 'Times-Italic',
                textAlign: 'center'
              }}>
                (As per Section 6(1) of RTI Act 2005)
              </Text>
            </View>
          </View>
        </View>
        
        {/* Main Content */}
        <View style={styles.contentContainer}>
          {processedContent.beforeSignature}
          
          {/* Signature */}
          {processedContent.hasSignature && signature && (
            <View style={styles.signature}>
              <Image style={styles.signatureImage} src={signature} />
            </View>
          )}
          
          {/* Content after signature */}
          {processedContent.afterSignature}
        </View>
        
        {/* Applicant Details - Only show if NOT already in content AND userDetails provided */}
        {!processedContent.hasApplicantInContent && userDetails && (
          <View style={styles.applicantDetails}>
            {userDetails.name && (
              <View style={styles.applicantRow}>
                <Text style={styles.applicantLabel}>Applicant:</Text>
                <Text style={styles.applicantValue}>{userDetails.name}</Text>
              </View>
            )}
            {userDetails.address && (
              <View style={styles.applicantRow}>
                <Text style={styles.applicantLabel}>Address:</Text>
                <Text style={styles.applicantValue}>{userDetails.address}</Text>
              </View>
            )}
            {userDetails.contact && (
              <View style={styles.applicantRow}>
                <Text style={styles.applicantLabel}>Phone:</Text>
                <Text style={styles.applicantValue}>{userDetails.contact}</Text>
              </View>
            )}
            {userDetails.email && (
              <View style={styles.applicantRow}>
                <Text style={styles.applicantLabel}>Email:</Text>
                <Text style={styles.applicantValue}>{userDetails.email}</Text>
              </View>
            )}
            <View style={styles.applicantRow}>
              <Text style={styles.applicantLabel}>Date:</Text>
              <Text style={styles.applicantValue}>{currentDate}</Text>
            </View>
          </View>
        )}
        
        {/* Footer - Fixed on every page */}
        <View fixed style={styles.footer}>
          <Text>
            This Application is generated by FileRTI platform in compliance with the Right to Information Act, 2005
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export const RTIPDFDocument: React.FC<{ content: string; signature?: string | null; userDetails?: any }> = ({ content, signature, userDetails }) => {
  return createRTIPDFDocument(content, signature, userDetails);
}; 