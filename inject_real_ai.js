const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

// 1. Inject state variables and handleGenerateAiSummary function
const hookInjectionPoint = 'const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);';
const hookInjectionCode = `const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSummaryMap, setAiSummaryMap] = useState<{[key: string]: string}>({});
  
  const handleGenerateAiSummary = async (questionId: string, questionText: string, textAnswers: any[]) => {
    if (textAnswers.length === 0) return;
    setIsGeneratingAi(true);
    try {
      const response = await fetch(\`/api/surveys/\${slug}/summarize\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionTitle: questionText, answers: textAnswers })
      });
      const data = await response.json();
      if (data.summary) {
         setAiSummaryMap(prev => ({ ...prev, [questionId]: data.summary }));
      } else if (data.error) {
         alert(data.error);
      }
    } catch (e) {
      alert('Erro ao gerar resumo.');
    } finally {
      setIsGeneratingAi(false);
    }
  };
`;

if (!content.includes('isGeneratingAi')) {
    content = content.replace(hookInjectionPoint, hookInjectionCode);
}

// 2. Inject JSX in activeTab === 'analysis'
const jsxInjectionPoint = '{activeQ && (';
const jsxInjectionCode = `{activeQ && (
                    <>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 overflow-hidden mt-2 mb-6">
                        <div className="p-6 border-b border-blue-100 bg-white/50 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                          <div className="flex items-center gap-3">
                             <Sparkles className="text-blue-600" size={24} />
                             <h3 className="text-xl font-bold text-gray-800">Resumo por Inteligência Artificial</h3>
                          </div>
                          <button 
                             onClick={() => handleGenerateAiSummary(activeQ.id, activeQ.text, answers)}
                             disabled={isGeneratingAi || answers.length === 0}
                             className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-bold shadow-sm transition-colors text-sm flex items-center gap-2 whitespace-nowrap"
                          >
                             {isGeneratingAi ? 'Analisando...' : 'Gerar Resumo'}
                          </button>
                        </div>
                        <div className="p-6">
                          {answers.length === 0 ? (
                              <p className="text-gray-500 italic">Aguardando respostas para gerar a análise...</p>
                          ) : !aiSummaryMap[activeQ.id] ? (
                              <p className="text-gray-600">Clique no botão acima para que a Inteligência Artificial leia e resuma as {answers.length} respostas desta pergunta.</p>
                          ) : (
                              <div className="prose prose-blue max-w-none text-gray-800 font-medium whitespace-pre-wrap">
                                 {aiSummaryMap[activeQ.id].split('\\n').map((line, i) => (
                                    <p key={i} className="mb-2">{line.replace(/\\*\\*(.*?)\\*\\*/g, '<b>$1</b>').replace(/\\*(.*?)\\*/g, '<i>$1</i>')}</p>
                                 ))}
                              </div>
                          )}
                        </div>
                      </div>
`;

if (!content.includes('Resumo por Inteligência Artificial')) {
    // Also we need to close the <> fragment since we opened it.
    // The closing tag for {activeQ && (
    // Was: 
    //                   </div>
    //                 </div>
    //               )}
    // Now it should be:
    //                   </div>
    //                 </div>
    //               </>
    //               )}
    content = content.replace(jsxInjectionPoint, jsxInjectionCode);
    const endInjectionPoint = `                      </div>
                    </div>
                  )}`;
    const endInjectionCode = `                      </div>
                    </div>
                    </>
                  )}`;
    content = content.replace(endInjectionPoint, endInjectionCode);
}

fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', content);
console.log('Injected Real AI summary integration.');
