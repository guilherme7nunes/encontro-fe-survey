const fs = require('fs');

const filepath = 'src/app/dashboard/[slug]/page.tsx';
let content = fs.readFileSync(filepath, 'utf8');

// Add import for marked
if (!content.includes("import { marked } from 'marked';")) {
    content = content.replace(
        "import Link from 'next/link';",
        "import Link from 'next/link';\nimport { marked } from 'marked';"
    );
}

// Replace the dangerouslySetInnerHTML
const oldHtml = `<div dangerouslySetInnerHTML={{ __html: globalAiSummary.replace(/\\*\\*(.*?)\\*\\*/g, '<b>$1</b>').replace(/\\*(.*?)\\*/g, '<i>$1</i>').replace(/\\n/g, '<br/>') }}></div>`;
const newHtml = `<div dangerouslySetInnerHTML={{ __html: marked.parse(globalAiSummary) as string }}></div>`;
content = content.replace(oldHtml, newHtml).replace(oldHtml, newHtml); // Replace both occurrences (Overview & Actions tab)

// Change the container classes
const oldContainer = `<div className="prose prose-blue max-w-none text-gray-800 font-medium whitespace-pre-wrap bg-white p-6 rounded-xl shadow-sm border border-blue-100/50">`;
const newContainer = `<div className="markdown-report max-w-none bg-white p-6 sm:p-10 rounded-xl shadow-sm border border-blue-100/50">`;
content = content.replace(oldContainer, newContainer).replace(oldContainer, newContainer);

fs.writeFileSync(filepath, content);

console.log('page.tsx patched successfully for marked rendering.');
