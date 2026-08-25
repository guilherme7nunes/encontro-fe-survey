const fs = require('fs');
const file = 'src/app/dashboard/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add currentSectionId to state
const stateVars = `const [sectionsList, setSectionsList] = useState(surveyData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [currentSectionId, setCurrentSectionId] = useState<number | null>(null);

  const handleSaveQuestion = () => {
    // Basic mock implementation for saving a question
    setIsModalOpen(false);
    
    // Create mock new question
    const newQuestion = {
      id: Date.now(),
      text: 'Nova pergunta adicionada...',
      type: 'paragraph',
    };

    setSectionsList(prev => prev.map(section => {
      if (section.id === currentSectionId) {
        // If editing existing
        if (currentQuestion) {
           return { ...section, questions: section.questions.map(q => q.id === currentQuestion.id ? { ...q, text: 'Pergunta editada...' } : q) };
        }
        // If adding new
        return { ...section, questions: [...section.questions, newQuestion] };
      }
      return section;
    }));
  };

  const handleAddTopic = () => {
    const newSection = {
      id: Date.now(),
      title: 'Novo Tópico',
      description: 'Descrição do novo tópico',
      questions: []
    };
    setSectionsList([...sectionsList, newSection]);
  };
`;

content = content.replace(
  /const \[sectionsList, setSectionsList\] = useState\(surveyData\);\s*const \[isModalOpen, setIsModalOpen\] = useState\(false\);\s*const \[currentQuestion, setCurrentQuestion\] = useState\(null\);/,
  stateVars
);

// 2. Update Nova Pergunta (top button)
content = content.replace(
  '<button onClick={() => { setCurrentQuestion(null); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm">',
  '<button onClick={() => { setCurrentQuestion(null); setCurrentSectionId(sectionsList[sectionsList.length - 1]?.id); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm">'
);

// 3. Update Edit button (inside question card)
content = content.replace(
  /<button onClick=\{\(\) => \{ setCurrentQuestion\(q\); setIsModalOpen\(true\); \}\} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"><Edit size=\{16\} \/><\/button>/g,
  '<button onClick={() => { setCurrentQuestion(q); setCurrentSectionId(section.id); setIsModalOpen(true); }} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>'
);

// 4. Update Adicionar pergunta a este tópico (bottom of section)
content = content.replace(
  '<button className="w-full border-2 border-dashed border-gray-200 hover:border-blue-400 text-gray-400 hover:text-blue-600 font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 bg-gray-50/50 hover:bg-blue-50/50">',
  '<button onClick={() => { setCurrentQuestion(null); setCurrentSectionId(section.id); setIsModalOpen(true); }} className="w-full border-2 border-dashed border-gray-200 hover:border-blue-400 text-gray-400 hover:text-blue-600 font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 bg-gray-50/50 hover:bg-blue-50/50">'
);

// 5. Add "Novo Tópico" button at the very end of the sections list
content = content.replace(
  '              </div>\n              \n              <div className="mt-8 flex justify-end gap-4 print:hidden">',
  `              </div>
              
              <div className="mt-12 mb-4">
                <button onClick={handleAddTopic} className="w-full border-2 border-dashed border-gray-300 hover:border-indigo-500 text-gray-500 hover:text-indigo-600 font-bold py-6 rounded-2xl transition-colors flex justify-center items-center gap-2 bg-white shadow-sm text-lg">
                  <Plus size={24} /> Criar Novo Tópico
                </button>
              </div>
              
              <div className="mt-8 flex justify-end gap-4 print:hidden">`
);

// 6. Hook up the "Salvar Pergunta" button in the modal
content = content.replace(
  '<button onClick={() => setIsModalOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors">Salvar Pergunta</button>',
  '<button onClick={handleSaveQuestion} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors">Salvar Pergunta</button>'
);

fs.writeFileSync(file, content);
console.log('Creation logic enabled');
