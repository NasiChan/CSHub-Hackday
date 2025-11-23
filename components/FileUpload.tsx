import React, { useCallback, useState } from 'react';
import { Upload, FileText, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const validateAndProcessFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a PDF or an Image (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError("File size too large. Please upload a file smaller than 10MB.");
      return;
    }
    setError(null);
    onFileSelect(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 p-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-10 transition-all duration-200 ease-in-out text-center cursor-pointer group
          ${isDragging 
            ? 'border-primary-500 bg-primary-50 scale-[1.01]' 
            : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          disabled={isProcessing}
          accept=".pdf,image/*"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {isProcessing ? (
            <div className="flex flex-col items-center animate-pulse">
               <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
               <p className="text-lg font-medium text-slate-700">Analyzing Syllabus...</p>
               <p className="text-sm text-slate-500">Extracting dates and events via Gemini AI</p>
            </div>
          ) : (
            <>
              <div className="p-4 bg-primary-100 text-primary-600 rounded-full group-hover:scale-110 transition-transform duration-200">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-medium text-slate-700">
                  <span className="text-primary-600">Click to upload</span> or drag and drop
                </p>
                <p className="text-sm text-slate-500">PDF, PNG, JPG (max 10MB)</p>
              </div>
              <div className="flex items-center space-x-4 text-xs text-slate-400 mt-4">
                <div className="flex items-center">
                  <FileText className="w-4 h-4 mr-1" /> PDF Supported
                </div>
                <div className="flex items-center">
                  <ImageIcon className="w-4 h-4 mr-1" /> Images Supported
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg flex items-center text-red-700 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
};
