const fs = require('fs');

const file = 'src/app/dashboard/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add visual badge on the question card if it has condition
const badgeInjectStr = `<span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase tracking-wider">
                          Tipo: {q.type === 'paragraph' ? 'Texto Longo' : q.type === 'checkbox' ? 'Múltipla Escolha' : 'Escala Linear'}
                        </span>`;
const newBadgeStr = `<span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase tracking-wider">
                          Tipo: {q.type === 'paragraph' ? 'Texto Longo' : q.type === 'checkbox' ? 'Múltipla Escolha' : q.type === 'radio' ? 'Escolha Única' : 'Escala Linear'}
                        </span>
                        {q.condition && (
                          <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                            Lógica de Pulo (Se '{q.condition.valueToSkip}')
                          </span>
                        )}`;
content = content.replace(badgeInjectStr, newBadgeStr);

// 2. Add Conditional Logic UI in the Modal
// Find where the options section ends
const optionsEndStr = `</button>
                  </div>
                </div>
              )}`;

const conditionUI = `</button>
                  </div>
                </div>
              )}
              
              {currentQuestion?.type === 'radio' && (
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-2 text-purple-700">⚡ Lógica Condicional (Salto)</label>
                  <p className="text-xs text-gray-500 mb-3">Defina se uma resposta específica deve fazer o usuário pular o restante deste tópico e ir para o próximo.</p>
                  <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <span className="text-sm font-bold text-gray-700">Se a resposta for:</span>
                    <select className="border border-gray-300 rounded-lg p-2 text-sm text-gray-900 bg-white min-w-[150px]">
                       <option value="">Nenhuma (Não pular)</option>
                       {currentQuestion.options?.map((opt, i) => (
                         <option key={i} value={opt} selected={currentQuestion.condition?.valueToSkip === opt}>{opt}</option>
                       ))}
                    </select>
                    <span className="text-sm font-bold text-gray-700">➔ Pular para próximo tópico</span>
                  </div>
                </div>
              )}`;

content = content.replace(optionsEndStr, conditionUI);

fs.writeFileSync(file, content);
console.log('Conditional logic added');
