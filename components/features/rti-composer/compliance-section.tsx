import { CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ComplianceResult {
  score: number;
  issues: string[];
}

interface ComplianceSectionProps {
  compliance: ComplianceResult;
  wordCount: number;
}

export function ComplianceSection({ compliance, wordCount }: ComplianceSectionProps) {
  return (
    <div className="space-y-4">
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-3 font-light text-lg">
            <CheckCircle2 className="w-5 h-5 text-gray-600" />
            <span>Compliance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium text-sm">Score</span>
            <Badge variant="secondary" className="bg-gray-100 text-gray-900 font-light">
              {compliance.score}%
            </Badge>
          </div>
          <ul className="space-y-2">
            {compliance.issues.map((issue, i) => (
              <li key={i} className="flex items-start space-x-2 text-xs">
                <AlertTriangle className="w-3 h-3 mt-0.5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-600 font-light">{issue}</span>
              </li>
            ))}
            {compliance.issues.length === 0 && (
              <div className="text-xs text-gray-700 flex items-center space-x-2 font-light">
                <CheckCircle2 className="w-3 h-3" />
                <span>All requirements met</span>
              </div>
            )}
          </ul>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Card className="border border-gray-200 shadow-sm bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 text-xs text-gray-600 font-light">
            <Clock className="w-4 h-4" />
            <span>Auto-saved • {wordCount} words</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 