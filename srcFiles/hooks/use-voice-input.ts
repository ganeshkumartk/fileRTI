import { useState, useRef, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface UseVoiceInputOptions {
  onResult?: (text: string) => void;
  language?: string;
}

interface VoiceTranscriptionResponse {
  transcription: string;
  confidence: string;
  language: string;
}

export default function useVoiceInput({ 
  onResult, 
  language = "hi-IN" 
}: UseVoiceInputOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const transcribeMutation = useMutation({
    mutationFn: async (audioBlob: Blob) => {
      // Convert blob to base64 for API transmission
      const reader = new FileReader();
      return new Promise<VoiceTranscriptionResponse>((resolve, reject) => {
        reader.onloadend = async () => {
          try {
            const base64Audio = reader.result as string;
            const response = await apiRequest("POST", "/api/voice/transcribe", {
              audioData: base64Audio,
              language: language,
            });
            const data = await response.json();
            resolve(data);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error("Failed to read audio file"));
        reader.readAsDataURL(audioBlob);
      });
    },
    onSuccess: (data) => {
      setTranscript(data.transcription);
      onResult?.(data.transcription);
      toast({
        title: "Voice transcribed successfully",
        description: `Confidence: ${Math.round(parseFloat(data.confidence) * 100)}%`,
      });
    },
    onError: (error) => {
      console.error("Transcription error:", error);
      toast({
        title: "Transcription failed",
        description: "Please try speaking again or check your microphone.",
        variant: "destructive",
      });
    },
  });

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/wav" });
        transcribeMutation.mutate(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      setTranscript("");

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === "recording") {
          stopListening();
        }
      }, 30000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone access denied",
        description: "Please allow microphone access to use voice input.",
        variant: "destructive",
      });
    }
  }, [language, onResult, transcribeMutation, toast]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isTranscribing: transcribeMutation.isPending,
  };
}
