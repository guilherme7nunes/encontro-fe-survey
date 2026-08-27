const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

const oldFn = `const handleAddTopic = () => {
    const newSection = {
      id: Date.now(),
      title: 'Novo Tópico',
      description: 'Descrição do novo tópico',
      questions: []
    };
    const newSections = [...sectionsList, newSection];
    setSectionsList(newSections);
    saveToDb(newSections);
  };`;

const newFn = `const handleAddTopic = () => {
    setEditingTopic({ title: '', description: '' });
    setIsTopicModalOpen(true);
  };`;

content = content.replace(oldFn, newFn);
fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', content);
console.log('Fixed handleAddTopic.');
