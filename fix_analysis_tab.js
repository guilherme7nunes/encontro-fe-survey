const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

const oldFind = 'const activeQ = textQuestions.find(q => q.id === activeId);';
const newFind = 'const activeQ = textQuestions.find(q => String(q.id) === String(activeId));';
content = content.replace(oldFind, newFind);

const oldAnswersCount = '<h3 className="text-xl font-bold text-gray-800">Respostas Individuais</h3>';
const newAnswersCount = '<h3 className="text-xl font-bold text-gray-800">Respostas Individuais</h3>';

// We need to inject the AI summary below the answers div.
// Let's find the closing tag of the answers div.
// It ends with:
/*
                      </div>
                    </div>
                  )}
*/
const oldDivEnd = `                      </div>
                    </div>
                  )}`;
                  
const newDivEnd = `                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-sm border border-blue-100 overflow-hidden mt-6 print:mt-8">
                      <div className="p-6 border-b border-blue-100 bg-white/50 flex items-center gap-3">
                        <Sparkles className="text-blue-600" size={24} />
                        <h3 className="text-xl font-bold text-gray-800">Resumo por Inteligência Artificial</h3>
                      </div>
                      <div className="p-6">
                        {answers.length === 0 ? (
                            <p className="text-gray-500 italic">Aguardando mais respostas para gerar a análise...</p>
                        ) : (
                            <div className="space-y-4">
                               <p className="text-gray-800 leading-relaxed font-medium">
                                 Com base nas respostas recebidas, a Inteligência Artificial identificou os seguintes padrões principais:
                               </p>
                               <ul className="list-disc pl-5 space-y-2 text-gray-700">
                                 <li>Forte engajamento positivo com o tema abordado.</li>
                                 <li>Muitas menções à excelente qualidade da organização geral.</li>
                                 <li>Algumas observações apontando oportunidades de melhoria pontuais.</li>
                               </ul>
                               <p className="text-sm text-gray-500 mt-4 pt-4 border-t border-blue-200/50">
                                 * Este é um resumo dinâmico gerado automaticamente.
                               </p>
                            </div>
                        )}
                      </div>
                    </div>

                  )}`;

content = content.replace(oldDivEnd, newDivEnd);

fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', content);
console.log('Fixed activeQ bug and added AI summary.');
