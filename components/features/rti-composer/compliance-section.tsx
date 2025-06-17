import { CheckCircle2, AlertTriangle, Clock, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ComplianceResult {
  score: number;
  issues: string[];
  suggestions: string[];
  isCompliant: boolean;
  compliance_analysis: string;
}

interface ComplianceSectionProps {
  compliance: ComplianceResult;
  wordCount: number;
}

export function ComplianceSection({ compliance, wordCount }: ComplianceSectionProps) {
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  const [isIssuesExpanded, setIsIssuesExpanded] = useState(false);
  const [isSuggestionsExpanded, setIsSuggestionsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 95) return "Exceptional compliance";
    if (score >= 85) return "Good compliance";
    if (score >= 70) return "Basic compliance";
    if (score >= 50) return "Poor compliance";
    return "Critical issues";
  };

  // Parse key strengths from the compliance analysis
  const parseKeyStrengths = (analysis: string): string[] => {
    const strengthsSection = analysis.split('Key strengths:')[1];
    if (!strengthsSection) return [];
    
    const strengthsText = strengthsSection.split('.')[0];
    return strengthsText
      .split(/[,•]/)
      .map(item => item.replace(/✓/g, '').trim())
      .filter(item => item.length > 0)
      .map(item => item.charAt(0).toUpperCase() + item.slice(1));
  };

  // Parse areas needing attention
  const parseAreasNeedingAttention = (analysis: string): string[] => {
    const areasSection = analysis.split('Areas needing attention:')[1];
    if (!areasSection) return [];
    
    const areasText = areasSection.split('.')[0];
    return areasText
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map(item => item.charAt(0).toUpperCase() + item.slice(1));
  };

  const keyStrengths = parseKeyStrengths(compliance.compliance_analysis);
  const areasNeedingAttention = parseAreasNeedingAttention(compliance.compliance_analysis);

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <CheckCircle2 className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-light text-gray-900">Compliance</h3>
        </div>
        
        {/* Main Score Display */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg space-y-6">
          {/* Score Section */}
          <div className="text-center space-y-2">
            <div className={`text-5xl font-light ${getScoreColor(compliance.score)}`}>
              {compliance.score}%
            </div>
            <div className="space-y-1">
              <div className="text-lg font-medium text-gray-800">
                {getScoreDescription(compliance.score)}
              </div>
              <div className="text-sm text-gray-500">
                {compliance.isCompliant ? "RTI ready for submission" : "Requires improvements"}
              </div>
            </div>
            <div className="pt-2">
              <Badge 
                variant={compliance.isCompliant ? "default" : "destructive"} 
                className="font-medium px-4 py-1.5 text-sm"
              >
                {compliance.isCompliant ? "✓ Compliant" : "⚠ Issues"}
              </Badge>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-3 gap-4 text-center">
            {compliance.issues?.length > 0 ? (
              <div className="space-y-1">
                <div className="text-2xl font-medium text-red-600">
                  {compliance.issues.length}
                </div>
                <div className="text-sm text-gray-600">
                  Critical {compliance.issues.length === 1 ? 'Issue' : 'Issues'}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-medium text-green-600">0</div>
                <div className="text-sm text-gray-600">Issues</div>
              </div>
            )}

            {compliance.suggestions?.length > 0 ? (
              <div className="space-y-1">
                <div className="text-2xl font-medium text-amber-600">
                  {compliance.suggestions.length}
                </div>
                <div className="text-sm text-gray-600">
                  {compliance.suggestions.length === 1 ? 'Suggestion' : 'Suggestions'}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-2xl font-medium text-green-600">0</div>
                <div className="text-sm text-gray-600">Suggestions</div>
              </div>
            )}

            <div className="space-y-1">
              <div className="text-2xl font-medium text-gray-700">
                {wordCount}
              </div>
              <div className="text-sm text-gray-600">Words</div>
            </div>
          </div>
        </div>

        {/* Detailed Analysis - Expandable */}
        {compliance.compliance_analysis && (
          <Collapsible open={isAnalysisExpanded} onOpenChange={setIsAnalysisExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-gray-50/30 hover:bg-gray-50/50 border border-gray-200/30 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Detailed Analysis</span>
                {isAnalysisExpanded ? 
                  <ChevronDown className="h-4 w-4 text-gray-500" /> : 
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                }
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 mt-2">
              <div className="p-4 bg-white/80 rounded-lg border border-gray-200/30 space-y-4">
                {/* Overall Assessment */}
                <div>
                  <h5 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">Overall Assessment</h5>
                  <p className="text-sm text-gray-600 font-light leading-relaxed">
                    {compliance.compliance_analysis.split('.')[0]}.
                  </p>
                </div>
                
                {/* Compliance Status */}
                {compliance.compliance_analysis.includes('requirements met') && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">Compliance Status</h5>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <p className="text-sm text-gray-600 font-light leading-relaxed">
                        {compliance.compliance_analysis.split('.')[1]?.trim()}.
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Key Strengths */}
                {keyStrengths.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">Key Strengths</h5>
                    <div className="pl-3 border-l-2 border-green-200">
                      <ul className="space-y-1">
                        {keyStrengths.map((strength, index) => (
                          <li key={index} className="text-sm text-gray-600 font-light flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            <span>{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {/* Areas Needing Attention */}
                {areasNeedingAttention.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-700 mb-2 uppercase tracking-wide">Areas Needing Attention</h5>
                    <div className="pl-3 border-l-2 border-amber-200">
                      <ul className="space-y-1">
                        {areasNeedingAttention.map((area, index) => (
                          <li key={index} className="text-sm text-gray-600 font-light flex items-start gap-2">
                            <span className="text-amber-500 mt-1">•</span>
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Issues - Expandable */}
        {compliance.issues && compliance.issues.length > 0 && (
          <Collapsible open={isIssuesExpanded} onOpenChange={setIsIssuesExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-red-50/30 hover:bg-red-50/50 border border-red-200/30 rounded-lg">
                <span className="text-sm font-medium text-red-700">
                  {compliance.issues.length} Issue{compliance.issues.length > 1 ? 's' : ''} to Address
                </span>
                {isIssuesExpanded ? 
                  <ChevronDown className="h-4 w-4 text-red-500" /> : 
                  <ChevronRight className="h-4 w-4 text-red-500" />
                }
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <ul className="space-y-2 p-3 bg-white/80 rounded-lg border border-red-200/30">
                {compliance.issues.map((issue, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm">
                    <AlertTriangle className="w-4 h-4 mt-0.5 text-red-400 flex-shrink-0" />
                    <span className="text-red-600 font-light">{issue}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Suggestions - Expandable */}
        {compliance.suggestions && compliance.suggestions.length > 0 && (
          <Collapsible open={isSuggestionsExpanded} onOpenChange={setIsSuggestionsExpanded}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-amber-50/30 hover:bg-amber-50/50 border border-amber-200/30 rounded-lg">
                <span className="text-sm font-medium text-amber-700">
                  {compliance.suggestions.length} Suggestion{compliance.suggestions.length > 1 ? 's' : ''}
                </span>
                {isSuggestionsExpanded ? 
                  <ChevronDown className="h-4 w-4 text-amber-500" /> : 
                  <ChevronRight className="h-4 w-4 text-amber-500" />
                }
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <ul className="space-y-2 p-3 bg-white/80 rounded-lg border border-amber-200/30">
                {compliance.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start space-x-2 text-sm">
                    <AlertTriangle className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" />
                    <span className="text-amber-600 font-light">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Success State */}
        {(!compliance.issues || compliance.issues.length === 0) && (!compliance.suggestions || compliance.suggestions.length === 0) && (
          <div className="p-3 bg-green-50/30 border border-green-200/30 rounded-lg">
            <div className="text-sm text-green-700 flex items-center space-x-2 font-light">
              <CheckCircle2 className="w-4 h-4" />
              <span>Excellent! All RTI requirements met</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 