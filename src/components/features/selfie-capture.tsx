'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  X,
  ArrowRight,
  Warning,
  CheckCircle,
  SmileyWink,
  Sun,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type CaptureState = 'instructions' | 'capturing' | 'preview';

export function SelfieCapture() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<CaptureState>('instructions');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 720, height: 720 },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setCameraReady(true);
        };
      }
    } catch {
      setError('Unable to access camera. Please grant camera permissions and try again.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraReady(false);
  }, []);

  useEffect(() => {
    if (state === 'capturing') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [state, startCamera, stopCamera]);

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Flip horizontally for mirror effect
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(imageData);
    setState('preview');
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setError(null);
    setState('capturing');
  };

  const handleContinue = async () => {
    if (!capturedImage) return;

    setUploading(true);
    try {
      // TODO: Upload to Supabase Storage and trigger Smile ID verification
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/verify/complete');
    } catch {
      setError('Failed to upload selfie. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Take a Selfie</h1>
        <p className="text-muted-foreground mt-2">
          We need a photo of your face to verify your identity
        </p>
      </div>

      {/* Instructions */}
      {state === 'instructions' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <Card className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <SmileyWink size={40} className="text-accent" weight="fill" />
              </div>
              <h3 className="font-semibold text-foreground">
                Tips for a good selfie
              </h3>
            </div>

            <ul className="mt-6 space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Sun size={18} className="text-accent" />
                </div>
                <span className="text-foreground">Find good lighting - natural light works best</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Camera size={18} className="text-accent" />
                </div>
                <span className="text-foreground">Position your face within the oval guide</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle size={18} className="text-accent" />
                </div>
                <span className="text-foreground">Remove glasses, hats, or face coverings</span>
              </li>
            </ul>
          </Card>

          <Button
            variant="primary"
            size="lg"
            onClick={() => setState('capturing')}
            className="w-full"
          >
            <Camera size={20} />
            Open Camera
          </Button>
        </motion.div>
      )}

      {/* Camera View */}
      {state === 'capturing' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <Card className="p-0 overflow-hidden">
            <div className="aspect-square relative bg-inverted">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover scale-x-[-1]"
              />

              {/* Face guide overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-80 border-4 border-white/50 rounded-[50%]" />
              </div>

              {!cameraReady && (
                <div className="absolute inset-0 flex items-center justify-center bg-inverted">
                  <div className="text-center text-white">
                    <Camera size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm opacity-75">Initializing camera...</p>
                  </div>
                </div>
              )}
            </div>
          </Card>

          <canvas ref={canvasRef} className="hidden" />

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <Warning size={16} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                stopCamera();
                setState('instructions');
              }}
            >
              <X size={20} />
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={capturePhoto}
              disabled={!cameraReady}
            >
              <Camera size={20} />
              Capture
            </Button>
          </div>
        </motion.div>
      )}

      {/* Preview */}
      <AnimatePresence>
        {state === 'preview' && capturedImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <Card className="p-0 overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={capturedImage}
                  alt="Captured selfie"
                  className="w-full h-full object-cover"
                />
              </div>
            </Card>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <Warning size={16} />
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleRetake}
                disabled={uploading}
              >
                Retake
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleContinue}
                loading={uploading}
              >
                Continue
                <ArrowRight size={20} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
