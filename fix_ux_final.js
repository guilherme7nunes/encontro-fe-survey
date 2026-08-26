const fs = require('fs');

// --- 1. Fix src/app/survey/[slug]/page.tsx (Hide skipped questions) ---
let surveyPage = fs.readFileSync('src/app/survey/[slug]/page.tsx', 'utf8');

const renderQuestionsRegex = /\{currentSection\.questions\.map\(\(question\) => \([\s\S]*?\}\)\}/m;

const newRenderQuestions = `
          {(() => {
            let skipIndex = -1;
            for (let i = 0; i < currentSection.questions.length; i++) {
              const q = currentSection.questions[i];
              if (q.condition && answers[q.id] === q.condition.valueToSkip) {
                skipIndex = i;
                break;
              }
            }
            const visibleQuestions = skipIndex !== -1 
              ? currentSection.questions.slice(0, skipIndex + 1) 
              : currentSection.questions;
              
            return visibleQuestions.map((question) => (
              <div key={question.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="flex gap-4 mb-4">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                    {question.id}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{question.text}</h3>
                    {question.type === 'checkbox' && (
                      <span className="text-sm font-semibold text-blue-500 bg-blue-50 px-2 py-1 rounded mt-2 inline-block">Múltipla escolha</span>
                    )}
                  </div>
                </div>
                {renderQuestion(question)}
              </div>
            ));
          })()}
`;

surveyPage = surveyPage.replace(renderQuestionsRegex, newRenderQuestions.trim());
fs.writeFileSync('src/app/survey/[slug]/page.tsx', surveyPage);


// --- 2. Fix src/app/dashboard/page.tsx (Replace 3 dots with direct buttons) ---
let mainPage = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

// We need to import Trash2 and Power
if (!mainPage.includes('Trash2')) {
  mainPage = mainPage.replace(/MoreVertical, Search, Settings, Users/g, 'Search, Settings, Users, Trash2, Power');
}

const dropdownRegex = /<div className="relative">[\s\S]*?<\/div>\s*<\/div>\s*\)\}\s*<\/div>/m;

const directButtons = `
                  <button 
                    onClick={() => handleToggleStatus(survey)}
                    className={\`p-2.5 rounded-lg transition-colors border border-transparent \${survey.status === 'Ativa' ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'}\`}
                    title={survey.status === 'Ativa' ? 'Pausar Recebimento' : 'Ativar Recebimento'}
                  >
                    <Power size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(survey.id)}
                    className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent"
                    title="Excluir Pesquisa"
                  >
                    <Trash2 size={20} />
                  </button>
`;

mainPage = mainPage.replace(/<div className="relative">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, directButtons + '\n                </div>\n              </div>');

fs.writeFileSync('src/app/dashboard/page.tsx', mainPage);

console.log('Fixed skip logic and replaced 3 dots');
