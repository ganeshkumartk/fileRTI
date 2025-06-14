import { Wand2, Type, Target } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ComposerMode = 'manual' | 'generate' | 'combined';

interface ComposerModeSelectionProps {
  mode: ComposerMode;
  onModeChange: (mode: ComposerMode) => void;
}

export function ComposerModeSelection({ mode, onModeChange }: ComposerModeSelectionProps) {
  return (
    <Tabs value={mode} onValueChange={(value) => onModeChange(value as ComposerMode)} className="w-full">
      <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-3 bg-gray-100 p-1 rounded-full h-12">
        <TabsTrigger
          value="generate"
          className="rounded-full font-light text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
        >
          <Wand2 className="w-4 h-4 mr-2" />
          AI Generate
        </TabsTrigger>
        <TabsTrigger
          value="manual"
          className="rounded-full font-light text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
        >
          <Type className="w-4 h-4 mr-2" />
          Manual Write
        </TabsTrigger>
        <TabsTrigger
          value="combined"
          className="rounded-full font-light text-gray-700 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm"
        >
          <Target className="w-4 h-4 mr-2" />
          Combined
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
} 