import { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Upload, Pen, RotateCcw, Download } from 'lucide-react';
import { motion } from 'framer-motion';

interface SignaturePadProps {
  onSignatureChange?: (signature: string | null) => void;
  className?: string;
}

export default function SignaturePad({ onSignatureChange, className = "" }: SignaturePadProps) {
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
  }, []);

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
    
    const canvas = canvasRef.current;
    if (canvas && onSignatureChange) {
      onSignatureChange(canvas.toDataURL());
    }
  }, [onSignatureChange]);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    setUploadedImage(null);
    
    if (onSignatureChange) {
      onSignatureChange(null);
    }
  }, [onSignatureChange]);



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
        
        if (onSignatureChange) {
          onSignatureChange(canvas.toDataURL());
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [onSignatureChange]);

  return (
    <Card className={`p-6 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">हस्ताक्षर / Signature</h3>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'draw' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('draw')}
              className="flex items-center gap-2"
            >
              <Pen className="w-4 h-4" />
              Draw
            </Button>
            <Button
              variant={activeTab === 'upload' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('upload')}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload
            </Button>
          </div>
        </div>

        <Separator />

        {activeTab === 'draw' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="border-2 border-dashed border-slate-300 rounded-lg cursor-crosshair w-full h-48 bg-white"
                style={{ touchAction: 'none' }}
                width={400}
                height={200}
              />
              {!hasSignature && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-slate-400 text-sm">यहाँ हस्ताक्षर करें / Sign here</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
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
                <Upload className="w-8 h-8 text-slate-400" />
                <p className="text-sm text-slate-600">
                  Click to upload signature image
                </p>
                <p className="text-xs text-slate-400">
                  PNG, JPG up to 5MB
                </p>
              </label>
            </div>
            
            {uploadedImage && (
              <div className="mt-4">
                <canvas
                  ref={canvasRef}
                  className="border rounded-lg w-full h-48 bg-white"
                />
              </div>
            )}
          </motion.div>
        )}

        <div className="flex justify-between items-center pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={clearSignature}
            disabled={!hasSignature}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </Button>

          {hasSignature && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Signature ready
            </div>
          )}
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-md">
          <strong>Note:</strong> Your signature will be embedded in the RTI application document. 
          Make sure it matches your official signature for government correspondence.
        </div>
      </div>
    </Card>
  );
}