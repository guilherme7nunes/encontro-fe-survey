const fs = require('fs');

// --- 1. Update Layout for Redirect ---
const layoutFile = 'src/app/dashboard/layout.tsx';
let layoutContent = fs.readFileSync(layoutFile, 'utf8');

if (!layoutContent.includes('useRouter')) {
  layoutContent = layoutContent.replace(
    "import { useState, useEffect } from 'react';",
    "import { useState, useEffect } from 'react';\nimport { useRouter, usePathname } from 'next/navigation';"
  );
  layoutContent = layoutContent.replace(
    "const [isMounted, setIsMounted] = useState(false);",
    "const [isMounted, setIsMounted] = useState(false);\n  const router = useRouter();\n  const pathname = usePathname();"
  );
  layoutContent = layoutContent.replace(
    "setIsAuthenticated(true);\n    } else {",
    "setIsAuthenticated(true);\n      if (pathname !== '/dashboard') router.push('/dashboard');\n    } else {"
  );
  fs.writeFileSync(layoutFile, layoutContent);
}

// --- 2. Update Specific Dashboard for Back Button ---
const slugFile = 'src/app/dashboard/[slug]/page.tsx';
let slugContent = fs.readFileSync(slugFile, 'utf8');

// Ensure ArrowLeft is imported
if (!slugContent.includes('ArrowLeft')) {
  slugContent = slugContent.replace(
    "import { Users, Star",
    "import { ArrowLeft, Users, Star"
  );
}

// Inject Back Button at the end of the sidebar
const backBtnUI = `
          {/* Back button */}
          <div className="mt-auto pt-8 mb-4">
            <Link href="/dashboard" className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors py-3 px-4 hover:bg-slate-800 rounded-xl font-medium border border-transparent hover:border-slate-700">
              <ArrowLeft size={20} /> Voltar ao Início
            </Link>
          </div>
        </div>

        {/* Main Content */}
`;

slugContent = slugContent.replace(
  '        </div>\n\n        {/* Main Content */}',
  backBtnUI
);

fs.writeFileSync(slugFile, slugContent);
console.log('Navigation features added');
