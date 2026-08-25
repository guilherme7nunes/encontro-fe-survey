const fs = require('fs');

// 1. Update specific dashboard
let dashFile = 'src/app/dashboard/[slug]/page.tsx';
let dashContent = fs.readFileSync(dashFile, 'utf8');

dashContent = dashContent.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useParams } from 'next/navigation';");
dashContent = dashContent.replace("export default function DashboardPage() {", "export default function DashboardPage() {\n  const params = useParams();\n  const slug = params?.slug || '';\n  const eventTitle = slug.includes('curitiba') ? 'ERFE Curitiba' : slug.includes('lideranca') ? 'Liderança Jovem 26' : 'Encontro Nacional da FE 2026';");

dashContent = dashContent.replace(/>Encontro Nacional da FE 2026</g, '>{eventTitle}<');
dashContent = dashContent.replace(/'Encontro Nacional da FE 2026'/g, 'eventTitle');
dashContent = dashContent.replace(/>Painel ENF 26</g, '>{eventTitle}<');

fs.writeFileSync(dashFile, dashContent);

// 2. Update specific survey
let surveyFile = 'src/app/survey/[slug]/page.tsx';
let surveyContent = fs.readFileSync(surveyFile, 'utf8');

surveyContent = surveyContent.replace("import { useState } from 'react';", "import { useState } from 'react';\nimport { useParams } from 'next/navigation';");
surveyContent = surveyContent.replace("export default function SurveyPage() {", "export default function SurveyPage() {\n  const params = useParams();\n  const slug = params?.slug || '';\n  const eventTitle = slug.includes('curitiba') ? 'ERFE Curitiba' : slug.includes('lideranca') ? 'Liderança Jovem 26' : 'Encontro Nacional da FE 2026';");

surveyContent = surveyContent.replace(/>Encontro da FE 2026</g, '>{eventTitle}<');
surveyContent = surveyContent.replace(/Encontro Nacional da FE/g, '{eventTitle}');
surveyContent = surveyContent.replace(/Link href="\/dashboard"/g, 'Link href={`/dashboard/${slug}`}');

fs.writeFileSync(surveyFile, surveyContent);

console.log('Slugs updated');
