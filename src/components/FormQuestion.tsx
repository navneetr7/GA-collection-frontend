import { Question } from '@/types';
import { useRef } from 'react';

interface Props {
  question: Question;
  answer: string | string[] | File | null;
  onAnswer: (answer: string | string[] | File | null) => void;
}

export default function FormQuestion({ question, answer, onAnswer }: Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onAnswer(file);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileName = question.type === 'file' && answer instanceof File ? answer.name : '';

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <p className="text-xl font-semibold text-[#1A2233] text-center mb-6">
        {question.question}
      </p>
      {question.type === 'text' && (
        <input
          type="text"
          value={typeof answer === 'string' ? answer : ''}
          onChange={(e) => onAnswer(e.target.value)}
          className="form-text-input"
          required
        />
      )}
      {question.type === 'single' && question.choices && (
        <div className="w-full flex flex-col items-center mb-8">
          {question.choices.map((choice) => (
            <label key={choice} className="choice-row">
              <input
                type="radio"
                name={question.question}
                value={choice}
                checked={answer === choice}
                onChange={() => onAnswer(choice)}
                className="choice-input accent-[#1A2233]"
                required
              />
              <span className="text-lg font-medium text-[#1A2233]">{choice}</span>
            </label>
          ))}
        </div>
      )}
      {question.type === 'multiple' && question.choices && (
        <div className="w-full flex flex-col items-center mb-8">
          {question.choices.map((choice) => (
            <label key={choice} className="choice-row">
              <input
                type="checkbox"
                value={choice}
                checked={Array.isArray(answer) && answer.includes(choice)}
                onChange={(e) => {
                  const newAnswer = Array.isArray(answer) ? [...answer] : [];
                  if (e.target.checked) {
                    newAnswer.push(choice);
                  } else {
                    const idx = newAnswer.indexOf(choice);
                    if (idx > -1) newAnswer.splice(idx, 1);
                  }
                  onAnswer(newAnswer);
                }}
                className="choice-input accent-[#1A2233]"
              />
              <span className="text-lg font-medium text-[#1A2233]">{choice}</span>
            </label>
          ))}
        </div>
      )}
      {question.type === 'file' && (
        <div className="w-full flex flex-col items-center justify-center mb-8">
          <button
            type="button"
            className="file-input-label mb-2 text-center"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            Choose File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            required
          />
          {fileName && (
            <span className="mt-2 text-base text-[#8C8376] font-medium text-center break-all max-w-xs">{fileName}</span>
          )}
        </div>
      )}
    </div>
  );
}