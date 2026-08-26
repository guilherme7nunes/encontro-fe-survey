const fs = require('fs');

let page = fs.readFileSync('src/app/survey/[slug]/page.tsx', 'utf8');

// Replace setIsFinished(true) with fetch then setIsFinished
page = page.replace(
  /\} else \{\s*setIsFinished\(true\);\s*\}/,
  `} else {
      fetch(\`/api/surveys/\${slug}/responses\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      }).then(() => {
        setIsFinished(true);
      }).catch(console.error);
    }`
);

fs.writeFileSync('src/app/survey/[slug]/page.tsx', page);
console.log('Fixed final submit');
