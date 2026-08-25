const fs = require('fs');
const file = 'src/app/survey/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add useEffect
content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");

// 2. Fetch data
const fetchLogic = `
  const [surveyData, setSurveyData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(\`/api/surveys/\${slug}\`)
      .then(res => res.json())
      .then(data => {
        if (data.config) {
          setSurveyData(data.config);
        }
        setIsLoading(false);
      });
  }, [slug]);
`;

// Remove local surveyData import
content = content.replace("import { surveyData } from '../../../data/questions';", "");
content = content.replace("import { Question } from '../../../data/questions';", ""); // might not be there

// Find insertion point
content = content.replace(
  "const [currentSectionIndex, setCurrentSectionIndex] = useState(0);",
  fetchLogic + "\n  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);"
);

// 3. Update Submit Logic
const oldSubmit = `setTimeout(() => {\n      setIsFinished(true);\n    }, 1500);`;
const newSubmit = `
    fetch(\`/api/surveys/\${slug}/responses\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers })
    }).then(() => {
      setIsFinished(true);
    });
`;

content = content.replace(oldSubmit, newSubmit);

// 4. Wrap the return in loading check
const oldReturn = `return (\n    <div className="min-h-screen bg-gray-50 flex flex-col">`;
const newReturn = `
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!surveyData || surveyData.length === 0) return <div className="min-h-screen flex items-center justify-center">Pesquisa não encontrada ou vazia.</div>;

  return (\n    <div className="min-h-screen bg-gray-50 flex flex-col">`;

content = content.replace(oldReturn, newReturn);

fs.writeFileSync(file, content);
console.log('Survey page refactored');
