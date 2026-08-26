const fs = require('fs');

// --- 1. Fix src/app/dashboard/[slug]/page.tsx (JSX Fragment) ---
let slugPage = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');
slugPage = slugPage.replace(
  /\{activeTab === 'responses' && \(\s*<div className="flex justify-end mb-4">/m,
  `{activeTab === 'responses' && (<>\n            <div className="flex justify-end mb-4">`
);
slugPage = slugPage.replace(
  /\{\/\* Modal de Edi..o \*\/\}/m,
  `</>\n          )}\n\n          {/* Modal de Edição */}`
);
// Wait, I just need to close the fragment at the end of activeTab === 'responses'.
// In fix_features.js I replaced `{activeTab === 'responses' && (` with `{activeTab === 'responses' && (<div...><button...</div>`
slugPage = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');
slugPage = slugPage.replace(
  /\{activeTab === 'responses' && \(\s*<div className="flex justify-end mb-4">/,
  `{activeTab === 'responses' && (<>\n            <div className="flex justify-end mb-4">`
);
slugPage = slugPage.replace(
  /<\/tbody>\s*<\/table>\s*<\/div>\s*<\/div>\s*\)\}/m,
  `</tbody>\n                </table>\n              </div>\n            </div>\n          </>)}`
);
fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', slugPage);

// --- 2. Fix src/app/dashboard/page.tsx (Mismatched Button tag) ---
let mainPage = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
mainPage = mainPage.replace(
  /<Link href="\/dashboard" className="flex items-center gap-3 bg-blue-600\/20 text-blue-400 px-4 py-3 rounded-lg font-medium">/,
  `<button onClick={() => setActiveTab('surveys')} className={\`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors \${activeTab === 'surveys' ? 'bg-blue-600/20 text-blue-400 font-bold' : 'text-slate-400 hover:text-white hover:bg-slate-800 font-medium'}\`}>`
);
fs.writeFileSync('src/app/dashboard/page.tsx', mainPage);

// --- 3. Fix src/app/survey/[slug]/page.tsx (Escaped backticks) ---
let surveyPage = fs.readFileSync('src/app/survey/[slug]/page.tsx', 'utf8');
surveyPage = surveyPage.replace(/fetch\(\\\`/g, "fetch(`");
surveyPage = surveyPage.replace(/\\\$\{slug\}\\\`/g, "${slug}`");
surveyPage = surveyPage.replace(/name=\{\\\`q-\\\$\{question\.id\}\\\`\}/g, "name={`q-${question.id}`}");
surveyPage = surveyPage.replace(/animate=\{\{ width: \\\`\\\$\{progressPercentage\}%\\\` \}\}/g, "animate={{ width: `${progressPercentage}%` }}");
fs.writeFileSync('src/app/survey/[slug]/page.tsx', surveyPage);

console.log('Fixed build errors');
