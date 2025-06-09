import React, { useState, useRef, useEffect, useCallback } from "react";

interface FileItem {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  previewUrl?: string;
}

interface Toast {
  id: string;
  type: "success" | "error";
  message: string;
}

const FileUploadDashboard: React.FC = () => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Animations for checkmark
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes checkmark {
        0% { stroke-dashoffset: 50; opacity: 0; }
        50% { opacity: 1; }
        100% { stroke-dashoffset: 0; opacity: 1; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // File handling
  const handleFiles = useCallback((newFiles: FileList) => {
    const fileArray = Array.from(newFiles).map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "pending" as const,
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));
    setFiles((prev) => [...prev, ...fileArray]);
    fileArray.forEach((fileItem) => {
      setTimeout(() => uploadFile(fileItem.id), 500);
    });
  }, []);

  const uploadFile = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, status: "uploading" } : f))
    );
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        clearInterval(interval);
        const success = Math.random() > 0.1;
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, progress: 100, status: success ? "success" : "error" }
              : f
          )
        );
        if (success) {
          addToast("success", "File uploaded successfully!");
        } else {
          addToast("error", "Upload failed. Please try again.");
        }
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, progress: Math.min(progress, 99) } : f
          )
        );
      }
    }, 200);
  };

  const retryUpload = (fileId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, progress: 0, status: "pending" } : f
      )
    );
    setTimeout(() => uploadFile(fileId), 500);
  };

  const addToast = (type: "success" | "error", message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  // Components
  const CheckmarkIcon = () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 13l4 4L19 7"
        stroke="#22c55e"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 50,
          strokeDashoffset: 50,
          animation: "checkmark 0.6s ease forwards",
        }}
      />
    </svg>
  );
  const SkeletonLoader = () => (
    <div className="w-full h-full animate-pulse bg-gray-200 rounded" />
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-8 px-2">
      <div className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            File Upload Dashboard
          </h1>
          <p className="text-gray-500 text-base md:text-lg">
            Drag and drop your files or click to browse
          </p>
        </header>
        <div
          className={`rounded-2xl p-10 mb-8 shadow-lg border-2 border-dashed transition-all duration-300 cursor-pointer bg-white ${
            isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 flex items-center justify-center rounded-full bg-gray-100 mb-4 shadow">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 10L12 5L17 10M12 5V15M5 19H19"
                  stroke="#4a5568"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="text-lg font-medium text-gray-700 mb-1">
              Drop files here or click to upload
            </div>
            <div className="text-sm text-gray-400 mb-2">
              Support for JPG, PNG, PDF up to 10MB
            </div>
            <button
              className="mt-2 px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300"
              type="button"
            >
              Browse Files
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 file-grid">
          {files.map((file) => (
            <div
              key={file.id}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center transition hover:shadow-xl"
            >
              <div className="w-full h-40 rounded-lg mb-4 flex items-center justify-center bg-gray-100 overflow-hidden">
                {file.status === "pending" ? (
                  <SkeletonLoader />
                ) : file.previewUrl ? (
                  <img
                    src={file.previewUrl}
                    alt={file.file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 12H15M9 16H15M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
                      stroke="#718096"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <div className="w-full truncate font-medium text-gray-700 mb-2 text-center">
                {file.file.name}
              </div>
              {(file.status === "uploading" || file.status === "pending") && (
                <>
                  <div className="w-full bg-gray-200 rounded h-3 overflow-hidden mb-1">
                    <div
                      className="bg-blue-500 h-3 transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                  <div className="w-full text-xs text-right text-blue-700 font-semibold">
                    {Math.round(file.progress)}%
                  </div>
                </>
              )}
              {file.status === "success" && (
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 my-2">
                  <CheckmarkIcon />
                </div>
              )}
              {file.status === "error" && (
                <>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 my-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                        stroke="#e53e3e"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <button
                    className="w-full mt-2 px-3 py-1 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      retryUpload(file.id);
                    }}
                  >
                    Retry Upload
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Toasts */}
      <div className="fixed bottom-6 right-6 z-50 space-y-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center px-5 py-3 rounded-lg shadow-lg min-w-[220px] ${
              toast.type === "success"
                ? "bg-green-100 border border-green-300"
                : "bg-red-100 border border-red-300"
            }`}
            style={{
              animation: "slideIn 0.3s ease, fadeOut 0.3s ease 2.7s forwards",
            }}
          >
            {toast.type === "success" ? (
              <CheckmarkIcon />
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 8V12M12 16H12.01"
                  stroke="#e53e3e"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <span className="ml-3 text-gray-800">{toast.message}</span>
          </div>
        ))}
      </div>
      {/* Toast/Progress Animations */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
          to { opacity: 0; transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default FileUploadDashboard;
