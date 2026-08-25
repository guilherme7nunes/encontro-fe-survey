const fs = require('fs');

const file = 'src/app/dashboard/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add import
if (!content.includes('import { questions }')) {
  content = content.replace("import { LayoutDashboard", "import { questions } from '../../../data/questions';\nimport { LayoutDashboard");
}

// 2. Fix the initial state
content = content.replace(
  /const \[questionsList, setQuestionsList\] = useState\(\[[\s\S]*?\]\);/,
  "const [questionsList, setQuestionsList] = useState(questions);"
);

// 3. Move the CONFIGURATOR tab out of the overview block
const configTabStart = content.indexOf('{/* TAB: CONFIGURATOR */}');
const overviewEndIdx = content.indexOf('</>', configTabStart); // This is wrong, because configTab is currently *before* </>
// Let's find exactly where it is.
// Currently it looks like:
// {/* TAB: CONFIGURATOR */}
// {activeTab === 'config' && ( ... )}
// </>
// )}
// {/* TAB: ANALYSIS BY QUESTION */}

// Let's just extract the config tab string using regex
const configTabRegex = /(\{\/\*\s*TAB:\s*CONFIGURATOR\s*\*\/\}[\s\S]*?)(?=\s*<\/>\s*\n\s*\)\})/;
const match = content.match(configTabRegex);

if (match) {
  const configTabStr = match[1];
  // Remove it from its current position
  content = content.replace(configTabStr, '');
  
  // Insert it after `</>\n          )}`
  const overviewEndString = '            </>\n          )}';
  content = content.replace(overviewEndString, overviewEndString + '\n\n' + configTabStr);
  
  fs.writeFileSync(file, content);
  console.log('Fixed config tab placement');
} else {
  console.log('Could not find the config tab in the expected location');
}
