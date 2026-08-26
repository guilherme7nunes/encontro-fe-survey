require('ts-node').register();
const { surveyData } = require('./src/data/questions.ts');

fetch('https://encontro-fe-survey.vercel.app/api/surveys/encontronacionaldafe2026', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ config: surveyData })
})
.then(res => res.json())
.then(data => {
  console.log('Successfully injected 61 questions into live Vercel DB!');
  console.log(data);
})
.catch(console.error);
