const fs = require('fs');

const globalPath = 'src/app/api/surveys/[slug]/summarize-global/route.ts';
let globalContent = fs.readFileSync(globalPath, 'utf8');

globalContent = globalContent.replace(
    /const modelsToTry = \[[\s\S]*?\];/,
    `const modelsToTry = ["gemini-3-flash-preview"];`
);
fs.writeFileSync(globalPath, globalContent);

const singlePath = 'src/app/api/surveys/[slug]/summarize/route.ts';
let singleContent = fs.readFileSync(singlePath, 'utf8');

singleContent = singleContent.replace(
    /const model = genAI\.getGenerativeModel\(\{ model: "gemini-2\.5-flash" \}\);/,
    `const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });`
);
fs.writeFileSync(singlePath, singleContent);

console.log('Updated to use gemini-3-flash-preview.');
