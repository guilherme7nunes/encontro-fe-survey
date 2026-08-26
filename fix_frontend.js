const fs = require('fs');

function fixPage(file) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (content.includes('if (isLoading)')) {
    return;
  }

  const searchStr = '  const currentSection = surveyData[currentSectionIndex];';
  const replaceStr = `
  if (isLoading) {
    return <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p>Carregando...</p>
    </div>;
  }

  if (!surveyData || surveyData.length === 0) {
    return <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
      <p className="text-xl font-bold">Pesquisa no encontrada ou vazia.</p>
    </div>;
  }

  const currentSection = surveyData[currentSectionIndex];`;

  content = content.replace(searchStr, replaceStr);
  fs.writeFileSync(file, content);
}

fixPage('src/app/survey/[slug]/page.tsx');
fixPage('src/app/dashboard/[slug]/page.tsx');
console.log('Fixed pages');
