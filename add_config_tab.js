const fs = require('fs');
const file = 'src/app/dashboard/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add Settings icon to lucide-react import
content = content.replace('MessageCircleQuestion, Sparkles, Printer, FileDown', 'MessageCircleQuestion, Sparkles, Printer, FileDown, Settings, Edit, Trash2, Plus, GripVertical');

// 2. Add 'config' to the activeTab state type
content = content.replace(
  "const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'responses' | 'analysis'>('overview');",
  "const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'responses' | 'analysis' | 'config'>('overview');\n  const [questionsList, setQuestionsList] = useState([\n    { id: 1, text: 'Você participou do Encontro em quais dias?', type: 'checkbox', options: ['Quinta', 'Sexta', 'Sábado'] },\n    { id: 2, text: 'Como você avalia o evento em geral?', type: 'linear' },\n    { id: 3, text: 'O que mais marcou você?', type: 'paragraph' }\n  ]);"
);

// 3. Add the 'Configurar Pesquisa' button to the sidebar
const sidebarBtnSearch = `          <button 
            onClick={() => setActiveTab('responses')}`;
const sidebarBtnReplace = `          <button 
            onClick={() => setActiveTab('config')}
            className={\`flex items-center justify-start gap-3 px-4 py-3 rounded-lg font-medium transition-colors \${activeTab === 'config' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}\`}
          >
            <Settings size={20} /> Configurar Pesquisa
          </button>
          
          <button 
            onClick={() => setActiveTab('responses')}`;
content = content.replace(sidebarBtnSearch, sidebarBtnReplace);

// 4. Update Header Title
content = content.replace(
  "{activeTab === 'responses' && 'Todas as Respostas Brutas'}",
  "{activeTab === 'responses' && 'Todas as Respostas Brutas'}\n            {activeTab === 'config' && 'Configuração do Questionário'}"
);

// 5. Add the Config Tab Content
const configTabContent = `
          {/* TAB: CONFIGURATOR */}
          {activeTab === 'config' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center print:hidden">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Construtor de Pesquisa</h3>
                  <p className="text-gray-500 mt-1">Adicione, edite ou remova as perguntas deste questionário.</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm">
                  <Plus size={20} /> Nova Pergunta
                </button>
              </div>

              <div className="space-y-4">
                {questionsList.map((q, index) => (
                  <div key={q.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex gap-4 group hover:border-blue-300 transition-colors">
                    <div className="pt-1 text-gray-300 cursor-grab hover:text-gray-500">
                      <GripVertical size={24} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-800 text-lg">
                          <span className="text-blue-600 mr-2">{index + 1}.</span> 
                          {q.text}
                        </h4>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                          <button className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        {q.type === 'paragraph' && (
                          <div className="w-full border-b border-gray-300 pb-2 text-gray-400 text-sm italic">Texto de resposta longa...</div>
                        )}
                        {q.type === 'checkbox' && q.options && (
                          <div className="flex flex-col gap-2">
                            {q.options.map(opt => (
                              <div key={opt} className="flex items-center gap-2 text-gray-600">
                                <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
                                {opt}
                              </div>
                            ))}
                          </div>
                        )}
                        {q.type === 'linear' && (
                          <div className="flex items-center gap-8 text-gray-600 text-sm">
                            <div className="flex flex-col items-center gap-2"><div className="w-4 h-4 rounded-full border border-gray-300"></div>1</div>
                            <div className="flex flex-col items-center gap-2"><div className="w-4 h-4 rounded-full border border-gray-300"></div>2</div>
                            <div className="flex flex-col items-center gap-2"><div className="w-4 h-4 rounded-full border border-gray-300"></div>3</div>
                            <div className="flex flex-col items-center gap-2"><div className="w-4 h-4 rounded-full border border-gray-300"></div>4</div>
                            <div className="flex flex-col items-center gap-2"><div className="w-4 h-4 rounded-full border border-gray-300"></div>5</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 flex items-center gap-3">
                        <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded uppercase tracking-wider">
                          Tipo: {q.type === 'paragraph' ? 'Texto Longo' : q.type === 'checkbox' ? 'Múltipla Escolha' : 'Escala Linear'}
                        </span>
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div> Obrigatória
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 flex justify-end gap-4 print:hidden">
                 <button className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Descartar Alterações</button>
                 <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors">Salvar Questionário</button>
              </div>
            </div>
          )}
`;

const insertPoint = '            </>\n          )}';
if (content.includes(insertPoint)) {
  content = content.replace(insertPoint, configTabContent + '\n' + insertPoint);
  fs.writeFileSync(file, content);
  console.log('Tab config added successfully');
} else {
  console.log('Could not find insert point');
}
