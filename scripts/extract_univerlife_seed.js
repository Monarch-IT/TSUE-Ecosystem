const fs = require('fs');

const sql3 = fs.readFileSync('/home/monarch/Downloads/Telegram Desktop/univerlife/migrations/0003_seed.sql', 'utf8');
const sql4 = fs.readFileSync('/home/monarch/Downloads/Telegram Desktop/univerlife/migrations/0004_parents.sql', 'utf8');
const sql6 = fs.readFileSync('/home/monarch/Downloads/Telegram Desktop/univerlife/migrations/0006_staff.sql', 'utf8');
const sql11 = fs.readFileSync('/home/monarch/Downloads/Telegram Desktop/univerlife/migrations/0011_v3_plan.sql', 'utf8');
const sql12 = fs.readFileSync('/home/monarch/Downloads/Telegram Desktop/univerlife/migrations/0012_tutor_groups.sql', 'utf8');

const allSql = [sql3, sql4, sql6, sql11, sql12].join('\n;\n');

// Parse users: INSERT OR IGNORE INTO users (login, pass, name, surname, university, faculty, grp, role, jshir, phone)
const users = [];
const userRegex = /INSERT OR IGNORE INTO users\s*\(([^)]+)\)\s*VALUES\s*\(([^;]+)\);/g;
let m;
while ((m = userRegex.exec(allSql)) !== null) {
  const cols = m[1].split(',').map(s => s.trim());
  const rawVals = m[2];
  // split vals respecting strings
  const vals = [];
  let cur = '', inStr = false;
  for (let i = 0; i < rawVals.length; i++) {
    const c = rawVals[i];
    if (c === "'" && (i === 0 || rawVals[i-1] !== '\\')) {
      if (inStr && rawVals[i+1] === "'") { cur += "'"; i++; continue; }
      inStr = !inStr;
    } else if (c === ',' && !inStr) {
      vals.push(cur.trim().replace(/^'|'$/g, ''));
      cur = '';
    } else {
      cur += c;
    }
  }
  vals.push(cur.trim().replace(/^'|'$/g, ''));
  const u = {};
  cols.forEach((col, idx) => {
    u[col] = vals[idx] === 'NULL' ? null : vals[idx];
  });
  if (u.login && !users.find(x => x.login === u.login)) {
    users.push(u);
  }
}

// Parse clubs: INSERT OR IGNORE INTO clubs (id, category, name, leader_login, schedule, place, description, status)
const clubs = [];
const clubRegex = /INSERT OR IGNORE INTO clubs\s*\(([^)]+)\)\s*VALUES\s*\(([^;]+)\);/g;
while ((m = clubRegex.exec(allSql)) !== null) {
  const cols = m[1].split(',').map(s => s.trim());
  const rawVals = m[2];
  const vals = [];
  let cur = '', inStr = false;
  for (let i = 0; i < rawVals.length; i++) {
    const c = rawVals[i];
    if (c === "'" && (i === 0 || rawVals[i-1] !== '\\')) {
      if (inStr && rawVals[i+1] === "'") { cur += "'"; i++; continue; }
      inStr = !inStr;
    } else if (c === ',' && !inStr) {
      vals.push(cur.trim().replace(/^'|'$/g, ''));
      cur = '';
    } else {
      cur += c;
    }
  }
  vals.push(cur.trim().replace(/^'|'$/g, ''));
  const obj = {};
  cols.forEach((col, idx) => {
    obj[col] = vals[idx] === 'NULL' ? null : vals[idx];
  });
  if (obj.id && !clubs.find(x => x.id === obj.id)) {
    clubs.push(obj);
  }
}

