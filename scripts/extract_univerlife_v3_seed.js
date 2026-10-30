const fs = require('fs');
const path = require('path');

const migDir = '/home/monarch/Downloads/Telegram Desktop/univerlife (1)/univerlife/migrations';
const files = fs.readdirSync(migDir).filter(f => f.endsWith('.sql')).sort();

const db = {
  users: [],
  hemis_subjects: [],
  edu_schedule: [],
  att_marks: [],
  att_days: [],
  explanations: [],
  notifications: [],
  clubs: [],
  club_members: [],
  events: [],
  event_regs: [],
  ifi_entries: [],
  ifi_files: [],
  checkin_sessions: [],
  grant_quotas: [],
  discipline: [],
  contracts: [],
  profiles: [],
  social_cats: [],
  spravkas: [],
  dorm_apps: [],
  event_photos: [],
  tutor_groups: [],
  parent_links: [],
  student_notes: [],
  items: [],
  articles: []
};

// Let's add monarch admin user
db.users.push({
  login: "monarch",
  pass: "demo1234",
  name: "Monarch",
  surname: "Developer",
  role: "admin",
  university: "TDIU",
  faculty: "Raqamli iqtisodiyot",
  grp: "AT-900/26",
  phone: "+998901234567",
  jshir: "30101010000000",
  direction: "Raqamli iqtisodiyot",
  course: 4,
  pay_type: "grant",
  gender: "Erkak"
});

function parseValuesTuples(sqlSnippet) {
  const tuples = [];
  let i = 0;
  while (i < sqlSnippet.length) {
    while (i < sqlSnippet.length && sqlSnippet[i] !== '(') i++;
    if (i >= sqlSnippet.length) break;
    i++;
    const vals = [];
    let cur = '', inStr = false;
    while (i < sqlSnippet.length) {
      const c = sqlSnippet[i];
      if (c === "'" && (i === 0 || sqlSnippet[i-1] !== '\\')) {
        if (inStr && sqlSnippet[i+1] === "'") {
          cur += "'";
          i += 2;
          continue;
        }
        inStr = !inStr;
        i++;
        continue;
      }
      if (!inStr && (c === ',' || c === ')')) {
        let v = cur.trim();
        if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
        else if (v === 'NULL' || v === 'null') v = null;
        else if (!isNaN(Number(v)) && v !== '') v = Number(v);
        vals.push(v);
        cur = '';
        if (c === ')') { i++; break; }
      } else {
        cur += c;
      }
      i++;
    }
    if (vals.length) tuples.push(vals);
  }
  return tuples;
}

