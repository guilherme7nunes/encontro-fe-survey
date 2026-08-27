const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const survey = await prisma.survey.findUnique({where: {id: 'encontronacionaldafe2026'}});
  if (!survey) return console.log('Survey not found');
  
  const sections = JSON.parse(survey.config);
  
  // Find question 35 and fix it
  for (let section of sections) {
      if (section.id === 7) {
          for (let q of section.questions) {
              if (q.id === 35) {
                  q.text = 'Você teve contato com algum dos patrocinadores durante o evento?';
                  console.log('Fixed question text in config array.');
              }
          }
      }
  }

  await prisma.survey.update({
      where: { id: 'encontronacionaldafe2026' },
      data: { config: JSON.stringify(sections) }
  });
  
  console.log('Updated local database successfully!');
}

main().finally(() => prisma.$disconnect());
