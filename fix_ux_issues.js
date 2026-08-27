const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

// 1. Fix question numbering
content = content.replace(
  /<span className="text-blue-600 mr-2">\{q\.id\}\.<\/span>/g,
  '<span className="text-blue-600 mr-2">{sIndex + 1}.{index + 1}.</span>'
);

// 2. Inject Topic states
if (!content.includes('isTopicModalOpen')) {
    content = content.replace(
        'const [currentSectionId, setCurrentSectionId] = useState<number | null>(null);',
        `const [currentSectionId, setCurrentSectionId] = useState<number | null>(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  
  const handleSaveTopic = () => {
    if (!editingTopic || !editingTopic.title.trim()) return;
    
    setSectionsList(prev => {
      let newSections;
      if (editingTopic.id) {
          // Editing existing
          newSections = prev.map(s => s.id === editingTopic.id ? { ...s, title: editingTopic.title, description: editingTopic.description } : s);
      } else {
          // Adding new
          newSections = [...prev, {
              id: Date.now(),
              title: editingTopic.title,
              description: editingTopic.description,
              questions: []
          }];
      }
      saveToDb(newSections);
      return newSections;
    });
    setIsTopicModalOpen(false);
    
    if (!editingTopic.id) {
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 300);
    }
  };

  const handleDeleteTopic = (id) => {
    if (confirm('Tem certeza que deseja excluir este tópico inteiro? Todas as perguntas nele serão perdidas.')) {
        setSectionsList(prev => {
            const newSections = prev.filter(s => s.id !== id);
            saveToDb(newSections);
            return newSections;
        });
    }
  };`
    );
}

// 3. Update handleAddTopic
const oldHandleAddTopicRegex = /const handleAddTopic = \(\) => \{[\s\S]*?saveToDb\(newSections\);\n\s*\};\n/m;
content = content.replace(oldHandleAddTopicRegex, `const handleAddTopic = () => {
    setEditingTopic({ title: '', description: '' });
    setIsTopicModalOpen(true);
  };
`);

// 4. Inject Topic Edit/Delete buttons in the render loop
content = content.replace(
    /<button className="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 \s*rounded-xl text-sm font-bold transition-colors flex items-center gap-2 border border-slate-700">\s*<Edit size=\{16\} \/> Editar\s*<\/button>/g,
    `<button onClick={() => { setEditingTopic(section); setIsTopicModalOpen(true); }} className="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 border border-slate-700">
       <Edit size={16} /> Editar
     </button>
     <button onClick={() => handleDeleteTopic(section.id)} className="text-slate-300 hover:text-red-400 bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 border border-slate-700">
       <Trash2 size={16} /> Excluir
     </button>`
);

// 5. Inject Topic Modal JSX at the end, right before the question modal
content = content.replace(
    /\{\/\* Modal de Edição \*\/\}/,
    `{/* Modal de Tópico */}
      {isTopicModalOpen && editingTopic && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{editingTopic.id ? 'Editar Tópico' : 'Criar Novo Tópico'}</h3>
              <button onClick={() => setIsTopicModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Nome do Tópico</label>
                 <input 
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-gray-900 font-medium" 
                    value={editingTopic.title}
                    onChange={(e) => setEditingTopic({...editingTopic, title: e.target.value})}
                    placeholder="Ex: Sobre o evento"
                 />
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Descrição (Opcional)</label>
                 <textarea 
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900 font-medium" 
                    rows={2}
                    value={editingTopic.description || ''}
                    onChange={(e) => setEditingTopic({...editingTopic, description: e.target.value})}
                    placeholder="Ex: Queremos saber sua opinião sobre a organização."
                 />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
               <button onClick={() => setIsTopicModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">Cancelar</button>
               <button onClick={handleSaveTopic} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors">Salvar Tópico</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edição */}`
);

fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', content);
console.log('Fixed UI issues.');
