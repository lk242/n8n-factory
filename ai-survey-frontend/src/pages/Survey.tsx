import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import Question from '../components/Question';
import { get, post } from '../lib/api';
import { useSurveyForm } from '../lib/useSurveyForm';
import type { SurveyDefinition, SurveySubmissionPayload } from '../lib/types';

const SURVEY_QUERY_KEY = (id: string) => ['survey', id];

async function fetchSurveyDefinition(id: string): Promise<SurveyDefinition> {
  if (import.meta.env.VITE_API_BASE_URL) {
    return get<SurveyDefinition>(`/api/surveys/${id}`);
  }
  const response = await fetch(`/mock-data/survey-${id}.json`);
  if (!response.ok) {
    throw new Error('無法取得問卷資料');
  }
  return response.json() as Promise<SurveyDefinition>;
}

export default function Survey() {
  const params = useParams();
  const surveyId = params.id ?? '1';
  const query = useQuery({
    queryKey: SURVEY_QUERY_KEY(surveyId),
    queryFn: () => fetchSurveyDefinition(surveyId)
  });

  const form = useSurveyForm(query.data);

  const mutation = useMutation({
    mutationFn: (payload: SurveySubmissionPayload) => post(`/api/surveys/${payload.surveyId}/submit`, payload),
    onSuccess: () => {
      alert('已成功送出，感謝您的填寫！');
    }
  });

  if (query.isLoading) {
    return <div className="loading">載入中...</div>;
  }

  if (query.error || !query.data) {
    return <div className="error">無法取得問卷內容</div>;
  }

  const survey = query.data;

  return (
    <div className="survey">
      <header className="survey-header">
        <h1>{survey.title}</h1>
        {survey.description && <p>{survey.description}</p>}
      </header>
      <form className="survey-form" onSubmit={form.handleSubmit(mutation.mutateAsync)}>
        {survey.questions.map((question) => (
          <Question
            key={question.id}
            question={question}
            value={form.values[question.id]}
            error={form.errors[question.id]}
            onChange={(value) => form.setValue(question.id, value)}
            onToggleOption={(option) => form.toggleMultiValue(question.id, option)}
          />
        ))}
        <button type="submit" className="submit-button" disabled={form.isSubmitting || mutation.isLoading}>
          {form.isSubmitting || mutation.isLoading ? '送出中...' : '送出問卷'}
        </button>
      </form>
    </div>
  );
}
