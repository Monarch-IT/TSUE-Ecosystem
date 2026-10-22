const fs = require('fs');

const seedRaw = fs.readFileSync('/home/monarch/Projects/TSUE-Ecosystem/data/univerlife_seed.json', 'utf8');
const originalCss = fs.readFileSync('/home/monarch/Downloads/Telegram Desktop/univerlife/public/app.css', 'utf8');
const originalJs = fs.readFileSync('/home/monarch/Downloads/Telegram Desktop/univerlife/public/app.js', 'utf8');

// Replace UniverLife title/brand with RIAT-Univerlife and remove emojis
let cleanCss = originalCss;
let cleanJs = originalJs;

// Remove any emoji from originalJs (e.g. 🎓, 📚, etc. if any)
cleanJs = cleanJs.replace(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

// Clean brand name to RIAT-Univerlife
cleanJs = cleanJs.replace(/<div class="brand"><i>U<\/i>UniverLife<\/div>/g, '<div class="brand"><div class="riat-badge">RIAT</div><span>Univerlife</span></div>');
cleanJs = cleanJs.replace(/document\.title\s*=\s*title\s*\+\s*" · UniverLife"/g, 'document.title = title + " · RIAT-Univerlife"');

// Save modified script
fs.writeFileSync('/home/monarch/Projects/TSUE-Ecosystem/js/univerlife_clean.js', cleanJs);
console.log('Cleaned script written.');
