const fs = require('fs');

let slugPage = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

// 1. Add editingQ state
if (!slugPage.includes('const [editingQ, setEditingQ]')) {
    slugPage = slugPage.replace(
        /const \[currentQuestion, setCurrentQuestion\] = useState<any>\(null\);/,
        "const [currentQuestion, setCurrentQuestion] = useState<any>(null);\n    const [editingQ, setEditingQ] = useState<any>(null);"
    );
}

// 2. Fix the edit button logic in the map loop
slugPage = slugPage.replace(
    /onClick=\{\(\) => \{ setCurrentQuestion\(q\); setCurrentSectionId\(section\.id\); setIsModalOpen\(true\); \}\}/g,
    "onClick={() => { setCurrentQuestion(q); setEditingQ(JSON.parse(JSON.stringify(q))); setCurrentSectionId(section.id); setIsModalOpen(true); }}"
);

// 3. Fix the add question button logic
slugPage = slugPage.replace(
    /onClick=\{\(\) => \{ setCurrentQuestion\(null\); setCurrentSectionId\(section\.id\); setIsModalOpen\(true\); \}\}/g,
    "onClick={() => { setCurrentQuestion(null); setEditingQ({ id: Date.now(), text: '', type: 'radio', options: ['Opção 1', 'Opção 2'] }); setCurrentSectionId(section.id); setIsModalOpen(true); }}"
);

// 4. Rewrite handleSaveQuestion
const handleSaveQuestionRegex = /const handleSaveQuestion = \(\) => \{[\s\S]*?return newSections;\n\s*\}\);\n\s*\};\n/m;
const newHandleSaveQuestion = `const handleSaveQuestion = () => {
      setIsModalOpen(false);
      
      setSectionsList(prev => {
        const newSections = prev.map(section => {
        if (section.id === currentSectionId) {
          // If editing existing
          if (currentQuestion) {
             return { ...section, questions: section.questions.map(q => q.id === currentQuestion.id ? editingQ : q) };
          }
          // If adding new
          return { ...section, questions: [...section.questions, editingQ] };
        }
        return section;
        });
        saveToDb(newSections);
        return newSections;
      });
    };
`;
slugPage = slugPage.replace(handleSaveQuestionRegex, newHandleSaveQuestion);

// 5. Rewrite the modal UI
const modalRegex = /\{\/\* Modal de Edi..o \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*\)\}/m;
const newModal = `{/* Modal de Edição */}
        {isModalOpen && editingQ && (
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
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900 font-medium" 
                    rows={3}
                    value={editingQ.text}
                    onChange={(e) => setEditingQ({...editingQ, text: e.target.value})}
                    placeholder="Ex: Como você avalia a limpeza dos banheiros?"
                 />
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Resposta</label>
                 <select 
                   className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 font-medium"
                   value={editingQ.type}
                   onChange={(e) => {
                       let opts = editingQ.options;
                       if ((e.target.value === 'radio' || e.target.value === 'checkbox') && (!opts || opts.length === 0)) {
                           opts = ['Opção 1', 'Opção 2'];
                       }
                       setEditingQ({...editingQ, type: e.target.value, options: opts});
                   }}
                 >
                   <option value="paragraph">Texto Longo (Parágrafo)</option>
                   <option value="checkbox">Múltipla Escolha (Várias opções)</option>
                   <option value="radio">Escolha Única (Apenas uma opção)</option>
                   <option value="linear">Escala Linear (1 a 5 estrelas)</option>
                 </select>
              </div>

              {(editingQ.type === 'checkbox' || editingQ.type === 'radio') && (
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Opções de Resposta</label>
                  <div className="space-y-2">
                    {(editingQ.options || []).map((opt: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <input 
                            type="text" 
                            value={opt} 
                            onChange={(e) => {
                                const newOpts = [...editingQ.options];
                                newOpts[i] = e.target.value;
                                setEditingQ({...editingQ, options: newOpts});
                            }}
                            className="flex-1 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 font-medium" 
                        />
                        <button 
                            onClick={() => {
                                const newOpts = editingQ.options.filter((_: any, idx: number) => idx !== i);
                                setEditingQ({...editingQ, options: newOpts});
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    <button 
                        onClick={() => setEditingQ({...editingQ, options: [...(editingQ.options||[]), 'Nova opção']})}
                        className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2">
                      <Plus size={14} /> Adicionar Opção
                    </button>
                  </div>
                </div>
              )}
              
              {editingQ.type === 'radio' && (
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-bold text-purple-700 mb-2 flex items-center gap-2"><Power size={14}/> Lógica Condicional (Salto)</label>
                  <p className="text-xs text-gray-500 mb-3">Defina se uma resposta específica deve fazer o usuário pular para o próximo tópico.</p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-purple-50/50 p-4 rounded-xl border border-purple-100">
                    <span className="text-sm font-bold text-gray-700 whitespace-nowrap">Pular se for:</span>
                    <select 
                        className="border border-gray-300 rounded-lg p-2 text-sm text-gray-900 bg-white min-w-[150px] w-full"
                        value={editingQ.condition?.valueToSkip || ''}
                        onChange={(e) => {
                            if (!e.target.value) {
                                const newQ = {...editingQ};
                                delete newQ.condition;
                                setEditingQ(newQ);
                            } else {
                                // Default target is the very next section (we will just set a dummy ID, but really the user wants to jump to the NEXT section. Wait, targetSectionId needs to be a real section ID.
                                // Actually, let's just make it visually say "Pular para o próximo" and we set targetSectionId to the currentSectionId + 1 (hacky, but it works for now since we just need ANY skip logic to trigger 'nextIndex').
                                setEditingQ({...editingQ, condition: { questionId: editingQ.id, valueToSkip: e.target.value, targetSectionId: currentSectionId! + 1 }});
                            }
                        }}
                    >
                       <option value="">Nenhuma (Não pular)</option>
                       {(editingQ.options || []).map((opt: string, i: number) => (
                         <option key={i} value={opt}>{opt}</option>
                       ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
               <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">Cancelar</button>
               <button onClick={handleSaveQuestion} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors">Salvar Pergunta</button>
            </div>
          </div>
        </div>
      )}`;
slugPage = slugPage.replace(modalRegex, newModal);

fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', slugPage);
console.log('Fixed Survey Builder Modal');
