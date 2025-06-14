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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-light text-xl">Digital Signature</DialogTitle>
        </DialogHeader>
        <SignaturePad onSignature={handleSave} existingSignature={signature} />
        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light border-gray-200"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 