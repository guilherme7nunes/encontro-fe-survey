const fs = require('fs');
let content = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

// The broken quote was in the string 'Pular para'
content = content.replace(/z" Pular para/g, 'Pular para');
// Let's just remove any standalone double quotes inside span tags
content = content.replace(/<span[^>]*>[^<]*"[^<]*<\/span>/g, match => match.replace(/"/g, ''));

fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', content);
