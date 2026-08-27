const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

const startIdx = content.indexOf('const handleAddTopic = () => {');
const endIdx = content.indexOf('const [selectedQuestionId', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const newFn = `const handleAddTopic = () => {
    setEditingTopic({ title: '', description: '' });
    setIsTopicModalOpen(true);
  };\n\n  `;
  
    content = content.substring(0, startIdx) + newFn + content.substring(endIdx);
    fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', content);
    console.log('Fixed handleAddTopic via substring 3!');
} else {
    console.log('Could not find indices!');
}
