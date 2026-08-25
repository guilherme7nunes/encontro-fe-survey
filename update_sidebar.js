const fs = require('fs');

// --- Master Dashboard Page ---
const dashFile = 'src/app/dashboard/page.tsx';
let dashContent = fs.readFileSync(dashFile, 'utf8');

// Sidebar Logo
dashContent = dashContent.replace(
  '<div className="text-xl font-bold text-white flex items-center gap-2 mb-8">\n          <LayoutDashboard size={24} /> FE Surveys\n        </div>',
  '<div className="text-white flex items-center gap-3 mb-8">\n          <div className="bg-black p-1.5 rounded-xl"><img src="/logo.png" alt="Logo FE" className="w-8 h-8 object-contain" /></div>\n          <div className="font-bold leading-tight flex-1">Painel ADM<br/><span className="text-blue-400 text-xs font-normal">Pesquisas de Satisfação</span></div>\n        </div>'
);

// Nova Pesquisa Logic
const newSurveyBtnOld = `<button 
            onClick={() => alert('Em breve: Criador de pesquisas do zero!')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={20} /> Nova Pesquisa
          </button>`;
          
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
  dashContent = dashContent.replace('const handleDuplicate = (survey: any) => {', newSurveyLogic + '\n\n  const handleDuplicate = (survey: any) => {');
}

const newSurveyBtnNew = `<button 
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={20} /> Nova Pesquisa
          </button>`;

dashContent = dashContent.replace(newSurveyBtnOld, newSurveyBtnNew);
fs.writeFileSync(dashFile, dashContent);

// --- Specific Dashboard Page ---
const slugFile = 'src/app/dashboard/[slug]/page.tsx';
let slugContent = fs.readFileSync(slugFile, 'utf8');

// Sidebar Logo
slugContent = slugContent.replace(
  '<div className="text-xl font-bold text-white flex items-center gap-2 mb-8 px-2">\n          <LayoutDashboard size={24} /> ENF 26\n        </div>',
  '<div className="text-white flex items-center gap-3 mb-8 px-2">\n          <div className="bg-black p-1.5 rounded-xl"><img src="/logo.png" alt="Logo FE" className="w-8 h-8 object-contain" /></div>\n          <div className="font-bold leading-tight flex-1 line-clamp-2" title={eventTitle}>{eventTitle}</div>\n        </div>'
);

fs.writeFileSync(slugFile, slugContent);
console.log('Sidebar and create survey logic updated');
