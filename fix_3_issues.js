const fs = require('fs');

// --- 1. Fix src/app/dashboard/[slug]/page.tsx ---
let slugPage = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

// Move the Back button to the top
const backButtonRegex = /\s*{\/\* Back button \*\/}\s*<div className="p-4 border-t border-slate-800">[\s\S]*?<\/div>/;
const backButtonMatch = slugPage.match(backButtonRegex);

if (backButtonMatch) {
  // Remove it from the bottom
  slugPage = slugPage.replace(backButtonRegex, '');
  
  // Inject it under the title
  const titleRegex = /<h1 className="font-bold text-xl flex items-center gap-2">\s*<LayoutDashboard className="text-blue-400" \/>\s*\{eventTitle\}\s*<\/h1>\s*<\/div>/;
  const newHeader = `<h1 className="font-bold text-xl flex items-center gap-2">
              <LayoutDashboard className="text-blue-400" />
              {eventTitle}
            </h1>
          </div>
          
          <div className="px-4 pb-4 border-b border-slate-800">
            <Link href="/dashboard" className="flex justify-center items-center gap-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors py-2 px-4 rounded-xl font-bold shadow-sm text-sm">
              <ArrowLeft size={16} /> Voltar ao Início
            </Link>
          </div>`;
          
  slugPage = slugPage.replace(titleRegex, newHeader);
}

fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', slugPage);


// --- 2. Fix src/app/dashboard/page.tsx (3 dots z-index & stopPropagation) ---
let mainPage = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const dropdownRegex = /<div className="relative">\s*<button\s*onClick=\{\(\) => setOpenMenuId\(openMenuId === survey\.id \? null : survey\.id\)\}\s*className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"\s*>\s*<MoreVertical size=\{20\} \/>\s*<\/button>\s*\{openMenuId === survey\.id && \(\s*<div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">/m;

const newDropdown = `<div className="relative">
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenMenuId(openMenuId === survey.id ? null : survey.id); }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openMenuId === survey.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50">`;

mainPage = mainPage.replace(dropdownRegex, newDropdown);
fs.writeFileSync('src/app/dashboard/page.tsx', mainPage);


// --- 3. Fix client-side fetch caching in survey page ---
let surveyPage = fs.readFileSync('src/app/survey/[slug]/page.tsx', 'utf8');

surveyPage = surveyPage.replace(
  /fetch\(\`\/api\/surveys\/\$\{slug\}\`\)/,
  `fetch(\`/api/surveys/\${slug}\`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } })`
);

fs.writeFileSync('src/app/survey/[slug]/page.tsx', surveyPage);

console.log('Fixed final 3 issues');
