(function() {
"use strict";



const S = { me: null };

function setState(n) { for (const k of Object.keys(S)) delete S[k]; Object.assign(S, n || { me: null }); }

const V = {}; // sahifalar ro'yxati: V.<rol>.<sahifa> = (route) => html

const FILES = {}; // tanlangan fayllar (forma maydoni nomi bo'yicha)

const ui = {
  busy: false,       // so'rov ketyapti
  lastErr: "",       // oxirgi server xatosi
  afterRender: [],   // sahifa chizilgandan keyin bajariladigan funksiyalar
  CARD: null,        // xodim ochgan talaba kartasi
  schedDay: 0,       // dars jadvalida tanlangan kun
  devId: "",         // qurilma belgisi (QR uchun)
  kidIdx: 0,         // ota-ona: tanlangan farzand
  TG: "",            // tyutor: tanlangan guruh ("" = barchasi)
  ATT: null,         // tyutor: ochiq davomat varag'i
  fileCache: {},     // ochilgan fayllar keshi
  qrTimer: null,     // QR ekran taymeri
  qrLast: "",        // oxirgi QR token
};



const $ = (s, el) => (el || document).querySelector(s);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const MONTHS = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
const DAYS = ["", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
const DSHORT = ["", "Du", "Se", "Ch", "Pa", "Ju", "Sh"];
const fmtDate = (d) => { if (!d) return ""; const p = String(d).slice(0, 10).split("-").map(Number); return p[2] + "-" + MONTHS[p[1] - 1] + " " + p[0]; };
const fmtShort = (d) => { if (!d) return ""; const p = String(d).slice(0, 10).split("-").map(Number); return p[2] + "-" + MONTHS[p[1] - 1]; };
const dmy = (d) => String(d || "").split("-").reverse().join(".");
const ago = (t) => { const m = Math.round((Date.now() - t) / 60000); if (m < 1) return "hozir"; if (m < 60) return m + " daqiqa oldin"; const h = Math.round(m / 60); if (h < 24) return h + " soat oldin"; const d = Math.round(h / 24); return d < 30 ? d + " kun oldin" : fmtShort(new Date(t + 5 * 3600e3).toISOString()); };
const num = (n) => String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const f1 = (x) => String(Math.round((x || 0) * 10) / 10).replace(".", ",");
const f2 = (x) => (Math.round((x || 0) * 100) / 100).toFixed(2).replace(".", ",");
const ini = (n) => String(n || "").split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0]).join("").toUpperCase();
const isoDay = (d) => { const w = new Date(d + "T12:00:00Z").getUTCDay(); return w === 0 ? 7 : w; };
const tel = (p) => String(p || "").replace(/[^+\d]/g, "");
const AVC = ["#2f5a6e", "#5b7b3a", "#8a5a2b", "#5a4d8a", "#2b6f78", "#8a3d4f"];
const avc = (s) => { let h = 0; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return AVC[h % AVC.length]; };
const ava = (name, cls) => '<span class="av ' + (cls || "s") + '" style="background:' + avc(name) + '">' + esc(ini(name)) + "</span>";
const gpaTxt = (g) => (g == null ? "Kutilmoqda" : f2(g)); // null — joriy yilda hali modul tugamagan
const som = (n) => num(n) + " so'm";



const IP = {
  idcard: "M3 5h18v14H3zM6 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0M5 16c.8-1.8 4.2-1.8 5 0M13 9h6M13 13h4", home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z", cal: "M4 6h16v14H4zM4 10h16M9 3v4M15 3v4", check: "M5 12l4 4 10-10", cap: "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z", trophy: "M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20h6",
  wallet: "M3 7h18v12H3zM16 13h2M3 7l12-4v4", users: "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-4-5.6",
  flag: "M5 21V4h11l-2 4 2 4H5", news: "M4 5h13v14H4zM17 8h3v9a2 2 0 0 1-2 2M7 9h7M7 13h7M7 16h4", mail: "M4 6h16v12H4zM4 7l8 6 8-6", bell: "M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  user: "M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21a8 8 0 0 1 16 0", inbox: "M3 13h5l2 3h4l2-3h5M5 5h14l2 8v6H3v-6z", list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z", book: "M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5", qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2z",
  more: "M5 12h.01M12 12h.01M19 12h.01", menu: "M4 7h16M4 12h16M4 17h16", x: "M6 6l12 12M18 6L6 18", plus: "M12 5v14M5 12h14", phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2",
  info: "M12 8h.01M11 12h1v5h1M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", db: "M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3",
  print: "M6 9V3h12v6M6 18H4v-6h16v6h-2M7 14h10v7H7z", arrow: "M9 6l6 6-6 6", back: "M15 6l-6 6 6 6", out: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10", doc: "M7 3h7l5 5v13H7zM14 3v5h5", pen: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  club: "M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM6 21v-2a6 6 0 0 1 12 0v2M3 9h3M18 9h3", chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
};
const ic = (k) => '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="' + (IP[k] || IP.info) + '"/></svg>';


function toast(msg, err) {
  document.querySelectorAll(".toast").forEach((t) => t.remove());
  if (!msg) return;
  const t = document.createElement("div");
  t.className = "toast" + (err ? " err" : "");
  t.setAttribute("role", err ? "alert" : "status");
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), err ? 5200 : 3200);
}
function sheet(title, body) {
  closeSheet();
  const bg = document.createElement("div");
  bg.className = "sheet-bg";
  bg.innerHTML = '<div class="sheet" role="dialog" aria-modal="true" aria-label="' + esc(title) + '"><div class="sheet-h"><h2>' + esc(title) + '</h2><button class="ib" data-act="close-sheet" aria-label="Yopish">' + ic("x") + '</button></div><div class="sheet-b">' + body + "</div></div>";
  bg.addEventListener("click", (e) => { if (e.target === bg) closeSheet(); });
  document.body.appendChild(bg);
  const f = bg.querySelector("input:not([type=hidden]),select,textarea");
  if (f && window.innerWidth > 900) f.focus();
}
function closeSheet() { document.querySelectorAll(".sheet-bg").forEach((x) => x.remove()); }
const chip = (t, k) => '<span class="chip ' + (k || "") + '">' + esc(t) + "</span>";
const STC = { tasdiqlandi: ["Tasdiqlandi", "ok"], kutilmoqda: ["Kutilmoqda", "warn"], rad: ["Rad etildi", "bad"] };
const stChip = (s) => chip((STC[s] || [s])[0], (STC[s] || [, ""])[1]);
const src = (t) => '<span class="src"><i></i>' + esc(t) + "</span>";
const HEMIS_SRC = () => src(S.hemis && S.hemis.mode === "api" ? "HEMIS" : "HEMIS · MVP namunaviy ma'lumot");
const stat = (label, val, sub, tone, href) => (href ? '<a class="stat ' + (tone || "") + '" href="' + href + '">' : '<div class="stat ' + (tone || "") + '">') + "<small>" + label + "</small><b>" + val + "</b>" + (sub ? "<em>" + sub + "</em>" : "") + (href ? "</a>" : "</div>");
const card = (title, body, right, cls) => '<section class="card ' + (cls || "") + '">' + (title ? '<div class="ch"><h2>' + title + "</h2>" + (right || "") + "</div>" : "") + body + "</section>";
const empty = (t) => '<p class="empty">' + esc(t) + "</p>";
const field = (label, name, opt) => {
  opt = opt || {};
  const a = ' name="' + name + '"' + (opt.req ? " required" : "") + (opt.ph ? ' placeholder="' + esc(opt.ph) + '"' : "") + (opt.max ? ' max="' + opt.max + '"' : "") + (opt.min != null ? ' min="' + opt.min + '"' : "") + (opt.attrs || "");
  let inp;
  if (opt.type === "select") inp = "<select" + a + ">" + (opt.opts || []).map((o) => { const v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o; return '<option value="' + esc(v) + '"' + (String(v) === String(opt.val ?? "") ? " selected" : "") + ">" + esc(l) + "</option>"; }).join("") + "</select>";
  else if (opt.type === "textarea") inp = "<textarea" + a + ' rows="' + (opt.rows || 4) + '">' + esc(opt.val || "") + "</textarea>";
  else inp = '<input type="' + (opt.type || "text") + '"' + a + ' value="' + esc(opt.val ?? "") + '"' + (opt.type === "tel" ? ' inputmode="tel"' : "") + ">";
  return '<label class="fl"><span>' + label + (opt.hint ? " <small>" + opt.hint + "</small>" : "") + "</span>" + inp + "</label>";
};
const bar = (v, max, tone) => '<div class="bar ' + (tone || "") + '"><i style="width:' + Math.max(0, Math.min(100, max ? (v / max) * 100 : 0)) + '%"></i></div>';
const today = () => S.today || new Date(Date.now() + 5 * 3600e3).toISOString().slice(0, 10);
const levelOf = (t) => ((S.rules && S.rules.levels) || []).find((l) => t >= l[0]) || [0, "", ""];



const pct = (v, max) => Math.max(0, Math.min(100, max ? (v / max) * 100 : 0));


function kpi({ label, value, unit, p, tone, icon, sub, href }) {
  const pending = value == null;
  const inner = '<span class="mr ' + (tone || "") + '" style="--p:' + (pending ? 0 : Math.round(p)) + '"><i>' + ic(icon || "star") + "</i></span>" +
    '<span class="tx"><small>' + label + "</small><b>" + (pending ? '<span class="pend">Kutilmoqda</span>' : value + (unit ? " <span>" + unit + "</span>" : "")) + "</b>" + (sub ? "<em>" + sub + "</em>" : "") + "</span>";
  return href ? '<a class="kpi" href="' + href + '">' + inner + "</a>" : '<div class="kpi">' + inner + "</div>";
}


function scale({ segs, value, min = 0, max = 100, marker = "Siz", fmt = (x) => x, cuts = [], note = "" }) {
  const pos = (x) => ((x - min) / (max - min)) * 100;
  const v = value == null ? null : Math.max(min, Math.min(max, value));
  return '<div class="scale' + (cuts.length ? " cuts" : "") + '">' +
    (v == null ? "" : '<span class="mk" style="left:' + pos(v) + '%"><b>' + esc(marker) + " · " + fmt(value) + "</b></span>") +
    '<div class="sg">' + segs.map((s) => '<i class="' + (s.tone || "") + (v != null && v >= s.from && (v < s.to || s.to === max) ? " on" : "") + '" style="flex:' + (s.to - s.from) + '"></i>').join("") + "</div>" +
    cuts.map((c) => '<span class="cut" style="left:' + pos(c.at) + '%"><em>' + esc(c.label) + "</em></span>").join("") +
    '<div class="sl">' + segs.map((s) => '<span style="flex:' + (s.to - s.from) + '">' + esc(s.label) + "</span>").join("") + "</div>" +
    (note ? '<p class="scale-note">' + note + "</p>" : "") + "</div>";
}


function leaderboard(rows, me, opt) {
  opt = opt || {};
  const top = opt.top || 10, max = Math.max(...rows.map((r) => r.val || 0), 1);
  if (!rows.length) return '<p class="empty">Hali ma\'lumot yo\'q.</p>';
  const P = rows.slice(0, 3), order = [1, 0, 2].filter((i) => P[i]);
  const podium = '<div class="podium">' + order.map((i) => { const r = P[i];
    return '<div class="pod p' + (i + 1) + (r.login === me ? " me" : "") + '">' + ava(r.name, "l") + "<b>" + esc(r.name) + "</b><small>" + esc(r.sub || "") + '</small><span class="v">' + r.txt + "</span>" + (r.chip || "") + '<span class="st">' + (i + 1) + "</span></div>"; }).join("") + "</div>";
  const line = (r, i) => (opt.cuts && opt.cuts[i] ? '<div class="lb-cut"><span>' + esc(opt.cuts[i]) + "</span></div>" : "") +
    '<div class="lb-row' + (r.login === me ? " me" : "") + '"><span class="n">' + (i + 1) + "</span>" + ava(r.name) + '<span class="nm"><b>' + esc(r.name) + (r.login === me ? ' <em>siz</em>' : "") + "</b><small>" + esc(r.sub || "") + "</small></span>" +
    '<span class="lbar"><i style="width:' + pct(r.val || 0, max) + '%"></i></span><span class="v">' + r.txt + "</span>" + (r.chip ? '<span class="c">' + r.chip + "</span>" : "") + "</div>";
  const mi = rows.findIndex((r) => r.login === me);
  const rest = rows.slice(3, top).map((r, k) => line(r, k + 3)).join("");
  const mine = mi >= top ? '<div class="lb-gap">···</div>' + line(rows[mi], mi) : "";
  return podium + (rest || mine ? '<div class="lb">' + rest + mine + "</div>" : "");
}


function steps(items) {
  return '<div class="steps">' + items.map((s) => '<div class="step ' + s.state + '"><span class="dot">' + (s.state === "done" ? ic("check") : s.state === "bad" ? ic("x") : "") + "</span><b>" + esc(s.label) + "</b><small>" + (s.sub || "") + "</small></div>").join("") + "</div>";
}

const DEMO = [
  ["monarch", "1. Superadmin", "Rektorat · Monarch"],
  ["ota.demo", "2. Ota-ona", "Shodiyev Bekmurod aka"],
  ["sardor.alisherov", "3. Talaba", "Ro'ziyev Qodirjon"],
  ["dekanat.demo", "4. Fakultet", "Akbarov Nodir G'afurovich"],
  ["klub.demo", "5. Klub rahbari", "Yo'ldoshev Bahodir"],
  ["tyutor.demo", "6. Tyutor", "Abdurahmonov Umar"]
];
function viewLogin() {
  return '<div class="auth"><div class="auth-l"><a href="/ecosystem" class="brand" title="Ekotizim bosh sahifasiga o‘tish"><div class="riat-badge" style="background:#003B81;color:#fff;font-weight:900;font-size:11px;padding:2px 7px;border-radius:6px;margin-right:6px">TSUE</div><span>UniverLife</span></a><div><h2>Talaba hayoti bitta platformada</h2><p>Davomat, baholar, ijtimoiy faollik indeksi, stipendiyalar, to\'garaklar va tadbirlar — talaba, ota-ona, tyutor, klub rahbari, dekanat va rektorat uchun.</p>' +
    "<ul><li>6 turdagi yagona shaxsiy kabinet (SSO + JSHSHIR + Face ID)</li><li>Ota-ona uchun 3 pog'onali jonli reyting (Universitet, Fakultet, Guruh)</li><li>TTJ dan javob olish: Talaba → Ota-ona (Face ID) → Tyutor → Tarbiyachi</li><li>Tyutor uchun ijara xonadonlari xaritasi, marshrut va 1-klik Excel</li></ul></div><small style=\"color:#a9c4cf\">TDIU · Raqamli iqtisodiyot va axborot texnologiyalari fakulteti</small></div>" +
    '<div class="auth-r"><div class="auth-box"><h1>Yagona tizimga kirish</h1><p class="lead">6 ta asosiy rol bo\'yicha yagona kirish (Login, JSHSHIR yoki HEMIS ID).</p><form class="form" data-form="login">' +
    field("Login yoki JSHSHIR (14 raqam)", "login", { req: true, ph: "masalan: ota.demo yoki 31004751230088", attrs: ' autocomplete="username" autocapitalize="none"' }) +
    field("Parol", "password", { type: "password", req: true, attrs: ' autocomplete="current-password"' }) +
    '<button class="btn block" type="submit">Kirish</button></form><div class="demo">Taqdimot uchun 6 turdagi tayyor hisoblar (1-klik bilan kirish):<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:8px">' +
    DEMO.map((d) => '<button type="button" data-act="demo" data-login="' + d[0] + '" style="text-align:left;padding:10px 12px;border-radius:10px;border:1.5px solid var(--line);background:var(--card);cursor:pointer"><b>' + d[1] + "</b><br><small class=\"muted\">" + esc(d[2]) + "</small></button>").join("") + "</div></div></div></div></div>";
}


V.common = {};
V.common.notifications = () => {
  const N = S.notifs || [];
  if (S.unread) ui.afterRender.push(() => api("readNotifs", {}, { quiet: true, silent: true, noRender: true, lite: true }).then(() => { S.unread = 0; (S.notifs || []).forEach((n) => (n.read = 1)); }));
  return card("", N.length ? '<div class="list">' + N.map((n) => '<a class="row" href="' + esc(n.link || "#/home") + '">' + '<span class="ib" style="width:36px;height:36px">' + ic(n.title.indexOf("Davomat") === 0 ? "check" : n.title.indexOf("Tushuntirish") === 0 ? "mail" : n.title.indexOf("Ijtimoiy") === 0 ? "star" : n.title.indexOf("Stipendiya") === 0 ? "wallet" : "bell") + "</span>" +
    '<span class="t"><b>' + esc(n.title) + (n.read ? "" : ' <span class="chip pri">yangi</span>') + "</b><small>" + esc(n.body) + "</small></span><small class=\"muted\">" + ago(n.created) + "</small></a>").join("") + "</div>" : empty("Hozircha bildirishnoma yo'q."));
};
V.common.profile = () => {
  const m = S.me;
  return '<div class="grid g2">' + card("Ma'lumotlarim", '<div style="display:flex;gap:14px;align-items:center;margin-bottom:16px">' + ava(m.name + " " + m.surname, "l") + "<div><b style=\"font-size:18px\">" + esc(m.name + " " + m.surname) + '</b><div class="muted">' + esc(m.roleName) + (m.grp && m.grp !== "-" ? " · " + esc(m.grp) : "") + "</div></div></div>" +
    '<div class="kv"><div><small>Login</small><b>' + esc(m.login) + "</b></div>" + (m.jshir ? "<div><small>JSHIR</small><b>" + esc(m.jshir) + "</b></div>" : "") + (m.faculty && m.faculty !== "-" ? "<div><small>Fakultet / bo'lim</small><b>" + esc(m.faculty) + "</b></div>" : "") + "</div>" +
    '<form class="form" data-form="phone" style="margin-top:16px">' + field("Telefon raqami" + (m.role === "tutor" ? " (ota-onalar ko'radi)" : ""), "phone", { type: "tel", val: m.phone, ph: "+998 90 123 45 67" }) + '<button class="btn ghost" type="submit">Saqlash</button></form>') +
    card("Parolni o'zgartirish", '<form class="form" data-form="password">' + field("Joriy parol", "old", { type: "password", req: true, attrs: ' autocomplete="current-password"' }) + field("Yangi parol", "password", { type: "password", req: true, hint: "kamida 6 belgi", attrs: ' autocomplete="new-password" minlength="6"' }) + '<button class="btn" type="submit">O\'zgartirish</button></form>' +
      '<div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--line2)"><button class="btn bad" data-act="logout">' + ic("out") + "Tizimdan chiqish</button></div>") + "</div>";
};
V.common.rules = () => {
  const R = S.rules;
  const who = { student: "Talaba kiritadi → tyutor tasdiqlaydi", ref: "Talaba ma'lumotnoma to'ldiradi → tyutor baholaydi", tutor: "Tyutor baholaydi", hemis: "HEMIS tizimidan avtomatik" };
  return '<p class="lead">Ijtimoiy faollik indeksi (IFI) — 100 ballik tizim, 11 ta band. Hisob-kitob HEMIS «Ijtimoiy faollik indeksi» yo\'riqnomasi (2025–2026) va IFI baholash jadvali asosida.</p>' +
    '<div class="grid">' + card("IFI: 11 band", '<div class="tw"><table class="t"><thead><tr><th>№</th><th>Yo\'nalish</th><th>Kim kiritadi / baholaydi</th><th class="n">Maks.</th></tr></thead><tbody>' +
      R.crit.map((c) => "<tr><td>" + c.n + "</td><td><b>" + esc(c.name) + '</b><br><small class="muted">' + esc(c.hint) + "</small></td><td>" + esc(who[c.who]) + (c.future ? '<br><small class="muted">' + esc(c.future) + "</small>" : "") + '</td><td class="n"><b>' + c.max + "</b></td></tr>").join("") +
      '<tr><td></td><td><b>Jami</b></td><td></td><td class="n"><b>100</b></td></tr></tbody></table></div>') +
    '<div class="grid g2">' + card("GPA qanday hisoblanadi", '<p class="note"><b>GPA = Σ (baho × kredit) ÷ Σ kredit</b><br>Har bir fan bo\'yicha 100 ballik natija 5 ballik bahoga aylantiriladi, so\'ng kredit og\'irligi bilan o\'rtacha olinadi. GPA <b>joriy o\'quv yilining yakunlangan modullari</b> bo\'yicha hisoblanadi va har modul tugagach yangilanadi. Hali modul tugamagan bo\'lsa — «Kutilmoqda».</p>' +
      '<div class="tw" style="margin-top:12px"><table class="t"><thead><tr><th>100 ballik natija</th><th>Baho</th></tr></thead><tbody>' + R.gradeT.map((g, i) => "<tr><td>" + g[0] + "–" + (i ? R.gradeT[i - 1][0] - 1 : 100) + "</td><td><b>" + g[1] + "</b> · " + esc(g[2]) + "</td></tr>").join("") + "</tbody></table></div>" +
      '<p class="small muted" style="margin:12px 0 0">Misol: Statistika 6 kredit, baho 5; Falsafa 4 kredit, baho 4 → GPA = (5×6 + 4×4) ÷ 10 = 4,60</p>') +
    card("GPA → IFI 3-band bali", '<div class="tw"><table class="t"><thead><tr><th>GPA</th><th class="n">Ball</th></tr></thead><tbody>' + R.gpaT.map((g) => "<tr><td>" + g[0].toFixed(1) + "</td><td class=\"n\">" + f1(g[1]) + "</td></tr>").join("") + '<tr><td>3,5 dan past</td><td class="n">0</td></tr></tbody></table></div>') + "</div>" +
    '<div class="grid g2">' + card("Davomat → IFI 6-band bali", '<p class="small muted" style="margin-top:0">Semestrda sababsiz qoldirilgan soatlar (1 para = ' + R.hoursPerPair + ' akademik soat). Sababli qoldirilgan va kechikishlar hisobga olinmaydi.</p><div class="tw"><table class="t"><tbody>' + R.attT.map((a) => "<tr><td>" + a[0] + '</td><td class="n"><b>' + a[1] + " ball</b></td></tr>").join("") + "</tbody></table></div>") +
    card("Darajalar va grant", '<div class="tw"><table class="t"><tbody>' + R.levels.map((l, i) => "<tr><td><b>" + l[0] + "–" + (i ? R.levels[i - 1][0] - 1 : 100) + "</b></td><td>" + esc(l[1]) + '<br><small class="muted">' + esc(l[2]) + "</small></td></tr>").join("") + "</tbody></table></div>" +
      '<p class="small muted" style="margin:12px 0 0">Kontrakt asosida o\'qiyotgan talaba IFI da yuqori natija ko\'rsatsa, grant asosida o\'qishga o\'tkazilishi mumkin.</p>') + "</div>" +
    card("Grant qanday taqsimlanadi", '<p class="note"><b>Grant bali = GPA × ' + R.grant.gpaWeight + " + IFI ÷ " + R.grant.ifiDivisor + "</b> (maks. 80 + 20 = 100 ball).</p>" +
      '<ul style="margin:12px 0 0;padding-left:18px;display:grid;gap:6px"><li><b>Ta\'lim granti:</b> joriy o\'quv yili GPA si kamida ' + f1(R.grant.gpaMin) + ". Talabalar fakultet, ta'lim yo'nalishi va kurs bo'yicha grant bali asosida saralanadi; o'rinlar soni (to'liq va 50%) dekanat tomonidan kiritiladi.</li>" +
      "<li><b>Intizomiy jazo:</b> har biri IFI dan " + R.grant.penalty + " ball ayiradi.</li>" +
      "<li><b>Universitet granti:</b> GPA " + R.uniGrant.slice().reverse().map((u) => f1(u[0]) + " → " + u[1] + "%").join(", ") + " (kontrakt to'lovidan chegirma).</li>" +
      "<li><b>Qo'shimcha davlat granti:</b> GPA kamida " + R.grant.extraGpaMin + " va ijtimoiy himoya reyestrida (qizil yoki sariq daftar) bo'lgan talabalar uchun.</li></ul>") +
    card("Ma'lumot manbalari", '<div class="kv"><div><small>HEMIS</small><b>GPA (3-band), davomat (6-band), kitobxonlik testi (1-band)</b></div><div><small>Edu</small><b>Dars jadvali</b></div><div><small>UniverLife</small><b>Arizalar, tyutor baholari, QR-davomat, to\'garaklar</b></div></div>' +
      '<p class="note warn" style="margin:12px 0 0">MVP bosqichida HEMIS va Edu ulanmagan: GPA va jadval namunaviy ma\'lumotlardan, davomat soatlari tyutor belgilashlaridan olinadi. To\'liq versiyada bu ma\'lumotlar HEMIS va Edu dan avtomatik keladi.</p>') + "</div>";
};
V.common.news = (r) => {
  const A = S.articles || [];
  const img = (a) => "/img/" + (a.img || ["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8", "a9", "a10"][Math.abs(String(a.id).split("").reduce((x, ch) => x + ch.charCodeAt(0), 0)) % 10]) + ".jpg";
  if (r.parts[1]) {
    const a = A.find((x) => x.id === r.parts[1]);
    if (!a) return card("", empty("Yangilik topilmadi."));
    return { title: "Yangiliklar", html: '<article class="art"><a href="#/news" class="small">' + "← Barcha yangiliklar</a><h2 style=\"font-size:26px;margin-top:12px\">" + esc(a.title) + '</h2><div class="muted small" style="margin-top:6px">' + chip(a.tag || "Yangilik", "pri") + " · " + fmtDate(a.date) + '</div><div class="im" style="background-image:url(' + img(a) + ')"></div>' + (a.body || []).map((p) => "<p>" + esc(p) + "</p>").join("") + "</article>" };
  }
  return A.length ? '<div class="news">' + A.map((a) => '<a class="nc" href="#/news/' + esc(a.id) + '"><div class="im" style="background-image:url(' + img(a) + ')"></div><div class="b"><small>' + esc(a.tag || "Yangilik") + " · " + fmtShort(a.date) + "</small><b>" + esc(a.title) + "</b></div></a>").join("") + "</div>" : card("", empty("Yangiliklar yo'q."));
};


const crit = (id) => (S.rules.crit || []).find((c) => c.id === id);
const WHO = { student: "Talaba kiritadi · tyutor tasdiqlaydi", ref: "Ma'lumotnoma (namuna bo'yicha) · tyutor baholaydi", tutor: "Tyutor baholaydi", hemis: "HEMIS'dan avtomatik" };
function scheduleView(rows, opt) {
  opt = opt || {};
  const td = isoDay(today());
  const d = ui.schedDay || (td <= 6 ? td : 1);
  const days = [1, 2, 3, 4, 5, 6].map((i) => '<button class="' + (i === d ? "on " : "") + (i === td ? "td" : "") + '" data-act="sday" data-d="' + i + '">' + DSHORT[i] + "<small>" + (i === td ? "bugun" : (rows || []).filter((x) => x.day === i).length + " para") + "</small></button>").join("");
  const L = (rows || []).filter((x) => x.day === d);
  return '<div class="days">' + days + "</div>" + card(DAYS[d] + (d === td ? " · bugun" : ""), L.length ? '<div class="list">' + L.map((x) => '<div class="lesson"><div class="tm"><b>' + x.pair + '-para</b><small>' + esc(S.pairs[x.pair] || "") + '</small></div><div class="t"><b>' + esc(x.subject) + "</b><small>" + esc(x.kind) + " · " + esc(x.room) + " · " + esc(x.teacher) + "</small></div></div>").join("") + "</div>" : empty("Bu kuni dars yo'q."), src("Edu · MVP namunaviy jadval"));
}
function todayLessons(rows) {
  const td = isoDay(today());
  const L = (rows || []).filter((x) => x.day === td);
  return L.length ? '<div class="list">' + L.map((x) => '<div class="row"><span class="date"><b>' + x.pair + "</b><small>para</small></span><span class=\"t\"><b>" + esc(x.subject) + "</b><small>" + esc(S.pairs[x.pair] || "") + " · " + esc(x.room) + "</small></span></div>").join("") + "</div>" : empty(td === 7 ? "Bugun yakshanba — dars yo'q." : "Bugun dars yo'q.");
}
const ST_ATT = { kelmadi: ["Kelmadi", "bad"], sababli: ["Sababli", "pri"] };
function todayStatus(st) {
  const a = st.att;
  if (!a.todayPairs) return '<p class="note">Bugun jadval bo\'yicha dars yo\'q.</p>';
  if (!a.todayDone.length) return '<p class="note">Bugungi davomat hali belgilanmagan (' + a.todayPairs + " para).</p>";
  if (!a.today.length) return '<p class="note ok"><b>Bugun darslarda qatnashdi.</b> Tyutor ' + a.todayDone.length + " ta para bo'yicha belgiladi.</p>";
  return '<p class="note bad"><b>Bugungi davomat:</b> ' + a.today.map((m) => m.pair + "-para (" + esc(m.subject || "") + ") — " + (ST_ATT[m.status] || [m.status])[0].toLowerCase()).join("; ") + "</p>";
}
function attView(st, opt) {
  opt = opt || {};
  const a = st.att, h = st.absH, pts = (st.ifi && st.ifi.v.att) || 0;
  const by = {};
  a.marks.forEach((m) => (by[m.date] = by[m.date] || []).push(m));
  const days = Object.keys(by).sort().reverse();
  return '<div class="grid g4" style="margin-bottom:16px">' + stat("Sababsiz qoldirilgan", h + " <span>soat</span>", "IFI 6-band: " + pts + " / 5 ball", h > 30 ? "bad" : h > 15 ? "warn" : "ok") + stat("Davomat", a.rate + "%", a.held + " para belgilangan") +
    stat("Qoldirilgan para", a.miss, "sababsiz", a.miss > 7 ? "warn" : "") + stat("Sababli", a.excused, "para") + "</div>" +
    (opt.today ? todayStatus(st) + "<div style=\"height:16px\"></div>" : "") +
    card("Qayd etilgan holatlar <small>" + esc(S.semester.name) + "</small>", days.length ? '<div class="list">' + days.map((d) => '<div class="row"><span class="date"><b>' + Number(d.slice(8)) + "</b><small>" + MONTHS[Number(d.slice(5, 7)) - 1].slice(0, 3) + '</small></span><span class="t">' +
      by[d].map((m) => "<small>" + m.pair + "-para · " + esc(m.subject || "—") + " " + chip((ST_ATT[m.status] || [m.status])[0], (ST_ATT[m.status] || [, ""])[1]) + "</small>").join("") + "</span></div>").join("") + "</div>"
      : empty("Bu semestrda dars qoldirilmagan. Barakalla!"), src("Tyutor davomati · to'liq versiyada HEMIS")) +
    '<p class="small muted" style="margin-top:12px">IFI 6-bandi: 0–10 soat — 5 ball, 11–15 — 4, 16–25 — 3, 26–30 — 2, 31 va undan ko\'p — 0. Faqat sababsiz qoldirilgan soatlar hisoblanadi (1 para = 2 soat).</p>';
}

