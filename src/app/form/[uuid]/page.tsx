'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import FormQuestion from '@/components/FormQuestion';
import { CustomFormData } from '@/types';
import { use } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './form-animations.css';
import { FaArrowRight } from 'react-icons/fa';

export default function FormPage({ params }: { params: Promise<{ uuid: string }> }) {
  const { uuid } = use(params);
  const [formData, setFormData] = useState<CustomFormData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | string[] | File | null)[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`/api/form/${uuid}`);
        const data: CustomFormData = response.data;
        if (data.status === 'completed') {
          router.push('/form/completed');
          return;
        }
        setFormData(data);
        setAnswers(new Array(data.questions.length).fill(null));
        setLoading(false);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Failed to load form');
        setLoading(false);
      }
    };
    fetchFormData();
  }, [uuid, router]);

  const handleAnswer = (answer: string | string[] | File | null) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  const validateAnswer = () => {
    const answer = answers[currentQuestionIndex];
    const question = formData?.questions[currentQuestionIndex];
    if (!answer) return false;
    if (question?.type === 'text' && typeof answer === 'string' && answer.trim() === '') return false;
    if (question?.type === 'single' && typeof answer === 'string' && answer === '') return false;
    if (question?.type === 'multiple' && Array.isArray(answer) && answer.length === 0) return false;
    if (question?.type === 'file' && !(answer instanceof File)) return false;
    return true;
  };

  const handleNext = () => {
    if (!validateAnswer()) {
      setError('Please provide a valid answer');
      return;
    }
    setError('');
    if (currentQuestionIndex < (formData?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateAnswer()) {
      setError('Please provide a valid answer');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const formDataToSubmit = new FormData();
      const questions = formData?.questions.map((q, i) => ({
        ...q,
        answer: answers[i] instanceof File ? null : answers[i],
        answered: true
      }));
      formDataToSubmit.append('questions', JSON.stringify(questions));
      answers.forEach((answer, i) => {
        if (answer instanceof File) {
          formDataToSubmit.append('files', answer);
        }
      });
      await axios.post(`/api/submit/${uuid}`, formDataToSubmit, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      router.push('/form/completed');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit form');
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!formData) return <p className="text-center mt-8">Form not found</p>;

  const isLastQuestion = currentQuestionIndex === formData.questions.length - 1;
  const currentQuestion = formData.questions[currentQuestionIndex];

  return (
    <div className="bg-[#FCFCFA] min-h-screen font-sans">
      <div className="form-card mx-auto mt-20 flex flex-col items-center shadow-md">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-[#1A2233]">
          Data Collection Form
        </h2>
        <div className="question-box flex flex-col items-center">
          <div className="text-lg text-[#1A2233] text-center mb-4 font-medium">
            Question {currentQuestionIndex + 1} of {formData.questions.length}
          </div>
          <FormQuestion
            question={currentQuestion}
            answer={answers[currentQuestionIndex]}
            onAnswer={handleAnswer}
          />
          {error && (
            <div className="mt-2 mb-2 p-2 rounded bg-red-100 text-red-700 font-semibold border border-red-300 w-full text-center">
              {error}
            </div>
          )}
        </div>
        <div className="form-action-row">
          {!isLastQuestion ? (
            <button
              onClick={handleNext}
              disabled={!validateAnswer()}
              className="btn-primary flex items-center gap-2"
            >
              Next <FaArrowRight />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading || !validateAnswer()}
              className="btn-primary flex items-center gap-2"
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}