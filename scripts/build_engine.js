const fs = require('fs');

const originalJs = fs.readFileSync('/home/monarch/Downloads/Telegram Desktop/univerlife/public/app.js', 'utf8');

let js = originalJs.replace(/[\u{1F300}-\u{1FAFF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');

js = js.replace(/<div class="brand"><i>U<\/i>UniverLife<\/div>/g, '<a href="/ecosystem" class="brand" title="Ekotizim bosh sahifasiga o‘tish"><div class="riat-badge">TSUE</div><span>UniverLife</span></a>');
js = js.replace(/document\.title = title \+ " · UniverLife";/g, 'document.title = title + " · TSUE UniverLife";');
js = js.replace(/<div class="foot">TDIU talabalari uchun platforma<\/div>/g, '<div class="foot">TSUE UniverLife · Birlashgan ekotizim portali</div>');

js = js.replace(
  '<header class="top"><h1>\' + esc(title) + \'</h1>',
  '<header class="top"><h1>\' + esc(title) + \'</h1><div class="top-controls-group"><button type="button" class="top-lang-btn \' + (getLang()===\'uz\'?\'active\':\'\') + \'" data-act="set-lang" data-l="uz">UZ</button><button type="button" class="top-lang-btn \' + (getLang()===\'ru\'?\'active\':\'\') + \'" data-act="set-lang" data-l="ru">RU</button><button type="button" class="top-lang-btn \' + (getLang()===\'en\'?\'active\':\'\') + \'" data-act="set-lang" data-l="en">EN</button><button type="button" class="top-theme-btn" data-act="toggle-theme" title="Theme"><i class="fa-solid fa-circle-half-stroke"></i></button></div>'
);

const oldShellRegex = /function shell\(view, title\) \{[\s\S]*?\n\}/;
const newShellFn = `
function shell(view, title) {
  const r = S.me.role, cur = parseRoute().parts[0] || "home";
  const nav = (NAV[r] || []).map((n) => n === "-" ? '<div class="sep"></div>' : '<a href="#/' + n[0] + '" class="' + (cur === n[0] ? "on" : "") + '">' + ic(n[2]) + "<span>" + (t(n[0]) || n[1]) + "</span>" + (badge(n[0]) ? "<em>" + badge(n[0]) + "</em>" : "") + "</a>").join("") +
    (r !== "admin" && r !== "club" ? '<div class="sep"></div><a href="#/rules" class="' + (cur === "rules" ? "on" : "") + '">' + ic("info") + "<span>" + t("rules") + "</span></a>" : "") +
    '<a href="#/notifications" class="' + (cur === "notifications" ? "on" : "") + '">' + ic("bell") + "<span>" + t("notifications") + "</span>" + (S.unread ? "<em>" + S.unread + "</em>" : "") + "</a>" +
    '<a href="#/profile" class="' + (cur === "profile" ? "on" : "") + '">' + ic("user") + "<span>" + t("profile") + "</span></a>";
  const dock = (DOCK[r] || []).map((k) => { const n = NAV[r].find((x) => x[0] === k); return '<a href="#/' + k + '" class="' + (cur === k ? "on" : "") + '">' + ic(n[2]) + "<span>" + (t(k) || n[1]).split(" ")[0] + "</span>" + (badge(k) ? "<em>" + badge(k) + "</em>" : "") + "</a>"; }).join("") +
    '<button data-act="menu">' + ic("menu") + "<span>" + t("menu") + "</span></button>";
  const name = S.me.name + " " + S.me.surname;
  const roleDisplay = t("role_" + S.me.role) || S.me.roleName;
  return '<div class="app"><aside class="side"><a href="/ecosystem" class="brand" title="Ekotizim bosh sahifasiga o‘tish"><div class="riat-badge">TSUE</div><span>UniverLife</span></a><div class="who"><b>' + esc(name) + "</b><small>" + esc(roleDisplay) + (S.me.grp && S.me.grp !== "-" ? " · " + esc(S.me.grp) : "") + '</small></div><nav class="nav" aria-label="Asosiy menyu">' + nav + '</nav><div class="foot">TSUE UniverLife · Birlashgan ekotizim portali</div></aside>' +
    '<div class="main"><header class="top"><h1>' + esc(title) + '</h1><div class="top-controls-group"><button type="button" class="top-lang-btn ' + (getLang()==='uz'?'active':'') + '" data-act="set-lang" data-l="uz">UZ</button><button type="button" class="top-lang-btn ' + (getLang()==='ru'?'active':'') + '" data-act="set-lang" data-l="ru">RU</button><button type="button" class="top-lang-btn ' + (getLang()==='en'?'active':'') + '" data-act="set-lang" data-l="en">EN</button><button type="button" class="top-theme-btn" data-act="toggle-theme" title="Theme"><i class="fa-solid fa-circle-half-stroke"></i></button></div><a class="ib" href="#/notifications" aria-label="Bildirishnomalar">' + ic("bell") + (S.unread ? "<em>" + S.unread + "</em>" : "") + '</a><a href="#/profile" aria-label="Profil">' + ava(name, "") + "</a></header>" +
    '<main class="content" id="view">' + view + '</main></div><nav class="dock" aria-label="Pastki menyu">' + dock + "</nav></div>";
}
`;
js = js.replace(oldShellRegex, newShellFn);

const oldMenuSheetRegex = /function menuSheet\(\) \{[\s\S]*?\n\}/;
const newMenuSheetFn = `
function menuSheet() {
  const r = S.me.role;
  sheet(t("menu"), '<nav class="nav">' + (NAV[r] || []).filter((n) => n !== "-").map((n) => '<a href="#/' + n[0] + '" data-act="close-sheet">' + ic(n[2]) + "<span>" + (t(n[0]) || n[1]) + "</span>" + (badge(n[0]) ? "<em>" + badge(n[0]) + "</em>" : "") + "</a>").join("") +
    '<div class="sep"></div>' + (r !== "admin" && r !== "club" ? '<a href="#/rules" data-act="close-sheet">' + ic("info") + "<span>" + t("rules") + "</span></a>" : "") +
    '<a href="#/notifications" data-act="close-sheet">' + ic("bell") + "<span>" + t("notifications") + "</span></a>" + '<a href="#/profile" data-act="close-sheet">' + ic("user") + "<span>" + t("profile") + "</span></a>" +
    '<a href="#" data-act="logout">' + ic("out") + "<span>" + t("logout") + "</span></a></nav>");
}
`;
js = js.replace(oldMenuSheetRegex, newMenuSheetFn);

const oldSchedRegex = /function scheduleView\(rows, opt\) \{[\s\S]*?\n\}/;
const newSchedFn = `
let currentSchedWeek = 'odd';
let currentSchedGroup = '';
let currentSchedSearch = '';
let currentSchedCourse = 'all';

const I18N = {
  uz: {
    back_eco: "Ekotizimga qaytish",
    mod_edu: "O‘quv & Jadval (EduPage, GPA, Davomat)",
    mod_ifi: "Ijtimoiy & IFI (11 mezon, Klublar, Grantlar)",
    mod_fam: "Oila & Tyutor (Monitoring va Aloqa)",
    sched_title: "TDIU Rasmiy Dars Jadvali",
    sched_sub: "Fakultet guruhlari, ustozlar va auditoriyalar bo'yicha real vaqt rejimida avtomatlashtirilgan interaktiv jadval tizimi.",
    odd_week: "Toq hafta",
    even_week: "Juft hafta",
    all_courses: "Barcha kurslar",
    course_1: "1-kurs",
    course_2: "2-kurs",
    course_3: "3-kurs",
    course_4: "4-kurs",
    group_search_ph: "Guruhni qidirish (masalan: AT-82/25, II-81...)",
    lesson_search_ph: "Fan, o'qituvchi yoki xona...",
    group_label: "Guruh:",
    course_label: "Kurs:",
    today_badge: "Bugun",
    lessons_count: "ta dars",
    no_lessons: "Bu kunda tanlangan guruh uchun darslar mavjud emas.",
    sync_badge: "TDIU EduPage Jadval Tizimi (Sinxron)",
    lecture: "Ma'ruza",
    practice: "Amaliyot",
    lab: "Laboratoriya",
    para: "-para",
    home: "Bosh sahifa",
    schedule: "Dars jadvali",
    attendance: "Davomat",
    gpa: "GPA va baholar",
    ifi: "Ijtimoiy faollik",
    rating: "Reyting",
    scholarships: "Stipendiyalar",
    clubs: "To'garaklar",
    events: "Tadbir va musobaqalar",
    news: "Yangiliklar",
    explanations: "Tushuntirish xatlari",
    users: "Foydalanuvchilar",
    tutors: "Tyutorlar",
    groups: "Guruhlar",
    students: "Talabalar",
    overview: "Umumiy ko'rinish",
    notifications: "Bildirishnomalar",
    profile: "Profil",
    rules: "IFI va GPA qanday hisoblanadi",
    logout: "Chiqish",
    menu: "Menyu",
    queue: "Arizalar",
    hemis: "HEMIS va Edu",
    role_student: "Talaba",
    role_tutor: "Tyutor",
    role_parent: "Ota-ona",
    role_dean: "Dekanat",
    role_admin: "Administrator",
    role_club: "Klub rahbari"
  },
  ru: {
    back_eco: "Назад в экосистему",
    mod_edu: "Учеба и расписание (EduPage, GPA, Посещаемость)",
    mod_ifi: "Социальная активность и ИФИ (11 критериев, Клубы, Гранты)",
    mod_fam: "Семья и Тьютор (Мониторинг и Связь)",
    sched_title: "Официальное расписание занятий ТГЭУ",
    sched_sub: "Интерактивная система расписания факультетов, преподавателей и аудиторий в реальном времени.",
    odd_week: "Нечетная неделя",
    even_week: "Четная неделя",
    all_courses: "Все курсы",
    course_1: "1-курс",
    course_2: "2-курс",
    course_3: "3-курс",
    course_4: "4-курс",
    group_search_ph: "Поиск группы (напр: AT-82/25, II-81...)",
    lesson_search_ph: "Предмет, преподаватель или аудитория...",
    group_label: "Группа:",
    course_label: "Курс:",
    today_badge: "Сегодня",
    lessons_count: "пар",
    no_lessons: "На этот день для выбранной группы занятий нет.",
    sync_badge: "Синхронизация EduPage ТГЭУ",
    lecture: "Лекция",
    practice: "Практика",
    lab: "Лабораторная",
    para: "-пара",
    home: "Главная",
    schedule: "Расписание занятий",
    attendance: "Посещаемость",
    gpa: "GPA и оценки",
    ifi: "Социальная активность",
    rating: "Рейтинг",
    scholarships: "Стипендии",
    clubs: "Кружки",
    events: "Мероприятия",
    news: "Новости",
    explanations: "Объяснительные",
    users: "Пользователи",
    tutors: "Тьюторы",
    groups: "Группы",
    students: "Студенты",
    overview: "Обзор",
    notifications: "Уведомления",
    profile: "Профиль",
    rules: "Как рассчитываются ИФИ и GPA",
    logout: "Выход",
    menu: "Меню",
    queue: "Заявки",
    hemis: "HEMIS и Edu",
    role_student: "Студент",
    role_tutor: "Тьютор",
    role_parent: "Родитель",
    role_dean: "Деканат",
    role_admin: "Администратор",
    role_club: "Руководитель клуба"
  },
  en: {
    back_eco: "Back to Ecosystem",
    mod_edu: "Study & Timetable (EduPage, GPA, Attendance)",
    mod_ifi: "Social & IFI (11 Criteria, Clubs, Grants)",
    mod_fam: "Family & Tutor (Monitoring & Contact)",
    sched_title: "Official TSUE Timetable",
    sched_sub: "Real-time automated interactive schedule for faculty groups, professors, and auditoriums.",
    odd_week: "Odd week",
    even_week: "Even week",
    all_courses: "All courses",
    course_1: "1st year",
    course_2: "2nd year",
    course_3: "3rd year",
    course_4: "4th year",
    group_search_ph: "Search group (e.g. AT-82/25, II-81...)",
    lesson_search_ph: "Subject, teacher or room...",
    group_label: "Group:",
    course_label: "Course:",
    today_badge: "Today",
    lessons_count: "lessons",
    no_lessons: "No lessons scheduled for the selected group on this day.",
    sync_badge: "TSUE EduPage Timetable (Sync)",
    lecture: "Lecture",
    practice: "Practice",
    lab: "Lab",
    para: "-slot",
    home: "Dashboard",
    schedule: "Timetable",
    attendance: "Attendance",
    gpa: "GPA & Grades",
    ifi: "Social Activity",
    rating: "Rating",
    scholarships: "Scholarships",
    clubs: "Clubs",
    events: "Events & Contests",
    news: "News",
    explanations: "Explanations",
    users: "Users",
    tutors: "Tutors",
    groups: "Groups",
    students: "Students",
    overview: "Overview",
    notifications: "Notifications",
    profile: "Profile",
    rules: "How IFI & GPA are calculated",
    logout: "Logout",
    menu: "Menu",
    queue: "Applications",
    hemis: "HEMIS & Edu",
    role_student: "Student",
    role_tutor: "Tutor",
    role_parent: "Parent",
    role_dean: "Dean Office",
    role_admin: "Administrator",
    role_club: "Club Leader"
  }
};

function getLang() {
  try {
    const l = localStorage.getItem("riat_lang");
    if (l === "ru" || l === "en" || l === "uz") return l;
  } catch(e) {}
  return "uz";
}

function setLang(l) {
  try { localStorage.setItem("riat_lang", l); } catch(e) {}
  render();
}

function t(k) {
  const l = getLang();
  return (I18N[l] && I18N[l][k]) || (I18N.uz && I18N.uz[k]) || k;
}

function scheduleView(rows, opt) {
  opt = opt || {};
  const td = isoDay(today());
  if (!schedDay) {
    schedDay = (td >= 1 && td <= 6) ? td : 1;
  }
  const d = schedDay;
  
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
    if (currentSchedCourse !== 'all') {
      const gData = EDUPAGE_SCHEDULE_DATA[g];
      if (gData && String(gData.course) !== String(currentSchedCourse)) return false;
    }
    if (currentSchedSearch) {
      return g.toLowerCase().includes(currentSchedSearch.toLowerCase());
    }
    return true;
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
      '<span class="d-sub">' + (isToday ? t('today_badge') + ' · ' : '') + count + ' ' + t('lessons_count') + '</span>' +
    '</button>';
  }).join('');

  const groupPills = filteredGroups.map(g => {
    const isSel = g === currentSchedGroup;
    return '<button type="button" class="sched-group-btn ' + (isSel ? 'active' : '') + '" data-act="sched-select-group" data-grp="' + esc(g) + '">' + esc(g) + '</button>';
  }).join('');

  return '<div class="sched-hero">' +
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px">' +
      '<div>' +
        '<h2>' + t('sched_title') + '</h2>' +
        '<p>' + t('sched_sub') + '</p>' +
      '</div>' +
      '<div class="sched-btn-group">' +
        '<button type="button" class="' + (currentSchedWeek === 'odd' ? 'active' : '') + '" data-act="sched-week" data-week="odd">' + t('odd_week') + '</button>' +
        '<button type="button" class="' + (currentSchedWeek === 'even' ? 'active' : '') + '" data-act="sched-week" data-week="even">' + t('even_week') + '</button>' +
      '</div>' +
    '</div>' +
    '<div style="margin-top:16px;display:flex;flex-direction:column;gap:12px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">' +
        '<div class="sched-course-pills">' +
          '<button type="button" class="sched-course-btn ' + (currentSchedCourse === 'all' ? 'active' : '') + '" data-act="sched-course-tab" data-course="all">' + t('all_courses') + '</button>' +
          '<button type="button" class="sched-course-btn ' + (currentSchedCourse === '1' ? 'active' : '') + '" data-act="sched-course-tab" data-course="1">' + t('course_1') + '</button>' +
          '<button type="button" class="sched-course-btn ' + (currentSchedCourse === '2' ? 'active' : '') + '" data-act="sched-course-tab" data-course="2">' + t('course_2') + '</button>' +
          '<button type="button" class="sched-course-btn ' + (currentSchedCourse === '3' ? 'active' : '') + '" data-act="sched-course-tab" data-course="3">' + t('course_3') + '</button>' +
          '<button type="button" class="sched-course-btn ' + (currentSchedCourse === '4' ? 'active' : '') + '" data-act="sched-course-tab" data-course="4">' + t('course_4') + '</button>' +
        '</div>' +
        '<div style="flex:1;min-width:240px;max-width:400px">' +
          '<input type="text" placeholder="' + t('group_search_ph') + '" value="' + esc(currentSchedSearch) + '" data-act="sched-group-search-input" style="height:38px;border-radius:10px;border:1px solid rgba(255,255,255,0.3);background:rgba(255,255,255,0.9);color:#0E2A52;padding:0 12px;width:100%;font-weight:600">' +
        '</div>' +
      '</div>' +
      '<div style="background:rgba(255,255,255,0.1);padding:10px;border-radius:12px;border:1px solid rgba(255,255,255,0.15)">' +
        '<div style="font-size:12px;color:rgba(255,255,255,0.8);margin-bottom:6px;font-weight:700">' + t('group_label') + ' <span style="color:#fff;background:rgba(0,59,129,0.6);padding:2px 8px;border-radius:6px;font-weight:800">' + currentSchedGroup + '</span> <span class="sched-group-count">(' + filteredGroups.length + ')</span></div>' +
        '<div class="sched-group-grid">' + (groupPills || '<span style="color:#fff;padding:8px">Guruh topilmadi</span>') + '</div>' +
      '</div>' +
    '</div>' +
  '</div>' +
  '<div class="sched-days-nav">' + daysPills + '</div>' +
  '<div class="card">' +
    '<div class="ch">' +
      '<h2>' + DAYS[d] + (d === td ? ' <small style="color:var(--ok);font-weight:700">· ' + t('today_badge') + '</small>' : '') + ' <small>(' + currentSchedGroup + ' · ' + (currentSchedWeek === 'odd' ? t('odd_week') : t('even_week')) + ')</small></h2>' +
      '<span class="src"><i></i> ' + t('sync_badge') + '</span>' +
    '</div>' +
    (lessons.length ? 
      '<div class="lessons-list">' + lessons.map(l => {
        let typeCls = "type-lecture";
        let typeName = t('lecture');
        if (l.type === "practice" || l.type === "seminar") { typeCls = "type-practice"; typeName = t('practice'); }
        else if (l.type === "lab") { typeCls = "type-lab"; typeName = t('lab'); }
        return '<div class="lesson-card">' +
          '<div class="lesson-time">' +
            '<b>' + l.slot + t('para') + '</b>' +
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
      : empty(t('no_lessons'))
    ) +
  '</div>';
}
`;

js = js.replace(oldSchedRegex, newSchedFn);

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

js = js.replace(
  'const fn = (V[role] && V[role][p0]) || V.common[p0];',
  'const fn = (V[role] && V[role][p0]) || (V.student && V.student[p0]) || (V.admin && V.admin[p0]) || V.common[p0];'
);

js = js.replace(
  'admin: [["home", "Umumiy ko\'rinish", "grid"],',
  'admin: [["home", "Umumiy ko\'rinish", "grid"], ["schedule", "Dars jadvali", "cal"], ["attendance", "Davomat", "check"], ["gpa", "GPA va baholar", "cap"], ["ifi", "Ijtimoiy faollik", "star"],'
);

const oldProfileRegex = /V\.common\.profile = \(\) => \{[\s\S]*?\n\};/;
const newProfileFn = `
V.common.profile = () => {
  const m = S.me;
  const allGroups = (typeof EDUPAGE_SCHEDULE_DATA !== 'undefined' && EDUPAGE_SCHEDULE_DATA) ? Object.keys(EDUPAGE_SCHEDULE_DATA).sort() : ['AT-900/26', 'IB-900/26', 'II-900/26', 'RST-81/25'];
  const currentGrp = m.grp && m.grp !== '-' ? m.grp : 'AT-900/26';
  const grpOptions = allGroups.map(g => '<option value="' + g + '"' + (g === currentGrp ? ' selected' : '') + '>' + g + '</option>').join('');
  const adminGrpChangeForm = m.role === 'admin' ? (
    '<form class="form" data-form="admin-group" style="margin-top:16px;padding-top:14px;border-top:1px solid var(--line2)">' +
      '<div class="field"><label style="font-weight:700;font-size:13px;display:block;margin-bottom:6px">Guruhga biriktirish (Administrator / talaba ko\\'rinishi)</label>' +
      '<select name="grp" style="height:40px;border-radius:8px;padding:0 10px;width:100%">' + grpOptions + '</select></div>' +
      '<button class="btn sm" type="submit" style="margin-top:8px">Guruhni saqlash</button>' +
    '</form>'
  ) : '';

  return '<div class="grid g2">' + card("Ma'lumotlarim", '<div style="display:flex;gap:14px;align-items:center;margin-bottom:16px">' + ava(m.name + ' ' + m.surname, 'l') + '<div><b style="font-size:18px">' + esc(m.name + ' ' + m.surname) + '</b><div class="muted">' + esc(m.roleName) + (m.grp && m.grp !== '-' ? ' · ' + esc(m.grp) : '') + '</div></div></div>' +
    '<div class="kv"><div><small>Login</small><b>' + esc(m.login) + '</b></div>' + (m.jshir ? '<div><small>JSHIR</small><b>' + esc(m.jshir) + '</b></div>' : '') + (m.faculty && m.faculty !== '-' ? '<div><small>Fakultet / bo\\'lim</small><b>' + esc(m.faculty) + '</b></div>' : '') + '</div>' +
    adminGrpChangeForm +
    '<form class="form" data-form="phone" style="margin-top:16px">' + field('Telefon raqami' + (m.role === 'tutor' ? " (ota-onalar ko'radi)" : ''), 'phone', { type: 'tel', val: m.phone, ph: '+998 90 123 45 67' }) + '<button class="btn ghost" type="submit">Saqlash</button></form>') +
    card("Parolni o'zgartirish", '<form class="form" data-form="password">' + field('Joriy parol', 'old', { type: 'password', req: true, attrs: ' autocomplete="current-password"' }) + field('Yangi parol', 'password', { type: 'password', req: true, hint: 'kamida 6 belgi', attrs: ' autocomplete="new-password" minlength="6"' }) + '<button class="btn" type="submit">O\\'zgartirish</button></form>' +
    '<div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--line2)"><button class="btn bad" data-act="logout">' + ic('out') + 'Tizimdan chiqish</button></div>') + '</div>';
};
`;
js = js.replace(oldProfileRegex, newProfileFn);

const oldIfiCritsRegex = /function ifiCrits\(st, opt\) \{[\s\S]*?\n\}/;
const newIfiCritsFn = `
function ifiCrits(st, opt) {
  opt = opt || {};
  const sc = (st && st.ifi) || { v: {}, info: {} };
  const info = sc.info || {};
  return '<div class="crits">' + S.rules.crit.map((c) => {
    const v = (sc.v && sc.v[c.id]) || 0;
    const E = (st && st.entries) ? st.entries.filter((e) => e.crit === c.id) : [];
    let extra = "";
    if (c.id === "acad") extra = '<div class="ent"><span>GPA ' + f2((info.acad || {}).gpa || 0) + " · " + esc((info.acad || {}).year || "") + ' o\\'quv yili</span><a class="btn sm ghost" href="' + (opt.base || "#/") + 'gpa">Batafsil</a></div>';
    if (c.id === "att") extra = '<div class="ent"><span>Sababsiz qoldirilgan: ' + ((info.att || {}).hours || 0) + ' soat</span><a class="btn sm ghost" href="' + (opt.base || "#/") + 'attendance">Batafsil</a></div>';
    if (c.id === "enlight" && info.enlight) extra = '<div class="ent"><span>Ma\\'rifat darslari: ' + info.enlight.n + " / " + info.enlight.held + " ishtirok (QR) → " + f1(info.enlight.part) + " ball</span></div>";
    if (c.id === "culture" && info.culture) extra = '<div class="ent"><span>Tasdiqlangan tashrif bo\\'lgan oylar: ' + info.culture.months + " / " + info.culture.need + "</span></div>";
    const can = opt.student && (c.who === "student" || c.who === "ref");
    const ents = E.filter((e) => !(c.id === "enlight" && e.source === "qr")).slice(0, 6);
    return '<div class="crit"><div class="crit-h"><span class="num">' + c.n + '</span><div class="t"><b>' + esc(c.name) + "</b><small>" + esc(c.hint) + '</small></div><div class="pts">' + f1(v) + " <span>/ " + c.max + "</span></div></div>" + bar(v, c.max, v >= c.max ? "ok" : "") +
      '<div class="who">' + chip(WHO[c.who], c.who === "hemis" ? "warn" : c.who === "tutor" ? "pri" : "") + (c.future ? '<span class="muted">' + esc(c.future) + "</span>" : "") + "</div>" +
      (extra || ents.length ? '<div class="ents">' + extra + ents.map((e) => entryLine(e, opt)).join("") + "</div>" : "") +
      (opt.canScore && c.who === "tutor" || opt.canScore && (c.id === "public" || c.id === "spirit") ? '<details' + (c.who === "tutor" ? " open" : "") + '><summary class="small" style="cursor:pointer;font-weight:700;color:var(--pri2)">Tyutor bahosi</summary><div style="margin-top:8px">' + tutorScoreForm(st, c) + "</div></details>" : "") +
      (can ? '<div class="acts"><a class="btn sm" href="#/ifi/new/' + c.id + '">' + ic("plus") + (c.who === "ref" ? "Ma'lumotnoma to'ldirish" : "Ariza berish") + "</a></div>" : "") + "</div>";
  }).join("") + "</div>";
}
`;
js = js.replace(oldIfiCritsRegex, newIfiCritsFn);

const oldUserFormRegex = /function userForm\(u\) \{[\s\S]*?\n\}/;
const newUserFormFn = `
function userForm(u) {
  u = u || { role: "student" };
  const tg = u.login ? (S.tutorGroups || []).filter((x) => x.tutor === u.login).map((x) => x.grp).join(", ") : "";
  const allGroups = (typeof EDUPAGE_SCHEDULE_DATA !== "undefined" && EDUPAGE_SCHEDULE_DATA) ? Object.keys(EDUPAGE_SCHEDULE_DATA).sort() : ["AT-900/26", "IB-900/26", "II-900/26", "RST-81/25"];
  const currentGrp = u.grp && u.grp !== "-" ? u.grp : "AT-900/26";
  const grpOptions = allGroups.map(g => '<option value="' + g + '"' + (g === currentGrp ? ' selected' : '') + '>' + g + '</option>').join('');

  return '<form class="form" data-form="user"><input type="hidden" name="edit" value="' + esc(u.login || "") + '">' + field("Rol", "role", { type: "select", val: u.role, opts: ROLE_OPTS }) +
    '<div class="f2">' + field("Ism", "name", { req: true, val: u.name }) + field("Familiya", "surname", { req: true, val: u.surname }) + "</div>" +
    '<div class="f2">' + field("Login", "login", { req: true, val: u.login, attrs: u.login ? " readonly" : ' autocapitalize="none"', ph: "masalan: ali.valiyev" }) + field("JSHIR", "jshir", { val: u.jshir, hint: "ixtiyoriy, 14 raqam", attrs: ' inputmode="numeric"' }) + "</div>" +
    '<div class="f2">' +
      '<div class="field"><label>Guruh (talaba uchun tanlang)</label><select name="grp">' + grpOptions + '</select></div>' +
      field("Fakultet / bo'lim", "faculty", { val: u.faculty !== "-" ? u.faculty : "Raqamli iqtisodiyot" }) +
    '</div>' +
    field("Tyutor guruhlari", "groups", { val: tg, hint: "tyutor uchun, vergul bilan", ph: "RST-81/25, RST-82/25" }) + field("Telefon", "phone", { type: "tel", val: u.phone }) +
    field(u.login ? "Yangi parol" : "Parol", "password", { type: "text", req: !u.login, hint: u.login ? "o'zgartirmasangiz bo'sh qoldiring" : "kamida 6 belgi — foydalanuvchiga bering" }) + '<button class="btn block" type="submit">Saqlash</button></form>';
}
`;
js = js.replace(oldUserFormRegex, newUserFormFn);

js = js.replace(
  'if (kind === "phone") return api("setPhone", { phone: g("phone") });',
  'if (kind === "admin-group") return api("adminSetGrp", { grp: g("grp") });\n  if (kind === "phone") return api("setPhone", { phone: g("phone") });'
);

js = js.replace(
  'document.addEventListener("click", async (e) => {',
  `document.addEventListener("input", (e) => {
    const t = e.target;
    if (t.dataset.act === "sched-group-search-input") {
      currentSchedSearch = t.value;
      const q = currentSchedSearch.trim().toLowerCase();
      const grid = document.querySelector(".sched-group-grid");
      if (grid) {
        const btns = grid.querySelectorAll(".sched-group-btn");
        let visibleCount = 0;
        btns.forEach(btn => {
          const grp = (btn.dataset.grp || "").toLowerCase();
          const matches = !q || grp.includes(q);
          btn.style.display = matches ? "inline-flex" : "none";
          if (matches) visibleCount++;
        });
        const countSpan = document.querySelector(".sched-group-count");
        if (countSpan) countSpan.textContent = "(" + visibleCount + ")";
      }
    }
  });
  document.addEventListener("click", async (e) => {
    const btnAct = e.target.closest("[data-act]");
    if (btnAct) {
      const act = btnAct.dataset.act;
      if (act === "sched-week") {
        currentSchedWeek = btnAct.dataset.week;
        render();
        return;
      }
      if (act === "sched-day") {
        schedDay = Number(btnAct.dataset.day);
        render();
        return;
      }
      if (act === "sched-course-tab") {
        currentSchedCourse = btnAct.dataset.course;
        render();
        return;
      }
      if (act === "sched-select-group") {
        currentSchedGroup = btnAct.dataset.grp;
        render();
        return;
      }
      if (act === "set-lang") {
        setLang(btnAct.dataset.l);
        return;
      }
      if (act === "toggle-theme") {
        document.body.classList.toggle("dark-mode");
        try {
          const isDark = document.body.classList.contains("dark-mode");
          localStorage.setItem("theme", isDark ? "dark" : "light");
        } catch(e) {}
        return;
      }
    }
`
);

const oldInitRegex = /\(async function init\(\) \{[\s\S]*?\}\)\(\);/;
const newInit = `
function bootFromEcosystem() {
  try {
    const raw = localStorage.getItem("riat_user") || localStorage.getItem("tsue_user");
    if (raw) {
      const u = JSON.parse(raw);
      if (u && (u.login || u.username)) {
        const login = u.login || u.username;
        let role = "student";
        if (u.role === "admin" || login === "monarch") role = "admin";
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
      { id: "n1", title: "TSUE UniverLife platformasiga xush kelibsiz", body: "RIAT-Study, RIAT-Parents va RIAT-Ijtimoiy bitta markaziy tizimga birlashtirildi.", link: "#/home", created: Date.now() - 3600000, read: 0 }
    ],
    unread: 1,
    events: ldb.events.length ? ldb.events : (seed.events || []),
    clubs: ldb.clubs.length ? ldb.clubs.map(c => ({ ...c, members: 12 })) : (seed.clubs || []).map(c => ({ ...c, members: 12 })),
    scholarships: seed.scholarships || [],
    articles: seed.articles || []
  };

  if (!meUser) return base;

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
      v: { acad: 9.3, att: 5, read: 20, club: 20, contest: 9, public: 5, culture: 5, sport: 5, conduct: 4.2 },
      info: {
        acad: { gpa: 4.82, year: "2025–2026" },
        att: { hours: 4 },
        enlight: { n: 4, held: 4, part: 6 },
        culture: { months: 2, need: 2 }
      }
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

  base.st = stObject;
  base.schedule = [];
  base.board = [
    { pos: 1, login: "sardor.alisherov", name: "Sardor Alisherov", grp: meUser.grp || "AT-900/26", gpa: 4.85, ifi: 86.4 },
    { pos: 2, login: meUser.login, name: meUser.name + " " + meUser.surname, grp: meUser.grp || "AT-900/26", gpa: 4.82, ifi: 82.5 },
    { pos: 3, login: "nodir.vali", name: "Nodir Valiyev", grp: meUser.grp || "AT-900/26", gpa: 4.60, ifi: 74.0 },
    { pos: 4, login: "dilshod.k", name: "Dilshod Karimov", grp: meUser.grp || "AT-900/26", gpa: 4.45, ifi: 68.5 }
  ];

  if (meUser.role === "student") {
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

  if (action === "adminSetGrp") {
    const newGrp = String(data.grp || "").trim();
    if (newGrp && S.me) {
      S.me.grp = newGrp;
      currentSchedGroup = newGrp;
      try {
        const raw = localStorage.getItem("riat_user");
        if (raw) {
          const u = JSON.parse(raw);
          u.grp = newGrp;
          u.group = newGrp;
          localStorage.setItem("riat_user", JSON.stringify(u));
        }
      } catch(e) {}
      let userInDb = (ldb.users || []).find(u => u.login.toLowerCase() === S.me.login.toLowerCase());
      if (userInDb) {
        userInDb.grp = newGrp;
        saveLocalDb(ldb);
      }
      S = buildLocalState(S.me);
      return { ok: true, msg: "Guruh muvaffaqiyatli o'zgartirildi: " + newGrp, state: S };
    }
    return { ok: false, msg: "Guruh topilmadi" };
  }

  if (action === "userSave") {
    const editLogin = String(data.edit || data.login || "").trim().toLowerCase();
    let idx = ldb.users.findIndex(u => u.login.toLowerCase() === editLogin);
    const updatedUser = {
      login: editLogin || data.login,
      name: data.name || "Foydalanuvchi",
      surname: data.surname || "",
      role: data.role || "student",
      grp: data.grp || "AT-900/26",
      faculty: data.faculty || "Raqamli iqtisodiyot",
      phone: data.phone || "",
      jshir: data.jshir || ""
    };
    if (idx >= 0) {
      ldb.users[idx] = Object.assign(ldb.users[idx], updatedUser);
    } else {
      ldb.users.push(updatedUser);
    }
    saveLocalDb(ldb);
    S = buildLocalState(S.me);
    return { ok: true, msg: "Foydalanuvchi muvaffaqiyatli saqlandi", state: S };
  }

  if (action === "userDelete") {
    const delLogin = String(data.login || "").trim().toLowerCase();
    ldb.users = ldb.users.filter(u => u.login.toLowerCase() !== delLogin);
    saveLocalDb(ldb);
    S = buildLocalState(S.me);
    return { ok: true, msg: "Foydalanuvchi o'chirildi", state: S };
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
  
  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }
  } catch(e) {}

  const ssoUser = bootFromEcosystem();
  if (ssoUser) {
    S = buildLocalState(ssoUser);
  } else {
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

function stripAllComments(code) {
  let js = code.replace(/\/\*[\s\S]*?\*\//g, (match) => {
    if (match.startsWith('/*"') || match.startsWith('/*,') || match.startsWith('/*.') || match.startsWith('/*/')) {
      return match;
    }
    return '';
  });

  js = js.split('\n').map(line => {
    const t = line.trim();
    if (t.startsWith('//')) return '';
    if (t.startsWith('/*') && t.endsWith('*/') && !t.includes('application/pdf')) return '';
    if (line.includes(' // ') && !line.includes('://')) {
      return line.split(' // ')[0];
    }
    return line;
  }).join('\n');

  return js;
}

js = stripAllComments(js);

fs.writeFileSync('/home/monarch/Projects/TSUE-Ecosystem/js/univerlife_engine.js', js);
console.log('Successfully written stripped js/univerlife_engine.js');