// Parse events: INSERT OR IGNORE INTO events
const events = [];
const eventRegex = /INSERT OR IGNORE INTO events\s*\(([^)]+)\)\s*VALUES\s*\(([^;]+)\);/g;
while ((m = eventRegex.exec(allSql)) !== null) {
  const cols = m[1].split(',').map(s => s.trim());
  const rawVals = m[2];
  const vals = [];
  let cur = '', inStr = false;
  for (let i = 0; i < rawVals.length; i++) {
    const c = rawVals[i];
    if (c === "'" && (i === 0 || rawVals[i-1] !== '\\')) {
      if (inStr && rawVals[i+1] === "'") { cur += "'"; i++; continue; }
      inStr = !inStr;
    } else if (c === ',' && !inStr) {
      vals.push(cur.trim().replace(/^'|'$/g, ''));
      cur = '';
    } else {
      cur += c;
    }
  }
  vals.push(cur.trim().replace(/^'|'$/g, ''));
  const obj = {};
  cols.forEach((col, idx) => {
    obj[col] = vals[idx] === 'NULL' ? null : vals[idx];
  });
  if (obj.id && !events.find(x => x.id === obj.id)) {
    events.push(obj);
  }
}

// Parse items (scholarships etc): INSERT OR IGNORE INTO items
const items = [];
const itemRegex = /INSERT OR IGNORE INTO items\s*\(([^)]+)\)\s*VALUES\s*\(([^;]+)\);/g;
while ((m = itemRegex.exec(allSql)) !== null) {
  const cols = m[1].split(',').map(s => s.trim());
  const rawVals = m[2];
  const vals = [];
  let cur = '', inStr = false;
  for (let i = 0; i < rawVals.length; i++) {
    const c = rawVals[i];
    if (c === "'" && (i === 0 || rawVals[i-1] !== '\\')) {
      if (inStr && rawVals[i+1] === "'") { cur += "'"; i++; continue; }
      inStr = !inStr;
    } else if (c === ',' && !inStr) {
      vals.push(cur.trim().replace(/^'|'$/g, ''));
      cur = '';
    } else {
      cur += c;
    }
  }
  vals.push(cur.trim().replace(/^'|'$/g, ''));
  const obj = {};
  cols.forEach((col, idx) => {
    obj[col] = vals[idx] === 'NULL' ? null : vals[idx];
  });
  if (obj.data) {
    try {
      obj.parsed = JSON.parse(obj.data);
    } catch(e) {}
  }
  items.push(obj);
}

// Parse articles
const articles = [];
const artRegex = /INSERT OR IGNORE INTO articles\s*\(([^)]+)\)\s*VALUES\s*\(([^;]+)\);/g;
while ((m = artRegex.exec(allSql)) !== null) {
  const cols = m[1].split(',').map(s => s.trim());
  const rawVals = m[2];
  const vals = [];
  let cur = '', inStr = false;
  for (let i = 0; i < rawVals.length; i++) {
    const c = rawVals[i];
    if (c === "'" && (i === 0 || rawVals[i-1] !== '\\')) {
      if (inStr && rawVals[i+1] === "'") { cur += "'"; i++; continue; }
      inStr = !inStr;
    } else if (c === ',' && !inStr) {
      vals.push(cur.trim().replace(/^'|'$/g, ''));
      cur = '';
    } else {
      cur += c;
    }
  }
  vals.push(cur.trim().replace(/^'|'$/g, ''));
  const obj = {};
  cols.forEach((col, idx) => {
    obj[col] = vals[idx] === 'NULL' ? null : vals[idx];
  });
  if (obj.data) {
    try {
      obj.parsed = JSON.parse(obj.data);
    } catch(e) {}
  }
  articles.push(obj);
}

