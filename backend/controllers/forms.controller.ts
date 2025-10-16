import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

// Define available forms
const availableForms = {
  'new-patient': {
    filename: 'new-patient-registration.pdf',
    displayName: 'New Patient Registration',
    description: 'Complete this form before your first visit',
    category: 'Registration'
  },
  'medical-history': {
    filename: 'medical-history-form.pdf',
    displayName: 'Medical History Form',
    description: 'Detailed medical history questionnaire',
    category: 'Medical Records'
  },
  'medication-list': {
    filename: 'medication-list.pdf',
    displayName: 'Medication List',
    description: 'Current medications and dosages',
    category: 'Medical Records'
  },
  'consent-forms': {
    filename: 'consent-forms.pdf',
    displayName: 'Consent Forms',
    description: 'Treatment consent and authorization',
    category: 'Legal'
  },
  'insurance-info': {
    filename: 'insurance-information.pdf',
    displayName: 'Insurance Information',
    description: 'Insurance and billing information',
    category: 'Billing'
  },
  'emergency-contact': {
    filename: 'emergency-contact.pdf',
    displayName: 'Emergency Contact',
    description: 'Emergency contact information',
    category: 'Contact'
  }
};

// Get all available forms
export const getAvailableForms = async (req: Request, res: Response): Promise<void> => {
  try {
    const forms = Object.entries(availableForms).map(([id, form]) => ({
      id,
      ...form,
      downloadUrl: `/api/forms/download/${id}`
    }));

    res.status(200).json({
      success: true,
      data: forms
    });
    return;

  } catch (error) {
    console.error('Get forms error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available forms',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return;
  }
};

// Download specific form
export const downloadForm = async (req: Request, res: Response): Promise<void> => {
  try {
    const { formId } = req.params;

    // Check if form exists
    if (!availableForms[formId as keyof typeof availableForms]) {
      res.status(404).json({
        success: false,
        message: 'Form not found'
      });
      return;
    }

    const form = availableForms[formId as keyof typeof availableForms];
    const formsDir = path.join(__dirname, '../public/forms');
    const filePath = path.join(formsDir, form.filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // Create a placeholder PDF if it doesn't exist
      await createPlaceholderPDF(filePath, form);
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${form.filename}"`);
    res.setHeader('Content-Length', fs.statSync(filePath).size);

    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

    // Log download for analytics
    console.log(`Form downloaded: ${formId} by IP: ${req.ip} at ${new Date().toISOString()}`);

  } catch (error) {
    console.error('Download form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download form',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return;
  }
};

// Create a placeholder PDF (simple text-based PDF)
const createPlaceholderPDF = async (filePath: string, form: any) => {
  try {
    // Create a simple PDF content
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
100 700 Td
(${form.displayName}) Tj
0 -20 Td
(${form.description}) Tj
0 -40 Td
(This is a placeholder form. In a real implementation,) Tj
0 -20 Td
(this would be the actual PDF form.) Tj
0 -40 Td
(Please contact the hospital for the official form.) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000524 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
625
%%EOF`;

    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write the PDF content
    fs.writeFileSync(filePath, pdfContent);

    console.log(`Created placeholder PDF: ${filePath}`);

  } catch (error) {
    console.error('Error creating placeholder PDF:', error);
  }
};

// Get form categories
export const getFormCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = [...new Set(Object.values(availableForms).map(form => form.category))];
    
    res.status(200).json({
      success: true,
      data: categories
    });
    return;

  } catch (error) {
    console.error('Get form categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch form categories',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return;
  }
};
