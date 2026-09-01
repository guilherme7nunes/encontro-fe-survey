const fs = require('fs');

let content = fs.readFileSync('src/app/dashboard/[slug]/page.tsx', 'utf8');

const oldRender = `{aiSummaryMap[activeQ.id].split('\\n').map((line, i) => (
                                    <p key={i} className="mb-2">{line.replace(/\\*\\*(.*?)\\*\\*/g, '<b>$1</b>').replace(/\\*(.*?)\\*/g, '<i>$1</i>')}</p>
                                 ))}`;

const newRender = `{aiSummaryMap[activeQ.id].split('\\n').map((line, i) => (
                                    <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: line.replace(/\\*\\*(.*?)\\*\\*/g, '<b>$1</b>').replace(/\\*(.*?)\\*/g, '<i>$1</i>') }}></p>
                                 ))}`;

content = content.replace(oldRender, newRender);
fs.writeFileSync('src/app/dashboard/[slug]/page.tsx', content);
console.log('Fixed dangerouslySetInnerHTML.');
