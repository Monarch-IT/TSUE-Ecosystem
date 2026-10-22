const fs = require('fs');
const seed = JSON.parse(fs.readFileSync('/home/monarch/Projects/TSUE-Ecosystem/data/univerlife_seed.json', 'utf8'));

// Inject Monarch, Dodash2008 and other demo accounts
const hasMonarch = seed.users.find(u => u.login === 'monarch');
if (!hasMonarch) {
  seed.users.unshift(
    { login: 'monarch', name: 'Monarch', surname: 'Developer', role: 'admin', university: 'TDIU', faculty: 'Raqamli iqtisodiyot', grp: 'AT-900/26', phone: '+998901234567' },
    { login: 'antigravity', name: 'Antigravity', surname: 'Core', role: 'admin', university: 'TDIU', faculty: 'Raqamli iqtisodiyot', grp: 'AT-900/26', phone: '+998909876543' }
  );
}

// Ensure groups cover TSUE groups
const defaultGroups = ['AT-900/26', 'IB-900/26', 'II-900/26', 'RST-81/25', 'RST-82/25'];
seed.tutorGroups.push(
  { tutor_login: 'tyutor.demo', grp: 'AT-900/26' },
  { tutor_login: 'tyutor.demo', grp: 'IB-900/26' },
  { tutor_login: 'tyutor.demo', grp: 'II-900/26' }
);

fs.writeFileSync('/home/monarch/Projects/TSUE-Ecosystem/data/univerlife_seed.json', JSON.stringify(seed, null, 2));
console.log('Seed updated with Monarch and TSUE groups.');
