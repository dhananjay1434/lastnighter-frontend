import axios, { AxiosError } from 'axios';

// Define types for API responses
export interface ServerStatus {
  status: string;
  enhanced_features: boolean;
  transcription: boolean;
  ocr_enhancement: boolean;
  advanced_features: boolean;
}

export interface ExtractionParams {
  video_url: string;
  adaptive_sampling?: boolean;
  min_scene_change?: number;
  extract_content?: boolean;
  organize_slides?: boolean;
  generate_pdf?: boolean;
  enable_transcription?: boolean;
  enable_ocr_enhancement?: boolean;
  enable_concept_extraction?: boolean;
  enable_slide_descriptions?: boolean;
  gemini_api_key?: string;
}

export interface ExtractionResponse {
  job_id: number;
  status: string;
}

export interface JobStatus {
  id: number;
  status: string;
  progress: number;
  message: string;
  error: string | null;
  slides_count: number;
  has_pdf: boolean;
  has_study_guide: boolean;
  has_transcription: boolean;
  has_concepts: boolean;
  has_descriptions: boolean;
}

export interface Slide {
  filename: string;
  path: string;
  title?: string;
  content?: string;
  type?: string;
  keywords?: string[];
  timestamp?: number;
  description?: string;
}

export interface SlidesResponse {
  slides: Slide[];
}

export interface StudyGuideResponse {
  content: string;
}

// Get API URL from environment variables with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Error handler
const handleApiError = (error: any) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorData = axiosError.response.data as any;
      throw new Error(errorData.error || 'An error occurred with the API');
    } else if (axiosError.request) {
      // The request was made but no response was received
      throw new Error('No response received from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Error setting up request: ${axiosError.message}`);
    }
  }
  // For non-Axios errors
  throw new Error('An unexpected error occurred');
};

/**
 * Get server status
 * @returns Server status information
 */
export const getServerStatus = async (): Promise<ServerStatus> => {
  try {
    const response = await apiClient.get<ServerStatus>('/status');
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Start slide extraction for a single video
 * @param params Extraction parameters
 * @returns Job ID for the extraction task
 */
export const extractSlides = async (params: ExtractionParams): Promise<ExtractionResponse> => {
  try {
    const response = await apiClient.post<ExtractionResponse>('/extract', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get status of an extraction job
 * @param jobId Job ID
 * @returns Job status information
 */
export const getJobStatus = async (jobId: number): Promise<JobStatus> => {
  try {
    const response = await apiClient.get<JobStatus>(`/jobs/${jobId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get slides for a job
 * @param jobId Job ID
 * @returns Slides information
 */
export const getJobSlides = async (jobId: number): Promise<SlidesResponse> => {
  try {
    const response = await apiClient.get<SlidesResponse>(`/jobs/${jobId}/slides`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get study guide for a job
 * @param jobId Job ID
 * @returns Study guide content
 */
export const getStudyGuide = async (jobId: number): Promise<StudyGuideResponse> => {
  try {
    const response = await apiClient.get<StudyGuideResponse>(`/jobs/${jobId}/study-guide`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get PDF URL for a job
 * @param jobId Job ID
 * @returns PDF URL
 */
export const getPdfUrl = (jobId: number): string => {
  return `${API_BASE_URL.replace('/api', '')}/jobs/${jobId}/pdf`;
};

/**
 * Get slide image URL
 * @param filename Slide filename
 * @returns Slide image URL
 */
export const getSlideImageUrl = (filename: string): string => {
  return `${API_BASE_URL.replace('/api', '')}/slides/${filename}`;
};
