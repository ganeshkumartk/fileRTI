# PDF Generation System

This directory contains the clean, production-ready PDF generation system for RTI applications.

## Files

- `generator.tsx` - Main PDF document generator with React-PDF
- `index.ts` - Clean exports for the PDF generation functions

## Usage

### From Components
```typescript
import { exportToPDF } from '@/lib/utils'

// Export RTI content to PDF
await exportToPDF(content, 'filename.pdf', signature, userDetails)
```

### Direct Usage
```typescript
import { createRTIPDFDocument } from '@/lib/pdf'

// Create PDF document component
const doc = createRTIPDFDocument(content, signature, userDetails)
```

## Features

- Professional government document styling
- Proper Declaration centering and formatting
- Bold address sections with comma-split formatting
- Numbered lists for Information Requested sections
- Signature placement between "Yours Faithfully" and applicant details
- TipTap HTML content preservation
- A4 page format with proper margins

## Architecture

The system uses a single, efficient PDF generation pipeline:

1. **HTML Parsing**: Advanced parser handles TipTap's HTML structure
2. **Content Processing**: Formats addresses, lists, and declarations properly
3. **React-PDF Generation**: Creates professional PDF documents
4. **Client-side Export**: Downloads directly in browser

## Removed Components

The following unused components were removed during cleanup:
- `components/pdf/pdf-generator.tsx` - Unused PDFGenerator component
- `components/pdf/rti-document.tsx` - Unused RTIDocument component  
- `components/pdf/pdf-preview.tsx` - Unused preview component
- `app/api/rti/pdf/route.ts` - Unused API route
- `lib/pdf-utils.ts` - Unused utilities

All functionality is now consolidated into the efficient `lib/utils.ts` → `lib/pdf/generator.tsx` pipeline. 