const fs = require('fs');

const dashFile = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(dashFile, 'utf8');

// 1. Add useEffect import
content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");

// 2. Remove initialSurveys and replace with API fetch
const oldStateLogic = `const [surveys, setSurveys] = useState(initialSurveys);
  const [searchTerm, setSearchTerm] = useState('');`;

const newStateLogic = `const [surveys, setSurveys] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/surveys')
      .then(res => res.json())
      .then(data => {
        setSurveys(data);
        setIsLoading(false);
      });
  }, []);`;

content = content.replace(oldStateLogic, newStateLogic);

// 3. Update handleCreateNew to use API
const oldCreateNew = `const handleCreateNew = () => {
    const name = window.prompt('Qual o nome do novo evento/pesquisa?');
    if (name) {
      const slug = name.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, '');
      const newSurvey = {
        id: slug,
        title: name,
        responses: 0,
        status: 'Rascunho' as const,
        date: new Date().toLocaleDateString('pt-BR')
      };
      setSurveys([newSurvey, ...surveys]);
    }
  };`;

const newCreateNew = `const handleCreateNew = async () => {
    const name = window.prompt('Qual o nome do novo evento/pesquisa?');
    if (name) {
      const slug = name.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, '');
      
      const res = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: slug, title: name, status: 'Rascunho' })
      });
      
      if (res.ok) {
        const newSurvey = await res.json();
        setSurveys([newSurvey, ...surveys]);
      }
    }
  };`;

content = content.replace(oldCreateNew, newCreateNew);

fs.writeFileSync(dashFile, content);
console.log('Master dashboard refactored');
