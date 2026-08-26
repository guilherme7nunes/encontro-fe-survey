const fs = require('fs');
let code = fs.readFileSync('fix_edit_modal.js', 'utf8');
code = code.replace(/`nextIndex`/g, "'nextIndex'");
fs.writeFileSync('fix_edit_modal.js', code);
