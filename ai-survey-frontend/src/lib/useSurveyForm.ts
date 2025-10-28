import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import type {
  SurveyDefinition,
  SurveyFormValues,
  SurveyQuestion,
  SurveySubmissionPayload
} from './types';

function getInitialValue(question: SurveyQuestion) {
  switch (question.type) {
    case 'multi':
      return [];
    case 'likert':
      return Math.ceil(question.scale / 2);
    default:
      return '';
  }
}

function isEmpty(value: unknown) {
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return value === '' || value === undefined || value === null;
}

export function useSurveyForm(survey?: SurveyDefinition) {
  const [values, setValues] = useState<SurveyFormValues>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!survey) return;
    const initial = survey.questions.reduce<SurveyFormValues>((acc, question) => {
      acc[question.id] = getInitialValue(question);
      return acc;
    }, {});
    setValues(initial);
    setErrors({});
  }, [survey]);

  const validate = useCallback(() => {
    if (!survey) return true;
    const nextErrors: Record<string, string> = {};
    survey.questions.forEach((question) => {
      if (!question.required) return;
      const value = values[question.id];
      if (isEmpty(value)) {
        nextErrors[question.id] = '此題為必填';
      }
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [survey, values]);

  const setValue = useCallback((questionId: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => {
      if (!prev[questionId]) return prev;
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }, []);

  const toggleMultiValue = useCallback((questionId: string, optionValue: string) => {
    setValues((prev) => {
      const current = Array.isArray(prev[questionId]) ? [...(prev[questionId] as string[])] : [];
      const next = current.includes(optionValue)
        ? current.filter((value) => value !== optionValue)
        : [...current, optionValue];
      return { ...prev, [questionId]: next };
    });
    setErrors((prev) => {
      if (!prev[questionId]) return prev;
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(
    (submitter: (payload: SurveySubmissionPayload) => Promise<void> | void) =>
      async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!survey) return;
        if (!validate()) return;
        try {
          setIsSubmitting(true);
          await submitter({ surveyId: survey.id, answers: values });
        } finally {
          setIsSubmitting(false);
        }
      },
    [survey, validate, values]
  );

  return {
    values,
    errors,
    isSubmitting,
    setValue,
    toggleMultiValue,
    handleSubmit
  };
}
