const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const surveyData = [
  {
    id: 1,
    title: 'Sobre sua participação',
    questions: [
      { id: 1, text: 'Você participou do Encontro Nacional da FE 2026 em quais dias?', type: 'checkbox', options: ['Quinta-feira', 'Sexta-feira', 'Sábado'] },
      { id: 2, text: 'Esta foi sua primeira participação no Encontro Nacional da FE?', type: 'radio', options: ['Sim, foi minha primeira vez', 'Não, já participei de outras edições'] }
    ]
  },
  {
    id: 2,
    title: 'Avaliação geral',
    description: 'Para as próximas perguntas, considere a escala: 1 = Muito ruim | 2 = Ruim | 3 = Regular | 4 = Bom | 5 = Excelente',
    questions: [
      { id: 3, text: 'De modo geral, como você avalia o Encontro Nacional da FE 2026?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 4, text: 'O evento atendeu às suas expectativas?', type: 'radio', options: ['Ficou muito abaixo das expectativas', 'Ficou um pouco abaixo', 'Atendeu plenamente', 'Superou', 'Superou muito as expectativas'] },
      { id: 5, text: 'Você recomendaria o Encontro Nacional da FE para um amigo ou líder do seu ministério?', type: 'linear', min: 0, max: 10, minLabel: 'Com certeza não', maxLabel: 'Com certeza sim' }
    ]
  },
  {
    id: 6,
    title: 'Fechamento',
    questions: [
      { id: 58, text: 'Se você pudesse mudar apenas uma coisa no Encontro Nacional da FE, o que mudaria?', type: 'paragraph' },
      { id: 59, text: 'Que sugestão você daria para que o próximo Encontro seja ainda melhor?', type: 'paragraph' }
    ]
  }
];

async function main() {
  await prisma.survey.create({
    data: {
      id: 'encontronacionaldafe2026',
      title: 'Encontro Nacional da FE 2026',
      status: 'Ativa',
      config: JSON.stringify(surveyData),
    }
  });

  await prisma.survey.create({
    data: {
      id: 'erfecuritiba',
      title: 'ERFE Curitiba (Encontro Regional)',
      status: 'Encerrada',
      config: JSON.stringify(surveyData),
    }
  });

  console.log('Seed completed.');
}

main().catch(console.error).finally(() => prisma.$disconnect());
