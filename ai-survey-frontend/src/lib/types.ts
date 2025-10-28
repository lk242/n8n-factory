export type QuestionType = 'single' | 'multi' | 'text' | 'likert';

export interface QuestionOption {
  label: string;
  value: string;
}

export interface SurveyQuestionBase {
  id: string;
  title: string;
  description?: string;
  required?: boolean;
  type: QuestionType;
}

export interface SingleChoiceQuestion extends SurveyQuestionBase {
  type: 'single';
  options: QuestionOption[];
}

export interface MultiChoiceQuestion extends SurveyQuestionBase {
  type: 'multi';
  options: QuestionOption[];
}

export interface TextQuestion extends SurveyQuestionBase {
  type: 'text';
  placeholder?: string;
  maxLength?: number;
}

export interface LikertQuestion extends SurveyQuestionBase {
  type: 'likert';
  scale: number;
  labels?: { min?: string; max?: string };
}

export type SurveyQuestion =
  | SingleChoiceQuestion
  | MultiChoiceQuestion
  | TextQuestion
  | LikertQuestion;

export interface SurveyDefinition {
  id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
}

export type SurveyAnswerValue = string | string[] | number | undefined;

export type SurveyFormValues = Record<string, SurveyAnswerValue>;

export interface SurveySubmissionPayload {
  surveyId: string;
  answers: SurveyFormValues;
}

export interface DashboardMetrics {
  recoveryRate: number;
  sampleSize: number;
  sentimentAverage: number;
  topTopics: Array<{ topic: string; score: number }>;
  trend: Array<{ date: string; completionRate: number; responses: number }>;
}
