export enum EventType {
  EXAM = 'EXAM',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
  PROJECT = 'PROJECT',
  HOLIDAY = 'HOLIDAY',
  OTHER = 'OTHER'
}

export interface SyllabusEvent {
  id: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  time?: string; // Optional time string
  type: EventType;
  description?: string;
  confidenceScore?: number;
}

export interface ExtractionResult {
  events: SyllabusEvent[];
  courseName?: string;
}

export type ProcessingStatus = 'IDLE' | 'READING' | 'EXTRACTING' | 'COMPLETE' | 'ERROR';
