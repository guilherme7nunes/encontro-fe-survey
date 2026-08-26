const fs = require('fs');
let surveyPage = fs.readFileSync('src/app/survey/[slug]/page.tsx', 'utf8');

surveyPage = surveyPage.replace(/\\\`/g, '`');
surveyPage = surveyPage.replace(/\\\$/g, '$');

fs.writeFileSync('src/app/survey/[slug]/page.tsx', surveyPage);
console.log('Fixed backslashes globally!');
