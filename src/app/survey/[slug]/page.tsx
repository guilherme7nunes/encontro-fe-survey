'use client';

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { Section, Question } from '@/data/questions';
import { use } from 'react';

export default function SurveyPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = 'then' in params ? use(params) : params;
  const slug = resolvedParams.slug;
  
  const [surveyData, setSurveyData] = useState<Section[]>([]);
  const [eventTitle, setEventTitle] = useState('Carregando...');
  const [isLoading, setIsLoading] = useState(true);

  // Flattened questions with section metadata
  const [flatQuestions, setFlatQuestions] = useState<(Question & { sectionId: number, sectionTitle: string })[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetch("/api/surveys/" + slug, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then(data => {
        if (data.config) {
          setSurveyData(data.config);
          setEventTitle(data.title || 'Pesquisa de Satisfação');
          
          // Flatten questions
          const flat: typeof flatQuestions = [];
          data.config.forEach((sec: Section) => {
            sec.questions.forEach(q => {
              flat.push({ ...q, sectionId: sec.id, sectionTitle: sec.title });
            });
          });
          setFlatQuestions(flat);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      </div>
    );
  }

  if (flatQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Pesquisa não encontrada ou vazia</h2>
          <p className="text-gray-500">Este link pode estar incorreto ou a pesquisa ainda não tem perguntas.</p>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    const currentQ = flatQuestions[currentQuestionIndex];
    let nextIndex = currentQuestionIndex + 1;

    // Check condition to skip
    if (currentQ.condition) {
      const answer = answers[currentQ.id];
      if (answer === currentQ.condition.valueToSkip) {
        // Find the first question of the target section
        const targetQIndex = flatQuestions.findIndex(q => q.sectionId === currentQ.condition!.targetSectionId);
        if (targetQIndex !== -1) {
          nextIndex = targetQIndex;
        }
      }
    }

    if (nextIndex < flatQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      // Finished
      fetch(`/api/surveys/${slug}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      }).then(() => {
        setIsFinished(true);
      }).catch(console.error);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const currentQ = flatQuestions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === flatQuestions.length - 1;
  const progressPercentage = Math.round((currentQuestionIndex / flatQuestions.length) * 100);

  const renderQuestion = (question: Question) => {
    const value = answers[question.id] || '';

    switch (question.type) {
      case 'radio':
        return (
          <div className="flex flex-col gap-3 mt-4">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors bg-white shadow-sm">
                <input
                  type="radio"
                  name={"q-" + question.id}
                  value={option}
                  checked={value === option}
                  onChange={() => handleAnswerChange(question.id, option)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 md:text-lg text-base">{option}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        const checkedValues = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-col gap-3 mt-4">
            {question.options?.map((option) => {
              const isChecked = checkedValues.includes(option);
              return (
                <label key={option} className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:bg-blue-50 hover:border-blue-200 cursor-pointer transition-colors bg-white shadow-sm">
                  <input
                    type="checkbox"
                    value={option}
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        handleAnswerChange(question.id, [...checkedValues, option]);
                      } else {
                        handleAnswerChange(question.id, checkedValues.filter((v) => v !== option));
                      }
                    }}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700 md:text-lg text-base">{option}</span>
                </label>
              )
            })}
          </div>
        );
      case 'linear':
        return (
          <div className="mt-6 flex flex-col items-center">
            <div className="flex w-full justify-between mb-2 text-xs md:text-sm text-gray-500 font-medium">
              <span>{question.min} - {question.minLabel}</span>
              <span>{question.max} - {question.maxLabel}</span>
            </div>
            <div className="flex w-full justify-between gap-1 sm:gap-2">
              {Array.from({ length: (question.max || 5) - (question.min || 1) + 1 }).map((_, i) => {
                const num = (question.min || 1) + i;
                const isSelected = value === num;
                return (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleAnswerChange(question.id, num)}
                    className={`flex-1 py-3 md:py-4 rounded-xl md:text-lg text-base font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
          </div>
        );
      case 'paragraph':
        return (
          <div className="mt-4">
            <textarea
              value={value}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder="Sua resposta..."
              rows={5}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm resize-none md:text-lg text-base"
            />
          </div>
        );
      default:
        return null;
    }
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-xl border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Muito obrigado!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Sua resposta foi registrada com sucesso. Agradecemos sua colaboração!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24 flex flex-col">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 shadow-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h1 className="font-bold md:text-xl text-lg text-blue-900 truncate">{eventTitle}</h1>
            <span className="text-xs md:text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
              {progressPercentage}% concluído
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: progressPercentage + "%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full flex flex-col justify-center">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="mb-4">
              <span className="text-blue-600 font-bold text-xs md:text-sm uppercase tracking-wider">{currentQ.sectionTitle}</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 leading-tight">
              {currentQ.text}
            </h2>

            {renderQuestion(currentQ)}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-12">
              <button
                onClick={handlePrev}
                disabled={isFirstQuestion}
                className={`flex-1 py-4 md:text-lg text-base font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm border ${
                  isFirstQuestion 
                    ? 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed' 
                    : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 border-gray-200'
                }`}
              >
                <ArrowLeft size={20} />
                Voltar
              </button>
              
              <button
                onClick={handleNext}
                disabled={currentQ.type !== 'paragraph' && !answers[currentQ.id]}
                className={`flex-[2] py-4 md:text-lg text-base text-white flex items-center justify-center gap-2 rounded-xl font-bold transition-all shadow-md ${
                  (currentQ.type !== 'paragraph' && !answers[currentQ.id])
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                }`}
              >
                {isLastQuestion ? (
                  <>Enviar <Send size={20} /></>
                ) : (
                  <>Próximo <ChevronRight size={20} /></>
                )}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  );
}



