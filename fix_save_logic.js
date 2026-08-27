const fs = require('fs');

let pageContent = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

// 1. Fix handleSaveQuestion
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
// If the regex doesn't match, we will just use split and replace
if (handleSaveQuestionRegex.test(pageContent)) {
    pageContent = pageContent.replace(handleSaveQuestionRegex, newHandleSaveQuestion);
} else {
    // manual fallback replacement
    const startStr = 'const handleSaveQuestion = () => {';
    const endStr = 'const handleAddTopic = () => {';
    const startIdx = pageContent.indexOf(startStr);
    const endIdx = pageContent.indexOf(endStr);
    if (startIdx !== -1 && endIdx !== -1) {
        pageContent = pageContent.substring(0, startIdx) + newHandleSaveQuestion + '\n  ' + pageContent.substring(endIdx);
    }
}

// 2. Fix the top button "Nova Pergunta" -> "Novo Tópico"
pageContent = pageContent.replace(
    /<button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2\.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm">\s*<Plus size=\{20\} \/> Nova Pergunta\s*<\/button>/g,
    `<button onClick={handleAddTopic} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm">\n                  <Plus size={20} /> Novo Tópico\n                </button>`
);

fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', pageContent);
console.log('Fixed handleSaveQuestion and handleAddTopic button');
