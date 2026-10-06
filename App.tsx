
import React, { useState, useCallback } from 'react';
import Layout from './components/Layout';
import VideoInput from './components/VideoInput';
import AnalysisResult from './components/AnalysisResult';
import { AppState, VideoAnalysis } from './types';
import { analyzeVideo } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isProcessing: false,
    error: null,
    result: null,
    videoPreviewUrl: null,
  });

  const processVideoData = async (base64Data: string, mimeType: string, previewUrl: string) => {
    // We set the preview URL immediately so it shows up in the UI even while processing
    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      error: null, 
      result: null, 
      videoPreviewUrl: previewUrl 
    }));

    try {
      const analysis = await analyzeVideo(base64Data, mimeType);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        result: analysis,
        videoPreviewUrl: previewUrl // Explicitly re-set to ensure it's persisted in the final state
      }));
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: err.message || "Something went wrong during analysis." 
      }));
    }
  };

  const handleVideoSelected = useCallback(async (file: File) => {
    // Size limit removed to accommodate high-resolution videos
    const previewUrl = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onload = async () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      await processVideoData(base64, file.type, previewUrl);
    };
    reader.onerror = () => setState(prev => ({ ...prev, error: "Failed to read video file." }));
    reader.readAsDataURL(file);
  }, []);

  const handleUrlSelected = useCallback(async (url: string) => {
    setState(prev => ({ ...prev, isProcessing: true, error: null, result: null }));
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);
      
      const blob = await response.blob();
      if (!blob.type.startsWith('video/')) {
        throw new Error("The URL provided does not seem to be a valid direct video file link.");
      }

      // Size limit removed to accommodate high-resolution videos

      // Create a blob URL from the fetched data for the preview
      const previewUrl = URL.createObjectURL(blob);

      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
      });
      reader.readAsDataURL(blob);
      const base64Data = await base64Promise;

      await processVideoData(base64Data, blob.type, previewUrl);
    } catch (err: any) {
      let message = err.message;
      if (err.name === 'TypeError' && err.message === 'Failed to fetch') {
        message = "CORS restriction: This video provider blocks direct access. Please download the video and upload the file instead.";
      }
      setState(prev => ({ ...prev, isProcessing: false, error: message }));
    }
  }, []);

  const reset = () => {
    // Clean up object URLs to prevent memory leaks
    if (state.videoPreviewUrl?.startsWith('blob:')) {
      URL.revokeObjectURL(state.videoPreviewUrl);
    }
    setState({
      isProcessing: false,
      error: null,
      result: null,
      videoPreviewUrl: null,
    });
  };

  return (
    <Layout>
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        {!state.result && !state.isProcessing && (
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-widest mb-4">
              ✨ Blog Post Generator
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Turn Your Videos into <span className="text-indigo-600">Pro Blog Posts</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              Generate compelling blog titles, summaries, and structured chapters ready for your website in seconds, even for high-resolution footage.
            </p>
            <VideoInput 
              onVideoSelected={handleVideoSelected} 
              onUrlSelected={handleUrlSelected}
              isProcessing={state.isProcessing} 
            />
          </div>
        )}

        {state.isProcessing && (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
            <div className="relative w-24 h-24 mb-10">
              <div className="absolute inset-0 border-4 border-indigo-50 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">AI</div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyzing your video...</h2>
            <p className="text-gray-500 animate-pulse text-center max-w-xs">Our AI is watching and extracting key insights. Larger videos may take a moment to upload.</p>
          </div>
        )}

        {state.error && (
          <div className="max-w-lg mx-auto bg-white border border-red-100 shadow-xl shadow-red-50 rounded-2xl p-8 mb-8 text-center animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">{state.error}</p>
            <button 
              onClick={reset}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all"
            >
              Try Another Video
            </button>
          </div>
        )}

        {state.result && (
          <div className="animate-in slide-in-from-bottom-10 fade-in duration-700">
            <div className="max-w-5xl mx-auto flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">Vlog Analysis</h2>
                <p className="text-gray-500 mt-1">Ready for your blog</p>
              </div>
              <button 
                onClick={reset}
                className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-indigo-600 hover:border-indigo-100 transition-all font-semibold shadow-sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                New Session
              </button>
            </div>
            <AnalysisResult analysis={state.result} videoUrl={state.videoPreviewUrl} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default App;
