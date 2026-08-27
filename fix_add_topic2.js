const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

const startIdx = content.indexOf('const handleAddTopic = () => {');
const endIdx = content.indexOf('saveToDb(newSections);\n  };', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
    const fullEnd = endIdx + 'saveToDb(newSections);\n  };'.length;
    
    const newFn = `const handleAddTopic = () => {
    setEditingTopic({ title: '', description: '' });
    setIsTopicModalOpen(true);
  };`;
  
    content = content.substring(0, startIdx) + newFn + content.substring(fullEnd);
    fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', content);
    console.log('Fixed handleAddTopic via substring!');
} else {
    console.log('Could not find indices!');
}
