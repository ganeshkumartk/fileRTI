import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface RelevantCasesProps {
  onInsertCase: (caseText: string) => void;
}

const landmarkCases = [
  {
    title: 'Central Information Commission v. State of Manipur',
    citation: '(2011) 15 SCC 1',
    year: '2011',
    court: 'Supreme Court',
    principle: 'RTI Act overrides Official Secrets Act',
    summary: 'The Supreme Court held that the RTI Act, being a later and special legislation, would override the Official Secrets Act in case of conflict.',
    relevance: 'Use when information is denied citing Official Secrets Act',
    template: 'As held by the Hon\'ble Supreme Court in Central Information Commission v. State of Manipur (2011) 15 SCC 1, the RTI Act overrides the Official Secrets Act...'
  },
  {
    title: 'Institute of Chartered Accountants v. Shaunak H. Satya',
    citation: '(2011) 8 SCC 781',
    year: '2011',
    court: 'Supreme Court',
    principle: 'Professional bodies are public authorities',
    summary: 'Professional regulatory bodies substantially financed by government are public authorities under RTI Act.',
    relevance: 'Use for RTI applications to professional bodies',
    template: 'As clarified in Institute of Chartered Accountants v. Shaunak H. Satya (2011) 8 SCC 781, professional bodies substantially financed by government are public authorities...'
  },
  {
    title: 'Girish Ramchandra Deshpande v. CIC',
    citation: '(2013) 1 SCC 212',
    year: '2013',
    court: 'Supreme Court',
    principle: 'Political parties are public authorities',
    summary: 'Political parties substantially funded by government are public authorities under RTI Act.',
    relevance: 'Use for RTI applications to political parties',
    template: 'Following the landmark judgment in Girish Ramchandra Deshpande v. CIC (2013) 1 SCC 212, political parties are public authorities under RTI...'
  },
  {
    title: 'Raj Narain v. State of UP',
    citation: 'AIR 1975 SC 865',
    year: '1975',
    court: 'Supreme Court',
    principle: 'Right to information is fundamental right',
    summary: 'Right to information is implicit in the right to freedom of speech and expression under Article 19(1)(a).',
    relevance: 'Foundational case for right to information',
    template: 'The right to information has been recognized as a fundamental right in Raj Narain v. State of UP AIR 1975 SC 865...'
  },
  {
    title: 'S.P. Gupta v. Union of India',
    citation: 'AIR 1982 SC 149',
    year: '1982',
    court: 'Supreme Court',
    principle: 'Open government and transparency',
    summary: 'Government functioning should be transparent and open to public scrutiny.',
    relevance: 'Supporting transparency in governance',
    template: 'As emphasized in S.P. Gupta v. Union of India AIR 1982 SC 149, government functioning must be transparent and open to scrutiny...'
  },
  {
    title: 'Board of Control for Cricket v. CIC',
    citation: '(2019) 20 SCC 670',
    year: '2019',
    court: 'Supreme Court',
    principle: 'Sports bodies as public authorities',
    summary: 'Sports bodies performing public functions and receiving substantial government funding are public authorities.',
    relevance: 'RTI applications to sports organizations',
    template: 'In light of Board of Control for Cricket v. CIC (2019) 20 SCC 670, sports bodies performing public functions are covered under RTI...'
  },
  {
    title: 'Ajay Hasia v. Khalid Mujib',
    citation: 'AIR 1981 SC 487',
    year: '1981',
    court: 'Supreme Court',
    principle: 'State within Article 12',
    summary: 'Test for determining whether a body is "State" - government control, deep and pervasive state control.',
    relevance: 'Determining public authority status',
    template: 'Applying the Ajay Hasia test from AIR 1981 SC 487, the authority exhibits deep and pervasive state control...'
  },
  {
    title: 'Namit Sharma v. Union of India',
    citation: '(2013) 1 SCC 745',
    year: '2013',
    court: 'Supreme Court',
    principle: 'Third party consultation',
    summary: 'Third party consultation provisions of RTI Act cannot be used to indefinitely delay information.',
    relevance: 'When information involves third parties',
    template: 'As clarified in Namit Sharma v. Union of India (2013) 1 SCC 745, third party provisions cannot be used to delay information indefinitely...'
  }
];

function CaseCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-xl p-6 space-y-4 bg-white">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

export const RelevantCases: React.FC<RelevantCasesProps> = ({ onInsertCase }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Simulate loading for demo purposes
  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const filteredCases = landmarkCases.filter(caseItem =>
    caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.principle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    caseItem.relevance.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const insertCaseReference = (template: string) => {
    onInsertCase(` ${template}`);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="space-y-4 flex-shrink-0">
        <div>
          <h3 className="text-2xl font-light text-gray-900 mb-2">Landmark Case Laws</h3>
          <p className="text-sm text-gray-600 font-light">
            Strengthen your RTI application with precedent-setting judicial decisions
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by case name, principle, or court..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 h-12 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
          />
        </div>
      </div>
      
      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="pb-6">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => <CaseCardSkeleton key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCases.map((caseItem, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6 space-y-4 bg-white hover:shadow-sm hover:border-gray-300 transition-all"
                  >
                    {/* Header */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-base text-gray-900 leading-tight">{caseItem.title}</h4>
                      <p className="text-sm text-gray-500 font-mono">{caseItem.citation}</p>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-medium">
                          {caseItem.court}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-medium">
                          {caseItem.year}
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Legal Principle</p>
                        <p className="text-gray-700">{caseItem.principle}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900 mb-1">Summary</p>
                        <p className="text-gray-600 leading-relaxed">{caseItem.summary}</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-gray-900 mb-1">When to Use</p>
                        <p className="text-gray-600">{caseItem.relevance}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-3 border-t border-gray-100">
                      <Button
                        size="sm"
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                        onClick={() => insertCaseReference(caseItem.template)}
                      >
                        Insert Reference
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(
                          `https://indiankanoon.org/search/?formInput=${encodeURIComponent(caseItem.title)}`,
                          '_blank'
                        )}
                        className="hover:bg-gray-50"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && filteredCases.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-4xl mb-4">⚖️</div>
                <h5 className="font-medium text-lg text-gray-900 mb-2">No cases found</h5>
                <p className="text-sm text-gray-600 text-center max-w-sm">
                  We couldn't find any cases matching your search.
                  Try different keywords or clear your search.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSearchTerm("")}
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}; 