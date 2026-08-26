const fs = require('fs');

// --- 1. Fix paragraph bug in Analysis Tab ---
let slugPage = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');
slugPage = slugPage.replace(
  /q\.type === 'textarea'/g,
  "q.type === 'paragraph'"
);
fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', slugPage);

// --- 2. Fix handleCreateNew in dashboard ---
let mainPage = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');
const createNewRegex = /const handleCreateNew = async \(\) => \{[\s\S]*?body: JSON\.stringify\(\{ id: slug, title: name, status: 'Rascunho' \}\)\s*\}\);/m;

const fixedCreateNew = `const handleCreateNew = async () => {
    const name = window.prompt('Qual o nome do novo evento/pesquisa?');
    if (name) {
      const slug = name.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/[^a-z0-9]+/g, '');
      
      const res = await fetch('/api/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: slug, title: name, status: 'Rascunho' })
      });
      
      if (res.ok) {
        window.location.href = '/dashboard/' + slug;
      } else {
        alert('Erro ao criar pesquisa. Tente um nome diferente.');
      }
`;

mainPage = mainPage.replace(createNewRegex, fixedCreateNew);
fs.writeFileSync('src/app/dashboard/page.tsx', mainPage);

console.log('Fixed paragraph bug and createNew bug');
