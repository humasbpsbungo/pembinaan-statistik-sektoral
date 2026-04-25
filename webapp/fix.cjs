const fs = require('fs'); 
const file = 'src/data/indicators.ts'; 
let content = fs.readFileSync(file, 'utf8'); 

content = content.replace(/kode: "(4\d+|5\d+)",([\s\S]*?)isGeneral: false,/g, (match, kode, inner) => { 
  if (kode === '50201') return match; 
  return `kode: "${kode}",${inner}isGeneral: true,`; 
}); 

fs.writeFileSync(file, content);
