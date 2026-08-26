const fs = require('fs');
let c = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
c = c.replace(/await fetch\(\/api\/surveys\/, \{ method: 'DELETE' \}\);/, "await fetch(`/api/surveys/${id}`, { method: 'DELETE' });");
fs.writeFileSync('src/app/dashboard/page.tsx', c);
