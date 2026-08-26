const fs = require('fs');

// --- 1. Fix src/app/dashboard/[slug]/page.tsx ---
let slugPage = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

// A. Inject state and fetch for responses, and eventTitle
slugPage = slugPage.replace(
  "const [sectionsList, setSectionsList] = useState<any[]>([]);",
  `const [sectionsList, setSectionsList] = useState<any[]>([]);
  const [responsesData, setResponsesData] = useState<any[]>([]);
  const [surveyMeta, setSurveyMeta] = useState<any>({ title: 'Painel ENF 26' });`
);

slugPage = slugPage.replace(
  "const eventTitle = slug.includes('curitiba') ? 'ERFE Curitiba' : slug.includes('lideranca') ? 'Liderana Jovem 26' : 'Encontro Nacional da FE 2026';",
  "const eventTitle = surveyMeta.title;"
);

slugPage = slugPage.replace(
  "fetch(`/api/surveys/${slug}`)",
  `Promise.all([
      fetch(\`/api/surveys/\${slug}\`).then(r => r.json()),
      fetch(\`/api/surveys/\${slug}/responses\`).then(r => r.json())
    ]).then(([surveyData, responsesRes]) => {
      if (surveyData.config) {
        setSectionsList(surveyData.config);
      }
      if (surveyData.title) {
        setSurveyMeta(surveyData);
      }
      if (Array.isArray(responsesRes)) {
        setResponsesData(responsesRes);
      }
      setIsLoading(false);
    });
    // Removed old fetch`
);

// Remove the old .then cascade
slugPage = slugPage.replace(
  /\/\/ Removed old fetch\r?\n\s*\.then\(res => res\.json\(\)\)\r?\n\s*\.then\(data => \{\r?\n\s*if \(data\.config\) \{\r?\n\s*setSectionsList\(data\.config\);\r?\n\s*\}\r?\n\s*setIsLoading\(false\);\r?\n\s*\}\);/,
  "// Removed old fetch"
);

// Fix "Painel ENF 26" sidebar hardcode
slugPage = slugPage.replace(
  /<span className="font-bold">Painel ENF 26<\/span>/g,
  `<span className="font-bold">{eventTitle}</span>`
);
slugPage = slugPage.replace(
  /<div className="font-bold text-lg mb-4 text-slate-300 px-4">Painel ENF 26<\/div>/g,
  `<div className="font-bold text-lg mb-4 text-slate-300 px-4">{eventTitle}</div>`
);


// Dynamic Renderer
const dynamicRenderer = `
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
  
  const renderDynamicOverview = () => {
    if (!sectionsList || sectionsList.length === 0) {
      return <div className="text-gray-500 bg-white p-8 rounded-2xl text-center">Nenhuma pergunta configurada. Vá na aba Configurar Pesquisa.</div>;
    }

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="font-medium">Total de Respostas</span>
              <Users size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{responsesData.length}</div>
          </div>
        </div>

        {sectionsList.map((section) => (
          <div key={section.id} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">{section.title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {section.questions.map((q) => {
                if (q.type === 'textarea') return null;
                let chartData = [];
                if (q.type === 'radio' || q.type === 'checkbox') {
                  const options = q.options || [];
                  const counts = {};
                  options.forEach(o => counts[o] = 0);
                  responsesData.forEach(res => {
                    const ans = res.answers && res.answers[q.id];
                    if (ans) {
                      if (Array.isArray(ans)) ans.forEach(a => { if (counts[a] !== undefined) counts[a]++ });
                      else if (counts[ans] !== undefined) counts[ans]++;
                    }
                  });
                  chartData = options.map((opt, i) => ({
                    name: opt.length > 25 ? opt.substring(0, 25) + '...' : opt,
                    count: counts[opt],
                    color: COLORS[i % COLORS.length]
                  }));
                } else if (q.type === 'linear') {
                  const counts = {};
                  for (let i = q.min; i <= q.max; i++) counts[i] = 0;
                  responsesData.forEach(res => {
                    const ans = res.answers && res.answers[q.id];
                    if (ans !== undefined && counts[ans] !== undefined) counts[ans]++;
                  });
                  chartData = Object.keys(counts).map((val, i) => ({
                    name: val,
                    count: counts[val],
                    color: COLORS[i % COLORS.length]
                  }));
                }
                if (chartData.length === 0) return null;

                return (
                  <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">{q.text}</h3>
                    <div className="h-72 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                          <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} allowDecimals={false} />
                          <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={\`cell-\${index}\`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };
`;

slugPage = slugPage.replace(
  "const [activeTab, setActiveTab] = useState",
  dynamicRenderer + "\n  const [activeTab, setActiveTab] = useState"
);

// Target exactly the overview block and replace it, leaving the config tab intact.
const overviewStart = slugPage.indexOf("{activeTab === 'overview' && (");
const configStart = slugPage.indexOf("{activeTab === 'config' && (");
if (overviewStart !== -1 && configStart !== -1) {
  slugPage = slugPage.substring(0, overviewStart) + 
             "{activeTab === 'overview' && renderDynamicOverview()}\n            " + 
             slugPage.substring(configStart);
}

// Remove old mock variables BUT keep them initialized as empty arrays if needed by other tabs
slugPage = slugPage.replace(
  /\/\/ Mock data: KPI and Charts[\s\S]*?\/\/ Mock data: All Responses \(General\)[\s\S]*?const satisfactionByArea = [^\]]+\];/m,
  "// Mock data removed\nconst allResponses: any[] = [];\nconst actionPlan: any[] = [];\nconst satisfactionByArea: any[] = [];"
);
slugPage = slugPage.replace(/const COLORS = \['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'\];/g, "");
slugPage = slugPage.replace(/const PIE_COLORS = \['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#f59e0b'\];/g, "");

fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', slugPage);

// --- 2. Fix src/app/dashboard/page.tsx ---
let mainPage = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Add state for open menu
mainPage = mainPage.replace(
  "const [isLoading, setIsLoading] = useState(true);",
  `const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);`
);

// Add pause and delete functions
mainPage = mainPage.replace(
  "const handleDuplicate =",
  `const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta pesquisa?')) {
      // In a real app, you would call DELETE /api/surveys/\${id}
      // For now we just remove it from state
      setSurveys(surveys.filter(s => s.id !== id));
      setOpenMenuId(null);
    }
  };

  const handleToggleStatus = async (survey: any) => {
    const newStatus = survey.status === 'Ativa' ? 'Pausada' : 'Ativa';
    // Call API
    await fetch(\`/api/surveys/\${survey.id}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setSurveys(surveys.map(s => s.id === survey.id ? { ...s, status: newStatus } : s));
    setOpenMenuId(null);
  };

  const handleDuplicate =`
);

// Replace MoreVertical button with dropdown
const oldMoreButton = `<button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical size={20} />
                </button>`;

const newDropdown = `<div className="relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === survey.id ? null : survey.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openMenuId === survey.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                      <button onClick={() => handleToggleStatus(survey)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        {survey.status === 'Ativa' ? 'Pausar Recebimento' : 'Ativar Recebimento'}
                      </button>
                      <button onClick={() => handleDelete(survey.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Excluir Pesquisa
                      </button>
                    </div>
                  )}
                </div>`;

mainPage = mainPage.replace(oldMoreButton, newDropdown);

fs.writeFileSync('src/app/dashboard/page.tsx', mainPage);

console.log('Fixed everything');
