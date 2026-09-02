const fs = require('fs');

const filepath = 'src/app/dashboard/[slug]/page.tsx';
let content = fs.readFileSync(filepath, 'utf8');

// Patch 1: State
const stateInjectionPoint = `const [aiSummaryMap, setAiSummaryMap] = useState<{[key: string]: string}>({});`;
const stateInjectionCode = `const [aiSummaryMap, setAiSummaryMap] = useState<{[key: string]: string}>({});
  const [globalAiSummary, setGlobalAiSummary] = useState<string | null>(null);
  const [isGeneratingGlobalAi, setIsGeneratingGlobalAi] = useState(false);`;

content = content.replace(stateInjectionPoint, stateInjectionCode);

// Patch 2: Function
const functionInjectionPoint = `const handleClearResponses = async () => {`;
const functionInjectionCode = `
  const handleGenerateGlobalSummary = async () => {
    try {
      setIsGeneratingGlobalAi(true);
      const res = await fetch(\`/api/surveys/\${params.slug}/summarize-global\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          surveyTitle: surveyMeta.title,
          sectionsList: sectionsList,
          responsesData: responsesData
        })
      });
      const data = await res.json();
      if (data.summary) {
        setGlobalAiSummary(data.summary);
      } else if (data.error) {
        alert(data.error);
      }
    } catch (e: any) {
      alert('Erro ao gerar resumo global.');
    } finally {
      setIsGeneratingGlobalAi(false);
    }
  };

  const handleClearResponses = async () => {`;

content = content.replace(functionInjectionPoint, functionInjectionCode);

// Patch 3: Update renderDynamicOverview (Grid and PieChart)
const oldGridStart = `<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">`;
const newGridStart = `<div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">`;
content = content.replace(oldGridStart, newGridStart).replace(oldGridStart, newGridStart).replace(oldGridStart, newGridStart).replace(oldGridStart, newGridStart).replace(oldGridStart, newGridStart).replace(oldGridStart, newGridStart).replace(oldGridStart, newGridStart); // just in case it appears multiple times, actually it only appears once per section map inside renderDynamicOverview. Wait, I should replace it with a regex to be safe.

content = content.replace(/<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">/g, '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">');

// Replace chart heights
content = content.replace(/<div className="h-72 w-full">/g, '<div className="h-64 w-full">');

// Add PieChart logic
// We need to find the BarChart block and replace it conditionally based on q.type
const chartBlockRegex = /<BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>([\s\S]*?)<\/BarChart>/;

const newChartBlock = `
                          {q.type === 'radio' ? (
                            <PieChart>
                              <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => \`\${(percent * 100).toFixed(0)}%\`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                              >
                                {chartData.map((entry, index) => (
                                  <Cell key={\`cell-\${index}\`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                              <Legend wrapperStyle={{fontSize: '12px'}} />
                            </PieChart>
                          ) : (
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
                          )}
`;

content = content.replace(chartBlockRegex, newChartBlock);


// Fix Legend import
content = content.replace(/PieChart, Pie, Cell/g, 'PieChart, Pie, Cell, Legend');


// Patch 4: Display in Overview and Actions

// Let's create a shared Global AI UI block
const globalAiBlock = `
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-8 rounded-2xl border border-blue-100 mb-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                  <Sparkles size={24} className="text-blue-600" />
                  Plano de Ação Inteligente (IA)
                </h3>
                <p className="text-blue-700 text-sm mt-1">Análise executiva de {responsesData.length} respostas.</p>
              </div>
              <button 
                onClick={handleGenerateGlobalSummary}
                disabled={isGeneratingGlobalAi || responsesData.length === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
              >
                {isGeneratingGlobalAi ? 'Analisando dados...' : 'Gerar Relatório'}
              </button>
            </div>
            
            {globalAiSummary ? (
              <div className="prose prose-blue max-w-none text-gray-800 font-medium whitespace-pre-wrap bg-white p-6 rounded-xl shadow-sm border border-blue-100/50">
                <div dangerouslySetInnerHTML={{ __html: globalAiSummary.replace(/\\*\\*(.*?)\\*\\*/g, '<b>$1</b>').replace(/\\*(.*?)\\*/g, '<i>$1</i>').replace(/\\n/g, '<br/>') }}></div>
              </div>
            ) : (
              <div className="bg-white/60 p-8 rounded-xl border border-blue-100/50 text-center text-blue-800/60">
                Clique no botão acima para que a IA gere um relatório executivo cruzando todos os dados qualitativos e quantitativos desta pesquisa.
              </div>
            )}
          </div>
`;

// Insert into Overview
const overviewMarker = `          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">`;
content = content.replace(overviewMarker, globalAiBlock + '\n' + overviewMarker);

// Replace Actions Tab content
const actionsTabOld = `{activeTab === 'actions' && (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <Sparkles size={48} className="text-blue-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Plano de Ação Inteligente em Breve</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Assim que recebermos um volume suficiente de respostas reais, nossa Inteligência Artificial irá analisar os dados e gerar um plano de ação focado automaticamente.
              </p>
            </div>
          )}`;

const actionsTabNew = `{activeTab === 'actions' && (
            <div>
              ${globalAiBlock}
            </div>
          )}`;

content = content.replace(actionsTabOld, actionsTabNew);

fs.writeFileSync(filepath, content);
console.log('Patched page.tsx successfully!');
