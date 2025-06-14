import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DocumentPreview from "@/components/shared/document-preview";

interface ApplicantData {
  name?: string;
  email?: string;
  contact?: string;
  address?: string;
}

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  applicantDetails: ApplicantData | null;
  signature: string | null;
  departmentName: string;
}

export function PreviewDialog({ 
  open, 
  onOpenChange, 
  content, 
  applicantDetails, 
  signature, 
  departmentName 
}: PreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>RTI Application Preview</DialogTitle>
        </DialogHeader>
        <DocumentPreview
          content={content}
          title={`RTI Application - ${applicantDetails?.name || 'Untitled'}`}
          applicantDetails={applicantDetails || undefined}
          signature={signature}
          departmentName={departmentName}
        />
      </DialogContent>
    </Dialog>
  );
} 