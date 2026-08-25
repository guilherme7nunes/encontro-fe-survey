const fs = require('fs');
const file = 'src/app/dashboard/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Update state variables to hold sections instead of flat questions
content = content.replace(
  "const allQuestions = surveyData.flatMap(section => section.questions);\n  const [questionsList, setQuestionsList] = useState(allQuestions);",
  "const [sectionsList, setSectionsList] = useState(surveyData);"
);

// 2. We need to replace the entire rendering of the questions list.
// The list starts with:
// <div className="space-y-4">
//   {questionsList.map((q, index) => (

// And ends before:
// <div className="mt-8 flex justify-end gap-4 print:hidden">

const oldListRegex = /<div className="space-y-4">\s*\{questionsList\.map\(\(q, index\) => \([\s\S]*?(?=\s*<div className="mt-8 flex justify-end gap-4 print:hidden">)/;

const newSectionsCode = `
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
                                <button onClick={() => { setCurrentQuestion(q); setIsModalOpen(true); }} className="p-2 text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={16} /></button>
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
                      <button className="w-full border-2 border-dashed border-gray-200 hover:border-blue-400 text-gray-400 hover:text-blue-600 font-bold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 bg-gray-50/50 hover:bg-blue-50/50">
                        <Plus size={18} /> Adicionar pergunta a este tópico
                      </button>
                    </div>
                  </div>
                ))}
              </div>
`;

content = content.replace(oldListRegex, newSectionsCode);

fs.writeFileSync(file, content);
console.log('Sections added successfully');
