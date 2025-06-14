import { Download, Eye, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ActionsSectionProps {
  onPreview: () => void;
  onExportPDF: () => void;
  onExportWord: () => void;
  onShare: () => void;
}

export function ActionsSection({ 
  onPreview, 
  onExportPDF, 
  onExportWord, 
  onShare 
}: ActionsSectionProps) {
  return (
    <Card className="border border-gray-200 shadow-sm bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-3 font-light text-lg">
          <Download className="w-5 h-5 text-gray-600" />
          <span>Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          className="w-full justify-start hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light"
          variant="outline"
          onClick={onPreview}
        >
          <Eye className="w-4 h-4 mr-3" />
          Preview Application
        </Button>
        <Separator />
        <Button
          className="w-full justify-start hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light"
          variant="ghost"
          onClick={onExportPDF}
        >
          <FileText className="w-4 h-4 mr-3" />
          Export as PDF
        </Button>
        <Button
          className="w-full justify-start hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light"
          variant="ghost"
          onClick={onExportWord}
        >
          <FileText className="w-4 h-4 mr-3" />
          Export as Word
        </Button>
        <Button
          className="w-full justify-start hover:bg-gray-900 hover:text-gray-50 rounded-xl font-light"
          variant="ghost"
          onClick={onShare}
        >
          <Share2 className="w-4 h-4 mr-3" />
          Copy to Clipboard
        </Button>
      </CardContent>
    </Card>
  );
} 