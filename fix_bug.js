const fs = require('fs');

const dashFile = 'src/app/dashboard/[slug]/page.tsx';
let dash = fs.readFileSync(dashFile, 'utf8');
dash = dash.replace("slug.includes('lideranca') ? 'Liderança Jovem 26' : eventTitle;", "slug.includes('lideranca') ? 'Liderança Jovem 26' : 'Encontro Nacional da FE 2026';");
fs.writeFileSync(dashFile, dash);

const surveyFile = 'src/app/survey/[slug]/page.tsx';
let survey = fs.readFileSync(surveyFile, 'utf8');
survey = survey.replace("slug.includes('lideranca') ? 'Liderança Jovem 26' : eventTitle;", "slug.includes('lideranca') ? 'Liderança Jovem 26' : 'Encontro Nacional da FE 2026';");
fs.writeFileSync(surveyFile, survey);
