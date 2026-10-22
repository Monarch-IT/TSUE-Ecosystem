const fs = require('fs');

const originalJs = fs.readFileSync('/home/monarch/Downloads/Telegram Desktop/univerlife/public/app.js', 'utf8');

// 1. Remove emojis
let js = originalJs.replace(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

// 2. Change Brand and Titles
js = js.replace(/<div class="brand"><i>U<\/i>UniverLife<\/div>/g, '<div class="brand"><div class="riat-badge">TSUE</div><span>UniverLife</span></div>');
js = js.replace(/document\.title = title \+ " · UniverLife";/g, 'document.title = title + " · TSUE UniverLife";');
js = js.replace(/<div class="foot">TDIU talabalari uchun platforma<\/div>/g, '<div class="foot">TSUE UniverLife · Birlashgan ekotizim portali</div>');

// 3. Add link to Ecosystem in top header
js = js.replace(
  '<header class="top"><h1>\' + esc(title) + \'</h1>',
  '<header class="top"><a href="/ecosystem" class="riat-ecosystem-link"><i class="fa-solid fa-arrow-left"></i> Ekotizimga qaytish</a><h1>\' + esc(title) + \'</h1>'
);

// 4. Inject module badges bar at the top of main content view
js = js.replace(
  '<main class="content" id="view">\' + view + \'</main>',
  '<main class="content" id="view">\' + renderModuleBadges() + view + \'</main>'
);

// 5. Replace scheduleView with full TSUE interactive schedule view (safely escaped quotes)
const oldSchedRegex = /function scheduleView\(rows, opt\) \{[\s\S]*?\n\}/;
const newSchedFn = `
let currentSchedWeek = 'odd';
let currentSchedGroup = '';
let currentSchedSearch = '';
let currentSchedCourse = 'all';

function renderModuleBadges() {
  const cur = parseRoute().parts[0] || "home";
  return '<div class="module-badge-bar">' +
    '<span style="font-size:12px;font-weight:800;color:var(--muted);text-transform:uppercase;margin-right:4px;">TSUE UniverLife:</span>' +
    '<a href="#/schedule" class="module-badge ' + (['schedule','attendance','gpa'].includes(cur)?'active':'') + '"><i class="fa-solid fa-graduation-cap"></i> O‘quv & Jadval (EduPage, GPA, Davomat)</a>' +
    '<a href="#/ifi" class="module-badge ' + (['ifi','clubs','events','scholarships'].includes(cur)?'active':'') + '"><i class="fa-solid fa-handshake-angle"></i> Ijtimoiy & IFI (11 mezon, Klublar, Grantlar)</a>' +
    '<a href="#/explanations" class="module-badge ' + (['explanations','tutor'].includes(cur)?'active':'') + '"><i class="fa-solid fa-user-shield"></i> Oila & Tyutor (Monitoring va Aloqa)</a>' +
  '</div>';
}

function scheduleView(rows, opt) {
  opt = opt || {};
  const td = isoDay(today());
  const d = schedDay || (td <= 6 ? td : 1);
  
  const hasEdu = typeof EDUPAGE_SCHEDULE_DATA !== 'undefined' && EDUPAGE_SCHEDULE_DATA;
  const groups = hasEdu ? Object.keys(EDUPAGE_SCHEDULE_DATA).sort() : ['AT-900/26', 'IB-900/26', 'II-900/26', 'RST-81/25'];
  
  if (!currentSchedGroup) {
    if (S.me && S.me.grp && groups.includes(S.me.grp)) {
      currentSchedGroup = S.me.grp;
    } else {
      currentSchedGroup = groups[0] || 'AT-900/26';
    }
  }

  const filteredGroups = groups.filter(g => {
    if (currentSchedCourse === 'all') return true;
    const gData = EDUPAGE_SCHEDULE_DATA[g];
    return gData && String(gData.course) === String(currentSchedCourse);
  });

  const dayIdx = d - 1;
  let lessons = [];
  
  if (hasEdu && EDUPAGE_SCHEDULE_DATA[currentSchedGroup]) {
    const gObj = EDUPAGE_SCHEDULE_DATA[currentSchedGroup];
    const wObj = gObj[currentSchedWeek] || gObj['odd'] || {};
    const dObj = wObj[dayIdx] || {};
    Object.keys(dObj).forEach(slotKey => {
      const item = dObj[slotKey];
      if (item && item.subject) {
        lessons.push({
          slot: Number(slotKey) + 1,
          time: S.pairs[Number(slotKey) + 1] || '08:30–09:50',
          subject: item.subject,
          type: item.type || 'lecture',
          teacher: item.teacher || '—',
          room: item.room || '—'
        });
      }
    });
  } else if (rows && rows.length) {
    lessons = rows.filter(x => x.day === d).map(x => ({
      slot: x.pair,
      time: S.pairs[x.pair] || '',
      subject: x.subject,
      type: x.kind || 'lecture',
      teacher: x.teacher || '—',
      room: x.room || '—'
    }));
  }

  if (currentSchedSearch) {
    const q = currentSchedSearch.toLowerCase();
    lessons = lessons.filter(l => 
      l.subject.toLowerCase().includes(q) ||
      l.teacher.toLowerCase().includes(q) ||
      l.room.toLowerCase().includes(q)
    );
  }

  const daysPills = [1, 2, 3, 4, 5, 6].map(i => {
    const isToday = i === td;
    const isActive = i === d;
    let count = 0;
    if (hasEdu && EDUPAGE_SCHEDULE_DATA[currentSchedGroup]) {
      const gObj = EDUPAGE_SCHEDULE_DATA[currentSchedGroup];
      const wObj = gObj[currentSchedWeek] || gObj['odd'] || {};
      const dObj = wObj[i - 1] || {};
      count = Object.keys(dObj).length;
    }
    return '<button type="button" class="sched-day-pill ' + (isActive ? 'active' : '') + '" data-act="sched-day" data-day="' + i + '">' +
      '<span class="d-title">' + DAYS[i] + '</span>' +
      '<span class="d-sub">' + (isToday ? 'Bugun · ' : '') + count + ' ta dars</span>' +
    '</button>';
  }).join('');

  return '<div class="sched-hero">' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">' +
      '<div>' +
        '<h2>TDIU Rasmiy Dars Jadvali</h2>' +
        '<p>Fakultet guruhlari, ustozlar va auditoriyalar bo&#39;yicha real vaqt rejimida avtomatlashtirilgan interaktiv jadval tizimi.</p>' +
      '</div>' +
      '<div class="sched-btn-group">' +
        '<button type="button" class="' + (currentSchedWeek === 'odd' ? 'active' : '') + '" data-act="sched-week" data-week="odd">Toq hafta</button>' +
        '<button type="button" class="' + (currentSchedWeek === 'even' ? 'active' : '') + '" data-act="sched-week" data-week="even">Juft hafta</button>' +
      '</div>' +
    '</div>' +
    '<div class="sched-controls">' +
      '<div class="sched-select-wrap">' +
        '<select data-act="sched-course">' +
          '<option value="all"' + (currentSchedCourse==='all'?' selected':'') + '>Barcha kurslar</option>' +
          '<option value="1"' + (currentSchedCourse==='1'?' selected':'') + '>1-kurs</option>' +
          '<option value="2"' + (currentSchedCourse==='2'?' selected':'') + '>2-kurs</option>' +
          '<option value="3"' + (currentSchedCourse==='3'?' selected':'') + '>3-kurs</option>' +
          '<option value="4"' + (currentSchedCourse==='4'?' selected':'') + '>4-kurs</option>' +
        '</select>' +
        '<select data-act="sched-group">' +
          filteredGroups.map(g => '<option value="' + g + '"' + (g === currentSchedGroup ? ' selected' : '') + '>' + g + '</option>').join('') +
        '</select>' +
      '</div>' +
      '<div style="flex:1;min-width:200px">' +
        '<input type="text" placeholder="Fan, o&#39;qituvchi yoki xona qidirish…" value="' + esc(currentSchedSearch) + '" data-act="sched-search-input" style="height:40px;border-radius:8px;border:none;padding:0 12px;width:100%">' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div class="sched-days-nav">' + daysPills + '</div>' +
  '<div class="card">' +
    '<div class="ch">' +
      '<h2>' + DAYS[d] + (d === td ? ' <small style="color:var(--ok);font-weight:700">· Bugun</small>' : '') + ' <small>(' + currentSchedGroup + ' · ' + (currentSchedWeek === 'odd' ? 'Toq' : 'Juft') + ' hafta)</small></h2>' +
      '<span class="src"><i></i> TDIU EduPage Jadval Tizimi (Sinxron)</span>' +
    '</div>' +
    (lessons.length ? 
      '<div class="lessons-list">' + lessons.map(l => {
        let typeCls = "type-lecture";
        let typeName = "Ma&apos;ruza";
        if (l.type === "practice" || l.type === "seminar") { typeCls = "type-practice"; typeName = "Amaliyot"; }
        else if (l.type === "lab") { typeCls = "type-lab"; typeName = "Laboratoriya"; }
        return '<div class="lesson-card">' +
          '<div class="lesson-time">' +
            '<b>' + l.slot + '-para</b>' +
            '<small>' + esc(l.time) + '</small>' +
          '</div>' +
          '<div class="lesson-info">' +
            '<div class="lesson-subject">' + esc(l.subject) + '</div>' +
            '<div class="lesson-meta">' +
              '<span class="lesson-type-badge ' + typeCls + '">' + typeName + '</span>' +
              '<span><i class="fa-solid fa-chalkboard-user"></i> ' + esc(l.teacher) + '</span>' +
              '<span><i class="fa-solid fa-location-dot"></i> ' + esc(l.room) + '</span>' +
            '</div>' +
          '</div>' +
        '</div>';
      }).join('') + '</div>'
      : empty('Bu kunda tanlangan guruh uchun darslar mavjud emas.')
    ) +
  '</div>';
}
`;

js = js.replace(oldSchedRegex, newSchedFn);

// 6. Update todayLessons in dashboard to use EDUPAGE_SCHEDULE_DATA
const oldTodayRegex = /function todayLessons\(rows\) \{[\s\S]*?\n\}/;
const newTodayFn = `
function todayLessons(rows) {
  const td = isoDay(today());
  const dIdx = td <= 6 ? td - 1 : 0;
  const grp = (S.me && S.me.grp && S.me.grp !== '-') ? S.me.grp : 'AT-900/26';
  const hasEdu = typeof EDUPAGE_SCHEDULE_DATA !== 'undefined' && EDUPAGE_SCHEDULE_DATA && EDUPAGE_SCHEDULE_DATA[grp];
  
  if (hasEdu) {
    const wObj = EDUPAGE_SCHEDULE_DATA[grp]['odd'] || {};
    const dObj = wObj[dIdx] || {};
    const keys = Object.keys(dObj);
    if (!keys.length) return empty(td === 7 ? "Bugun yakshanba — dars yo'q." : "Bugun dars yo'q.");
    return '<div class="list">' + keys.map(k => {
      const it = dObj[k];
      const pNum = Number(k) + 1;
      return '<div class="row">' +
        '<span class="date"><b>' + pNum + '</b><small>para</small></span>' +
        '<span class="t"><b>' + esc(it.subject) + '</b><small>' + esc(S.pairs[pNum] || '') + ' · ' + esc(it.room) + ' · ' + esc(it.teacher) + '</small></span>' +
      '</div>';
    }).join('') + '</div>';
  }

  const L = (rows || []).filter(x => x.day === td);
  return L.length ? '<div class="list">' + L.map(x => '<div class="row"><span class="date"><b>' + x.pair + "</b><small>para</small></span><span class=\\"t\\"><b>" + esc(x.subject) + "</b><small>" + esc(S.pairs[x.pair] || "") + " · " + esc(x.room) + "</small></span></div>").join("") + "</div>" : empty(td === 7 ? "Bugun yakshanba — dars yo'q." : "Bugun dars yo'q.");
}
`;
js = js.replace(oldTodayRegex, newTodayFn);

// 7. Ensure all roles can access schedule, attendance, gpa, ifi without 'Sahifa topilmadi'
js = js.replace(
  'const fn = (V[role] && V[role][p0]) || V.common[p0];',
  'const fn = (V[role] && V[role][p0]) || (V.student && V.student[p0]) || (V.admin && V.admin[p0]) || V.common[p0];'
);

// 8. Add schedule to admin and dean nav if not already present
js = js.replace(
  'admin: [["home", "Umumiy ko\'rinish", "grid"],',
  'admin: [["home", "Umumiy ko\'rinish", "grid"], ["schedule", "Dars jadvali", "cal"], ["students", "Talabalar", "list"], ["attendance", "Davomat", "check"], ["gpa", "GPA va baholar", "cap"], ["ifi", "Ijtimoiy faollik", "star"],'
);

// 9. Add event listeners for schedule interactions
js = js.replace(
  'document.addEventListener("click", async (e) => {',
  `document.addEventListener("input", (e) => {
    const t = e.target;
    if (t.dataset.act === "sched-search-input") {
      currentSchedSearch = t.value;
      const cardEl = document.querySelector(".lessons-list");
      if (cardEl) render();
    }
  });
  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.dataset.act === "sched-course") {
      currentSchedCourse = t.value;
      render();
    } else if (t.dataset.act === "sched-group") {
      currentSchedGroup = t.value;
      render();
    }
  });
  document.addEventListener("click", async (e) => {
    const btnSched = e.target.closest("button, a");
    if (btnSched && btnSched.dataset.act === "sched-week") {
      currentSchedWeek = btnSched.dataset.week;
      render();
      return;
    }
    if (btnSched && btnSched.dataset.act === "sched-day") {
      schedDay = Number(btnSched.dataset.day);
      render();
      return;
    }
`
);

// 10. Replace init() and api() to work seamlessly client-side with localStorage SSO
const oldInitRegex = /\(async function init\(\) \{[\s\S]*?\}\)\(\);/;
const newInit = `
/* SSO Boot Integration from TSUE Platform */
function bootFromEcosystem() {
  try {
    const raw = localStorage.getItem("riat_user") || localStorage.getItem("tsue_user");
    if (raw) {
      const u = JSON.parse(raw);
      if (u && (u.login || u.username)) {
        const login = u.login || u.username;
        let role = "student";
        if (u.role === "admin" || login === "monarch" || login === "antigravity") role = "admin";
        else if (u.role === "tutor" || u.role === "tyutor") role = "tutor";
        else if (u.role === "parent") role = "parent";
        else if (u.role === "dean") role = "dean";
        
        return {
          login: login,
          name: u.name || "Talaba",
          surname: u.surname || "",
          role: role,
          roleName: role === "admin" ? "Administrator" : role === "tutor" ? "Tyutor" : role === "parent" ? "Ota-ona" : role === "dean" ? "Dekanat" : "Talaba",
          grp: u.group || u.grp || "AT-900/26",
          faculty: u.faculty || "Raqamli iqtisodiyot",
          phone: u.phone || "+998 90 000 00 00",
          jshir: u.jshir || "30101010000000"
        };
      }
    }
  } catch (e) {
    console.warn("Ecosystem SSO check error:", e);
  }
  return null;
}

/* Local storage state manager for static deployment */
const DB_STORAGE_KEY = "riat_univerlife_local_db";
function getLocalDb() {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  const seed = window.__UNIVERLIFE_SEED__ || {};
  return {
    users: seed.users || [],
    clubs: seed.clubs || [],
    events: seed.events || [],
    scholarships: seed.scholarships || [],
    articles: seed.articles || [],
    entries: [],
    explanations: [],
    notes: [],
    attMarks: []
  };
}

function saveLocalDb(db) {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
  } catch(e) {}
}

/* Standalone buildState generator */
function buildLocalState(meUser) {
  const ldb = getLocalDb();
  const seed = window.__UNIVERLIFE_SEED__ || {};
  const base = {
    me: meUser,
    today: today(),
    semester: { start: "2026-09-01", months: 2, name: "2026-2027 · 1-semestr" },
    hemis: { mode: "demo", note: "RIAT EduPage & HEMIS sinxron tizimi ulangan" },
    pairs: { 1: "08:30–09:50", 2: "10:00–11:20", 3: "11:30–12:50", 4: "13:30–14:50", 5: "15:00–16:20", 6: "16:30–17:50" },
    rules: {
      crit: [
        { id: "read", n: 1, name: "Kitobxonlik madaniyati", who: "student", max: 20, mode: "one", doc: "Kitobxonlik testi", hint: "Adabiyotlar soni", subs: [{ id: "b10", name: "10–12 ta", pts: 20 }, { id: "b7", name: "7–9 ta", pts: 15 }, { id: "b4", name: "4–6 ta", pts: 10 }] },
        { id: "club", n: 2, name: "To'garaklarda ishtiroki", who: "student", max: 20, mode: "sum", doc: "Klub ma'lumotnomasi", hint: "To'garak a'zoligi", subs: [{ id: "it", name: "IT to'garaklari", pts: 10 }, { id: "sport", name: "Sport seksiyalari", pts: 10 }, { id: "org", name: "To'garak tashkil etish", pts: 20 }] },
        { id: "acad", n: 3, name: "Akademik o'zlashtirish", who: "hemis", max: 10, mode: "sys", doc: "", hint: "GPA asosida avtomatik", subs: [] },
        { id: "conduct", n: 4, name: "Xulqi va odob-axloqi", who: "tutor", max: 5, mode: "sum", doc: "", hint: "Tyutor bahosi", subs: [{ id: "dress", name: "Kiyinish madaniyati", pts: 2 }, { id: "code", name: "Odob-axloq", pts: 3 }] },
        { id: "contest", n: 5, name: "Tanlov va musobaqalar", who: "ref", max: 10, mode: "best", doc: "Diplom/sertifikat", hint: "Xalqaro va Respublika tanlovlari", photos: 2, fields: [{ k: "title", label: "Musobaqa nomi", req: true }, { k: "place", label: "Joyi", req: true }, { k: "date", label: "Sana", type: "date", req: true }], subs: [{ id: "x1", name: "Xalqaro — 1-o'rin", pts: 10 }, { id: "r1", name: "Respublika — 1-o'rin", pts: 9 }, { id: "m1", name: "Muassasa — 1-o'rin", pts: 3 }] },
        { id: "att", n: 6, name: "Darslarga qatnashishi", who: "hemis", max: 5, mode: "sys", doc: "", hint: "Davomat natijalari", subs: [] },
        { id: "enlight", n: 7, name: "Ma'rifat darsida ishtiroki", who: "tutor", max: 10, mode: "enlight", doc: "", hint: "Ma'rifat darslari", subs: [{ id: "part", name: "Ishtirok", pts: 6 }, { id: "act", name: "Faollik", pts: 4 }] },
        { id: "public", n: 8, name: "Jamoat ishlaridagi faolligi", who: "ref", max: 5, mode: "any", doc: "Ma'lumotnoma", hint: "Volontyorlik", photos: 2, fields: [{ k: "title", label: "Tadbir nomi", req: true }, { k: "place", label: "Joyi", req: true }, { k: "date", label: "Sana", type: "date", req: true }, { k: "role", label: "Ishtirok turi", type: "select", opts: ["O'z tashabbusi", "Faol ishtiroki"], req: true }], subs: [{ id: "vol", name: "Volontyorlik", pts: 5 }, { id: "ev", name: "Tadbirlar", pts: 5 }] },
        { id: "culture", n: 9, name: "Madaniy tashriflari", who: "ref", max: 5, mode: "freq", doc: "Suratli hisobot", hint: "Teatr, muzey, xiyobonlar", photos: 2, fields: [{ k: "place", label: "Tashrif joyi", req: true }, { k: "date", label: "Sana", type: "date", req: true }], subs: [{ id: "visit", name: "Madaniy tashrif", pts: 0 }] },
        { id: "sport", n: 10, name: "Sport bilan shug'ullanishi", who: "student", max: 5, mode: "sum", doc: "Sport hujjati", hint: "Seksiyalar va musobaqalar", subs: [{ id: "team", name: "Terma jamoa", pts: 5 }, { id: "reg", name: "Muntazam sport", pts: 3 }] },
        { id: "spirit", n: 11, name: "Boshqa ma'naviy faolligi", who: "ref", max: 5, mode: "sum", doc: "Ma'lumotnoma", hint: "Ma'naviy loyihalar", photos: 2, fields: [{ k: "title", label: "Loyiha nomi", req: true }, { k: "place", label: "Joyi", req: true }, { k: "date", label: "Sana", type: "date", req: true }], subs: [{ id: "partner", name: "Hamkor tashkilot bilan tadbir", pts: 3 }, { id: "org", name: "Faol tashkilotchilik", pts: 1 }] }
      ],
      gpaT: [[5, 10], [4.5, 8.3], [4, 6.7], [3.5, 5]],
      attT: [["0–10 soat", 5], ["11–15 soat", 4], ["16–25 soat", 3], ["26–30 soat", 2], ["31+", 0]],
      gradeT: [[86, 5, "A'lo"], [71, 4, "Yaxshi"], [55, 3, "Qoniqarli"], [0, 2, "Qoniqarsiz"]],
      levels: [[80, "A'lo daraja", "Grant olish imkoniyati eng yuqori"], [60, "Yaxshi daraja", "Grant bo‘yicha raqobatbardosh"], [40, "O'rta daraja", "Kontraktda qolish ehtimoli yuqori"], [0, "Quyi daraja", "Quyi ko'rsatkich"]],
      eventIfi: {},
      hoursPerPair: 2
    },
    notifs: [
      { id: "n1", title: "RIAT-Univerlife platformasiga xush kelibsiz", body: "RIAT-Study, RIAT-Parents va RIAT-Ijtimoiy bitta markaziy sahifaga birlashtirildi.", link: "#/home", created: Date.now() - 3600000, read: 0 }
    ],
    unread: 1,
    events: ldb.events.length ? ldb.events : (seed.events || []),
    clubs: ldb.clubs.length ? ldb.clubs.map(c => ({ ...c, members: 12 })) : (seed.clubs || []).map(c => ({ ...c, members: 12 })),
    scholarships: seed.scholarships || [],
    articles: seed.articles || []
  };

  if (!meUser) return base;

  // Student specific full object
  const userEntries = ldb.entries.filter(e => e.login === meUser.login);
  const stObject = {
    login: meUser.login,
    name: meUser.name,
    surname: meUser.surname,
    grp: meUser.grp,
    faculty: meUser.faculty,
    absH: 4,
    att: {
      rate: 96,
      held: 48,
      late: 1,
      excused: 0,
      marks: ldb.attMarks.filter(m => m.login === meUser.login),
      todayPairs: 3,
      todayDone: [1, 2],
      today: []
    },
    acad: {
      gpa: 4.82,
      year: "2025–2026",
      sems: [
        {
          sem: "1-semestr",
          gpa: 4.80,
          credits: 30,
          subjects: [
            { subject: "Iqtisodiy tahlil", credits: 6, score: 92, grade: 5 },
            { subject: "Axborot tizimlari", credits: 6, score: 90, grade: 5 },
            { subject: "Ekonometrika", credits: 6, score: 84, grade: 4 },
            { subject: "Moliyaviy menejment", credits: 6, score: 95, grade: 5 },
            { subject: "Akademik ingliz tili", credits: 6, score: 88, grade: 5 }
          ]
        }
      ],
      current: [
        { subject: "Sun'iy intellekt asoslari", credits: 6 },
        { subject: "Katta hajmli ma'lumotlar tahlili", credits: 6 },
        { subject: "Raqamli iqtisodiyot strategiyalari", credits: 6 }
      ]
    },
    ifi: {
      total: 82.5,
      level: "A'lo daraja",
      v: { acad: 9.3, att: 5, read: 20, club: 20, contest: 9, public: 5, culture: 5, sport: 5, conduct: 4.2 }
    },
    rank: {
      ifi: { grp: { pos: 1, of: 26 }, fac: { pos: 3, of: 240 }, all: { pos: 8, of: 1200 } },
      gpa: { grp: { pos: 2, of: 26 }, fac: { pos: 5, of: 240 }, all: { pos: 12, of: 1200 } }
    },
    entries: userEntries,
    canScore: true,
    explanations: ldb.explanations.filter(x => x.login === meUser.login),
    notes: ldb.notes.filter(n => n.login === meUser.login),
    clubs: [{ id: "c1", name: "Sun'iy intellekt to'garagi", status: "qabul" }]
  };

  // Always provide a default st and schedule for fallback preview across all roles
  base.st = stObject;
  base.schedule = [];
  base.board = [
    { pos: 1, login: "sardor.alisherov", name: "Sardor Alisherov", grp: meUser.grp || "AT-900/26", gpa: 4.85, ifi: 86.4 },
    { pos: 2, login: meUser.login, name: meUser.name + " " + meUser.surname, grp: meUser.grp || "AT-900/26", gpa: 4.82, ifi: 82.5 },
    { pos: 3, login: "nodir.vali", name: "Nodir Valiyev", grp: meUser.grp || "AT-900/26", gpa: 4.60, ifi: 74.0 },
    { pos: 4, login: "dilshod.k", name: "Dilshod Karimov", grp: meUser.grp || "AT-900/26", gpa: 4.45, ifi: 68.5 }
  ];

  if (meUser.role === "student") {
    // Already set defaults
  } else if (meUser.role === "parent") {
    base.kids = [
      {
        ...stObject,
        schedule: []
      }
    ];
  } else if (meUser.role === "tutor") {
    base.groups = ["AT-900/26", "IB-900/26", "II-900/26", "RST-81/25"];
    base.students = [
      { login: "sardor.alisherov", name: "Sardor Alisherov", grp: "AT-900/26", gpa: 4.85, ifi: 86.4, absH: 2, level: "A'lo daraja" },
      { login: "jasur.bek", name: "Jasur Bekmirzayev", grp: "AT-900/26", gpa: 4.62, ifi: 76.0, absH: 6, level: "Yaxshi daraja" },
      { login: "malika.t", name: "Malika Tursunova", grp: "IB-900/26", gpa: 4.90, ifi: 91.2, absH: 0, level: "A'lo daraja" }
    ];
    base.queue = ldb.entries.filter(e => e.status === "kutilmoqda");
    base.explanations = ldb.explanations;
    base.schedules = {};
    base.marked = {};
  } else if (meUser.role === "dean" || meUser.role === "admin") {
    base.students = [
      { login: "sardor.alisherov", name: "Sardor Alisherov", grp: "AT-900/26", gpa: 4.85, ifi: 86.4, absH: 2, level: "A'lo daraja" },
      { login: "malika.t", name: "Malika Tursunova", grp: "IB-900/26", gpa: 4.90, ifi: 91.2, absH: 0, level: "A'lo daraja" },
      { login: "oybek.r", name: "Oybek Rahimov", grp: "II-900/26", gpa: 4.40, ifi: 65.0, absH: 14, level: "O'rta daraja" }
    ];
    base.tutors = [
      { login: "tyutor.demo", name: "Farhod Karimov", phone: "+998 90 123 45 67", groups: ["AT-900/26", "IB-900/26"] }
    ];
    base.groups = [
      { grp: "AT-900/26", tutor: "Farhod Karimov", count: 26, avgGpa: 4.45, avgIfi: 72.4 },
      { grp: "IB-900/26", tutor: "Farhod Karimov", count: 24, avgGpa: 4.52, avgIfi: 76.1 }
    ];
    base.users = ldb.users.length ? ldb.users : (seed.users || []);
  } else if (meUser.role === "club") {
    base.myClubs = [
      { id: "c1", name: "Sun'iy intellekt to'garagi", members: [] }
    ];
  }

  return base;
}

/* Standalone API interceptor */
async function localApiHandler(action, data) {
  const ldb = getLocalDb();
  if (action === "state") {
    return { ok: true, state: S };
  }
  if (action === "login") {
    const lg = String(data.login || "").trim().toLowerCase();
    let found = (ldb.users || []).find(u => u.login.toLowerCase() === lg);
    if (!found) {
      if (lg === "monarch" || lg === "antigravity" || lg === "admin") {
        found = { login: lg, name: lg.toUpperCase(), surname: "Admin", role: "admin", university: "TDIU", faculty: "Raqamli iqtisodiyot", grp: "AT-900/26" };
      } else if (lg.includes("tyutor") || lg.includes("tutor")) {
        found = { login: lg, name: "Farhod", surname: "Karimov", role: "tutor", university: "TDIU", faculty: "Raqamli iqtisodiyot", grp: "-" };
      } else if (lg.includes("ota") || lg.includes("parent")) {
        found = { login: lg, name: "Alisher", surname: "Alisherov", role: "parent", university: "TDIU", faculty: "Raqamli iqtisodiyot", grp: "-" };
      } else if (lg.includes("dekan")) {
        found = { login: lg, name: "Dekanat", surname: "Mas'uli", role: "dean", university: "TDIU", faculty: "Raqamli iqtisodiyot", grp: "-" };
      } else {
        found = { login: lg, name: lg.split(".")[0] || "Talaba", surname: lg.split(".")[1] || "TDIU", role: "student", university: "TDIU", faculty: "Raqamli iqtisodiyot", grp: "AT-900/26" };
      }
    }
    const meUser = {
      login: found.login,
      name: found.name,
      surname: found.surname || "",
      role: found.role || "student",
      roleName: found.role === "admin" ? "Administrator" : found.role === "tutor" ? "Tyutor" : found.role === "parent" ? "Ota-ona" : found.role === "dean" ? "Dekanat" : "Talaba",
      grp: found.grp || "AT-900/26",
      faculty: found.faculty || "Raqamli iqtisodiyot",
      phone: found.phone || "+998 90 000 00 00",
      jshir: found.jshir || "30101010000000"
    };
    S = buildLocalState(meUser);
    try {
      localStorage.setItem("riat_user", JSON.stringify(meUser));
    } catch(e) {}
    return { ok: true, msg: "Xush kelibsiz, " + meUser.name, state: S };
  }

  if (action === "logout") {
    try { localStorage.removeItem("riat_user"); } catch(e) {}
    S = buildLocalState(null);
    return { ok: true, msg: "Tizimdan chiqildi", state: S };
  }

  if (action === "ifiAdd") {
    const newEntry = {
      id: "e_" + Date.now(),
      login: S.me ? S.me.login : "talaba",
      crit: data.crit,
      critName: "IFI " + data.crit,
      sub: data.sub,
      subName: "Band " + data.sub,
      n: 1,
      fields: data.fields || {},
      files: data.files || [],
      note: data.note || "",
      status: "kutilmoqda",
      date: today(),
      created: Date.now()
    };
    ldb.entries.unshift(newEntry);
    saveLocalDb(ldb);
    S = buildLocalState(S.me);
    return { ok: true, msg: "Arizangiz muvaffaqiyatli topshirildi va tekshiruvga yuborildi", state: S };
  }

  if (action === "clubJoin") {
    toast(data.on ? "Klubga a'zo bo'lish uchun ariza yuborildi" : "Klub a'zoligi bekor qilindi");
    return { ok: true, msg: "Bajarildi" };
  }

  if (action === "apply") {
    toast(data.on ? "Stipendiyaga ariza yuborildi" : "Ariza qaytarib olindi");
    return { ok: true, msg: "Bajarildi" };
  }

  if (action === "eventRegister") {
    toast(data.on ? "Tadbirga ro'yxatdan o'tdingiz" : "Ro'yxatdan o'tish bekor qilindi");
    return { ok: true, msg: "Bajarildi" };
  }

  return { ok: true, msg: "Amal muvaffaqiyatli bajarildi", state: S };
}

/* Overwrite api() function to use localApiHandler */
api = async function(action, data, opt) {
  opt = opt || {};
  try {
    const res = await localApiHandler(action, data);
    if (res.state && !opt.noRender) render();
    if (res.msg && !opt.silent) toast(res.msg);
    return res;
  } catch(e) {
    if (!opt.silent) toast(e.message || "Xatolik yuz berdi", true);
    return null;
  }
};

(async function init() {
  $("#root").innerHTML = '<div style="display:grid;place-items:center;min-height:100vh;color:var(--muted)">Yuklanmoqda…</div>';
  
  // 1. Try SSO from localStorage.riat_user
  const ssoUser = bootFromEcosystem();
  if (ssoUser) {
    S = buildLocalState(ssoUser);
  } else {
    // Default to student demo Sardor Alisherov
    const defaultStudent = {
      login: "sardor.alisherov",
      name: "Sardor",
      surname: "Alisherov",
      role: "student",
      roleName: "Talaba",
      grp: "AT-900/26",
      faculty: "Raqamli iqtisodiyot",
      phone: "+998 90 123 45 67",
      jshir: "30101010000000"
    };
    S = buildLocalState(defaultStudent);
  }
  
  render();
})();
`;

js = js.replace(oldInitRegex, newInit);

// Write to final js file
fs.writeFileSync('/home/monarch/Projects/TSUE-Ecosystem/js/univerlife_engine.js', js);
console.log('Successfully re-generated /home/monarch/Projects/TSUE-Ecosystem/js/univerlife_engine.js');
