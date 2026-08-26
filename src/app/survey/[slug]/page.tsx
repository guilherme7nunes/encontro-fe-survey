'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { surveyData, Section, Question } from '@/data/questions';
import { CheckCircle2, ChevronRight, ChevronLeft, Send } from 'lucide-react';
import Link from 'next/link';

export default function SurveyPage() {
  const params = useParams();
  const slug = params?.slug || '';
  const eventTitle = slug.includes('curitiba') ? 'ERFE Curitiba' : slug.includes('lideranca') ? 'Liderança Jovem 26' : 'Encontro Nacional da FE 2026';
  
  const [surveyData, setSurveyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/surveys/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.config) {
          setSurveyData(data.config);
        }
        setIsLoading(false);
      });
  }, [slug]);

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isFinished, setIsFinished] = useState(false);


  if (isLoading) {
    return <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p>Carregando...</p>
    </div>;
  }

  if (!surveyData || surveyData.length === 0) {
    return <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <p className="text-xl font-bold">Pesquisa no encontrada ou vazia.</p>
    </div>;
  }

  const currentSection = surveyData[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === surveyData.length - 1;

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    // Check conditional logic
    let nextIndex = currentSectionIndex + 1;
    
    // Check if any question in the current section has a condition that matches the answer
    for (const q of currentSection.questions) {
      if (q.condition) {
        const answer = answers[q.id];
        if (answer === q.condition.valueToSkip) {
          // Find the index of the target section
          const targetIndex = surveyData.findIndex((s) => s.id === q.condition!.targetSectionId);
          if (targetIndex !== -1) {
            nextIndex = targetIndex;
            break;
          }
        }
      }
    }

    if (nextIndex < surveyData.length) {
      setCurrentSectionIndex(nextIndex);
      window.scrollTo(0, 0);
    } else {
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
    if (!isFirstSection) {
      // In a real app with complex skips, going back can be tricky. 
      // For simplicity, we just go to the immediate previous section or keep a history stack.
      setCurrentSectionIndex((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

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
                  name={`q-${question.id}`}
                  value={option}
                  checked={value === option}
                  onChange={() => handleAnswerChange(question.id, option)}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-lg">{option}</span>
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
                  <span className="text-gray-700 text-lg">{option}</span>
                </label>
              )
            })}
          </div>
        );
      case 'linear':
        return (
          <div className="mt-6 flex flex-col items-center">
            <div className="flex w-full justify-between mb-2 text-sm text-gray-500 font-medium">
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
                    className={`flex-1 py-3 sm:py-4 rounded-xl text-lg font-semibold transition-all ${
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
              rows={4}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm resize-none text-lg"
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
            Cada resposta será considerada com atenção e nos ajudará a construir as próximas edições do {eventTitle}.
            Esperamos encontrar você novamente em breve! 🙏
          </p>
        </motion.div>
      </div>
    );
  }

  const progressPercentage = Math.round(((currentSectionIndex) / surveyData.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-24">
      {/* Header */}
      <header className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-xl text-blue-900 truncate">{eventTitle}</h1>
            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {currentSectionIndex + 1} de {surveyData.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        
        {isFirstSection && (
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Bem-vindo(a)!</h2>
            <p className="text-blue-800/80">
              Sua avaliação é muito importante para entendermos o que funcionou bem e o que podemos melhorar.
              A pesquisa leva cerca de <strong>5 minutos</strong> e é totalmente <strong>anônima</strong>. Seja sincero(a)!
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSectionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-gray-800 mb-2">{currentSection.title}</h2>
              {currentSection.description && (
                <p className="text-gray-500 text-lg">{currentSection.description}</p>
              )}
            </div>

            <div className="space-y-10">
              {currentSection.questions.map((question) => (
                <div key={question.id} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    {question.text}
                  </h3>
                  {renderQuestion(question)}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-3xl mx-auto flex gap-4">
          <button
            onClick={handlePrev}
            disabled={isFirstSection}
            className={`flex-1 py-4 flex items-center justify-center gap-2 rounded-xl font-bold transition-all ${
              isFirstSection ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <ChevronLeft size={20} />
            Voltar
          </button>
          <button
            onClick={handleNext}
            className="flex-[2] py-4 bg-blue-600 text-white flex items-center justify-center gap-2 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            {isLastSection ? (
              <>Enviar <Send size={20} /></>
            ) : (
              <>Próximo <ChevronRight size={20} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
