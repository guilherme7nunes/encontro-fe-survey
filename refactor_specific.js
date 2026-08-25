const fs = require('fs');
const file = 'src/app/dashboard/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add useEffect import if not there
content = content.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");

// 2. Fetch data on mount
const fetchLogic = `
  const [sectionsList, setSectionsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(\`/api/surveys/\${slug}\`)
      .then(res => res.json())
      .then(data => {
        if (data.config) {
          setSectionsList(data.config);
        }
        setIsLoading(false);
      });
  }, [slug]);

  const saveToDb = async (newSections) => {
    await fetch(\`/api/surveys/\${slug}\`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config: newSections })
    });
  };
`;

content = content.replace(
  "const [sectionsList, setSectionsList] = useState(surveyData);",
  fetchLogic
);

// 3. Update handleSaveQuestion and handleAddTopic to call saveToDb
content = content.replace(
  "setSectionsList(prev => prev.map(section => {",
  "setSectionsList(prev => {\n      const newSections = prev.map(section => {"
);
content = content.replace(
  "return section;\n    }));\n  };",
  "return section;\n      });\n      saveToDb(newSections);\n      return newSections;\n    });\n  };"
);

content = content.replace(
  "setSectionsList([...sectionsList, newSection]);",
  "const newSections = [...sectionsList, newSection];\n    setSectionsList(newSections);\n    saveToDb(newSections);"
);

fs.writeFileSync(file, content);
console.log('Specific dashboard refactored');