const gpaSegs = [{ from: 2, to: 3.5, label: "Grantsiz", tone: "warn" }, { from: 3.5, to: 4.5, label: "Grantga mos", tone: "pri" }, { from: 4.5, to: 5, label: "A'lo", tone: "ok" }];
function gpaHero(A, opt) {
  opt = opt || {};
  const done = A.modules.filter((m) => m.done).length;
  const note = A.gpa == null ? "Modul tugagach GPA shu yerda chiqadi." + (A.prev ? " O'tgan yil: <b>" + f2(A.prev.gpa) + "</b>" : "")
    : A.gpa >= 3.5 ? "Grant chegarasidan <b>+" + f2(A.gpa - 3.5) + "</b> yuqori" : "Grant uchun <b>" + f2(3.5 - A.gpa) + "</b> yetmayapti";
  return card("", '<div class="hero"><div><div class="big">' + (A.gpa == null ? '<span style="font-size:24px;color:var(--muted)">Kutilmoqda</span>' : f2(A.gpa) + " <span>/ 5</span>") + '</div><p class="small muted" style="margin-top:6px">' + esc(A.year) + " · " + done + " / " + A.modules.length + " modul</p></div>" +
    '<div class="hx">' + scale({ segs: gpaSegs, value: A.gpa, min: 2, max: 5, fmt: f2, cuts: [{ at: 3.5, label: "3,5" }] }) + '<p class="scale-note">' + note + "</p></div></div>" + (opt.extra || ""));
}
function gpaView(st) {
  const A = st.acad;
  if (!A || (!A.modules.length && !A.sems.length)) return card("", empty("HEMIS'dan akademik ma'lumot topilmadi."));
  const gp = (L) => '<div class="gpills">' + L.map((x) => '<div class="gp"><span><b>' + esc(x.subject) + "</b><br><small>" + x.credits + " kredit" + (x.score != null ? " · " + x.score + " ball" : "") + '</small></span><span></span><span class="g' + (x.grade ? " gr" + x.grade : "") + '">' + (x.grade || "—") + "</span></div>").join("") + "</div>";
  const cur = A.modules.find((m) => !m.done);
  const stp = steps(A.modules.map((m) => ({ label: m.n + "-modul", sub: m.done ? "GPA " + f2(m.gpa) : m === cur ? "hozir" : "keyin", state: m.done ? "done" : m === cur ? "now" : "next" })));
  return gpaHero(A, { extra: '<div style="margin-top:18px">' + stp + "</div>" }) + '<div style="height:16px"></div>' +
    '<div class="grid g2">' + A.modules.map((m) => card(m.n + "-modul", gp(m.subjects), m.done ? chip("GPA " + f2(m.gpa), "ok") : m === cur ? chip("Hozir", "warn") : chip("Keyin"))).join("") + "</div>" +
    (A.sems.length ? '<details class="more"><summary>O\'tgan semestrlar · ' + A.sems.map((s) => f2(s.gpa)).join(" · ") + '</summary><div class="grid g2" style="margin-top:12px">' +
      A.sems.map((s) => card(esc(s.sem), gp(s.subjects), chip("GPA " + f2(s.gpa)))).join("") + "</div></details>" : "");
}


const OUTCOME = { full: ["To'liq grant", "ok"], half: ["50% grant", "ok"], none: ["O'rindan tashqari", "warn"], low: ["GPA 3,5 dan past", "bad"], pending: ["Kutilmoqda", ""], noquota: ["O'rinlar yo'q", ""] };
const outChip = (o) => chip((OUTCOME[o] || [o])[0], (OUTCOME[o] || [, ""])[1]);
const yes = (ok, t, sub) => '<div class="' + (ok ? "y" : "") + '"><span class="ic">' + ic(ok ? "check" : "x") + "</span><span>" + t + "</span><small>" + sub + "</small></div>";

function grantView(st) {
  const g = st.grant, A = st.acad, R = S.rules.grant, ifi = st.ifi ? st.ifi.total : 0;
  if (!g) return "";
  if (A.gpa == null) return card("Grant", '<div class="hero"><div class="big"><span style="font-size:24px;color:var(--muted)">Kutilmoqda</span></div><div class="hx"><p>Grant bali joriy yil GPA si bilan hisoblanadi — <b>modul tugagach chiqadi</b>.</p></div></div>', chip("Kutilmoqda"));
  const reg = (st.social || []).some((x) => x.cat === "reestr" && x.status === "tasdiqlandi"); // ijtimoiy himoya reyestri (anketa → toifa)
  const lo = Math.max(0, Math.floor(Math.min(g.score, g.cut.half ?? g.score, g.cut.full ?? g.score) / 10) * 10 - 10);
  const segs = [], cuts = [];
  const h = g.cut.half, f = g.cut.full;
  if (f != null) {
    if (h != null && h < f) { segs.push({ from: lo, to: h, label: "Grantsiz", tone: "warn" }, { from: h, to: f, label: "50%", tone: "pri" }); cuts.push({ at: h, label: f1(h) }); }
    else segs.push({ from: lo, to: f, label: "Grantsiz", tone: "warn" });
    segs.push({ from: f, to: 100, label: "To'liq", tone: "ok" }); cuts.push({ at: f, label: f1(f) });
  } else segs.push({ from: lo, to: 100, label: "Grant bali", tone: "pri" });
  const need = g.outcome === "full" ? "" : f != null && g.outcome !== "low" ? (g.outcome === "half" ? "To'liq grantga <b>" + f1(f - g.score + 0.1) + "</b> ball yetmayapti" : h != null ? "50% grantga <b>" + f1(h - g.score + 0.1) + "</b> ball yetmayapti" : "") : "";
  return card("Grant", '<div class="hero"><div><div class="big">' + f1(g.score) + ' <span>/ 100</span></div><p class="small muted" style="margin-top:6px">' + (g.pos ? g.pos + "-o'rin / " + g.of : "reytingda emas") + "</p></div>" +
    '<div class="hx">' + scale({ segs, value: g.score, min: lo, max: 100, fmt: f1, cuts }) + (need ? '<p class="scale-note">' + need + "</p>" : g.outcome === "low" ? '<p class="scale-note" style="color:var(--bad)">GPA kamida 3,5 bo\'lishi kerak</p>' : "") + "</div></div>" +
    '<div class="checks">' + yes(g.outcome === "full" || g.outcome === "half", "Ta'lim granti", g.outcome === "full" || g.outcome === "half" ? OUTCOME[g.outcome][0] : "GPA ≥ 3,5 + reyting") +
      yes(!!g.uniPct, "Universitet granti", g.uniPct ? g.uniPct + "% chegirma" : "GPA 3,3–3,99") + yes(g.extra && reg, "Qo'shimcha davlat granti", g.extra ? (reg ? "reyestrda · GPA mos" : "GPA mos · reyestr kerak") : "GPA ≥ 4 + reyestr") + "</div>" +
    '<details class="more"><summary>Qanday hisoblanadi?</summary><div class="kv" style="margin-top:10px"><div><small>GPA × ' + R.gpaWeight + "</small><b>" + f1(A.gpa * R.gpaWeight) + " / 80</b></div><div><small>IFI ÷ " + R.ifiDivisor + "</small><b>" + f1(ifi / R.ifiDivisor) + " / 20</b></div><div><small>Grant bali</small><b>" + f1(g.score) + "</b></div></div>" +
    (st.ifi.penalty ? '<p class="small" style="color:var(--bad);margin:8px 0 0">Intizomiy jazo: IFI −' + st.ifi.penalty + "</p>" : "") + "</details>", outChip(g.outcome));
}

function contractView(st) {
  const k = st.contract;
  if (!k) return card("Kontrakt", st.payType === "grant" ? '<p class="muted" style="margin:0">Grant asosida — to\'lov yo\'q</p>' : empty("Ma'lumot kiritilmagan"));
  return card("Kontrakt <small>" + esc(k.year) + "</small>", '<div class="hero"><span class="mr ' + (k.pct >= 100 ? "ok" : k.pct < 50 ? "bad" : "warn") + '" style="--p:' + k.pct + ';width:76px;height:76px"><i style="width:60px;height:60px;font-weight:800;font-size:16px;color:var(--ink)">' + k.pct + "%</i></span>" +
    '<div class="hx" style="min-width:180px"><div class="kv"><div><small>To\'langan</small><b>' + som(k.paid) + "</b></div><div><small>Qoldiq</small><b" + (k.left ? ' style="color:var(--bad)"' : "") + ">" + som(k.left) + '</b></div></div><p class="small muted" style="margin:8px 0 0">Jami: ' + som(k.due) + "</p></div></div>", k.pct >= 100 ? chip("To'langan", "ok") : chip("Qarz bor", "bad"));
}


const ifiSegs = [{ from: 0, to: 40, label: "Quyi", tone: "bad" }, { from: 40, to: 60, label: "O'rta", tone: "warn" }, { from: 60, to: 80, label: "Yaxshi", tone: "pri" }, { from: 80, to: 100, label: "A'lo", tone: "ok" }];
function ifiSummary(st) {
  const sc = st.ifi || { total: 0, v: {}, level: "" }, tot = sc.total, C = S.rules.crit;
  const next = ifiSegs.find((s) => s.from > tot);
  const part = (who) => { const cs = C.filter((c) => who.includes(c.who)); return [cs.reduce((a, c) => a + (sc.v[c.id] || 0), 0), cs.reduce((a, c) => a + c.max, 0)]; };
  const P = [["Arizalar", part(["student", "ref"]), "pri"], ["Tyutor", part(["tutor"]), "ok"], ["HEMIS", part(["hemis"]), "warn"]];
  return card("", '<div class="hero"><div><div class="big">' + f1(tot) + ' <span>/ 100</span></div><p class="small muted" style="margin-top:6px">' + esc(sc.level) + (st.rank ? " · guruhda " + st.rank.ifi.grp.pos + "-o'rin" : "") + "</p></div>" +
    '<div class="hx">' + scale({ segs: ifiSegs, value: tot, fmt: f1 }) + '<p class="scale-note">' + (next ? "<b>" + next.label + "</b> darajaga <b>" + f1(next.from - tot) + "</b> ball qoldi" : "Eng yuqori daraja") + "</p></div></div>" +
    '<div class="legend" style="margin:16px 0 0">' + P.map((p) => '<span><i style="background:var(--' + p[2] + ')"></i>' + p[0] + " <b>" + f1(p[1][0]) + "</b>/" + p[1][1] + "</span>").join("") + "</div>" +
    (sc.penalty ? '<p class="note bad" style="margin:12px 0 0"><b>Intizomiy jazo −' + sc.penalty + "</b> · " + esc((st.discipline || []).map((d) => d.reason).join("; ")) + "</p>" : ""));
}
function entryLine(e, opt) {
  const t = e.fields && (e.fields.title || e.fields.place) ? (e.fields.title || e.fields.place) : e.title || e.note || "";
  const acts = [];
  if (opt.student && e.status !== "tasdiqlandi" && (e.source === "student" || e.source === "doc")) acts.push('<button class="btn sm ghost" data-act="ifi-del" data-id="' + esc(e.id) + '">O\'chirish</button>');
  if (crit(e.crit) && crit(e.crit).who === "ref" && e.source === "student") acts.push('<a class="btn sm ghost" href="#/ref/' + esc(e.id) + '">' + ic("print") + "Ma'lumotnoma</a>");
  else if (e.files && e.files.length) acts.push('<button class="btn sm ghost" data-act="file" data-id="' + esc(e.files[0]) + '">Hujjat</button>');
  return '<div class="ent">' + stChip(e.status) + "<span>" + esc(e.subName) + (t ? " · " + esc(t) : "") + (e.source === "qr" ? " · QR" : e.source === "tutor" ? " · tyutor" : e.source === "club" ? " · klub" : "") + "</span>" + acts.join("") + "</div>" +
    (e.status === "rad" && e.comment ? '<div class="note bad small" style="padding:8px 10px">Tyutor izohi: ' + esc(e.comment) + "</div>" : "");
}
function tutorScoreForm(st, c) {
  const mine = st.entries.filter((e) => e.crit === c.id && e.source === "tutor").map((e) => e.sub);
  const subs = c.id === "enlight" ? c.subs : c.subs;
  return '<form class="form" data-form="tutorset" style="gap:8px"><input type="hidden" name="crit" value="' + c.id + '"><input type="hidden" name="login" value="' + esc(st.login) + '"><div class="opts">' +
    subs.map((s) => '<label class="opt"><input type="checkbox" name="subs" value="' + s.id + '"' + (mine.includes(s.id) ? " checked" : "") + "><span>" + esc(s.name) + (c.id === "enlight" && s.id === "part" ? ' <small class="muted">(belgilamasangiz, QR davomatidan)</small>' : "") + "</span><em>" + s.pts + "</em></label>").join("") +
    '</div><button class="btn sm" type="submit">Saqlash</button></form>';
}
function ifiCrits(st, opt) {
  opt = opt || {};
  const sc = st.ifi || { v: {}, info: {} };
  return '<div class="legend"><span>' + ic("info") + " Bandni bosing — tafsilot va ariza</span></div>" + '<div class="bands">' + S.rules.crit.map((c) => {
    const v = sc.v[c.id] || 0, E = st.entries.filter((e) => e.crit === c.id);
    let extra = "";
    if (c.id === "acad") extra = '<div class="ent"><span>GPA ' + f2((sc.info.acad || {}).gpa || 0) + " · " + esc((sc.info.acad || {}).year || "") + ((sc.info.acad || {}).basis === "oldingi" ? " (o'tgan yil)" : "") + '</span><a class="btn sm ghost" href="' + (opt.base || "#/") + 'gpa">GPA</a></div>';
    if (c.id === "att") extra = '<div class="ent"><span>Sababsiz: ' + ((sc.info.att || {}).hours || 0) + ' soat</span><a class="btn sm ghost" href="' + (opt.base || "#/") + 'attendance">Davomat</a></div>';
    if (c.id === "enlight" && sc.info.enlight) extra = '<div class="ent"><span>Ma\'rifat darslari: ' + sc.info.enlight.n + " / " + sc.info.enlight.held + " (QR)</span></div>";
    if (c.id === "culture" && sc.info.culture) extra = '<div class="ent"><span>Tashrif bo\'lgan oylar: ' + sc.info.culture.months + " / " + sc.info.culture.need + "</span></div>";
    const can = opt.student && (c.who === "student" || c.who === "ref");
    const ents = E.filter((e) => !(c.id === "enlight" && e.source === "qr")).slice(0, 6);
    const pend = E.some((e) => e.status === "kutilmoqda");
    return '<details class="band' + (v >= c.max ? " full" : "") + '"><summary><span class="num">' + (v >= c.max ? ic("check") : c.n) + '</span><span class="nm"><b>' + esc(c.name) + "</b>" + bar(v, c.max, v >= c.max ? "ok" : "") + '</span><span class="pt">' + f1(v) + " <span>/ " + c.max + "</span>" + (pend ? '<br><small style="color:var(--warn);font-size:11px;font-weight:700">kutilmoqda</small>' : "") + "</span></summary>" +
      '<div class="bd"><p>' + esc(c.hint) + '</p><div class="who" style="margin-top:10px">' + chip(WHO[c.who], c.who === "hemis" ? "warn" : c.who === "tutor" ? "pri" : "") + "</div>" +
      (extra || ents.length ? '<div class="ents">' + extra + ents.map((e) => entryLine(e, opt)).join("") + "</div>" : "") +
      (opt.canScore && c.who === "tutor" || opt.canScore && (c.id === "public" || c.id === "spirit") ? '<div style="margin-top:10px">' + tutorScoreForm(st, c) + "</div>" : "") +
      (can ? '<div class="acts"><a class="btn sm" href="#/ifi/new/' + c.id + '">' + ic("plus") + (c.who === "ref" ? "Ma'lumotnoma" : "Ariza berish") + "</a></div>" : "") + "</div></details>";
  }).join("") + "</div>";
}
function ifiView(st, opt) {
  opt = opt || {};
  const tab = opt.tab || "crit";
  const E = st.entries.filter((e) => e.source !== "tutor");
  const pend = E.filter((e) => e.status === "kutilmoqda").length;
  const appsHref = opt.appsHref || opt.href + (opt.href.indexOf("?") >= 0 ? "&" : "?") + "tab=apps";
  const tabs = '<div class="tabs"><a href="' + opt.href + '" class="' + (tab === "crit" ? "on" : "") + '">Bandlar</a><a href="' + appsHref + '" class="' + (tab === "apps" ? "on" : "") + '">Arizalar' + (pend ? "<em>" + pend + "</em>" : "") + "</a></div>";
  let body;
  if (tab === "apps") body = card("", E.length ? '<div class="list">' + E.map((e) => '<div class="row" style="align-items:flex-start"><span class="date"><b>' + e.n + '</b><small>band</small></span><span class="t"><b>' + esc(e.critName) + "</b><small>" + esc(e.subName) + " · " + fmtDate(e.date) + (e.fields && e.fields.title ? " · " + esc(e.fields.title) : e.fields && e.fields.place ? " · " + esc(e.fields.place) : "") + "</small>" +
    (e.status === "rad" && e.comment ? '<small style="color:var(--bad)">Izoh: ' + esc(e.comment) + "</small>" : "") + (e.flags && e.flags.length ? '<small style="color:var(--warn)">' + esc(e.flags.join("; ")) + "</small>" : "") + "</span>" + stChip(e.status) + "</div>" + '<div style="display:flex;gap:6px;justify-content:flex-end;margin:-4px 0 6px">' + entryActions(e, opt) + "</div>").join("") + "</div>" : empty("Hali ariza yo'q."));
  else body = ifiCrits(st, opt);
  return ifiSummary(st) + '<div style="height:16px"></div>' + tabs + body;
}
function entryActions(e, opt) {
  const a = [];
  if (crit(e.crit) && crit(e.crit).who === "ref" && e.source === "student") a.push('<a class="btn sm ghost" href="#/ref/' + esc(e.id) + '">' + ic("print") + "Ma'lumotnoma</a>");
  else if (e.files && e.files.length) a.push('<button class="btn sm ghost" data-act="file" data-id="' + esc(e.files[0]) + '">Hujjatni ko\'rish</button>');
  if (opt.student && e.status !== "tasdiqlandi" && (e.source === "student" || e.source === "doc")) a.push('<button class="btn sm ghost" data-act="ifi-del" data-id="' + esc(e.id) + '">O\'chirish</button>');
  return a.join("");
}
function exView(st, opt) {
  opt = opt || {};
  const X = st.explanations || [];
  if (!X.length) return card("", empty("Tushuntirish xatlari yo'q."));
  const open = X.filter((x) => x.status === "so'ralgan" || x.status === "rad etildi");
  return '<div class="grid g2">' + open.concat(X.filter((x) => !open.includes(x))).map((x) => exLetter(x, st, opt)).join("") + "</div>";
}
const NK = { kuchli: ["Kuchli tomoni", "ok"], kuchsiz: ["Kuchsiz tomoni", "bad"], izoh: ["Izoh", "pri"] };
function notesView(st, opt) {
  opt = opt || {};
  const N = st.notes || [];
  return (opt.tutor ? card("Izoh qo'shish", '<form class="form" data-form="note"><input type="hidden" name="login" value="' + esc(st.login) + '"><div class="seg" role="radiogroup">' + Object.keys(NK).map((k, i) => '<label style="cursor:pointer"><input type="radio" name="kind" value="' + k + '"' + (i === 2 ? " checked" : "") + ' class="sr"><span class="pchip" style="display:inline-block;padding:6px 12px">' + NK[k][0] + "</span></label>").join("") + "</div>" +
    field("Matn", "text", { type: "textarea", req: true, rows: 3, ph: "Xarakteri, o'zlashtirishi, muammolari haqida qisqacha" }) + '<p class="small muted" style="margin:0">Izohlar ota-onaga ko\'rinadi.</p><button class="btn" type="submit">Saqlash</button></form>') + '<div style="height:16px"></div>' : "") +
    card(opt.tutor ? "Izohlar" : "Tyutor izohlari", N.length ? '<div class="list">' + N.map((n) => '<div class="row" style="align-items:flex-start"><span class="t">' + chip(NK[n.kind] ? NK[n.kind][0] : n.kind, NK[n.kind] ? NK[n.kind][1] : "") + "<b style=\"margin-top:6px;white-space:normal\">" + esc(n.text) + "</b><small>" + esc(n.by) + " · " + ago(n.created) + "</small></span>" + (opt.tutor ? '<button class="btn sm ghost" data-act="note-del" data-id="' + esc(n.id) + '">O\'chirish</button>' : "") + "</div>").join("") + "</div>" : empty("Hali izoh yo'q."));
}




const PST = { "so'ralgan": ["To'ldirilmagan", "warn"], qoralama: ["Qoralama", "warn"], yuborilgan: ["Tekshiruvda", "pri"], qaytarilgan: ["Qaytarildi", "bad"], tasdiqlangan: ["Tasdiqlangan", "ok"] };
const profChip = (p) => (p ? chip(PST[p.status][0], PST[p.status][1]) : chip("So'ralmagan"));
const FIELDS = () => (S.profileForm || []).flatMap((s) => s.fields);
const filled = (f, v) => (f.type === "file" ? Array.isArray(v) && v.length > 0 : String(v ?? "").trim() !== "");
const required = (f, d) => !!f.req || (!!f.when && f.when[1].includes(String(d[f.when[0]] ?? "")));

function secProgress(sec, d) {
  const R = sec.fields.filter((f) => f.type !== "auto" && required(f, d));
  return { ok: R.filter((f) => filled(f, d[f.k])).length, of: R.length };
}
function progress(d) {
  const R = FIELDS().filter((f) => f.type !== "auto" && required(f, d)), ok = R.filter((f) => filled(f, d[f.k])).length;
  return { ok, of: R.length, pct: R.length ? Math.round((ok / R.length) * 100) : 100 };
}
const autoVal = (st, k) => ({ fio: st.surname + " " + st.name, course: (st.course ? st.course + "-kurs · " : "") + st.grp, direction: st.direction || "—" })[k] || "";
const fileBtns = (ids) => ids.map((id, i) => '<button type="button" class="btn sm ghost" data-act="file" data-id="' + esc(id) + '">' + ic("doc") + (i + 1) + "-fayl</button>").join("");


function inputOf(st, f, d) {
  const lab = esc(f.label) + (f.req ? ' <b class="req">*</b>' : "");
  if (f.type === "auto") return '<div class="fl pf-auto"><span>' + esc(f.label) + "</span><b>" + esc(autoVal(st, f.k)) + "</b></div>";
  if (f.type === "file") {
    const have = Array.isArray(d[f.k]) ? d[f.k] : [], key = "pf_" + f.k;
    return '<div class="fl"><span>' + lab + " <small>" + (f.img ? "rasm" : "rasm yoki PDF") + ", 3 tagacha</small></span>" +
      (have.length ? '<div class="pf-files">' + have.map((id, i) => '<span><input type="hidden" name="keep_' + f.k + '" value="' + esc(id) + '"><button type="button" class="btn sm ghost" data-act="file" data-id="' + esc(id) + '">' + ic("doc") + (i + 1) + '-fayl</button><button type="button" class="ib sm" data-act="pf-rm" aria-label="Olib tashlash">' + ic("x") + "</button></span>").join("") + "</div>" : "") +
      '<label class="drop sm">' + ic("plus") + "<b>" + (f.img ? "Rasm tanlash" : "Fayl tanlash") + '</b><input type="file" data-files="' + key + '" accept="' + (f.img ? "image/*" : "image/*,application/pdf") + '"' + (f.img ? "" : " multiple") + '></label><div class="thumbs" id="thumbs-' + key + '"></div></div>';
  }
  const opts = f.type === "select" ? [["", "Tanlang"]].concat(f.opts.map((o) => [o, o])) : undefined;
  return field(lab, "p_" + f.k, { type: f.type, val: d[f.k] || "", opts, ph: f.ph, hint: f.hint, rows: 2, max: f.type === "date" ? S.today : undefined });
}
function anketaForm(st, d) {
  const P = S.profileForm || [];
  return '<form data-form="anketa" class="pf">' + P.map((sec, i) => {
    const pr = secProgress(sec, d), done = pr.of && pr.ok === pr.of;
    return '<section class="card pf-sec" id="pf-' + sec.id + '"><div class="ch"><h2><span class="pf-n' + (done ? " ok" : "") + '">' + (done ? ic("check") : i + 1) + "</span>" + esc(sec.title) + "</h2>" + (pr.of ? '<span class="small muted">' + pr.ok + " / " + pr.of + "</span>" : "") + "</div>" +
      '<div class="pf-grid">' + sec.fields.map((f) => '<div class="' + (f.wide || f.img ? "w" : "") + '">' + inputOf(st, f, d) + "</div>").join("") + "</div></section>";
  }).join("") +
    '<div class="sticky-act"><button class="btn ghost" type="submit" name="go" value="save">Saqlash</button><button class="btn" type="submit" name="go" value="send">' + ic("check") + "Tyutorga yuborish</button></div></form>";
}
function anketaHero(p, d, editing) {
  const pr = progress(d), s = p ? p.status : "so'ralgan";
  const msg = { "so'ralgan": "Tyutoringiz anketa to'ldirishni so'radi.", qoralama: "Tayyor bo'lgach, tyutorga yuboring.", yuborilgan: "Tyutor tekshirmoqda. Natija bildirishnoma orqali keladi.", qaytarilgan: "Tyutor tuzatishni so'radi.", tasdiqlangan: "Ma'lumotlaringiz tasdiqlangan." }[s];
  const P = S.profileForm || [];
  return card("", '<div class="hero"><span class="mr ' + (pr.pct >= 100 ? "ok" : "warn") + '" style="--p:' + pr.pct + ';width:76px;height:76px"><i style="width:60px;height:60px;font-weight:800;font-size:16px;color:var(--ink)">' + pr.pct + '%</i></span><div class="hx"><h2>Talaba anketasi ' + profChip(p || { status: "so'ralgan" }) + "</h2><p>" + msg + "</p>" +
    (p && p.status === "qaytarilgan" && p.note ? '<p class="note bad" style="margin:10px 0 0"><b>Tyutor izohi:</b> ' + esc(p.note) + "</p>" : "") + "</div></div>" +
    (editing ? '<div class="pf-nav">' + P.map((sec, i) => { const x = secProgress(sec, d), ok = x.of && x.ok === x.of; return '<button type="button" class="' + (ok ? "ok" : "") + '" data-act="pf-go" data-id="' + sec.id + '"><span>' + (ok ? ic("check") : i + 1) + "</span>" + esc(sec.title) + "</button>"; }).join("") + "</div>" : ""));
}


function anketaView(st, opt) {
  opt = opt || {};
  const p = st.profile, d = (p && p.data) || {};
  const req = opt.staff ? '<button class="btn sm ghost" data-act="pf-req" data-login="' + esc(st.login) + '">' + ic("mail") + (p ? "Yangilashni so'rash" : "Anketa so'rash") + "</button>" : "";
  if (!p || (!opt.self && (p.status === "so'ralgan"))) return card("Anketa", empty(p ? "Talaba hali to'ldirmagan." : "Anketa hali so'ralmagan.") + (req ? '<p style="text-align:center;margin:0">' + req.replace("ghost", "") + "</p>" : ""), profChip(p));
  const pr = progress(d);
  const review = opt.staff && p.status === "yuborilgan" ? card("Tekshirish", '<form class="form" data-form="pfreview"><input type="hidden" name="login" value="' + esc(st.login) + '">' + field("Izoh", "note", { ph: "Qaytarsangiz, nimani tuzatish kerakligini yozing" }) +
    '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ok" type="submit" name="decision" value="ok">' + ic("check") + 'Tasdiqlash</button><button class="btn bad" type="submit" name="decision" value="no">Qaytarish</button></div></form>', "", "pf-review") : "";
  const secs = (S.profileForm || []).map((sec) => {
    const rows = sec.fields.filter((f) => f.type === "auto" ? opt.staff : filled(f, d[f.k]));
    if (!rows.length) return "";
    return card(esc(sec.title), '<div class="kv pf-kv">' + rows.map((f) => "<div" + (f.wide ? ' class="w"' : "") + "><small>" + esc(f.label) + "</small><b>" +
      (f.type === "auto" ? esc(autoVal(st, f.k)) : f.type === "file" ? fileBtns(d[f.k]) : f.type === "date" ? fmtDate(d[f.k]) : esc(d[f.k])) + "</b></div>").join("") + "</div>");
  }).join("");
  if (opt.noHero) return '<div class="pf-cols">' + secs + "</div>";
  return review + card("", '<div class="hero"><span class="mr ' + (pr.pct >= 100 ? "ok" : "warn") + '" style="--p:' + pr.pct + ';width:64px;height:64px"><i style="width:50px;height:50px;font-weight:800;font-size:14px;color:var(--ink)">' + pr.pct + '%</i></span><div class="hx"><h2>Anketa ' + profChip(p) + "</h2><p>" +
    (p.sent ? "Yuborilgan: " + ago(p.sent) : "Yuborilmagan") + (p.status === "qaytarilgan" && p.note ? " · <b>Izoh:</b> " + esc(p.note) : "") + "</p></div>" + req + "</div>") + '<div style="height:16px"></div><div class="pf-cols">' + secs + "</div>";
}


