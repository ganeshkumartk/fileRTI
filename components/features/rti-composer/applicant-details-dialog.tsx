import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface ApplicantData {
  name?: string;
  email?: string;
  contact?: string;
  address?: string;
}

interface ApplicantDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicantData: ApplicantData;
  onSave: (data: ApplicantData) => void;
}

export function ApplicantDetailsDialog({ 
  open, 
  onOpenChange, 
  applicantData, 
  onSave 
}: ApplicantDetailsDialogProps) {
  const [formData, setFormData] = useState<ApplicantData>({
    name: applicantData?.name || "",
    email: applicantData?.email || "",
    contact: applicantData?.contact || "",
    address: applicantData?.address || ""
  });

  const handleSave = () => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-light text-xl">Your Personal Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="rounded-xl border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="rounded-xl border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact" className="text-sm font-medium">Contact Number</Label>
            <Input
              id="contact"
              value={formData.contact || ""}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="rounded-xl border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium">Address</Label>
            <Textarea
              id="address"
              value={formData.address || ""}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="rounded-xl border-gray-200 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-light">
            Save Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 