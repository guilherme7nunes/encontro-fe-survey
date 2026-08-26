const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const survey = await prisma.survey.findUnique({where: {id: 'encontronacionaldafe2026'}});
  if (!survey) return console.log('Survey not found');
  const sections = survey.configuration.sections;
  const targetQ = sections.flatMap(s => s.questions).find(q => q.text.includes('editada') || q.text.includes('Patrocinadores'));
  console.log(JSON.stringify(targetQ, null, 2));
}

main().finally(() => prisma.$disconnect());

