const fs = require('fs');

// --- 1. Fix src/app/dashboard/[slug]/page.tsx (Sidebar Title) ---
let slugPage = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');
slugPage = slugPage.replace(
  /<h1 className="font-bold text-xl flex items-center gap-2">\s*<LayoutDashboard className="text-blue-400" \/>\s*Painel ENF 26\s*<\/h1>/,
  `<h1 className="font-bold text-xl flex items-center gap-2">
              <LayoutDashboard className="text-blue-400" />
              {eventTitle}
            </h1>`
);
fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', slugPage);


// --- 2. Fix src/app/dashboard/page.tsx (3 Dots Menu) ---
let mainPage = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const oldMoreRegex = /<button className="p-2 text-gray-400 hover:text-gray-600">\s*<MoreVertical size={20} \/>\s*<\/button>/m;

const newDropdown = `<div className="relative">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === survey.id ? null : survey.id)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openMenuId === survey.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                      <button onClick={() => handleToggleStatus(survey)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        {survey.status === 'Ativa' ? 'Pausar Recebimento' : 'Ativar Recebimento'}
                      </button>
                      <button onClick={() => handleDelete(survey.id)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        Excluir Pesquisa
                      </button>
                    </div>
                  )}
                </div>`;

mainPage = mainPage.replace(oldMoreRegex, newDropdown);
fs.writeFileSync('src/app/dashboard/page.tsx', mainPage);

console.log('Fixed sidebar title and 3 dots');