files.forEach(file => {
  const content = fs.readFileSync(path.join(migDir, file), 'utf8');
  // Clean single line comments
  const lines = content.split('\n');
  let cleanSql = '';
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('--')) continue;
    cleanSql += line + '\n';
  }

  // Regex match INSERT OR IGNORE INTO <table> (<cols>) VALUES <tuples>;
  const insertRegex = /INSERT\s+(?:OR\s+IGNORE\s+)?INTO\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)\s*VALUES\s*([\s\S]*?);/gi;
  let m;
  while ((m = insertRegex.exec(cleanSql)) !== null) {
    const table = m[1].toLowerCase();
    const cols = m[2].split(',').map(s => s.trim().toLowerCase());
    const tuples = parseValuesTuples(m[3]);
    
    if (db[table]) {
      tuples.forEach(row => {
        const obj = {};
        cols.forEach((col, idx) => {
          obj[col] = row[idx] !== undefined ? row[idx] : null;
        });
        // Check uniqueness or update
        if (table === 'users') {
          const ex = db.users.find(u => u.login === obj.login);
          if (!ex) db.users.push(obj);
          else Object.assign(ex, obj);
        } else if (table === 'clubs') {
          const ex = db.clubs.find(c => c.id === obj.id);
          if (!ex) db.clubs.push(obj);
          else Object.assign(ex, obj);
        } else if (table === 'events') {
          const ex = db.events.find(e => e.id === obj.id);
          if (!ex) db.events.push(obj);
          else Object.assign(ex, obj);
        } else if (table === 'items') {
          db.items.push(obj);
        } else if (table === 'articles') {
          db.articles.push(obj);
        } else {
          db[table].push(obj);
        }
      });
    }
  }

  // Also check UPDATE statements for users, hemis_subjects, etc.
  const updateRegex = /UPDATE\s+([a-zA-Z0-9_]+)\s+SET\s+([\s\S]*?)\s+WHERE\s+([\s\S]*?);/gi;
  while ((m = updateRegex.exec(cleanSql)) !== null) {
    const table = m[1].toLowerCase();
    const setClause = m[2];
    const whereClause = m[3];

    if (table === 'users') {
      // e.g. SET direction = 'Raqamli iqtisodiyot', course = 2, pay_type = 'kontrakt' WHERE login = 'sardor.alisherov'
      const loginMatch = whereClause.match(/login\s*=\s*'([^']+)'/i);
      const loginsMatch = whereClause.match(/login\s+IN\s*\(([^)]+)\)/i);
      const grpMatch = whereClause.match(/grp\s+LIKE\s*'([^']+)'/i);

      const sets = {};
      setClause.split(',').forEach(part => {
        const [k, v] = part.split('=').map(s => s.trim());
        if (k && v) {
          let val = v;
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          else if (!isNaN(Number(val))) val = Number(val);
          sets[k.toLowerCase()] = val;
        }
      });

      if (loginMatch) {
        const u = db.users.find(x => x.login === loginMatch[1]);
        if (u) Object.assign(u, sets);
      } else if (loginsMatch) {
        const lgs = loginsMatch[1].split(',').map(s => s.trim().replace(/^'|'$/g, ''));
        db.users.forEach(u => {
          if (lgs.includes(u.login)) Object.assign(u, sets);
        });
      } else if (grpMatch) {
        db.users.forEach(u => {
          if (u.grp && u.grp.startsWith(grpMatch[1].replace('%', ''))) Object.assign(u, sets);
        });
      }
    } else if (table === 'hemis_subjects') {
      // e.g. UPDATE hemis_subjects SET score = 84, ended = '2026-10-17' WHERE login = 'sardor.alisherov' AND sem LIKE '2026-2027%' AND pos = 0;
      const loginM = whereClause.match(/login\s*=\s*'([^']+)'/i);
      const posM = whereClause.match(/pos\s*=\s*(\d+)/i);
      const sets = {};
      setClause.split(',').forEach(part => {
        const [k, v] = part.split('=').map(s => s.trim());
        if (k && v) {
          let val = v;
          if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
          else if (!isNaN(Number(val))) val = Number(val);
          sets[k.toLowerCase()] = val;
        }
      });
      if (loginM && posM) {
        const s = db.hemis_subjects.find(x => x.login === loginM[1] && Number(x.pos) === Number(posM[1]) && String(x.sem).startsWith('2026-2027'));
        if (s) Object.assign(s, sets);
      }
      if (setClause.includes('module = CASE pos')) {
        db.hemis_subjects.forEach(x => {
          if (String(x.sem).startsWith('2026-2027')) {
            const p = Number(x.pos);
            x.module = (p === 0 || p === 4) ? 1 : (p === 1 || p === 3) ? 2 : 3;
          }
        });
      }
    }
  }
});

// Format parsed JSON items/articles
db.scholarships = [];
db.items.forEach(it => {
  if (it.data) {
    try {
      const parsed = JSON.parse(it.data);
      if (parsed.type === 'scholarship') db.scholarships.push(parsed);
      if (parsed.type === 'club') {
        if (!db.clubs.find(c => c.id === it.id)) {
          db.clubs.push({
            id: it.id,
            name: parsed.title,
            category: parsed.category === 'Sport' ? 'sport' : 'it',
            schedule: parsed.schedule || '',
            place: parsed.place || '',
            description: parsed.description || '',
            created: 1
          });
        }
      }
    } catch(e) {}
  }
});

db.articles = db.articles.map(a => {
  if (a.data) {
    try { return JSON.parse(a.data); } catch(e) {}
  }
  return a;
});

// Format json columns
db.explanations.forEach(x => {
  if (typeof x.files === 'string') {
    try { x.files = JSON.parse(x.files); } catch(e) { x.files = []; }
  }
});
db.social_cats.forEach(s => {
  if (typeof s.files === 'string') {
    try { s.files = JSON.parse(s.files); } catch(e) { s.files = []; }
  }
});
db.spravkas.forEach(s => {
  if (typeof s.files === 'string') {
    try { s.files = JSON.parse(s.files); } catch(e) { s.files = []; }
  }
});
db.dorm_apps.forEach(d => {
  if (typeof d.files === 'string') {
    try { d.files = JSON.parse(d.files); } catch(e) { d.files = []; }
  }
});

console.log('Seed summary:');
Object.keys(db).forEach(k => {
  console.log(`  ${k}: ${Array.isArray(db[k]) ? db[k].length : typeof db[k]}`);
});

fs.writeFileSync('/home/monarch/Projects/TSUE-Ecosystem/data/univerlife_v3_seed.json', JSON.stringify(db, null, 2));
console.log('Successfully written /home/monarch/Projects/TSUE-Ecosystem/data/univerlife_v3_seed.json');
