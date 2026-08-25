const fs = require('fs');
const file = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add icons
content = content.replace('MessageCircleQuestion, Sparkles } from', 'MessageCircleQuestion, Sparkles, Printer, FileDown } from');

// Hide sidebar in print
content = content.replace('<aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen">', '<aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white min-h-screen print:hidden">');

// Update header for print
content = content.replace('<header className="bg-white p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center">', '<header className="bg-white p-4 sm:p-6 border-b border-gray-200 flex justify-between items-center print:hidden">');

// Add PDF button
content = content.replace(
`<button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                Exportar CSV
             </button>`,
`<button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2">
                <FileDown size={16} /> CSV
             </button>
             <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm flex items-center gap-2">
                <Printer size={16} /> Gerar PDF
             </button>`
);

// Add print-only header
content = content.replace('<div className="p-4 sm:p-6 lg:p-8 overflow-y-auto">', 
`<div className="p-4 sm:p-6 lg:p-8 overflow-y-auto print:p-0 print:overflow-visible print:h-auto print:w-full">
          
          {/* Print only Header */}
          <div className="hidden print:block mb-8 border-b border-gray-200 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">Relatório de Satisfação</h1>
            <h2 className="text-xl text-gray-600 mt-1">Encontro Nacional da FE 2026</h2>
            <p className="text-sm text-gray-500 mt-2">Gerado em: {new Date().toLocaleDateString('pt-BR')} - Confidencial para Diretoria</p>
          </div>`);

// Make background white in print and ensure everything prints
content = content.replace('<div className="min-h-screen bg-gray-50 flex">', '<div className="min-h-screen bg-gray-50 flex print:bg-white print:block">');
content = content.replace('<main className="flex-1 flex flex-col max-w-full overflow-hidden">', '<main className="flex-1 flex flex-col max-w-full overflow-visible print:overflow-visible print:block">');

fs.writeFileSync(file, content);
console.log('PDF feature added');
