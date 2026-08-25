const fs = require('fs');

const dashFile = 'src/app/dashboard/page.tsx';
let dashContent = fs.readFileSync(dashFile, 'utf8');

const oldHeader = `<div className="p-6 border-b border-slate-800">
          <h1 className="font-bold text-xl flex items-center gap-2">
            <LayoutDashboard className="text-blue-400" />
            FE Surveys
          </h1>
        </div>`;

const newHeader = `<div className="p-6 border-b border-slate-800">
          <h1 className="font-bold text-xl flex items-center gap-3">
            <div className="bg-black p-1.5 rounded-xl"><img src="/logo.png" alt="Logo FE" className="w-6 h-6 object-contain" /></div>
            FE Pesquisas
          </h1>
        </div>`;

dashContent = dashContent.replace(
  /<div className="p-6 border-b border-slate-800">[\s\S]*?FE Surveys[\s\S]*?<\/div>/,
  newHeader
);

fs.writeFileSync(dashFile, dashContent);
console.log('Sidebar title updated');
