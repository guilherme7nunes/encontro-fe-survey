const fs = require('fs');

// --- 1. Master Dashboard Config Tab ---
let mainPage = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// Add state
mainPage = mainPage.replace(
  /const \[isLoading, setIsLoading\] = useState\(true\);/,
  "const [isLoading, setIsLoading] = useState(true);\n  const [activeTab, setActiveTab] = useState<'surveys' | 'config'>('surveys');"
);

// Update Links
mainPage = mainPage.replace(
  /<Link href="\/dashboard" className="flex items-center gap-3 bg-blue-600\/20 text-blue-400 px-4 py-3 rounded-lg font-bold">/,
  `<button onClick={() => setActiveTab('surveys')} className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors \${activeTab === 'surveys' ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800 font-medium'}\`}>`
);
mainPage = mainPage.replace(
  /<LayoutDashboard size=\{20\} \/> Minhas Pesquisas\s*<\/Link>/,
  `<LayoutDashboard size={20} /> Minhas Pesquisas\n            </button>`
);

mainPage = mainPage.replace(
  /<Link href="#" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-lg font-medium transition-colors">/,
  `<button onClick={() => setActiveTab('config')} className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors \${activeTab === 'config' ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800 font-medium'}\`}>`
);
mainPage = mainPage.replace(
  /<Settings size=\{20\} \/> Configura..es\s*<\/Link>/,
  `<Settings size={20} /> Configurações\n            </button>`
);

// Wrap content
mainPage = mainPage.replace(
  /{filteredSurveys\.length === 0 && \([\s\S]*?<\/div>\s*\)\}\s*<\/div>/m,
  `$&
          {activeTab === 'config' && (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mt-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Configurações do Sistema</h2>
              <p className="text-gray-500 mb-6">Em breve você poderá gerenciar usuários e permissões de acesso aqui.</p>
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-blue-600 font-medium">Módulo de Autenticação em desenvolvimento.</span>
              </div>
            </div>
          )}`
);

// Hide surveys when in config tab
mainPage = mainPage.replace(
  /<header className="flex justify-between items-center mb-8">/,
  `{activeTab === 'surveys' && (<>\n          <header className="flex justify-between items-center mb-8">`
);
mainPage = mainPage.replace(
  /{filteredSurveys\.length === 0 && \([\s\S]*?<\/div>\s*\)\}\s*<\/div>/m,
  `$&\n          </>)}`
);

fs.writeFileSync('src/app/dashboard/page.tsx', mainPage);

// --- 2. Add "Zerar Pesquisa" to src/app/dashboard/[slug]/page.tsx ---
let slugPage = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

// We need a delete API for all responses. 
// For now, let's just make it call a new API or clear state. Actually, creating the API route is easy.
const clearApiRoute = `import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export async function DELETE(request: Request, context: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await context.params;
  try {
    await prisma.response.deleteMany({ where: { surveyId: resolvedParams.slug } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao zerar' }, { status: 500 });
  }
}
`;
fs.writeFileSync('src/app/api/surveys/[slug]/responses/clear/route.ts', clearApiRoute);

// In slugPage, we add the function
slugPage = slugPage.replace(
  /const \[isLoading, setIsLoading\] = useState\(true\);/,
  `const [isLoading, setIsLoading] = useState(true);\n  const handleClearResponses = async () => {\n    if (confirm('ATENÇÃO: Isso apagará TODAS as respostas desta pesquisa permanentemente. Tem certeza?')) {\n      await fetch(\`/api/surveys/\${params.slug}/responses/clear\`, { method: 'DELETE' });\n      setResponsesData([]);\n      alert('Respostas apagadas com sucesso.');\n    }\n  };`
);

// Add the button to the header of the Responses tab
slugPage = slugPage.replace(
  /\{activeTab === 'responses' && \(/,
  `{activeTab === 'responses' && (\n            <div className="flex justify-end mb-4">\n              <button onClick={handleClearResponses} className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-bold text-sm transition-colors border border-red-100 flex items-center gap-2"><Trash2 size={16}/> Zerar todas as respostas</button>\n            </div>`
);

// Ensure Trash2 is imported
if (!slugPage.includes('Trash2')) {
  slugPage = slugPage.replace(/import \{ LayoutDashboard/g, 'import { Trash2, LayoutDashboard');
}

fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', slugPage);

console.log('Added config tab and clear button');
