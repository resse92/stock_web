export interface DeepseekSource {
  url: string;
  title?: string;
  snippet?: string;
}

export interface DeepseekAnalysisResultPayload {
  summary?: string;
  analysis?: string;
  insights?: string[];
  highlights?: string[];
  keyFindings?: string[];
  sources?: DeepseekSource[];
  content?: string;
  [key: string]: unknown;
}

export interface DeepseekAnalysisRequest {
  urls?: string[];
  prompt_template?: string;
  password: string;
  stream: boolean;
}

export interface DeepseekAnalysisResponse {
  jobId?: string;
  status?: string;
  message?: string;
  summary?: string;
  analysis?: string;
  insights?: string[];
  highlights?: string[];
  sources?: DeepseekSource[];
  result?: DeepseekAnalysisResultPayload | string;
  [key: string]: unknown;
}

export interface DeepseekSseEvent {
  event?: string;
  data: string;
  json?: DeepseekAnalysisResponse | Record<string, unknown>;
}
