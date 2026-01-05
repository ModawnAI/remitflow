'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Upload,
  X,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Warning,
  IdentificationCard,
  Car,
  BookOpen,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type DocumentType = 'passport' | 'driving_licence' | 'national_id';

interface DocumentTypeOption {
  id: DocumentType;
  label: string;
  icon: React.ElementType;
  description: string;
}

const documentTypes: DocumentTypeOption[] = [
  {
    id: 'passport',
    label: 'Passport',
    icon: BookOpen,
    description: 'Photo page of your valid passport',
  },
  {
    id: 'driving_licence',
    label: 'Driving Licence',
    icon: Car,
    description: 'Front of your UK driving licence',
  },
  {
    id: 'national_id',
    label: 'National ID',
    icon: IdentificationCard,
    description: 'Front of your national ID card',
  },
];

export function DocumentCapture() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleContinue = async () => {
    if (!capturedImage || !selectedType) return;

    setUploading(true);
    try {
      // TODO: Upload to Supabase Storage
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push('/verify/selfie');
    } catch {
      setError('Failed to upload document. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground">Upload ID Document</h1>
        <p className="text-muted-foreground mt-2">
          Take a clear photo or upload an image of your ID
        </p>
      </div>

      {/* Document Type Selection */}
      {!selectedType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          <p className="text-sm font-medium text-foreground">Select document type:</p>
          {documentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className="w-full p-4 border border-border rounded-xl hover:border-accent/50 hover:bg-accent/5 transition-colors flex items-center gap-4 text-left"
            >
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <type.icon size={24} className="text-accent" />
              </div>
              <div>
                <p className="font-medium text-foreground">{type.label}</p>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
            </button>
          ))}
        </motion.div>
      )}

      {/* Capture Area */}
      {selectedType && !capturedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <button
            onClick={() => setSelectedType(null)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft size={16} />
            Change document type
          </button>

          <Card className="p-0 overflow-hidden">
            <div className="aspect-[4/3] bg-muted relative flex items-center justify-center">
              {/* Document guide overlay */}
              <div className="absolute inset-8 border-2 border-dashed border-border rounded-lg" />
              <div className="text-center space-y-4 z-10">
                <div className="w-16 h-16 mx-auto rounded-full bg-card shadow-md flex items-center justify-center">
                  <Camera size={32} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Position your {documentTypes.find((t) => t.id === selectedType)?.label} within the frame
                </p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Upload size={20} />
              Upload Photo
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
            >
              <Camera size={20} />
              Take Photo
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
          />

          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-accent" />
              Make sure the entire document is visible
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-accent" />
              Ensure good lighting and avoid glare
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-accent" />
              Keep the image in focus
            </li>
          </ul>
        </motion.div>
      )}

      {/* Preview */}
      <AnimatePresence>
        {capturedImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-4"
          >
            <Card className="p-0 overflow-hidden">
              <div className="aspect-[4/3] relative">
                <img
                  src={capturedImage}
                  alt="Captured document"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={handleRetake}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
                >
                  <X size={18} />
                </button>
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
