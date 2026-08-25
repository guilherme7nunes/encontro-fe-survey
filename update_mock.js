const fs = require('fs');
const file = 'src/app/dashboard/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const newMock = `const openQuestionsData = [
  { id: 11, title: 'O que poderíamos melhorar no credenciamento e na recepção?', summary: 'A maioria elogiou a recepção. No entanto, relataram lentidão no credenciamento de grandes caravanas.', individualAnswers: [{ id: '#004', text: 'O credenciamento da nossa caravana atrasou bastante. Tinha pouca gente atendendo o grupo grande.' }, { id: '#045', text: 'A fila do QR Code estava travando sem internet, coloquem Wi-Fi liberado na entrada.' }] },
  { id: 17, title: 'Qual foi o momento ou atividade que mais marcou você durante o evento?', summary: 'A "Missão na sexta-feira à tarde" e o "Louvor de encerramento no sábado" foram os momentos mais citados de longe.', individualAnswers: [{ id: '#001', text: 'Com certeza o momento da missão nas ruas. Ver a alegria das pessoas ao receberem uma oração mudou minha perspectiva.' }, { id: '#033', text: 'O louvor de sábado à noite. A atmosfera estava indescritível, chorei do início ao fim.' }] },
  { id: 18, title: 'Que tema, atividade ou formato você gostaria de ver em uma próxima edição?', summary: 'Muitos pediram mais temas focados em tecnologia e juventude na igreja.', individualAnswers: [{ id: '#015', text: 'Gostaria de oficinas mais práticas sobre uso de redes sociais.' }, { id: '#019', text: 'Mais workshops sobre missões transculturais.' }] },
  { id: 25, title: 'Qual workshop ou tema mais contribuiu para você? Por quê?', summary: 'O workshop de liderança servil foi o mais citado, devido à praticidade das lições.', individualAnswers: [{ id: '#022', text: 'O de liderança foi um divisor de águas.' }] },
  { id: 26, title: 'O que você mudaria ou melhoraria nos workshops para uma próxima edição?', summary: 'Tempo maior para perguntas e respostas no final das sessões.', individualAnswers: [{ id: '#089', text: 'Queria que tivesse uns 15 minutos finais só pra tirar dúvidas.' }] },
  { id: 33, title: 'O que você mais gostou na Feira dos Ministérios?', summary: 'A diversidade de projetos sociais e o networking com pessoas de diferentes estados.', individualAnswers: [{ id: '#041', text: 'Gostei de conhecer projetos do nordeste.' }] },
  { id: 34, title: 'O que poderia ser melhorado na Feira dos Ministérios?', summary: 'A organização do espaço, pois os corredores ficaram muito apertados em horários de pico.', individualAnswers: [{ id: '#112', text: 'Os stands estavam muito juntos, mal dava para andar.' }] },
  { id: 38, title: 'Que tipo de experiência ou interação com patrocinadores você gostaria de encontrar em uma próxima edição?', summary: 'Brindes mais interativos, totens de fotos e sorteios durante a plenária.', individualAnswers: [{ id: '#009', text: 'Sorteios de livros dos patrocinadores.' }] },
  { id: 44, title: 'O que mais marcou você na experiência da missão?', summary: 'O sentimento de ver a reação das pessoas nas ruas e a união do grupo.', individualAnswers: [{ id: '#033', text: 'Orar por pessoas que não conhecíamos.' }] },
  { id: 45, title: 'O que poderia ser melhorado na missão?', summary: 'Um pouco mais de tempo, pois foi muito corrido na hora de voltar ao local.', individualAnswers: [{ id: '#099', text: 'Tivemos pouco tempo para conversar mais a fundo com as pessoas.' }] },
  { id: 52, title: 'O que você sugere que seja diferente na alimentação de uma próxima edição?', summary: 'Aumentar os caixas e distribuir melhor os horários para evitar longas filas.', individualAnswers: [{ id: '#001', text: 'As filas do almoço demoraram muito.' }] },
  { id: 53, title: 'O que você mais gostou no Encontro Nacional da FE 2026?', summary: 'O louvor intenso e a oportunidade de reconectar com a visão do ministério.', individualAnswers: [{ id: '#056', text: 'O agir de Deus nos louvores.' }] },
  { id: 54, title: 'Qual foi o momento mais marcante para você durante o evento?', summary: 'O culto de sábado à noite e a oração coletiva.', individualAnswers: [{ id: '#102', text: 'O encerramento no sábado de noite.' }] },
  { id: 55, title: 'O evento trouxe algum aprendizado, inspiração ou conexão que você pretende levar para sua vida ou ministério?', summary: 'Muitas ideias práticas da Feira dos Ministérios para aplicar na igreja local.', individualAnswers: [{ id: '#044', text: 'Sim, vou implementar o projeto infantil que vi no stand X.' }] },
  { id: 58, title: 'Se você pudesse mudar apenas uma coisa no Encontro Nacional da FE, o que mudaria?', summary: 'Aumentaria um dia de evento.', individualAnswers: [{ id: '#002', text: 'Gostaria que durasse até domingo à noite.' }] },
  { id: 59, title: 'O que NÃO podemos deixar de fazer em uma próxima edição?', summary: 'A missão evangelística prática na sexta-feira.', individualAnswers: [{ id: '#077', text: 'Continuem fazendo a missão na sexta!' }] },
  { id: 60, title: 'Que sugestão você daria para que o próximo Encontro Nacional da FE seja ainda melhor?', summary: 'Realizar o evento num espaço um pouco maior e com mais banheiros.', individualAnswers: [{ id: '#013', text: 'Mais banheiros disponíveis perto da plenária.' }] },
  { id: 61, title: 'Existe algo que não perguntamos nesta pesquisa e que você gostaria de compartilhar conosco?', summary: 'Muitos usaram este espaço apenas para agradecer e parabenizar a equipe.', individualAnswers: [{ id: '#091', text: 'Obrigado por tudo, vocês foram incríveis!' }] }
];`;

const startIdx = content.indexOf('const openQuestionsData = [');
if (startIdx !== -1) {
  // Find the end of the array which is '];' followed by a newline, but we can just use the index of '\nconst COLORS'
  const endMarker = '\nconst COLORS';
  const endIdx = content.indexOf(endMarker, startIdx);
  if (endIdx !== -1) {
    content = content.substring(0, startIdx) + newMock + content.substring(endIdx);
    fs.writeFileSync(file, content);
    console.log('Successfully updated the array');
  } else {
    console.log('Could not find the end of the array');
  }
} else {
  console.log('Could not find openQuestionsData block');
}
