const fs = require('fs');

const originalAppJs = fs.readFileSync('/home/monarch/Downloads/Telegram Desktop/univerlife/public/app.js', 'utf8');
const originalAppCss = fs.readFileSync('/home/monarch/Downloads/Telegram Desktop/univerlife/public/app.css', 'utf8');
const seedData = fs.readFileSync('/home/monarch/Projects/TSUE-Ecosystem/data/univerlife_seed.json', 'utf8');

console.log('Read original assets.');
