const fs = require('fs');

const file = 'src/app/dashboard/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace import
content = content.replace("import { questions } from '../../../data/questions';", "import { surveyData } from '../../../data/questions';");

// Replace useState initialization
content = content.replace(
  "const [questionsList, setQuestionsList] = useState(questions);",
  "const allQuestions = surveyData.flatMap(section => section.questions);\n  const [questionsList, setQuestionsList] = useState(allQuestions);"
);

fs.writeFileSync(file, content);
console.log('Fixed export name and extracted questions');
