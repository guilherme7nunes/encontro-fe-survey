const fs = require('fs');
let surveyPage = fs.readFileSync('src/app/survey/[slug]/page.tsx', 'utf8');

surveyPage = surveyPage.replace(
  "fetch(`/api/surveys/\\${slug}/responses\\`, {",
  "fetch(`/api/surveys/${slug}/responses`, {"
);

// also just check the other fetch:
surveyPage = surveyPage.replace(
  "fetch(`/api/surveys/\\${slug}\\`, {",
  "fetch(`/api/surveys/${slug}`, {"
);

fs.writeFileSync('src/app/survey/[slug]/page.tsx', surveyPage);
console.log('Fixed syntax!');