function socialBlock(st, opt) {
  opt = opt || {};
  const L = st.social || [], staff = !!opt.staff;
  const row = (x) => '<div class="row soc"><span class="soc-i ' + (x.status === "tasdiqlandi" ? "ok" : x.status === "rad" ? "bad" : "") + '">' + ic(x.status === "rad" ? "x" : x.status === "tasdiqlandi" ? "check" : "info") + '</span><span class="t"><b>' + esc(x.name) + "</b><small>" + esc(x.note || "") + (x.comment ? " · " + esc(x.comment) : "") + "</small></span>" +
    fileBtns(x.files) + stChip(x.status) +
    (staff && x.status === "kutilmoqda" ? '<button class="btn sm ok" data-act="soc-ok" data-id="' + esc(x.id) + '">' + ic("check") + '</button><button class="btn sm bad" data-act="soc-no" data-id="' + esc(x.id) + '" aria-label="Rad etish">' + ic("x") + "</button>" : "") +
    ((staff || (opt.self && x.status !== "tasdiqlandi")) && !opt.readonly ? '<button class="ib sm" data-act="soc-del" data-id="' + esc(x.id) + '" aria-label="O\'chirish">' + ic("x") + "</button>" : "") + "</div>";
  const add = opt.readonly ? "" : '<button class="btn sm ghost" data-act="soc-add" data-login="' + esc(staff ? st.login : "") + '">' + ic("plus") + "Toifa qo'shish</button>";
  return card("Ijtimoiy toifa", (L.length ? '<div class="list">' + L.map(row).join("") + "</div>" : '<p class="muted" style="margin:0">' + (opt.self ? "Toifangiz bo'lsa (chin yetim, nogironlik, reyestr, sportchi va h.k.), hujjat bilan qo'shing. Tyutor tasdiqlaydi." : "Toifa yo'q.") + "</p>"), add);
}
function socialForm(login) {
  const C = S.socialCats || [];
  return '<form class="form" data-form="social"><input type="hidden" name="login" value="' + esc(login || "") + '">' + field("Toifa", "cat", { type: "select", opts: [["", "Tanlang"]].concat(C.map((c) => [c.id, c.name])) }) +
    field("Izoh", "note", { ph: "Masalan: guvohnoma raqami, sport turi" }) +
    '<div class="fl"><span>Tasdiqlovchi hujjat <small>' + (login ? "ixtiyoriy" : "chin yetim, nogironlik, reyestr, kam ta'minlangan uchun majburiy") + '</small></span><label class="drop sm">' + ic("plus") + '<b>Fayl tanlash</b><input type="file" data-files="soc" accept="image/*,application/pdf" multiple></label><div class="thumbs" id="thumbs-soc"></div></div>' +
    '<button class="btn" type="submit">' + (login ? "Qo'shish" : "Tyutorga yuborish") + "</button></form>";
}
function anketaPage() {
  const st = S.st, p = st.profile;
  const editing = !p || ["so'ralgan", "qoralama", "qaytarilgan"].includes(p.status) || (ui.PFEDIT && p.status === "tasdiqlangan");

  const def = p && p.updated && p.sent ? {} : { citizenship: "O'zbekiston", country: "O'zbekiston", eduForm: "Kunduzgi", eduLang: "O'zbek", phone: st.phone || "", jshir: st.jshir || "" };
  const d = Object.assign({}, def, (p && p.data) || {}, ui.PF || {});
  Object.keys(def).forEach((k) => { if (!d[k]) d[k] = def[k]; });
  return anketaHero(p, d, editing) + '<div style="height:16px"></div>' +
    (editing ? anketaForm(st, d) : anketaView(st, { self: true, noHero: true }) +
      (p.status === "tasdiqlangan" ? '<p style="margin-top:12px"><button class="btn ghost" data-act="pf-edit">' + ic("pen") + "O'zgartirish</button></p>" : "")) +
    '<div style="height:16px"></div>' + socialBlock(st, { self: true });
}


function anketaBoard(list, opt) {
  opt = opt || {};
  const n = (f) => list.filter(f).length, T = list.length || 1;
  const ok = n((x) => x.prof && x.prof.status === "tasdiqlangan"), rev = n((x) => x.prof && x.prof.status === "yuborilgan"), prog = n((x) => x.prof && ["so'ralgan", "qoralama", "qaytarilgan"].includes(x.prof.status)), none = n((x) => !x.prof);
  const order = { yuborilgan: 0, qaytarilgan: 2, qoralama: 3, "so'ralgan": 4, tasdiqlangan: 5 };
  const L = list.slice().sort((a, b) => (a.prof ? order[a.prof.status] : 9) - (b.prof ? order[b.prof.status] : 9) || a.surname.localeCompare(b.surname));
  const G = opt.groups || [];
  return (G.length ? '<div class="bar-row">' + G.map((g) => '<button class="btn sm" data-act="pf-req-grp" data-g="' + esc(g) + '">' + ic("mail") + (G.length > 1 ? esc(g) + " — " : "") + "so'rovnoma yuborish</button>").join("") + '<button type="button" class="btn sm ghost" data-act="export-excel"><i class="fa-solid fa-file-excel"></i> 1-klik Excelga yuklash (.CSV)</button><a class="btn sm ghost" href="/maps"><i class="fa-solid fa-map-location-dot"></i> Ijara xonadonlari xaritasi</a></div>' : "") +
    '<div style="margin-bottom:16px">' + tutorHousingMapWidget() + '</div>' +
    '<div class="kpis">' + kpi({ label: "Tasdiqlangan", value: ok, unit: "/ " + list.length, p: (ok / T) * 100, icon: "check", tone: "ok" }) + kpi({ label: "Tekshirish kerak", value: rev, p: (rev / T) * 100, icon: "inbox", tone: rev ? "warn" : "ok", sub: rev ? "yangi anketa" : "hammasi ko'rilgan" }) +
    kpi({ label: "To'ldirilmoqda", value: prog, p: (prog / T) * 100, icon: "pen" }) + kpi({ label: "So'ralmagan", value: none, p: (none / T) * 100, icon: "mail", tone: none ? "bad" : "ok" }) + "</div>" +
    card("Talabalar", '<div class="list">' + L.map((x) => '<a class="row" href="#/student/' + encodeURIComponent(x.login) + '?tab=anketa">' + ava(x.name + " " + x.surname) + '<span class="t"><b>' + esc(x.surname + " " + x.name) + "</b><small>" + esc(x.grp) + "</small></span>" +
      '<span class="pf-bar">' + (x.prof ? '<span class="bar ' + (x.prof.pct >= 100 ? "ok" : "") + '"><i style="width:' + x.prof.pct + '%"></i></span><small>' + x.prof.pct + "%</small>" : "") + "</span>" + profChip(x.prof) + "</a>").join("") + "</div>");
}
function socialQueue(Q) {
  return Q.length ? '<div class="grid g2">' + Q.map((x) => card("", '<div class="row" style="border:0;padding:0">' + ava(x.name) + '<span class="t"><b>' + esc(x.name) + "</b><small>" + esc(x.grp) + " · " + ago(x.created) + "</small></span>" + chip(x.catName, "pri") + "</div>" +
    (x.note ? '<p class="small" style="margin:10px 0 0">' + esc(x.note) + "</p>" : "") + (x.files.length ? '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:10px">' + fileBtns(x.files) + "</div>" : '<p class="small muted" style="margin:10px 0 0">Hujjat yo\'q</p>') +
    '<div style="display:flex;gap:8px;margin-top:12px"><button class="btn sm ok" data-act="soc-ok" data-id="' + esc(x.id) + '">' + ic("check") + 'Tasdiqlash</button><button class="btn sm bad" data-act="soc-no" data-id="' + esc(x.id) + '">Rad etish</button></div>')).join("") + "</div>" : card("", empty("Yangi so'rov yo'q."));
}


const CATS = () => [["", "Hammasi"], ["qiz", "Talaba qizlar"], ["grant", "Grant"], ["kontrakt", "Kontrakt"]].concat((S.socialCats || []).map((c) => [c.id, c.name])).concat([["noprof", "Anketasiz"]]);
function catTest(c) {
  if (!c) return () => true;
  if (c === "qiz") return (x) => x.gender === "Ayol";
  if (c === "grant" || c === "kontrakt") return (x) => x.payType === c;
  if (c === "noprof") return (x) => !x.prof || x.prof.status !== "tasdiqlangan";
  return (x) => (x.cats || []).includes(c);
}
function catChips(list, cur, href) {
  return '<div class="fchips" role="tablist">' + CATS().map(([k, t]) => { const n = list.filter(catTest(k)).length; return n || !k || k === cur ? '<a role="tab" href="' + href(k) + '" class="' + (k === cur ? "on" : "") + '">' + esc(t) + " <em>" + n + "</em></a>" : ""; }).join("") + "</div>";
}
const catTags = (x) => (x.cats || []).map((c) => '<span class="tag">' + esc(((S.socialCats || []).find((s) => s.id === c) || { name: c }).name) + "</span>").join("") + (x.gender === "Ayol" ? '<span class="tag f">qiz</span>' : "");


const files = (ids) => (ids || []).map((id, i) => '<button type="button" class="btn sm ghost" data-act="file" data-id="' + esc(id) + '">' + ic("doc") + (ids.length > 1 ? i + 1 + "-" : "") + "hujjat</button>").join("");
const period = (a, b) => (a === b ? fmtDate(a) : fmtDate(a) + " – " + fmtDate(b));
const drop = (key, hint, multi) => '<div class="fl"><span>Hujjat <small>' + hint + '</small></span><label class="drop sm">' + ic("plus") + '<b>Rasm yoki PDF tanlash</b><input type="file" data-files="' + key + '" accept="image/*,application/pdf"' + (multi ? " multiple" : "") + '></label><div class="thumbs" id="thumbs-' + key + '"></div></div>';
const SPC = { kutilmoqda: ["Dekanatda", "warn"], tasdiqlandi: ["Tasdiqlandi", "ok"], rad: ["Rad etildi", "bad"] };
const DMC = { "ota-onada": ["Ota-onada", "warn"], tyutorda: ["Tyutorda", "pri"], tasdiqlandi: ["Tasdiqlandi", "ok"], rad: ["Rad etildi", "bad"] };
function spravkaForm() {
  const K = (S.req && S.req.spravka) || [];
  return '<form class="form" data-form="spravka">' + field("Turi", "kind", { type: "select", opts: [["", "Tanlang"]].concat(K.map((k) => [k.id, k.name])) }) +
    '<div class="f2">' + field("Qaysi kundan", "from", { type: "date", max: today(), val: today() }) + field("Qaysi kungacha", "to", { type: "date", max: today(), val: today() }) + "</div>" +
    field("Izoh", "note", { ph: "Masalan: shamollash, 2-poliklinika" }) + drop("spr", "spravka rasmi, majburiy", true) +
    '<p class="small muted" style="margin:0">' + ic("info") + " Dekanat tasdiqlasa, shu kunlardagi qoldirilgan darslar avtomatik «sababli» bo'ladi.</p>" +
    '<button class="btn" type="submit">Dekanatga yuborish</button></form>';
}
function spravkaCard(x, opt) {
  opt = opt || {};
  const st = SPC[x.status] || [x.status, ""];
  return '<div class="card rq"><div class="rq-h"><span class="rq-i ' + st[1] + '">' + ic("doc") + '</span><div class="t">' + (opt.who ? "<b>" + esc(x.who) + ' <span class="muted small">· ' + esc(x.grp) + "</span></b>" : "<b>" + esc(x.kindName) + "</b>") +
    "<small>" + (opt.who ? esc(x.kindName) + " · " : "") + period(x.from, x.to) + " · " + ago(x.created) + "</small></div>" + chip(st[0], st[1]) + "</div>" +
    (x.note ? '<p class="small" style="margin:10px 0 0">' + esc(x.note) + "</p>" : "") +
    (x.status === "tasdiqlandi" ? '<p class="small" style="margin:8px 0 0;color:var(--ok)">' + ic("check") + " " + x.fixed + " para «sababli» deb belgilandi</p>" : "") + (x.comment ? '<p class="small" style="margin:8px 0 0"><b>Dekanat:</b> ' + esc(x.comment) + "</p>" : "") +
    '<div class="rq-a">' + files(x.files) +
    (opt.self && x.status === "kutilmoqda" ? '<button class="btn sm ghost" data-act="spr-del" data-id="' + esc(x.id) + '">Bekor qilish</button>' : "") +
    (opt.dean && x.status === "kutilmoqda" ? '<button class="btn sm ok" data-act="spr-ok" data-id="' + esc(x.id) + '">' + ic("check") + 'Tasdiqlash</button><button class="btn sm bad" data-act="spr-no" data-id="' + esc(x.id) + '">Rad etish</button>' : "") + "</div></div>";
}


function dormForm() {
  const R = (S.req && S.req.dorm) || [];
  return '<form class="form" data-form="dorm"><div class="fl"><span>Sababi</span><div class="opts">' + R.map((r, i) => '<label class="opt"><input type="radio" name="reason" value="' + esc(r.id) + '"' + (i ? "" : " checked") + "><span>" + esc(r.name) + "</span></label>").join("") + "</div></div>" +
    field("Izoh", "note", { type: "textarea", rows: 3, ph: "Qayerdan kelgansiz, hozir qayerda yashayapsiz" }) + drop("dorm", "ixtiyoriy: ma'lumotnoma", true) +
    '<button class="btn" type="submit">Ariza yuborish</button></form>';
}
function dormSteps(a) {
  const rad = a.status === "rad";
  const cur = { "ota-onada": 1, tyutorda: 2, tasdiqlandi: 4 }[a.status] ?? (a.tutorAt ? 2 : 1);
  const L = [["1. Talaba arizasi", ago(a.created)], ["2. Ota-ona (Face ID)", a.parentAt && !(rad && cur === 1) ? "Face ID tasdiqlandi ✓" : cur > 1 ? "Tasdiqlandi ✓" : "Face ID kutilmoqda"], ["3. Tyutor ruxsati", cur > 2 && !rad ? "Tasdiqladi ✓" : ""], ["4. TTJ & Dekanat", a.status === "tasdiqlandi" ? "Ruxsat berildi ✓" : ""]];
  return steps(L.map((x, i) => ({ label: x[0], sub: rad && i === cur ? "rad etdi" : x[1], state: i < cur ? "done" : i === cur ? (rad ? "bad" : "now") : "next" })));
}
function dormCard(a, opt) {
  opt = opt || {};
  const st = DMC[a.status] || [a.status, ""];
  const act = (opt.parent && a.status === "ota-onada") || (opt.tutor && a.status === "tyutorda");
  const isGreenForTutor = opt.tutor && a.status === "tyutorda";
  return '<div class="card rq"' + (isGreenForTutor ? ' style="border:2px solid var(--ok);background:rgba(30,138,95,0.04)"' : "") + '><div class="rq-h"><span class="rq-i ' + st[1] + '">' + ic("home") + '</span><div class="t"><b>' + (opt.who ? esc(a.who) + ' <span class="muted small">· ' + esc(a.grp) + "</span>" : "TTJdan dam olish kunlari ketish ruxsatnomasi") + "</b><small>" + esc(a.reasonName) + " · " + ago(a.created) + "</small></div>" + chip(st[0], st[1]) + "</div>" +
    (isGreenForTutor ? '<div class="note ok small" style="margin:10px 0 4px"><b><i class="fa-solid fa-face-viewfinder"></i> Ota-ona Face ID orqali tasdiqlagan!</b> Endi sizning ruxsatingiz kutilmoqda.</div>' : "") +
    '<div style="margin:14px 0 4px">' + dormSteps(a) + "</div>" +
    (a.note ? '<p class="small" style="margin:10px 0 0">' + esc(a.note) + "</p>" : "") + (a.comment ? '<p class="small" style="margin:8px 0 0;color:var(--bad)"><b>Sabab:</b> ' + esc(a.comment) + "</p>" : "") +
    '<div class="rq-a">' + files(a.files) +
    (opt.self && (a.status === "ota-onada" || a.status === "tyutorda") ? '<button class="btn sm ghost" data-act="dorm-cancel" data-id="' + esc(a.id) + '">Bekor qilish</button>' : "") +
    (act ? (opt.parent ? '<button class="btn sm ok" data-act="dorm-faceid" data-id="' + esc(a.id) + '"><i class="fa-solid fa-face-viewfinder"></i> Face ID bilan tasdiqlash</button>' : '<button class="btn sm ok" data-act="dorm-ok" data-id="' + esc(a.id) + '">' + ic("check") + 'Ruxsat berish (Tasdiqlash)</button>') + '<button class="btn sm bad" data-act="dorm-no" data-id="' + esc(a.id) + '">Rad etish</button>' : "") + "</div></div>";
}


function requestsPage(r) {
  const st = S.st, t = r.q.get("t") === "dorm" ? "dorm" : "spr";
  const SP = st.spravkas || [], DM = st.dorm || [], active = DM.find((a) => a.status !== "rad");
  const tabs = '<div class="tabs"><a href="#/requests" class="' + (t === "spr" ? "on" : "") + '">' + ic("doc") + " Spravka</a><a href=\"#/requests?t=dorm\" class=\"" + (t === "dorm" ? "on" : "") + '">' + ic("home") + " Yotoqxona</a></div>";
  if (t === "spr") return tabs + '<div class="bar-row"><button class="btn" data-act="spr-new">' + ic("plus") + "Spravka yuklash</button><span class=\"small muted\">Kasallik yoki boshqa sabab bilan qoldirilgan darslar uchun</span></div>" +
    (SP.length ? '<div class="grid g2">' + SP.map((x) => spravkaCard(x, { self: true })).join("") + "</div>" : card("", empty("Spravka yuklanmagan.")));
  return tabs + (active ? dormCard(active, { self: true }) : card("Yotoqxonaga ariza", '<p class="muted" style="margin:0 0 14px">Ariza avval ota-onangizga, keyin tyutorga boradi.</p>' + dormForm())) +
    (DM.filter((a) => a !== active).length ? '<h3 style="font-size:15px;margin:20px 0 10px">Avvalgi arizalar</h3><div class="grid g2">' + DM.filter((a) => a !== active).map((a) => dormCard(a, {})).join("") + "</div>" : "");
}


function parentRequests(k) {
  const DM = k.dorm || [], SP = k.spravkas || [];
  const need = DM.filter((a) => a.status === "ota-onada");
  return (need.length ? '<p class="note warn" style="margin-bottom:14px">' + ic("info") + " Farzandingiz yotoqxonaga ariza berdi. Roziligingiz kerak.</p>" : "") +
    (DM.length ? '<div class="grid g2">' + DM.map((a) => dormCard(a, { parent: true })).join("") + "</div>" : card("Yotoqxona", empty("Ariza yo'q."))) +
    '<h3 style="font-size:15px;margin:20px 0 10px">Spravkalar</h3>' + (SP.length ? '<div class="grid g2">' + SP.map((x) => spravkaCard(x)).join("") + "</div>" : card("", empty("Spravka yo'q.")));
}


const EXC = { "so'ralgan": ["Yozish kerak", "warn"], yozildi: ["Tyutorda", "pri"], "qabul qilindi": ["Qabul qilindi", "ok"], "rad etildi": ["Qayta yozing", "bad"] };

function exLetter(x, st, opt) {
  opt = opt || {};
  const sc = EXC[x.status] || [x.status, ""], write = opt.student && (x.status === "so'ralgan" || x.status === "rad etildi");
  const fio = st ? st.surname + " " + st.name : x.name || "";
  return '<div class="card ex"><div class="rq-h"><span class="rq-i ' + sc[1] + '">' + ic("mail") + '</span><div class="t"><b>' + esc(opt.who ? fio : x.reason) + "</b><small>" + (opt.who ? esc(x.reason) + " · " : "") + fmtDate(x.refDate) + " · " + ago(x.created) + "</small></div>" + chip(sc[0], sc[1]) + "</div>" +
    '<div class="letter"><p class="to">Fakultet dekaniga</p><p>Men, <b>' + esc(fio) + "</b>" + (st && st.grp ? ", " + esc(st.grp) + " guruh talabasi" : "") + ", <b>" + fmtDate(x.refDate) + "</b> kuni <b>" + esc(x.reason.toLowerCase()) + "</b>.</p>" +
    (write ? "" : "<p><b>Sababi:</b> " + (x.text ? esc(x.text) : '<span class="muted">yozilmagan</span>') + "</p>") + "</div>" +
    (write ? '<form class="form" data-form="exwrite" style="margin-top:12px"><input type="hidden" name="id" value="' + esc(x.id) + '">' + field("Sababi", "text", { type: "textarea", rows: 3, val: x.status === "rad etildi" ? x.text : "", ph: "Masalan: shifokor qabulida edim" }) + drop("ex_" + x.id, "ixtiyoriy: spravka yoki ma'lumotnoma", false) +
      '<button class="btn" type="submit">' + ic("check") + "Yuborish</button></form>" : "") +
    (x.comment ? '<p class="small" style="margin:10px 0 0"><b>Tyutor:</b> ' + esc(x.comment) + "</p>" : "") + (x.files && x.files.length ? '<div class="rq-a">' + files(x.files) + "</div>" : "") +
    (opt.tutor && x.status === "yozildi" ? '<form class="form" data-form="exreview" style="margin-top:12px;gap:10px"><input type="hidden" name="id" value="' + esc(x.id) + '">' + field("Izoh (ixtiyoriy)", "comment", { ph: "Masalan: spravka qabul qilindi" }) + '<div style="display:flex;gap:8px"><button class="btn ok" name="decision" value="qabul qilindi" type="submit">' + ic("check") + 'Qabul qilish</button><button class="btn bad" name="decision" value="rad etildi" type="submit">Qaytarish</button></div></form>' : "") + "</div>";
}

function exRequestForm(students, one) {
  const R = (S.req && S.req.exReasons) || [];
  return '<form class="form" data-form="exrequest">' + (one ? '<input type="hidden" name="logins" value="' + esc(one) + '">' :
    '<div class="fl"><span>Talabalar <small>bir nechtasini tanlash mumkin</small></span><div class="pick">' + students.map((s) => '<label><input type="checkbox" name="logins" value="' + esc(s.login) + '">' + ava(s.name + " " + s.surname) + "<span>" + esc(s.surname + " " + s.name) + "</span></label>").join("") + "</div></div>") +
    '<div class="fl"><span>Nima uchun</span><div class="qchips">' + R.map((t) => '<button type="button" data-act="ex-reason" data-t="' + esc(t) + '">' + esc(t) + "</button>").join("") + "</div>" + '<input type="text" name="reason" placeholder="Yoki o\'zingiz yozing" required></div>' +
    field("Sana", "date", { type: "date", max: today(), val: today() }) + '<button class="btn" type="submit">' + ic("mail") + "So'rash</button></form>";
}


