'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    if (localStorage.getItem('fe_auth') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'fe1234') {
      localStorage.setItem('fe_auth', 'true');
      setIsAuthenticated(true);
      if (pathname !== '/dashboard') router.push('/dashboard');
    } else {
      setError('Senha incorreta.');
    }
  };

  if (!isMounted) return null; // prevent hydration mismatch

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-[2rem] shadow-2xl w-full max-w-md flex flex-col items-center">
          <div className="bg-black p-4 rounded-3xl mb-6 shadow-lg">
            <img src="/logo.png" alt="Logo FE" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Painel ADM Pesquisas de Satisfação</h1>
          <p className="text-gray-500 mb-8 text-center text-sm">Área restrita. Digite a senha administrativa para acessar a plataforma de pesquisas da FE.</p>
          
          <form onSubmit={handleLogin} className="w-full">
            <input 
              type="password" 
              placeholder="••••••" 
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full border-2 border-gray-200 rounded-xl p-4 mb-4 focus:border-blue-600 outline-none text-center text-2xl tracking-[0.5em] font-bold text-gray-700 bg-gray-50 focus:bg-white transition-colors"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm mb-4 text-center font-bold bg-red-50 p-2 rounded-lg">{error}</p>}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-transform active:scale-95 shadow-md">
              Acessar Painel Seguro
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
