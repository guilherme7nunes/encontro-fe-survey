const fs = require('fs');

const routeFiles = [
  'src/app/api/surveys/route.ts',
  'src/app/api/surveys/[slug]/route.ts',
  'src/app/api/surveys/[slug]/responses/route.ts'
];

for (const file of routeFiles) {
  let content = fs.readFileSync(file, 'utf8');
  // Remove existing force-dynamic line if it's messed up
  content = content.replace("export const dynamic = 'force-dynamic';\n", "");
  content = content.replace("export const dynamic = 'force-dynamic';", "");
  
  // Format nicely
  content = `export const dynamic = 'force-dynamic';\n` + content;
  fs.writeFileSync(file, content);
}

// Fix next.config.ts
const nextConfigPath = 'next.config.ts';
let nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
nextConfigContent = nextConfigContent.replace('output: "standalone",', '// output: "standalone",');
fs.writeFileSync(nextConfigPath, nextConfigContent);

console.log('Fixed files');
