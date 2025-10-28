import type { SurveyQuestion } from '../lib/types';

interface QuestionProps {
  question: SurveyQuestion;
  value: unknown;
  error?: string;
  onChange: (value: unknown) => void;
  onToggleOption?: (optionValue: string) => void;
}

export default function Question({ question, value, error, onChange, onToggleOption }: QuestionProps) {
  return (
    <div className="question">
      <div className="question-header">
        <h3>
          {question.title}
          {question.required && <span className="question-required">*</span>}
        </h3>
        {question.description && <p className="question-description">{question.description}</p>}
      </div>
      <div className="question-body">
        {question.type === 'single' &&
          question.options.map((option) => (
            <label key={option.value} className="option">
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={value === option.value}
                onChange={(event) => onChange(event.target.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        {question.type === 'multi' &&
          question.options.map((option) => (
            <label key={option.value} className="option">
              <input
                type="checkbox"
                name={`${question.id}-${option.value}`}
                value={option.value}
                checked={Array.isArray(value) && value.includes(option.value)}
                onChange={() => onToggleOption?.(option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        {question.type === 'text' && (
          <textarea
            name={question.id}
            value={typeof value === 'string' ? value : ''}
            onChange={(event) => onChange(event.target.value)}
            placeholder={question.placeholder}
            maxLength={question.maxLength}
            rows={4}
          />
        )}
        {question.type === 'likert' && (
          <div className="likert">
            <div className="likert-labels">
              <span>{question.labels?.min ?? '非常不同意'}</span>
              <span>{question.labels?.max ?? '非常同意'}</span>
            </div>
            <div className="likert-options">
              {Array.from({ length: question.scale }, (_, index) => {
                const optionValue = index + 1;
                return (
                  <label key={optionValue} className="likert-option">
                    <input
                      type="radio"
                      name={question.id}
                      value={optionValue}
                      checked={value === optionValue}
                      onChange={() => onChange(optionValue)}
                    />
                    <span>{optionValue}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
        {error && <p className="question-error">{error}</p>}
      </div>
    </div>
  );
}
