const fs = require('fs');

const file = 'src/app/dashboard/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state variables
const stateInjectPoint = "const [questionsList, setQuestionsList] = useState(allQuestions);";
const stateVars = `const [questionsList, setQuestionsList] = useState(allQuestions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);`;
content = content.replace(stateInjectPoint, stateVars);

// 2. Update Nova Pergunta button
content = content.replace(
  '<button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold \ntransition-colors flex items-center gap-2 shadow-sm">',
  '<button onClick={() => { setCurrentQuestion(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm">'
);

// Fallback if formatting was different
content = content.replace(
  '<button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm">\n                    <Plus size={20} /> Nova Pergunta\n                  </button>',
  '<button onClick={() => { setCurrentQuestion(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm">\n                    <Plus size={20} /> Nova Pergunta\n                  </button>'
);

// 3. Update Edit/Delete buttons
content = content.replace(
  '<button className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>',
  '<button onClick={() => { setCurrentQuestion(q); setIsModalOpen(true); }} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>'
);
content = content.replace(
  '<button className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>',
  '<button onClick={() => setQuestionsList(questionsList.filter(item => item.id !== q.id))} className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>'
);

// 4. Inject Modal at the end of the return statement
const modalUI = `
      {/* Modal de Edição */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{currentQuestion ? 'Editar Pergunta' : 'Criar Nova Pergunta'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Título da Pergunta</label>
                 <textarea 
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none" 
                    rows={3}
                    defaultValue={currentQuestion ? currentQuestion.text : ''} 
                    placeholder="Ex: Como você avalia a limpeza dos banheiros?"
                 />
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Resposta</label>
                 <select 
                   className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                   defaultValue={currentQuestion ? currentQuestion.type : 'paragraph'}
                 >
                   <option value="paragraph">Texto Longo (Parágrafo)</option>
                   <option value="checkbox">Múltipla Escolha (Várias opções)</option>
                   <option value="radio">Escolha Única (Apenas uma opção)</option>
                   <option value="linear">Escala Linear (1 a 5 estrelas)</option>
                 </select>
              </div>

              {(currentQuestion?.type === 'checkbox' || currentQuestion?.type === 'radio') && (
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Opções de Resposta</label>
                  <div className="space-y-2">
                    {currentQuestion.options?.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" defaultValue={opt} className="flex-1 border border-gray-300 rounded-lg p-2 text-sm" />
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2">
                      <Plus size={14} /> Adicionar Opção
                    </button>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="obrigatoria" defaultChecked className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="obrigatoria" className="text-sm font-medium text-gray-700">Tornar esta pergunta obrigatória</label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
               <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">Cancelar</button>
               <button onClick={() => setIsModalOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors">Salvar Pergunta</button>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace('    </div>\n  );\n}', modalUI + '\n    </div>\n  );\n}');

fs.writeFileSync(file, content);
console.log('Modal injected successfully');
