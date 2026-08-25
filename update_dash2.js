const fs = require('fs');
const file = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const newElements = `
              {/* Row 2: Satisfaction by Area & Executive Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:break-inside-avoid">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Níveis de Satisfação por Área (Média 1-5)</h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={satisfactionByArea} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                        <XAxis type="number" domain={[0, 5]} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis dataKey="area" type="category" tick={{fill: '#475569', fontSize: 13, fontWeight: 500}} axisLine={false} tickLine={false} width={110} />
                        <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                          {satisfactionByArea.map((entry, index) => (
                            <Cell key={\`cell-sat-\${index}\`} fill={entry.score >= 4.5 ? '#22c55e' : entry.score >= 4.0 ? '#3b82f6' : entry.score > 3.5 ? '#eab308' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm border border-blue-100 print:break-inside-avoid flex flex-col">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Sparkles className="text-blue-600" size={20} />
                    Resumo Executivo (IA)
                  </h3>
                  <div className="text-blue-900/90 leading-relaxed text-[15px] flex-1 space-y-4">
                    <p>
                      <strong>Pontos Fortes:</strong> O Encontro foi amplamente elogiado por seu <strong>profundo impacto espiritual</strong>, com destaque absoluto para o momento da Missão na sexta-feira e os louvores. A qualidade dos palestrantes e a relevância dos workshops superaram as expectativas.
                    </p>
                    <p>
                      <strong>Pontos Críticos:</strong> As áreas que exigem atenção prioritária são a <strong>Alimentação</strong> e o <strong>Credenciamento</strong>. Relatos frequentes apontam lentidão nas filas de check-in para grandes grupos e falta de opções (e pontos de distribuição) de almoço nos horários de pico.
                    </p>
                    <p>
                      <strong>Sugestões Principais:</strong> Os participantes desejam que o evento tenha a <strong>duração estendida para o domingo</strong> e sugerem um espaçamento maior entre os intervalos para dar tempo de realizar networking na Feira de Ministérios com calma.
                    </p>
                  </div>
                </div>
              </div>

              {/* Panorama de todas as respostas abertas */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:break-inside-avoid mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-800">Panorama Geral - Resumo das Respostas Escritas (IA)</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {openQuestionsData.map((q, i) => (
                    <div key={q.id} className="bg-slate-50 border border-slate-200 p-5 rounded-xl print:break-inside-avoid">
                      <div className="font-bold text-slate-500 mb-1 text-xs uppercase tracking-wider">Pergunta {i + 1}</div>
                      <h4 className="font-semibold text-slate-800 mb-3 text-sm leading-tight">{q.title}</h4>
                      <p className="text-sm text-slate-700 leading-relaxed italic border-l-2 border-blue-500 pl-3">
                        "{q.summary}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
`;

// Insert the code block right before the end of the overview tab `            </>\n          )}`
const insertPoint = '            </>\n          )}';
if (content.includes(insertPoint)) {
  content = content.replace(insertPoint, newElements + '\n' + insertPoint);
  fs.writeFileSync(file, content);
  console.log('Successfully added new elements');
} else {
  console.log('Could not find insert point');
}
