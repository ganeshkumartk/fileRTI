import { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, Pen, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SignaturePadProps {
  onSignature?: (signature: string) => void;
  className?: string;
  existingSignature?: string | null;
}

export default function SignaturePad({ onSignature, className = "", existingSignature }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'draw' | 'upload'>('draw');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set drawing styles
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load existing signature if provided
    if (existingSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setHasSignature(true);
      };
      img.src = existingSignature;
    }
  }, [existingSignature]);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(
      (e.clientX - rect.left) * scaleX,
      (e.clientY - rect.top) * scaleY
    );
    setIsDrawing(true);
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.lineTo(
      (e.clientX - rect.left) * scaleX,
      (e.clientY - rect.top) * scaleY
    );
    ctx.stroke();
  }, [isDrawing]);

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    setHasSignature(true);
    
    // Remove auto-save on draw - let user explicitly save
    // const canvas = canvasRef.current;
    // if (canvas && onSignature) {
    //   onSignature(canvas.toDataURL());
    // }
  }, []);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setUploadedImage(null);
  }, []);

  const handleSaveSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas && onSignature) {
      onSignature(canvas.toDataURL());
    }
  }, [onSignature]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas and draw uploaded image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Scale image to fit canvas
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        
        setUploadedImage(event.target?.result as string);
        setHasSignature(true);
        
        // Remove auto-save on upload - let user explicitly save
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [onSignature]);

  return (
    <div className={className}>
      <div className="space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900 text-center sm:text-left">हस्ताक्षर / Signature</h3>
          <div className="flex gap-1 sm:gap-2 justify-center sm:justify-end">
            <Button
              variant={activeTab === 'draw' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('draw')}
              className={cn(
                "flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3",
                activeTab === 'draw' 
                  ? "bg-gray-900 text-white hover:bg-gray-800" 
                  : "hover:bg-gray-900 hover:text-gray-50"
              )}
            >
              <Pen className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Draw</span>
              <span className="sm:hidden">Draw</span>
            </Button>
            <Button
              variant={activeTab === 'upload' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('upload')}
              className={cn(
                "flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3",
                activeTab === 'upload' 
                  ? "bg-gray-900 text-white hover:bg-gray-800" 
                  : "hover:bg-gray-900 hover:text-gray-50"
              )}
            >
              <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Upload</span>
              <span className="sm:hidden">Upload</span>
            </Button>
          </div>
        </div>

        <Separator />

        {activeTab === 'draw' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="relative">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const mouseEvent = new MouseEvent('mousedown', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                  });
                  startDrawing(mouseEvent as any);
                }}
                onTouchMove={(e) => {
                  e.preventDefault();
                  const touch = e.touches[0];
                  const mouseEvent = new MouseEvent('mousemove', {
                    clientX: touch.clientX,
                    clientY: touch.clientY
                  });
                  draw(mouseEvent as any);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  stopDrawing();
                }}
                className="border-2 border-dashed border-slate-300 rounded-lg cursor-crosshair w-full h-36 sm:h-48 bg-white"
                style={{ touchAction: 'none' }}
                width={400}
                height={200}
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-slate-400 text-xs sm:text-sm text-center px-2">यहाँ हस्ताक्षर करें / Sign here</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 sm:p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="signature-upload"
              />
              <label
                htmlFor="signature-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                <p className="text-xs sm:text-sm text-slate-600">
                  Click to upload signature image
                </p>
                <p className="text-xs text-slate-400">
                  PNG, JPG up to 5MB
                </p>
              </label>
            </div>
            
            {uploadedImage && (
              <div className="mt-3 sm:mt-4">
                <canvas
                  ref={canvasRef}
                  className="border rounded-lg w-full h-36 sm:h-48 bg-white"
                />
              </div>
            )}
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 pt-3 sm:pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearSignature}
            disabled={!hasSignature}
            className="flex items-center justify-center gap-2 hover:bg-gray-900 hover:text-gray-50 w-full sm:w-auto"
          >
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            Clear
          </Button>

          {hasSignature && (
            <Button
              onClick={handleSaveSignature}
              size="sm"
              className="bg-gray-900 text-white hover:bg-gray-800 w-full sm:w-auto"
            >
              Save Signature
            </Button>
          )}
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-md">
          <strong>Note:</strong> Your signature will be embedded in the RTI application document. 
          Make sure it matches your official signature for government correspondence.
        </div>
      </div>
    </div>
  );
} 