export type QuestionType = 'checkbox' | 'radio' | 'linear' | 'paragraph';

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[];
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  condition?: {
    questionId: number;
    valueToSkip: string;
    targetSectionId: number;
  };
}

export interface Section {
  id: number;
  title: string;
  description?: string;
  questions: Question[];
}

export const surveyData: Section[] = [
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
      { id: 4, text: 'O Encontro Nacional da FE 2026 correspondeu às suas expectativas?', type: 'linear', min: 1, max: 5, minLabel: 'Ficou muito abaixo', maxLabel: 'Superou muito' },
      { id: 5, text: 'Como você avalia a organização geral do evento?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 6, text: 'Como você avalia a estrutura e o ambiente do evento?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 7, text: 'Como você avalia a comunicação e as informações disponibilizadas antes e durante o evento?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' }
    ]
  },
  {
    id: 3,
    title: 'Credenciamento e recepção',
    questions: [
      { id: 8, text: 'Como você avalia o processo de credenciamento?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 9, text: 'O processo de credenciamento foi rápido e organizado?', type: 'radio', options: ['Sim, foi muito rápido e organizado', 'Foi bom, com pequenas dificuldades', 'Foi razoável', 'Foi demorado/desorganizado', 'Tive bastante dificuldade', 'Não participei do credenciamento'] },
      { id: 10, text: 'Como você avalia a recepção e o acolhimento na chegada ao evento?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 11, text: 'O que poderíamos melhorar no credenciamento e na recepção?', type: 'paragraph' }
    ]
  },
  {
    id: 4,
    title: 'Programação geral',
    questions: [
      { id: 12, text: 'Como você avalia a programação geral do evento?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 13, text: 'Como você avalia a qualidade dos conteúdos apresentados?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 14, text: 'Como você avalia a diversidade dos temas e atividades?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 15, text: 'O tempo destinado às atividades foi adequado?', type: 'radio', options: ['Sim, foi muito adequado', 'Na maioria das vezes, sim', 'Em alguns momentos foi insuficiente', 'Em alguns momentos foi excessivo', 'Não foi adequado'] },
      { id: 16, text: 'Como você avalia a organização dos horários e das transições entre as atividades?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 17, text: 'Qual foi o momento ou atividade que mais marcou você durante o evento?', type: 'paragraph' },
      { id: 18, text: 'Que tema, atividade ou formato você gostaria de ver em uma próxima edição?', type: 'paragraph' }
    ]
  },
  {
    id: 5,
    title: 'Workshops — sexta-feira pela manhã',
    questions: [
      { 
        id: 19, 
        text: 'Você participou dos workshops da sexta-feira pela manhã?', 
        type: 'radio', 
        options: ['Sim, participei de uma sessão', 'Sim, participei de duas sessões', 'Não participei'],
        condition: { questionId: 19, valueToSkip: 'Não participei', targetSectionId: 6 } 
      },
      { id: 21, text: 'Como você avalia os workshops da sexta-feira pela manhã?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 22, text: 'Como você avalia a qualidade dos palestrantes?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 23, text: 'Como você avalia a relevância dos temas apresentados?', type: 'linear', min: 1, max: 5, minLabel: 'Muito baixa', maxLabel: 'Muito alta' },
      { id: 24, text: 'O tempo destinado aos workshops foi adequado?', type: 'radio', options: ['Sim', 'Foi curto', 'Foi longo', 'Dependeu do workshop', 'Não tenho opinião'] },
      { id: 25, text: 'Qual workshop ou tema mais contribuiu para você? Por quê?', type: 'paragraph' },
      { id: 26, text: 'O que você mudaria ou melhoraria nos workshops para uma próxima edição?', type: 'paragraph' }
    ]
  },
  {
    id: 6,
    title: 'Feira dos Ministérios',
    questions: [
      { 
        id: 27, 
        text: 'Você visitou a Feira dos Ministérios?', 
        type: 'radio', 
        options: ['Sim, visitei vários stands', 'Sim, visitei alguns stands', 'Passei rapidamente pela feira', 'Não visitei'],
        condition: { questionId: 27, valueToSkip: 'Não visitei', targetSectionId: 7 }
      },
      { id: 28, text: 'Como você avalia a organização da Feira dos Ministérios?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 29, text: 'Como você avalia a variedade de ministérios e projetos apresentados?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 30, text: 'A Feira dos Ministérios proporcionou boas oportunidades para conhecer novos trabalhos e iniciativas?', type: 'linear', min: 1, max: 5, minLabel: 'Discordo totalmente', maxLabel: 'Concordo totalmente' },
      { id: 31, text: 'Como você avalia a estrutura e disposição dos stands?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 32, text: 'Você conheceu algum ministério ou projeto que despertou seu interesse?', type: 'radio', options: ['Sim', 'Não', 'Não me lembro'] },
      { id: 33, text: 'O que você mais gostou na Feira dos Ministérios?', type: 'paragraph' },
      { id: 34, text: 'O que poderia ser melhorado na Feira dos Ministérios?', type: 'paragraph' }
    ]
  },
  {
    id: 7,
    title: 'Patrocinadores',
    questions: [
      { id: 35, text: 'Você teve contato com algum dos patrocinadores durante o evento?', type: 'radio', options: ['Sim', 'Não', 'Não me lembro'] },
      { id: 36, text: 'Como você avalia a presença dos patrocinadores no evento?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 37, text: 'Os espaços, produtos ou ações dos patrocinadores foram interessantes para você?', type: 'linear', min: 1, max: 5, minLabel: 'Nada interessantes', maxLabel: 'Muito interessantes' },
      { id: 38, text: 'Que tipo de experiência ou interação com patrocinadores você gostaria de encontrar em uma próxima edição?', type: 'paragraph' }
    ]
  },
  {
    id: 8,
    title: 'Missão — sexta-feira à tarde',
    questions: [
      { 
        id: 39, 
        text: 'Você participou da missão realizada na sexta-feira à tarde?', 
        type: 'radio', 
        options: ['Sim', 'Não'],
        condition: { questionId: 39, valueToSkip: 'Não', targetSectionId: 9 }
      },
      { id: 40, text: 'Como você avalia a organização da missão?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 41, text: 'Como você avalia a experiência da missão?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 42, text: 'A missão correspondeu às suas expectativas?', type: 'linear', min: 1, max: 5, minLabel: 'Ficou muito abaixo', maxLabel: 'Superou muito' },
      { id: 43, text: 'O horário e a duração da missão foram adequados?', type: 'radio', options: ['Sim', 'O horário poderia ser melhor', 'A duração poderia ser melhor', 'Tanto o horário quanto a duração', 'Não tenho opinião'] },
      { id: 44, text: 'O que mais marcou você na experiência da missão?', type: 'paragraph' },
      { id: 45, text: 'O que poderia ser melhorado na missão?', type: 'paragraph' }
    ]
  },
  {
    id: 9,
    title: 'Alimentação',
    questions: [
      { id: 46, text: 'Como você avalia a qualidade da alimentação durante o evento?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 47, text: 'Como você avalia a variedade das opções de alimentação?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 48, text: 'Como você avalia a quantidade de alimentos e bebidas disponibilizados?', type: 'linear', min: 1, max: 5, minLabel: 'Muito insuficiente', maxLabel: 'Excelente' },
      { id: 49, text: 'Como você avalia os horários das refeições?', type: 'linear', min: 1, max: 5, minLabel: 'Muito inadequados', maxLabel: 'Muito adequados' },
      { id: 50, text: 'Como você avalia a organização dos espaços de alimentação?', type: 'linear', min: 1, max: 5, minLabel: 'Muito ruim', maxLabel: 'Excelente' },
      { id: 51, text: 'Houve alguma dificuldade relacionada à alimentação?', type: 'radio', options: ['Não', 'Sim, variedade de opções', 'Sim, quantidade', 'Sim, filas/organização', 'Sim, horários', 'Sim, opções para restrições alimentares', 'Sim, outro motivo'] },
      { id: 52, text: 'O que você sugere que seja diferente na alimentação de uma próxima edição?', type: 'paragraph' }
    ]
  },
  {
    id: 10,
    title: 'Experiência e impacto',
    questions: [
      { id: 53, text: 'O que você mais gostou no Encontro Nacional da FE 2026?', type: 'paragraph' },
      { id: 54, text: 'Qual foi o momento mais marcante para você durante o evento?', type: 'paragraph' },
      { id: 55, text: 'O evento trouxe algum aprendizado, inspiração ou conexão que você pretende levar para sua vida ou ministério?', type: 'paragraph' },
      { id: 56, text: 'Você teve oportunidade de conhecer novas pessoas ou fazer novas conexões durante o evento?', type: 'radio', options: ['Sim, muitas', 'Sim, algumas', 'Poucas', 'Não'] },
      { id: 57, text: 'Você participaria de uma próxima edição do Encontro Nacional da FE?', type: 'radio', options: ['Com certeza', 'Provavelmente sim', 'Talvez', 'Provavelmente não', 'Não'] }
    ]
  },
  {
    id: 11,
    title: 'Sua opinião é muito importante',
    questions: [
      { id: 58, text: 'Se você pudesse mudar apenas uma coisa no Encontro Nacional da FE, o que mudaria?', type: 'paragraph' },
      { id: 59, text: 'O que NÃO podemos deixar de fazer em uma próxima edição?', type: 'paragraph' },
      { id: 60, text: 'Que sugestão você daria para que o próximo Encontro Nacional da FE seja ainda melhor?', type: 'paragraph' },
      { id: 61, text: 'Existe algo que não perguntamos nesta pesquisa e que você gostaria de compartilhar conosco?', type: 'paragraph' }
    ]
  }
];
