const fs = require('fs');
const file = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add satisfaction by area mock data
const newMockData = `
const satisfactionByArea = [
  { area: 'Organização', score: 4.8 },
  { area: 'Credenciamento', score: 3.5 },
  { area: 'Workshops', score: 4.6 },
  { area: 'Feira', score: 4.2 },
  { area: 'Missão', score: 4.9 },
  { area: 'Alimentação', score: 3.2 },
  { area: 'Infraestrutura', score: 4.5 }
];
`;

content = content.replace('// Mock data: Questions Analysis (New Feature)', newMockData + '\n// Mock data: Questions Analysis (New Feature)');

// The user wants a summary of written answers in the empty space below charts, and satisfaction by area.
// Let's create a new row with:
// 1. Satisfaction by Area Chart
// 2. Executive Summary Text Block

const newRow = `
              {/* Row 2: Satisfaction by Area & Executive Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 print:break-inside-avoid">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Níveis de Satisfação por Área (Média 1-5)</h3>
                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={satisfactionByArea} margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                        <XAxis type="number" domain={[0, 5]} tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis dataKey="area" type="category" tick={{fill: '#475569', fontSize: 13, fontWeight: 500}} axisLine={false} tickLine={false} width={100} />
                        <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={24}>
                          {satisfactionByArea.map((entry, index) => (
                            <Cell key={\`cell-\${index}\`} fill={entry.score > 4 ? '#22c55e' : entry.score > 3.5 ? '#eab308' : '#ef4444'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-sm border border-blue-100 print:break-inside-avoid flex flex-col">
                  <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                    <Sparkles className="text-blue-600" size={20} />
                    Resumo Executivo (IA) - Respostas Escritas
                  </h3>
                  <div className="text-blue-900/80 leading-relaxed text-sm flex-1 space-y-3">
                    <p>
                      <strong>Pontos Fortes:</strong> O Encontro foi amplamente elogiado por seu <strong>profundo impacto espiritual</strong>, com destaque absoluto para o momento da Missão na sexta-feira e os louvores. A qualidade dos palestrantes e a relevância dos workshops também superaram as expectativas.
                    </p>
                    <p>
                      <strong>Pontos Críticos:</strong> As áreas que exigem atenção prioritária são a <strong>Alimentação</strong> e o <strong>Credenciamento</strong>. Relatos frequentes apontam lentidão nas filas de check-in para grandes grupos e falta de opções (e pontos de distribuição) de almoço nos horários de pico no sábado.
                    </p>
                    <p>
                      <strong>Sugestões Principais:</strong> Os participantes desejam que o evento tenha a <strong>duração estendida para o domingo</strong> e sugerem um espaçamento maior entre os intervalos para networking na Feira de Ministérios.
                    </p>
                  </div>
                </div>
              </div>
`;

// Insert the newRow right after the first charts row
// Search for `{/* IA Highlights - Full Summary */}` and place it before it.
const insertTarget = '{/* IA Highlights - Full Summary */}';
if (content.includes(insertTarget)) {
  content = content.replace(insertTarget, newRow + '\\n              ' + insertTarget);
} else {
  // Fallback if not found
  console.log("Could not find IA Highlights - Full Summary");
}

fs.writeFileSync(file, content);
console.log('Done');
