const fs = require('fs');

const globalPath = 'src/app/api/surveys/[slug]/summarize-global/route.ts';
let globalContent = fs.readFileSync(globalPath, 'utf8');

globalContent = globalContent.replace(
    /const modelsToTry = \["gemini-3-flash-preview"\];/,
    `const modelsToTry = ["gemini-flash-latest"];`
);
fs.writeFileSync(globalPath, globalContent);

const singlePath = 'src/app/api/surveys/[slug]/summarize/route.ts';
let singleContent = fs.readFileSync(singlePath, 'utf8');

singleContent = singleContent.replace(
    /const model = genAI\.getGenerativeModel\(\{ model: "gemini-3-flash-preview" \}\);/,
    `const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });`
);
fs.writeFileSync(singlePath, singleContent);

console.log('Updated to use gemini-flash-latest.');
