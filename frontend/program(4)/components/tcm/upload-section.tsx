'use client';

import { useState, useCallback, useRef } from 'react';

interface UploadSectionProps {
  uploadedFile: File | null;
  uploadedImageUrl: string | null;
  onFileUpload: (file: File) => void;
  onClear: () => void;
  onRecognize: () => void;
  isRecognizing: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function UploadSection({
  uploadedFile,
  uploadedImageUrl,
  onFileUpload,
  onClear,
  onRecognize,
  isRecognizing,
}: UploadSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          // 显示扫描动画
          setIsScanning(true);
          setTimeout(() => {
            setIsScanning(false);
            onFileUpload(file);
          }, 1500);
        }
      }
    },
    [onFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          setIsScanning(true);
          setTimeout(() => {
            setIsScanning(false);
            onFileUpload(file);
          }, 1500);
        }
      }
    },
    [onFileUpload]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 标题 */}
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            上传文物图片
          </h2>
          <p className="text-muted-foreground">
            支持 JPG、PNG 格式，建议图片清晰度较高以获得更准确的识别结果
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* 上传区域 */}
          <div
            className={`flex-1 relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer ${
              isDragging
                ? 'drag-highlight border-[var(--tcm-primary)] bg-[var(--tcm-primary)]/5'
                : 'border-border hover:border-[var(--tcm-primary)]/50 hover:bg-secondary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {isScanning ? (
              // 扫描动画
              <div className="relative h-64 flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 border-2 border-[var(--tcm-primary)] rounded-lg overflow-hidden">
                  <div className="scan-line"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fa-solid fa-image text-6xl text-[var(--tcm-primary)]/30"></i>
                  </div>
                </div>
                <p className="mt-4 text-[var(--tcm-primary)] font-medium animate-pulse">
                  正在扫描图片...
                </p>
              </div>
            ) : uploadedImageUrl ? (
              // 已上传图片预览
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-xs mx-auto">
                  <img
                    src={uploadedImageUrl}
                    alt="上传的图片"
                    className="w-full h-48 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onClear();
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                    aria-label="清除"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>

                {uploadedFile && (
                  <div className="mt-4 text-center">
                    <p className="font-medium text-foreground">{uploadedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(uploadedFile.size)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // 上传提示
              <div className="h-64 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <i className="fa-solid fa-cloud-arrow-up text-3xl text-[var(--tcm-primary)]"></i>
                </div>
                <p className="text-lg font-medium text-foreground mb-2">
                  拖拽图片到此处
                </p>
                <p className="text-muted-foreground mb-4">或点击选择文件</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    <i className="fa-solid fa-image mr-1"></i>
                    JPG / PNG
                  </span>
                  <span>
                    <i className="fa-solid fa-maximize mr-1"></i>
                    最大 10MB
                  </span>
                </div>
              </div>
            )}

            {/* 拖拽时的光晕效果 */}
            {isDragging && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--tcm-primary)]/10 via-[var(--tcm-primary)]/5 to-[var(--tcm-primary)]/10 pointer-events-none" />
            )}
          </div>

          {/* 识别按钮 */}
          <div className="lg:w-64 w-full">
            <button
              onClick={onRecognize}
              disabled={!uploadedImageUrl || isRecognizing}
              className={`w-full py-4 px-6 rounded-xl font-medium text-lg transition-all flex items-center justify-center gap-3 ${
                uploadedImageUrl && !isRecognizing
                  ? 'bg-gradient-to-r from-[var(--tcm-primary)] to-[var(--tcm-primary-light)] text-white shadow-lg hover:shadow-xl hover:scale-105'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              {isRecognizing ? (
                <>
                  <i className="fa-solid fa-circle-notch animate-spin"></i>
                  <span>识别中...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <span>开始识别</span>
                </>
              )}
            </button>

            <div className="mt-6 p-4 bg-secondary/50 rounded-xl">
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <i className="fa-solid fa-lightbulb text-[var(--tcm-accent)]"></i>
                使用提示
              </h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-[var(--tcm-primary)] mt-1"></i>
                  <span>确保文物主体清晰可见</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-[var(--tcm-primary)] mt-1"></i>
                  <span>避免强光反射或阴影</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="fa-solid fa-check text-[var(--tcm-primary)] mt-1"></i>
                  <span>多角度拍摄效果更佳</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
