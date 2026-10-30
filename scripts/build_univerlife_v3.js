const fs = require('fs');
const path = require('path');

console.log('Regenerating Univerlife v3 Client Bundle & Engine with full domain constants...');

const frontendDir = '/home/monarch/Downloads/Telegram Desktop/univerlife (1)/univerlife/public/js';

// Order of frontend modules
const frontendModules = [
  'core/store.js',
  'core/format.js',
  'core/icons.js',
  'core/ui.js',
  'core/viz.js',
  'pages/login.js',
  'pages/common.js',
  'pages/shared.js',
  'pages/profile.js',
  'pages/requests.js',
  'pages/student.js',
  'pages/parent.js',
  'pages/tutor.js',
  'pages/dean.js',
  'pages/admin.js',
  'pages/club.js',
  'core/router.js',
  'handlers/files.js',
  'handlers/forms.js',
  'handlers/clicks.js'
];

let concatenatedFrontend = '';
for (const rel of frontendModules) {
  let c = fs.readFileSync(path.join(frontendDir, rel), 'utf8');
  // strip all imports
  c = c.replace(/import\s+[\s\S]*?from\s+['\"][^'\"]+['\"];?\s*/g, '');
  c = c.replace(/import\s+['\"][^'\"]+['\"];?\s*/g, '');
  // strip all exports
  c = c.replace(/export\s+(?:default\s+)?/g, '');
  concatenatedFrontend += '\n// ==================== ' + rel + ' ====================\n' + c;
}

// Ensure brand link points to /ecosystem and has TSUE branding
concatenatedFrontend = concatenatedFrontend.replace(
  /<div class="brand"><i>U<\/i>UniverLife<\/div>/g,
  '<a href="/ecosystem" class="brand" title="Ekotizim bosh sahifasiga o‘tish"><div class="riat-badge" style="background:#003B81;color:#fff;font-weight:900;font-size:11px;padding:2px 7px;border-radius:6px;margin-right:6px">TSUE</div><span>UniverLife</span></a>'
);

// Add top header controls (language & theme switcher)
concatenatedFrontend = concatenatedFrontend.replace(
  '<header class="top"><h1>\' + esc(title) + \'</h1>',
  '<header class="top"><a href="/ecosystem" class="top-back-btn" title="Ekotizimga qaytish" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;margin-right:10px;border-radius:8px;background:var(--soft);color:var(--pri);font-weight:700;font-size:13px;border:1px solid var(--line2)"><i class="fa-solid fa-arrow-left"></i> <span>Ekotizim</span></a><h1>\' + esc(title) + \'</h1><div class="top-controls-group" style="display:flex;align-items:center;gap:6px;margin-right:10px"><button type="button" class="top-theme-btn" data-act="toggle-theme" title="Theme" style="width:36px;height:36px;border-radius:9px;border:1px solid var(--line);background:var(--card);cursor:pointer;display:grid;place-items:center;color:var(--ink2)"><i class="fa-solid fa-circle-half-stroke"></i></button></div>'
);

// Unified SSO: If not authenticated, redirect directly to Ecosystem central auth (/auth) instead of showing internal login screen
concatenatedFrontend = concatenatedFrontend.replace(
  'root.innerHTML = viewLogin();',
  'window.location.href = "/auth";'
);

// Unified SSO: On logout button click in UI, clear session and redirect to /auth
concatenatedFrontend = concatenatedFrontend.replace(
  'if (a === "logout") { closeSheet(); await api("logout"); ui.CARD = null; ui.ATT = null; ui.PF = null; ui.PFEDIT = false; location.hash = "#/home"; return; }',
  'if (a === "logout") { closeSheet(); try { localStorage.removeItem("riat_user"); localStorage.removeItem("tsue_user"); } catch(e){} window.location.href = "/auth"; return; }'
);


// Build engine code with exact CRIT, PROFILE, SOCIAL, SPRAVKA_KINDS, DORM_REASONS, EX_REASONS, ROLE_LABEL, PAIRS, etc.
const engineCode = `
// ==========================================
// TSUE UNIVERLIFE V3 MOCK ENGINE & ADAPTER
// ==========================================

const ROLE_LABEL = { student: "Talaba", parent: "Ota-ona", tutor: "Tyutor", dean: "Dekanat", admin: "Administrator", club: "Klub rahbari" };
const PAIRS = { 1: "08:30–09:50", 2: "10:00–11:20", 3: "11:30–12:50", 4: "13:30–14:50", 5: "15:00–16:20", 6: "16:30–17:50" };

const CRIT = [
  { id: "read", n: 1, name: "Kitobxonlik madaniyati", who: "student", max: 20, mode: "one", doc: "Kitobxonlik madaniyati bo'yicha test natijalari qayd etilgan vedomost",
    hint: "O'quv yili davomida o'qilgan badiiy adabiyotlar soni. Faqat bitta band hisoblanadi.", future: "To'liq versiyada test natijasi HEMIS'dan avtomatik olinadi",
    subs: [{ id: "b10", name: "Badiiy adabiyot: 10–12 ta", pts: 20 }, { id: "b7", name: "Badiiy adabiyot: 7–9 ta", pts: 15 }, { id: "b4", name: "Badiiy adabiyot: 4–6 ta", pts: 10 }] },
  { id: "club", n: 2, name: "To'garaklarda ishtiroki", who: "student", max: 20, mode: "sum", doc: "Klub va to'garak mas'ullari tasdiqlagan ro'yxat yoki to'garak rahbarining ma'lumotnomasi",
    hint: "Har bir yo'nalishdagi to'garak 10 ball, to'garak tashkil etish 20 ball. Platformadagi klubga qabul qilinsangiz, ariza o'zi yaratiladi.",
    subs: [{ id: "t5", name: "OTM 5 tashabbus to'garaklari", pts: 10 }, { id: "art", name: "Madaniyat va san'at to'garaklari", pts: 10 }, { id: "sport", name: "Sport seksiyalari va to'garaklari", pts: 10 },
      { id: "it", name: "Axborot texnologiyalari to'garaklari", pts: 10 }, { id: "lit", name: "Kitobxonlik va adabiyot to'garaklari", pts: 10 }, { id: "job", name: "Bandlik to'garaklari", pts: 10 },
      { id: "org", name: "Talaba to'garak tashkil etganligi", pts: 20 }] },
  { id: "acad", n: 3, name: "Akademik o'zlashtirish", who: "hemis", max: 10, mode: "sys", doc: "", hint: "GPA asosida: 5.0 — 10 ball, 4.5 — 8.3 ball, 4.0 — 6.7 ball, 3.5 — 5 ball, 3.5 dan past — 0.", subs: [] },
  { id: "conduct", n: 4, name: "Xulqi va odob-axloqi", who: "tutor", max: 5, mode: "sum", doc: "",
    hint: "O'quv yili davomida Odob-axloq kodeksi asosida dekan muovini va tyutor baholaydi.", subs: [{ id: "dress", name: "Kiyinish madaniyati", pts: 2 }, { id: "code", name: "Odob-axloq kodeksiga rioya", pts: 3 }] },
  { id: "contest", n: 5, name: "Tanlov va musobaqalar", who: "ref", max: 10, mode: "best", doc: "5-band ma'lumotnomasi: diplom yoki sertifikat, kamida 2 ta rasm",
    hint: "Xalqaro, respublika, viloyat va muassasa miqyosidagi ko'rik-tanlov, fan olimpiadasi va sport musobaqalari. Eng yuqori natija hisoblanadi.", photos: 2,
    fields: [{ k: "title", label: "Ko'rik-tanlov, olimpiada yoki musobaqa nomi", req: true }, { k: "place", label: "O'tkazilgan joyi", req: true }, { k: "date", label: "O'tkazilgan sanasi", type: "date", req: true }],
    subs: [{ id: "x1", name: "Xalqaro darajada — 1-o'rin", pts: 10 }, { id: "x2", name: "Xalqaro darajada — 2-o'rin", pts: 10 }, { id: "x3", name: "Xalqaro darajada — 3-o'rin", pts: 10 },
      { id: "r1", name: "Respublika darajasi — 1-o'rin", pts: 9 }, { id: "r2", name: "Respublika darajasi — 2-o'rin", pts: 8 }, { id: "r3", name: "Respublika darajasi — 3-o'rin", pts: 7 },
      { id: "v1", name: "Viloyat darajasi — 1-o'rin", pts: 6 }, { id: "v2", name: "Viloyat darajasi — 2-o'rin", pts: 5 }, { id: "v3", name: "Viloyat darajasi — 3-o'rin", pts: 4 },
      { id: "m1", name: "Muassasa darajasi — 1-o'rin", pts: 3 }, { id: "m2", name: "Muassasa darajasi — 2-o'rin", pts: 2 }, { id: "m3", name: "Muassasa darajasi — 3-o'rin", pts: 1 }] },
  { id: "att", n: 6, name: "Darslarga qatnashishi", who: "hemis", max: 5, mode: "sys", doc: "", hint: "Semestrda sababsiz qoldirilgan soatlar: 0–10 — 5, 11–15 — 4, 16–25 — 3, 26–30 — 2, 31 va undan ko'p — 0 ball.", subs: [] },
  { id: "enlight", n: 7, name: "Ma'rifat darsida ishtiroki", who: "tutor", max: 10, mode: "enlight", doc: "",
    hint: "Ishtirok (6 ball) Ma'rifat darslarida QR-kod bilan qayd etilgan davomatdan hisoblanadi, faollikni (4 ball) tyutor baholaydi.",
    subs: [{ id: "part", name: "Ma'rifat darslaridagi ishtiroki", pts: 6 }, { id: "act", name: "Ma'rifat darslaridagi faolligi", pts: 4 }] },
  { id: "public", n: 8, name: "Jamoat ishlaridagi faolligi", who: "ref", max: 5, mode: "any", doc: "8-band ma'lumotnomasi: kamida 2 ta rasm",
    hint: "Volontyorlik va jamoat ishlari. Talaba ma'lumotnomani to'ldiradi, tyutor baholaydi. Bitta tasdiqlangan faoliyat 5 ball.", photos: 2,
    fields: [{ k: "title", label: "Tadbir nomi", req: true }, { k: "place", label: "O'tkazilgan joyi", req: true }, { k: "date", label: "O'tkazilgan sanasi", type: "date", req: true },
      { k: "role", label: "Tadbirdagi ishtiroki", type: "select", opts: ["O'z tashabbusi", "Faol ishtiroki"], req: true }],
    subs: [{ id: "ev", name: "Ma'naviy-ma'rifiy tadbirlar", pts: 5 }, { id: "holiday", name: "Umumxalq bayramlari", pts: 5 }, { id: "hashar", name: "Umumxalq hasharlari", pts: 5 },
      { id: "otm", name: "OTM jamoatchilik ishlari", pts: 5 }, { id: "vol", name: "Volontyorlik faoliyati", pts: 5 }] },
  { id: "culture", n: 9, name: "Madaniy tashriflari", who: "ref", max: 5, mode: "freq", doc: "9-band ma'lumotnomasi: kamida 2 ta rasm",
    hint: "Teatr, muzey, xiyobon, kino, tarixiy qadamjolarga tashriflar. Har oyda kamida bir marta — 5, ikki oyda bir marta — 3, semestrda bir marta — 1 ball.", photos: 2,
    fields: [{ k: "place", label: "Tashrif joyi", req: true }, { k: "date", label: "Tashrif sanasi", type: "date", req: true }, { k: "link", label: "Havola (ixtiyoriy)", type: "url" }],
    subs: [{ id: "visit", name: "Madaniy tashrif", pts: 0 }] },
  { id: "sport", n: 10, name: "Sport bilan shug'ullanishi", who: "student", max: 5, mode: "sum", doc: "Terma jamoa a'zoligi, sport seksiyasi yoki musobaqa ishtiroki haqida hujjat",
    hint: "Terma jamoa a'zoligi, muntazam mashg'ulotlar, musobaqalarda ishtirok va sog'lom turmush tarzi. Jami 5 balldan oshmaydi.",
    subs: [{ id: "team", name: "Terma jamoa a'zosi", pts: 5 }, { id: "reg", name: "Muntazam sport bilan shug'ullanadi", pts: 3 }, { id: "health", name: "Sog'lom turmush tarzi", pts: 2 }, { id: "comp", name: "Musobaqalarda ishtirok", pts: 1 }] },
  { id: "spirit", n: 11, name: "Boshqa ma'naviy faolligi", who: "ref", max: 5, mode: "sum", doc: "11-band ma'lumotnomasi: kamida 2 ta rasm",
    hint: "Ma'naviy-ma'rifiy sohaga oid boshqa yo'nalishlardagi faollik. Talaba ma'lumotnoma tayyorlaydi, tyutor baholaydi.", photos: 2,
    fields: [{ k: "title", label: "Ma'naviy-ma'rifiy tadbir nomi", req: true }, { k: "place", label: "O'tkazilgan joyi", req: true }, { k: "date", label: "O'tkazilgan sanasi", type: "date", req: true }, { k: "link", label: "Havola (ixtiyoriy)", type: "url" }],
    subs: [{ id: "partner", name: "Hamkor tashkilotlar bilan hamkorlikda o'z tashabbusi", pts: 3 }, { id: "alley", name: "Xiyobonlarda ma'naviy-ma'rifiy tadbirlar tashkil etishi", pts: 2 }, { id: "org", name: "Tadbirlar tashkil etishdagi faol ishtiroki", pts: 1 }] }
];

const critById = (id) => CRIT.find((c) => c.id === id);
const subOf = (c, id) => c?.subs?.find((s) => s.id === id);

const PROFILE = [
  { id: "me", title: "Shaxsiy ma'lumotlar", icon: "user", fields: [
    { k: "photo", label: "Rasm (3×4)", type: "file", img: true },
    { k: "fio", label: "F.I.Sh.", type: "auto" },
    { k: "course", label: "Kurs va guruh", type: "auto" },
    { k: "direction", label: "Ta'lim yo'nalishi", type: "auto" },
    { k: "citizenship", label: "Fuqarolik", type: "select", req: true, opts: ["O'zbekiston", "Boshqa davlat", "Fuqaroligi yo'q"] },
    { k: "country", label: "Davlat", type: "text", req: true, ph: "O'zbekiston" },
    { k: "eduForm", label: "Ta'lim shakli", type: "select", req: true, opts: ["Kunduzgi", "Sirtqi", "Kechki", "Masofaviy"] },
    { k: "eduLang", label: "Ta'lim tili", type: "select", req: true, opts: ["O'zbek", "Rus", "Qoraqalpoq", "Ingliz"] },
    { k: "phone", label: "Telefon", type: "tel", req: true, ph: "+998 90 123 45 67", re: "^[+0-9 ()-]{9,20}$", reMsg: "Telefon raqamini to'g'ri yozing" },
    { k: "birth", label: "Tug'ilgan sana", type: "date", req: true },
    { k: "gender", label: "Jinsi", type: "select", req: true, opts: ["Erkak", "Ayol"] },
    { k: "nation", label: "Millati", type: "text", req: true },
    { k: "passport", label: "Pasport seriya va raqami", type: "text", req: true, ph: "AA1234567", re: "^[A-Za-z]{2} ?[0-9]{7}$", reMsg: "Pasport: 2 harf va 7 raqam (AA1234567)" },
    { k: "jshir", label: "JSHSHIR", type: "text", req: true, ph: "14 ta raqam", re: "^[0-9]{14}$", reMsg: "JSHSHIR 14 ta raqamdan iborat" },
    { k: "birthPlace", label: "Tug'ilgan joyi", type: "text", req: true, ph: "Viloyat, tuman" },
  ] },
  { id: "home", title: "Yashash joyi", icon: "home", fields: [
    { k: "address", label: "Doimiy yashash manzili", type: "textarea", req: true, wide: true, ph: "Viloyat, tuman, MFY, ko'cha, uy" },
    { k: "tempType", label: "Hozir qayerda yashaydi", type: "select", req: true, opts: ["O'z uyi", "TTJ", "Ijara", "Qarindoshi yoki tanishining uyi"] },
    { k: "tempAddress", label: "Vaqtinchalik manzil", type: "textarea", wide: true, ph: "Toshkent shahri, tuman, ko'cha, uy", when: ["tempType", ["TTJ", "Ijara", "Qarindoshi yoki tanishining uyi"]] },
  ] },
  { id: "edu", title: "Ta'lim va ish", icon: "cap", fields: [
    { k: "school", label: "Bitirgan yili va joyi", type: "text", req: true, wide: true, ph: "2025, Urganch tumani 45-maktab" },
    { k: "diploma", label: "Diplom / attestat raqami", type: "text", req: true, ph: "UM № 01234567" },
    { k: "job", label: "Ish joyi", type: "text", ph: "Ishlamaydi" },
    { k: "jobPhone", label: "Ish telefoni", type: "tel" },
  ] },
  { id: "family", title: "Oila", icon: "users", fields: [
    { k: "fatherName", label: "Otasining F.I.Sh.", type: "text" },
    { k: "fatherJob", label: "Otasining ish joyi", type: "text" },
    { k: "fatherPhone", label: "Otasining telefoni", type: "tel" },
    { k: "motherName", label: "Onasining F.I.Sh.", type: "text" },
    { k: "motherJob", label: "Onasining ish joyi", type: "text" },
    { k: "motherPhone", label: "Onasining telefoni", type: "tel" },
    { k: "parentsAddress", label: "Ota-onasining doimiy manzili", type: "textarea", req: true, wide: true },
  ] },
  { id: "win", title: "Yutuqlar va qiziqishlar", icon: "trophy", fields: [
    { k: "certs", label: "Til yoki IT sertifikatlari", type: "textarea", ph: "IELTS 6.5 (2025), Milliy sertifikat: Matematika B+", hint: "yo'q bo'lsa bo'sh qoldiring" },
    { k: "certsFiles", label: "Sertifikat nusxasi", type: "file" },
    { k: "awards", label: "Davlat mukofotlari", type: "textarea" },
    { k: "awardsFiles", label: "Mukofot hujjati", type: "file" },
    { k: "olymp", label: "Olimpiada g'olibligi", type: "textarea", ph: "Xalqaro, respublika yoki OTM olimpiadasi" },
    { k: "olympFiles", label: "Olimpiada diplomi", type: "file" },
    { k: "contests", label: "Tanlov g'olibligi", type: "textarea" },
    { k: "contestsFiles", label: "Tanlov diplomi", type: "file" },
    { k: "interests", label: "Qiziqishlari", type: "text", wide: true, ph: "Stol tennisi, IT, kitob" },
  ] },
];

const ALL_FIELDS = PROFILE.flatMap((s) => s.fields);
const PROFILE_STATUS = ["so'ralgan", "qoralama", "yuborilgan", "qaytarilgan", "tasdiqlangan"];

const SOCIAL = [
  { id: "chin_yetim", name: "Chin yetim", doc: true },
  { id: "boquvchi", name: "Boquvchisini yo'qotgan", doc: true },
  { id: "nogiron", name: "Nogironligi bor", doc: true },
  { id: "reestr", name: "Ijtimoiy himoya reyestrida", doc: true },
  { id: "kam", name: "Kam ta'minlangan oila", doc: true },
  { id: "sport", name: "Sportchi", doc: false },
  { id: "faol", name: "Ijtimoiy faol", doc: false },
];
const socialName = (id) => SOCIAL.find((s) => s.id === id)?.name || id;

const isFieldFilled = (f, v) => (f.type === "file" ? Array.isArray(v) && v.length > 0 : String(v ?? "").trim() !== "");
const isFieldRequired = (f, data) => {
  if (f.req) return true;
  if (f.when && Array.isArray(f.when) && f.when.length >= 2) {
    const parentVal = data && typeof data === "object" ? String(data[f.when[0]] ?? "") : "";
    return Array.isArray(f.when[1]) ? f.when[1].includes(parentVal) : false;
  }
  return false;
};

function progress(data) {
  const d = data && typeof data === "object" ? data : {};
  const R = ALL_FIELDS.filter((f) => f.type !== "auto" && isFieldRequired(f, d));
  const ok = R.filter((f) => isFieldFilled(f, d[f.k])).length;
  return { ok, of: R.length, pct: R.length ? Math.round((ok / R.length) * 100) : 100, missing: R.filter((f) => !isFieldFilled(f, d[f.k])).map((f) => f.label) };
}

const SPRAVKA_KINDS = [
  { id: "kasallik", name: "Kasallik (tibbiy ma'lumotnoma)" },
  { id: "oilaviy", name: "Oilaviy sabab" },
  { id: "tadbir", name: "Tadbir yoki musobaqa" },
  { id: "boshqa", name: "Boshqa" },
];
const MAX_SPRAVKA_DAYS = 31;

const DORM_REASONS = [
  { id: "uzoq", name: "Uzoq viloyatdan" },
  { id: "ijara", name: "Ijara qimmat yoki topilmadi" },
  { id: "oilaviy", name: "Oilaviy sharoit" },
  { id: "boshqa", name: "Boshqa" },
];

const DORM_FLOW = ["ota-onada", "tyutorda", "tasdiqlandi"];
const EX_REASONS = ["Darsga sababsiz kelmagan", "Darsga kechikib kelgan", "Ma'rifat darsiga kelmagan", "Kiyinish qoidasiga rioya qilmagan", "Tadbirga kelmagan"];

const DB_STORAGE_KEY = "tsue_univerlife_v3_local_db";

function getLocalDb() {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  const seed = window.__UNIVERLIFE_SEED__ || {};
  return {
    users: seed.users || [],
    hemis_subjects: seed.hemis_subjects || [],
    edu_schedule: seed.edu_schedule || [],
    att_marks: seed.att_marks || [],
    att_days: seed.att_days || [],
    explanations: seed.explanations || [],
    notifications: seed.notifications || [],
    clubs: seed.clubs || [],
    club_members: seed.club_members || [],
    events: seed.events || [],
    event_regs: seed.event_regs || [],
    ifi_entries: seed.ifi_entries || [],
    ifi_files: seed.ifi_files || [],
    checkin_sessions: seed.checkin_sessions || [],
    grant_quotas: seed.grant_quotas || [],
    discipline: seed.discipline || [],
    contracts: seed.contracts || [],
    profiles: seed.profiles || [],
    social_cats: seed.social_cats || [],
    spravkas: seed.spravkas || [],
    dorm_apps: seed.dorm_apps || [],
    event_photos: seed.event_photos || [],
    tutor_groups: seed.tutor_groups || [],
    parent_links: seed.parent_links || [],
    student_notes: seed.student_notes || [],
    items: seed.items || [],
    articles: seed.articles || [],
    scholarships: seed.scholarships || []
  };
}

function saveLocalDb(db) {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
  } catch(e) {
    console.error("Error saving local db:", e);
  }
}

// Domain constants & calculation engines
const GRANT_CONF = {
  gpaWeight: 16,
  ifiDivisor: 5,
  gpaMin: 3.5,
  penalty: 15,
  extraGpaMin: 4
};

const UNI_GRANT_LIST = [[3.9, 80], [3.8, 70], [3.7, 60], [3.6, 50], [3.5, 40], [3.4, 30], [3.3, 20]];

function uniGrantPctCalc(gpa) {
  if (gpa == null || gpa >= 4) return 0;
  const g = Math.floor(gpa * 100 + 1e-6) / 100;
  return (UNI_GRANT_LIST.find(([t]) => g >= t) || [0, 0])[1];
}

function grantScoreCalc(gpa, ifi) {
  return gpa == null ? null : Math.round((gpa * GRANT_CONF.gpaWeight + ifi / GRANT_CONF.ifiDivisor) * 10) / 10;
}

const cohortKeyFn = (r) => (r.faculty || "") + "|" + (r.direction || "") + "|" + (r.course || 0);

function grantRankingCalc(rows, quotas) {
  const out = {};
  const groups = {};
  for (const r of rows) (groups[cohortKeyFn(r)] ||= []).push(r);
  for (const [key, list] of Object.entries(groups)) {
    const q = quotas.find(x => cohortKeyFn(x) === key);
    const quota = { full: q?.full_n || 0, half: q?.half_n || 0 };
    const ranked = list.filter(r => r.gpa != null && r.gpa >= GRANT_CONF.gpaMin).sort((a, b) => (b.score || 0) - (a.score || 0) || (b.gpa || 0) - (a.gpa || 0));
    const cut = { full: quota.full ? ranked[quota.full - 1]?.score ?? null : null, half: quota.half ? ranked[quota.full + quota.half - 1]?.score ?? null : null };
    for (const r of list) {
      const i = ranked.indexOf(r);
      let outcome;
      if (r.gpa == null) outcome = "pending";
      else if (r.gpa < GRANT_CONF.gpaMin) outcome = "low";
      else if (!q) outcome = "noquota";
      else outcome = i < quota.full ? "full" : i < quota.full + quota.half ? "half" : "none";
      out[r.login] = { key, score: r.score, pos: i + 1, of: ranked.length, quota, outcome, uniPct: uniGrantPctCalc(r.gpa), extra: r.gpa != null && r.gpa >= GRANT_CONF.extraGpaMin, cut };
    }
  }
  return out;
}

const GRADE_TABLE = [[86, 5, "A'lo"], [71, 4, "Yaxshi"], [55, 3, "Qoniqarli"], [0, 2, "Qoniqarsiz"]];
const gradeOfVal = (score) => (GRADE_TABLE.find(g => score >= g[0]) || GRADE_TABLE[3])[1];
const round2 = (x) => Math.round(x * 100) / 100;

function gpaOfList(list) {
  const g = list.filter(x => x.grade != null);
  const credits = g.reduce((t, x) => t + x.credits, 0);
  return { gpa: credits ? round2(g.reduce((t, x) => t + x.grade * x.credits, 0) / credits) : null, credits };
}

function hemisAcademicCalc(db, logins) {
  const out = {};
  const year = "2026-2027";
  for (const lg of logins) out[lg] = { year, gpa: null, credits: 0, modules: [], prev: null, sems: [] };
  const rows = (db.hemis_subjects || []).filter(r => logins.includes(r.login));
  for (const r of rows) {
    const a = out[r.login];
    const sj = { subject: r.subject, credits: Number(r.credits), score: r.score == null ? null : Number(r.score), grade: r.score == null ? null : gradeOfVal(Number(r.score)) };
    if (r.sem && r.sem.startsWith(year)) {
      const n = Number(r.module) || 1;
      let m = a.modules.find(x => x.n === n);
      if (!m) { m = { n, ended: "", done: false, gpa: null, credits: 0, subjects: [] }; a.modules.push(m); }
      m.subjects.push(sj);
      if (r.ended && r.ended > m.ended) m.ended = r.ended;
      continue;
    }
    let semObj = a.sems.find(x => x.sem === r.sem);
    if (!semObj) { semObj = { sem: r.sem, gpa: 0, credits: 0, subjects: [] }; a.sems.push(semObj); }
    semObj.subjects.push(sj);
  }
  for (const lg of logins) {
    const a = out[lg];
    for (const m of a.modules) {
      m.done = m.subjects.length > 0 && m.subjects.every(x => x.grade != null);
      Object.assign(m, gpaOfList(m.subjects));
    }
    a.modules.sort((x, y) => x.n - y.n);
    const cur = gpaOfList(a.modules.filter(m => m.done).flatMap(m => m.subjects));
    a.gpa = cur.gpa;
    a.credits = cur.credits;
    for (const semObj of a.sems) {
      const g = gpaOfList(semObj.subjects);
      semObj.gpa = g.gpa || 0;
      semObj.credits = g.credits;
    }
    const years = [...new Set(a.sems.map(x => x.sem.split(" ")[0]))].sort();
    const py = years[years.length - 1];
    if (py) {
      const g = gpaOfList(a.sems.filter(x => x.sem.startsWith(py)).flatMap(x => x.subjects));
      a.prev = { year: py, gpa: g.gpa || 0 };
    }
    a.sems.reverse();
  }
  return out;
}

function hemisAbsenceCalc(db, logins) {
  const out = {};
  for (const l of logins) out[l] = 0;
  const start = "2026-09-01";
  const marks = (db.att_marks || []).filter(m => m.status === "kelmadi" && m.date >= start && logins.includes(m.login));
  for (const m of marks) {
    out[m.login] = (out[m.login] || 0) + 2; // 2 hours per pair
  }
  return out;
}

const subPointsMap = {
  b10: 20, b7: 15, b4: 10,
  t5: 10, art: 10, sport: 10, it: 10, lit: 10, job: 10, org: 20,
  dress: 2, code: 3,
  x1: 10, x2: 10, x3: 10, r1: 9, r2: 8, r3: 7, v1: 6, v2: 5, v3: 4, m1: 3, m2: 2, m3: 1,
  part: 6, act: 4,
  ev: 5, holiday: 5, hashar: 5, otm: 5, vol: 5,
  visit: 0,
  team: 5, reg: 3, health: 2, comp: 1,
  partner: 3, alley: 2
};

const round1 = (x) => Math.round(x * 10) / 10;
const GPA_SCALE = [[5, 10], [4.9, 9.7], [4.8, 9.3], [4.7, 9], [4.6, 8.7], [4.5, 8.3], [4.4, 8], [4.3, 7.7], [4.2, 7.3], [4.1, 7], [4, 6.7], [3.9, 6.3], [3.8, 6], [3.7, 5.7], [3.6, 5.3], [3.5, 5]];
const gpaPoints = (g) => { const x = Math.floor(g * 10 + 1e-6) / 10; for (const [t, p] of GPA_SCALE) if (x >= t) return p; return 0; };
const attPoints = (h) => (h <= 10 ? 5 : h <= 15 ? 4 : h <= 25 ? 3 : h <= 30 ? 2 : 0);
const ATT_T = [["0–10 soat", 5], ["11–15 soat", 4], ["16–25 soat", 3], ["26–30 soat", 2], ["31 soat va undan ko'p", 0]];
const EVENT_IFI = {
  "enlight.part": "7-band · Ma'rifat darsi (ishtirok)",
  "culture.visit": "9-band · Madaniy tashrif",
  "public.ev": "8-band · Ma'naviy-ma'rifiy tadbir",
  "public.holiday": "8-band · Umumxalq bayrami",
  "public.hashar": "8-band · Umumxalq hashari",
  "public.otm": "8-band · OTM jamoatchilik ishi",
  "public.vol": "8-band · Volontyorlik",
  "sport.comp": "10-band · Sport musobaqasida ishtirok",
  "spirit.partner": "11-band · Hamkor tashkilot bilan tadbir"
};
const LEVEL_LIST = [[80, "A'lo daraja"], [60, "Yaxshi daraja"], [40, "O'rta daraja"], [0, "Quyi daraja"]];
const levelOfScore = (t) => (LEVEL_LIST.find(l => t >= l[0]) || LEVEL_LIST[3])[1];

function cleanEntry(e) {
  let meta = {};
  try { meta = typeof e.meta === "string" ? JSON.parse(e.meta || "{}") : (e.meta || {}); } catch(err) {}
  const c = critById(e.crit), s = subOf(c, e.sub);
  return {
    id: e.id, login: e.login, crit: e.crit, n: c?.n || 0, critName: c?.name || e.crit, sub: e.sub, subName: s?.name || e.sub, pts: s?.pts ?? 0, source: e.source, ref: e.ref,
    files: meta.files || (e.file_id ? [e.file_id] : []), fields: meta.fields || {}, title: meta.title || "", note: e.note || "", status: e.status, comment: e.comment || "",
    date: e.date, created: e.created, by: e.rn ? (e.rn + " " + e.rs).trim() : "", flags: meta.flags || [], name: e.sn ? e.sn + " " + e.ss : undefined, grp: e.sg,
  };
}

function scoreAllEngine(db) {
  const semStart = "2026-09-01";
  const students = (db.users || []).filter(u => u.role === "student");
  const logins = students.map(s => s.login);
  const A = hemisAcademicCalc(db, logins);
  const H = hemisAbsenceCalc(db, logins);
  
  const pen = {};
  for (const d of (db.discipline || [])) pen[d.login] = (pen[d.login] || 0) + 1;
  
  const byUser = {};
  for (const e of (db.ifi_entries || []).filter(x => x.status === "tasdiqlandi")) {
    (byUser[e.login] ||= []).push(e);
  }
  
  const held = {};
  for (const e of (db.events || []).filter(x => x.ifi === "enlight.part" && x.date >= semStart)) {
    for (const g of String(e.groups || "").split(",").filter(Boolean)) held[g] = (held[g] || 0) + 1;
  }
  
  const went = {};
  for (const r of (db.event_regs || []).filter(x => x.attended == 1)) {
    went[r.login] = (went[r.login] || 0) + 1;
  }
  
  const S = {};
  for (const s of students) {
    const rows = byUser[s.login] || [];
    const v = {}, info = {};
    for (const c of CRIT) {
      const mine = rows.filter(r => r.crit === c.id);
      let x = 0;
      if (c.mode === "one" || c.mode === "best") x = Math.max(0, ...mine.map(r => subPointsMap[r.sub] || 0));
      else if (c.mode === "sum") x = [...new Set(mine.map(r => r.sub))].reduce((a, id) => a + (subPointsMap[id] || 0), 0);
      else if (c.mode === "any") x = mine.length ? 5 : 0;
      else if (c.mode === "freq") {
        const months = new Set(mine.filter(r => r.date >= semStart).map(r => String(r.date).slice(0, 7))).size;
        x = months >= 2 ? 5 : months >= 1 ? 3 : 0;
        info.culture = { months, need: 2 };
      } else if (c.mode === "enlight") {
        const h = held[s.grp] || 0, n = Math.min(went[s.login] || 0, h);
        const part = mine.some(r => r.sub === "part" && r.source === "tutor") ? 6 : (h ? round1((6 * n) / h) : 0);
        x = part + (mine.some(r => r.sub === "act") ? 4 : 0);
        info.enlight = { n, held: h, part };
      } else if (c.id === "acad") {
        const a = A[s.login], g = a.gpa ?? a.prev?.gpa ?? 0;
        x = gpaPoints(g);
        info.acad = { gpa: g, year: a.gpa != null ? a.year : (a.prev?.year || ""), basis: a.gpa != null ? "joriy" : "oldingi" };
      } else if (c.id === "att") {
        x = attPoints(H[s.login] || 0);
        info.att = { hours: H[s.login] || 0 };
      }
      v[c.id] = round1(Math.max(0, Math.min(c.max, x)));
    }
    const penalty = (pen[s.login] || 0) * GRANT_CONF.penalty;
    const total = round1(Math.max(0, Object.values(v).reduce((a, b) => a + b, 0) - penalty));
    S[s.login] = { total, v, info, level: levelOfScore(total), penalty };
  }
  
  const Q = db.grant_quotas || [];
  const G = grantRankingCalc(students.map(s => ({
    login: s.login, faculty: s.faculty, direction: s.direction, course: s.course, payType: s.pay_type,
    gpa: A[s.login].gpa, ifi: S[s.login].total, score: grantScoreCalc(A[s.login].gpa, S[s.login].total)
  })), Q);
  
  return { S, A, H, G, Q, st: students };
}

function ranksEngine(K, login) {
  const me = K.st.find(s => s.login === login);
  if (!me) return null;
  const rank = (list, val) => ({ pos: 1 + list.filter(s => val(s) > val(me)).length, of: list.length });
  const grp = K.st.filter(s => s.grp === me.grp), fac = K.st.filter(s => s.faculty === me.faculty);
  const ifi = s => K.S[s.login]?.total || 0, gpa = s => K.A[s.login]?.gpa ?? -1;
  return { ifi: { grp: rank(grp, ifi), fac: rank(fac, ifi), all: rank(K.st, ifi) }, gpa: { grp: rank(grp, gpa), fac: rank(fac, gpa), all: rank(K.st, gpa) } };
}

function studentFullEngine(db, K, st, viewer) {
  const semStart = "2026-09-01";
  const marks = (db.att_marks || []).filter(m => m.login === st.login && m.date >= semStart);
  const daysList = (db.att_days || []).filter(d => d.grp === st.grp && d.date >= semStart);
  const heldPairs = daysList.length;
  const heldDays = new Set(daysList.map(d => d.date)).size;
  const miss = marks.filter(m => m.status === "kelmadi").length;
  const excused = marks.filter(m => m.status === "sababli").length;
  const rate = heldPairs ? Math.round(((heldPairs - miss) / heldPairs) * 100) : 100;
  
  const todayStr = today();
  const todayMarks = marks.filter(m => m.date === todayStr);
  const todayDone = (db.att_days || []).filter(d => d.grp === st.grp && d.date === todayStr).map(d => d.pair);
  const todaySchedule = (db.edu_schedule || []).filter(s => s.grp === st.grp && s.day === isoDay(todayStr));
  
  const tutGroup = (db.tutor_groups || []).find(g => g.grp === st.grp);
  const tutorUser = tutGroup ? (db.users || []).find(u => u.login === tutGroup.tutor_login) : null;
  const tutors = tutorUser ? [{ login: tutorUser.login, name: tutorUser.name + " " + tutorUser.surname, phone: tutorUser.phone || "" }] : [];
  
  const ex = (db.explanations || []).filter(x => x.login === st.login).map(x => ({
    id: x.id, reason: x.reason, refDate: x.ref_date, text: x.text, files: typeof x.files === "string" ? JSON.parse(x.files || "[]") : (x.files || []),
    status: x.status, comment: x.tutor_comment, created: x.created, answered: x.answered, by: "Tyutor"
  }));
  
  const clubMems = (db.club_members || []).filter(m => m.login === st.login);
  const clubs = clubMems.map(m => {
    const cl = (db.clubs || []).find(c => c.id === m.club_id) || {};
    return { id: m.club_id, status: m.status, name: cl.name || "", category: cl.category || "" };
  });
  
  const regs = (db.event_regs || []).filter(r => r.login === st.login).map(r => {
    const ev = (db.events || []).find(e => e.id === r.event_id) || {};
    return { event_id: r.event_id, attended: r.attended, title: ev.title || "", date: ev.date || "" };
  });
  
  const notes = (viewer.role === "student") ? [] : (db.student_notes || []).filter(n => n.login === st.login).map(n => ({
    id: n.id, kind: n.kind, text: n.text, created: n.created, by: "Tyutor"
  }));
  
  const parents = (viewer.role === "student") ? [] : (db.parent_links || []).filter(p => p.child_login === st.login).map(p => {
    const pu = (db.users || []).find(u => u.login === p.parent_login) || {};
    return { name: pu.name + " " + pu.surname, phone: pu.phone || "" };
  });
  
  const contract = (db.contracts || []).find(c => c.login === st.login) || null;
  const prof = (db.profiles || []).find(p => p.login === st.login);
  let profileData = {};
  if (prof) {
    try { profileData = typeof prof.data === "string" ? JSON.parse(prof.data) : prof.data; } catch(e) {}
  }
  const profileObj = prof ? {
    status: prof.status, data: profileData, note: prof.note || "", updated: prof.updated, sent: prof.sent, checked: prof.checked,
    progress: progress(profileData)
  } : null;
  
  const socialList = (db.social_cats || []).filter(s => s.login === st.login).map(s => ({
    id: s.id, cat: s.cat, name: socialName(s.cat), note: s.note, files: typeof s.files === "string" ? JSON.parse(s.files || "[]") : (s.files || []),
    status: s.status, comment: s.comment, created: s.created
  }));
  
  const spravkas = (db.spravkas || []).filter(s => s.login === st.login).map(s => ({
    id: s.id, login: s.login, who: st.name + " " + st.surname, grp: st.grp, kind: s.kind,
    kindName: (SPRAVKA_KINDS.find(k => k.id === s.kind) || {}).name || s.kind,
    from: s.date_from, to: s.date_to, note: s.note, files: typeof s.files === "string" ? JSON.parse(s.files || "[]") : (s.files || []),
    status: s.status, comment: s.comment, fixed: s.fixed, created: s.created
  }));
  
  const dorm = (db.dorm_apps || []).filter(d => d.login === st.login).map(d => ({
    id: d.id, login: d.login, who: st.name + " " + st.surname, grp: st.grp, reason: d.reason,
    reasonName: (DORM_REASONS.find(r => r.id === d.reason) || {}).name || d.reason,
    note: d.note, files: typeof d.files === "string" ? JSON.parse(d.files || "[]") : (d.files || []),
    status: d.status, parentAt: d.parent_at, tutorAt: d.tutor_at, comment: d.comment, created: d.created
  }));
  
  const entries = (db.ifi_entries || []).filter(e => e.login === st.login).map(cleanEntry);
  const discipline = (db.discipline || []).filter(d => d.login === st.login);
  
  return {
    login: st.login, name: st.name, surname: st.surname, grp: st.grp, faculty: st.faculty, jshir: st.jshir || "", phone: st.phone || "",
    direction: st.direction || "", course: st.course || 0, payType: st.pay_type || "",
    acad: K.A[st.login], absH: K.H[st.login] || 0, ifi: K.S[st.login], rank: ranksEngine(K, st.login), grant: K.G[st.login] || null,
    discipline, contract, gender: st.gender || "",
    profile: profileObj, social: socialList, spravkas, dorm, entries,
    att: {
      marks: marks.slice(0, 120), held: heldPairs, heldDays, miss, excused, rate,
      todayDone, todayPairs: todaySchedule.length, today: todayMarks
    },
    tutors, explanations: ex, clubs, apps: [], regs, notes, parents
  };
}

function buildStateEngine(db, meUser) {
  const base = {
    me: null, today: today(), semester: { start: "2026-09-01", months: 2, name: "2026-2027 · 1-semestr" },
    year: "2026-2027", hemis: { mode: "demo", note: "MVP: namunaviy HEMIS/Edu tizimi" },
    contractInfo: { standard: 13500000 }, pairs: PAIRS,
    rules: { crit: CRIT, gpaT: GPA_SCALE, attT: ATT_T, gradeT: GRADE_TABLE, levels: LEVEL_LIST, eventIfi: EVENT_IFI, hoursPerPair: 2, grant: GRANT_CONF, uniGrant: UNI_GRANT_LIST },
    profileForm: PROFILE, socialCats: SOCIAL, req: { spravka: SPRAVKA_KINDS, dorm: DORM_REASONS, exReasons: EX_REASONS }
  };
  
  if (!meUser) return base;
  
  base.me = {
    login: meUser.login, name: meUser.name, surname: meUser.surname, role: meUser.role,
    roleName: ROLE_LABEL[meUser.role] || meUser.role, grp: meUser.grp, faculty: meUser.faculty,
    phone: meUser.phone || "", jshir: meUser.jshir || ""
  };
  
  const nt = (db.notifications || []).filter(n => n.login === meUser.login);
  base.notifs = nt;
  base.unread = nt.filter(n => !n.read).length;
  
  const K = scoreAllEngine(db);
  
  if (meUser.role === "student") {
    base.st = studentFullEngine(db, K, meUser, meUser);
    base.schedule = (db.edu_schedule || []).filter(s => s.grp === meUser.grp);
    base.events = (db.events || []);
    base.clubs = (db.clubs || []).map(c => ({ ...c, members: 12 }));
    base.scholarships = (db.scholarships || []);
    base.articles = (db.articles || []);
    base.board = K.st.map(s => ({
      login: s.login, name: s.name + " " + s.surname, grp: s.grp, faculty: s.faculty, direction: s.direction, course: s.course,
      ifi: K.S[s.login]?.total || 0, gpa: K.A[s.login]?.gpa ?? null, grant: K.G[s.login]?.score ?? null, outcome: K.G[s.login]?.outcome || ""
    }));
  } else if (meUser.role === "parent") {
    const pLinks = (db.parent_links || []).filter(p => p.parent_login === meUser.login);
    const kidLogins = pLinks.map(p => p.child_login);
    const kids = (db.users || []).filter(u => kidLogins.includes(u.login));
    base.kids = kids.map(k => ({
      ...studentFullEngine(db, K, k, meUser),
      schedule: (db.edu_schedule || []).filter(s => s.grp === k.grp)
    }));
    base.scholarships = (db.scholarships || []);
  } else if (meUser.role === "tutor") {
    const tGroups = (db.tutor_groups || []).filter(g => g.tutor_login === meUser.login).map(g => g.grp);
    const groups = tGroups.length ? tGroups : ["RST-81/25", "RST-82/25", "RST-83/25"];
    base.groups = groups;
    
    base.students = K.st.filter(s => groups.includes(s.grp)).map(s => {
      const g = K.G[s.login];
      const prof = (db.profiles || []).find(p => p.login === s.login);
      let pObj = null;
      if (prof) {
        let pData = {};
        try { pData = typeof prof.data === "string" ? JSON.parse(prof.data) : prof.data; } catch(e) {}
        pObj = { status: prof.status, pct: progress(pData).pct };
      }
      const cats = (db.social_cats || []).filter(sc => sc.login === s.login && sc.status === "tasdiqlandi").map(sc => sc.cat);
      return {
        login: s.login, gender: s.gender || "", cats, prof: pObj, name: s.name, surname: s.surname, grp: s.grp,
        faculty: s.faculty, direction: s.direction, course: s.course, payType: s.pay_type,
        gpa: K.A[s.login]?.gpa ?? null, ifi: K.S[s.login]?.total || 0, level: K.S[s.login]?.level || "",
        absH: K.H[s.login] || 0, penalty: K.S[s.login]?.penalty || 0,
        grant: g ? { score: g.score, pos: g.pos, of: g.of, outcome: g.outcome, uniPct: g.uniPct } : null
      };
    });
    
    base.socialQueue = (db.social_cats || []).filter(s => s.status === "kutilmoqda").map(s => {
      const u = (db.users || []).find(x => x.login === s.login) || {};
      return {
        id: s.id, login: s.login, cat: s.cat, catName: socialName(s.cat), note: s.note,
        files: typeof s.files === "string" ? JSON.parse(s.files || "[]") : (s.files || []),
        created: s.created, name: u.name + " " + u.surname, grp: u.grp
      };
    });
    
    base.queue = (db.ifi_entries || []).filter(e => e.status === "kutilmoqda").map(cleanEntry);
    
    base.explanations = (db.explanations || []).map(x => {
      const u = (db.users || []).find(x2 => x2.login === x.login) || {};
      return {
        id: x.id, login: x.login, name: u.name + " " + u.surname, grp: u.grp, reason: x.reason,
        refDate: x.ref_date, text: x.text, files: typeof x.files === "string" ? JSON.parse(x.files || "[]") : (x.files || []),
        status: x.status, comment: x.tutor_comment, created: x.created, answered: x.answered
      };
    });
    
    base.dorm = (db.dorm_apps || []).map(d => {
      const u = (db.users || []).find(x => x.login === d.login) || {};
      return {
        id: d.id, login: d.login, who: u.name + " " + u.surname, grp: u.grp, reason: d.reason,
        reasonName: (DORM_REASONS.find(r => r.id === d.reason) || {}).name || d.reason,
        note: d.note, files: typeof d.files === "string" ? JSON.parse(d.files || "[]") : (d.files || []),
        status: d.status, parentAt: d.parent_at, tutorAt: d.tutor_at, comment: d.comment, created: d.created
      };
    });
    
    base.spravkas = (db.spravkas || []).map(s => {
      const u = (db.users || []).find(x => x.login === s.login) || {};
      return {
        id: s.id, login: s.login, who: u.name + " " + u.surname, grp: u.grp, kind: s.kind,
        kindName: (SPRAVKA_KINDS.find(k => k.id === s.kind) || {}).name || s.kind,
        from: s.date_from, to: s.date_to, note: s.note, files: typeof s.files === "string" ? JSON.parse(s.files || "[]") : (s.files || []),
        status: s.status, comment: s.comment, fixed: s.fixed, created: s.created
      };
    });
    
    base.schedules = {};
    base.marked = {};
    for (const g of groups) {
      base.schedules[g] = (db.edu_schedule || []).filter(s => s.grp === g);
      base.marked[g] = (db.att_days || []).filter(d => d.grp === g && d.date === today()).map(d => d.pair);
    }
    base.events = (db.events || []);
  } else if (meUser.role === "dean" || meUser.role === "admin") {
    base.students = K.st.map(s => {
      const g = K.G[s.login];
      const prof = (db.profiles || []).find(p => p.login === s.login);
      let pObj = null;
      if (prof) {
        let pData = {};
        try { pData = typeof prof.data === "string" ? JSON.parse(prof.data) : prof.data; } catch(e) {}
        pObj = { status: prof.status, pct: progress(pData).pct };
      }
      const cats = (db.social_cats || []).filter(sc => sc.login === s.login && sc.status === "tasdiqlandi").map(sc => sc.cat);
      return {
        login: s.login, gender: s.gender || "", cats, prof: pObj, name: s.name, surname: s.surname, grp: s.grp,
        faculty: s.faculty, direction: s.direction, course: s.course, payType: s.pay_type,
        gpa: K.A[s.login]?.gpa ?? null, ifi: K.S[s.login]?.total || 0, level: K.S[s.login]?.level || "",
        absH: K.H[s.login] || 0, penalty: K.S[s.login]?.penalty || 0,
        grant: g ? { score: g.score, pos: g.pos, of: g.of, outcome: g.outcome, uniPct: g.uniPct } : null
      };
    });
    
    const allTutors = (db.users || []).filter(u => u.role === "tutor");
    base.tutors = allTutors.map(t => {
      const tGroups = (db.tutor_groups || []).filter(g => g.tutor_login === t.login).map(g => g.grp);
      const st = K.st.filter(s => tGroups.includes(s.grp));
      const withGpa = st.filter(s => K.A[s.login].gpa != null);
      return {
        login: t.login, name: t.name + " " + t.surname, phone: t.phone || "", groups: tGroups,
        n: st.length, ifi: st.length ? round1(st.reduce((a, s) => a + K.S[s.login].total, 0) / st.length) : 0,
        gpa: withGpa.length ? Math.round((withGpa.reduce((a, s) => a + K.A[s.login].gpa, 0) / withGpa.length) * 100) / 100 : null,
        absH: st.length ? round1(st.reduce((a, s) => a + (K.H[s.login] || 0), 0) / st.length) : 0,
        attMarked: 88, pending: 0, exOpen: 0
      };
    });
    
    base.events = (db.events || []);
    base.clubs = (db.clubs || []);
    base.spravkas = (db.spravkas || []).map(s => {
      const u = (db.users || []).find(x => x.login === s.login) || {};
      return {
        id: s.id, login: s.login, who: u.name + " " + u.surname, grp: u.grp, kind: s.kind,
        kindName: (SPRAVKA_KINDS.find(k => k.id === s.kind) || {}).name || s.kind,
        from: s.date_from, to: s.date_to, note: s.note, files: typeof s.files === "string" ? JSON.parse(s.files || "[]") : (s.files || []),
        status: s.status, comment: s.comment, fixed: s.fixed, created: s.created
      };
    });
    base.dorm = (db.dorm_apps || []).map(d => {
      const u = (db.users || []).find(x => x.login === d.login) || {};
      return {
        id: d.id, login: d.login, who: u.name + " " + u.surname, grp: u.grp, reason: d.reason,
        reasonName: (DORM_REASONS.find(r => r.id === d.reason) || {}).name || d.reason,
        note: d.note, files: typeof d.files === "string" ? JSON.parse(d.files || "[]") : (d.files || []),
        status: d.status, parentAt: d.parent_at, tutorAt: d.tutor_at, comment: d.comment, created: d.created
      };
    });
    base.quotas = K.Q;
    base.contracts = (db.contracts || []);
    
    if (meUser.role === "admin") {
      base.users = (db.users || []);
      base.links = (db.parent_links || []);
      base.tutorGroups = (db.tutor_groups || []).map(r => ({ tutor: r.tutor_login, grp: r.grp }));
      base.scholarships = (db.scholarships || []);
      base.articles = (db.articles || []);
      base.apps = [];
    }
  } else if (meUser.role === "club") {
    const clubs = (db.clubs || []).filter(c => c.leader_login === meUser.login);
    base.myClubs = clubs.map(cl => {
      const mems = (db.club_members || []).filter(m => m.club_id === cl.id).map(m => {
        const u = (db.users || []).find(x => x.login === m.login) || {};
        return { login: m.login, name: u.name + " " + u.surname, grp: u.grp, faculty: u.faculty, status: m.status, created: m.created };
      });
      return {
        id: cl.id, name: cl.name, category: cl.category, catName: cl.name, schedule: cl.schedule, place: cl.place,
        description: cl.description, members: mems
      };
    });
    base.events = (db.events || []);
  }
  
  return base;
}

// Local RPC API Dispatcher
async function localApiHandler(action, data) {
  const ldb = getLocalDb();
  
  if (action === "state") {
    return { ok: true, state: S };
  }
  
  if (action === "login") {
    const lg = String(data.login || "").trim().toLowerCase();
    let found = (ldb.users || []).find(u => u.login.toLowerCase() === lg);
    if (!found) {
      if (lg === "monarch" || lg === "admin") {
        found = { login: lg, name: "Monarch", surname: "Developer", role: "admin", university: "TDIU", faculty: "Raqamli iqtisodiyot", grp: "AT-900/26" };
      } else if (lg.includes("tutor") || lg.includes("tyutor")) {
        found = { login: lg, name: "Gulnora", surname: "Rashidova", role: "tutor", university: "TDIU", faculty: "Raqamli iqtisodiyot", grp: "-" };
      } else if (lg.includes("ota") || lg.includes("parent")) {
        found = { login: lg, name: "Alisher", surname: "Alisherov", role: "parent", university: "TDIU", faculty: "Raqamli iqtisodiyot", grp: "-" };
      } else if (lg.includes("dekan")) {
        found = { login: lg, name: "Akmal", surname: "Nurmatov", role: "dean", university: "TDIU", faculty: "Raqamli iqtisodiyot", grp: "-" };
      } else if (lg.includes("klub") || lg.includes("club")) {
        found = { login: lg, name: "Bahodir", surname: "Yo'ldoshev", role: "club", university: "TDIU", faculty: "Talabalar bilan ishlash bo'limi", grp: "-" };
      } else {
        found = { login: lg, name: lg.split(".")[0] || "Talaba", surname: lg.split(".")[1] || "TDIU", role: "student", university: "TDIU", faculty: "Raqamli iqtisodiyot", grp: "RST-81/25" };
      }
    }
    const meUser = {
      login: found.login,
      name: found.name,
      surname: found.surname || "",
      role: found.role || "student",
      roleName: ROLE_LABEL[found.role] || found.role,
      grp: found.grp || "RST-81/25",
      faculty: found.faculty || "Raqamli iqtisodiyot",
      phone: found.phone || "+998 90 000 00 00",
      jshir: found.jshir || "30101010000000"
    };
    setState(buildStateEngine(ldb, meUser));
    try { localStorage.setItem("riat_user", JSON.stringify(meUser)); } catch(e) {}
    return { ok: true, msg: "Xush kelibsiz, " + meUser.name, state: S };
  }
  
  if (action === "logout") {
    try { localStorage.removeItem("riat_user"); } catch(e) {}
    setState(buildStateEngine(ldb, null));
    return { ok: true, msg: "Tizimdan chiqildi", state: S };
  }
  
  if (action === "setPhone") {
    if (S.me) {
      S.me.phone = data.phone;
      const u = (ldb.users || []).find(x => x.login === S.me.login);
      if (u) u.phone = data.phone;
      saveLocalDb(ldb);
      setState(buildStateEngine(ldb, S.me));
      return { ok: true, msg: "Telefon raqami saqlandi", state: S };
    }
  }
  
  if (action === "changePassword") {
    return { ok: true, msg: "Parol muvaffaqiyatli o'zgartirildi" };
  }
  
  if (action === "readNotifs") {
    if (S.me) {
      (ldb.notifications || []).filter(n => n.login === S.me.login).forEach(n => (n.read = 1));
      saveLocalDb(ldb);
      setState(buildStateEngine(ldb, S.me));
      return { ok: true, state: S };
    }
  }
  
  if (action === "attSheet") {
    const grp = data.grp, date = data.date;
    const pairs = (ldb.edu_schedule || []).filter(s => s.grp === grp && s.day === isoDay(date));
    const st = (ldb.users || []).filter(u => u.role === "student" && u.grp === grp);
    const mk = (ldb.att_marks || []).filter(m => m.grp === grp && m.date === date);
    const dn = (ldb.att_days || []).filter(d => d.grp === grp && d.date === date).map(d => d.pair);
    return { ok: true, data: { grp, date, pairs, students: st, marks: mk, done: dn } };
  }
  
  if (action === "attSave") {
    const grp = data.grp, date = data.date, pair = Number(data.pair) || 0, marks = data.marks || {};
    ldb.att_days = (ldb.att_days || []).filter(d => !(d.grp === grp && d.date === date && (pair ? d.pair === pair : true)));
    ldb.att_marks = (ldb.att_marks || []).filter(m => !(m.grp === grp && m.date === date && (pair ? m.pair === pair : true)));
    
    const now = Date.now();
    const sched = (ldb.edu_schedule || []).filter(s => s.grp === grp && s.day === isoDay(date));
    const pairsToSave = pair ? [pair] : sched.map(s => s.pair);
    
    for (const p of pairsToSave) {
      ldb.att_days.push({ date, pair: p, grp, by_login: S.me?.login || "tyutor", created: now });
      for (const [stLogin, status] of Object.entries(marks)) {
        if (status) {
          ldb.att_marks.push({ date, pair: p, login: stLogin, grp, status, note: "", by_login: S.me?.login || "tyutor", created: now });
        }
      }
    }
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Davomat saqlandi", state: S };
  }
  
  if (action === "ifiAdd") {
    const cr = critById(data.crit);
    const id = "e_" + Date.now();
    const newEntry = {
      id, login: S.me.login, crit: data.crit, sub: data.sub, source: "student", ref: "",
      note: data.note || "", status: "kutilmoqda", comment: "", date: data.fields?.date || today(),
      created: Date.now(), by_login: "", updated: Date.now(),
      meta: JSON.stringify({ files: data.files || [], fields: data.fields || {}, title: data.fields?.title || data.fields?.place || "" })
    };
    (ldb.ifi_entries ||= []).push(newEntry);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Ariza yuborildi. Tyutor ko'rib chiqqach ball qo'shiladi", state: S };
  }
  
  if (action === "ifiDelete") {
    ldb.ifi_entries = (ldb.ifi_entries || []).filter(e => !(e.id === data.id && e.login === S.me?.login));
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Ariza o'chirildi", state: S };
  }
  
  if (action === "ifiReview") {
    const e = (ldb.ifi_entries || []).find(x => x.id === data.id);
    if (e) {
      e.status = data.decision;
      e.comment = data.comment || "";
      if (data.sub) e.sub = data.sub;
      e.by_login = S.me?.login || "tyutor";
      e.updated = Date.now();
      saveLocalDb(ldb);
    }
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: data.decision === "tasdiqlandi" ? "Tasdiqlandi, ball qo'shildi" : "Rad etildi", state: S };
  }
  
  if (action === "ifiTutorSet") {
    ldb.ifi_entries = (ldb.ifi_entries || []).filter(e => !(e.login === data.login && e.crit === data.crit && e.source === "tutor"));
    for (const sub of (data.subs || [])) {
      ldb.ifi_entries.push({
        id: "e_" + Date.now() + Math.random().toString(36).slice(2, 6),
        login: data.login, crit: data.crit, sub, source: "tutor", ref: "", file_id: "", note: "",
        status: "tasdiqlandi", comment: "", date: today(), created: Date.now(), by_login: S.me?.login || "tyutor",
        updated: Date.now(), meta: "{}"
      });
    }
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Tyutor baholari saqlandi", state: S };
  }
  
  if (action === "profileRequest") {
    let logins = [];
    if (data.login) logins = [data.login];
    else if (data.grp) logins = (ldb.users || []).filter(u => u.role === "student" && u.grp === data.grp).map(u => u.login);
    for (const l of logins) {
      let p = (ldb.profiles || []).find(x => x.login === l);
      if (!p) {
        p = { login: l, status: "so'ralgan", requested_by: S.me?.login || "tyutor", updated: Date.now(), data: "{}" };
        (ldb.profiles ||= []).push(p);
      } else {
        p.status = "so'ralgan";
        p.updated = Date.now();
      }
    }
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: logins.length + " ta talabaga anketa so'rovi yuborildi", state: S };
  }
  
  if (action === "profileSave") {
    const login = S.me.login;
    let p = (ldb.profiles || []).find(x => x.login === login);
    if (!p) {
      p = { login, status: data.submit ? "yuborilgan" : "qoralama", updated: Date.now(), data: JSON.stringify(data.data || {}) };
      (ldb.profiles ||= []).push(p);
    } else {
      p.data = JSON.stringify(data.data || {});
      p.status = data.submit ? "yuborilgan" : "qoralama";
      p.updated = Date.now();
    }
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: data.submit ? "Anketa tyutorga yuborildi" : "Qoralama saqlandi", state: S };
  }
  
  if (action === "profileReview") {
    const p = (ldb.profiles || []).find(x => x.login === data.login);
    if (p) {
      p.status = data.decision === "ok" ? "tasdiqlangan" : "qaytarilgan";
      p.note = data.note || "";
      p.checked = Date.now();
      saveLocalDb(ldb);
    }
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: data.decision === "ok" ? "Anketa tasdiqlandi" : "Anketa qaytarildi", state: S };
  }
  
  if (action === "socialAdd") {
    const id = "soc_" + Date.now();
    (ldb.social_cats ||= []).push({
      id, login: data.login || S.me.login, cat: data.cat, note: data.note || "",
      files: JSON.stringify(data.files || []), status: S.me.role === "tutor" ? "tasdiqlandi" : "kutilmoqda",
      comment: "", created: Date.now()
    });
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Ijtimoiy toifa qo'shildi", state: S };
  }
  
  if (action === "socialReview") {
    const s = (ldb.social_cats || []).find(x => x.id === data.id);
    if (s) {
      s.status = data.decision === "ok" ? "tasdiqlandi" : "rad";
      s.comment = data.comment || "";
      saveLocalDb(ldb);
    }
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: data.decision === "ok" ? "Toifa tasdiqlandi" : "Toifa rad etildi", state: S };
  }
  
  if (action === "socialDelete") {
    ldb.social_cats = (ldb.social_cats || []).filter(s => s.id !== data.id);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Ijtimoiy toifa o'chirildi", state: S };
  }
  
  if (action === "spravkaAdd") {
    const id = "spr_" + Date.now();
    (ldb.spravkas ||= []).push({
      id, login: S.me.login, kind: data.kind, date_from: data.from, date_to: data.to,
      note: data.note || "", files: JSON.stringify(data.files || []), status: "kutilmoqda",
      comment: "", fixed: 0, created: Date.now()
    });
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Spravka dekanatga yuborildi", state: S };
  }
  
  if (action === "spravkaReview") {
    const s = (ldb.spravkas || []).find(x => x.id === data.id);
    if (s) {
      const ok = data.decision === "ok";
      s.status = ok ? "tasdiqlandi" : "rad";
      s.comment = data.comment || "";
      if (ok) {
        let fixed = 0;
        for (const m of (ldb.att_marks || [])) {
          if (m.login === s.login && m.date >= s.date_from && m.date <= s.date_to && m.status === "kelmadi") {
            m.status = "sababli";
            m.note = "Spravka";
            fixed++;
          }
        }
        s.fixed = fixed;
      }
      saveLocalDb(ldb);
    }
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: data.decision === "ok" ? "Spravka tasdiqlandi" : "Spravka rad etildi", state: S };
  }
  
  if (action === "spravkaDelete") {
    ldb.spravkas = (ldb.spravkas || []).filter(s => s.id !== data.id);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Spravka o'chirildi", state: S };
  }
  
  if (action === "dormApply") {
    const id = "dorm_" + Date.now();
    (ldb.dorm_apps ||= []).push({
      id, login: S.me.login, reason: data.reason, note: data.note || "",
      files: JSON.stringify(data.files || []), status: "tyutorda", comment: "", created: Date.now()
    });
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Yotoqxona arizasi yuborildi", state: S };
  }
  
  if (action === "dormDecide") {
    const d = (ldb.dorm_apps || []).find(x => x.id === data.id);
    if (d) {
      d.status = data.decision === "ok" ? "tasdiqlandi" : "rad";
      d.comment = data.comment || "";
      saveLocalDb(ldb);
    }
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: data.decision === "ok" ? "Ariza tasdiqlandi" : "Ariza rad etildi", state: S };
  }
  
  if (action === "dormCancel") {
    ldb.dorm_apps = (ldb.dorm_apps || []).filter(d => d.id !== data.id);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Ariza bekor qilindi", state: S };
  }
  
  if (action === "exRequest") {
    const now = Date.now();
    for (const l of (data.logins || [])) {
      (ldb.explanations ||= []).push({
        id: "ex_" + now + Math.random().toString(36).slice(2, 6),
        login: l, by_login: S.me?.login || "tyutor", reason: data.reason,
        ref_date: data.date || today(), text: "", status: "so'ralgan", created: now
      });
    }
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Tushuntirish xati so'raldi", state: S };
  }
  
  if (action === "exWrite") {
    const x = (ldb.explanations || []).find(e => e.id === data.id);
    if (x) {
      x.text = data.text;
      x.files = JSON.stringify(data.files || []);
      x.status = "yozildi";
      x.answered = Date.now();
      saveLocalDb(ldb);
    }
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Tushuntirish xati tyutorga yuborildi", state: S };
  }
  
  if (action === "exReview") {
    const x = (ldb.explanations || []).find(e => e.id === data.id);
    if (x) {
      x.status = data.decision;
      x.tutor_comment = data.comment || "";
      saveLocalDb(ldb);
    }
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Ko'rib chiqildi", state: S };
  }
  
  if (action === "noteAdd") {
    (ldb.student_notes ||= []).push({
      id: "n_" + Date.now(), login: data.login, kind: data.kind, text: data.text,
      by_login: S.me?.login || "tyutor", created: Date.now()
    });
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Izoh saqlandi", state: S };
  }
  
  if (action === "noteDelete") {
    ldb.student_notes = (ldb.student_notes || []).filter(n => n.id !== data.id);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Izoh o'chirildi", state: S };
  }
  
  if (action === "disciplineAdd") {
    (ldb.discipline ||= []).push({
      id: "d_" + Date.now(), login: data.login, reason: data.reason, date: data.date || today(),
      by_login: S.me?.login || "dekanat", created: Date.now()
    });
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Intizomiy jazo qo'llandi", state: S };
  }
  
  if (action === "disciplineDelete") {
    ldb.discipline = (ldb.discipline || []).filter(d => d.id !== data.id);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Intizomiy jazo bekor qilindi", state: S };
  }
  
  if (action === "quotaSave") {
    let q = (ldb.grant_quotas || []).find(x => x.faculty === data.faculty && x.direction === data.direction && Number(x.course) === Number(data.course));
    if (!q) {
      q = { faculty: data.faculty, direction: data.direction, course: Number(data.course), full_n: Number(data.full), half_n: Number(data.half), updated: Date.now() };
      (ldb.grant_quotas ||= []).push(q);
    } else {
      q.full_n = Number(data.full);
      q.half_n = Number(data.half);
      q.updated = Date.now();
    }
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Grant o'rinlari saqlandi", state: S };
  }
  
  if (action === "contractSave") {
    let c = (ldb.contracts || []).find(x => x.login === data.login);
    if (!c) {
      c = { login: data.login, due: Number(data.due), paid: Number(data.paid), updated: Date.now() };
      (ldb.contracts ||= []).push(c);
    } else {
      c.due = Number(data.due);
      c.paid = Number(data.paid);
      c.updated = Date.now();
    }
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Kontrakt ma'lumotlari saqlandi", state: S };
  }
  
  if (action === "eventSave") {
    const id = data.id || ("ev_" + Date.now());
    let ev = (ldb.events || []).find(x => x.id === id);
    const evData = {
      id, title: data.title, kind: data.kind || "tadbir", date: data.date, time: data.time || "",
      place: data.place || "", description: data.description || "", groups: Array.isArray(data.groups) ? data.groups.join(",") : (data.groups || ""),
      club_id: data.club || "", ifi: data.ifi || "", owner_login: S.me?.login || "admin", created: Date.now()
    };
    if (ev) Object.assign(ev, evData);
    else (ldb.events ||= []).push(evData);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Tadbir saqlandi", state: S };
  }
  
  if (action === "eventDelete") {
    ldb.events = (ldb.events || []).filter(e => e.id !== data.id);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Tadbir o'chirildi", state: S };
  }
  
  if (action === "eventRegister") {
    const attended = data.on ? 1 : 0;
    let reg = (ldb.event_regs || []).find(r => r.event_id === data.id && r.login === S.me.login);
    if (!reg) {
      (ldb.event_regs ||= []).push({ event_id: data.id, login: S.me.login, attended });
    } else {
      reg.attended = attended;
    }
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: data.on ? "Tadbirga yozildingiz" : "Ro'yxatdan chiqarildingiz", state: S };
  }
  
  if (action === "clubJoin") {
    const status = data.on ? "kutilmoqda" : "chiqdi";
    let mem = (ldb.club_members || []).find(m => m.club_id === data.id && m.login === S.me.login);
    if (!mem) {
      (ldb.club_members ||= []).push({ club_id: data.id, login: S.me.login, status, created: Date.now() });
    } else {
      mem.status = status;
    }
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: data.on ? "Klubga ariza yuborildi" : "Klubdan chiqildi", state: S };
  }
  
  if (action === "clubDecide") {
    const mem = (ldb.club_members || []).find(m => m.club_id === data.club && m.login === data.login);
    if (mem) {
      mem.status = data.decision === "ok" ? "a'zo" : "rad";
      saveLocalDb(ldb);
    }
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: data.decision === "ok" ? "Qabul qilindi" : "Rad etildi", state: S };
  }
  
  if (action === "clubSave") {
    const id = data.id || ("c_" + Date.now());
    let cl = (ldb.clubs || []).find(c => c.id === id);
    const clData = {
      id, name: data.name, category: data.category || "sport", schedule: data.schedule || "",
      place: data.place || "", description: data.description || "", leader_login: S.me?.login || "", created: Date.now()
    };
    if (cl) Object.assign(cl, clData);
    else (ldb.clubs ||= []).push(clData);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Klub saqlandi", state: S };
  }
  
  if (action === "clubDelete") {
    ldb.clubs = (ldb.clubs || []).filter(c => c.id !== data.id);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "To'garak o'chirildi", state: S };
  }
  
  if (action === "userSave") {
    const edit = data.edit || data.login;
    let u = (ldb.users || []).find(x => x.login === edit);
    const uData = {
      login: edit, name: data.name, surname: data.surname || "", role: data.role || "student",
      university: "TDIU", faculty: data.faculty || "Raqamli iqtisodiyot", grp: data.grp || "AT-900/26",
      phone: data.phone || "", jshir: data.jshir || "", direction: data.direction || "", course: Number(data.course) || 1, pay_type: data.pay_type || "kontrakt"
    };
    if (u) Object.assign(u, uData);
    else (ldb.users ||= []).push(uData);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Foydalanuvchi saqlandi", state: S };
  }
  
  if (action === "userDelete") {
    ldb.users = (ldb.users || []).filter(u => u.login !== data.login);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Foydalanuvchi o'chirildi", state: S };
  }
  
  if (action === "linkParent") {
    (ldb.parent_links ||= []).push({ parent_login: data.parent, child_login: data.child, created: Date.now() });
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Bog'landi", state: S };
  }
  
  if (action === "scholarshipSave") {
    const id = data.id || ("s_" + Date.now());
    let sch = (ldb.scholarships || []).find(x => x.id === id);
    const schData = {
      id, title: data.title, amount: Number(data.amount) || 0, deadline: data.deadline || "",
      description: data.description || "", contact: data.contact || ""
    };
    if (sch) Object.assign(sch, schData);
    else (ldb.scholarships ||= []).push(schData);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Stipendiya saqlandi", state: S };
  }
  
  if (action === "scholarshipDelete") {
    ldb.scholarships = (ldb.scholarships || []).filter(s => s.id !== data.id);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Stipendiya o'chirildi", state: S };
  }
  
  if (action === "articleSave") {
    const id = data.id || ("a_" + Date.now());
    let art = (ldb.articles || []).find(x => x.id === id);
    const artData = {
      id, title: data.title, tag: data.tag || "Yangilik", date: data.date || today(),
      body: String(data.body || "").split("\\n").filter(Boolean)
    };
    if (art) Object.assign(art, artData);
    else (ldb.articles ||= []).push(artData);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Yangilik saqlandi", state: S };
  }
  
  if (action === "articleDelete") {
    ldb.articles = (ldb.articles || []).filter(a => a.id !== data.id);
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "Yangilik o'chirildi", state: S };
  }
  
  if (action === "studentCard") {
    const stUser = (ldb.users || []).find(u => u.login === data.login);
    if (!stUser) return { ok: false, error: "Talaba topilmadi" };
    const K = scoreAllEngine(ldb);
    const full = studentFullEngine(ldb, K, stUser, S.me);
    const schedule = (ldb.edu_schedule || []).filter(s => s.grp === stUser.grp);
    return { ok: true, data: { ...full, schedule, canScore: S.me?.role === "tutor" } };
  }
  
  if (action === "getFile") {
    return { ok: true, data: { name: "hujjat.jpg", type: "image/jpeg", data: "" } };
  }
  
  if (action === "apply") {
    return { ok: true, msg: data.on ? "Ariza topshirildi" : "Ariza bekor qilindi" };
  }
  
  if (action === "qrStart") {
    const sid = "qr_" + Date.now();
    return { ok: true, data: { id: sid, token: "tok_" + Math.random().toString(36).slice(2, 8) } };
  }
  
  if (action === "qrToken") {
    return { ok: true, data: { token: "tok_" + Math.random().toString(36).slice(2, 8) } };
  }
  
  if (action === "qrEnd") {
    return { ok: true, msg: "QR sessiya yopildi" };
  }
  
  if (action === "checkin") {
    return { ok: true, msg: "Ishtirokingiz qayd etildi!" };
  }
  
  return { ok: true, state: S };
}

// Override core api() function
async function api(action, data, opt) {
  opt = opt || {};
  if (ui.busy && !opt.quiet) return null;
  if (!opt.quiet) { ui.busy = true; document.body.style.cursor = "progress"; }
  try {
    const j = await localApiHandler(action, data || {});
    if (j.state) setState(j.state);
    if (j.error) {
      ui.lastErr = j.error || "Xatolik";
      if (!opt.silent) toast(j.error || "Xatolik", true);
      if (j.state && !opt.noRender) render();
      return null;
    }
    if (j.msg && !opt.silent) toast(j.msg);
    if (j.state && !opt.noRender) render();
    return j;
  } catch (e) {
    if (!opt.silent) toast(e.message || "Xatolik", true);
    return null;
  } finally {
    if (!opt.quiet) { ui.busy = false; document.body.style.cursor = ""; }
  }
}

// Ecosystem SSO Boot Loader
function bootSSO() {
  try {
    const raw = localStorage.getItem("riat_user") || localStorage.getItem("tsue_user");
    if (raw) {
      const u = JSON.parse(raw);
      if (u && (u.login || u.username)) {
        const login = (u.login || u.username).toLowerCase();
        const ldb = getLocalDb();
        let match = (ldb.users || []).find(x => x.login.toLowerCase() === login);
        if (!match) {
          let role = "student";
          if (u.role === "admin" || login === "monarch") role = "admin";
          else if (u.role === "tutor" || u.role === "tyutor") role = "tutor";
          else if (u.role === "parent") role = "parent";
          else if (u.role === "dean") role = "dean";
          else if (u.role === "club") role = "club";
          
          match = {
            login,
            name: u.name || "Foydalanuvchi",
            surname: u.surname || "",
            role,
            grp: u.grp || u.group || "RST-81/25",
            faculty: u.faculty || "Raqamli iqtisodiyot",
            phone: u.phone || "+998 90 000 00 00",
            jshir: u.jshir || "30101010000000"
          };
        }
        return match;
      }
    }
  } catch(e) {
    console.warn("SSO boot check failed:", e);
  }
  return null;
}

// App Initialization
(function init() {
  const ldb = getLocalDb();
  const ssoUser = bootSSO();
  if (ssoUser) {
    setState(buildStateEngine(ldb, ssoUser));
  } else {
    // Default to sardor.alisherov for convenience if not logged in
    const defaultStudent = (ldb.users || []).find(u => u.login === "sardor.alisherov") || ldb.users[0];
    if (defaultStudent) {
      setState(buildStateEngine(ldb, defaultStudent));
    } else {
      setState(buildStateEngine(ldb, null));
    }
  }
  render();
})();
`;

// Add theme toggler event listener
const themeEventListener = `
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act=toggle-theme]");
  if (btn) {
    document.body.classList.toggle("dark-mode");
    try {
      localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    } catch(err) {}
  }
});
`;

// Assemble final univerlife_engine.js bundle
const finalBundle = `(function() {
"use strict";

${concatenatedFrontend}

${engineCode}

${themeEventListener}

})();
`;

fs.writeFileSync('/home/monarch/Projects/TSUE-Ecosystem/js/univerlife_engine.js', finalBundle, 'utf8');
console.log('Successfully wrote js/univerlife_engine.js! Size:', finalBundle.length, 'bytes');
