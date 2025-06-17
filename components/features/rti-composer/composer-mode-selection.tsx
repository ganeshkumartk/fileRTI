import { Wand2, Type, Target, Brain } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ComposerMode = 'manual' | 'generate' | 'combined' | 'enhanced';

interface ComposerModeSelectionProps {
  mode: ComposerMode;
  onModeChange: (mode: ComposerMode) => void;
}

export function ComposerModeSelection({ mode, onModeChange }: ComposerModeSelectionProps) {
  return (
    <Tabs value={mode} onValueChange={(value) => onModeChange(value as ComposerMode)} className="w-full">
      <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-4 bg-gray-100 p-1 rounded-full h-11 sm:h-12">
        <TabsTrigger
          value="generate"
          className="rounded-full font-light text-xs sm:text-sm text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
        >
          <Wand2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">AI Generate</span>
          <span className="xs:hidden">AI</span>
        </TabsTrigger>
        <TabsTrigger
          value="enhanced"
          className="rounded-full font-light text-xs sm:text-sm text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
        >
          <Brain className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Enhanced AI</span>
          <span className="xs:hidden">Pro</span>
        </TabsTrigger>
        <TabsTrigger
          value="manual"
          className="rounded-full font-light text-xs sm:text-sm text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
        >
          <Type className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Manual Write</span>
          <span className="xs:hidden">Manual</span>
        </TabsTrigger>
        <TabsTrigger
          value="combined"
          className="rounded-full font-light text-xs sm:text-sm text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
        >
          <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Combined</span>
          <span className="xs:hidden">Mix</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
} 