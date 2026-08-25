const fs = require('fs');
const dashFile = 'src/app/dashboard/page.tsx';
let dashContent = fs.readFileSync(dashFile, 'utf8');

const newSurveyLogic = `const handleCreateNew = () => {
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

if (!dashContent.includes('handleCreateNew = () => {')) {
  dashContent = dashContent.replace('const handleDuplicate =', newSurveyLogic + '\n\n  const handleDuplicate =');
}

fs.writeFileSync(dashFile, dashContent);
