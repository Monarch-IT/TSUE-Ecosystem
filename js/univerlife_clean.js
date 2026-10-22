/* UniverLife v3 — yadro: API, marshrutlash, qobiq, umumiy komponentlar */
(function () {
"use strict";
let S = { me: null };
let busy = false, lastErr = "";
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
const f2 = (x) => (Math.round((x || 0) * 100) / 100).toFixed(2);
const ini = (n) => String(n || "").split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0]).join("").toUpperCase();
const isoDay = (d) => { const w = new Date(d + "T12:00:00Z").getUTCDay(); return w === 0 ? 7 : w; };
const tel = (p) => String(p || "").replace(/[^+\d]/g, "");
const AVC = ["#2f5a6e", "#5b7b3a", "#8a5a2b", "#5a4d8a", "#2b6f78", "#8a3d4f"];
const avc = (s) => { let h = 0; for (const ch of String(s)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return AVC[h % AVC.length]; };
const ava = (name, cls) => '<span class="av ' + (cls || "s") + '" style="background:' + avc(name) + '">' + esc(ini(name)) + "</span>";

/* ---- ikonkalar ---- */
const IP = {
  home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z", cal: "M4 6h16v14H4zM4 10h16M9 3v4M15 3v4", check: "M5 12l4 4 10-10", cap: "M2 9l10-5 10 5-10 5zM6 11v5c3 2 9 2 12 0v-5",
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

/* ---- yordamchi UI ---- */
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

/* ---- API ---- */
async function api(action, data, opt) {
  opt = opt || {};
  if (busy && !opt.quiet) return null;
  if (!opt.quiet) { busy = true; document.body.style.cursor = "progress"; }
  try {
    const r = await fetch("/api/rpc", { method: "POST", headers: { "content-type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ action, data: data || {}, lite: !!opt.lite }) });
    let j = null;
    try { j = await r.json(); } catch (e) { /* */ }
    if (!j) throw new Error("Server javob bermadi. Internetni tekshirib, qayta urinib ko'ring");
    if (j.state) S = j.state;
    if (!r.ok || j.error) { lastErr = j.error || "Xatolik"; if (!opt.silent) toast(j.error || "Xatolik", true); if (j.state && !opt.noRender) render(); return null; }
    if (j.msg && !opt.silent) toast(j.msg);
    if (j.state && !opt.noRender) render();
    return j;
  } catch (e) {
    if (!opt.silent) toast(e.message || "Tarmoq xatosi", true);
    return null;
  } finally {
    if (!opt.quiet) { busy = false; document.body.style.cursor = ""; }
  }
}

/* ---- marshrut ---- */
function parseRoute() {
  const h = location.hash.replace(/^#\/?/, "");
  const [path, qs] = h.split("?");
  return { parts: path.split("/").filter(Boolean).map(decodeURIComponent), q: new URLSearchParams(qs || "") };
}
function go(hash) { if (location.hash === hash) render(); else location.hash = hash; }
const V = {}; // ko'rinishlar ro'yxati: V.student.home = fn
const NAV = {
  student: [["home", "Bosh sahifa", "home"], ["schedule", "Dars jadvali", "cal"], ["attendance", "Davomat", "check"], ["gpa", "GPA va baholar", "cap"], ["ifi", "Ijtimoiy faollik", "star"],
    ["rating", "Reyting", "trophy"], ["scholarships", "Stipendiyalar", "wallet"], ["clubs", "To'garaklar", "club"], ["events", "Tadbir va musobaqalar", "flag"], ["news", "Yangiliklar", "news"], "-", ["explanations", "Tushuntirish xatlari", "mail"]],
  parent: [["home", "Bosh sahifa", "home"], ["attendance", "Davomat", "check"], ["gpa", "Baholar va GPA", "cap"], ["ifi", "Ijtimoiy faollik", "star"], ["scholarships", "Stipendiyalar", "wallet"],
    ["explanations", "Tushuntirish xatlari", "mail"], ["tutor", "Tyutor", "user"], ["schedule", "Dars jadvali", "cal"]],
  tutor: [["home", "Bosh sahifa", "home"], ["attendance", "Davomat", "check"], ["queue", "Arizalar", "inbox"], ["students", "Talabalar", "users"], ["explanations", "Tushuntirish xatlari", "mail"], ["events", "Tadbirlar va QR", "qr"]],
  dean: [["home", "Umumiy ko'rinish", "grid"], ["tutors", "Tyutorlar", "user"], ["groups", "Guruhlar", "users"], ["students", "Talabalar", "list"], ["events", "Tadbirlar", "flag"]],
  admin: [["home", "Umumiy ko'rinish", "grid"], ["users", "Foydalanuvchilar", "users"], ["clubs", "To'garaklar", "club"], ["scholarships", "Stipendiyalar", "wallet"], ["news", "Yangiliklar", "news"],
    ["events", "Tadbirlar", "flag"], ["students", "Talabalar", "list"], ["hemis", "HEMIS va Edu", "db"]],
  club: [["home", "Klublarim", "club"], ["events", "Tadbirlar va QR", "qr"]],
};
const DOCK = { student: ["home", "schedule", "ifi", "events"], parent: ["home", "attendance", "gpa", "ifi"], tutor: ["home", "attendance", "queue", "students"], dean: ["home", "tutors", "groups", "students"], admin: ["home", "users", "clubs", "students"], club: ["home", "events"] };
function badge(k) {
  const r = S.me && S.me.role;
  if (r === "tutor" && k === "queue") return (S.queue || []).length;
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
  return '<div class="app"><aside class="side"><div class="brand"><div class="riat-badge">RIAT</div><span>Univerlife</span></div><div class="who"><b>' + esc(name) + "</b><small>" + esc(S.me.roleName) + (S.me.grp && S.me.grp !== "-" ? " · " + esc(S.me.grp) : "") + '</small></div><nav class="nav" aria-label="Asosiy menyu">' + nav + '</nav><div class="foot">TDIU talabalari uchun platforma</div></aside>' +
    '<div class="main"><header class="top"><h1>' + esc(title) + '</h1><a class="ib" href="#/notifications" aria-label="Bildirishnomalar">' + ic("bell") + (S.unread ? "<em>" + S.unread + "</em>" : "") + '</a><a href="#/profile" aria-label="Profil">' + ava(name, "") + "</a></header>" +
    '<main class="content" id="view">' + view + '</main></div><nav class="dock" aria-label="Pastki menyu">' + dock + "</nav></div>";
}
function menuSheet() {
  const r = S.me.role;
  sheet("Menyu", '<nav class="nav">' + (NAV[r] || []).filter((n) => n !== "-").map((n) => '<a href="#/' + n[0] + '" data-act="close-sheet">' + ic(n[2]) + "<span>" + n[1] + "</span>" + (badge(n[0]) ? "<em>" + badge(n[0]) + "</em>" : "") + "</a>").join("") +
    '<div class="sep"></div>' + (r !== "admin" && r !== "club" ? '<a href="#/rules" data-act="close-sheet">' + ic("info") + "<span>Qanday hisoblanadi</span></a>" : "") +
    '<a href="#/notifications" data-act="close-sheet">' + ic("bell") + "<span>Bildirishnomalar</span></a>" + '<a href="#/profile" data-act="close-sheet">' + ic("user") + "<span>Profil</span></a>" +
    '<a href="#" data-act="logout">' + ic("out") + "<span>Chiqish</span></a></nav>");
}

let afterRender = [];
function render() {
  const root = $("#root");
  const r = parseRoute();
  const p0 = r.parts[0] || "home";
  if (!S.me) {
    if (p0 === "c") try { sessionStorage.setItem("ul_after", location.hash); } catch (e) { /* */ }
    root.innerHTML = viewLogin();
    return;
  }
  if (p0 === "login") { location.replace("#/home"); return; }
  afterRender = [];
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
  document.title = title + " · RIAT-Univerlife";
  afterRender.forEach((f) => { try { f(); } catch (e) { console.error(e); } });
}
window.addEventListener("hashchange", () => { closeSheet(); render(); window.scrollTo(0, 0); });
window.addEventListener("scroll", () => { const t = $(".top"); if (t) t.classList.toggle("sc", window.scrollY > 4); }, { passive: true });

/* ---- kirish ---- */
const DEMO = [["sardor.alisherov", "Talaba", "Sardor Alisherov"], ["ota.demo", "Ota-ona", "2 farzand"], ["tyutor.demo", "Tyutor", "RST-81/25"], ["dekanat.demo", "Dekanat", "Raqamli iqtisodiyot"], ["klub.demo", "Klub rahbari", "3 ta klub"]];
function viewLogin() {
  return '<div class="auth"><div class="auth-l"><div class="brand"><div class="riat-badge">RIAT</div><span>Univerlife</span></div><div><h2>Talaba hayoti bitta platformada</h2><p>Davomat, baholar, ijtimoiy faollik indeksi, stipendiyalar, to\'garaklar va tadbirlar — talaba, ota-ona, tyutor va dekanat uchun.</p>' +
    "<ul><li>Ijtimoiy faollik indeksi — HEMIS yo'riqnomasi bo'yicha 11 band</li><li>Tyutor davomati va ota-onaga bildirishnoma</li><li>Tadbirlarda QR-kod orqali qayd etish</li></ul></div><small style=\"color:#a9c4cf\">TDIU talabalari uchun platforma</small></div>" +
    '<div class="auth-r"><div class="auth-box"><h1>Tizimga kirish</h1><p class="lead">Login va parol administrator tomonidan beriladi.</p><form class="form" data-form="login">' +
    field("Login yoki JSHIR", "login", { req: true, ph: "masalan: sardor.alisherov", attrs: ' autocomplete="username" autocapitalize="none"' }) +
    field("Parol", "password", { type: "password", req: true, attrs: ' autocomplete="current-password"' }) +
    '<button class="btn block" type="submit">Kirish</button></form><div class="demo">Sinov uchun hisoblar (parol: <b>demo1234</b>):<div>' +
    DEMO.map((d) => '<button type="button" data-act="demo" data-login="' + d[0] + '">' + d[1] + "<small>" + esc(d[2]) + "</small></button>").join("") + "</div></div></div></div></div>";
}

/* ---- umumiy sahifalar ---- */
V.common = {};
V.common.notifications = () => {
  const N = S.notifs || [];
  if (S.unread) afterRender.push(() => api("readNotifs", {}, { quiet: true, silent: true, noRender: true, lite: true }).then(() => { S.unread = 0; (S.notifs || []).forEach((n) => (n.read = 1)); }));
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
    '<div class="grid g2">' + card("GPA qanday hisoblanadi", '<p class="note"><b>GPA = Σ (baho × kredit) ÷ Σ kredit</b><br>Har bir fan bo\'yicha 100 ballik natija 5 ballik bahoga aylantiriladi, so\'ng kredit og\'irligi bilan o\'rtacha olinadi. IFI uchun oxirgi yakunlangan o\'quv yili GPA si olinadi.</p>' +
      '<div class="tw" style="margin-top:12px"><table class="t"><thead><tr><th>100 ballik natija</th><th>Baho</th></tr></thead><tbody>' + R.gradeT.map((g, i) => "<tr><td>" + g[0] + "–" + (i ? R.gradeT[i - 1][0] - 1 : 100) + "</td><td><b>" + g[1] + "</b> · " + esc(g[2]) + "</td></tr>").join("") + "</tbody></table></div>" +
      '<p class="small muted" style="margin:12px 0 0">Misol: Statistika 6 kredit, baho 5; Falsafa 4 kredit, baho 4 → GPA = (5×6 + 4×4) ÷ 10 = 4,60</p>') +
    card("GPA → IFI 3-band bali", '<div class="tw"><table class="t"><thead><tr><th>GPA</th><th class="n">Ball</th></tr></thead><tbody>' + R.gpaT.map((g) => "<tr><td>" + g[0].toFixed(1) + "</td><td class=\"n\">" + f1(g[1]) + "</td></tr>").join("") + '<tr><td>3,5 dan past</td><td class="n">0</td></tr></tbody></table></div>') + "</div>" +
    '<div class="grid g2">' + card("Davomat → IFI 6-band bali", '<p class="small muted" style="margin-top:0">Semestrda sababsiz qoldirilgan soatlar (1 para = ' + R.hoursPerPair + ' akademik soat). Sababli qoldirilgan va kechikishlar hisobga olinmaydi.</p><div class="tw"><table class="t"><tbody>' + R.attT.map((a) => "<tr><td>" + a[0] + '</td><td class="n"><b>' + a[1] + " ball</b></td></tr>").join("") + "</tbody></table></div>") +
    card("Darajalar va grant", '<div class="tw"><table class="t"><tbody>' + R.levels.map((l, i) => "<tr><td><b>" + l[0] + "–" + (i ? R.levels[i - 1][0] - 1 : 100) + "</b></td><td>" + esc(l[1]) + '<br><small class="muted">' + esc(l[2]) + "</small></td></tr>").join("") + "</tbody></table></div>" +
      '<p class="small muted" style="margin:12px 0 0">Kontrakt asosida o\'qiyotgan talaba IFI da yuqori natija ko\'rsatsa, grant asosida o\'qishga o\'tkazilishi mumkin.</p>') + "</div>" +
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
/* ---------- talaba ma'lumotlari: talaba, ota-ona va xodimlar uchun umumiy bloklar ---------- */
const crit = (id) => (S.rules.crit || []).find((c) => c.id === id);
const WHO = { student: "Talaba kiritadi · tyutor tasdiqlaydi", ref: "Ma'lumotnoma (namuna bo'yicha) · tyutor baholaydi", tutor: "Tyutor baholaydi", hemis: "HEMIS'dan avtomatik" };
let CARD = null; // xodim ochgan talaba kartasi
let schedDay = 0;

function scheduleView(rows, opt) {
  opt = opt || {};
  const td = isoDay(today());
  const d = schedDay || (td <= 6 ? td : 1);
  const days = [1, 2, 3, 4, 5, 6].map((i) => '<button class="' + (i === d ? "on " : "") + (i === td ? "td" : "") + '" data-act="sday" data-d="' + i + '">' + DSHORT[i] + "<small>" + (i === td ? "bugun" : (rows || []).filter((x) => x.day === i).length + " para") + "</small></button>").join("");
  const L = (rows || []).filter((x) => x.day === d);
  return '<div class="days">' + days + "</div>" + card(DAYS[d] + (d === td ? " · bugun" : ""), L.length ? '<div class="list">' + L.map((x) => '<div class="lesson"><div class="tm"><b>' + x.pair + '-para</b><small>' + esc(S.pairs[x.pair] || "") + '</small></div><div class="t"><b>' + esc(x.subject) + "</b><small>" + esc(x.kind) + " · " + esc(x.room) + " · " + esc(x.teacher) + "</small></div></div>").join("") + "</div>" : empty("Bu kuni dars yo'q."), src("Edu · MVP namunaviy jadval"));
}
function todayLessons(rows) {
  const td = isoDay(today());
  const L = (rows || []).filter((x) => x.day === td);
  return L.length ? '<div class="list">' + L.map((x) => '<div class="row"><span class="date"><b>' + x.pair + "</b><small>para</small></span><span class=\"t\"><b>" + esc(x.subject) + "</b><small>" + esc(S.pairs[x.pair] || "") + " · " + esc(x.room) + "</small></span></div>").join("") + "</div>" : empty(td === 7 ? "Bugun yakshanba — dars yo'q." : "Bugun dars yo'q.");
}
const ST_ATT = { kelmadi: ["Kelmadi", "bad"], kechikdi: ["Kechikdi", "warn"], sababli: ["Sababli", "pri"] };
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
    stat("Kechikishlar", a.late, "semestr davomida", a.late > 3 ? "warn" : "") + stat("Sababli", a.excused, "para") + "</div>" +
    (opt.today ? todayStatus(st) + "<div style=\"height:16px\"></div>" : "") +
    card("Qayd etilgan holatlar <small>" + esc(S.semester.name) + "</small>", days.length ? '<div class="list">' + days.map((d) => '<div class="row"><span class="date"><b>' + Number(d.slice(8)) + "</b><small>" + MONTHS[Number(d.slice(5, 7)) - 1].slice(0, 3) + '</small></span><span class="t">' +
      by[d].map((m) => "<small>" + m.pair + "-para · " + esc(m.subject || "—") + " " + chip((ST_ATT[m.status] || [m.status])[0], (ST_ATT[m.status] || [, ""])[1]) + "</small>").join("") + "</span></div>").join("") + "</div>"
      : empty("Bu semestrda dars qoldirilmagan. Barakalla!"), src("Tyutor davomati · to'liq versiyada HEMIS")) +
    '<p class="small muted" style="margin-top:12px">IFI 6-bandi: 0–10 soat — 5 ball, 11–15 — 4, 16–25 — 3, 26–30 — 2, 31 va undan ko\'p — 0. Faqat sababsiz qoldirilgan soatlar hisoblanadi (1 para = 2 soat).</p>';
}
function gpaView(st) {
  const A = st.acad, pts = (st.ifi && st.ifi.v.acad) || 0;
  if (!A || (!A.sems.length && !A.current.length)) return card("", empty("HEMIS'dan akademik ma'lumot topilmadi.") + '<p class="center small muted" style="text-align:center">' + HEMIS_SRC() + "</p>");
  const gT = (g) => g == null ? "—" : '<b style="color:' + (g >= 5 ? "var(--ok)" : g <= 2 ? "var(--bad)" : g === 3 ? "var(--warn)" : "var(--ink)") + '">' + g + "</b>";
  return '<div class="grid g3" style="margin-bottom:16px">' + stat("GPA · " + esc(A.year) + " o'quv yili", f2(A.gpa), "5 ballik shkala") + stat("IFI 3-band (akademik o'zlashtirish)", f1(pts) + " <span>/ 10</span>", "GPA asosida avtomatik") +
    stat("Reyting (GPA)", st.rank ? "#" + st.rank.gpa.grp.pos + " <span>/ " + st.rank.gpa.grp.of + "</span>" : "—", "guruhda · fakultetda #" + (st.rank ? st.rank.gpa.fac.pos : "—")) + "</div>" +
    '<p class="note"><b>GPA = Σ (baho × kredit) ÷ Σ kredit.</b> 100 ballik natija: 86–100 → 5, 71–85 → 4, 55–70 → 3, 55 dan past → 2. <a href="#/rules">Batafsil</a></p><div style="height:16px"></div>' +
    '<div class="grid">' + (A.current.length ? card("Joriy semestr <small>" + esc(S.semester.name) + "</small>", '<div class="tw"><table class="t st"><thead><tr><th>Fan</th><th class="n">Kredit</th><th>Holat</th></tr></thead><tbody>' + A.current.map((x) => "<tr><td><b>" + esc(x.subject) + '</b></td><td class="n" data-l="Kredit">' + x.credits + "</td><td>" + chip("jarayonda") + "</td></tr>").join("") + "</tbody></table></div>", HEMIS_SRC()) : "") +
    A.sems.map((s) => card(esc(s.sem) + " <small>GPA " + f2(s.gpa) + " · " + s.credits + " kredit</small>", '<div class="tw"><table class="t st"><thead><tr><th>Fan</th><th class="n">Kredit</th><th class="n">Ball</th><th class="n">Baho</th></tr></thead><tbody>' +
      s.subjects.map((x) => "<tr><td><b>" + esc(x.subject) + '</b></td><td class="n" data-l="Kredit">' + x.credits + '</td><td class="n" data-l="Ball">' + (x.score == null ? "—" : x.score) + '</td><td class="n" data-l="Baho">' + gT(x.grade) + "</td></tr>").join("") +
      '<tr><td><b>Semestr GPA</b></td><td class="n" data-l="Kredit">' + s.credits + '</td><td></td><td class="n" data-l="GPA"><b>' + f2(s.gpa) + "</b></td></tr></tbody></table></div>")).join("") + "</div>";
}
function ifiSummary(st) {
  const sc = st.ifi || { total: 0, v: {}, level: "" }, tot = sc.total, C = S.rules.crit;
  const R = 54, Cc = 2 * Math.PI * R, lv = levelOf(tot);
  const part = (who) => { const cs = C.filter((c) => who.includes(c.who)); return [cs.reduce((a, c) => a + (sc.v[c.id] || 0), 0), cs.reduce((a, c) => a + c.max, 0)]; };
  const P = [["Talaba arizalari", part(["student", "ref"])], ["Tyutor bahosi", part(["tutor"])], ["HEMIS", part(["hemis"])]];
  return card("", '<div class="sum"><div class="ring"><svg viewBox="0 0 132 132"><circle class="tr" cx="66" cy="66" r="' + R + '"/><circle class="fl" cx="66" cy="66" r="' + R + '" stroke-dasharray="' + Cc.toFixed(1) + '" stroke-dashoffset="' + (Cc * (1 - tot / 100)).toFixed(1) + '"/></svg><b>' + f1(tot) + "<small>/ 100 ball</small></b></div>" +
    '<div style="flex:1;min-width:240px"><div class="lv">' + esc(lv[1]) + "</div><p>" + esc(lv[2]) + (st.rank ? " · Guruhda #" + st.rank.ifi.grp.pos + ", fakultetda #" + st.rank.ifi.fac.pos : "") + '</p><div class="parts">' +
    P.map((p) => "<div><small>" + p[0] + "</small><b>" + f1(p[1][0]) + " <span>/ " + p[1][1] + "</span></b></div>").join("") + "</div></div></div>" +
    '<div class="lvls" style="margin-top:16px">' + S.rules.levels.slice().reverse().map((l, i, a) => '<div class="' + (l[1] === lv[1] ? "on" : "") + '"><b>' + l[0] + "–" + (i < 3 ? a[i + 1][0] - 1 : 100) + "</b>" + esc(l[1]) + "</div>").join("") + "</div>");
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
  return '<div class="crits">' + S.rules.crit.map((c) => {
    const v = sc.v[c.id] || 0, E = st.entries.filter((e) => e.crit === c.id);
    let extra = "";
    if (c.id === "acad") extra = '<div class="ent"><span>GPA ' + f2((sc.info.acad || {}).gpa || 0) + " · " + esc((sc.info.acad || {}).year || "") + ' o\'quv yili</span><a class="btn sm ghost" href="' + (opt.base || "#/") + 'gpa">Batafsil</a></div>';
    if (c.id === "att") extra = '<div class="ent"><span>Sababsiz qoldirilgan: ' + ((sc.info.att || {}).hours || 0) + ' soat</span><a class="btn sm ghost" href="' + (opt.base || "#/") + 'attendance">Batafsil</a></div>';
    if (c.id === "enlight" && sc.info.enlight) extra = '<div class="ent"><span>Ma\'rifat darslari: ' + sc.info.enlight.n + " / " + sc.info.enlight.held + " ishtirok (QR) → " + f1(sc.info.enlight.part) + " ball</span></div>";
    if (c.id === "culture" && sc.info.culture) extra = '<div class="ent"><span>Tasdiqlangan tashrif bo\'lgan oylar: ' + sc.info.culture.months + " / " + sc.info.culture.need + "</span></div>";
    const can = opt.student && (c.who === "student" || c.who === "ref");
    const ents = E.filter((e) => !(c.id === "enlight" && e.source === "qr")).slice(0, 6);
    return '<div class="crit"><div class="crit-h"><span class="num">' + c.n + '</span><div class="t"><b>' + esc(c.name) + "</b><small>" + esc(c.hint) + '</small></div><div class="pts">' + f1(v) + " <span>/ " + c.max + "</span></div></div>" + bar(v, c.max, v >= c.max ? "ok" : "") +
      '<div class="who">' + chip(WHO[c.who], c.who === "hemis" ? "warn" : c.who === "tutor" ? "pri" : "") + (c.future ? '<span class="muted">' + esc(c.future) + "</span>" : "") + "</div>" +
      (extra || ents.length ? '<div class="ents">' + extra + ents.map((e) => entryLine(e, opt)).join("") + "</div>" : "") +
      (opt.canScore && c.who === "tutor" || opt.canScore && (c.id === "public" || c.id === "spirit") ? '<details' + (c.who === "tutor" ? " open" : "") + '><summary class="small" style="cursor:pointer;font-weight:700;color:var(--pri2)">Tyutor bahosi</summary><div style="margin-top:8px">' + tutorScoreForm(st, c) + "</div></details>" : "") +
      (can ? '<div class="acts"><a class="btn sm" href="#/ifi/new/' + c.id + '">' + ic("plus") + (c.who === "ref" ? "Ma'lumotnoma to'ldirish" : "Ariza berish") + "</a></div>" : "") + "</div>";
  }).join("") + "</div>";
}
function ifiView(st, opt) {
  opt = opt || {};
  const tab = opt.tab || "crit";
  const E = st.entries.filter((e) => e.source !== "tutor");
  const pend = E.filter((e) => e.status === "kutilmoqda").length;
  const appsHref = opt.appsHref || opt.href + (opt.href.indexOf("?") >= 0 ? "&" : "?") + "tab=apps";
  const tabs = '<div class="tabs"><a href="' + opt.href + '" class="' + (tab === "crit" ? "on" : "") + '">11 band</a><a href="' + appsHref + '" class="' + (tab === "apps" ? "on" : "") + '">Arizalar' + (pend ? "<em>" + pend + "</em>" : "") + "</a></div>";
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
  const SC = { "so'ralgan": ["Yozish kerak", "warn"], yozildi: ["Tyutorga yuborildi", "pri"], "qabul qilindi": ["Qabul qilindi", "ok"], "rad etildi": ["Qayta yozish kerak", "bad"] };
  if (!X.length) return card("", empty("Tushuntirish xatlari yo'q."));
  return '<div class="grid">' + X.map((x) => card(esc(x.reason), '<div class="small muted" style="margin:-8px 0 10px">' + (x.refDate ? fmtDate(x.refDate) + " · " : "") + "So'radi: " + esc(x.by || "tyutor") + " · " + ago(x.created) + "</div>" +
    (x.text ? '<div class="note" style="white-space:pre-wrap">' + esc(x.text) + "</div>" : "") + (x.comment ? '<p class="small" style="margin:10px 0 0"><b>Tyutor:</b> ' + esc(x.comment) + "</p>" : "") +
    (opt.student && (x.status === "so'ralgan" || x.status === "rad etildi") ? '<form class="form" data-form="exwrite" style="margin-top:12px"><input type="hidden" name="id" value="' + esc(x.id) + '">' + field("Tushuntirish xati matni", "text", { type: "textarea", req: true, rows: 5, val: x.status === "rad etildi" ? x.text : "", ph: "Sababini aniq va to'liq yozing" }) + '<button class="btn" type="submit">Yuborish</button></form>' : "") +
    (opt.tutor && x.status === "yozildi" ? '<form class="form" data-form="exreview" style="margin-top:12px;gap:10px"><input type="hidden" name="id" value="' + esc(x.id) + '">' + field("Izoh (ixtiyoriy)", "comment", { ph: "Masalan: ma'lumotnoma qabul qilindi" }) + '<div style="display:flex;gap:8px"><button class="btn ok" name="decision" value="qabul qilindi" type="submit">Qabul qilish</button><button class="btn bad" name="decision" value="rad etildi" type="submit">Qaytarish</button></div></form>' : ""),
    chip((SC[x.status] || [x.status])[0], (SC[x.status] || [, ""])[1]))).join("") + "</div>";
}
const NK = { kuchli: ["Kuchli tomoni", "ok"], kuchsiz: ["Kuchsiz tomoni", "bad"], izoh: ["Izoh", "pri"] };
function notesView(st, opt) {
  opt = opt || {};
  const N = st.notes || [];
  return (opt.tutor ? card("Izoh qo'shish", '<form class="form" data-form="note"><input type="hidden" name="login" value="' + esc(st.login) + '"><div class="seg" role="radiogroup">' + Object.keys(NK).map((k, i) => '<label style="cursor:pointer"><input type="radio" name="kind" value="' + k + '"' + (i === 2 ? " checked" : "") + ' class="sr"><span class="pchip" style="display:inline-block;padding:6px 12px">' + NK[k][0] + "</span></label>").join("") + "</div>" +
    field("Matn", "text", { type: "textarea", req: true, rows: 3, ph: "Xarakteri, o'zlashtirishi, muammolari haqida qisqacha" }) + '<p class="small muted" style="margin:0">Izohlar ota-onaga ko\'rinadi.</p><button class="btn" type="submit">Saqlash</button></form>') + '<div style="height:16px"></div>' : "") +
    card(opt.tutor ? "Izohlar" : "Tyutor izohlari", N.length ? '<div class="list">' + N.map((n) => '<div class="row" style="align-items:flex-start"><span class="t">' + chip(NK[n.kind] ? NK[n.kind][0] : n.kind, NK[n.kind] ? NK[n.kind][1] : "") + "<b style=\"margin-top:6px;white-space:normal\">" + esc(n.text) + "</b><small>" + esc(n.by) + " · " + ago(n.created) + "</small></span>" + (opt.tutor ? '<button class="btn sm ghost" data-act="note-del" data-id="' + esc(n.id) + '">O\'chirish</button>' : "") + "</div>").join("") + "</div>" : empty("Hali izoh yo'q."));
}

/* ---------- talaba sahifalari ---------- */
V.student = {};
V.student.home = () => {
  const st = S.st, me = S.me;
  const h = Number(new Date().toLocaleString("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Tashkent" }));
  const hello = h < 12 ? "Xayrli tong" : h < 18 ? "Xayrli kun" : "Xayrli kech";
  const todo = [];
  st.explanations.filter((x) => x.status === "so'ralgan" || x.status === "rad etildi").forEach((x) => todo.push(['<a class="row" href="#/explanations">' + ic("mail") + '<span class="t"><b>Tushuntirish xati yozing</b><small>' + esc(x.reason) + "</small></span>" + ic("arrow") + "</a>"]));
  st.entries.filter((e) => e.status === "rad").slice(0, 2).forEach((e) => todo.push(['<a class="row" href="#/ifi?tab=apps">' + ic("star") + '<span class="t"><b>IFI arizasi rad etildi</b><small>' + esc(e.critName) + " — " + esc(e.comment) + "</small></span>" + ic("arrow") + "</a>"]));
  const up = (S.events || []).filter((e) => e.date >= today()).slice(0, 3);
  return '<div style="margin-bottom:18px"><h2 style="font-size:24px">' + hello + ", " + esc(me.name) + '</h2><p class="muted" style="margin:4px 0 0">' + esc(me.grp) + " · " + esc(me.faculty) + "</p></div>" +
    '<div class="grid g4" style="margin-bottom:16px">' + stat("Ijtimoiy faollik", f1(st.ifi.total) + " <span>/ 100</span>", esc(st.ifi.level), "", "#/ifi") + stat("GPA", f2(st.acad.gpa), esc(st.acad.year) + " o'quv yili", "", "#/gpa") +
    stat("Davomat", st.att.rate + "%", st.absH + " soat sababsiz", st.absH > 15 ? "warn" : "", "#/attendance") + stat("Reyting (IFI)", st.rank ? "#" + st.rank.ifi.grp.pos + " <span>/ " + st.rank.ifi.grp.of + "</span>" : "—", "guruhda", "", "#/rating") + "</div>" +
    (todo.length ? card("Bajarish kerak", '<div class="list">' + todo.join("") + "</div>") + '<div style="height:16px"></div>' : "") +
    '<div class="grid g2">' + card("Bugungi darslar", todayLessons(S.schedule), '<a href="#/schedule">Jadval</a>') +
    card("Yaqin tadbirlar", up.length ? '<div class="list">' + up.map(evRow).join("") + "</div>" : empty("Yaqin kunlarda tadbir yo'q."), '<a href="#/events">Barchasi</a>') + "</div>";
};
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
/* ---- ma'lumotnoma (5, 8, 9, 11-band namunasi) ---- */
const REF_TXT = { contest: "Xalqaro, Respublika, viloyat miqyosdagi ko'rik-tanlov, fan olimpiadalari va sport musobaqalarida erishgan natijalari", public: "Volontyorlik va jamoat ishlaridagi faolligi",
  culture: "Teatr va muzey, xiyobon, kino, tarixiy qadamjolarga tashriflar", spirit: "Ma'naviy-ma'rifiy sohaga oid boshqa yo'nalishlardagi faolligi uchun" };
function findEntry(id) {
  const pools = [];
  if (S.st) pools.push([S.st, S.st.entries]);
  (S.kids || []).forEach((k) => pools.push([k, k.entries]));
  if (CARD) pools.push([CARD, CARD.entries]);
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
  afterRender.push(() => (e.files || []).slice(0, 4).forEach((fid, i) => api("getFile", { id: fid }, { quiet: true, silent: true, noRender: true, lite: true }).then((j) => {
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
  const by = r.q.get("by") === "gpa" ? "gpa" : "ifi", sc = r.q.get("sc") || "grp";
  const me = S.st, B = (S.board || []).filter((x) => sc === "all" || (sc === "grp" ? x.grp === me.grp : x.faculty === me.faculty)).sort((a, b) => b[by] - a[by]);
  const pos = B.findIndex((x) => x.login === me.login) + 1;
  const lnk = (k, v, t) => '<a href="#/rating?by=' + (k === "by" ? v : by) + "&sc=" + (k === "sc" ? v : sc) + '" class="' + ((k === "by" ? by : sc) === v ? "on" : "") + '">' + t + "</a>";
  return '<div class="bar-row"><div class="seg">' + lnk("by", "ifi", "Ijtimoiy faollik") + lnk("by", "gpa", "GPA") + '</div><div class="seg">' + lnk("sc", "grp", "Guruhim") + lnk("sc", "fac", "Fakultetim") + lnk("sc", "all", "Universitet") + "</div></div>" +
    '<div class="grid g3" style="margin-bottom:16px">' + stat("Mening o'rnim", "#" + pos + " <span>/ " + B.length + "</span>", sc === "grp" ? me.grp : sc === "fac" ? me.faculty : "Universitet bo'yicha") + stat(by === "ifi" ? "Mening IFI balim" : "Mening GPA", by === "ifi" ? f1(me.ifi.total) : f2(me.acad.gpa)) + stat("Yetakchi", B[0] ? (by === "ifi" ? f1(B[0].ifi) : f2(B[0].gpa)) : "—", B[0] ? esc(B[0].name) : "") + "</div>" +
    '<div class="tw"><table class="t"><thead><tr><th>#</th><th>Talaba</th><th>Guruh</th><th class="n">' + (by === "ifi" ? "IFI" : "GPA") + "</th></tr></thead><tbody>" +
    B.slice(0, 100).map((x, i) => '<tr class="' + (x.login === me.login ? "me" : "") + '"><td><b>' + (i + 1) + '</b></td><td><span class="who">' + ava(x.name) + esc(x.name) + "</span></td><td>" + esc(x.grp) + '</td><td class="n"><b>' + (by === "ifi" ? f1(x.ifi) : f2(x.gpa)) + "</b></td></tr>").join("") + "</tbody></table></div>" +
    '<p class="small muted" style="margin-top:10px">GPA reytingi HEMIS ma\'lumotlari asosida (MVP: namunaviy). IFI reytingi tasdiqlangan arizalar va tizim ko\'rsatkichlaridan.</p>';
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
function evCard(e, opt) {
  opt = opt || {};
  const p = e.date.split("-").map(Number), past = e.date < today();
  const meta = [e.kind === "musobaqa" ? chip("Musobaqa", "warn") : chip("Tadbir"), e.ifiLabel ? chip("IFI " + e.ifiLabel, "pri") : "", e.club ? chip(e.club) : "", e.groups.length ? chip(e.groups.join(", ")) : ""].join(" ");
  let act = "";
  if (opt.student) act = e.attended ? chip("Qatnashdingiz", "ok") : past ? "" : e.reg ? '<button class="btn sm ghost" data-act="ev-reg" data-id="' + esc(e.id) + '" data-on="0">Yozilishni bekor qilish</button>' : '<button class="btn sm" data-act="ev-reg" data-id="' + esc(e.id) + '">Yozilish</button>';
  if (opt.owner && e.mine) act = (e.date === today() ? '<button class="btn sm" data-act="qr-open" data-id="' + esc(e.id) + '">' + ic("qr") + "QR-kod ochish</button>" : '<span class="small muted">QR-kod tadbir kuni ochiladi</span>') +
    e.sessions.map((s) => '<a class="btn sm ghost" href="#/qr/' + esc(s.id) + '">' + (s.active ? "Faol QR" : "QR natijasi") + "</a>").join("") + '<button class="btn sm ghost" data-act="ev-edit" data-id="' + esc(e.id) + '">Tahrirlash</button><button class="btn sm bad" data-act="ev-del" data-id="' + esc(e.id) + '">O\'chirish</button>';
  return '<div class="card" style="display:flex;gap:14px;align-items:flex-start' + (opt.focus ? ";border-color:var(--pri)" : "") + '" id="ev-' + esc(e.id) + '"><span class="date"><b>' + p[2] + "</b><small>" + MONTHS[p[1] - 1].slice(0, 3) + '</small></span><div style="flex:1;min-width:0;display:grid;gap:6px"><b style="font-size:15.5px">' + esc(e.title) + '</b><small class="muted">' + esc([e.time, e.place].filter(Boolean).join(" · ")) + (e.ownerName ? " · " + esc(e.ownerRole) + ": " + esc(e.ownerName) : "") + "</small>" +
    (e.description ? '<p class="small" style="margin:0">' + esc(e.description) + "</p>" : "") + '<div style="display:flex;gap:6px;flex-wrap:wrap">' + meta + "</div>" + (opt.owner ? '<small class="muted">Yozilganlar: ' + e.regN + " · QR bilan qatnashganlar: " + e.attN + "</small>" : "") + (act ? '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">' + act + "</div>" : "") + "</div></div>";
}
V.student.events = (r) => {
  const k = r.q.get("k") || "", f = r.q.get("e") || "";
  const E = (S.events || []).filter((e) => !k || e.kind === k);
  const up = E.filter((e) => e.date >= today()), past = E.filter((e) => e.date < today() && (e.reg || e.attended)).reverse();
  if (f) afterRender.push(() => { const el = document.getElementById("ev-" + f); if (el) el.scrollIntoView({ block: "center" }); });
  return '<p class="note" style="margin-bottom:16px">' + ic("qr") + ' Tadbirda ishtirokingiz QR-kod orqali qayd etiladi: tashkilotchi ekranidagi kodni telefon kamerasi bilan skanerlang. IFI belgisi bor tadbirlarda ball avtomatik qo\'shiladi.</p>' +
    '<div class="bar-row"><div class="seg"><a href="#/events" class="' + (!k ? "on" : "") + '">Hammasi</a><a href="#/events?k=tadbir" class="' + (k === "tadbir" ? "on" : "") + '">Tadbirlar</a><a href="#/events?k=musobaqa" class="' + (k === "musobaqa" ? "on" : "") + '">Musobaqalar</a></div></div>' +
    '<div class="grid">' + (up.length ? up.map((e) => evCard(e, { student: true, focus: e.id === f })).join("") : card("", empty("Yaqin tadbirlar yo'q."))) + "</div>" +
    (past.length ? '<h3 style="font-size:15px;margin:22px 0 10px">O\'tgan tadbirlarim</h3>' + card("", '<div class="list">' + past.map(evRow).join("") + "</div>") : "");
};
V.student.news = V.common.news;
/* ---- QR orqali qayd etish ---- */
let devId = "";
try { devId = localStorage.getItem("ul_dev") || ""; if (!devId) { devId = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem("ul_dev", devId); } } catch (e) { /* */ }
V.student.c = (r) => {
  const code = r.parts[1] || "", [sid, tok] = code.split(".");
  afterRender.push(() => api("qrInfo", { id: sid }, { quiet: true, silent: true, noRender: true, lite: true }).then((j) => {
    const el = document.getElementById("ci-info");
    if (!el) return;
    if (!j) { el.innerHTML = '<p class="note bad">QR-kod noto\'g\'ri yoki eskirgan.</p>'; return; }
    const d = j.data;
    el.innerHTML = "<h2 style=\"font-size:20px\">" + esc(d.title) + '</h2><p class="muted">' + esc([d.place, d.by].filter(Boolean).join(" · ")) + "</p>" + (d.ifi ? chip("IFI " + d.ifi, "pri") : "") + (d.active ? "" : '<p class="note bad" style="margin-top:12px">Qayd etish vaqti tugagan.</p>');
  }));
  return '<div style="max-width:520px;margin:0 auto">' + card("", '<div id="ci-info"><p class="muted">Yuklanmoqda…</p></div><p class="small muted" style="margin:16px 0">Qayd etish uchun joylashuvingiz tekshiriladi — tadbir joyida bo\'lishingiz kerak. Brauzer so\'raganda «Ruxsat berish»ni bosing.</p>' +
    '<button class="btn block" data-act="checkin" data-sid="' + esc(sid) + '" data-tok="' + esc(tok || "") + '">' + ic("check") + "Ishtirokni qayd etish</button><div id=\"ci-res\" style=\"margin-top:12px\"></div>") + "</div>";
};
/* ---------- ota-ona ---------- */
let kidIdx = 0;
try { kidIdx = Number(localStorage.getItem("ul_kid")) || 0; } catch (e) { /* */ }
function kid() { const K = S.kids || []; if (kidIdx >= K.length) kidIdx = 0; return K[kidIdx]; }
function kidBar() {
  const K = S.kids || [];
  if (K.length < 2) return "";
  return '<div class="bar-row"><div class="seg">' + K.map((k, i) => '<button data-act="kid" data-i="' + i + '" class="' + (i === kidIdx ? "on" : "") + '">' + esc(k.name + " " + k.surname) + "</button>").join("") + "</div></div>";
}
function noKid() { return card("Farzand ulanmagan", '<p class="muted" style="margin:0">Farzandingiz hisobini administrator bog\'laydi. Universitet talabalar bo\'limiga murojaat qiling.</p>'); }
const P = (fn) => (r) => { const k = kid(); return k ? kidBar() + fn(k, r) : noKid(); };
V.parent = {};
V.parent.home = P((k) => {
  const T = k.tutors[0];
  const N = (S.notifs || []).filter((n) => !n.child || n.child === k.login).slice(0, 5);
  const exOpen = k.explanations.filter((x) => x.status === "so'ralgan").length;
  return '<div style="display:flex;gap:14px;align-items:center;margin-bottom:16px">' + ava(k.name + " " + k.surname, "l") + '<div><h2 style="font-size:22px">' + esc(k.name + " " + k.surname) + '</h2><div class="muted">' + esc(k.grp) + " · " + esc(k.faculty) + "</div></div></div>" +
    todayStatus(k) + '<div style="height:16px"></div><div class="grid g4" style="margin-bottom:16px">' + stat("Davomat", k.att.rate + "%", k.absH + " soat sababsiz", k.absH > 15 ? "warn" : "", "#/attendance") + stat("GPA", f2(k.acad.gpa), esc(k.acad.year) + " o'quv yili", "", "#/gpa") +
    stat("Ijtimoiy faollik", f1(k.ifi.total) + " <span>/ 100</span>", esc(k.ifi.level), "", "#/ifi") + stat("Reyting", k.rank ? "#" + k.rank.ifi.grp.pos + " <span>/ " + k.rank.ifi.grp.of + "</span>" : "—", "guruhda (IFI)") + "</div>" +
    (exOpen ? '<a class="note warn" href="#/explanations" style="display:block;margin-bottom:16px"><b>' + exOpen + " ta tushuntirish xati so'ralgan.</b> Batafsil ko'rish →</a>" : "") +
    '<div class="grid g2">' + card("Tyutor", T ? '<div class="row" style="border:0;padding:0">' + ava(T.name) + '<span class="t"><b>' + esc(T.name) + "</b><small>" + esc(T.phone || "telefon kiritilmagan") + "</small></span>" + (T.phone ? '<a class="btn sm" href="tel:' + tel(T.phone) + '">' + ic("phone") + "Qo'ng'iroq</a>" : "") + "</div>" : empty("Tyutor biriktirilmagan."), '<a href="#/tutor">Izohlar</a>') +
    card("So'nggi xabarlar", N.length ? '<div class="list">' + N.map((n) => '<a class="row" href="' + esc(n.link) + '"><span class="t"><b>' + esc(n.title) + "</b><small>" + esc(n.body) + '</small></span><small class="muted">' + ago(n.created) + "</small></a>").join("") + "</div>" : empty("Xabar yo'q."), '<a href="#/notifications">Barchasi</a>') + "</div>";
});
V.parent.attendance = P((k) => attView(k, { today: true }));
V.parent.gpa = P((k) => gpaView(k));
V.parent.ifi = P((k, r) => ifiView(k, { tab: r.q.get("tab") || "crit", href: "#/ifi" }));
V.parent.scholarships = P((k) => '<p class="lead">Farzandingiz yuborgan stipendiya arizalari va ularning holati.</p>' + schCards(S.scholarships || [], k.apps));
V.parent.explanations = P((k) => exView(k));
V.parent.schedule = P((k) => scheduleView(k.schedule));
V.parent.tutor = P((k) => '<div class="grid g2" style="margin-bottom:16px">' + (k.tutors.length ? k.tutors.map((t) => card("Tyutor", '<div style="display:flex;gap:14px;align-items:center">' + ava(t.name, "l") + '<div style="flex:1"><b style="font-size:17px">' + esc(t.name) + '</b><div class="muted">' + esc(k.grp) + " guruhi tyutori</div></div></div>" +
  '<div class="kv" style="margin-top:14px"><div><small>Telefon</small><b>' + (t.phone ? '<a href="tel:' + tel(t.phone) + '">' + esc(t.phone) + "</a>" : "kiritilmagan") + "</b></div></div>")).join("") : card("Tyutor", empty("Tyutor biriktirilmagan."))) + "</div>" + notesView(k));

/* ---------- tyutor ---------- */
// Guruh tanlagich: tyutorning bir nechta guruhi bo'lsa, barcha sahifalar tanlangan guruh bo'yicha ko'rsatiladi
let TG = "";
try { TG = localStorage.getItem("ul_tg") || ""; } catch (e) { /* */ }
function tgBar() {
  const G = S.groups || [];
  if (G.length < 2) return "";
  const n = (g) => (S.students || []).filter((s) => !g || s.grp === g).length;
  return '<div class="bar-row"><span class="small muted" style="font-weight:700">Guruh:</span><div class="seg" role="tablist">' + [["", "Barcha guruhlar"]].concat(G.map((g) => [g, g])).map((x) =>
    '<button role="tab" data-act="tg" data-g="' + esc(x[0]) + '" class="' + (x[0] === TG ? "on" : "") + '">' + esc(x[1]) + ' <span class="muted">' + n(x[0]) + "</span></button>").join("") + "</div></div>";
}
function TGV(fn) {
  return (r) => {
    const G = S.groups || [];
    if (TG && !G.includes(TG)) TG = "";
    const wrap = (o) => (o && typeof o === "object" ? { title: o.title, html: tgBar() + o.html } : tgBar() + o);
    if (!TG) return wrap(fn(r));
    const bar = tgBar();
    const keep = { groups: S.groups, students: S.students, queue: S.queue, explanations: S.explanations, events: S.events };
    S.groups = [TG];
    S.students = (keep.students || []).filter((s) => s.grp === TG);
    S.queue = (keep.queue || []).filter((e) => e.grp === TG);
    S.explanations = (keep.explanations || []).filter((x) => x.grp === TG);
    S.events = (keep.events || []).filter((e) => !e.groups.length || e.groups.includes(TG));
    try { const o = fn(r); return o && typeof o === "object" ? { title: o.title, html: bar + o.html } : bar + o; } finally { Object.assign(S, keep); }
  };
}
V.tutor = {};
V.tutor.home = () => {
  const G = S.groups || [], st = S.students || [];
  const risk = st.filter((x) => x.absH > 15 || x.ifi < 40).slice(0, 5);
  const todayEv = (S.events || []).filter((e) => e.mine && e.date === today());
  const exW = (S.explanations || []).filter((x) => x.status === "yozildi").length;
  const need = (g) => (S.schedules[g] || []).filter((x) => x.day === isoDay(today())).length;
  const unmarked = G.filter((g) => need(g) && (S.marked[g] || []).length < need(g));
  return '<div class="grid g4" style="margin-bottom:16px">' + stat("Talabalarim", st.length, G.join(", ") || "guruh yo'q", "", "#/students") + stat("Bugungi davomat", (G.length - unmarked.length) + " / " + G.length, "guruh belgilandi", unmarked.length ? "warn" : "ok", "#/attendance") +
    stat("Kutilayotgan arizalar", (S.queue || []).length, "IFI bo'yicha", (S.queue || []).length ? "warn" : "", "#/queue") + stat("Tushuntirish xatlari", exW, "ko'rib chiqish kerak", exW ? "warn" : "", "#/explanations") + "</div>" +
    (!G.length ? '<p class="note warn">Sizga hali guruh biriktirilmagan. Administratorga murojaat qiling.</p>' : "") +
    '<div class="grid g2">' + card("Bugungi davomat", G.length ? '<div class="list">' + G.map((g) => { const done = S.marked[g] || [], n = (S.schedules[g] || []).filter((x) => x.day === isoDay(today())).length;
      return '<div class="row"><span class="t"><b>' + esc(g) + "</b><small>" + (n ? n + " para · " + done.length + " tasi belgilangan" : "bugun dars yo'q") + "</small></span>" + (n ? (done.length >= n ? chip("Belgilandi", "ok") : '<a class="btn sm" href="#/attendance?g=' + encodeURIComponent(g) + '">Davomat qilish</a>') : "") + "</div>"; }).join("") + "</div>" : empty("Guruh yo'q.")) +
    card("Kutilayotgan arizalar", (S.queue || []).length ? '<div class="list">' + S.queue.slice(0, 4).map((e) => '<a class="row" href="#/queue"><span class="date"><b>' + e.n + '</b><small>band</small></span><span class="t"><b>' + esc(e.name) + "</b><small>" + esc(e.critName) + " · " + esc(e.subName) + "</small></span></a>").join("") + "</div>" : empty("Yangi ariza yo'q."), '<a href="#/queue">Barchasi</a>') +
    card("Bugungi tadbirlar", todayEv.length ? '<div class="list">' + todayEv.map((e) => '<div class="row"><span class="t"><b>' + esc(e.title) + "</b><small>" + esc([e.time, e.place].join(" · ")) + '</small></span><button class="btn sm" data-act="qr-open" data-id="' + esc(e.id) + '">' + ic("qr") + "QR</button></div>").join("") + "</div>" : empty("Bugun tadbir yo'q."), '<a href="#/events">Tadbirlar</a>') +
    card("E'tibor talab qiladi", risk.length ? '<div class="list">' + risk.map((x) => '<a class="row" href="#/student/' + encodeURIComponent(x.login) + '">' + ava(x.name + " " + x.surname) + '<span class="t"><b>' + esc(x.name + " " + x.surname) + "</b><small>" + (x.absH > 15 ? x.absH + " soat sababsiz" : "") + (x.absH > 15 && x.ifi < 40 ? " · " : "") + (x.ifi < 40 ? "IFI " + f1(x.ifi) : "") + "</small></span></a>").join("") + "</div>" : empty("Hammasi joyida."), "") + "</div>";
};
let ATT = null;
function loadSheet(g, d) { return api("attSheet", { grp: g, date: d }, { quiet: true, noRender: true, lite: true }).then((j) => { if (j) { ATT = j.data; ATT.pair = ATT.pairs[0] ? ATT.pairs[0].pair : 0; const nd = ATT.pairs.find((p) => !ATT.done.includes(p.pair)); if (nd) ATT.pair = nd.pair; } render(); }); }
V.tutor.attendance = (r) => {
  const G = S.groups || [];
  if (!G.length) return card("", empty("Sizga guruh biriktirilmagan."));
  const g = (r.q.get("g") && G.includes(r.q.get("g")) ? r.q.get("g") : "") || (ATT && G.includes(ATT.grp) ? ATT.grp : G[0]), d = r.q.get("d") || (ATT && ATT.grp === g ? ATT.date : today());
  if (!ATT || ATT.grp !== g || ATT.date !== d) { afterRender.push(() => loadSheet(g, d)); return card("", '<p class="muted">Yuklanmoqda…</p>'); }
  const A = ATT;
  const top = '<form class="bar-row" data-form="attpick">' + (G.length > 1 ? '<select name="g" style="width:auto">' + G.map((x) => '<option' + (x === g ? " selected" : "") + ">" + esc(x) + "</option>").join("") + "</select>" : '<input type="hidden" name="g" value="' + esc(g) + '"><b>' + esc(g) + "</b>") +
    '<input type="date" name="d" value="' + d + '" max="' + today() + '" style="width:auto"><button class="btn ghost sm" type="submit">Ko\'rsatish</button></form>';
  if (!A.pairs.length) return top + card("", empty(fmtDate(d) + " — jadval bo'yicha dars yo'q."));
  const cur = A.marks.filter((m) => m.pair === A.pair);
  const val = (lg) => (cur.find((m) => m.login === lg) || {}).status || "";
  const opt = (lg, v, cls, t) => '<label><input type="radio" name="m_' + esc(lg) + '" value="' + v + '"' + (val(lg) === v ? " checked" : "") + '><span class="' + cls + '">' + t + "</span></label>";
  return top + '<div class="pchips" style="margin-bottom:14px">' + A.pairs.map((p) => '<button type="button" class="pchip ' + (p.pair === A.pair ? "on " : "") + (A.done.includes(p.pair) ? "done" : "") + '" data-act="att-pair" data-p="' + p.pair + '">' + p.pair + "-para · " + esc(S.pairs[p.pair] || "") + "<small>" + esc(p.subject) + "</small></button>").join("") + "</div>" +
    card(esc(g) + " · " + fmtDate(d) + " · " + A.pair + "-para", '<form data-form="att"><input type="hidden" name="grp" value="' + esc(g) + '"><input type="hidden" name="date" value="' + d + '"><input type="hidden" name="pair" value="' + A.pair + '"><div class="am">' +
      A.students.map((s) => '<div class="am-r">' + ava(s.name + " " + s.surname) + '<span class="t"><b>' + esc(s.surname + " " + s.name) + '</b></span><span class="tg">' + opt(s.login, "", "k", "Keldi") + opt(s.login, "kelmadi", "m", "Kelmadi") + opt(s.login, "kechikdi", "l", "Kechikdi") + opt(s.login, "sababli", "s", "Sababli") + "</span></div>").join("") +
      '</div><div class="sticky-act"><button type="button" class="btn ghost" data-act="att-all">Hammasi keldi</button><button class="btn" type="submit" name="scope" value="pair">' + ic("check") + "Saqlash</button>" + (A.pairs.length > 1 ? '<button class="btn ghost" type="submit" name="scope" value="day">Kun bo\'yi uchun</button>' : "") + "</div></form>",
      A.done.includes(A.pair) ? chip("Belgilangan", "ok") : chip("Belgilanmagan", "warn")) +
    '<p class="small muted" style="margin-top:10px">Kelmagan va kechikkan talabalarning ota-onasiga avtomatik xabar boradi. Sababsiz qoldirilgan har bir para 2 soat hisoblanadi va IFI 6-bandiga ta\'sir qiladi (to\'liq versiyada HEMIS davomati).</p>';
};
let fileCache = {};
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
V.tutor.queue = () => {
  const Q = S.queue || [];
  return '<p class="lead">Talabalar yuborgan IFI arizalari. Hujjatni ko\'rib, to\'g\'ri bo\'lsa tasdiqlang — ball avtomatik hisoblanadi. Rad etsangiz, sababini yozing.</p>' + (Q.length ? '<div class="grid g2">' + Q.map(queueCard).join("") + "</div>" : card("", empty("Yangi ariza yo'q.")));
};
function studentsTable(list, opt) {
  opt = opt || {};
  return '<div class="tw"><table class="t st"><thead><tr><th>Talaba</th>' + (opt.grp ? "<th>Guruh</th>" : "") + '<th class="n">GPA</th><th class="n">IFI</th><th>Daraja</th><th class="n">Sababsiz, soat</th></tr></thead><tbody>' +
    (list.length ? list.map((x) => '<tr data-href="#/student/' + encodeURIComponent(x.login) + '"><td><span class="who">' + ava(x.name + " " + x.surname) + "<span><b>" + esc(x.surname + " " + x.name) + "</b>" + (opt.grp ? "" : "<small>" + esc(x.grp) + "</small>") + "</span></span></td>" + (opt.grp ? '<td data-l="Guruh">' + esc(x.grp) + "</td>" : "") +
      '<td class="n" data-l="GPA">' + f2(x.gpa) + '</td><td class="n" data-l="IFI"><b>' + f1(x.ifi) + '</b></td><td data-l="Daraja">' + esc(x.level) + '</td><td class="n" data-l="Sababsiz">' + (x.absH > 15 ? '<b style="color:var(--bad)">' + x.absH + "</b>" : x.absH) + "</td></tr>").join("") : '<tr><td colspan="6">' + empty("Talaba topilmadi.") + "</td></tr>") + "</tbody></table></div>";
}
V.tutor.students = (r) => {
  const G = S.groups || [], g = r.q.get("g") || "";
  const L = (S.students || []).filter((x) => !g || x.grp === g).sort((a, b) => b.ifi - a.ifi);
  return studentsTable(L, { grp: G.length > 1 });
};
function studentPage(r) {
  const login = r.parts[1], tab = r.q.get("tab") || "main";
  if (!CARD || CARD.login !== login) {
    afterRender.push(() => api("studentCard", { login }, { quiet: true, noRender: true, lite: true }).then((j) => { if (j) { CARD = j.data; render(); } else go("#/students"); }));
    return { title: "Talaba kartasi", html: card("", '<p class="muted">Yuklanmoqda…</p>') };
  }
  const st = CARD, tutor = S.me.role === "tutor", base = "#/student/" + encodeURIComponent(login);
  const T = [["main", "Umumiy"], ["attendance", "Davomat"], ["gpa", "GPA"], ["ifi", "Ijtimoiy faollik"], ["notes", "Izohlar"], ["ex", "Tushuntirish xatlari"]];
  let body;
  if (tab === "attendance") body = attView(st, { today: true });
  else if (tab === "gpa") body = gpaView(st);
  else if (tab === "ifi") body = ifiView(st, { canScore: st.canScore, tab: r.q.get("t") === "apps" ? "apps" : "crit", href: base + "?tab=ifi", appsHref: base + "?tab=ifi&t=apps", base: base + "?tab=" });
  else if (tab === "notes") body = notesView(st, { tutor });
  else if (tab === "ex") body = (tutor ? card("Tushuntirish xati so'rash", '<form class="form" data-form="exrequest"><input type="hidden" name="login" value="' + esc(st.login) + '"><div class="f2">' + field("Sababi", "reason", { req: true, ph: "Masalan: darsga sababsiz kelmaganligi" }) + field("Sana", "date", { type: "date", max: today(), val: today() }) + '</div><button class="btn" type="submit">So\'rash</button></form>') + '<div style="height:16px"></div>' : "") + exView(st, { tutor });
  else body = '<div class="grid g4" style="margin-bottom:16px">' + stat("IFI", f1(st.ifi.total) + " <span>/ 100</span>", esc(st.ifi.level)) + stat("GPA", f2(st.acad.gpa), esc(st.acad.year)) + stat("Davomat", st.att.rate + "%", st.absH + " soat sababsiz", st.absH > 15 ? "warn" : "") + stat("Reyting", st.rank ? "#" + st.rank.ifi.grp.pos + " <span>/ " + st.rank.ifi.grp.of + "</span>" : "—", "guruhda") + "</div>" +
    '<div class="grid g2">' + card("Aloqa", '<div class="kv"><div><small>Login</small><b>' + esc(st.login) + "</b></div>" + (st.jshir ? "<div><small>JSHIR</small><b>" + esc(st.jshir) + "</b></div>" : "") + "<div><small>Telefon</small><b>" + (st.phone ? '<a href="tel:' + tel(st.phone) + '">' + esc(st.phone) + "</a>" : "—") + "</b></div></div>" +
      '<h3 style="font-size:14px;margin:16px 0 8px">Ota-ona</h3>' + (st.parents.length ? '<div class="list">' + st.parents.map((p) => '<div class="row">' + ava(p.name) + '<span class="t"><b>' + esc(p.name) + "</b><small>" + esc(p.phone || "telefon kiritilmagan") + "</small></span>" + (p.phone ? '<a class="btn sm ghost" href="tel:' + tel(p.phone) + '">' + ic("phone") + "</a>" : "") + "</div>").join("") + "</div>" : '<p class="muted small">Ota-ona ulanmagan.</p>')) +
      card("Bugun", todayStatus(st) + '<h3 style="font-size:14px;margin:16px 0 8px">To\'garaklar</h3>' + (st.clubs.length ? st.clubs.map((c) => chip(c.name + (c.status === "a'zo" ? "" : " (so'rov)"), c.status === "a'zo" ? "ok" : "warn")).join(" ") : '<span class="muted small">A\'zo emas</span>') +
        '<h3 style="font-size:14px;margin:16px 0 8px">Tyutor izohlari</h3>' + (st.notes.length ? st.notes.slice(0, 3).map((n) => '<p class="small" style="margin:0 0 6px">' + chip(NK[n.kind] ? NK[n.kind][0] : n.kind, NK[n.kind] ? NK[n.kind][1] : "") + " " + esc(n.text) + "</p>").join("") : '<span class="muted small">Izoh yo\'q</span>')) + "</div>";
  return { title: st.name + " " + st.surname, html: '<a href="#/students" class="small">← Talabalar</a><div style="display:flex;gap:14px;align-items:center;margin:12px 0 16px">' + ava(st.name + " " + st.surname, "l") + '<div><h2 style="font-size:22px">' + esc(st.name + " " + st.surname) + '</h2><div class="muted">' + esc(st.grp) + " · " + esc(st.faculty) + "</div></div></div>" +
    '<div class="tabs">' + T.map((t) => '<a href="' + base + (t[0] === "main" ? "" : "?tab=" + t[0]) + '" class="' + (tab === t[0] ? "on" : "") + '">' + t[1] + "</a>").join("") + "</div>" + body };
}
V.tutor.student = studentPage;
V.tutor.explanations = () => {
  const X = S.explanations || [];
  const grp = (k) => X.filter((x) => x.status === k);
  const sel = '<select name="login" required><option value="">Talabani tanlang</option>' + (S.students || []).map((s) => '<option value="' + esc(s.login) + '">' + esc(s.surname + " " + s.name + " · " + s.grp) + "</option>").join("") + "</select>";
  const box = (title, L, tutor) => L.length ? '<h3 style="font-size:15px;margin:20px 0 10px">' + title + " (" + L.length + ")</h3>" + exView({ explanations: L.map((x) => Object.assign({}, x, { reason: x.name + " — " + x.reason, by: x.grp })) }, { tutor }) : "";
  return card("Yangi so'rov", '<form class="form" data-form="exrequest"><div class="f2"><label class="fl"><span>Talaba</span>' + sel + "</label>" + field("Sana", "date", { type: "date", max: today(), val: today() }) + "</div>" + field("Sababi", "reason", { req: true, ph: "Masalan: darsga sababsiz kelmaganligi" }) + '<button class="btn" type="submit">So\'rash</button></form>') +
    box("Ko'rib chiqish kerak", grp("yozildi"), true) + box("Javob kutilmoqda", grp("so'ralgan")) + box("Yakunlangan", X.filter((x) => x.status === "qabul qilindi" || x.status === "rad etildi")) + (X.length ? "" : '<div style="height:16px"></div>' + card("", empty("Tushuntirish xatlari yo'q.")));
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
/* ---- QR ekran ---- */
let qrTimer = null, qrLast = "";
function qrPoll(sid) {
  if (parseRoute().parts[0] !== "qr") { clearInterval(qrTimer); qrTimer = null; return; }
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
    if (!d.active) { box.innerHTML = '<p class="note">QR-kod yopilgan.</p>'; el.querySelector(".qr-tm").style.display = "none"; el.querySelector("[data-act=qr-end]").style.display = "none"; clearInterval(qrTimer); return; }
    if (d.token !== qrLast) {
      qrLast = d.token;
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
  qrLast = "";
  afterRender.push(() => { clearInterval(qrTimer); qrPoll(sid); qrTimer = setInterval(() => qrPoll(sid), 4000); });
  return { title: "QR-kod", html: '<div id="qr-live"><div class="qr-wrap"><div class="qr-box"><h2 style="font-size:20px;text-align:center">…</h2><p class="muted qi" style="text-align:center;margin:4px 0 16px"></p><div class="q"></div><div class="qr-tm"><i></i></div><p class="small muted" style="text-align:center;margin:12px 0 0">Kod har 30 soniyada yangilanadi. Talabalar telefon kamerasi bilan skanerlaydi.</p></div>' +
    card("Qayd etilganlar", '<div class="big-n">0</div><p class="small muted qp" style="margin:4px 0 12px"></p><div class="list ql"></div><button class="btn bad block" style="margin-top:14px" data-act="qr-end" data-id="' + esc(sid) + '">QR-kodni yopish</button>') + "</div></div>" };
}
V.tutor.qr = qrPage;
["home", "attendance", "queue", "students", "explanations", "events"].forEach((k) => { V.tutor[k] = TGV(V.tutor[k]); });

/* ---------- dekanat ---------- */
V.dean = {};
function overview() {
  const st = S.students || [], T = S.tutors || [];
  const avg = (f) => (st.length ? st.reduce((a, x) => a + f(x), 0) / st.length : 0);
  const lv = S.rules.levels.map((l) => [l[1], st.filter((x) => x.level === l[1]).length]);
  const pend = T.reduce((a, t) => a + t.pending, 0), ex = T.reduce((a, t) => a + t.exOpen, 0);
  return '<div class="grid g4" style="margin-bottom:16px">' + stat("Talabalar", st.length, "", "", "#/students") + stat("O'rtacha IFI", f1(avg((x) => x.ifi)), "100 ballik") + stat("O'rtacha GPA", f2(avg((x) => x.gpa)), "HEMIS · MVP") + stat("Kutilayotgan arizalar", pend, ex + " ta tushuntirish xati ochiq", pend ? "warn" : "") + "</div>" +
    '<div class="grid g2">' + card("IFI darajalari bo'yicha", '<div class="list">' + lv.map((l) => '<div class="row"><span class="t"><b>' + esc(l[0]) + "</b>" + bar(l[1], st.length || 1) + '</span><span class="v">' + l[1] + "</span></div>").join("") + "</div>") +
    card("Tyutorlar reytingi", tutorTable(T.slice().sort((a, b) => b.ifi - a.ifi).slice(0, 6), true), '<a href="#/tutors">Barchasi</a>') + "</div>";
}
function tutorTable(T, short) {
  return '<div class="tw"><table class="t st"><thead><tr><th>Tyutor</th>' + (short ? "" : "<th>Guruhlar</th><th class=\"n\">Talaba</th>") + '<th class="n">O\'rt. IFI</th>' + (short ? "" : '<th class="n">O\'rt. GPA</th><th class="n">Davomat belgilangan</th><th class="n">Kutilayotgan</th>') + "</tr></thead><tbody>" +
    T.map((t) => '<tr data-href="#/tutor/' + encodeURIComponent(t.login) + '"><td><span class="who">' + ava(t.name) + "<span><b>" + esc(t.name) + "</b>" + (short ? "<small>" + esc(t.groups.join(", ")) + "</small>" : "") + "</span></span></td>" +
      (short ? "" : '<td data-l="Guruhlar">' + esc(t.groups.join(", ") || "—") + '</td><td class="n" data-l="Talaba">' + t.n + "</td>") + '<td class="n" data-l="IFI"><b>' + f1(t.ifi) + "</b></td>" +
      (short ? "" : '<td class="n" data-l="GPA">' + f2(t.gpa) + '</td><td class="n" data-l="Davomat">' + t.attMarked + '%</td><td class="n" data-l="Kutilayotgan">' + (t.pending ? '<b style="color:var(--warn)">' + t.pending + "</b>" : 0) + "</td>") + "</tr>").join("") + "</tbody></table></div>";
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
  return '<div class="tw"><table class="t st"><thead><tr><th>Guruh</th><th>Fakultet</th><th>Tyutor</th><th class="n">Talaba</th><th class="n">O\'rt. IFI</th><th class="n">O\'rt. GPA</th><th class="n">O\'rt. sababsiz soat</th></tr></thead><tbody>' +
    Object.values(G).sort((a, b) => avg(b.L, (x) => x.ifi) - avg(a.L, (x) => x.ifi)).map((g) => '<tr data-href="#/students?g=' + encodeURIComponent(g.grp) + '"><td><b>' + esc(g.grp) + '</b></td><td data-l="Fakultet">' + esc(g.fac) + '</td><td data-l="Tyutor">' + esc(tut(g.grp)) + '</td><td class="n" data-l="Talaba">' + g.L.length +
      '</td><td class="n" data-l="IFI"><b>' + f1(avg(g.L, (x) => x.ifi)) + '</b></td><td class="n" data-l="GPA">' + f2(avg(g.L, (x) => x.gpa)) + '</td><td class="n" data-l="Sababsiz">' + f1(avg(g.L, (x) => x.absH)) + "</td></tr>").join("") + "</tbody></table></div>";
};
V.dean.students = (r) => {
  const q = (r.q.get("q") || "").toLowerCase(), g = r.q.get("g") || "", f = r.q.get("f") || "", lv = r.q.get("lv") || "";
  const st = S.students || [];
  const facs = Array.from(new Set(st.map((x) => x.faculty))).sort(), grps = Array.from(new Set(st.filter((x) => !f || x.faculty === f).map((x) => x.grp))).sort();
  const L = st.filter((x) => (!q || (x.name + " " + x.surname + " " + x.login).toLowerCase().indexOf(q) >= 0) && (!g || x.grp === g) && (!f || x.faculty === f) && (!lv || x.level === lv)).sort((a, b) => b.ifi - a.ifi);
  const sel = (n, v, opts, ph) => '<select name="' + n + '" style="width:auto"><option value="">' + ph + "</option>" + opts.map((o) => '<option' + (o === v ? " selected" : "") + ">" + esc(o) + "</option>").join("") + "</select>";
  return '<form class="bar-row" data-form="stfilter"><input type="search" name="q" value="' + esc(r.q.get("q") || "") + '" placeholder="Ism, familiya" style="max-width:220px">' + sel("f", f, facs, "Barcha fakultetlar") + sel("g", g, grps, "Barcha guruhlar") + sel("lv", lv, S.rules.levels.map((l) => l[1]), "Barcha darajalar") + '<button class="btn sm" type="submit">Saralash</button><span class="small muted">' + L.length + " ta talaba</span></form>" + studentsTable(L, { grp: true });
};
V.dean.student = studentPage;
V.dean.events = (r) => eventsPage(r, { hint: "Tanlangan guruhlar yoki barcha talabalar uchun.", others: false });
V.dean.qr = qrPage;

/* ---------- admin ---------- */
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
V.admin.students = V.dean.students;
V.admin.student = studentPage;
V.admin.tutor = V.dean.tutor;
V.admin.qr = qrPage;
V.admin.tutors = V.dean.tutors;

/* ---------- klub rahbari ---------- */
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
/* ---------- fayllar: rasmni siqish ---------- */
const FILES = {};
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
  if (t.matches && t.matches("select[data-act=app-status]")) api("appStatus", { id: t.dataset.id, status: t.value });
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

/* ---------- formalar ---------- */
document.addEventListener("submit", async (e) => {
  const f = e.target.closest("form[data-form]");
  if (!f) return;
  e.preventDefault();
  const kind = f.dataset.form, fd = new FormData(f), g = (k) => String(fd.get(k) || "").trim();
  const sub = e.submitter;
  if (kind === "login") {
    const j = await api("login", { login: g("login"), password: fd.get("password") });
    if (j) { let to = ""; try { to = sessionStorage.getItem("ul_after") || ""; sessionStorage.removeItem("ul_after"); } catch (x) { /* */ } if (to) location.hash = to; else if (location.hash !== "#/home") location.hash = "#/home"; }
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
  if (kind === "tutorset") { const j = await api("ifiTutorSet", { login: g("login"), crit: g("crit"), subs: fd.getAll("subs") }, { noRender: true }); if (j) { CARD = null; render(); } return; }
  if (kind === "exwrite") return api("exWrite", { id: g("id"), text: g("text") });
  if (kind === "exreview") return api("exReview", { id: g("id"), decision: sub ? sub.value : "", comment: g("comment") });
  if (kind === "exrequest") { const j = await api("exRequest", { login: g("login"), reason: g("reason"), date: g("date") }, { noRender: true }); if (j) { CARD = null; render(); } return; }
  if (kind === "note") { const j = await api("noteAdd", { login: g("login"), kind: g("kind"), text: g("text") }, { noRender: true }); if (j) { CARD = null; render(); } return; }
  if (kind === "attpick") return go("#/attendance?g=" + encodeURIComponent(g("g")) + "&d=" + g("d"));
  if (kind === "att") {
    const marks = {};
    ATT.students.forEach((s) => { const v = fd.get("m_" + s.login); if (v) marks[s.login] = v; });
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
  if (kind === "stfilter") { const p = new URLSearchParams(); ["q", "f", "g", "lv"].forEach((k) => g(k) && p.set(k, g(k))); return go("#/students" + (p.toString() ? "?" + p : "")); }
  if (kind === "ufilter") { const p = new URLSearchParams(); ["q", "r"].forEach((k) => g(k) && p.set(k, g(k))); return go("#/users" + (p.toString() ? "?" + p : "")); }
  if (kind === "user") { const j = await api("userSave", Object.fromEntries(fd.entries())); if (j) closeSheet(); return; }
  if (kind === "link") { const j = await api("linkParent", { parent: g("parent"), child: g("child") }); if (j) closeSheet(); return; }
  if (kind === "clubform") { const j = await api("clubSave", Object.fromEntries(fd.entries())); if (j) closeSheet(); return; }
  if (kind === "schform") { const j = await api("scholarshipSave", Object.fromEntries(fd.entries())); if (j) closeSheet(); return; }
  if (kind === "artform") { const j = await api("articleSave", Object.fromEntries(fd.entries())); if (j) closeSheet(); return; }
});

/* ---------- tugmalar ---------- */
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
  if (a === "logout") { closeSheet(); await api("logout"); CARD = null; ATT = null; location.hash = "#/home"; return; }
  if (a === "tg") { TG = b.dataset.g || ""; try { localStorage.setItem("ul_tg", TG); } catch (x) { /* */ } return render(); }
  if (a === "sday") { schedDay = Number(b.dataset.d); return render(); }
  if (a === "kid") { kidIdx = Number(b.dataset.i); try { localStorage.setItem("ul_kid", kidIdx); } catch (x) { /* */ } return render(); }
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
  if (a === "qr-end") { if (confirm("QR-kodni yopasizmi? Shundan keyin qayd etib bo'lmaydi.")) { await api("qrEnd", { id }, { noRender: true }); qrLast = ""; qrPoll(id); } return; }
  if (a === "checkin") {
    const res = $("#ci-res");
    b.disabled = true; res.innerHTML = '<p class="muted">Joylashuv aniqlanmoqda…</p>';
    try {
      const p = await geo();
      const j = await api("checkin", { sid: b.dataset.sid, tok: b.dataset.tok, lat: p.lat, lng: p.lng, acc: p.acc, dev: devId }, { noRender: true, silent: true });
      if (j) { res.innerHTML = '<p class="note ok"><b>' + esc(j.msg) + "</b></p>" + '<a class="btn ghost block" href="#/events" style="margin-top:10px">Tadbirlar</a>'; b.style.display = "none"; }
      else res.innerHTML = '<p class="note bad">' + esc(lastErr) + "</p>";
    } catch (err) { res.innerHTML = '<p class="note bad">' + esc(err.message) + "</p>"; }
    b.disabled = false; return;
  }
  if (a === "att-pair") { ATT.pair = Number(b.dataset.p); return render(); }
  if (a === "att-all") { document.querySelectorAll('form[data-form=att] input[type=radio][value=""]').forEach((x) => (x.checked = true)); return; }
  if (a === "note-del") { if (confirm("Izohni o'chirasizmi?")) { const j = await api("noteDelete", { id }, { noRender: true }); if (j) { CARD = null; render(); } } return; }
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
  if (a === "art-del") { if (confirm("Yangilikni o'chirasizmi?")) api("articleDelete", { id }); return; }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeSheet(); });

/* ---------- ishga tushirish ---------- */
(async function init() {
  $("#root").innerHTML = '<div style="display:grid;place-items:center;min-height:100vh;color:var(--muted)">Yuklanmoqda…</div>';
  try {
    const r = await fetch("/api/rpc", { method: "POST", headers: { "content-type": "application/json" }, credentials: "same-origin", body: JSON.stringify({ action: "state", data: {} }) });
    const j = await r.json();
    if (j.state) S = j.state;
  } catch (e) { toast("Server bilan aloqa yo'q. Sahifani yangilang", true); }
  render();
})();
})();
