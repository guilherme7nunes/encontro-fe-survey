const fs = require('fs');

async function main() {
  const res = await fetch('https://encontro-fe-survey.vercel.app/api/surveys/encontronacionaldafe2026');
  if (!res.ok) return console.log('Failed to fetch from Vercel');
  const data = await res.json();
  const sections = data.config;
  
  for (let section of sections) {
      if (section.id === 7) {
          for (let q of section.questions) {
              if (q.id === 35) {
                  q.text = 'Você teve contato com algum dos patrocinadores durante o evento?';
              }
          }
      }
  }

  const putRes = await fetch('https://encontro-fe-survey.vercel.app/api/surveys/encontronacionaldafe2026', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: sections })
  });
  
  if (putRes.ok) {
      console.log('Updated Vercel database successfully!');
  } else {
      console.log('Failed to update Vercel DB');
  }
}

main();
