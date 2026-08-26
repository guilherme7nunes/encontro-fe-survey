const fs = require('fs');

let slugPage = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

// --- Remove leftover mock variables ---
slugPage = slugPage.replace(/const openQuestionsData = \[[\s\S]*?\];/, '');
slugPage = slugPage.replace(/const allResponses: any\[\] = \[\];/, '');
slugPage = slugPage.replace(/const actionPlan: any\[\] = \[\];/, '');
slugPage = slugPage.replace(/const satisfactionByArea: any\[\] = \[\];/, '');

// --- Fix selectedQuestionId state ---
slugPage = slugPage.replace(
  /const \[selectedQuestionId, setSelectedQuestionId\] = useState\(openQuestionsData\[0\]\.id\);/,
  "const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);"
);
slugPage = slugPage.replace(
  /const selectedQuestion = openQuestionsData\.find\(q => q\.id === selectedQuestionId\);/,
  ""
);

// --- Replace Analysis Tab ---
const analysisRegex = /\{activeTab === 'analysis' && \([\s\S]*?\{activeTab === 'actions' && \(/m;
const dynamicAnalysis = `{activeTab === 'analysis' && (() => {
            const textQuestions = sectionsList.flatMap(s => s.questions.filter(q => q.type === 'textarea'));
            if (textQuestions.length === 0) {
              return <div className="bg-white p-8 rounded-2xl border text-center text-gray-500">Nenhuma pergunta aberta configurada nesta pesquisa.</div>;
            }
            const activeId = selectedQuestionId || textQuestions[0]?.id;
            const activeQ = textQuestions.find(q => q.id === activeId);
            const answers = responsesData.filter(r => r.answers && r.answers[activeId]).map(r => ({ id: r.id.substring(0, 8), text: r.answers[activeId] }));

            return (
              <div className="flex flex-col gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:break-inside-avoid print:mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Selecione uma pergunta aberta para analisar:</label>
                  <select 
                    className="w-full border border-gray-300 rounded-xl p-4 text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 outline-none"
                    value={activeId || ''}
                    onChange={(e) => setSelectedQuestionId(e.target.value)}
                  >
                    {textQuestions.map(q => (
                      <option key={q.id} value={q.id}>{q.text}</option>
                    ))}
                  </select>
                </div>
                {activeQ && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-2">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800">Respostas Individuais</h3>
                      <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {answers.length} respostas abertas lidas
                      </span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {answers.length === 0 ? (
                        <div className="p-6 text-gray-500 text-center">Nenhuma resposta recebida para esta pergunta ainda.</div>
                      ) : (
                        answers.map((answer, index) => (
                          <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">ID: #{answer.id}</span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">"{answer.text}"</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
          {activeTab === 'actions' && (`

slugPage = slugPage.replace(analysisRegex, dynamicAnalysis);

// --- Replace Actions Tab ---
const actionsRegex = /\{activeTab === 'actions' && \([\s\S]*?\{activeTab === 'responses' && \(/m;
const dynamicActions = `{activeTab === 'actions' && (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <Sparkles size={48} className="text-blue-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Plano de Ação Inteligente em Breve</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Assim que recebermos um volume suficiente de respostas reais, nossa Inteligência Artificial irá analisar os dados e gerar um plano de ação focado automaticamente.
              </p>
            </div>
          )}
          {activeTab === 'responses' && (`

slugPage = slugPage.replace(actionsRegex, dynamicActions);

// --- Replace Responses Tab ---
const responsesRegex = /\{activeTab === 'responses' && \([\s\S]*?\{isModalOpen &&/m;
const dynamicResponses = `{activeTab === 'responses' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider w-24">ID</th>
                      <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider w-40">Data</th>
                      <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">Conteúdo da Resposta (JSON)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {responsesData.length === 0 ? (
                      <tr><td colSpan={3} className="py-8 text-center text-gray-500">Nenhuma resposta registrada.</td></tr>
                    ) : (
                      responsesData.map((res) => (
                        <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 text-sm font-medium text-gray-500">#{res.id.substring(0, 8)}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{new Date(res.date).toLocaleString('pt-BR')}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-w-lg">
                              {JSON.stringify(res.answers, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {isModalOpen &&`

slugPage = slugPage.replace(responsesRegex, dynamicResponses);


fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', slugPage);
console.log('Fixed all remaining tabs');
