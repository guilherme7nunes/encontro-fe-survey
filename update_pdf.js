const fs = require('fs');
const file = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add break-inside-avoid to KPI cards
content = content.replace(/<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2">/g, 
'<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-2 print:break-inside-avoid">');

// 2. Add break-inside-avoid to Chart cards
content = content.replace(/<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">/g, 
'<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:break-inside-avoid print:mb-8">');

// 3. To add the comprehensive summaries to the overview tab, we will replace the old "IA Highlights" section with a complete loop of openQuestionsData summaries.
// First, find the IA Highlights section.
const iaHighlightsStart = content.indexOf('{/* IA Highlights */}');
if (iaHighlightsStart !== -1) {
  const endOfOverview = content.indexOf('</>', iaHighlightsStart);
  
  const newSummariesBlock = `
              {/* IA Highlights - Full Summary */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:break-inside-avoid mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Panorama Geral - Resumo das Respostas Escritas (IA)</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {openQuestionsData.map((q, i) => (
                    <div key={q.id} className="bg-blue-50 border border-blue-100 p-5 rounded-xl print:break-inside-avoid">
                      <div className="font-bold text-blue-900 mb-2 text-sm">Pergunta {i + 1}</div>
                      <h4 className="font-semibold text-blue-800 mb-2 text-sm leading-tight">{q.title}</h4>
                      <p className="text-sm text-blue-900/80 leading-relaxed italic">
                        "{q.summary}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            `;
            
  content = content.substring(0, iaHighlightsStart) + newSummariesBlock + '\n            ' + content.substring(endOfOverview);
}

// Ensure html/body allow printing backgrounds
content = content.replace(/<div className="min-h-screen bg-gray-50 flex print:bg-white print:block">/g, '<div className="min-h-screen bg-gray-50 flex print:bg-white print:block" style={{WebkitPrintColorAdjust: "exact", printColorAdjust: "exact"}}>');

fs.writeFileSync(file, content);
console.log('PDF layout and summaries updated');