V.student = {};
V.student.anketa = anketaPage;
V.student.requests = requestsPage;
V.student.home = () => {
  const st = S.st, me = S.me;
  const h = Number(new Date().toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Tashkent" }));
  const hello = h < 12 ? "Xayrli tong" : h < 18 ? "Xayrli kun" : "Xayrli kech";
  const todo = [];
  st.explanations.filter((x) => x.status === "so'ralgan" || x.status === "rad etildi").forEach((x) => todo.push(['<a class="row" href="#/explanations">' + ic("mail") + '<span class="t"><b>Tushuntirish xati yozing</b><small>' + esc(x.reason) + "</small></span>" + ic("arrow") + "</a>"]));
  st.entries.filter((e) => e.status === "rad").slice(0, 2).forEach((e) => todo.push(['<a class="row" href="#/ifi?tab=apps">' + ic("star") + '<span class="t"><b>IFI arizasi rad etildi</b><small>' + esc(e.critName) + " — " + esc(e.comment) + "</small></span>" + ic("arrow") + "</a>"]));
  const pf = st.profile;
  if (pf && ["so'ralgan", "qaytarilgan", "qoralama"].includes(pf.status)) todo.unshift(['<a class="row" href="#/anketa">' + ic("idcard") + '<span class="t"><b>' + (pf.status === "qaytarilgan" ? "Anketani tuzating" : "Anketani to'ldiring") + "</b><small>" + (pf.status === "qaytarilgan" ? esc(pf.note) : pf.progress.pct + "% to'ldirilgan") + "</small></span>" + ic("arrow") + "</a>"]);
  const up = (S.events || []).filter((e) => e.date >= today()).slice(0, 3);
  const eqtCard = '<section class="card" style="background:linear-gradient(135deg,#003B81 0%,#0369a1 100%);color:#fff;border:none;margin-bottom:16px">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap">' +
      '<div>' +
        '<div style="font-size:11px;font-weight:800;letter-spacing:0.06em;opacity:0.85;text-transform:uppercase"><i class="fa-solid fa-coins"></i> RIAT-BANK · EQUITY (EQT) VALYUTASI VA QR</div>' +
        '<div style="font-size:24px;font-weight:900;margin:4px 0">1 450 EQT <span style="font-size:13px;font-weight:600;opacity:0.85">≈ 1 450 000 UZS</span></div>' +
        '<div style="font-size:12.5px;opacity:0.9">Sarflash yo\'nalishlari: <b>1) Universitet logotipli sovg\'alar</b> · <b>2) Oshxona/bufet vaucherlari</b> · <b>3) Kontrakt to\'loviga chegirma</b></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<a class="btn sm" href="/bank" style="background:#fff;color:#003B81;border:none"><i class="fa-solid fa-building-columns"></i> RIAT-Bank & Sovg\'alar</a>' +
        '<a class="btn sm ghost" href="#/events" style="color:#fff;border-color:rgba(255,255,255,0.4)"><i class="fa-solid fa-qrcode"></i> Tadbir QR skaner (+IFI)</a>' +
      '</div>' +
    '</div>' +
  '</section>';
  return '<div style="margin-bottom:18px"><h2 style="font-size:24px">' + hello + ", " + esc(me.name) + '</h2><p class="muted" style="margin:4px 0 0">' + esc(me.grp) + " · " + esc(me.faculty) + "</p></div>" +
    eqtCard +
    '<div class="kpis">' + homeKpis(st, { rating: true }) + "</div>" +
    (todo.length ? card("Bajarish kerak", '<div class="list">' + todo.join("") + "</div>") + '<div style="height:16px"></div>' : "") +
    '<div class="grid g2" style="margin-bottom:16px;align-items:start">' + grantView(st) + contractView(st) + "</div>" +
    '<div class="grid g2">' + card("Bugungi darslar", todayLessons(S.schedule), '<a href="#/schedule">Jadval</a>') +
    card("Yaqin tadbirlar", up.length ? '<div class="list">' + up.map(evRow).join("") + "</div>" : empty("Yaqin kunlarda tadbir yo'q."), '<a href="#/events">Barchasi</a>') + "</div>";
};

function homeKpis(st, opt) {
  opt = opt || {};
  const base = opt.base || "#/";
  const g = st.grant, A = st.acad;
  return kpi({ label: "GPA", value: A.gpa == null ? null : f2(A.gpa), unit: "/ 5", p: ((A.gpa || 0) / 5) * 100, icon: "cap", tone: A.gpa != null && A.gpa < 3.5 ? "warn" : "", sub: A.gpa == null ? "modul tugagach" : (A.gpa >= 3.5 ? "grantga yetadi" : "3,5 dan past"), href: base + "gpa" }) +
    kpi({ label: "Ijtimoiy faollik", value: f1(st.ifi.total), unit: "/ 100", p: st.ifi.total, icon: "star", tone: st.ifi.total >= 80 ? "ok" : st.ifi.total < 40 ? "bad" : "", sub: st.ifi.level, href: base + "ifi" }) +
    kpi({ label: "Grant bali", value: g && g.score != null ? f1(g.score) : null, unit: "/ 100", p: g ? g.score || 0 : 0, icon: "trophy", tone: g && (g.outcome === "full" || g.outcome === "half") ? "ok" : "warn", sub: g && g.score != null ? (g.pos ? g.pos + "-o'rin · " : "") + (OUTCOME[g.outcome] || [""])[0] : "modul tugagach", href: opt.rating ? "#/rating" : opt.grantHref || "" }) +
    kpi({ label: "Davomat", value: st.att.rate + "%", p: st.att.rate, icon: "check", tone: st.absH > 30 ? "bad" : st.absH > 15 ? "warn" : "ok", sub: st.absH + " soat sababsiz", href: base + "attendance" });
}
V.student.schedule = () => scheduleView(S.schedule);
V.student.attendance = () => attView(S.st, { today: true });
V.student.gpa = () => gpaView(S.st);
V.student.ifi = (r) => {
  if (r.parts[1] === "new") return ifiNew(r.parts[2]);
  return ifiView(S.st, { student: true, tab: r.q.get("tab") || "crit", href: "#/ifi" });
};
V.student.explanations = () => exView(S.st, { student: true });
function ifiNew(id) {
  const c = crit(id);
  if (!c || (c.who !== "student" && c.who !== "ref")) return card("", empty("Bu band bo'yicha talaba ariza bermaydi."));
  const subLabel = c.id === "contest" ? "Erishilgan natija" : c.id === "public" ? "Faoliyat yo'nalishi" : c.id === "spirit" ? "Tadbirdagi ishtiroki" : "Mezon";
  const photos = c.photos || 0;
  return { title: c.n + "-band · " + c.name, html: '<a href="#/ifi" class="small">← Ijtimoiy faollik</a><div class="grid g21" style="margin-top:12px">' +
    card(c.who === "ref" ? "Ma'lumotnoma (" + c.n + "-band)" : "Ariza", '<form class="form" data-form="ifiadd"><input type="hidden" name="crit" value="' + c.id + '">' +
      (c.fields || []).map((f) => f.type === "select" ? field(f.label, "f_" + f.k, { type: "select", opts: [["", "Tanlang"]].concat(f.opts), req: f.req }) : field(f.label, "f_" + f.k, { type: f.type === "date" ? "date" : f.type === "url" ? "url" : "text", req: f.req, max: f.type === "date" ? today() : "", ph: f.type === "url" ? "https://" : "" })).join("") +
      (c.subs.length > 6 ? field(subLabel, "sub", { type: "select", req: true, opts: [["", "Tanlang"]].concat(c.subs.map((s) => [s.id, s.name + " — " + s.pts + " ball"])) })
        : c.subs.length > 1 ? '<div class="fl"><span>' + subLabel + '</span><div class="opts">' + c.subs.map((s, i) => '<label class="opt"><input type="radio" name="sub" value="' + s.id + '"' + (i === 0 ? " checked" : "") + "><span>" + esc(s.name) + "</span>" + (s.pts ? "<em>" + s.pts + " ball</em>" : "") + "</label>").join("") + "</div></div>" : '<input type="hidden" name="sub" value="' + c.subs[0].id + '">') +
      '<div class="fl"><span>' + (photos ? "Rasmlar <small>kamida " + photos + " ta, JPG yoki PNG</small>" : "Tasdiqlovchi hujjat <small>rasm yoki PDF, 1,5 MB gacha</small>") + '</span><label class="drop">' + ic("plus") + "<b>" + (photos ? "Rasmlarni tanlang" : "Faylni tanlang") + '</b><small>Telefon kamerasi yoki galereyadan</small><input type="file" data-files="ifi" accept="' + (photos ? "image/*" : "image/*,application/pdf") + '" multiple></label><div class="thumbs" id="thumbs-ifi"></div></div>' +
      field("Izoh (ixtiyoriy)", "note", { ph: "Qo'shimcha ma'lumot" }) + '<button class="btn block" type="submit">Yuborish</button></form>') +
    card("Talablar", '<p style="margin-top:0">' + esc(c.hint) + "</p>" + (c.doc ? '<p class="note"><b>Hujjat:</b> ' + esc(c.doc) + "</p>" : "") +
      (c.who === "ref" ? '<p class="small muted">Yuborilgandan so\'ng ma\'lumotnoma namunadagi shaklda avtomatik tuziladi — uni chop etib, talaba, tyutor va dekan muovini imzolaydi.</p>' : "") +
      (c.future ? '<p class="note warn">' + esc(c.future) + "</p>" : "") + (c.id === "club" ? '<p class="note ok">Platformadagi to\'garakka a\'zo bo\'lsangiz, klub rahbari tasdiqlagach ariza o\'zi yaratiladi. <a href="#/clubs">To\'garaklar</a></p>' : "")) + "</div>" };
}
const REF_TXT = { contest: "Xalqaro, Respublika, viloyat miqyosdagi ko'rik-tanlov, fan olimpiadalari va sport musobaqalarida erishgan natijalari", public: "Volontyorlik va jamoat ishlaridagi faolligi",
  culture: "Teatr va muzey, xiyobon, kino, tarixiy qadamjolarga tashriflar", spirit: "Ma'naviy-ma'rifiy sohaga oid boshqa yo'nalishlardagi faolligi uchun" };
function findEntry(id) {
  const pools = [];
  if (S.st) pools.push([S.st, S.st.entries]);
  (S.kids || []).forEach((k) => pools.push([k, k.entries]));
  if (ui.CARD) pools.push([ui.CARD, ui.CARD.entries]);
  for (const [st, E] of pools) { const e = E.find((x) => x.id === id); if (e) return [st, e]; }
  return [null, null];
}
V.common.ref = (r) => {
  const [st, e] = findEntry(r.parts[1]);
  if (!e) return card("", empty("Ma'lumotnoma topilmadi."));
  const c = crit(e.crit), F = e.fields || {}, d = e.date || today();
  const y = Number(d.slice(0, 4)), m = Number(d.slice(5, 7)), yr = m >= 9 ? y + "/" + (y + 1) : y - 1 + "/" + y;
  const L = (label, v) => '<p class="f"><b>' + label + ":</b> " + esc(v || "—") + "</p>";
  let body = "";
  if (e.crit === "contest") body = L("Ko'rik-tanlov, sport, fan olimpiadalari va musobaqa nomi", F.title) + L("O'tkazilgan joyi", F.place) + L("O'tkazilgan sanasi", dmy(F.date)) + L("Erishilgan natijasi", e.subName);
  else if (e.crit === "public") body = L("Ma'naviy-ma'rifiy tadbir nomi", F.title) + L("O'tkazilgan joyi", F.place) + L("O'tkazilgan sanasi", dmy(F.date)) + L("Tadbirdagi ishtiroki (o'z tashabbusi / faol ishtiroki)", F.role) + L("Yo'nalish", e.subName);
  else if (e.crit === "culture") body = L("Tashrif joyi", F.place) + L("Tashrif sanasi", dmy(F.date)) + L("Link", F.link);
  else body = L("Ma'naviy-ma'rifiy tadbir nomi", F.title) + L("O'tkazilgan joyi", F.place) + L("O'tkazilgan sanasi", dmy(F.date)) + L("Link", F.link) + L("Tadbirdagi ishtiroki", e.subName);
  const tutor = (st.tutors && st.tutors[0] && st.tutors[0].name) || "";
  ui.afterRender.push(() => (e.files || []).slice(0, 4).forEach((fid, i) => api("getFile", { id: fid }, { quiet: true, silent: true, noRender: true, lite: true }).then((j) => {
    const box = document.getElementById("rph" + i);
    if (box && j && j.data && /^image\//.test(j.data.type)) box.innerHTML = '<img alt="Rasm ' + (i + 1) + '" src="data:' + j.data.type + ";base64," + j.data.data + '">';
  })));
  return { title: "Ma'lumotnoma · " + c.n + "-band", html: '<div class="noprint" style="display:flex;gap:10px;align-items:center;margin-bottom:14px;flex-wrap:wrap"><a href="javascript:history.back()" class="btn ghost sm">' + ic("back") + 'Orqaga</a><button class="btn sm" data-act="print">' + ic("print") + "Chop etish</button>" + stChip(e.status) + "</div>" +
    '<div class="paper"><div class="hd"><p>TDIU <u>' + esc(st.faculty) + "</u> fakulteti <u>" + esc(st.grp) + "</u> guruhi talabasi <u>" + esc(st.name + " " + st.surname) + "</u>ning</p><p>" + yr + " o'quv yilidagi faoliyati to'g'risida</p></div><h3>MA'LUMOTNOMA</h3>" +
    "<p>Talabaning «Ijtimoiy faollik indeksi»ni baholash mezonlari asosida " + c.n + "-band bo'yicha (" + esc(REF_TXT[e.crit] || c.name) + ") amalga oshirgan ishlari to'g'risida.</p>" + body +
    '<p class="note2">*Izoh: Asos sifatida kamida 2 dona rasm qo\'yiladi.</p><div class="ph">' + [0, 1].concat((e.files || []).length > 2 ? [2, 3].slice(0, e.files.length - 2) : []).map((i) => '<div id="rph' + i + '">Rasm</div>').join("") + "</div>" +
    '<div class="sg"><div><b>Talaba:</b><span>imzo</span><span>' + esc(st.name + " " + st.surname) + "</span></div><div><b>Tyutor:</b><span>imzo</span><span>" + esc(tutor) + "</span></div><div><b>Dekan muovini:</b><span>imzo</span><span>F.I.Sh.</span></div></div></div>" };
};

V.student.rating = (r) => {
  const by = ["gpa", "ifi", "grant"].includes(r.q.get("by")) ? r.q.get("by") : "grant", me = S.st;
  const sc = by === "grant" ? "dir" : r.q.get("sc") || "grp";
  const inScope = (x) => sc === "all" || (sc === "grp" ? x.grp === me.grp : sc === "dir" ? x.direction === me.direction && x.course === me.course && x.faculty === me.faculty : x.faculty === me.faculty);
  const val = (x) => x[by];
  const all = (S.board || []).filter(inScope);

  const L = all.filter((x) => val(x) != null && (by !== "grant" || ["full", "half", "none", "noquota"].includes(x.outcome))).sort((a, b) => val(b) - val(a));
  const out = all.length - L.length;
  const fmt = (v) => (by === "gpa" ? f2(v) : f1(v));
  const rows = L.map((x) => ({ login: x.login, name: x.name, sub: x.grp, val: val(x), txt: fmt(val(x)), chip: by === "grant" ? outChip(x.outcome) : "" }));
  const i = rows.findIndex((x) => x.login === me.login);
  const q = me.grant ? me.grant.quota : { full: 0, half: 0 };
  const cuts = by === "grant" ? { [q.full]: "to'liq grant chegarasi", [q.full + q.half]: "50% grant chegarasi" } : {};
  const tab = (v, t, icn) => '<a href="#/rating?by=' + v + '" class="' + (by === v ? "on" : "") + '">' + ic(icn) + " " + t + "</a>";
  const scl = (v, t) => '<a href="#/rating?by=' + by + "&sc=" + v + '" class="' + (sc === v ? "on" : "") + '">' + t + "</a>";
  const gap = i > 0 ? fmt(rows[i - 1].val - rows[i].val + (by === "gpa" ? 0.01 : 0.1)) : "";
  const mine = i < 0 ? card("", '<p class="muted" style="margin:0">' + (by === "ifi" ? "" : "Joriy yilda modul tugagach reytingga qo'shilasiz.") + "</p>")
    : card("", '<div class="mypos"><div class="big">' + (i + 1) + "-o'rin <span>/ " + rows.length + '</span></div><div style="flex:1;min-width:200px"><p><b>' + rows[i].txt + "</b> " + { gpa: "GPA", ifi: "ball", grant: "grant bali" }[by] + "</p><p class=\"small muted\">" + (i === 0 ? "Siz yetakchisiz!" : (i) + "-o'ringa " + gap + " yetmayapti") + "</p></div>" + (by === "grant" && me.grant ? outChip(me.grant.outcome) : "") + "</div>");
  return '<div class="bar-row"><div class="seg">' + tab("grant", "Grant", "trophy") + tab("gpa", "O'zlashtirish", "cap") + tab("ifi", "Faollik", "star") + "</div>" +
    (by === "grant" ? '<span class="small muted">' + esc(me.direction) + " · " + me.course + "-kurs · to'liq " + q.full + ", 50% " + q.half + " o'rin</span>" : '<div class="seg">' + scl("grp", "Guruh") + scl("fac", "Fakultet") + scl("all", "Universitet") + "</div>") + "</div>" +
    mine + '<div style="height:16px"></div>' + leaderboard(rows, me.login, { cuts }) +
    (out ? '<p class="small muted" style="margin-top:12px">' + out + " talaba reytingda emas" + (by === "grant" ? " (GPA 3,5 dan past yoki modul tugamagan)" : by === "gpa" ? " (modul tugamagan)" : "") + "</p>" : "") +
    '<p class="small muted" style="margin-top:6px">' + (by === "grant" ? "Grant bali = GPA × 16 + IFI ÷ 5" : by === "gpa" ? "Joriy yilning tugagan modullari bo'yicha" : "Tasdiqlangan arizalar va tizim ko'rsatkichlari") + ' · <a href="#/rules">Batafsil</a></p>';
};
function schCards(list, apps, opt) {
  opt = opt || {};
  if (!list.length) return card("", empty("Hozircha stipendiya yo'q."));
  const SC = { Yuborilgan: "pri", "Ko'rib chiqilmoqda": "warn", "Qabul qilingan": "ok", "Rad etilgan": "bad" };
  return '<div class="grid g2">' + list.map((s) => {
    const a = apps.find((x) => x.item === s.id), past = s.deadline && s.deadline < today();
    return card(esc(s.title), '<div class="kv" style="margin-bottom:12px"><div><small>Oylik miqdori</small><b>' + (s.amount ? num(s.amount) + " so'm" : "—") + "</b></div><div><small>Ariza muddati</small><b>" + (s.deadline ? fmtDate(s.deadline) : "—") + "</b></div></div>" +
      '<p class="small" style="margin:0 0 10px">' + esc(s.description || "") + "</p>" + ((s.requirements || []).length ? '<ul class="small muted" style="margin:0 0 12px;padding-left:18px">' + s.requirements.map((x) => "<li>" + esc(x) + "</li>").join("") + "</ul>" : "") +
      (opt.student ? (a ? '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' + chip(a.status, SC[a.status]) + '<small class="muted">yuborilgan: ' + fmtDate(a.date) + "</small>" + (a.status === "Yuborilgan" ? '<button class="btn sm ghost" data-act="apply" data-id="' + esc(s.id) + '" data-on="0">Qaytarib olish</button>' : "") + "</div>"
        : past ? chip("Muddat tugagan") : '<button class="btn" data-act="apply" data-id="' + esc(s.id) + '">Ariza yuborish</button>') : a ? chip("Ariza: " + a.status, SC[a.status]) : '<span class="muted small">Ariza yuborilmagan</span>'), "");
  }).join("") + "</div>";
}
V.student.scholarships = () => '<p class="lead">Stipendiyalarga ariza yuboring. Ariza holati o\'zgarganda sizga va ota-onangizga xabar boradi.</p>' + schCards(S.scholarships || [], S.st.apps, { student: true });
V.student.clubs = () => {
  const C = S.clubs || [], cat = crit("club");
  const MS = { "a'zo": ["A'zosiz", "ok"], kutilmoqda: ["So'rov yuborilgan", "warn"] };
  return '<p class="lead">To\'garakka a\'zo bo\'ling. Klub rahbari tasdiqlagach, IFI 2-band («To\'garaklarda ishtiroki») bo\'yicha ariza avtomatik yaratiladi va tyutoringiz baholaydi.</p>' +
    cat.subs.filter((s) => s.id !== "org").map((s) => { const L = C.filter((c) => c.category === s.id); return L.length ? '<h3 style="font-size:15px;margin:18px 0 10px">' + esc(s.name) + ' <span class="muted small">· ' + s.pts + ' ball</span></h3><div class="grid g2">' + L.map((c) => card(esc(c.name), '<p class="small" style="margin:0 0 10px">' + esc(c.description) + '</p><div class="kv" style="margin-bottom:12px"><div><small>Vaqti</small><b>' + esc(c.schedule || "—") + "</b></div><div><small>Joyi</small><b>" + esc(c.place || "—") + "</b></div><div><small>Rahbar</small><b>" + esc(c.leaderName || "—") + "</b></div><div><small>A'zolar</small><b>" + c.members + "</b></div></div>" +
      (c.my ? '<div style="display:flex;gap:8px;align-items:center">' + chip(MS[c.my][0], MS[c.my][1]) + '<button class="btn sm ghost" data-act="club" data-id="' + esc(c.id) + '" data-on="0">' + (c.my === "a'zo" ? "Chiqish" : "Bekor qilish") + "</button></div>" : '<button class="btn" data-act="club" data-id="' + esc(c.id) + '">A\'zo bo\'lish</button>'))).join("") + "</div>" : ""; }).join("");
};
function evRow(e) {
  const p = e.date.split("-").map(Number);
  return '<a class="row" href="#/events?e=' + esc(e.id) + '"><span class="date"><b>' + p[2] + "</b><small>" + MONTHS[p[1] - 1].slice(0, 3) + '</small></span><span class="t"><b>' + esc(e.title) + "</b><small>" + esc([e.time, e.place].filter(Boolean).join(" · ")) + "</small></span>" + (e.attended ? chip("Qatnashdingiz", "ok") : e.reg ? chip("Yozilgansiz", "pri") : "") + "</a>";
}

function photoStrip(e, opt) {
  const P = e.photos || [], can = e.date <= today() && (opt.student ? e.reg || e.attended : opt.owner || S.me.role === "tutor" || S.me.role === "dean" || S.me.role === "admin");
  if (!P.length && !can) return "";
  return '<div class="ph-strip">' + P.slice(0, 7).map((p) => '<span class="ph"><button type="button" data-act="file" data-id="' + esc(p.file) + '" aria-label="Rasmni ochish"><img alt="" data-fid="' + esc(p.file) + '"></button>' + (p.mine || (opt.owner && e.mine) ? '<button type="button" class="x" data-act="ph-del" data-id="' + esc(p.id) + '" aria-label="O\'chirish">×</button>' : "") + "</span>").join("") +
    (P.length > 7 ? '<span class="ph more">+' + (P.length - 7) + "</span>" : "") +
    (can ? '<label class="ph add" title="Rasm qo\'shish">' + ic("plus") + "<small>Rasm</small>" + '<input type="file" accept="image/*" multiple data-evphoto="' + esc(e.id) + '"></label>' : "") + "</div>";
}
function evCard(e, opt) {
  opt = opt || {};
  const p = e.date.split("-").map(Number), past = e.date < today();
  const meta = [e.kind === "musobaqa" ? chip("Musobaqa", "warn") : chip("Tadbir"), e.ifiLabel ? chip("IFI " + e.ifiLabel, "pri") : "", e.club ? chip(e.club) : "", e.groups.length ? chip(e.groups.join(", ")) : ""].join(" ");
  let act = "";
  if (opt.student) act = e.attended ? chip("Qatnashdingiz", "ok") : past ? "" : e.reg ? '<button class="btn sm ghost" data-act="ev-reg" data-id="' + esc(e.id) + '" data-on="0">Yozilishni bekor qilish</button>' : '<button class="btn sm" data-act="ev-reg" data-id="' + esc(e.id) + '">Yozilish</button>';
  if (opt.owner && e.mine) act = (e.date === today() ? '<button class="btn sm" data-act="qr-open" data-id="' + esc(e.id) + '">' + ic("qr") + "QR-kod ochish</button>" : '<span class="small muted">QR-kod tadbir kuni ochiladi</span>') +
    e.sessions.map((s) => '<a class="btn sm ghost" href="#/qr/' + esc(s.id) + '">' + (s.active ? "Faol QR" : "QR natijasi") + "</a>").join("") + '<button class="btn sm ghost" data-act="ev-edit" data-id="' + esc(e.id) + '">Tahrirlash</button><button class="btn sm bad" data-act="ev-del" data-id="' + esc(e.id) + '">O\'chirish</button>';
  return '<div class="card" style="display:flex;gap:14px;align-items:flex-start' + (opt.focus ? ";border-color:var(--pri)" : "") + '" id="ev-' + esc(e.id) + '"><span class="date"><b>' + p[2] + "</b><small>" + MONTHS[p[1] - 1].slice(0, 3) + '</small></span><div style="flex:1;min-width:0;display:grid;gap:6px"><b style="font-size:15.5px">' + esc(e.title) + '</b><small class="muted">' + esc([e.time, e.place].filter(Boolean).join(" · ")) + (e.ownerName ? " · " + esc(e.ownerRole) + ": " + esc(e.ownerName) : "") + "</small>" +
    (e.description ? '<p class="small" style="margin:0">' + esc(e.description) + "</p>" : "") + '<div style="display:flex;gap:6px;flex-wrap:wrap">' + meta + "</div>" + photoStrip(e, opt) + (opt.owner ? '<small class="muted">Yozilganlar: ' + e.regN + " · QR bilan qatnashganlar: " + e.attN + "</small>" : "") + (act ? '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">' + act + "</div>" : "") + "</div></div>";
}
V.student.events = (r) => {
  const k = r.q.get("k") || "", f = r.q.get("e") || "";
  const E = (S.events || []).filter((e) => !k || e.kind === k);
  const up = E.filter((e) => e.date >= today()), past = E.filter((e) => e.date < today() && (e.reg || e.attended)).reverse();
  if (f) ui.afterRender.push(() => { const el = document.getElementById("ev-" + f); if (el) el.scrollIntoView({ block: "center" }); });
  return '<p class="note" style="margin-bottom:16px">' + ic("qr") + ' Tadbirda ishtirokingiz QR-kod orqali qayd etiladi: tashkilotchi ekranidagi kodni telefon kamerasi bilan skanerlang. IFI belgisi bor tadbirlarda ball avtomatik qo\'shiladi.</p>' +
    '<div class="bar-row"><div class="seg"><a href="#/events" class="' + (!k ? "on" : "") + '">Hammasi</a><a href="#/events?k=tadbir" class="' + (k === "tadbir" ? "on" : "") + '">Tadbirlar</a><a href="#/events?k=musobaqa" class="' + (k === "musobaqa" ? "on" : "") + '">Musobaqalar</a></div></div>' +
    '<div class="grid">' + (up.length ? up.map((e) => evCard(e, { student: true, focus: e.id === f })).join("") : card("", empty("Yaqin tadbirlar yo'q."))) + "</div>" +
    (past.length ? '<h3 style="font-size:15px;margin:22px 0 10px">O\'tgan tadbirlarim <small class="muted">· rasmlarni shu yerga qo\'shing</small></h3><div class="grid">' + past.slice(0, 12).map((e) => evCard(e, { student: true })).join("") + "</div>" : "");
};
V.student.news = V.common.news;
try { ui.devId = localStorage.getItem("ul_dev") || ""; if (!ui.devId) { ui.devId = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("ul_dev", ui.devId); } } catch (e) {  }
V.student.c = (r) => {
  const code = r.parts[1] || "", [sid, tok] = code.split(".");
  ui.afterRender.push(() => api("qrInfo", { id: sid }, { quiet: true, silent: true, noRender: true, lite: true }).then((j) => {
    const el = document.getElementById("ci-info");
    if (!el) return;
    if (!j) { el.innerHTML = '<p class="note bad">QR-kod noto\'g\'ri yoki eskirgan.</p>'; return; }
    const d = j.data;
    el.innerHTML = "<h2 style=\"font-size:20px\">" + esc(d.title) + '</h2><p class="muted">' + esc([d.place, d.by].filter(Boolean).join(" · ")) + "</p>" + (d.ifi ? chip("IFI " + d.ifi, "pri") : "") + (d.active ? "" : '<p class="note bad" style="margin-top:12px">Qayd etish vaqti tugagan.</p>');
  }));
  return '<div style="max-width:520px;margin:0 auto">' + card("", '<div id="ci-info"><p class="muted">Yuklanmoqda…</p></div><p class="small muted" style="margin:16px 0">Qayd etish uchun joylashuvingiz tekshiriladi — tadbir joyida bo\'lishingiz kerak. Brauzer so\'raganda «Ruxsat berish»ni bosing.</p>' +
    '<button class="btn block" data-act="checkin" data-sid="' + esc(sid) + '" data-tok="' + esc(tok || "") + '">' + ic("check") + "Ishtirokni qayd etish</button><div id=\"ci-res\" style=\"margin-top:12px\"></div>") + "</div>";
};


try { ui.kidIdx = Number(localStorage.getItem("ul_kid")) || 0; } catch (e) {  }
function kid() { const K = S.kids || []; if (ui.kidIdx >= K.length) ui.kidIdx = 0; return K[ui.kidIdx]; }
function kidBar() {
  const K = S.kids || [];
  if (K.length < 2) return "";
  return '<div class="bar-row"><div class="seg">' + K.map((k, i) => '<button data-act="kid" data-i="' + i + '" class="' + (i === ui.kidIdx ? "on" : "") + '">' + esc(k.name + " " + k.surname) + "</button>").join("") + "</div></div>";
}
function noKid() { return card("Farzand ulanmagan", '<p class="muted" style="margin:0">Farzandingiz hisobini administrator bog\'laydi. Universitet talabalar bo\'limiga murojaat qiling.</p>'); }
const P = (fn) => (r) => { const k = kid(); return k ? kidBar() + fn(k, r) : noKid(); };
V.parent = {};
V.parent.home = P((k) => {
  const T = k.tutors[0] || { name: "Abdurahmonov Umar", phone: "+998 90 345 12 67" };
  const N = (S.notifs || []).filter((n) => !n.child || n.child === k.login).slice(0, 5);
  const exOpen = k.explanations.filter((x) => x.status === "so'ralgan").length;
  const needDorm = (k.dorm || []).filter((a) => a.status === "ota-onada");
  const pName = S.me.name + " " + S.me.surname;
  const pJshir = S.me.jshir || "31004751230088";

  const parentBadgeBar = '<div class="card" style="margin-bottom:16px;background:linear-gradient(135deg,#00255A 0%,#003B81 100%);color:#fff;border:none">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">' +
      '<div style="display:flex;align-items:center;gap:12px">' +
        '<div style="width:48px;height:48px;border-radius:14px;background:rgba(255,255,255,0.14);display:grid;place-items:center;font-size:22px"><i class="fa-solid fa-id-card-clip"></i></div>' +
        '<div><div style="font-size:12px;color:#93c5fd;font-weight:700;text-transform:uppercase;letter-spacing:0.06em">Ota-ona shaxsiy kabineti · JSHSHIR + Face ID</div>' +
        '<div style="font-size:18px;font-weight:800">' + esc(pName) + '</div>' +
        '<div style="font-size:12.5px;color:#dbeafe">JSHSHIR: <b>' + esc(pJshir) + '</b> · Farzand: <b>' + esc(k.surname + " " + k.name) + '</b> (' + esc(k.grp) + ')</div></div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap">' +
        '<span style="background:rgba(16,185,129,0.22);border:1px solid rgba(16,185,129,0.5);color:#6ee7b7;padding:6px 12px;border-radius:999px;font-size:12.5px;font-weight:700"><i class="fa-solid fa-face-viewfinder"></i> Face ID Tasdiqlangan</span>' +
        '<a href="/messenger" class="btn sm" style="background:#fff;color:#003B81;border:none"><i class="fa-solid fa-comments"></i> RIAT-Messenger</a>' +
      '</div>' +
    '</div></div>';

  const ttjAlert = needDorm.length ? '<div class="card" style="margin-bottom:16px;border:2px solid var(--warn);background:rgba(245,158,11,0.06)">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">' +
      '<div><b style="color:var(--warn);font-size:15px"><i class="fa-solid fa-bell"></i> TTJdan dam olish kunlari ketish uchun ruxsat so\'ralmoqda!</b>' +
      '<p class="small" style="margin:4px 0 0">' + esc(needDorm[0].note || "Farzandingiz viloyatga/uyga borib kelish uchun ruxsat so'radi.") + '</p></div>' +
      '<button class="btn sm ok" data-act="dorm-faceid" data-id="' + esc(needDorm[0].id) + '"><i class="fa-solid fa-face-viewfinder"></i> Face ID bilan ruxsat berish</button>' +
    '</div></div>' : "";

  const liveRaceCard = card("3 pog'onali jonli reyting («Poyga» — Real vaqt rejimida)",
    '<p class="small muted" style="margin:-4px 0 12px">Farzandingizning o\'zlashtirish (GPA) va ijtimoiy faollik ko\'rsatkichlari bo\'yicha o\'rni:</p>' +
    '<div class="grid g3">' +
      '<div class="stat pri"><small>1. Universitet bo\'yicha (Bakalavr)</small><b>#18 300 <span>/ 20 000</span></b><em>TDIU umumiy reytingi · Yuqoriga ko\'tarilmoqda ↑</em></div>' +
      '<div class="stat ok"><small>2. Fakultet bo\'yicha (RIAT)</small><b>#1 100 <span>/ 2 450</span></b><em>Raqamli iqtisodiyot va AT fakulteti</em></div>' +
      '<div class="stat warn"><small>3. Guruh bo\'yicha (' + esc(k.grp) + ')</small><b>#16 <span>/ 28</span></b><em>Guruh ichidagi jonli poyga ko\'rsatkichi</em></div>' +
    '</div>');

  const directContactsCard = card("Rahbariyat va mas'ul tyutor bilan to'g'ridan-to'g'ri aloqa",
    '<div class="grid g3">' +
      '<div class="kv" style="display:block;padding:12px;border:1px solid var(--line);border-radius:12px;background:var(--soft)">' +
        '<small style="color:var(--pri);font-weight:700">FAKULTET DEKANI</small>' +
        '<b style="display:block;font-size:15px;margin:4px 0">Akbarov Nodir G‘afurovich</b>' +
        '<small class="muted" style="display:block;margin-bottom:8px">Raqamli iqtisodiyot va AT fakulteti</small>' +
        '<a class="btn sm ghost" href="tel:+998712454243">' + ic("phone") + '+998 71 245 42 43</a>' +
      '</div>' +
      '<div class="kv" style="display:block;padding:12px;border:1px solid var(--line);border-radius:12px;background:var(--soft)">' +
        '<small style="color:var(--pri);font-weight:700">DEKAN O\'RINBOSARI (ZAMDEKAN)</small>' +
        '<b style="display:block;font-size:15px;margin:4px 0">Amonov Alisher Radjab o‘g‘li</b>' +
        '<small class="muted" style="display:block;margin-bottom:8px">Yoshlar bilan ishlash va ma\'naviyat</small>' +
        '<a class="btn sm ghost" href="tel:+998712390129">' + ic("phone") + '+998 71 239 01 29</a>' +
      '</div>' +
      '<div class="kv" style="display:block;padding:12px;border:1px solid var(--pri);border-radius:12px;background:var(--pri-soft)">' +
        '<small style="color:var(--pri);font-weight:700">GURUH TYUTORI (' + esc(k.grp) + ')</small>' +
        '<b style="display:block;font-size:15px;margin:4px 0">' + esc(T.name) + '</b>' +
        '<small class="muted" style="display:block;margin-bottom:8px">Doimiy aloqa va davomat nazorati</small>' +
        '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
          '<a class="btn sm" href="tel:' + tel(T.phone || "+998903451267") + '">' + ic("phone") + esc(T.phone || "+998 90 345 12 67") + '</a>' +
          '<a class="btn sm ghost" href="/messenger"><i class="fa-solid fa-paper-plane"></i> Chat</a>' +
        '</div>' +
      '</div>' +
    '</div>');

  return parentBadgeBar + ttjAlert +
    '<div style="display:flex;gap:14px;align-items:center;margin-bottom:16px">' + ava(k.name + " " + k.surname, "l") + '<div><h2 style="font-size:22px">' + esc(k.name + " " + k.surname) + '</h2><div class="muted">' + esc(k.grp) + " · " + esc(k.faculty) + " · Sentabrdan beri sababsiz: <b style=\"color:var(--bad)\">" + k.absH + " soat</b></div></div></div>" +
    todayStatus(k) + '<div style="height:16px"></div><div class="kpis">' + homeKpis(k) + "</div>" +
    '<div style="margin-bottom:16px">' + liveRaceCard + '</div>' +
    (exOpen ? '<a class="note warn" href="#/explanations" style="display:block;margin-bottom:16px"><b>' + exOpen + " ta tushuntirish xati so'ralgan.</b> Batafsil ko'rish →</a>" : "") +
    '<div class="grid g2" style="margin-bottom:16px;align-items:start">' + grantView(k) + contractView(k) + "</div>" +
    '<div style="margin-bottom:16px">' + directContactsCard + '</div>' +
    '<div class="grid g2">' + card("Tyutor izohlari va muloqot", T ? '<div class="row" style="border:0;padding:0">' + ava(T.name) + '<span class="t"><b>' + esc(T.name) + "</b><small>" + esc(T.phone || "+998 90 345 12 67") + "</small></span>" + '<a class="btn sm" href="/messenger"><i class="fa-solid fa-comments"></i> Yozish</a></div>' : empty("Tyutor biriktirilmagan."), '<a href="#/tutor">Batafsil</a>') +
    card("So'nggi xabarlar", N.length ? '<div class="list">' + N.map((n) => '<a class="row" href="' + esc(n.link) + '"><span class="t"><b>' + esc(n.title) + "</b><small>" + esc(n.body) + '</small></span><small class="muted">' + ago(n.created) + "</small></a>").join("") + "</div>" : empty("Xabar yo'q."), '<a href="#/notifications">Barchasi</a>') + "</div>";
});
V.parent.attendance = P((k) => attView(k, { today: true }));
V.parent.gpa = P((k) => gpaView(k));
V.parent.ifi = P((k, r) => ifiView(k, { tab: r.q.get("tab") || "crit", href: "#/ifi" }));
V.parent.scholarships = P((k) => '<p class="lead">Farzandingiz yuborgan stipendiya arizalari va ularning holati.</p>' + schCards(S.scholarships || [], k.apps));
V.parent.explanations = P((k) => exView(k));
V.parent.requests = P((k) => parentRequests(k));
V.parent.schedule = P((k) => scheduleView(k.schedule));
V.parent.tutor = P((k) => '<div class="grid g2" style="margin-bottom:16px">' + (k.tutors.length ? k.tutors.map((t) => card("Tyutor", '<div style="display:flex;gap:14px;align-items:center">' + ava(t.name, "l") + '<div style="flex:1"><b style="font-size:17px">' + esc(t.name) + '</b><div class="muted">' + esc(k.grp) + " guruhi tyutori</div></div></div>" +
  '<div class="kv" style="margin-top:14px"><div><small>Telefon</small><b>' + (t.phone ? '<a href="tel:' + tel(t.phone) + '">' + esc(t.phone) + "</a>" : "kiritilmagan") + "</b></div></div>")).join("") : card("Tyutor", empty("Tyutor biriktirilmagan."))) + "</div>" + notesView(k));


try { ui.TG = localStorage.getItem("ul_tg") || ""; } catch (e) {  }
function tgBar() {
  const G = S.groups || [];
  if (G.length < 2) return "";
  const n = (g) => (S.students || []).filter((s) => !g || s.grp === g).length;
  return '<div class="bar-row"><span class="small muted" style="font-weight:700">Guruh:</span><div class="seg" role="tablist">' + [["", "Barcha guruhlar"]].concat(G.map((g) => [g, g])).map((x) =>
    '<button role="tab" data-act="tg" data-g="' + esc(x[0]) + '" class="' + (x[0] === ui.TG ? "on" : "") + '">' + esc(x[1]) + ' <span class="muted">' + n(x[0]) + "</span></button>").join("") + "</div></div>";
}
function TGV(fn) {
  return (r) => {
    const G = S.groups || [];
    if (ui.TG && !G.includes(ui.TG)) ui.TG = "";
    const wrap = (o) => (o && typeof o === "object" ? { title: o.title, html: tgBar() + o.html } : tgBar() + o);
    if (!ui.TG) return wrap(fn(r));
    const bar = tgBar();
    const keep = { groups: S.groups, students: S.students, queue: S.queue, explanations: S.explanations, events: S.events, socialQueue: S.socialQueue, dorm: S.dorm, spravkas: S.spravkas };
    S.groups = [ui.TG];
    S.students = (keep.students || []).filter((s) => s.grp === ui.TG);
    S.queue = (keep.queue || []).filter((e) => e.grp === ui.TG);
    S.socialQueue = (keep.socialQueue || []).filter((e) => e.grp === ui.TG);
    S.dorm = (keep.dorm || []).filter((e) => e.grp === ui.TG);
    S.spravkas = (keep.spravkas || []).filter((e) => e.grp === ui.TG);
    S.explanations = (keep.explanations || []).filter((x) => x.grp === ui.TG);
    S.events = (keep.events || []).filter((e) => !e.groups.length || e.groups.includes(ui.TG));
    try { const o = fn(r); return o && typeof o === "object" ? { title: o.title, html: bar + o.html } : bar + o; } finally { Object.assign(S, keep); }
  };
}
function tutorHousingMapWidget() {
  return card("Ijara xonadonlarini o'rganish xaritasi va optimal marshrut", '<p class="small muted" style="margin:-4px 0 12px">Talabalar anketada kiritgan yashash manzillari avtomatik tumanlar kesimida guruhlanadi va tyutor uchun optimal tashrif marshruti chizib beriladi (15 kunlik qog\'ozbozlik o\'rniga 1 soniyada):</p>' +
    '<div class="grid g4" style="margin-bottom:14px">' +
      '<div class="kv" style="display:block;padding:12px;border:1.5px solid var(--pri);border-radius:12px;background:var(--pri-soft)"><small style="color:var(--pri);font-weight:800">CHILONZOR TUMANI</small><b style="display:block;font-size:20px;margin:4px 0">14 nafar</b><small class="muted">Ijara xonadonlari (6 ta manzil)</small></div>' +
      '<div class="kv" style="display:block;padding:12px;border:1px solid var(--line);border-radius:12px"><small style="color:var(--ok);font-weight:800">TTJ-5 VA TTJ-6</small><b style="display:block;font-size:20px;margin:4px 0">18 nafar</b><small class="muted">Talabalar turar joyi</small></div>' +
      '<div class="kv" style="display:block;padding:12px;border:1px solid var(--line);border-radius:12px"><small style="color:var(--warn);font-weight:800">YUNUSOBOD VA OLMAZOR</small><b style="display:block;font-size:20px;margin:4px 0">6 nafar</b><small class="muted">Ijara xonadonlari (3 ta manzil)</small></div>' +
      '<div class="kv" style="display:block;padding:12px;border:1px solid var(--line);border-radius:12px"><small class="muted" style="font-weight:800">O\'Z UYI / QARINDOSHI</small><b style="display:block;font-size:20px;margin:4px 0">10 nafar</b><small class="muted">Toshkent sh. doimiy</small></div>' +
    '</div>' +
    '<div style="padding:14px;border-radius:12px;background:var(--soft);border:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap">' +
      '<div style="flex:1;min-width:260px">' +
        '<div style="font-size:12px;font-weight:800;color:var(--pri);text-transform:uppercase;margin-bottom:6px"><i class="fa-solid fa-route"></i> BUGUNGI OPTIMAL TASHRIF MARSHRUTI (CHILONZOR KESIMIDA · 3.4 KM):</div>' +
        '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;font-weight:700">' +
          '<span class="chip ok">1-manzil: Chilonzor-18, 12-uy, 34-xonadon (3 talaba)</span>' +
          '<span>→</span>' +
          '<span class="chip pri">2-manzil: Chilonzor-19, 4-uy, 15-xonadon (2 talaba)</span>' +
          '<span>→</span>' +
          '<span class="chip warn">3-manzil: Shuhrat chorrahasi, 8-uy, 51-xonadon (2 talaba)</span>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button type="button" class="btn sm ghost" data-act="export-excel"><i class="fa-solid fa-file-excel"></i> Excelga yuklash (.CSV)</button>' +
        '<a class="btn sm" href="/maps"><i class="fa-solid fa-map-location-dot"></i> RIAT-Maps xaritada ochish</a>' +
      '</div>' +
    '</div>', chip("Avto-marshrut", "pri"));
}
V.tutor = {};
V.tutor.home = () => {
  const G = S.groups || [], st = S.students || [];
  const risk = st.filter((x) => x.absH > 15 || x.ifi < 40).slice(0, 5);
  const todayEv = (S.events || []).filter((e) => e.mine && e.date === today());
  const exW = (S.explanations || []).filter((x) => x.status === "yozildi").length;
  const need = (g) => (S.schedules[g] || []).filter((x) => x.day === isoDay(today())).length;
  const unmarked = G.filter((g) => need(g) && (S.marked[g] || []).length < need(g));
  const ttjReady = (S.dorm || []).filter((a) => a.status === "tyutorda");
  const ttjBanner = ttjReady.length ? '<div class="note ok" style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap">' +
    '<div><b><i class="fa-solid fa-face-viewfinder"></i> TTJdan ketish so\'rovi: ' + ttjReady.length + ' nafar talabaning ota-onasi Face ID orqali ruxsat berdi!</b><br><span class="small">Yashil rangda belgilangan arizalarni ko\'rib chiqib, dam olish kunlari ketishga ruxsat bering.</span></div>' +
    '<a class="btn sm ok" href="#/queue?t=dorm">Ko\'rish va ruxsat berish</a></div>' : "";
  return ttjBanner + '<div class="grid g4" style="margin-bottom:16px">' + stat("Talabalarim", st.length, G.join(", ") || "guruh yo'q", "", "#/students") + stat("Bugungi davomat", (G.length - unmarked.length) + " / " + G.length, "guruh belgilandi", unmarked.length ? "warn" : "ok", "#/attendance") +
    stat("Kutilayotgan arizalar", (S.queue || []).length + ttjReady.length, "IFI va TTJ bo'yicha", ((S.queue || []).length + ttjReady.length) ? "warn" : "", "#/queue") + stat("Tushuntirish xatlari", exW, "ko'rib chiqish kerak", exW ? "warn" : "", "#/explanations") + "</div>" +
    (!G.length ? '<p class="note warn">Sizga hali guruh biriktirilmagan. Administratorga murojaat qiling.</p>' : "") +
    '<div style="margin-bottom:16px">' + tutorHousingMapWidget() + '</div>' +
    '<div class="grid g2">' + card("Bugungi davomat", G.length ? '<div class="list">' + G.map((g) => { const done = S.marked[g] || [], n = (S.schedules[g] || []).filter((x) => x.day === isoDay(today())).length;
      return '<div class="row"><span class="t"><b>' + esc(g) + "</b><small>" + (n ? n + " para · " + done.length + " tasi belgilangan" : "bugun dars yo'q") + "</small></span>" + (n ? (done.length >= n ? chip("Belgilandi", "ok") : '<a class="btn sm" href="#/attendance?g=' + encodeURIComponent(g) + '">Davomat qilish</a>') : "") + "</div>"; }).join("") + "</div>" : empty("Guruh yo'q.")) +
    card("Kutilayotgan arizalar", (S.queue || []).length ? '<div class="list">' + S.queue.slice(0, 4).map((e) => '<a class="row" href="#/queue"><span class="date"><b>' + e.n + '</b><small>band</small></span><span class="t"><b>' + esc(e.name) + "</b><small>" + esc(e.critName) + " · " + esc(e.subName) + "</small></span></a>").join("") + "</div>" : empty("Yangi ariza yo'q."), '<a href="#/queue">Barchasi</a>') +
    card("Bugungi tadbirlar", todayEv.length ? '<div class="list">' + todayEv.map((e) => '<div class="row"><span class="t"><b>' + esc(e.title) + "</b><small>" + esc([e.time, e.place].join(" · ")) + '</small></span><button class="btn sm" data-act="qr-open" data-id="' + esc(e.id) + '">' + ic("qr") + "QR</button></div>").join("") + "</div>" : empty("Bugun tadbir yo'q."), '<a href="#/events">Tadbirlar</a>') +
    card("E'tibor talab qiladi", risk.length ? '<div class="list">' + risk.map((x) => '<a class="row" href="#/student/' + encodeURIComponent(x.login) + '">' + ava(x.name + " " + x.surname) + '<span class="t"><b>' + esc(x.name + " " + x.surname) + "</b><small>" + (x.absH > 15 ? x.absH + " soat sababsiz" : "") + (x.absH > 15 && x.ifi < 40 ? " · " : "") + (x.ifi < 40 ? "IFI " + f1(x.ifi) : "") + "</small></span></a>").join("") + "</div>" : empty("Hammasi joyida."), "") + "</div>";
};
function loadSheet(g, d) { return api("attSheet", { grp: g, date: d }, { quiet: true, noRender: true, lite: true }).then((j) => { if (j) { ui.ATT = j.data; ui.ATT.pair = ui.ATT.pairs[0] ? ui.ATT.pairs[0].pair : 0; const nd = ui.ATT.pairs.find((p) => !ui.ATT.done.includes(p.pair)); if (nd) ui.ATT.pair = nd.pair; } render(); }); }
V.tutor.attendance = (r) => {
  const G = S.groups || [];
  if (!G.length) return card("", empty("Sizga guruh biriktirilmagan."));
  const g = (r.q.get("g") && G.includes(r.q.get("g")) ? r.q.get("g") : "") || (ui.ATT && G.includes(ui.ATT.grp) ? ui.ATT.grp : G[0]), d = r.q.get("d") || (ui.ATT && ui.ATT.grp === g ? ui.ATT.date : today());
  if (!ui.ATT || ui.ATT.grp !== g || ui.ATT.date !== d) { ui.afterRender.push(() => loadSheet(g, d)); return card("", '<p class="muted">Yuklanmoqda…</p>'); }
  const A = ui.ATT;
  const top = '<form class="bar-row" data-form="attpick">' + (G.length > 1 ? '<select name="g" style="width:auto">' + G.map((x) => '<option' + (x === g ? " selected" : "") + ">" + esc(x) + "</option>").join("") + "</select>" : '<input type="hidden" name="g" value="' + esc(g) + '"><b>' + esc(g) + "</b>") +
    '<input type="date" name="d" value="' + d + '" max="' + today() + '" style="width:auto"><button class="btn ghost sm" type="submit">Ko\'rsatish</button></form>';
  if (!A.pairs.length) return top + card("", empty(fmtDate(d) + " — jadval bo'yicha dars yo'q."));
  const cur = A.marks.filter((m) => m.pair === A.pair);
  const val = (lg) => (cur.find((m) => m.login === lg) || {}).status || "";
  const opt = (lg, v, cls, t) => '<label><input type="radio" name="m_' + esc(lg) + '" value="' + v + '"' + (val(lg) === v ? " checked" : "") + '><span class="' + cls + '">' + t + "</span></label>";
  return top + '<div class="pchips" style="margin-bottom:14px">' + A.pairs.map((p) => '<button type="button" class="pchip ' + (p.pair === A.pair ? "on " : "") + (A.done.includes(p.pair) ? "done" : "") + '" data-act="att-pair" data-p="' + p.pair + '">' + p.pair + "-para · " + esc(S.pairs[p.pair] || "") + "<small>" + esc(p.subject) + "</small></button>").join("") + "</div>" +
    card(esc(g) + " · " + fmtDate(d) + " · " + A.pair + "-para", '<form data-form="att"><input type="hidden" name="grp" value="' + esc(g) + '"><input type="hidden" name="date" value="' + d + '"><input type="hidden" name="pair" value="' + A.pair + '"><div class="am">' +
      A.students.map((s) => '<div class="am-r">' + ava(s.name + " " + s.surname) + '<span class="t"><b>' + esc(s.surname + " " + s.name) + '</b></span><span class="tg">' + opt(s.login, "", "k", "Keldi") + opt(s.login, "kelmadi", "m", "Kelmadi") + opt(s.login, "sababli", "s", "Sababli") + "</span></div>").join("") +
      '</div><div class="sticky-act"><button type="button" class="btn ghost" data-act="att-all">Hammasi keldi</button><button class="btn" type="submit" name="scope" value="pair">' + ic("check") + "Saqlash</button>" + (A.pairs.length > 1 ? '<button class="btn ghost" type="submit" name="scope" value="day">Kun bo\'yi uchun</button>' : "") + "</div></form>",
      A.done.includes(A.pair) ? chip("Belgilangan", "ok") : chip("Belgilanmagan", "warn")) +
    '<p class="small muted" style="margin-top:10px">Kechikib kelgan talaba «Keldi» deb belgilanadi. Kelmagan talabaning ota-onasiga avtomatik xabar boradi. Sababsiz qoldirilgan har bir para 2 soat hisoblanadi va IFI 6-bandiga ta\'sir qiladi (to\'liq versiyada HEMIS davomati).</p>';
};
function queueCard(e) {
  const c = crit(e.crit), F = e.fields || {};
  const fl = [["Nomi", F.title], ["Joyi", F.place], ["Sana", F.date ? fmtDate(F.date) : ""], ["Ishtiroki", F.role], ["Havola", F.link]].filter((x) => x[1]);
  return '<div class="card" style="display:grid;gap:10px"><div style="display:flex;gap:12px;align-items:flex-start"><span class="date"><b>' + e.n + '</b><small>band</small></span><div style="flex:1;min-width:0"><b>' + esc(e.name) + ' <span class="muted small">· ' + esc(e.grp || "") + '</span></b><div class="small muted">' + esc(e.critName) + " · " + fmtDate(e.date) + " · " + ago(e.created) + "</div></div>" +
    chip(e.source === "qr" ? "QR" : e.source === "club" ? "Klub ro'yxati" : c.who === "ref" ? "Ma'lumotnoma" : "Hujjat", "pri") + "</div>" +
    (fl.length ? '<div class="kv">' + fl.map((x) => "<div><small>" + x[0] + "</small><b>" + (x[0] === "Havola" ? '<a href="' + esc(x[1]) + '" target="_blank" rel="noopener">' + esc(x[1]) + "</a>" : esc(x[1])) + "</b></div>").join("") + "</div>" : "") +
    (e.note ? '<p class="small" style="margin:0"><b>Izoh:</b> ' + esc(e.note) + "</p>" : "") + (e.flags && e.flags.length ? '<p class="note warn small" style="margin:0">' + esc(e.flags.join("; ")) + "</p>" : "") +
    ((e.files || []).length ? '<div style="display:flex;gap:6px;flex-wrap:wrap">' + e.files.map((f, i) => '<button class="btn sm ghost" data-act="file" data-id="' + esc(f) + '">' + ic("doc") + (i + 1) + "-fayl</button>").join("") + (c.who === "ref" && e.source === "student" ? '<a class="btn sm ghost" href="#/ref/' + esc(e.id) + '" data-act="ref-from-queue" data-id="' + esc(e.id) + '">' + ic("print") + "Ma'lumotnoma</a>" : "") + "</div>" : "") +
    '<form class="form" data-form="review" style="gap:10px;padding-top:10px;border-top:1px solid var(--line2)"><input type="hidden" name="id" value="' + esc(e.id) + '">' +
    (c.subs.length > 1 ? field("Mezon (kerak bo'lsa o'zgartiring)", "sub", { type: "select", val: e.sub, opts: c.subs.map((s) => [s.id, s.name + (s.pts ? " — " + s.pts + " ball" : "")]) }) : "") +
    field("Izoh", "comment", { ph: "Rad etsangiz, sababini yozing — talaba ko'radi" }) + '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn ok" type="submit" name="decision" value="tasdiqlandi">' + ic("check") + 'Tasdiqlash</button><button class="btn bad" type="submit" name="decision" value="rad">Rad etish</button></div></form></div>';
}

V.tutor.queue = (r) => {
  const t = ["dorm", "spr"].includes(r.q.get("t")) ? r.q.get("t") : "ifi", Q = S.queue || [], D = S.dorm || [], SP = S.spravkas || [];
  const dn = D.filter((a) => a.status === "tyutorda").length;
  const tab = (k, txt, n) => '<a href="#/queue' + (k === "ifi" ? "" : "?t=" + k) + '" class="' + (t === k ? "on" : "") + '">' + txt + (n ? "<em>" + n + "</em>" : "") + "</a>";
  const head = '<div class="tabs">' + tab("ifi", "IFI", Q.length) + tab("dorm", "Yotoqxona", dn) + tab("spr", "Spravkalar", 0) + "</div>";
  if (t === "dorm") return head + (D.length ? '<div class="grid g2">' + D.slice().sort((a, b) => (b.status === "tyutorda") - (a.status === "tyutorda")).map((a) => dormCard(a, { who: true, tutor: true })).join("") + "</div>" : card("", empty("Yotoqxona arizasi yo'q.")));
  if (t === "spr") return head + '<p class="lead">Spravkani dekanat tasdiqlaydi. Tasdiqlansa, qoldirilgan darslar avtomatik «sababli» bo\'ladi.</p>' + (SP.length ? '<div class="grid g2">' + SP.map((x) => spravkaCard(x, { who: true })).join("") + "</div>" : card("", empty("Spravka yo'q.")));
  return head + '<p class="lead">Hujjatni ko\'ring: to\'g\'ri bo\'lsa tasdiqlang — ball avtomatik qo\'shiladi.</p>' + (Q.length ? '<div class="grid g2">' + Q.map(queueCard).join("") + "</div>" : card("", empty("Yangi ariza yo'q.")));
};
function studentsTable(list, opt) {
  opt = opt || {};
  return '<div class="tw"><table class="t st"><thead><tr><th>Talaba</th>' + (opt.grp ? "<th>Guruh</th>" : "") + '<th class="n">GPA</th><th class="n">IFI</th><th class="n">Grant bali</th><th>Daraja</th><th class="n">Sababsiz, soat</th></tr></thead><tbody>' +
    (list.length ? list.map((x) => '<tr data-href="#/student/' + encodeURIComponent(x.login) + '"><td><span class="who">' + ava(x.name + " " + x.surname) + "<span><b>" + esc(x.surname + " " + x.name) + "</b>" + (opt.grp ? "" : "<small>" + esc(x.grp) + "</small>") + (catTags(x) ? '<span class="tags">' + catTags(x) + "</span>" : "") + "</span></span></td>" + (opt.grp ? '<td data-l="Guruh">' + esc(x.grp) + "</td>" : "") +
      '<td class="n" data-l="GPA">' + (x.gpa == null ? '<span class="muted">kutilmoqda</span>' : f2(x.gpa)) + '</td><td class="n" data-l="IFI"><b>' + f1(x.ifi) + "</b>" + (x.penalty ? ' <small style="color:var(--bad)">−' + x.penalty + "</small>" : "") + '</td><td class="n" data-l="Grant">' + (x.grant && x.grant.score != null ? f1(x.grant.score) : "—") + '</td><td data-l="Daraja">' + esc(x.level) + '</td><td class="n" data-l="Sababsiz">' + (x.absH > 15 ? '<b style="color:var(--bad)">' + x.absH + "</b>" : x.absH) + "</td></tr>").join("") : '<tr><td colspan="7">' + empty("Talaba topilmadi.") + "</td></tr>") + "</tbody></table></div>";
}
V.tutor.students = (r) => {
  const G = S.groups || [], g = r.q.get("g") || "", c = r.q.get("c") || "";
  const all = (S.students || []).filter((x) => !g || x.grp === g);
  const L = all.filter(catTest(c)).sort((a, b) => b.ifi - a.ifi);
  return catChips(all, c, (k) => "#/students" + (k ? "?c=" + k : "")) + studentsTable(L, { grp: G.length > 1 });
};

V.tutor.anketa = (r) => {
  const t = r.q.get("t") === "soc" ? "soc" : "list", Q = S.socialQueue || [];
  return '<div class="tabs"><a href="#/anketa" class="' + (t === "list" ? "on" : "") + '">Anketalar</a><a href="#/anketa?t=soc" class="' + (t === "soc" ? "on" : "") + '">Ijtimoiy toifa' + (Q.length ? "<em>" + Q.length + "</em>" : "") + "</a></div>" +
    (t === "soc" ? socialQueue(Q) : anketaBoard(S.students || [], { groups: S.groups || [] }));
};
function studentPage(r) {
  const login = r.parts[1], tab = r.q.get("tab") || "main";
  if (!ui.CARD || ui.CARD.login !== login) {
    ui.afterRender.push(() => api("studentCard", { login }, { quiet: true, noRender: true, lite: true }).then((j) => { if (j) { ui.CARD = j.data; render(); } else go("#/students"); }));
    return { title: "Talaba kartasi", html: card("", '<p class="muted">Yuklanmoqda…</p>') };
  }
  const st = ui.CARD, tutor = S.me.role === "tutor", base = "#/student/" + encodeURIComponent(login);
  const dean = S.me.role === "dean" || S.me.role === "admin";
  const T = [["main", "Umumiy"], ["anketa", "Anketa"], ["attendance", "Davomat"], ["gpa", "GPA"], ["ifi", "Ijtimoiy faollik"], ["grant", "Grant va kontrakt"], ["notes", "Izohlar"], ["ex", "Tushuntirish xatlari"]];
  let body;
  if (tab === "attendance") body = attView(st, { today: true });
  else if (tab === "gpa") body = gpaView(st);
  else if (tab === "ifi") body = ifiView(st, { canScore: st.canScore, tab: r.q.get("t") === "apps" ? "apps" : "crit", href: base + "?tab=ifi", appsHref: base + "?tab=ifi&t=apps", base: base + "?tab=" });
  else if (tab === "notes") body = notesView(st, { tutor });
  else if (tab === "anketa") body = anketaView(st, { staff: true }) + '<div style="height:16px"></div>' + socialBlock(st, { staff: true });
  else if (tab === "grant") body = '<div class="grid g2" style="align-items:start">' + grantView(st) + contractView(st) + "</div>" + '<div style="height:16px"></div>' + disciplineCard(st, dean) + (dean && st.payType !== "grant" ? '<div style="height:16px"></div>' + contractForm(st) : "");
  else if (tab === "ex") body = (tutor ? card("Tushuntirish xati so'rash", exRequestForm([], st.login)) + '<div style="height:16px"></div>' : "") + exView(st, { tutor });
  else body = '<div class="kpis">' + homeKpis(st, { base: base + "?tab=", grantHref: base + "?tab=grant" }) + "</div>" +
    '<div class="grid g2">' + card("Aloqa", '<div class="kv"><div><small>Login</small><b>' + esc(st.login) + "</b></div>" + (st.jshir ? "<div><small>JSHIR</small><b>" + esc(st.jshir) + "</b></div>" : "") + "<div><small>Telefon</small><b>" + (st.phone ? '<a href="tel:' + tel(st.phone) + '">' + esc(st.phone) + "</a>" : "—") + "</b></div></div>" +
      '<h3 style="font-size:14px;margin:16px 0 8px">Ota-ona</h3>' + (st.parents.length ? '<div class="list">' + st.parents.map((p) => '<div class="row">' + ava(p.name) + '<span class="t"><b>' + esc(p.name) + "</b><small>" + esc(p.phone || "telefon kiritilmagan") + "</small></span>" + (p.phone ? '<a class="btn sm ghost" href="tel:' + tel(p.phone) + '">' + ic("phone") + "</a>" : "") + "</div>").join("") + "</div>" : '<p class="muted small">Ota-ona ulanmagan.</p>')) +
      card("Bugun", todayStatus(st) + '<h3 style="font-size:14px;margin:16px 0 8px">To\'garaklar</h3>' + (st.clubs.length ? st.clubs.map((c) => chip(c.name + (c.status === "a'zo" ? "" : " (so'rov)"), c.status === "a'zo" ? "ok" : "warn")).join(" ") : '<span class="muted small">A\'zo emas</span>') +
        '<h3 style="font-size:14px;margin:16px 0 8px">Tyutor izohlari</h3>' + (st.notes.length ? st.notes.slice(0, 3).map((n) => '<p class="small" style="margin:0 0 6px">' + chip(NK[n.kind] ? NK[n.kind][0] : n.kind, NK[n.kind] ? NK[n.kind][1] : "") + " " + esc(n.text) + "</p>").join("") : '<span class="muted small">Izoh yo\'q</span>')) + "</div>";
  return { title: st.name + " " + st.surname, html: '<a href="#/students" class="small">← Talabalar</a><div style="display:flex;gap:14px;align-items:center;margin:12px 0 16px">' + ava(st.name + " " + st.surname, "l") + '<div><h2 style="font-size:22px">' + esc(st.name + " " + st.surname) + '</h2><div class="muted">' + esc(st.grp) + " · " + esc(st.faculty) + "</div></div></div>" +
    '<div class="tabs">' + T.map((t) => '<a href="' + base + (t[0] === "main" ? "" : "?tab=" + t[0]) + '" class="' + (tab === t[0] ? "on" : "") + '">' + t[1] + "</a>").join("") + "</div>" + body };
}
V.tutor.student = studentPage;

function disciplineCard(st, canEdit) {
  const L = st.discipline || [], R = S.rules.grant;
  return card("Intizomiy jazo <small>har biri IFI dan −" + R.penalty + " ball</small>", (L.length ? '<div class="list">' + L.map((d) => '<div class="row"><span class="t"><b>' + esc(d.reason) + "</b><small>" + fmtDate(d.date) + "</small></span>" + (canEdit ? '<button class="btn sm ghost" data-act="dj-del" data-id="' + esc(d.id) + '">Bekor qilish</button>' : "") + "</div>").join("") + "</div>" : empty("Intizomiy jazo yo'q.")) +
    (canEdit ? '<form class="form" data-form="discipline" style="margin-top:14px"><input type="hidden" name="login" value="' + esc(st.login) + '"><div class="f2">' + field("Sabab", "reason", { req: true, ph: "Masalan: odob-axloq qoidalarini buzgani uchun hayfsan" }) + field("Sana", "date", { type: "date", max: today(), val: today() }) + '</div><button class="btn bad" type="submit">Jazo qo\'llash</button></form>' : ""));
}
function contractForm(st) {
  const k = st.contract || { due: 0, paid: 0 };
  return card("Kontrakt summasini kiritish <small>" + esc(S.year) + "</small>", '<form class="form" data-form="contract"><input type="hidden" name="login" value="' + esc(st.login) + '"><div class="f2">' + field("To'lanishi kerak (so'm)", "due", { type: "number", min: 0, req: true, val: k.due || "" }) + field("To'langan (so'm)", "paid", { type: "number", min: 0, req: true, val: k.paid || 0 }) + '</div><p class="small muted" style="margin:0">' + esc(S.contractInfo.note) + '</p><button class="btn" type="submit">Saqlash</button></form>');
}
V.tutor.explanations = () => {
  const X = S.explanations || [];
  const by = (k) => X.filter((x) => x.status === k);
  const box = (title, L, tutor) => L.length ? '<h3 style="font-size:15px;margin:20px 0 10px">' + title + " (" + L.length + ')</h3><div class="grid g2">' + L.map((x) => exLetter(x, { name: x.name.split(" ")[0], surname: x.name.split(" ").slice(1).join(" "), grp: x.grp }, { tutor, who: true })).join("") + "</div>" : "";
  return card("Tushuntirish xati so'rash", '<p class="muted small" style="margin:-6px 0 12px">Siz talabani, sanani va nima uchunligini kiritasiz — talaba faqat sababini yozadi.</p>' + exRequestForm(S.students || [])) +
    box("Ko'rib chiqish kerak", by("yozildi"), true) + box("Javob kutilmoqda", by("so'ralgan")) + box("Yakunlangan", X.filter((x) => x.status === "qabul qilindi" || x.status === "rad etildi")) + (X.length ? "" : '<div style="height:16px"></div>' + card("", empty("Tushuntirish xatlari yo'q.")));
};
function eventsPage(r, opt) {
  const E = S.events || [], mine = E.filter((e) => e.mine), other = E.filter((e) => !e.mine && e.date >= today());
  const up = mine.filter((e) => e.date >= today()), past = mine.filter((e) => e.date < today()).reverse();
  return '<div class="bar-row"><button class="btn" data-act="ev-new">' + ic("plus") + "Yangi tadbir</button>" + '<span class="small muted">' + esc(opt.hint) + "</span></div>" +
    '<h3 style="font-size:15px;margin:6px 0 10px">Mening tadbirlarim</h3><div class="grid">' + (up.length ? up.map((e) => evCard(e, { owner: true })).join("") : card("", empty("Rejalashtirilgan tadbir yo'q."))) + "</div>" +
    (past.length ? '<h3 style="font-size:15px;margin:22px 0 10px">O\'tgan</h3><div class="grid">' + past.slice(0, 10).map((e) => evCard(e, { owner: true })).join("") + "</div>" : "") +
    (opt.others && other.length ? '<h3 style="font-size:15px;margin:22px 0 10px">Boshqa tadbirlar</h3>' + card("", '<div class="list">' + other.map(evRow).join("") + "</div>") : "");
}
V.tutor.events = (r) => eventsPage(r, { hint: "Faqat o'z guruhlaringiz uchun. QR-kod tadbir kuni ochiladi.", others: true });
function evForm(e) {
  const role = S.me.role;
  e = e || { kind: "tadbir", groups: [], ifi: "" };
  const groups = role === "tutor" ? S.groups || [] : Array.from(new Set((S.students || []).map((s) => s.grp))).sort();
  const ifiOpts = [["", "IFI ball bermaydi"]].concat(Object.keys(S.rules.eventIfi).map((k) => [k, S.rules.eventIfi[k]]));
  return '<form class="form" data-form="event"><input type="hidden" name="id" value="' + esc(e.id || "") + '">' + field("Nomi", "title", { req: true, val: e.title }) +
    '<div class="f2">' + field("Turi", "kind", { type: "select", val: e.kind, opts: [["tadbir", "Tadbir"], ["musobaqa", "Musobaqa"]] }) + field("Sana", "date", { type: "date", req: true, val: e.date || today() }) + "</div>" +
    '<div class="f2">' + field("Vaqti", "time", { val: e.time, ph: "15:00 – 17:00" }) + field("Joyi", "place", { val: e.place, ph: "Masalan: Akt zali" }) + "</div>" +
    field("IFI bandi (QR orqali qatnashganlarga)", "ifi", { type: "select", val: e.ifi, opts: ifiOpts }) +
    (role === "club" ? field("Klub", "club", { type: "select", val: e.clubId, opts: (S.myClubs || []).map((c) => [c.id, c.name]) }) :
      '<div class="fl"><span>Guruhlar' + (role === "tutor" ? "" : " <small>tanlanmasa — hamma uchun</small>") + '</span><div class="pchips">' + groups.map((g) => '<label class="opt" style="padding:7px 11px"><input type="checkbox" name="groups" value="' + esc(g) + '"' + ((e.groups || []).includes(g) || (role === "tutor" && groups.length === 1) ? " checked" : "") + "><span>" + esc(g) + "</span></label>").join("") + "</div></div>") +
    field("Tavsif", "description", { type: "textarea", rows: 3, val: e.description }) + '<button class="btn block" type="submit">Saqlash</button></form>';
}
function qrPoll(sid) {
  if (parseRoute().parts[0] !== "qr") { clearInterval(ui.qrTimer); ui.qrTimer = null; return; }
  api("qrToken", { id: sid }, { quiet: true, silent: true, noRender: true, lite: true }).then((j) => {
    const el = document.getElementById("qr-live");
    if (!el) return;
    if (!j) { el.innerHTML = card("", '<p class="note bad">QR sessiya topilmadi.</p>'); return; }
    const d = j.data, url = location.origin + "/#/c/" + d.id + "." + d.token;
    el.querySelector("h2").textContent = d.title;
    el.querySelector(".qi").textContent = (d.ifi ? "IFI: " + d.ifi + " · " : "") + (d.active ? new Date(d.ends).toLocaleTimeString("uz", { hour: "2-digit", minute: "2-digit" }) + " gacha ochiq" : "Yopilgan");
    el.querySelector(".big-n").textContent = d.count;
    el.querySelector(".qp").textContent = d.pending ? d.pending + " tasi shubhali — tyutor tasdig'ini kutmoqda" : "";
    el.querySelector(".ql").innerHTML = d.recent.length ? d.recent.map((x) => '<div class="row"><span class="t"><b>' + esc(x.name) + "</b><small>" + esc(x.grp) + " · " + ago(x.at) + "</small></span></div>").join("") : empty("Hali hech kim skanerlamadi.");
    const box = el.querySelector(".q");
    if (!d.active) { box.innerHTML = '<p class="note">QR-kod yopilgan.</p>'; el.querySelector(".qr-tm").style.display = "none"; el.querySelector("[data-act=qr-end]").style.display = "none"; clearInterval(ui.qrTimer); return; }
    if (d.token !== ui.qrLast) {
      ui.qrLast = d.token;
      box.innerHTML = "";
      if (window.QRCode) new window.QRCode(box, { text: url, width: 340, height: 340, correctLevel: window.QRCode.CorrectLevel ? window.QRCode.CorrectLevel.M : undefined });
      else box.innerHTML = '<p>' + esc(url) + "</p>";
      const b = el.querySelector(".qr-tm i");
      b.style.transition = "none"; b.style.width = (d.next / 300) + "%"; void b.offsetWidth; b.style.transition = "width " + d.next / 1000 + "s linear"; b.style.width = "0%";
    }
  });
}
function qrPage(r) {
  const sid = r.parts[1];
  ui.qrLast = "";
  ui.afterRender.push(() => { clearInterval(ui.qrTimer); qrPoll(sid); ui.qrTimer = setInterval(() => qrPoll(sid), 4000); });
  return { title: "QR-kod", html: '<div id="qr-live"><div class="qr-wrap"><div class="qr-box"><h2 style="font-size:20px;text-align:center">…</h2><p class="muted qi" style="text-align:center;margin:4px 0 16px"></p><div class="q"></div><div class="qr-tm"><i></i></div><p class="small muted" style="text-align:center;margin:12px 0 0">Kod har 30 soniyada yangilanadi. Talabalar telefon kamerasi bilan skanerlaydi.</p></div>' +
    card("Qayd etilganlar", '<div class="big-n">0</div><p class="small muted qp" style="margin:4px 0 12px"></p><div class="list ql"></div><button class="btn bad block" style="margin-top:14px" data-act="qr-end" data-id="' + esc(sid) + '">QR-kodni yopish</button>') + "</div></div>" };
}
V.tutor.qr = qrPage;
["home", "attendance", "queue", "students", "anketa", "explanations", "events"].forEach((k) => { V.tutor[k] = TGV(V.tutor[k]); });


V.dean = {};
function overview() {
  const st = S.students || [], T = S.tutors || [];
  const avg = (f) => (st.length ? st.reduce((a, x) => a + f(x), 0) / st.length : 0);
  const withGpa = st.filter((x) => x.gpa != null), avgGpa = withGpa.length ? withGpa.reduce((a, x) => a + x.gpa, 0) / withGpa.length : null;
  const lv = S.rules.levels.map((l) => [l[1], st.filter((x) => x.level === l[1]).length]);
  const pend = T.reduce((a, t) => a + t.pending, 0), ex = T.reduce((a, t) => a + t.exOpen, 0);
  const redAlertBanner = '<section class="card" style="border:2px solid var(--bad);background:var(--bad-soft);margin-bottom:16px">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap">' +
      '<div>' +
        '<div style="font-size:12px;font-weight:900;color:var(--bad);text-transform:uppercase;letter-spacing:0.05em"><i class="fa-solid fa-triangle-exclamation"></i> QIZIL SIGNAL · YOTOQXONADAN (TTJ) RUXSATSIZ KETGANLAR NAZORATI</div>' +
        '<b style="display:block;font-size:18px;margin:4px 0;color:var(--ink)">16 nafar talaba ota-ona Face ID tasdig\'i va tyutor ruxsatisiz TTJni tark etgan!</b>' +
        '<div class="small muted">Dushanba ertalab soat <b>08:30 da</b> tarbiyachi-pedagog, tyutor va dekan o\'rinbosari huzurida intizomiy muhokama (elektron bayonnoma).</div>' +
      '</div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' +
        '<button type="button" class="btn sm bad" data-act="ttj-red-list"><i class="fa-solid fa-user-xmark"></i> Ruxsatsiz ketganlar (16)</button>' +
        '<button type="button" class="btn sm ghost" data-act="protocol-gen"><i class="fa-solid fa-file-signature"></i> Elektron bayonnoma rasmiylashtirish</button>' +
        '<button type="button" class="btn sm ghost" data-act="export-excel"><i class="fa-solid fa-file-excel"></i> Excelga yuklash</button>' +
      '</div>' +
    '</div>' +
  '</section>';
  return redAlertBanner + '<div class="grid g4" style="margin-bottom:16px">' + stat("Talabalar", st.length, "", "", "#/students") + stat("O'rtacha IFI", f1(avg((x) => x.ifi)), "100 ballik") + stat("O'rtacha GPA", gpaTxt(avgGpa), withGpa.length + " talabada modul yakunlangan") + stat("Kutilayotgan arizalar", pend, ex + " ta tushuntirish xati ochiq", pend ? "warn" : "") + "</div>" +
    '<div class="grid g2">' + card("IFI darajalari bo'yicha", '<div class="list">' + lv.map((l) => '<div class="row"><span class="t"><b>' + esc(l[0]) + "</b>" + bar(l[1], st.length || 1) + '</span><span class="v">' + l[1] + "</span></div>").join("") + "</div>") +
    card("Tyutorlar reytingi", tutorTable(T.slice().sort((a, b) => b.ifi - a.ifi).slice(0, 6), true), '<a href="#/tutors">Barchasi</a>') + "</div>";
}
function tutorTable(T, short) {
  return '<div class="tw"><table class="t st"><thead><tr><th>Tyutor</th>' + (short ? "" : "<th>Guruhlar</th><th class=\"n\">Talaba</th>") + '<th class="n">O\'rt. IFI</th>' + (short ? "" : '<th class="n">O\'rt. GPA</th><th class="n">Davomat belgilangan</th><th class="n">Kutilayotgan</th>') + "</tr></thead><tbody>" +
    T.map((t) => '<tr data-href="#/tutor/' + encodeURIComponent(t.login) + '"><td><span class="who">' + ava(t.name) + "<span><b>" + esc(t.name) + "</b>" + (short ? "<small>" + esc(t.groups.join(", ")) + "</small>" : "") + "</span></span></td>" +
      (short ? "" : '<td data-l="Guruhlar">' + esc(t.groups.join(", ") || "—") + '</td><td class="n" data-l="Talaba">' + t.n + "</td>") + '<td class="n" data-l="IFI"><b>' + f1(t.ifi) + "</b></td>" +
      (short ? "" : '<td class="n" data-l="GPA">' + (t.gpa == null ? "—" : f2(t.gpa)) + '</td><td class="n" data-l="Davomat">' + t.attMarked + '%</td><td class="n" data-l="Kutilayotgan">' + (t.pending ? '<b style="color:var(--warn)">' + t.pending + "</b>" : 0) + "</td>") + "</tr>").join("") + "</tbody></table></div>";
}
V.dean.home = overview;
V.dean.tutors = () => '<p class="lead">Tyutorlar o\'z guruhlari ko\'rsatkichlari bo\'yicha. «Davomat belgilangan» — oxirgi 2 haftada jadvaldagi kunlarning necha foizida davomat qilingani.</p>' + tutorTable((S.tutors || []).slice().sort((a, b) => b.ifi - a.ifi));
V.dean.tutor = (r) => {
  const t = (S.tutors || []).find((x) => x.login === r.parts[1]);
  if (!t) return card("", empty("Tyutor topilmadi."));
  const L = (S.students || []).filter((s) => t.groups.includes(s.grp)).sort((a, b) => b.ifi - a.ifi);
  return { title: t.name, html: '<a href="#/tutors" class="small">← Tyutorlar</a><div style="display:flex;gap:14px;align-items:center;margin:12px 0 16px">' + ava(t.name, "l") + '<div><h2 style="font-size:22px">' + esc(t.name) + '</h2><div class="muted">' + esc(t.groups.join(", ") || "guruh yo'q") + (t.phone ? ' · <a href="tel:' + tel(t.phone) + '">' + esc(t.phone) + "</a>" : "") + "</div></div></div>" +
    '<div class="grid g4" style="margin-bottom:16px">' + stat("Talabalar", t.n) + stat("O'rtacha IFI", f1(t.ifi)) + stat("Davomat belgilangan", t.attMarked + "%", "oxirgi 2 hafta", t.attMarked < 70 ? "warn" : "ok") + stat("Kutilayotgan arizalar", t.pending, t.exOpen + " ta xat javobsiz", t.pending > 5 ? "warn" : "") + "</div>" + studentsTable(L, { grp: t.groups.length > 1 }) };
};
V.dean.groups = () => {
  const st = S.students || [], G = {};
  st.forEach((s) => (G[s.grp] = G[s.grp] || { grp: s.grp, fac: s.faculty, L: [] }).L.push(s));
  const tut = (g) => (S.tutors || []).filter((t) => t.groups.includes(g)).map((t) => t.name).join(", ") || "—";
  const avg = (L, f) => L.reduce((a, x) => a + f(x), 0) / (L.length || 1);
  const gpaAvg = (L) => { const g = L.filter((x) => x.gpa != null); return g.length ? f2(avg(g, (x) => x.gpa)) : "—"; };
  return '<div class="tw"><table class="t st"><thead><tr><th>Guruh</th><th>Fakultet</th><th>Tyutor</th><th class="n">Talaba</th><th class="n">O\'rt. IFI</th><th class="n">O\'rt. GPA</th><th class="n">O\'rt. sababsiz soat</th></tr></thead><tbody>' +
    Object.values(G).sort((a, b) => avg(b.L, (x) => x.ifi) - avg(a.L, (x) => x.ifi)).map((g) => '<tr data-href="#/students?g=' + encodeURIComponent(g.grp) + '"><td><b>' + esc(g.grp) + '</b></td><td data-l="Fakultet">' + esc(g.fac) + '</td><td data-l="Tyutor">' + esc(tut(g.grp)) + '</td><td class="n" data-l="Talaba">' + g.L.length +
      '</td><td class="n" data-l="IFI"><b>' + f1(avg(g.L, (x) => x.ifi)) + '</b></td><td class="n" data-l="GPA">' + gpaAvg(g.L) + '</td><td class="n" data-l="Sababsiz">' + f1(avg(g.L, (x) => x.absH)) + "</td></tr>").join("") + "</tbody></table></div>";
};
V.dean.students = (r) => {
  const q = (r.q.get("q") || "").toLowerCase(), g = r.q.get("g") || "", f = r.q.get("f") || "", lv = r.q.get("lv") || "";
  const st = S.students || [];
  const facs = Array.from(new Set(st.map((x) => x.faculty))).sort(), grps = Array.from(new Set(st.filter((x) => !f || x.faculty === f).map((x) => x.grp))).sort();
  const c = r.q.get("c") || "";
  const base = st.filter((x) => (!q || (x.name + " " + x.surname + " " + x.login).toLowerCase().indexOf(q) >= 0) && (!g || x.grp === g) && (!f || x.faculty === f) && (!lv || x.level === lv));
  const L = base.filter(catTest(c)).sort((a, b) => b.ifi - a.ifi);
  const keep = (k) => { const p = new URLSearchParams(r.q); if (k) p.set("c", k); else p.delete("c"); return "#/students" + (p.toString() ? "?" + p : ""); };
  const sel = (n, v, opts, ph) => '<select name="' + n + '" style="width:auto"><option value="">' + ph + "</option>" + opts.map((o) => '<option' + (o === v ? " selected" : "") + ">" + esc(o) + "</option>").join("") + "</select>";
  return catChips(base, c, keep) + '<form class="bar-row" data-form="stfilter"><input type="hidden" name="c" value="' + esc(c) + '"><input type="search" name="q" value="' + esc(r.q.get("q") || "") + '" placeholder="Ism, familiya" style="max-width:220px">' + sel("f", f, facs, "Barcha fakultetlar") + sel("g", g, grps, "Barcha guruhlar") + sel("lv", lv, S.rules.levels.map((l) => l[1]), "Barcha darajalar") + '<button class="btn sm" type="submit">Saralash</button><span class="small muted">' + L.length + " ta talaba</span></form>" + studentsTable(L, { grp: true });
};
V.dean.student = studentPage;

V.dean.requests = (r) => {
  const t = r.q.get("t") === "dorm" ? "dorm" : "spr", SP = S.spravkas || [], D = S.dorm || [], f = r.q.get("f") || "";
  const pend = SP.filter((x) => x.status === "kutilmoqda");
  const head = '<div class="tabs"><a href="#/requests" class="' + (t === "spr" ? "on" : "") + '">Spravkalar' + (pend.length ? "<em>" + pend.length + "</em>" : "") + '</a><a href="#/requests?t=dorm" class="' + (t === "dorm" ? "on" : "") + '">Yotoqxona</a></div>';
  if (t === "spr") return head + (pend.length ? '<h3 style="font-size:15px;margin:0 0 10px">Tasdiqlash kerak (' + pend.length + ')</h3><div class="grid g2">' + pend.map((x) => spravkaCard(x, { who: true, dean: true })).join("") + "</div>" : card("", empty("Yangi spravka yo'q."))) +
    (SP.length > pend.length ? '<h3 style="font-size:15px;margin:20px 0 10px">Ko\'rib chiqilgan</h3><div class="grid g2">' + SP.filter((x) => x.status !== "kutilmoqda").slice(0, 30).map((x) => spravkaCard(x, { who: true })).join("") + "</div>" : "");
  const F = [["", "Hammasi"], ["tasdiqlandi", "Tasdiqlangan"], ["tyutorda", "Tyutorda"], ["ota-onada", "Ota-onada"], ["rad", "Rad etilgan"]];
  const L = D.filter((a) => !f || a.status === f);
  return head + '<div class="fchips">' + F.map(([k, n]) => '<a href="#/requests?t=dorm' + (k ? "&f=" + k : "") + '" class="' + (k === f ? "on" : "") + '">' + n + " <em>" + D.filter((a) => !k || a.status === k).length + "</em></a>").join("") + "</div>" +
    (L.length ? '<div class="grid g2">' + L.map((a) => dormCard(a, { who: true, tutor: true })).join("") + "</div>" : card("", empty("Ariza yo'q.")));
};
V.dean.events = (r) => eventsPage(r, { hint: "Tanlangan guruhlar yoki barcha talabalar uchun.", others: false });
V.dean.qr = qrPage;


function cohorts() {
  const map = {};
  (S.students || []).forEach((x) => { if (x.direction && x.course) map[x.faculty + "|" + x.direction + "|" + x.course] = { faculty: x.faculty, direction: x.direction, course: x.course }; });
  (S.quotas || []).forEach((q) => (map[q.faculty + "|" + q.direction + "|" + q.course] ||= { faculty: q.faculty, direction: q.direction, course: q.course }));
  return Object.entries(map).sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => ({ key: k, ...v }));
}
V.dean.grant = (r) => {
  const C = cohorts();
  if (!C.length) return card("", empty("Talabalarga ta'lim yo'nalishi va kurs kiritilmagan (Admin → Foydalanuvchilar)."));
  const ranked0 = (c) => (S.students || []).filter((x) => x.faculty === c.faculty && x.direction === c.direction && x.course === c.course && x.grant && x.grant.pos).length;
  const cur = C.find((c) => c.key === r.q.get("k")) || C.slice().sort((a, b) => ranked0(b) - ranked0(a))[0]; // standart: reytingi bor yo'nalish
  const q = (S.quotas || []).find((x) => x.faculty === cur.faculty && x.direction === cur.direction && x.course === cur.course) || { full_n: 0, half_n: 0 };
  const L = (S.students || []).filter((x) => x.faculty === cur.faculty && x.direction === cur.direction && x.course === cur.course);
  const ranked = L.filter((x) => x.grant && x.grant.pos).sort((a, b) => a.grant.pos - b.grant.pos);
  const rest = L.filter((x) => !(x.grant && x.grant.pos)).sort((a, b) => (b.gpa ?? -1) - (a.gpa ?? -1));
  const row = (x, i) => '<tr data-href="#/student/' + encodeURIComponent(x.login) + '?tab=grant"><td><b>' + (i == null ? "—" : i) + '</b></td><td><span class="who">' + ava(x.name + " " + x.surname) + "<span><b>" + esc(x.surname + " " + x.name) + "</b><small>" + esc(x.grp) + " · " + (x.payType === "grant" ? "grant" : "kontrakt") + "</small></span></span></td>" +
    '<td class="n" data-l="GPA">' + (x.gpa == null ? '<span class="muted">kutilmoqda</span>' : f2(x.gpa)) + '</td><td class="n" data-l="IFI">' + f1(x.ifi) + (x.penalty ? ' <small style="color:var(--bad)">−' + x.penalty + "</small>" : "") + '</td><td class="n" data-l="Ball"><b>' + (x.grant && x.grant.score != null ? f1(x.grant.score) : "—") + "</b></td><td>" + outChip(x.grant ? x.grant.outcome : "pending") + (x.grant && x.grant.uniPct ? " " + chip("Univ. " + x.grant.uniPct + "%", "pri") : "") + "</td></tr>";
  const sel = '<form class="bar-row" data-form="grantpick"><select name="k" style="width:auto;max-width:100%;min-width:0;flex:1 1 220px">' + C.map((c) => '<option value="' + esc(c.key) + '"' + (c.key === cur.key ? " selected" : "") + ">" + esc(c.direction + " · " + c.course + "-kurs (" + c.faculty + ")") + "</option>").join("") + '</select><button class="btn sm ghost" type="submit">Ko\'rsatish</button></form>';
  return sel + '<div class="grid g4" style="margin-bottom:16px">' + stat("Talabalar", L.length) + stat("Reytingda (GPA ≥ 3,5)", ranked.length, rest.filter((x) => x.gpa == null).length + " tasida modul kutilmoqda") + stat("To'liq grant o'rinlari", q.full_n) + stat("50% grant o'rinlari", q.half_n) + "</div>" +
    '<div class="grid g21">' + card("Reyting <small>grant bali = GPA × 16 + IFI ÷ 5</small>", '<div class="tw"><table class="t st"><thead><tr><th>#</th><th>Talaba</th><th class="n">GPA</th><th class="n">IFI</th><th class="n">Grant bali</th><th>Natija</th></tr></thead><tbody>' +
      (ranked.length ? ranked.map((x) => row(x, x.grant.pos)).join("") : '<tr><td colspan="6">' + empty("Reytingda hali talaba yo'q (joriy yil GPA si kerak).") + "</td></tr>") +
      (rest.length ? '<tr><td colspan="6" class="small muted" style="padding:10px 12px">Reytingdan tashqari: GPA 3,5 dan past yoki modul hali yakunlanmagan</td></tr>' + rest.map((x) => row(x, null)).join("") : "") + "</tbody></table></div>") +
    card("Grant o'rinlari", '<form class="form" data-form="quota"><input type="hidden" name="faculty" value="' + esc(cur.faculty) + '"><input type="hidden" name="direction" value="' + esc(cur.direction) + '"><input type="hidden" name="course" value="' + cur.course + '">' +
      '<p class="small muted" style="margin:0">' + esc(cur.direction + ", " + cur.course + "-kurs") + '</p><div class="f2">' + field("To'liq grant", "full", { type: "number", min: 0, val: q.full_n }) + field("50% grant", "half", { type: "number", min: 0, val: q.half_n }) + "</div>" +
      '<button class="btn block" type="submit">Saqlash</button><p class="small muted" style="margin:0">Saqlangach reyting avtomatik qayta hisoblanadi. Intizomiy jazo talaba kartasidagi «Grant va kontrakt» bo\'limida qo\'llanadi (IFI dan −15).</p></form>') + "</div>";
};


V.dean.contracts = (r) => {
  const K = S.contracts || [], st = S.students || [], f = r.q.get("f") || "";
  const by = Object.fromEntries(K.map((k) => [k.login, k]));
  const L = st.filter((x) => x.payType === "kontrakt" || by[x.login]).map((x) => ({ ...x, k: by[x.login] || null }));
  const sum = (fn) => L.reduce((a, x) => a + (x.k ? fn(x.k) : 0), 0);
  const due = sum((k) => k.due), paid = sum((k) => k.paid), pct = due ? Math.round((paid / due) * 100) : 0;
  const G = {};
  L.forEach((x) => { const g = (G[x.grp] ||= { grp: x.grp, n: 0, due: 0, paid: 0 }); g.n++; if (x.k) { g.due += x.k.due; g.paid += x.k.paid; } });
  const show = L.filter((x) => (f === "debt" ? !x.k || x.k.left > 0 : f === "none" ? !x.k : true)).sort((a, b) => (a.k ? a.k.pct : -1) - (b.k ? b.k.pct : -1));
  const seg = (v, t) => '<a href="#/contracts' + (v ? "?f=" + v : "") + '" class="' + (f === v ? "on" : "") + '">' + t + "</a>";
  return '<div class="grid g4" style="margin-bottom:16px">' + stat("To'lanishi kerak", num(due) + " <span>so'm</span>", L.length + " ta kontrakt talaba") + stat("To'langan", num(paid) + " <span>so'm</span>", pct + "%", pct >= 80 ? "ok" : "warn") +
    stat("Qoldiq", num(Math.max(0, due - paid)) + " <span>so'm</span>", L.filter((x) => x.k && x.k.left > 0).length + " talabada qarz", due - paid > 0 ? "bad" : "ok") + stat("Kiritilmagan", L.filter((x) => !x.k).length, "talaba", "", "#/contracts?f=none") + "</div>" +
    '<p class="note" style="margin-bottom:16px">' + esc(S.contractInfo.note) + "</p>" +
    '<div class="grid g21">' + card("Talabalar", '<div class="bar-row"><div class="seg">' + seg("", "Hammasi") + seg("debt", "Qarzdorlar") + seg("none", "Kiritilmagan") + "</div></div>" +
      '<div class="tw"><table class="t st"><thead><tr><th>Talaba</th><th class="n">Kerak</th><th class="n">To\'langan</th><th>Holat</th></tr></thead><tbody>' +
      (show.length ? show.map((x) => '<tr data-href="#/student/' + encodeURIComponent(x.login) + '?tab=grant"><td><b>' + esc(x.surname + " " + x.name) + '</b><br><small class="muted">' + esc(x.grp) + '</small></td><td class="n" data-l="Kerak">' + (x.k ? num(x.k.due) : "—") + '</td><td class="n" data-l="To\'langan">' + (x.k ? num(x.k.paid) : "—") + "</td><td>" +
        (x.k ? bar(x.k.paid, x.k.due, x.k.pct >= 100 ? "ok" : x.k.pct < 50 ? "bad" : "") + '<small class="muted">' + x.k.pct + "%</small>" : chip("Kiritilmagan", "warn")) + "</td></tr>").join("") : '<tr><td colspan="4">' + empty("Talaba yo'q.") + "</td></tr>") + "</tbody></table></div>") +
    card("Guruhlar bo'yicha", '<div class="list">' + Object.values(G).sort((a, b) => a.grp.localeCompare(b.grp)).map((g) => '<div class="row"><span class="t"><b>' + esc(g.grp) + "</b><small>" + g.n + " talaba · " + som(g.paid) + " / " + som(g.due) + "</small>" + bar(g.paid, g.due || 1) + '</span><span class="v">' + (g.due ? Math.round((g.paid / g.due) * 100) : 0) + "%</span></div>").join("") + "</div>") + "</div>";
};


V.admin = {};
V.admin.home = () => {
  const U = S.users || [], cnt = (r) => U.filter((u) => u.role === r).length;
  return '<div class="grid g4" style="margin-bottom:16px">' + stat("Talabalar", cnt("student"), "", "", "#/users?r=student") + stat("Ota-onalar", cnt("parent"), "", "", "#/users?r=parent") + stat("Tyutorlar", cnt("tutor"), "", "", "#/users?r=tutor") + stat("Klub rahbarlari", cnt("club"), (S.clubs || []).length + " ta to'garak", "", "#/clubs") + "</div>" +
    hemisCard() + '<div style="height:16px"></div>' + overview();
};
function hemisCard() {
  return card("HEMIS va Edu integratsiyasi", '<p class="note warn" style="margin-top:0"><b>MVP rejimi:</b> HEMIS va Edu ulanmagan. GPA, fanlar va dars jadvali namunaviy ma\'lumotlardan; davomat soatlari tyutor belgilashlaridan olinmoqda.</p>' +
    '<div class="tw" style="margin-top:12px"><table class="t"><thead><tr><th>Ma\'lumot</th><th>Manba (to\'liq versiya)</th><th>Hozir (MVP)</th></tr></thead><tbody>' +
    [["GPA va fanlar baholari (IFI 3-band)", "HEMIS", "Namunaviy jadval"], ["Davomat, qoldirilgan soatlar (IFI 6-band)", "HEMIS", "Tyutor davomati"], ["Kitobxonlik testi (IFI 1-band)", "HEMIS", "Talaba vedomost yuklaydi"], ["Dars jadvali", "Edu", "Namunaviy jadval"]]
      .map((x) => "<tr><td>" + x[0] + "</td><td><b>" + x[1] + "</b></td><td>" + x[2] + "</td></tr>").join("") + "</tbody></table></div>", src("Holat: namunaviy"));
}
V.admin.hemis = () => hemisCard() + '<div style="height:16px"></div>' + card("Ulash tartibi", '<ol style="margin:0;padding-left:20px;display:grid;gap:6px"><li>Universitetdan HEMIS API kaliti (token) va Edu jadval API manzili olinadi.</li><li>Kalitlar serverga maxfiy o\'zgaruvchi sifatida kiritiladi.</li><li>Serverdagi HEMIS adapteri (GPA, davomat, kitobxonlik) API ga ulanadi — platformaning qolgan qismi o\'zgarmaydi.</li><li>Ma\'lumotlar har kuni avtomatik yangilanadi.</li></ol>');
const ROLE_OPTS = [["student", "Talaba"], ["parent", "Ota-ona"], ["tutor", "Tyutor"], ["dean", "Dekanat"], ["club", "Klub rahbari"], ["admin", "Administrator"]];
const RL = Object.assign(Object.fromEntries(ROLE_OPTS), { warden: "Komendant (ishlatilmaydi)" });
V.admin.users = (r) => {
  const ro = r.q.get("r") || "", q = (r.q.get("q") || "").toLowerCase();
  const U = (S.users || []).filter((u) => (!ro || u.role === ro) && (!q || (u.name + " " + u.surname + " " + u.login + " " + (u.jshir || "") + " " + u.grp).toLowerCase().indexOf(q) >= 0));
  const kids = (p) => (S.links || []).filter((l) => l.parent_login === p).map((l) => { const k = (S.users || []).find((u) => u.login === l.child_login); return k ? k.name + " " + k.surname : l.child_login; });
  const tg = (t) => (S.tutorGroups || []).filter((x) => x.tutor === t).map((x) => x.grp);
  return '<div class="bar-row"><button class="btn" data-act="user-new">' + ic("plus") + 'Foydalanuvchi qo\'shish</button><button class="btn ghost" data-act="link-new">Ota-onani farzandga bog\'lash</button></div>' +
    '<form class="bar-row" data-form="ufilter"><input type="search" name="q" value="' + esc(r.q.get("q") || "") + '" placeholder="F.I.Sh., login, JSHIR, guruh" style="max-width:260px"><select name="r" style="width:auto"><option value="">Barcha rollar</option>' + ROLE_OPTS.map((o) => '<option value="' + o[0] + '"' + (o[0] === ro ? " selected" : "") + ">" + o[1] + "</option>").join("") + '</select><button class="btn sm" type="submit">Saralash</button><span class="small muted">' + U.length + " ta</span></form>" +
    '<div class="tw"><table class="t st"><thead><tr><th>F.I.Sh.</th><th>Rol</th><th>Login / JSHIR</th><th>Guruh / bog\'lanish</th><th></th></tr></thead><tbody>' +
    U.slice(0, 300).map((u) => '<tr><td><span class="who">' + ava(u.name + " " + u.surname) + "<span><b>" + esc(u.surname + " " + u.name) + "</b><small>" + esc(u.phone || "") + '</small></span></span></td><td data-l="Rol">' + esc(RL[u.role] || u.role) + '</td><td data-l="Login">' + esc(u.login) + (u.jshir && u.jshir !== u.login ? '<br><small class="muted">' + esc(u.jshir) + "</small>" : "") + "</td>" +
      '<td data-l="Guruh">' + esc(u.role === "student" ? u.grp : u.role === "tutor" ? tg(u.login).join(", ") : u.role === "parent" ? kids(u.login).join(", ") : u.faculty !== "-" ? u.faculty : "") + '</td><td style="white-space:nowrap"><button class="btn sm ghost" data-act="user-edit" data-id="' + esc(u.login) + '">Tahrirlash</button> <button class="btn sm bad" data-act="user-del" data-id="' + esc(u.login) + '">O\'chirish</button></td></tr>').join("") + "</tbody></table></div>";
};
function userForm(u) {
  u = u || { role: "student" };
  const tg = u.login ? (S.tutorGroups || []).filter((x) => x.tutor === u.login).map((x) => x.grp).join(", ") : "";
  return '<form class="form" data-form="user"><input type="hidden" name="edit" value="' + esc(u.login || "") + '">' + field("Rol", "role", { type: "select", val: u.role, opts: ROLE_OPTS }) +
    '<div class="f2">' + field("Ism", "name", { req: true, val: u.name }) + field("Familiya", "surname", { req: true, val: u.surname }) + "</div>" +
    '<div class="f2">' + field("Login", "login", { req: true, val: u.login, attrs: u.login ? " readonly" : ' autocapitalize="none"', ph: "masalan: ali.valiyev" }) + field("JSHIR", "jshir", { val: u.jshir, hint: "ixtiyoriy, 14 raqam", attrs: ' inputmode="numeric"' }) + "</div>" +
    '<div class="f2">' + field("Guruh", "grp", { val: u.grp !== "-" ? u.grp : "", hint: "talaba uchun", ph: "RST-81/25" }) + field("Fakultet / bo'lim", "faculty", { val: u.faculty !== "-" ? u.faculty : "" }) + "</div>" +
    '<div class="f2">' + field("Ta'lim yo'nalishi", "direction", { val: u.direction, hint: "talaba uchun", ph: "Raqamli iqtisodiyot" }) + '<div class="f2">' + field("Kurs", "course", { type: "select", val: u.course || "", opts: [["", "—"], 1, 2, 3, 4, 5, 6] }) +
    field("To'lov", "pay_type", { type: "select", val: u.pay_type || "", opts: [["", "—"], ["grant", "Grant"], ["kontrakt", "Kontrakt"]] }) + "</div></div>" +
    field("Tyutor guruhlari", "groups", { val: tg, hint: "tyutor uchun, vergul bilan", ph: "RST-81/25, RST-82/25" }) + field("Telefon", "phone", { type: "tel", val: u.phone }) +
    field(u.login ? "Yangi parol" : "Parol", "password", { type: "text", req: !u.login, hint: u.login ? "o'zgartirmasangiz bo'sh qoldiring" : "kamida 6 belgi — foydalanuvchiga bering" }) + '<button class="btn block" type="submit">Saqlash</button></form>';
}
V.admin.clubs = () => {
  const C = S.clubs || [];
  return '<div class="bar-row"><button class="btn" data-act="club-new">' + ic("plus") + 'To\'garak qo\'shish</button><span class="small muted">Klub rahbari — «Klub rahbari» rolidagi foydalanuvchi. U a\'zolarni tasdiqlaydi va klub tadbirlarini yaratadi.</span></div>' +
    '<div class="tw"><table class="t st"><thead><tr><th>To\'garak</th><th>IFI yo\'nalishi</th><th>Rahbar</th><th class="n">A\'zolar</th><th></th></tr></thead><tbody>' +
    C.map((c) => "<tr><td><b>" + esc(c.name) + "</b><br><small class=\"muted\">" + esc([c.schedule, c.place].filter(Boolean).join(" · ")) + '</small></td><td data-l="Yo\'nalish">' + esc(c.catName) + '</td><td data-l="Rahbar">' + esc(c.leaderName || "—") + '</td><td class="n" data-l="A\'zolar">' + c.members +
      '</td><td style="white-space:nowrap"><button class="btn sm ghost" data-act="club-edit" data-id="' + esc(c.id) + '">Tahrirlash</button> <button class="btn sm bad" data-act="club-del" data-id="' + esc(c.id) + '">O\'chirish</button></td></tr>').join("") + "</tbody></table></div>";
};
function clubForm(c) {
  c = c || {};
  const leaders = (S.users || []).filter((u) => u.role === "club").map((u) => [u.login, u.name + " " + u.surname]);
  return '<form class="form" data-form="clubform"><input type="hidden" name="id" value="' + esc(c.id || "") + '">' + field("Nomi", "name", { req: true, val: c.name }) +
    field("IFI 2-band yo'nalishi", "category", { type: "select", val: c.category, opts: crit("club").subs.filter((s) => s.id !== "org").map((s) => [s.id, s.name]) }) +
    field("Klub rahbari", "leader", { type: "select", val: c.leader, opts: [["", "Tanlanmagan"]].concat(leaders) }) + '<div class="f2">' + field("Vaqti", "schedule", { val: c.schedule, ph: "Du, Cho — 16:00" }) + field("Joyi", "place", { val: c.place }) + "</div>" +
    field("Tavsif", "description", { type: "textarea", rows: 3, val: c.description }) + '<button class="btn block" type="submit">Saqlash</button></form>';
}
V.admin.scholarships = () => {
  const L = S.scholarships || [], A = S.apps || [];
  const name = (id) => (L.find((s) => s.id === id) || {}).title || id;
  return '<div class="bar-row"><button class="btn" data-act="sch-new">' + ic("plus") + 'Stipendiya qo\'shish</button></div><div class="grid g2" style="margin-bottom:16px">' + L.map((s) => card(esc(s.title), '<p class="small muted" style="margin:0 0 10px">' + (s.amount ? num(s.amount) + " so'm · " : "") + "muddat: " + (s.deadline ? fmtDate(s.deadline) : "—") + " · " + A.filter((a) => a.item_id === s.id).length + ' ta ariza</p><div style="display:flex;gap:8px"><button class="btn sm ghost" data-act="sch-edit" data-id="' + esc(s.id) + '">Tahrirlash</button><button class="btn sm bad" data-act="sch-del" data-id="' + esc(s.id) + '">O\'chirish</button></div>')).join("") + "</div>" +
    card("Arizalar", A.length ? '<div class="tw"><table class="t st"><thead><tr><th>Talaba</th><th>Stipendiya</th><th>Sana</th><th>Holat</th></tr></thead><tbody>' + A.map((a) => "<tr><td><b>" + esc(a.name + " " + a.surname) + '</b><br><small class="muted">' + esc(a.grp) + '</small></td><td data-l="Stipendiya">' + esc(name(a.item_id)) + '</td><td data-l="Sana">' + fmtShort(a.date) +
      '</td><td><select data-act="app-status" data-id="' + esc(a.id) + '" style="height:34px;width:auto">' + ["Yuborilgan", "Ko'rib chiqilmoqda", "Qabul qilingan", "Rad etilgan"].map((s) => "<option" + (s === a.status ? " selected" : "") + ">" + s + "</option>").join("") + "</select></td></tr>").join("") + "</tbody></table></div>" : empty("Ariza yo'q."));
};
function schForm(s) {
  s = s || {};
  return '<form class="form" data-form="schform"><input type="hidden" name="id" value="' + esc(s.id || "") + '">' + field("Nomi", "title", { req: true, val: s.title }) + '<div class="f2">' + field("Oylik miqdori (so'm)", "amount", { type: "number", val: s.amount, min: 0 }) + field("Ariza muddati", "deadline", { type: "date", val: s.deadline }) + "</div>" +
    field("Tavsif", "description", { type: "textarea", rows: 3, val: s.description }) + field("Talablar", "requirements", { type: "textarea", rows: 3, val: (s.requirements || []).join("\n"), hint: "har biri yangi qatordan" }) + field("Aloqa", "contact", { val: s.contact }) + '<button class="btn block" type="submit">Saqlash</button></form>';
}
V.admin.news = () => {
  const A = S.articles || [];
  return '<div class="bar-row"><button class="btn" data-act="art-new">' + ic("plus") + "Yangilik qo'shish</button></div>" + card("", A.length ? '<div class="list">' + A.map((a) => '<div class="row"><span class="t"><b>' + esc(a.title) + "</b><small>" + esc(a.tag || "") + " · " + fmtDate(a.date) + '</small></span><a class="btn sm ghost" href="#/news/' + esc(a.id) + '">Ko\'rish</a><button class="btn sm bad" data-act="art-del" data-id="' + esc(a.id) + '">O\'chirish</button></div>').join("") + "</div>" : empty("Yangilik yo'q."));
};
V.admin.events = V.dean.events;
V.admin.requests = V.dean.requests;
V.admin.students = V.dean.students;
V.admin.student = studentPage;
V.admin.tutor = V.dean.tutor;
V.admin.qr = qrPage;
V.admin.tutors = V.dean.tutors;
V.admin.grant = V.dean.grant;
V.admin.contracts = V.dean.contracts;


V.club = {};
V.club.home = () => {
  const C = S.myClubs || [];
  if (!C.length) return card("", empty("Sizga hali to'garak biriktirilmagan. Administratorga murojaat qiling."));
  return '<p class="lead">A\'zolik so\'rovlarini tasdiqlang. Tasdiqlangan talabalar ro\'yxati IFI 2-band («To\'garaklarda ishtiroki») uchun tyutorga avtomatik yuboriladi.</p><div class="grid">' + C.map((c) => {
    const pend = c.members.filter((m) => m.status === "kutilmoqda"), mem = c.members.filter((m) => m.status === "a'zo");
    return card(esc(c.name) + " <small>" + esc(c.catName) + "</small>", (pend.length ? '<h3 style="font-size:14px;margin:0 0 8px">Yangi so\'rovlar (' + pend.length + ')</h3><div class="list" style="margin-bottom:14px">' + pend.map((m) => '<div class="row">' + ava(m.name) + '<span class="t"><b>' + esc(m.name) + "</b><small>" + esc(m.grp + " · " + m.faculty) + '</small></span><button class="btn sm ok" data-act="cdecide" data-c="' + esc(c.id) + '" data-l="' + esc(m.login) + '" data-d="a\'zo">Qabul qilish</button><button class="btn sm bad" data-act="cdecide" data-c="' + esc(c.id) + '" data-l="' + esc(m.login) + '" data-d="rad">Rad etish</button></div>').join("") + "</div>" : "") +
      '<h3 style="font-size:14px;margin:0 0 8px">A\'zolar (' + mem.length + ")</h3>" + (mem.length ? '<div class="list">' + mem.map((m) => '<div class="row">' + ava(m.name) + '<span class="t"><b>' + esc(m.name) + "</b><small>" + esc(m.grp + " · " + m.faculty) + '</small></span><button class="btn sm ghost" data-act="cdecide" data-c="' + esc(c.id) + '" data-l="' + esc(m.login) + '" data-d="rad">Chiqarish</button></div>').join("") + "</div>" : empty("Hali a'zo yo'q.")),
      chip(c.schedule || "", ""));
  }).join("") + "</div>";
};
V.club.events = (r) => eventsPage(r, { hint: "Klub tadbirlari barcha talabalarga ko'rinadi. QR-kod tadbir kuni ochiladi.", others: false });
V.club.qr = qrPage;
V.common.c = () => card("", '<p class="note">Bu QR-kod talabalar uchun. Talaba hisobi bilan kiring.</p>');


function parseRoute() {
  const h = location.hash.replace(/^#\/?/, "");
  const [path, qs] = h.split("?");
  return { parts: path.split("/").filter(Boolean).map(decodeURIComponent), q: new URLSearchParams(qs || "") };
}
function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
const NAV = {
  student: [["home", "Bosh sahifa", "home"], ["schedule", "Dars jadvali", "cal"], ["attendance", "Davomat", "check"], ["gpa", "GPA va baholar", "cap"], ["ifi", "Ijtimoiy faollik", "star"],
    ["rating", "Reyting", "trophy"], ["scholarships", "Stipendiyalar", "wallet"], ["clubs", "To'garaklar", "club"], ["events", "Tadbir va musobaqalar", "flag"], ["news", "Yangiliklar", "news"], "-", ["requests", "Arizalar", "doc"], ["explanations", "Tushuntirish xatlari", "mail"], ["anketa", "Anketa", "idcard"]],
  parent: [["home", "Bosh sahifa", "home"], ["attendance", "Davomat", "check"], ["gpa", "Baholar va GPA", "cap"], ["ifi", "Ijtimoiy faollik", "star"], ["scholarships", "Stipendiyalar", "wallet"],
    ["requests", "Arizalar", "doc"], ["explanations", "Tushuntirish xatlari", "mail"], ["tutor", "Tyutor", "user"], ["schedule", "Dars jadvali", "cal"]],
  tutor: [["home", "Bosh sahifa", "home"], ["attendance", "Davomat", "check"], ["queue", "Arizalar", "inbox"], ["students", "Talabalar", "users"], ["anketa", "Anketalar", "idcard"], ["explanations", "Tushuntirish xatlari", "mail"], ["events", "Tadbirlar va QR", "qr"]],
  dean: [["home", "Umumiy ko'rinish", "grid"], ["tutors", "Tyutorlar", "user"], ["groups", "Guruhlar", "users"], ["students", "Talabalar", "list"], ["grant", "Grant reytingi", "trophy"], ["contracts", "Kontrakt", "wallet"], ["requests", "Arizalar", "inbox"], ["events", "Tadbirlar", "flag"]],
  admin: [["home", "Umumiy ko'rinish", "grid"], ["users", "Foydalanuvchilar", "users"], ["clubs", "To'garaklar", "club"], ["scholarships", "Stipendiyalar", "wallet"], ["news", "Yangiliklar", "news"],
    ["events", "Tadbirlar", "flag"], ["students", "Talabalar", "list"], ["grant", "Grant reytingi", "trophy"], ["contracts", "Kontrakt", "wallet"], ["requests", "Arizalar", "inbox"], ["hemis", "HEMIS va Edu", "db"]],
  club: [["home", "Klublarim", "club"], ["events", "Tadbirlar va QR", "qr"]],
};
const DOCK = { student: ["home", "schedule", "ifi", "events"], parent: ["home", "attendance", "gpa", "ifi"], tutor: ["home", "attendance", "queue", "students"], dean: ["home", "tutors", "groups", "students"], admin: ["home", "users", "clubs", "students"], club: ["home", "events"] };
function badge(k) {
  const r = S.me && S.me.role;
  if (r === "tutor" && k === "queue") return (S.queue || []).length + (S.dorm || []).filter((a) => a.status === "tyutorda").length;
  if (r === "parent" && k === "requests") return (S.kids || []).reduce((a, kd) => a + (kd.dorm || []).filter((x) => x.status === "ota-onada").length, 0);
  if ((r === "dean" || r === "admin") && k === "requests") return (S.spravkas || []).filter((x) => x.status === "kutilmoqda").length;
  if (r === "tutor" && k === "anketa") return (S.students || []).filter((x) => x.prof && x.prof.status === "yuborilgan").length + (S.socialQueue || []).length;
  if (r === "student" && k === "anketa") return S.st && (!S.st.profile ? 0 : ["so'ralgan", "qaytarilgan"].includes(S.st.profile.status) ? 1 : 0);
  if (r === "tutor" && k === "explanations") return (S.explanations || []).filter((x) => x.status === "yozildi").length;
  if (r === "student" && k === "explanations") return ((S.st && S.st.explanations) || []).filter((x) => x.status === "so'ralgan" || x.status === "rad etildi").length;
  if (r === "parent" && k === "explanations") return (S.kids || []).reduce((a, kd) => a + kd.explanations.filter((x) => x.status === "so'ralgan").length, 0);
  if (r === "club" && k === "home") return (S.myClubs || []).reduce((a, c) => a + c.members.filter((m) => m.status === "kutilmoqda").length, 0);
  return 0;
}
const TITLES = { notifications: "Bildirishnomalar", profile: "Profil", rules: "IFI va GPA qanday hisoblanadi", news: "Yangiliklar", student: "Talaba kartasi", qr: "QR-kod", c: "Tadbirda qayd etish", ref: "Ma'lumotnoma" };

function shell(view, title) {
  const r = S.me.role, cur = parseRoute().parts[0] || "home";
  const nav = (NAV[r] || []).map((n) => n === "-" ? '<div class="sep"></div>' : '<a href="#/' + n[0] + '" class="' + (cur === n[0] ? "on" : "") + '">' + ic(n[2]) + "<span>" + n[1] + "</span>" + (badge(n[0]) ? "<em>" + badge(n[0]) + "</em>" : "") + "</a>").join("") +
    (r !== "admin" && r !== "club" ? '<div class="sep"></div><a href="#/rules" class="' + (cur === "rules" ? "on" : "") + '">' + ic("info") + "<span>Qanday hisoblanadi</span></a>" : "") +
    '<a href="#/notifications" class="' + (cur === "notifications" ? "on" : "") + '">' + ic("bell") + "<span>Bildirishnomalar</span>" + (S.unread ? "<em>" + S.unread + "</em>" : "") + "</a>" +
    '<a href="#/profile" class="' + (cur === "profile" ? "on" : "") + '">' + ic("user") + "<span>Profil</span></a>";
  const dock = (DOCK[r] || []).map((k) => { const n = NAV[r].find((x) => x[0] === k); return '<a href="#/' + k + '" class="' + (cur === k ? "on" : "") + '">' + ic(n[2]) + "<span>" + n[1].split(" ")[0] + "</span>" + (badge(k) ? "<em>" + badge(k) + "</em>" : "") + "</a>"; }).join("") +
    '<button data-act="menu">' + ic("menu") + "<span>Menyu</span></button>";
  const name = S.me.name + " " + S.me.surname;
  const roleSwitchSelect = '<select data-act="switch-role" title="Rolni tezkor almashtirish (6 ta hisob)" style="height:36px;padding:0 10px;border-radius:9px;border:1.5px solid var(--pri);background:var(--pri-soft);color:var(--pri);font-weight:700;font-size:12.5px;cursor:pointer;outline:none">' +
    DEMO.map((d) => '<option value="' + d[0] + '"' + (S.me.login === d[0] ? " selected" : "") + ">" + d[1] + " (" + d[2].split("·")[0].trim() + ")</option>").join("") + "</select>";
  return '<div class="app"><aside class="side"><a href="/ecosystem" class="brand" title="Ekotizim bosh sahifasiga o‘tish"><div class="riat-badge" style="background:#003B81;color:#fff;font-weight:900;font-size:11px;padding:2px 7px;border-radius:6px;margin-right:6px">TSUE</div><span>UniverLife</span></a><div class="who"><b>' + esc(name) + "</b><small>" + esc(S.me.roleName) + (S.me.grp && S.me.grp !== "-" ? " · " + esc(S.me.grp) : "") + '</small></div><nav class="nav" aria-label="Asosiy menyu">' + nav + '</nav><div class="foot">TDIU · Yagona raqamli ekotizim</div></aside>' +
    '<div class="main"><header class="top"><a href="/ecosystem" class="top-back-btn" title="Ekotizimga qaytish" style="display:inline-flex;align-items:center;gap:6px;padding:6px 12px;margin-right:10px;border-radius:8px;background:var(--soft);color:var(--pri);font-weight:700;font-size:13px;border:1px solid var(--line2)"><i class="fa-solid fa-arrow-left"></i> <span>Ekotizim</span></a><h1>' + esc(title) + '</h1><div class="top-controls-group" style="display:flex;align-items:center;gap:8px;margin-right:10px">' + roleSwitchSelect + '<button type="button" class="top-theme-btn" data-act="toggle-theme" title="Theme" style="width:36px;height:36px;border-radius:9px;border:1px solid var(--line);background:var(--card);cursor:pointer;display:grid;place-items:center;color:var(--ink2)"><i class="fa-solid fa-circle-half-stroke"></i></button></div><a class="ib" href="#/notifications" aria-label="Bildirishnomalar">' + ic("bell") + (S.unread ? "<em>" + S.unread + "</em>" : "") + '</a><a href="#/profile" aria-label="Profil">' + ava(name, "") + "</a></header>" +
    '<main class="content" id="view">' + view + '</main></div><nav class="dock" aria-label="Pastki menyu">' + dock + "</nav></div>";
}
function menuSheet() {
  const r = S.me.role;
  sheet("Menyu", '<nav class="nav">' + (NAV[r] || []).filter((n) => n !== "-").map((n) => '<a href="#/' + n[0] + '" data-act="close-sheet">' + ic(n[2]) + "<span>" + n[1] + "</span>" + (badge(n[0]) ? "<em>" + badge(n[0]) + "</em>" : "") + "</a>").join("") +
    '<div class="sep"></div>' + (r !== "admin" && r !== "club" ? '<a href="#/rules" data-act="close-sheet">' + ic("info") + "<span>Qanday hisoblanadi</span></a>" : "") +
    '<a href="#/notifications" data-act="close-sheet">' + ic("bell") + "<span>Bildirishnomalar</span></a>" + '<a href="#/profile" data-act="close-sheet">' + ic("user") + "<span>Profil</span></a>" +
    '<a href="#" data-act="logout">' + ic("out") + "<span>Chiqish</span></a></nav>");
}

function render() {
  const root = $("#root");
  const r = parseRoute();
  const p0 = r.parts[0] || "home";
  if (!S.me) {
    if (p0 === "c") try { sessionStorage.setItem("ul_after", location.hash); } catch (e) {  }
    root.innerHTML = viewLogin();
    return;
  }
  if (p0 === "login") { location.replace("#/home"); return; }
  ui.afterRender = [];
  const role = S.me.role;
  const fn = (V[role] && V[role][p0]) || V.common[p0];
  let html, title;
  try {
    const out = fn ? fn(r) : null;
    if (out && typeof out === "object") { html = out.html; title = out.title; }
    else if (out) html = out;
    else { html = card("", empty("Sahifa topilmadi.") + '<p style="text-align:center"><a class="btn ghost" href="#/home">Bosh sahifaga</a></p>'); title = "Sahifa topilmadi"; }
  } catch (e) { console.error(e); html = card("", '<p class="note bad">Sahifani ko\'rsatishda xatolik: ' + esc(e.message) + "</p>"); title = "Xatolik"; }
  if (!title) { const n = (NAV[role] || []).find((x) => x[0] === p0); title = n ? n[1] : TITLES[p0] || "UniverLife"; }
  root.innerHTML = shell(html, title);
  document.title = title + " · UniverLife";
  ui.afterRender.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
  document.dispatchEvent(new Event("ul:render")); // masalan, rasmlarni yuklash (handlers/files.js)
}
window.addEventListener("hashchange", () => { closeSheet(); render(); window.scrollTo(0, 0); });
window.addEventListener("scroll", () => { const t = $(".top"); if (t) t.classList.toggle("sc", window.scrollY > 4); }, { passive: true });


function readAsDataURL(f) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); }); }
async function prepFile(f) {
  if (f.type === "application/pdf") {
    if (f.size > 1.5e6) throw new Error("PDF 1,5 MB dan oshmasin");
    const u = await readAsDataURL(f);
    return { name: f.name, type: f.type, data: String(u).split(",")[1], url: "" };
  }
  if (!/^image\//.test(f.type)) throw new Error("Faqat rasm yoki PDF yuklang");
  const url = await readAsDataURL(f);
  const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("Rasmni o'qib bo'lmadi")); i.src = url; });
  const k = Math.min(1, 1400 / Math.max(img.width, img.height));
  const cv = document.createElement("canvas");
  cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k);
  cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
  const out = cv.toDataURL("image/jpeg", 0.82);
  return { name: f.name.replace(/\.\w+$/, "") + ".jpg", type: "image/jpeg", data: out.split(",")[1], url: out };
}
function paintThumbs(key) {
  const el = document.getElementById("thumbs-" + key);
  if (!el) return;
  el.innerHTML = (FILES[key] || []).map((f, i) => "<span>" + (f.url ? '<img alt="" src="' + f.url + '">' : esc(f.name)) + '<button type="button" data-act="rmfile" data-k="' + key + '" data-i="' + i + '" aria-label="Olib tashlash">×</button></span>').join("");
}
document.addEventListener("change", async (e) => {
  const t = e.target;
  if (t.matches && t.matches("input[data-files]")) {
    const key = t.dataset.files;
    FILES[key] = FILES[key] || [];
    for (const f of Array.from(t.files || []).slice(0, 6 - FILES[key].length)) {
      try { FILES[key].push(await prepFile(f)); } catch (err) { toast(err.message, true); }
    }
    t.value = "";
    paintThumbs(key);
  }
  if (t.matches && t.matches("input[data-evphoto]")) {
    const list = [];
    for (const f of Array.from(t.files || []).slice(0, 6)) { try { list.push(await prepFile(f)); } catch (err) { toast(err.message, true); } }
    t.value = "";
    if (list.length) api("eventPhotoAdd", { id: t.dataset.evphoto, files: list.map((x) => ({ name: x.name, type: x.type, data: x.data })) });
  }
  if (t.matches && t.matches("select[data-act=app-status]")) api("appStatus", { id: t.dataset.id, status: t.value });
  if (t.matches && t.matches("select[data-act=switch-role]")) {
    ui.CARD = null; ui.ATT = null; ui.PF = null; ui.PFEDIT = false;
    await api("login", { login: t.value, password: "demo1234" });
    location.hash = "#/home";
  }
});
function geo() {
  return new Promise((res, rej) => {
    if (!navigator.geolocation) return rej(new Error("Qurilmangiz joylashuvni aniqlay olmaydi"));
    navigator.geolocation.getCurrentPosition((p) => res({ lat: p.coords.latitude, lng: p.coords.longitude, acc: p.coords.accuracy }), (er) => rej(new Error(er.code === 1 ? "Joylashuvga ruxsat berilmadi. Brauzer sozlamalarida ruxsat bering" : "Joylashuvni aniqlab bo'lmadi. Qayta urinib ko'ring")), { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  });
}
async function showFile(id) {
  const j = await api("getFile", { id }, { quiet: true, noRender: true, lite: true });
  if (!j) return;
  const d = j.data, src2 = "data:" + d.type + ";base64," + d.data;
  if (/^image\//.test(d.type)) sheet(d.name, '<img alt="" src="' + src2 + '" style="width:100%;border-radius:10px">');
  else { const a = document.createElement("a"); a.href = src2; a.download = d.name; document.body.appendChild(a); a.click(); a.remove(); }
}

let loading = false;
async function paintPhotos() {
  if (loading) return;
  loading = true;
  try {
    for (const img of Array.from(document.querySelectorAll("img[data-fid]:not([src])"))) {
      const id = img.dataset.fid;
      if (!ui.fileCache[id]) {
        const j = await api("getFile", { id }, { quiet: true, noRender: true, lite: true, silent: true });
        if (!j) continue;
        ui.fileCache[id] = "data:" + j.data.type + ";base64," + j.data.data;
      }
      document.querySelectorAll('img[data-fid="' + id + '"]').forEach((x) => { x.src = ui.fileCache[id]; });
    }
  } finally { loading = false; }
}
document.addEventListener("ul:render", paintPhotos);


document.addEventListener("submit", async (e) => {
  const f = e.target.closest("form[data-form]");
  if (!f) return;
  e.preventDefault();
  const kind = f.dataset.form, fd = new FormData(f), g = (k) => String(fd.get(k) || "").trim();
  const sub = e.submitter;
  if (kind === "login") {
    const j = await api("login", { login: g("login"), password: fd.get("password") });
    if (j) { let to = ""; try { to = sessionStorage.getItem("ul_after") || ""; sessionStorage.removeItem("ul_after"); } catch (x) {  } if (to) location.hash = to; else if (location.hash !== "#/home") location.hash = "#/home"; }
    return;
  }
  if (kind === "phone") return api("setPhone", { phone: g("phone") });
  if (kind === "password") { const j = await api("changePassword", { old: fd.get("old"), password: fd.get("password") }); if (j) f.reset(); return; }
  if (kind === "ifiadd") {
    const c = crit(g("crit")), fields = {};
    (c.fields || []).forEach((x) => { const v = g("f_" + x.k); if (v) fields[x.k] = v; });
    const files = (FILES.ifi || []).map((x) => ({ name: x.name, type: x.type, data: x.data }));
    if (files.length < (c.photos || 1)) return toast(c.photos ? "Kamida " + c.photos + " ta rasm yuklang" : "Tasdiqlovchi hujjatni yuklang", true);
    sub && (sub.disabled = true);
    const j = await api("ifiAdd", { crit: c.id, sub: g("sub"), fields, files, note: g("note") }, { noRender: true });
    sub && (sub.disabled = false);
    if (j) { FILES.ifi = []; go("#/ifi?tab=apps"); }
    return;
  }
  if (kind === "tutorset") { const j = await api("ifiTutorSet", { login: g("login"), crit: g("crit"), subs: fd.getAll("subs") }, { noRender: true }); if (j) { ui.CARD = null; render(); } return; }
  if (kind === "exwrite") {
    const files = (FILES["ex_" + g("id")] || []).map((x) => ({ name: x.name, type: x.type, data: x.data }));
    const j = await api("exWrite", { id: g("id"), text: g("text"), files });
    if (j) delete FILES["ex_" + g("id")];
    return;
  }
  if (kind === "exreview") return api("exReview", { id: g("id"), decision: sub ? sub.value : "", comment: g("comment") });
  if (kind === "exrequest") {
    const logins = fd.getAll("logins").map(String);
    if (!logins.length) return toast("Kamida bitta talabani tanlang", true);
    const j = await api("exRequest", { logins, reason: g("reason"), date: g("date") }, { noRender: true });
    if (j) { ui.CARD = null; render(); }
    return;
  }
  if (kind === "note") { const j = await api("noteAdd", { login: g("login"), kind: g("kind"), text: g("text") }, { noRender: true }); if (j) { ui.CARD = null; render(); } return; }
  if (kind === "attpick") return go("#/attendance?g=" + encodeURIComponent(g("g")) + "&d=" + g("d"));
  if (kind === "att") {
    const marks = {};
    ui.ATT.students.forEach((s) => { const v = fd.get("m_" + s.login); if (v) marks[s.login] = v; });
    const day = sub && sub.value === "day";
    const j = await api("attSave", { grp: g("grp"), date: g("date"), pair: day ? 0 : Number(g("pair")), marks }, { noRender: true });
    if (j) loadSheet(g("grp"), g("date"));
    return;
  }
  if (kind === "review") { const j = await api("ifiReview", { id: g("id"), decision: sub ? sub.value : "", comment: g("comment"), sub: g("sub") }); return j; }
  if (kind === "event") {
    const d = { id: g("id"), title: g("title"), kind: g("kind"), date: g("date"), time: g("time"), place: g("place"), description: g("description"), ifi: g("ifi"), groups: fd.getAll("groups"), club: g("club") };
    const j = await api("eventSave", d);
    if (j) closeSheet();
    return;
  }
  if (kind === "grantpick") return go("#/grant?k=" + encodeURIComponent(g("k")));
  if (kind === "quota") return api("quotaSave", { faculty: g("faculty"), direction: g("direction"), course: Number(g("course")), full: Number(g("full")), half: Number(g("half")) });
  if (kind === "discipline" || kind === "contract") {
    const j = await api(kind === "discipline" ? "disciplineAdd" : "contractSave", Object.fromEntries(fd.entries()), { noRender: true });
    if (j) { ui.CARD = null; render(); }
    return;
  }
  if (kind === "stfilter") { const p = new URLSearchParams(); ["q", "f", "g", "lv", "c"].forEach((k) => g(k) && p.set(k, g(k))); return go("#/students" + (p.toString() ? "?" + p : "")); }
  if (kind === "ufilter") { const p = new URLSearchParams(); ["q", "r"].forEach((k) => g(k) && p.set(k, g(k))); return go("#/users" + (p.toString() ? "?" + p : "")); }
  if (kind === "user") { const j = await api("userSave", Object.fromEntries(fd.entries())); if (j) closeSheet(); return; }
  if (kind === "link") { const j = await api("linkParent", { parent: g("parent"), child: g("child") }); if (j) closeSheet(); return; }
  if (kind === "clubform") { const j = await api("clubSave", Object.fromEntries(fd.entries())); if (j) closeSheet(); return; }
  if (kind === "schform") { const j = await api("scholarshipSave", Object.fromEntries(fd.entries())); if (j) closeSheet(); return; }
  if (kind === "artform") { const j = await api("articleSave", Object.fromEntries(fd.entries())); if (j) closeSheet(); return; }

  if (kind === "anketa") {
    const data = {}, files = {};
    (S.profileForm || []).flatMap((s) => s.fields).forEach((x) => {
      if (x.type === "auto") return;
      if (x.type !== "file") { data[x.k] = g("p_" + x.k); return; }
      data[x.k] = fd.getAll("keep_" + x.k);
      const L = FILES["pf_" + x.k] || [];
      if (L.length) files[x.k] = L.map((f) => ({ name: f.name, type: f.type, data: f.data }));
    });
    sub && (sub.disabled = true);
    const j = await api("profileSave", { data, files, submit: !!sub && sub.value === "send" }, { noRender: true });
    sub && (sub.disabled = false);
    if (j) { Object.keys(FILES).forEach((k) => { if (k.startsWith("pf_")) delete FILES[k]; }); ui.PF = null; ui.PFEDIT = false; render(); window.scrollTo(0, 0); }
    return;
  }
  if (kind === "pfreview") { const j = await api("profileReview", { login: g("login"), decision: sub ? sub.value : "", note: g("note") }, { noRender: true }); if (j) { ui.CARD = null; render(); } return; }
  if (kind === "social") {
    const files = (FILES.soc || []).map((x) => ({ name: x.name, type: x.type, data: x.data }));
    const j = await api("socialAdd", { login: g("login"), cat: g("cat"), note: g("note"), files }, { noRender: true });
    if (j) { FILES.soc = []; closeSheet(); ui.CARD = null; render(); }
    return;
  }
  if (kind === "spravka") {
    const files = (FILES.spr || []).map((x) => ({ name: x.name, type: x.type, data: x.data }));
    if (!files.length) return toast("Spravka rasmini yuklang", true);
    const j = await api("spravkaAdd", { kind: g("kind"), from: g("from"), to: g("to"), note: g("note"), files });
    if (j) { FILES.spr = []; closeSheet(); }
    return;
  }
  if (kind === "dorm") {
    const files = (FILES.dorm || []).map((x) => ({ name: x.name, type: x.type, data: x.data }));
    const j = await api("dormApply", { reason: g("reason"), note: g("note"), files });
    if (j) FILES.dorm = [];
    return;
  }
  if (kind === "sprreview" || kind === "dormreview") {
    const j = await api(kind === "sprreview" ? "spravkaReview" : "dormDecide", { id: g("id"), decision: "no", comment: g("comment") });
    if (j) closeSheet();
    return;
  }
  if (kind === "socreview") { const j = await api("socialReview", { id: g("id"), decision: "no", comment: g("comment") }, { noRender: true }); if (j) { closeSheet(); ui.CARD = null; render(); } return; }
});

document.addEventListener("input", (e) => {
  const t = e.target;
  if (!t.name || !t.name.startsWith("p_") || !t.closest("form[data-form=anketa]")) return;
  ui.PF = ui.PF || {};
  ui.PF[t.name.slice(2)] = t.value;
});


document.addEventListener("click", async (e) => {
  const tr = e.target.closest("tr[data-href]");
  if (tr && !e.target.closest("a,button,select,input")) { go(tr.dataset.href); return; }
  const b = e.target.closest("[data-act]");
  if (!b) return;
  const a = b.dataset.act, id = b.dataset.id;
  if (b.tagName === "SELECT") return;
  if (a === "close-sheet") { if (b.tagName !== "A") e.preventDefault(); closeSheet(); return; }
  e.preventDefault();
  if (a === "demo") { const f = $("form[data-form=login]"); f.login.value = b.dataset.login; f.password.value = "demo1234"; f.requestSubmit(); return; }
  if (a === "menu") return menuSheet();
  if (a === "logout") { closeSheet(); await api("logout"); ui.CARD = null; ui.ATT = null; ui.PF = null; ui.PFEDIT = false; location.hash = "#/home"; return; }
  if (a === "tg") { ui.TG = b.dataset.g || ""; try { localStorage.setItem("ul_tg", ui.TG); } catch (x) {  } return render(); }
  if (a === "sday") { ui.schedDay = Number(b.dataset.d); return render(); }
  if (a === "kid") { ui.kidIdx = Number(b.dataset.i); try { localStorage.setItem("ul_kid", ui.kidIdx); } catch (x) {  } return render(); }
  if (a === "rmfile") { (FILES[b.dataset.k] || []).splice(Number(b.dataset.i), 1); return paintThumbs(b.dataset.k); }
  if (a === "file") return showFile(id);
  if (a === "print") return window.print();
  if (a === "ifi-del") { if (confirm("Arizani o'chirasizmi?")) api("ifiDelete", { id }); return; }
  if (a === "apply") return api("apply", { id, on: b.dataset.on !== "0" });
  if (a === "club") return api("clubJoin", { id, on: b.dataset.on !== "0" });
  if (a === "ev-reg") return api("eventRegister", { id, on: b.dataset.on !== "0" });
  if (a === "ev-new") return sheet("Yangi tadbir", evForm());
  if (a === "ev-edit") return sheet("Tadbirni tahrirlash", evForm((S.events || []).find((x) => x.id === id)));
  if (a === "ev-del") { if (confirm("Tadbirni o'chirasizmi?")) api("eventDelete", { id }); return; }
  if (a === "qr-open") {
    b.disabled = true;
    try { const p = await geo(); const j = await api("qrStart", { event: id, lat: p.lat, lng: p.lng, acc: p.acc, minutes: 90 }, { noRender: true }); if (j) go("#/qr/" + j.data.id); }
    catch (err) { toast(err.message, true); }
    b.disabled = false; return;
  }
  if (a === "qr-end") { if (confirm("QR-kodni yopasizmi? Shundan keyin qayd etib bo'lmaydi.")) { await api("qrEnd", { id }, { noRender: true }); ui.qrLast = ""; qrPoll(id); } return; }
  if (a === "checkin") {
    const res = $("#ci-res");
    b.disabled = true; res.innerHTML = '<p class="muted">Joylashuv aniqlanmoqda…</p>';
    try {
      const p = await geo();
      const j = await api("checkin", { sid: b.dataset.sid, tok: b.dataset.tok, lat: p.lat, lng: p.lng, acc: p.acc, dev: ui.devId }, { noRender: true, silent: true });
      if (j) { res.innerHTML = '<p class="note ok"><b>' + esc(j.msg) + "</b></p>" + '<a class="btn ghost block" href="#/events" style="margin-top:10px">Tadbirlar</a>'; b.style.display = "none"; }
      else res.innerHTML = '<p class="note bad">' + esc(ui.lastErr) + "</p>";
    } catch (err) { res.innerHTML = '<p class="note bad">' + esc(err.message) + "</p>"; }
    b.disabled = false; return;
  }
  if (a === "att-pair") { ui.ATT.pair = Number(b.dataset.p); return render(); }
  if (a === "att-all") { document.querySelectorAll('form[data-form=att] input[type=radio][value=""]').forEach((x) => (x.checked = true)); return; }
  if (a === "note-del") { if (confirm("Izohni o'chirasizmi?")) { const j = await api("noteDelete", { id }, { noRender: true }); if (j) { ui.CARD = null; render(); } } return; }
  if (a === "dj-del") { if (confirm("Intizomiy jazoni bekor qilasizmi? IFI bali qayta tiklanadi.")) { const j = await api("disciplineDelete", { id }, { noRender: true }); if (j) { ui.CARD = null; render(); } } return; }
  if (a === "cdecide") return api("clubDecide", { club: b.dataset.c, login: b.dataset.l, decision: b.dataset.d });
  if (a === "user-new") return sheet("Yangi foydalanuvchi", userForm());
  if (a === "user-edit") return sheet("Foydalanuvchini tahrirlash", userForm((S.users || []).find((u) => u.login === id)));
  if (a === "user-del") { if (confirm("Foydalanuvchini o'chirasizmi? Bu amalni qaytarib bo'lmaydi.")) api("userDelete", { login: id }); return; }
  if (a === "link-new") return sheet("Ota-onani farzandga bog'lash", '<form class="form" data-form="link">' + field("Ota-ona (login yoki JSHIR)", "parent", { req: true }) + field("Talaba (login yoki JSHIR)", "child", { req: true }) + '<p class="small muted" style="margin:0">Bitta ota-onaga bir nechta farzandni bog\'lash mumkin — har birini alohida qo\'shing.</p><button class="btn block" type="submit">Bog\'lash</button></form>');
  if (a === "club-new") return sheet("Yangi to'garak", clubForm());
  if (a === "club-edit") return sheet("To'garakni tahrirlash", clubForm((S.clubs || []).find((c) => c.id === id)));
  if (a === "club-del") { if (confirm("To'garakni o'chirasizmi?")) api("clubDelete", { id }); return; }
  if (a === "sch-new") return sheet("Yangi stipendiya", schForm());
  if (a === "sch-edit") return sheet("Stipendiyani tahrirlash", schForm((S.scholarships || []).find((s) => s.id === id)));
  if (a === "sch-del") { if (confirm("Stipendiyani o'chirasizmi?")) api("scholarshipDelete", { id }); return; }
  if (a === "art-new") return sheet("Yangi yangilik", '<form class="form" data-form="artform">' + field("Sarlavha", "title", { req: true }) + '<div class="f2">' + field("Bo'lim", "tag", { type: "select", opts: ["Yangilik", "Tadbir", "Sport", "Ilm-fan", "E'lon"] }) + field("Sana", "date", { type: "date", val: today() }) + "</div>" + field("Matn", "body", { type: "textarea", rows: 7, hint: "xatboshilarni bo'sh qator bilan ajrating" }) + '<button class="btn block" type="submit">Saqlash</button></form>');

  if (a === "pf-go") { const el = document.getElementById("pf-" + id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
  if (a === "pf-rm") { b.closest("span").remove(); return; }
  if (a === "pf-edit") { ui.PFEDIT = true; return render(); }
  const reCard = (j) => { if (j) { ui.CARD = null; render(); } };
  if (a === "pf-req") return reCard(await api("profileRequest", { login: b.dataset.login }, { noRender: true }));
  if (a === "pf-req-grp") { if (confirm(b.dataset.g + " guruhiga anketa so'rovi yuborilsinmi?")) api("profileRequest", { grp: b.dataset.g }); return; }
  if (a === "soc-add") { FILES.soc = []; return sheet("Ijtimoiy toifa qo'shish", socialForm(b.dataset.login)); }
  if (a === "soc-ok") return reCard(await api("socialReview", { id, decision: "ok" }, { noRender: true }));
  if (a === "soc-no") return sheet("Rad etish", '<form class="form" data-form="socreview"><input type="hidden" name="id" value="' + esc(id) + '">' + field("Sababi", "comment", { ph: "Masalan: hujjat o'qilmaydi" }) + '<button class="btn bad" type="submit">Rad etish</button></form>');
  if (a === "soc-del") { if (confirm("Toifani o'chirasizmi?")) reCard(await api("socialDelete", { id }, { noRender: true })); return; }

  if (a === "spr-new") { FILES.spr = []; return sheet("Spravka yuklash", spravkaForm()); }
  if (a === "spr-del") { if (confirm("Spravkani bekor qilasizmi?")) api("spravkaDelete", { id }); return; }
  if (a === "spr-ok") { if (confirm("Tasdiqlansa, shu kunlardagi qoldirilgan darslar «sababli» bo'ladi. Davom etasizmi?")) api("spravkaReview", { id, decision: "ok" }); return; }
  if (a === "spr-no" || a === "dorm-no") return sheet("Rad etish", '<form class="form" data-form="' + (a === "spr-no" ? "sprreview" : "dormreview") + '"><input type="hidden" name="id" value="' + esc(id) + '">' + field("Sababi", "comment", { ph: "Talaba ko'radi" }) + '<button class="btn bad" type="submit">Rad etish</button></form>');
  if (a === "dorm-faceid") {
    sheet("Face ID · Ota-ona biometrik tasdiqlash", '<div style="text-align:center;padding:12px 0">' +
      '<div style="width:96px;height:96px;margin:0 auto 14px;border-radius:24px;background:var(--pri-soft);border:2px dashed var(--pri);display:grid;place-items:center;font-size:44px;color:var(--pri)"><i class="fa-solid fa-face-viewfinder"></i></div>' +
      '<h3 style="margin:0 0 6px;font-size:18px">' + esc(S.me.name + " " + S.me.surname) + '</h3>' +
      '<p class="small muted" style="margin:0 0 14px">JSHSHIR: <b>' + esc(S.me.jshir || "31004751230088") + '</b> · Shaxsni biometrik tasdiqlash</p>' +
      '<p class="note warn small" style="text-align:left;margin-bottom:16px">Farzandingiz dam olish kunlari TTJdan viloyatga/uyga ketish uchun ruxsat so\'radi. Talaba boshqa telefondan o\'zi bosib qo\'ymasligi uchun Face ID tasdiqlash talab etiladi.</p>' +
      '<button class="btn ok block" data-act="dorm-faceid-confirm" data-id="' + esc(id) + '"><i class="fa-solid fa-check-double"></i> Face ID tasdiqlandi — Ruxsat beraman</button>' +
      '</div>');
    return;
  }
  if (a === "dorm-faceid-confirm") {
    closeSheet();
    return api("dormDecide", { id, decision: "ok" });
  }
  if (a === "dorm-ok") return api("dormDecide", { id, decision: "ok" });
  if (a === "dorm-cancel") { if (confirm("Arizani bekor qilasizmi?")) api("dormCancel", { id }); return; }
  if (a === "export-excel") {
    const rows = [["F.I.Sh.", "Guruh", "JSHSHIR", "Telefon", "GPA", "IFI Bali", "Sababsiz soat", "Yashash joyi (Tuman / Manzil)", "Holati"]];
    const list = S.students || [];
    const districts = ["Chilonzor tumani, 18-kvartal, 12-uy (Ijara)", "TTJ-6, 3-qavat, 312-xona", "Chilonzor tumani, 19-kvartal, 4-uy (Ijara)", "Yunusobod tumani, 11-kvartal, 9-uy (Ijara)", "Toshkent sh., Shayxontohur tumani (O'z uyi)", "Olmazor tumani, Beruniy ko'chasi, 15-uy (Ijara)"];
    list.forEach((s, idx) => {
      rows.push([
        (s.surname || "") + " " + (s.name || ""),
        s.grp || "RST-81/25",
        s.jshir || ("3050" + String(1000000000 + idx)),
        s.phone || "+998 90 123 45 67",
        s.gpa != null ? String(s.gpa) : "4.25",
        String(s.ifi || 78),
        String(s.absH || 0),
        districts[idx % districts.length],
        s.prof && s.prof.status ? s.prof.status : "tasdiqlangan"
      ]);
    });
    const csv = "\uFEFF" + rows.map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(";")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "TDIU_Talabalar_Anketa_Ijara_Reyestri_" + today() + ".csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    toast("Excel (.CSV) jadval muvaffaqiyatli yuklab olindi!");
    return;
  }
  if (a === "ttj-red-list") {
    const offenders = [
      ["Ergashev Jasurbek", "RST-81/25", "TTJ-6 · 214-xona", "Ota-ona Face ID tasdig'isiz chiqib ketgan"],
      ["Qodirov Shohruh", "RST-81/25", "TTJ-6 · 308-xona", "Tyutor ruxsatisiz viloyatga ketgan"],
      ["Normatov Azizbek", "RST-83/25", "TTJ-5 · 112-xona", "Ariza qoldirmasdan TTJga qaytmagan"],
      ["Tursunov Diyorbek", "RST-83/25", "TTJ-6 · 405-xona", "Ota-ona Face ID rad etgan bo'lsa ham ketgan"],
      ["Mahmudov Sardor", "RI-72/25", "TTJ-5 · 209-xona", "Ruxsatsiz ketgan (kechki yo'qlamada yo'q)"]
    ];
    sheet("QIZIL RO'YXAT · TTJdan ruxsatsiz ketganlar (16 nafar)", '<p class="note bad small" style="margin-top:0">Ushbu talabalar ota-ona Face ID tasdig\'i va tyutor ruxsatisiz dam olish kunlari TTJni tark etgan. Dushanba soat <b>08:30 da</b> dekan o\'rinbosari, tyutor va tarbiyachi-pedagog huzuriga chaqirtirilgan:</p>' +
      '<div class="tw"><table class="t"><thead><tr><th>Talaba</th><th>Guruh / TTJ</th><th>Qoidabuzarlik</th></tr></thead><tbody>' +
      offenders.map((o) => '<tr><td><b>' + esc(o[0]) + '</b></td><td>' + esc(o[1] + " · " + o[2]) + '</td><td><span class="chip bad">' + esc(o[3]) + '</span></td></tr>').join("") +
      '</tbody></table></div><div style="display:flex;gap:8px;margin-top:14px;justify-content:flex-end"><button class="btn sm ghost" data-act="protocol-gen"><i class="fa-solid fa-file-signature"></i> Bayonnoma tuzish</button><button class="btn sm ok" data-act="close-sheet">Tushunarli</button></div>');
    return;
  }
  if (a === "protocol-gen") {
    sheet("Elektron bayonnoma rasmiylashtirish (Raqamlashtirish)", '<div class="paper" style="padding:18px;border:1px solid var(--line);border-radius:12px;background:var(--card)">' +
      '<h3 style="text-align:center;margin:0 0 8px">TDIU RAQAMLI IQTISODIYOT VA AXBOROT TEXNOLOGIYALARI FAKULTETI</h3>' +
      '<p style="text-align:center;font-weight:800;margin:0 0 14px">ELEKTRON BAYONNOMA № 24-' + today().slice(8, 10) + '</p>' +
      '<p class="small"><b>Sana:</b> ' + fmtDate(today()) + ' · <b>Joy:</b> Dekanat (B-bino) / Elektron tizim</p>' +
      '<p class="small"><b>Qatnashdilar:</b> Dekan Akbarov N.G\'., Yoshlar bilan ishlash bo\'yicha dekan o\'rinbosari Amonov A.R., guruh tyutori Abdurahmonov U. va TTJ tarbiyachi-pedagogi.</p>' +
      '<p class="small"><b>Kun tartibi:</b> Yotoqxona (TTJ) ichki tartib-qoidalari, davomat va ijtimoiy faollik ko\'rsatkichlarini raqamli nazorat qilish hamda ruxsatsiz ketgan talabalar bilan profilaktik suhbat o\'tkazish.</p>' +
      '<p class="small"><b>Qaror qilindi:</b> Barcha jarayonlar qog\'ozsiz elektron shaklda tasdiqlansin, ota-onalarga bildirishnoma yuborilsin.</p>' +
      '</div><div style="display:flex;gap:8px;margin-top:14px;justify-content:flex-end"><button class="btn sm ghost" data-act="print">' + ic("print") + ' PDF / Chop etish</button><button class="btn sm ok" data-act="close-sheet">' + ic("check") + ' QR-imzo bilan tasdiqlash</button></div>');
    return;
  }
  if (a === "ex-reason") { const inp = b.closest("form").querySelector("input[name=reason]"); inp.value = b.dataset.t; b.parentNode.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b)); return; }
  if (a === "ph-del") { if (confirm("Rasmni o'chirasizmi?")) api("eventPhotoDelete", { id }); return; }
  if (a === "art-del") { if (confirm("Yangilikni o'chirasizmi?")) api("articleDelete", { id }); return; }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });




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

const DB_STORAGE_KEY = "tsue_univerlife_v4_local_db";

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
  
  const rawContract = (db.contracts || []).find(c => c.login === st.login) || null;
  const contract = rawContract ? {
    ...rawContract,
    year: rawContract.year || "2026-2027",
    due: Number(rawContract.due) || 0,
    paid: Number(rawContract.paid) || 0,
    left: Math.max(0, (Number(rawContract.due) || 0) - (Number(rawContract.paid) || 0)),
    pct: rawContract.due ? Math.round(((Number(rawContract.paid) || 0) / Number(rawContract.due)) * 100) : 0
  } : null;
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
    base.contracts = (db.contracts || []).map(c => ({
      ...c,
      year: c.year || "2026-2027",
      due: Number(c.due) || 0,
      paid: Number(c.paid) || 0,
      left: Math.max(0, (Number(c.due) || 0) - (Number(c.paid) || 0)),
      pct: c.due ? Math.round(((Number(c.paid) || 0) / Number(c.due)) * 100) : 0
    }));
    
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
      files: JSON.stringify(data.files || []), status: "ota-onada", comment: "", created: Date.now()
    });
    saveLocalDb(ldb);
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: "TTJ arizasi ota-onangizga Face ID tasdiqlash uchun yuborildi!", state: S };
  }
  
  if (action === "dormDecide") {
    const d = (ldb.dorm_apps || []).find(x => x.id === data.id);
    if (d) {
      if (data.decision === "ok") {
        if (d.status === "ota-onada") {
          d.status = "tyutorda";
          d.parent_at = Date.now();
        } else {
          d.status = "tasdiqlandi";
          d.tutor_at = Date.now();
        }
      } else {
        d.status = "rad";
        d.comment = data.comment || "";
      }
      saveLocalDb(ldb);
    }
    setState(buildStateEngine(ldb, S.me));
    return { ok: true, msg: data.decision === "ok" ? (S.me?.role === "parent" ? "Face ID tasdiqlandi! Ariza tyutorga o'tdi" : "Ruxsat berildi! TTJ tarbiyachisiga va dekanatga ko'rindi") : "Ariza rad etildi", state: S };
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
      body: String(data.body || "").split("\n").filter(Boolean)
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

(function init() {
  const ldb = getLocalDb();
  const ssoUser = bootSSO();
  if (ssoUser) {
    setState(buildStateEngine(ldb, ssoUser));
  } else {

    const defaultStudent = (ldb.users || []).find(u => u.login === "sardor.alisherov") || ldb.users[0];
    if (defaultStudent) {
      setState(buildStateEngine(ldb, defaultStudent));
    } else {
      setState(buildStateEngine(ldb, null));
    }
  }
  render();
})();



document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-act=toggle-theme]");
  if (btn) {
    document.body.classList.toggle("dark-mode");
    try {
      localStorage.setItem("theme", document.body.classList.contains("dark-mode") ? "dark" : "light");
    } catch(err) {}
  }
});


})();
