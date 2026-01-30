
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageUploaderProps {
  onFileSelect: (base64: string, mimeType: string) => void;
  disabled?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onFileSelect, disabled }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        const base64 = result.split(',')[1];
        onFileSelect(base64, file.type);
      };
      reader.readAsDataURL(file);
    }
  }, [onFileSelect]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearPreview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
  };

  return (
    <div className="w-full">
      <motion.div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-10 transition-all duration-300 group overflow-hidden",
          isDragging ? "border-indigo-500 bg-indigo-50/50 scale-[1.01]" : "border-slate-300 bg-white/50 hover:border-indigo-400 hover:bg-white",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative z-10"
              >
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-72 rounded-2xl shadow-2xl border-4 border-white ring-1 ring-slate-200 object-contain"
                />
                <button
                  onClick={clearPreview}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600">
                  <RefreshCw className="w-4 h-4" />
                  Chạm để Thay đổi ảnh khác
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-gradient-to-tr from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:from-indigo-50 group-hover:to-indigo-100 group-hover:text-indigo-500 transition-all duration-500 shadow-inner">
                  <Upload className="w-10 h-10" />
                </div>
                <div className="mt-6">
                  <p className="text-xl font-bold text-slate-800">Tải ảnh đề bài</p>
                  <p className="text-slate-500 mt-2 max-w-sm">
                    Kéo thả ảnh vào đây hoặc click để chọn từ thư viện. Hỗ trợ PNG, JPG, WEBP.
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 px-8 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold shadow-sm hover:shadow-md hover:border-indigo-200 transition-all"
                >
                  Chọn tệp tin
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Decorative background elements */}
        {!preview && (
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
        )}
      </motion.div>
    </div>
  );
};

export default ImageUploader;
