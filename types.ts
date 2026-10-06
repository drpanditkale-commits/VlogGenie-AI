
export interface VideoChapter {
  timestamp: string;
  label: string;
  details: string;
}

export interface VideoAnalysis {
  summary: string;
  titles: string[];
  chapters: VideoChapter[];
}

export interface AppState {
  isProcessing: boolean;
  error: string | null;
  result: VideoAnalysis | null;
  videoPreviewUrl: string | null;
}
