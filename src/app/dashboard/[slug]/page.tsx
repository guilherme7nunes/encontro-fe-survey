'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { surveyData } from '../../../data/questions';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { ArrowLeft, Users, Star, ArrowUpRight, Clock, MessageSquare, Menu, LayoutDashboard, CheckSquare, List, MessageCircleQuestion, Sparkles, Printer, FileDown, Settings, Edit, Trash2, Plus, GripVertical } from 'lucide-react';
import Link from 'next/link';

// Mock data removed




// Mock data: Questions Analysis (New Feature)

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
const PIE_COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

export default function DashboardPage() {
  const params = useParams();
  const slug = params?.slug || '';
  const eventTitle = slug.includes('curitiba') ? 'ERFE Curitiba' : slug.includes('lideranca') ? 'Liderança Jovem 26' : 'Encontro Nacional da FE 2026';
  
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
                              <Cell key={`cell-${index}`} fill={entry.color} />
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

  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'responses' | 'analysis' | 'config'>('overview');
  
  const [sectionsList, setSectionsList] = useState<any[]>([]);
  const [responsesData, setResponsesData] = useState<any[]>([]);
  const [surveyMeta, setSurveyMeta] = useState<any>({ title: 'Painel ENF 26' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/surveys/${slug}`).then(r => r.json()),
      fetch(`/api/surveys/${slug}/responses`).then(r => r.json())
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
    // Removed old fetch
  }, [slug]);

  const saveToDb = async (newSections) => {
    await fetch(`/api/surveys/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: newSections })
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [currentSectionId, setCurrentSectionId] = useState<number | null>(null);

  const handleSaveQuestion = () => {
    // Basic mock implementation for saving a question
    setIsModalOpen(false);
    
    // Create mock new question
    const newQuestion = {
      id: Date.now(),
      text: 'Nova pergunta adicionada...',
      type: 'paragraph',
    };

    setSectionsList(prev => {
      const newSections = prev.map(section => {
      if (section.id === currentSectionId) {
        // If editing existing
        if (currentQuestion) {
           return { ...section, questions: section.questions.map(q => q.id === currentQuestion.id ? { ...q, text: 'Pergunta editada...' } : q) };
        }
        // If adding new
        return { ...section, questions: [...section.questions, newQuestion] };
      }
      return section;
      });
      saveToDb(newSections);
      return newSections;
    });
  };

  const handleAddTopic = () => {
    const newSection = {
      id: Date.now(),
      title: 'Novo Tópico',
      description: 'Descrição do novo tópico',
      questions: []
    };
    const newSections = [...sectionsList, newSection];
    setSectionsList(newSections);
    saveToDb(newSections);
  };

  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  

  return (
    <div className="min-h-screen bg-gray-50 flex print:bg-white print:block" style={{WebkitPrintColorAdjust: "exact", printColorAdjust: "exact"}}>
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen print:hidden">
        <div className="p-6 border-b border-slate-800">
          <h1 className="font-bold text-xl flex items-center gap-2">
              <LayoutDashboard className="text-blue-400" />
              {eventTitle}
            </h1>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center justify-start gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <LayoutDashboard size={20} /> Visão Geral
          </button>
          
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center justify-start gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'analysis' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <MessageCircleQuestion size={20} /> Análise por Pergunta
          </button>

          <button 
            onClick={() => setActiveTab('actions')}
            className={`flex items-center justify-start gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'actions' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <CheckSquare size={20} /> Plano de Ação (Geral)
          </button>
          
          <button 
            onClick={() => setActiveTab('config')}
            className={`flex items-center justify-start gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'config' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Settings size={20} /> Configurar Pesquisa
          </button>
          
          <button 
            onClick={() => setActiveTab('responses')}
            className={`flex items-center justify-start gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${activeTab === 'responses' ? 'bg-blue-600/20 text-blue-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <List size={20} /> Respostas Brutas
          </button>
        </nav>
        
        {/* Back button */}
        <div className="p-4 border-t border-slate-800">
          <Link href="/dashboard" className="flex justify-center items-center gap-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors py-3 px-4 rounded-xl font-bold shadow-sm">
            <ArrowLeft size={18} /> Voltar ao Início
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-full overflow-visible print:overflow-visible print:block">
        <header className="bg-white p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center print:hidden">
          <div className="md:hidden flex items-center gap-4">
            <button className="text-gray-600"><Menu /></button>
            <h1 className="font-bold text-lg">{eventTitle}</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 hidden md:block">
            {activeTab === 'overview' && 'Visão Geral - Pesquisa de Satisfação'}
            {activeTab === 'analysis' && 'Análise de Perguntas Abertas'}
            {activeTab === 'actions' && 'Relatório: Sugestões Filtradas'}
            {activeTab === 'responses' && 'Todas as Respostas Brutas'}
            {activeTab === 'config' && 'Configuração do Questionário'}
          </h2>
          <div className="flex items-center gap-3">
             <span className="text-sm text-gray-500 font-medium hidden sm:inline">Última atualização: hoje, 09:37</span>
             <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2">
                <FileDown size={16} /> CSV
             </button>
             <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2">
                <Printer size={16} /> Gerar PDF
             </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 overflow-y-auto print:p-0 print:overflow-visible print:h-auto print:w-full">
          
          {/* Print only Header */}
          <div className="hidden print:block mb-8 border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">Relatório de Satisfação</h1>
            <h2 className="text-xl text-gray-600 mt-1">{eventTitle}</h2>
            <p className="text-sm text-gray-500 mt-2">Gerado em: {new Date().toLocaleDateString('pt-BR')} - Confidencial para Diretoria</p>
          </div>
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && renderDynamicOverview()}
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

              
              <div className="space-y-10">
                {sectionsList.map((section, sIndex) => (
                  <div key={section.id} className="relative">
                    {/* Topic Header */}
                    <div className="bg-slate-900 text-white p-5 rounded-2xl mb-4 flex justify-between items-center shadow-md">
                      <div>
                        <span className="text-blue-400 font-bold text-sm uppercase tracking-wider mb-1 block">Tópico {sIndex + 1}</span>
                        <h2 className="text-xl font-bold">{section.title}</h2>
                        {section.description && <p className="text-slate-400 text-sm mt-1">{section.description}</p>}
                      </div>
                      <div className="flex gap-2">
                        <button className="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 border border-slate-700">
                          <Edit size={16} /> Editar
                        </button>
                      </div>
                    </div>
                    
                    {/* Questions in this topic */}
                    <div className="space-y-4 pl-4 border-l-[3px] border-blue-100 ml-4 py-2">
                      {section.questions.map((q, index) => (
                        <div key={q.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex gap-4 group hover:border-blue-300 transition-all relative">
                          {/* Anchor line connecting to the main timeline */}
                          <div className="absolute top-1/2 -left-4 w-4 h-[2px] bg-blue-100"></div>
                          
                          <div className="pt-1 text-gray-300 cursor-grab hover:text-gray-500">
                            <GripVertical size={24} />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-800 text-lg">
                                <span className="text-blue-600 mr-2">{q.id}.</span> 
                                {q.text}
                              </h4>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setCurrentQuestion(q); setCurrentSectionId(section.id); setIsModalOpen(true); }} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
                                <button onClick={() => {}} className="p-2 text-gray-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                              </div>
                            </div>
                            
                            <div className="mt-3">
                              {q.type === 'paragraph' && (
                                <div className="w-full border-b border-gray-300 pb-2 text-gray-400 text-sm italic">Texto de resposta longa...</div>
                              )}
                              {q.type === 'checkbox' && q.options && (
                                <div className="flex flex-col gap-2">
                                  {q.options.map(opt => (
                                    <div key={opt} className="flex items-center gap-2 text-gray-600 font-medium">
                                      <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
                                      {opt}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {q.type === 'radio' && q.options && (
                                <div className="flex flex-col gap-2">
                                  {q.options.map(opt => (
                                    <div key={opt} className="flex items-center gap-2 text-gray-600 font-medium">
                                      <div className="w-4 h-4 border border-gray-300 rounded-full"></div>
                                      {opt}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {q.type === 'linear' && (
                                <div className="flex items-center gap-8 text-gray-600 text-sm font-medium">
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
                                Tipo: {q.type === 'paragraph' ? 'Texto Longo' : q.type === 'checkbox' ? 'Múltipla Escolha' : q.type === 'radio' ? 'Escolha Única' : 'Escala Linear'}
                              </span>
                              {q.condition && (
                                <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 shadow-sm border border-purple-200">
                                  ⚡ Pula para o Tópico {q.condition.targetSectionId} (Se '{q.condition.valueToSkip}')
                                </span>
                              )}
                              <span className="text-xs font-bold text-gray-400 flex items-center gap-1 ml-auto">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div> Obrigatória
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Add question to topic button */}
                      <button onClick={() => { setCurrentQuestion(null); setCurrentSectionId(section.id); setIsModalOpen(true); }} className="w-full border-2 border-dashed border-gray-200 hover:border-blue-400 text-gray-400 hover:text-blue-600 font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 bg-gray-50/50 hover:bg-blue-50/50">
                        <Plus size={18} /> Adicionar pergunta a este tópico
                      </button>
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

          {/* TAB: ANALYSIS BY QUESTION */}
          {activeTab === 'analysis' && (() => {
            const textQuestions = sectionsList.flatMap(s => s.questions.filter(q => q.type === 'textarea'));
            if (textQuestions.length === 0) {
              return <div className="bg-white p-8 rounded-2xl border text-center text-gray-500">Nenhuma pergunta aberta configurada nesta pesquisa.</div>;
            }
            const activeId = selectedQuestionId || textQuestions[0]?.id;
            const activeQ = textQuestions.find(q => q.id === activeId);
            const answers = responsesData.filter(r => r.answers && r.answers[activeId]).map(r => ({ id: r.id.substring(0, 8), text: r.answers[activeId] }));

            return (
              <div className="flex flex-col gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:break-inside-avoid print:mb-8">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Selecione uma pergunta aberta para analisar:</label>
                  <select 
                    className="w-full border border-gray-300 rounded-xl p-4 text-gray-800 font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 outline-none"
                    value={activeId || ''}
                    onChange={(e) => setSelectedQuestionId(e.target.value)}
                  >
                    {textQuestions.map(q => (
                      <option key={q.id} value={q.id}>{q.text}</option>
                    ))}
                  </select>
                </div>
                {activeQ && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-2">
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-800">Respostas Individuais</h3>
                      <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                        {answers.length} respostas abertas lidas
                      </span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {answers.length === 0 ? (
                        <div className="p-6 text-gray-500 text-center">Nenhuma resposta recebida para esta pergunta ainda.</div>
                      ) : (
                        answers.map((answer, index) => (
                          <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-1 rounded">ID: #{answer.id}</span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">"{answer.text}"</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
          {activeTab === 'actions' && (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <Sparkles size={48} className="text-blue-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Plano de Ação Inteligente em Breve</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Assim que recebermos um volume suficiente de respostas reais, nossa Inteligência Artificial irá analisar os dados e gerar um plano de ação focado automaticamente.
              </p>
            </div>
          )}
          {activeTab === 'responses' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider w-24">ID</th>
                      <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider w-40">Data</th>
                      <th className="py-4 px-6 text-sm font-bold text-gray-600 uppercase tracking-wider">Conteúdo da Resposta (JSON)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {responsesData.length === 0 ? (
                      <tr><td colSpan={3} className="py-8 text-center text-gray-500">Nenhuma resposta registrada.</td></tr>
                    ) : (
                      responsesData.map((res) => (
                        <tr key={res.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6 text-sm font-medium text-gray-500">#{res.id.substring(0, 8)}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">{new Date(res.date).toLocaleString('pt-BR')}</td>
                          <td className="py-4 px-6 text-sm text-gray-600">
                            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto max-w-lg">
                              {JSON.stringify(res.answers, null, 2)}
                            </pre>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-800">{currentQuestion ? 'Editar Pergunta' : 'Criar Nova Pergunta'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-5">
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Título da Pergunta</label>
                 <textarea 
                    className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900 font-medium" 
                    rows={3}
                    defaultValue={currentQuestion ? currentQuestion.text : ''} 
                    placeholder="Ex: Como você avalia a limpeza dos banheiros?"
                 />
              </div>
              
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Resposta</label>
                 <select 
                   className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 font-medium"
                   defaultValue={currentQuestion ? currentQuestion.type : 'paragraph'}
                 >
                   <option value="paragraph">Texto Longo (Parágrafo)</option>
                   <option value="checkbox">Múltipla Escolha (Várias opções)</option>
                   <option value="radio">Escolha Única (Apenas uma opção)</option>
                   <option value="linear">Escala Linear (1 a 5 estrelas)</option>
                 </select>
              </div>

              {(currentQuestion?.type === 'checkbox' || currentQuestion?.type === 'radio') && (
                <div className="pt-2 border-t border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-2">Opções de Resposta</label>
                  <div className="space-y-2">
                    {currentQuestion.options?.map((opt, i) => (
                      <div key={i} className="flex gap-2">
                        <input type="text" defaultValue={opt} className="flex-1 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 font-medium" />
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                      </div>
                    ))}
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2">
                      <Plus size={14} /> Adicionar Opção
                    </button>
                  </div>
                </div>
              )}
              
              {currentQuestion?.type === 'radio' && (
                <div className="pt-4 border-t border-gray-100">
                  <label className="block text-sm font-bold text-gray-700 mb-2 text-purple-700">⚡ Lógica Condicional (Salto)</label>
                  <p className="text-xs text-gray-500 mb-3">Defina se uma resposta específica deve fazer o usuário pular o restante deste tópico e ir para o próximo.</p>
                  <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl border border-purple-100">
                    <span className="text-sm font-bold text-gray-700">Se a resposta for:</span>
                    <select className="border border-gray-300 rounded-lg p-2 text-sm text-gray-900 bg-white min-w-[150px]">
                       <option value="">Nenhuma (Não pular)</option>
                       {currentQuestion.options?.map((opt, i) => (
                         <option key={i} value={opt} selected={currentQuestion.condition?.valueToSkip === opt}>{opt}</option>
                       ))}
                    </select>
                    <span className="text-sm font-bold text-gray-700">➔ Pular para próximo tópico</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="obrigatoria" defaultChecked className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <label htmlFor="obrigatoria" className="text-sm font-medium text-gray-700">Tornar esta pergunta obrigatória</label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
               <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-200 rounded-xl transition-colors">Cancelar</button>
               <button onClick={handleSaveQuestion} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors">Salvar Pergunta</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