// Parse tutor_groups
const tutorGroups = [];
const tgRegex = /INSERT OR IGNORE INTO tutor_groups\s*\(([^)]+)\)\s*VALUES\s*\(([^;]+)\);/g;
while ((m = tgRegex.exec(allSql)) !== null) {
  const cols = m[1].split(',').map(s => s.trim());
  const rawVals = m[2];
  const vals = [];
  let cur = '', inStr = false;
  for (let i = 0; i < rawVals.length; i++) {
    const c = rawVals[i];
    if (c === "'" && (i === 0 || rawVals[i-1] !== '\\')) {
      if (inStr && rawVals[i+1] === "'") { cur += "'"; i++; continue; }
      inStr = !inStr;
    } else if (c === ',' && !inStr) {
      vals.push(cur.trim().replace(/^'|'$/g, ''));
      cur = '';
    } else {
      cur += c;
    }
  }
  vals.push(cur.trim().replace(/^'|'$/g, ''));
  const obj = {};
  cols.forEach((col, idx) => {
    obj[col] = vals[idx] === 'NULL' ? null : vals[idx];
  });
  tutorGroups.push(obj);
}

// Parse parent_links
const parentLinks = [];
const plRegex = /INSERT OR IGNORE INTO parent_links\s*\(([^)]+)\)\s*VALUES\s*\(([^;]+)\);/g;
while ((m = plRegex.exec(allSql)) !== null) {
  const cols = m[1].split(',').map(s => s.trim());
  const rawVals = m[2];
  const vals = [];
  let cur = '', inStr = false;
  for (let i = 0; i < rawVals.length; i++) {
    const c = rawVals[i];
    if (c === "'" && (i === 0 || rawVals[i-1] !== '\\')) {
      if (inStr && rawVals[i+1] === "'") { cur += "'"; i++; continue; }
      inStr = !inStr;
    } else if (c === ',' && !inStr) {
      vals.push(cur.trim().replace(/^'|'$/g, ''));
      cur = '';
    } else {
      cur += c;
    }
  }
  vals.push(cur.trim().replace(/^'|'$/g, ''));
  const obj = {};
  cols.forEach((col, idx) => {
    obj[col] = vals[idx] === 'NULL' ? null : vals[idx];
  });
  parentLinks.push(obj);
}

// Parse hemis_subjects
const hemisSubjects = [];
const hsRegex = /INSERT OR IGNORE INTO hemis_subjects\s*\(([^)]+)\)\s*VALUES\s*\(([^;]+)\);/g;
while ((m = hsRegex.exec(allSql)) !== null) {
  const cols = m[1].split(',').map(s => s.trim());
  const rawVals = m[2];
  const vals = [];
  let cur = '', inStr = false;
  for (let i = 0; i < rawVals.length; i++) {
    const c = rawVals[i];
    if (c === "'" && (i === 0 || rawVals[i-1] !== '\\')) {
      if (inStr && rawVals[i+1] === "'") { cur += "'"; i++; continue; }
      inStr = !inStr;
    } else if (c === ',' && !inStr) {
      vals.push(cur.trim().replace(/^'|'$/g, ''));
      cur = '';
    } else {
      cur += c;
    }
  }
  vals.push(cur.trim().replace(/^'|'$/g, ''));
  const obj = {};
  cols.forEach((col, idx) => {
    obj[col] = vals[idx] === 'NULL' ? null : vals[idx];
  });
  hemisSubjects.push(obj);
}

const seedData = {
  users,
  clubs,
  events,
  scholarships: items.filter(x => x.parsed && x.parsed.type === 'scholarship').map(x => x.parsed),
  articles: articles.map(x => x.parsed || x),
  tutorGroups,
  parentLinks,
  hemisSubjects
};

console.log('Extracted counts:');
console.log('Users:', users.length);
console.log('Clubs:', clubs.length);
console.log('Events:', events.length);
console.log('Scholarships:', seedData.scholarships.length);
console.log('Articles:', seedData.articles.length);
console.log('TutorGroups:', tutorGroups.length);
console.log('ParentLinks:', parentLinks.length);
console.log('HemisSubjects:', hemisSubjects.length);

fs.writeFileSync('/home/monarch/Projects/TSUE-Ecosystem/data/univerlife_seed.json', JSON.stringify(seedData, null, 2));
console.log('Saved to /home/monarch/Projects/TSUE-Ecosystem/data/univerlife_seed.json');
