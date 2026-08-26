const fs = require('fs');

function fixParams(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace GET signature
  content = content.replace(
    /export async function GET\(request: Request, { params }: { params: { slug: string } }\) {/g,
    `export async function GET(request: Request, context: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await context.params;
  const params = resolvedParams;`
  );

  // Replace PUT signature
  content = content.replace(
    /export async function PUT\(request: Request, { params }: { params: { slug: string } }\) {/g,
    `export async function PUT(request: Request, context: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await context.params;
  const params = resolvedParams;`
  );

  // Replace POST signature
  content = content.replace(
    /export async function POST\(request: Request, { params }: { params: { slug: string } }\) {/g,
    `export async function POST(request: Request, context: { params: Promise<{ slug: string }> | { slug: string } }) {
  const resolvedParams = await context.params;
  const params = resolvedParams;`
  );

  fs.writeFileSync(file, content);
}

fixParams('src/app/api/surveys/[slug]/route.ts');
fixParams('src/app/api/surveys/[slug]/responses/route.ts');
console.log('Fixed API params');
