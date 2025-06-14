import { User, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ApplicantData {
  name?: string;
  email?: string;
  contact?: string;
  address?: string;
}

interface FinalizeSectionProps {
  applicantData: ApplicantData;
  signature: string | null;
  onShowApplicantForm: () => void;
  onShowSignature: () => void;
}

export function FinalizeSection({ 
  applicantData, 
  signature, 
  onShowApplicantForm, 
  onShowSignature 
}: FinalizeSectionProps) {
  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3 font-light text-lg">
          <User className="w-5 h-5 text-gray-600" />
          <span>Application Setup</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          onClick={onShowApplicantForm}
          className="w-full justify-start hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light border-gray-200"
        >
          <User className="w-4 h-4 mr-3" />
          {applicantData?.name ? "Edit Details" : "Add Your Details"}
        </Button>
        <Button
          variant="outline"
          onClick={onShowSignature}
          className="w-full justify-start hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light border-gray-200"
        >
          <PenSquare className="w-4 h-4 mr-3" />
          {signature ? "Change Signature" : "Add Signature"}
        </Button>
      </CardContent>
    </Card>
  );
} 