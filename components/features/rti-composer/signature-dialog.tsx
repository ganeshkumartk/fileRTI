import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import SignaturePad from "@/components/forms/signature-pad";

interface SignatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  signature: string | null;
  onSave: (signature: string) => void;
}

export function SignatureDialog({ 
  open, 
  onOpenChange, 
  signature, 
  onSave 
}: SignatureDialogProps) {
  const handleSave = (newSignature: string) => {
    onSave(newSignature);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] max-w-2xl mx-auto rounded-xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <DialogTitle className="font-light text-lg sm:text-xl text-center sm:text-left">Digital Signature</DialogTitle>
        </DialogHeader>
        <div className="px-2 sm:px-0">
          <SignaturePad onSignature={handleSave} existingSignature={signature} />
        </div>
        <DialogFooter className="mt-4 pt-4 border-t flex-col sm:flex-row gap-2 sm:gap-0">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="w-full sm:w-auto hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light border-gray-200"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 