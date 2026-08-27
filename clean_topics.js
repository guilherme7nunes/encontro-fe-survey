const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanLocal() {
  const survey = await prisma.survey.findUnique({where: {id: 'encontronacionaldafe2026'}});
  if (!survey) return;
  const sections = JSON.parse(survey.config);
  
  // Keep only sections that aren't the dummy ones created by accident
  const filtered = sections.filter(s => s.title !== 'Novo Tópico' || s.questions.length > 0);
  
  await prisma.survey.update({
      where: { id: 'encontronacionaldafe2026' },
      data: { config: JSON.stringify(filtered) }
  });
  console.log('Local DB dummy topics removed.');
}

async function cleanLive() {
  const res = await fetch('https://encontro-fe-survey.vercel.app/api/surveys/encontronacionaldafe2026');
  if (!res.ok) return;
  const data = await res.json();
  const sections = data.config;
  
  const filtered = sections.filter(s => s.title !== 'Novo Tópico' || s.questions.length > 0);
  
  const putRes = await fetch('https://encontro-fe-survey.vercel.app/api/surveys/encontronacionaldafe2026', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: filtered })
  });
  if (putRes.ok) console.log('Live DB dummy topics removed.');
}

cleanLocal().then(() => cleanLive()).finally(() => prisma.$disconnect());
