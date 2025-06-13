import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import useVoiceInput from "@/hooks/use-voice-input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface VoiceInputProps {
  size?: "small" | "medium" | "large";
  onTranscript?: (text: string) => void;
  className?: string;
}

export default function VoiceInput({ 
  size = "medium", 
  onTranscript,
  className 
}: VoiceInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isListening, transcript, startListening, stopListening } = useVoiceInput({
    onResult: (text) => {
      onTranscript?.(text);
      setIsModalOpen(false);
    }
  });

  const handleStart = () => {
    setIsModalOpen(true);
    startListening();
  };

  const handleStop = () => {
    stopListening();
    setIsModalOpen(false);
  };

  const handleUseText = () => {
    if (transcript) {
      onTranscript?.(transcript);
    }
    stopListening();
    setIsModalOpen(false);
  };

  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-10 h-10", 
    large: "w-12 h-12"
  };

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.04 }}
        onClick={handleStart}
        className={cn(
          "relative bg-gradient-to-br from-slate-50 to-slate-100 hover:from-indigo-50 hover:to-blue-50",
          "border border-slate-200/60 hover:border-indigo-300/60 backdrop-blur-sm",
          "transition-all duration-300 flex items-center justify-center group",
          "shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 rounded-lg",
          sizeClasses[size],
          className
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg" />
        <Mic className="w-4 h-4 text-slate-600 group-hover:text-indigo-700 transition-all duration-300 relative z-10" />
      </motion.button>

      {/* Voice Input Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Voice Input Active</DialogTitle>
            <DialogDescription className="text-center">
              Speak your RTI query in Hindi or English...
            </DialogDescription>
          </DialogHeader>
          
          <div className="text-center mb-6">
            <motion.div 
              className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4"
              animate={isListening ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isListening ? 'listening' : 'idle'}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                >
                  {isListening ? (
                    <MicOff className="text-white text-2xl" />
                  ) : (
                    <Mic className="text-white text-2xl" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
          
          {/* Transcript Display */}
          <div className="mb-6">
            <div className="bg-gray-100 rounded-soft p-4 min-h-[100px] text-left">
              <p className="text-gray-700 italic">
                {transcript || "Listening for your voice..."}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={handleStop}
            >
              <Square className="w-4 h-4 mr-2" />
              Stop
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleUseText}
              disabled={!transcript}
            >
              Use Text
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
