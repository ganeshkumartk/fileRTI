import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';

interface RTIActReferenceProps {
  onInsertText: (text: string) => void;
}

const rtiSections = [
  {
    section: 'Section 2(f)',
    title: 'Information',
    content: '"information" means any material in any form, including records, documents, memos, e-mails, opinions, advices, press releases, circulars, orders, logbooks, contracts, reports, papers, samples, models, data material held in any electronic form',
    template: 'As per Section 2(f) of the RTI Act, 2005, "information" means any material in any form...'
  },
  {
    section: 'Section 2(h)',
    title: 'Public Authority',
    content: '"public authority" means any authority or body or institution of self-government established or constituted by or under the Constitution, by any other law made by Parliament or any State Legislature',
    template: 'Under Section 2(h) of the RTI Act, 2005, the said authority qualifies as a "public authority"...'
  },
  {
    section: 'Section 4',
    title: 'Suo Motu Disclosure',
    content: 'Every public authority shall maintain information in computerized form wherever possible and make it available through various means including websites',
    template: 'As mandated under Section 4 of the RTI Act, 2005, every public authority is required to...'
  },
  {
    section: 'Section 6(1)',
    title: 'Request for Information',
    content: 'A person who desires to obtain any information under this Act, shall make a request in writing or through electronic means in English or Hindi or in the official language of the area',
    template: 'This application is being made under Section 6(1) of the RTI Act, 2005...'
  },
  {
    section: 'Section 7(1)',
    title: 'Time Limit for Response',
    content: 'The public information officer shall, subject to the provisions of this Act, provide the information within thirty days of the receipt of the request',
    template: 'As per Section 7(1) of the RTI Act, 2005, the information is requested to be provided within 30 days...'
  },
  {
    section: 'Section 7(5)',
    title: 'Third Party Information',
    content: 'Where the information sought for concerns the life or liberty of a person, the same shall be provided within forty-eight hours of the receipt of the request',
    template: 'Since this information concerns life or liberty, as per Section 7(5), it must be provided within 48 hours...'
  },
  {
    section: 'Section 8',
    title: 'Exemptions',
    content: 'Information which would prejudicially affect the sovereignty and integrity of India, the security, strategic, scientific or economic interests of the State shall be exempt',
    template: 'The requested information does not fall under any exemptions listed in Section 8 of the RTI Act...'
  },
  {
    section: 'Section 18',
    title: 'Penalty',
    content: 'Where the Central Information Commission or the State Information Commission finds that the public information officer has, without any reasonable cause, refused to receive an application for information or has not furnished information within the time specified',
    template: 'In case of non-compliance, appropriate action under Section 18 of the RTI Act may be initiated...'
  },
  {
    section: 'Section 19',
    title: 'Appeal Process',
    content: 'Any person who does not receive a decision within the time specified or is aggrieved by a decision may prefer an appeal to such authority',
    template: 'If the information is not provided, an appeal under Section 19 of the RTI Act will be filed...'
  }
];

export const RTIActReference: React.FC<RTIActReferenceProps> = ({ onInsertText }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSections = rtiSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const insertTemplate = (template: string) => {
    onInsertText(` ${template}`);
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="space-y-4 flex-shrink-0">
        <div>
          <h3 className="text-2xl font-light text-gray-900 mb-2">RTI Act 2005 Sections</h3>
          <p className="text-sm text-gray-600 font-light">
            Quick access to essential RTI Act sections with ready-to-use templates
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search sections by title, number, or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <ScrollArea className="h-full">
          <div className="pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSections.map((section, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-xl p-6 space-y-4 bg-white hover:shadow-sm hover:border-gray-300 transition-all"
                >
                  {/* Header */}
                  <div className="space-y-3">
                    <Badge variant="outline" className="text-xs font-medium w-fit">
                      {section.section}
                    </Badge>
                    <h4 className="font-semibold text-base text-gray-900">{section.title}</h4>
                  </div>

                  {/* Content */}
                  <div className="text-sm">
                    <p className="font-medium text-gray-900 mb-2">Section Content</p>
                    <p className="text-gray-600 leading-relaxed italic">"{section.content}"</p>
                  </div>

                  {/* Action */}
                  <div className="pt-3 border-t border-gray-100">
                    <Button
                      size="sm"
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                      onClick={() => insertTemplate(section.template)}
                    >
                      Insert Template
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredSections.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="text-4xl mb-4">📄</div>
                <h5 className="font-medium text-lg text-gray-900 mb-2">No sections found</h5>
                <p className="text-sm text-gray-600 text-center max-w-sm">
                  We couldn't find any RTI Act sections matching your search. 
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