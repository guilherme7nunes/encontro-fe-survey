const fs = require('fs');

const filepath = 'src/app/globals.css';
let content = fs.readFileSync(filepath, 'utf8');

const cssToAppend = `
/* Custom Markdown Report Styling (PDF Claude Match) */
.markdown-report {
  font-family: Arial, Helvetica, sans-serif;
  color: #1e293b;
  line-height: 1.6;
}

.markdown-report h1, .markdown-report h2, .markdown-report h3 {
  color: #0f172a;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.markdown-report h2 {
  font-size: 1.5rem;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 0.5rem;
  color: #1e3a8a; /* Dark blue */
}

.markdown-report h3 {
  font-size: 1.25rem;
  color: #0d9488; /* Teal */
}

.markdown-report p {
  margin-bottom: 1rem;
}

.markdown-report ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.markdown-report li {
  margin-bottom: 0.5rem;
}

.markdown-report strong, .markdown-report b {
  font-weight: 700;
  color: #0f172a;
}

/* Beautiful Tables */
.markdown-report table {
  width: 100%;
  border-collapse: collapse;
  margin: 2rem 0;
  background-color: #ffffff;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  overflow: hidden;
}

.markdown-report th {
  background-color: #1e3a8a; /* Dark blue header */
  color: #ffffff;
  text-align: left;
  font-weight: 600;
  padding: 1rem;
  border-bottom: 2px solid #cbd5e1;
}

.markdown-report td {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: top;
}

.markdown-report tr:last-child td {
  border-bottom: none;
}

.markdown-report tr:nth-child(even) {
  background-color: #f8fafc;
}
`;

fs.writeFileSync(filepath, content + '\n' + cssToAppend);

console.log('Appended markdown styles to globals.css');
