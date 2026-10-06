
import React, { useState } from 'react';
import { VideoAnalysis } from '../types';

interface AnalysisResultProps {
  analysis: VideoAnalysis;
  videoUrl: string | null;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, videoUrl }) => {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyFullPost = () => {
    const fullText = `
TITLE OPTIONS:
${analysis.titles.join('\n')}

SUMMARY:
${analysis.summary}

CHAPTERS:
${analysis.chapters.map(c => `${c.timestamp} - ${c.label}: ${c.details}`).join('\n')}
    `.trim();
    copyToClipboard(fullText, 'full');
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Media & Meta (4 cols) */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-2xl aspect-video relative group border-4 border-white">
          {videoUrl ? (
            <video 
              src={videoUrl} 
              controls 
              playsInline
              className="w-full h-full object-contain"
              onLoadedMetadata={(e) => console.log("Video loaded successfully")}
              onError={(e) => console.error("Video failed to load in preview")}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-8 text-center">
              <svg className="w-12 h-12 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-medium">Video preview loading or restricted</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center">
              <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
              </svg>
              Post Structure
            </h3>
            <button 
              onClick={() => copyToClipboard(JSON.stringify(analysis.chapters, null, 2), 'chapters')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-2 py-1 rounded"
            >
              {copied === 'chapters' ? 'Copied JSON!' : 'JSON'}
            </button>
          </div>
          <div className="p-6 max-h-[500px] overflow-y-auto custom-scrollbar">
            <div className="space-y-6 relative">
              <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-100"></div>
              {analysis.chapters.map((chapter, idx) => (
                <div key={idx} className="relative pl-8 group">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-white border-2 border-indigo-600 rounded-full flex items-center justify-center z-10">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full group-hover:scale-125 transition-transform"></div>
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded mb-1 tracking-tighter">
                      {chapter.timestamp}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{chapter.label}</h4>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{chapter.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Titles & Summary (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        {/* Suggested Titles */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="w-2 h-8 bg-indigo-600 rounded-full mr-3"></span>
              Viral Title Ideas
            </h2>
            <button 
              onClick={copyFullPost}
              className="hidden sm:flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              {copied === 'full' ? 'All Content Copied!' : 'Copy Entire Post'}
            </button>
          </div>
          <div className="grid gap-3">
            {analysis.titles.map((title, idx) => (
              <div 
                key={idx} 
                className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-indigo-100 cursor-pointer"
                onClick={() => copyToClipboard(title, `title-${idx}`)}
              >
                <div className="flex items-center">
                  <span className="text-indigo-300 font-black text-lg mr-4 group-hover:text-indigo-600 transition-colors">#0{idx + 1}</span>
                  <span className="text-gray-800 font-semibold">{title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {copied === `title-${idx}` ? 'Copied' : 'Copy'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blog Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <span className="w-2 h-8 bg-emerald-500 rounded-full mr-3"></span>
              Post Summary
            </h2>
            <button 
              onClick={() => copyToClipboard(analysis.summary, 'summary')}
              className="p-2 bg-gray-50 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
              title="Copy Summary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m-3 8h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </button>
          </div>
          <div className="prose prose-indigo max-w-none">
            {analysis.summary.split('\n\n').map((para, i) => (
              <p key={i} className="text-gray-600 leading-relaxed mb-4 last:mb-0 text-lg">
                {para}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
