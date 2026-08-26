const fs = require('fs');

const routeFiles = [
  'src/app/api/surveys/route.ts',
  'src/app/api/surveys/[slug]/route.ts',
  'src/app/api/surveys/[slug]/responses/route.ts'
];

for (const file of routeFiles) {
  let content = fs.readFileSync(file, 'utf8');
  content = `export const dynamic = 'force-dynamic';\n` + content;
  fs.writeFileSync(file, content);
}

// Fix next.config.ts
const nextConfigPath = 'next.config.ts';
let nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
nextConfigContent = nextConfigContent.replace('output: "standalone",', '// output: "standalone",');
fs.writeFileSync(nextConfigPath, nextConfigContent);

// Fix package.json build script
const pkgPath = 'package.json';
let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts.build = "next build";
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log('Fixed everything properly.');
