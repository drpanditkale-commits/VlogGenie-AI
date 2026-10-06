
import React, { useRef, useState } from 'react';

interface VideoInputProps {
  onVideoSelected: (file: File) => void;
  onUrlSelected: (url: string) => void;
  isProcessing: boolean;
}

const VideoInput: React.FC<VideoInputProps> = ({ onVideoSelected, onUrlSelected, isProcessing }) => {
  const [mode, setMode] = useState<'file' | 'url'>('file');
  const [url, setUrl] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        onVideoSelected(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onVideoSelected(e.target.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlSelected(url.trim());
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Tab Switcher */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 p-1 rounded-xl flex">
          <button 
            onClick={() => setMode('file')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === 'file' ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Upload File
          </button>
          <button 
            onClick={() => setMode('url')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === 'url' ? "bg-white shadow-sm text-indigo-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Video URL
          </button>
        </div>
      </div>

      {mode === 'file' ? (
        <div 
          className={`relative group border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragActive 
              ? "border-indigo-500 bg-indigo-50" 
              : "border-gray-300 bg-white hover:border-indigo-400"
          } ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
            disabled={isProcessing}
          />
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Upload your video
            </h2>
            <p className="text-gray-500 max-w-sm mb-8">
              Drag and drop your video file here, or click to browse. High resolution files supported.
            </p>
            
            <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700 transition-colors">
              Choose Video
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <form onSubmit={handleUrlSubmit} className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.826L10.242 10.172a4 4 0 015.656 0l4 4a4 4 0 11-5.656 5.656l-1.101-1.101" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Enter Video URL</h2>
              <p className="text-gray-500 text-sm mt-2">Paste a direct link to an MP4, WEBM, or MOV file.</p>
            </div>
            <div className="relative">
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/video.mp4"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-800"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isProcessing || !url}
              className={`w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md transition-all hover:bg-indigo-700 active:scale-[0.98] ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Analyze Video Link
            </button>
          </form>
          <div className="mt-6 flex items-start space-x-3 bg-amber-50 p-4 rounded-xl text-xs text-amber-700 border border-amber-100">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>
              Note: Processing time depends on the video size and network speed. Direct video links work best.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 flex items-center justify-center space-x-4 text-xs text-gray-400">
        <span className="px-2 py-1 bg-gray-100 rounded">MP4</span>
        <span className="px-2 py-1 bg-gray-100 rounded">MOV</span>
        <span className="px-2 py-1 bg-gray-100 rounded">WEBM</span>
        <span className="px-2 py-1 bg-gray-100 rounded">AVI</span>
      </div>
    </div>
  );
};

export default VideoInput;
