const fs = require('fs');
const file = 'src/app/dashboard/[slug]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  'className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"',
  'className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-gray-900 font-medium"'
);

content = content.replace(
  'className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"',
  'className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-900 font-medium"'
);

content = content.replace(
  'className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"',
  'className="flex-1 border border-gray-300 rounded-lg p-2 text-sm text-gray-900 font-medium"'
);

fs.writeFileSync(file, content);
