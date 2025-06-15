import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Scale, BookOpen, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { RelevantCases } from "./relevant-cases";
import { RTIActReference } from "./rti-act-reference";

interface LegalAssistantModalProps {
  onInsertText: (text: string) => void;
  children: React.ReactNode;
}

const defaultTemplates = [
  {
    title: 'Standard RTI Opening',
    text: 'I hereby request the following information under the Right to Information Act, 2005:'
  },
  {
    title: 'Fee Payment Statement',
    text: 'I am willing to pay the prescribed fee for obtaining the information as per the RTI Act, 2005.'
  },
  {
    title: 'Time Limit Reminder',
    text: 'Please provide the information within the stipulated time frame as per Section 7 of the RTI Act, 2005.'
  },
  {
    title: 'Penalty Warning',
    text: 'In case of delay or non-compliance, appropriate action under Section 18 of the RTI Act, 2005 may be initiated.'
  },
  {
    title: 'Appeal Intimation',
    text: 'If the information is not provided within the prescribed time limit, an appeal under Section 19 of the RTI Act will be filed.'
  }
];

export function LegalAssistantModal({ onInsertText, children }: LegalAssistantModalProps) {
  const [open, setOpen] = useState(false);

  const insertTemplate = (template: string) => {
    onInsertText(` ${template}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[85vh] p-0 overflow-hidden flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 border-b bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-light text-gray-900">Legal Assistant</DialogTitle>
              <p className="text-sm text-gray-600 font-light mt-1">
                Strengthen your RTI application with relevant case laws and legal references
              </p>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden flex flex-col">
          <Tabs defaultValue="sections" className="h-full flex flex-col">
            <div className="px-6 pt-4 pb-2 flex-shrink-0">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                <TabsTrigger value="sections" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-medium">RTI Sections</span>
                </TabsTrigger>
                <TabsTrigger value="cases" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Scale className="w-4 h-4" />
                  <span className="font-medium">Case Laws</span>
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">Templates</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-hidden px-6">
              <TabsContent value="sections" className="h-full mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <RTIActReference onInsertText={onInsertText} />
                </motion.div>
              </TabsContent>
              
              <TabsContent value="cases" className="h-full mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  <RelevantCases onInsertCase={onInsertText} />
                </motion.div>
              </TabsContent>

              <TabsContent value="templates" className="h-full mt-0">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="h-full flex flex-col"
                >
                  <div className="space-y-6 h-full flex flex-col">
                    <div className="flex-shrink-0">
                      <h3 className="text-2xl font-light text-gray-900 mb-2">Quick Templates</h3>
                      <p className="text-sm text-gray-600 font-light">
                        Ready-to-use text templates for common RTI application components
                      </p>
                    </div>
                    
                    <div className="flex-1 min-h-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full overflow-y-auto pb-6">
                        {defaultTemplates.map((template, index) => (
                          <div
                            key={index}
                            className="border border-gray-200 rounded-xl p-6 space-y-4 bg-white hover:shadow-sm hover:border-gray-300 transition-all h-fit"
                          >
                            <div className="space-y-3">
                              <h4 className="font-semibold text-base text-gray-900">{template.title}</h4>
                              <div className="text-sm">
                                <p className="font-medium text-gray-900 mb-2">Template Text</p>
                                <p className="text-gray-600 leading-relaxed italic">"{template.text}"</p>
                              </div>
                            </div>
                            <div className="pt-3 border-t border-gray-100">
                              <Button
                                size="sm"
                                className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                                onClick={() => insertTemplate(template.text)}
                              >
                                Insert Template
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        <div className="px-6 py-4 border-t bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>Click any template to insert it into your RTI application</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="bg-white hover:bg-gray-50"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 