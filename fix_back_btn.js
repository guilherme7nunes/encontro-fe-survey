const fs = require('fs');

const slugFile = 'src/app/dashboard/[slug]/page.tsx';
let slugContent = fs.readFileSync(slugFile, 'utf8');

const backBtnUI = `        </nav>
        
        {/* Back button */}
        <div className="p-4 border-t border-slate-800">
          <Link href="/dashboard" className="flex justify-center items-center gap-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors py-3 px-4 rounded-xl font-bold shadow-sm">
            <ArrowLeft size={18} /> Voltar ao Início
          </Link>
        </div>
      </aside>`;

if (!slugContent.includes('Voltar ao Início')) {
  slugContent = slugContent.replace('        </nav>\n      </aside>', backBtnUI);
  fs.writeFileSync(slugFile, slugContent);
  console.log('Back button injected');
} else {
  console.log('Back button already exists');
}
