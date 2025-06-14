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
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] sm:h-[85vh] md:h-[90vh] flex flex-col p-0 sm:p-6">
        <DialogHeader className="sr-only">
          <DialogTitle>RTI Application Preview</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <DocumentPreview
            content={content}
            title={`RTI Application - ${applicantDetails?.name || 'Untitled'}`}
            applicantDetails={applicantDetails || undefined}
            signature={signature}
            departmentName={departmentName}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
} 