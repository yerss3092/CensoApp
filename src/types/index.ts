// Survey question types
export interface Question {
  id: string;
  numero: string;
  tipo: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'coordinates';
  pregunta: string;
  opciones?: string[];
  required?: boolean;
  dependsOn?: string; // ID of the question this depends on
  showIf?: string | string[]; // Values that trigger showing this question
}

// Response data structure
export interface QuestionResponse {
  questionId: string;
  answer: string | number | string[] | { lat: number; lng: number };
  timestamp: string;
}

export interface SurveyResponse {
  id: string;
  surveyorName: string;
  startTime: string;
  endTime?: string | undefined;
  responses: QuestionResponse[];
  location?: {
    latitude: number;
    longitude: number;
  } | undefined;
  status: 'draft' | 'completed' | 'submitted';
}

// Surveyor information
export interface Surveyor {
  id: string;
  name: string;
  email?: string | undefined;
  assignedArea?: string | undefined;
  loginTime: string;
}

// CSV row structure (matching the original CSV)
export interface CSVQuestion {
  numero: string;
  pregunta: string;
  tipo?: string;
  opciones?: string;
  [key: string]: string | undefined;
}