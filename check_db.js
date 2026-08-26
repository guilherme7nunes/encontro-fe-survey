const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const survey = await prisma.survey.findUnique({
    where: { id: 'encontronacionaldafe2026' }
  });
  console.log('Survey exists:', !!survey);
  if (survey) {
    try {
      JSON.parse(survey.config);
      console.log('JSON parse successful');
    } catch (e) {
      console.error('JSON parse failed:', e.message);
    }
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
