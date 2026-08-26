'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Plus, Copy, BarChart2, MoreVertical, Search, Settings, Users } from 'lucide-react';

// Mock list of surveys
const initialSurveys = [
  { id: 'encontronacionaldafe2026', title: 'Encontro Nacional da FE 2026', responses: 524, status: 'Ativa', date: '25 Ago 2026' },
  { id: 'erfecuritiba', title: 'ERFE Curitiba (Encontro Regional)', responses: 120, status: 'Encerrada', date: '10 Jul 2026' },
  { id: 'liderancajovem26', title: 'Seminário de Liderança Jovem', responses: 0, status: 'Rascunho', date: '01 Set 2026' }
];

export default function MasterDashboard() {
  const [surveys, setSurveys] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/surveys')
      .then(res => res.json())
      .then(data => {
        setSurveys(data);
        setIsLoading(false);
      });
  }, []);

  const handleCreateNew = async () => {
    const name = window.prompt('Qual o nome do novo evento/pesquisa?');
    if (name) {
      const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '');
      
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
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta pesquisa?')) {
      await fetch(`/api/surveys/${id}`, { method: 'DELETE' });
      setSurveys(surveys.filter(s => s.id !== id));
      setOpenMenuId(null);
    }
  };

  const handleToggleStatus = async (survey: any) => {
    const newStatus = survey.status === 'Ativa' ? 'Pausada' : 'Ativa';
    // Call API
    await fetch(`/api/surveys/${survey.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    setSurveys(surveys.map(s => s.id === survey.id ? { ...s, status: newStatus } : s));
    setOpenMenuId(null);
  };

  const handleDuplicate = (survey: typeof initialSurveys[0]) => {
    const newSurvey = {
      ...survey,
      id: survey.id + '-copia',
      title: survey.title + ' (Cópia)',
      responses: 0,
      status: 'Rascunho' as const,
      date: new Date().toLocaleDateString('pt-BR')
    };
    setSurveys([newSurvey, ...surveys]);
    alert('Pesquisa duplicada com sucesso!');
  };

  const filteredSurveys = surveys.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen">
        <div className="p-6 border-b border-slate-800">
          <h1 className="font-bold text-xl flex items-center gap-3">
            <div className="bg-black p-1.5 rounded-xl"><img src="/logo.png" alt="Logo FE" className="w-6 h-6 object-contain" /></div>
            FE Pesquisas
          </h1>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 bg-blue-600/20 text-blue-400 px-4 py-3 rounded-lg font-medium">
            <LayoutDashboard size={20} /> Minhas Pesquisas
          </Link>
          <Link href="#" className="flex items-center gap-3 text-slate-400 hover:text-white hover:bg-slate-800 px-4 py-3 rounded-lg font-medium transition-colors">
            <Settings size={20} /> Configurações
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 sm:p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pesquisas de Satisfação</h1>
            <p className="text-gray-500 mt-1">Gerencie, crie ou duplique questionários para seus eventos.</p>
          </div>
          <button 
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus size={20} /> Nova Pesquisa
          </button>
        </header>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar pesquisa pelo nome..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Survey List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredSurveys.map(survey => (
            <div key={survey.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-blue-200 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-gray-800">{survey.title}</h2>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    survey.status === 'Ativa' ? 'bg-green-100 text-green-700' :
                    survey.status === 'Encerrada' ? 'bg-gray-100 text-gray-600' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {survey.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 flex items-center gap-4">
                  <span>Criada em: {survey.date}</span>
                  <span className="flex items-center gap-1 text-gray-600"><Users size={14}/> {survey.responses} respostas</span>
                  <Link href={`/survey/${survey.id}`} className="text-blue-600 hover:underline">Link público</Link>
                </div>
              </div>
              
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => handleDuplicate(survey)}
                  className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent"
                  title="Duplicar Pesquisa"
                >
                  <Copy size={20} />
                </button>
                <Link 
                  href={`/dashboard/${survey.id}`}
                  className="flex-1 sm:flex-none bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 px-4 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <BarChart2 size={18} /> Ver Dashboard
                </Link>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreVertical size={20} />
                </button>
              </div>
            </div>
          ))}
          {filteredSurveys.length === 0 && (
             <div className="text-center p-12 bg-white rounded-2xl border border-gray-100 text-gray-500">
                Nenhuma pesquisa encontrada.
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

