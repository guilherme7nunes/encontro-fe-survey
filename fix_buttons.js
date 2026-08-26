const fs = require('fs');

let mainPage = fs.readFileSync('src/app/dashboard/page.tsx', 'utf8');

const startIdx = mainPage.indexOf('<div className="relative">');

if (startIdx !== -1) {
    // Find the end of the relative div block
    const targetEnd = mainPage.indexOf(')}', startIdx);
    const divEnd = mainPage.indexOf('</div>', targetEnd);
    
    const stringToReplace = mainPage.substring(startIdx, divEnd + 6);
    console.log("Replacing: ", stringToReplace.substring(0, 50) + "...");

    const directButtons = `
                  <button 
                    onClick={() => handleToggleStatus(survey)}
                    className={\`p-2.5 rounded-lg transition-colors border border-transparent \${survey.status === 'Ativa' ? 'text-yellow-600 hover:bg-yellow-50' : 'text-green-600 hover:bg-green-50'}\`}
                    title={survey.status === 'Ativa' ? 'Pausar Recebimento' : 'Ativar Recebimento'}
                  >
                    <Power size={20} />
                  </button>
                  <button 
                    onClick={() => handleDelete(survey.id)}
                    className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent"
                    title="Excluir Pesquisa"
                  >
                    <Trash2 size={20} />
                  </button>
    `;

    mainPage = mainPage.replace(stringToReplace, directButtons);
    fs.writeFileSync('src/app/dashboard/page.tsx', mainPage);
    console.log("Replaced successfully!");
}
