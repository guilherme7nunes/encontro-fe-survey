const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

// replace the lucide-react import to include Power
content = content.replace(
    /import \{([^}]+)\} from 'lucide-react';/,
    (match, imports) => {
        if (!imports.includes('Power')) {
            return `import { ${imports.trim()}, Power } from 'lucide-react';`;
        }
        return match;
    }
);

fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', content);
