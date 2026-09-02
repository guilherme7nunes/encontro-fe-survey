const fs = require('fs');

const globalPath = 'src/app/api/surveys/[slug]/summarize-global/route.ts';
let globalContent = fs.readFileSync(globalPath, 'utf8');

globalContent = globalContent.replace(
    /const modelsToTry = \["gemini-flash-latest"\];/,
    `const modelsToTry = [
        "gemini-flash-latest",
        "gemini-pro-latest",
        "gemini-flash-lite-latest",
        "gemini-2.5-pro",
        "gemini-2.5-flash-lite"
    ];`
);
fs.writeFileSync(globalPath, globalContent);


const singlePath = 'src/app/api/surveys/[slug]/summarize/route.ts';
let singleContent = fs.readFileSync(singlePath, 'utf8');

// The single route didn't have the array loop, let's inject it.
// First, find the block:
/*
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const summary = result.response.text();
*/
const singleOldBlock = `const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = \`Você é um analista de pesquisa especializado em resumir feedbacks.
Aqui estão as respostas abertas para a seguinte pergunta de uma pesquisa de satisfação de um evento:

Pergunta: "\${questionTitle}"

Respostas:
\${answers.map((a: any) => \`- \${a.text}\`).join('\\n')}

Por favor, faça um resumo claro, conciso e profissional destas respostas. Destaque:
1. Os principais padrões, elogios ou sentimentos positivos.
2. Os principais pontos de melhoria ou críticas (se houver).
3. Uma conclusão breve.

Responda em formato Markdown (usando **negrito** e listas, sem usar cabeçalhos gigantes).\`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();`;

const singleNewBlock = `
    const prompt = \`Você é um analista de pesquisa especializado em resumir feedbacks.
Aqui estão as respostas abertas para a seguinte pergunta de uma pesquisa de satisfação de um evento:

Pergunta: "\${questionTitle}"

Respostas:
\${answers.map((a: any) => \`- \${a.text}\`).join('\\n')}

Por favor, faça um resumo claro, conciso e profissional destas respostas. Destaque:
1. Os principais padrões, elogios ou sentimentos positivos.
2. Os principais pontos de melhoria ou críticas (se houver).
3. Uma conclusão breve.

Responda em formato Markdown (usando **negrito** e listas, sem usar cabeçalhos gigantes).\`;

    let summary = '';
    let lastError = null;

    const modelsToTry = [
        "gemini-flash-latest",
        "gemini-pro-latest",
        "gemini-flash-lite-latest",
        "gemini-2.5-pro",
        "gemini-2.5-flash-lite"
    ];

    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            summary = result.response.text();
            break; 
        } catch (e: any) {
            console.warn(\`Falha ao tentar modelo \${modelName}:\`, e.message);
            lastError = e;
        }
    }

    if (!summary) {
        throw new Error(lastError?.message || 'Nenhum modelo funcionou na geração individual.');
    }`;

singleContent = singleContent.replace(singleOldBlock, singleNewBlock);
fs.writeFileSync(singlePath, singleContent);

console.log('Updated both API routes to use a cascade of 5 different models.');
