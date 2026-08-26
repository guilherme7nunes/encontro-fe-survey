const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

// 1. Inject state
content = content.replace(
  "const [sectionsList, setSectionsList] = useState<any[]>([]);",
  "const [sectionsList, setSectionsList] = useState<any[]>([]);\n  const [responsesData, setResponsesData] = useState<any[]>([]);"
);

// 2. Inject fetch
content = content.replace(
  "fetch(`/api/surveys/${slug}`)",
  `Promise.all([
      fetch(\`/api/surveys/\${slug}\`).then(r => r.json()),
      fetch(\`/api/surveys/\${slug}/responses\`).then(r => r.json())
    ]).then(([surveyData, responsesRes]) => {
      if (surveyData.config) {
        setSectionsList(surveyData.config);
      }
      if (Array.isArray(responsesRes)) {
        setResponsesData(responsesRes);
      }
      setIsLoading(false);
    });
    // Removed old fetch`
);

// Remove the old .then cascade
content = content.replace(
  `.then(res => res.json())
        .then(data => {
          if (data.config) {
            setSectionsList(data.config);
          }
          setIsLoading(false);
        });`,
  ``
);

// 3. Create the dynamic overview renderer
const dynamicRenderer = `
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];
  
  const renderDynamicOverview = () => {
    if (!sectionsList || sectionsList.length === 0) {
      return <div className="text-gray-500">Nenhuma pergunta configurada. Vá na aba Configuração.</div>;
    }

    return (
      <div className="space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-gray-500">
              <span className="font-medium">Total de Respostas</span>
              <Users size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-gray-800">{responsesData.length}</div>
          </div>
        </div>

        {/* Dynamic Charts per Section */}
        {sectionsList.map((section) => (
          <div key={section.id} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-6">{section.title}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {section.questions.map((q) => {
                if (q.type === 'textarea') return null; // Skip open ended for overview

                // Calculate data
                let chartData = [];
                
                if (q.type === 'radio' || q.type === 'checkbox') {
                  const options = q.options || [];
                  const counts = {};
                  options.forEach(o => counts[o] = 0);
                  
                  responsesData.forEach(res => {
                    const ans = res.answers && res.answers[q.id];
                    if (ans) {
                      if (Array.isArray(ans)) {
                        ans.forEach(a => { if (counts[a] !== undefined) counts[a]++ });
                      } else {
                        if (counts[ans] !== undefined) counts[ans]++;
                      }
                    }
                  });
                  
                  chartData = options.map((opt, i) => ({
                    name: opt.length > 25 ? opt.substring(0, 25) + '...' : opt,
                    fullName: opt,
                    count: counts[opt],
                    color: COLORS[i % COLORS.length]
                  }));
                } else if (q.type === 'linear') {
                  const counts = {};
                  for (let i = q.min; i <= q.max; i++) counts[i] = 0;
                  
                  responsesData.forEach(res => {
                    const ans = res.answers && res.answers[q.id];
                    if (ans !== undefined && counts[ans] !== undefined) {
                      counts[ans]++;
                    }
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

content = content.replace(
  "const [activeTab, setActiveTab] = useState",
  dynamicRenderer + "\n  const [activeTab, setActiveTab] = useState"
);

// 4. Replace the old Overview tab JSX
const overviewRegex = /{activeTab === 'overview' && \(\s*<>\s*{\/\* KPI Cards \*\/}[\s\S]*?{activeTab === 'analysis' && \(/m;
if (!overviewRegex.test(content)) {
  console.log("Could not find overview regex block!");
}

content = content.replace(overviewRegex, `{activeTab === 'overview' && renderDynamicOverview()}\n            {activeTab === 'analysis' && (`);

// Remove the old mock data variables
content = content.replace(/\/\/ Mock data: KPI and Charts[\s\S]*?\/\/ Mock data: All Responses \(General\)[\s\S]*?const satisfactionByArea = [^\]]+\];/m, "// Mock data removed");
content = content.replace(/const COLORS = \['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'\];/g, "");
content = content.replace(/const PIE_COLORS = \['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#f59e0b'\];/g, "");

fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', content);
console.log('Fixed dynamic overview');
