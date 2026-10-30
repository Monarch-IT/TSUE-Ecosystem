
// ==========================================================================
// AUTHENTIC HEMIS OTM V4.4.7 EXACT SCREENS REPLICA (PHOTOS 1-12)
// ==========================================================================

// PHOTO 1: ГЛАВНАЯ (HOME)
function renderHemisExactHome() {
  const d = STATE.digitalIdentity;
  return `
    <div style="padding-bottom:76px">
      <!-- Шапка (Фото 1) -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;padding:2px 2px">
        <div style="display:flex;gap:10px;align-items:center;cursor:pointer" onclick="openHemisProfileDrawer()">
          <div style="position:relative">
            <img src="/${esc(d.photo)}" style="width:44px;height:44px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.3)" onerror="this.src='/assets/images/faculty_logo.png'">
            <span style="position:absolute;bottom:-2px;right:-2px;background:#2563EB;color:#FFF;font-size:9.5px;font-weight:800;padding:1px 5px;border-radius:8px">4.00</span>
          </div>
          <div>
            <div style="font-size:11px;color:#94A3B8">Добрый день, добро пожа...</div>
            <div style="font-size:15.5px;font-weight:800;color:#FFF">${esc(d.shortName || 'Muhammadamin')}</div>
          </div>
        </div>

        <div style="display:flex;gap:8px">
          <button class="pro-pill-btn" style="width:38px;height:38px;padding:0;justify-content:center;border-radius:50%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#FFF" onclick="openHemisProfileDrawer()">
            <i class="fa-solid fa-sliders" style="font-size:14px"></i>
          </button>
          <button class="pro-pill-btn" style="width:38px;height:38px;padding:0;justify-content:center;border-radius:50%;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#FFF" onclick="openHemisIdFullScreen()">
            <i class="fa-solid fa-qrcode" style="font-size:15px"></i>
          </button>
        </div>
      </div>

      <!-- Поисковая строка (Фото 1) -->
      <div style="margin-bottom:14px">
        <div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);border-radius:24px;padding:9px 14px;display:flex;align-items:center;gap:10px">
          <i class="fa-solid fa-magnifying-glass" style="color:#94A3B8;font-size:13.5px"></i>
          <input type="text" placeholder="Поиск..." style="background:transparent;border:none;outline:none;color:#FFF;font-size:12.5px;width:100%" oninput="onSchedQueryInput(this.value)">
        </div>
      </div>

      <!-- Истории (Фото 1) -->
      <div class="hemis-stories-strip">
        <div class="hemis-story-item" onclick="showToast('TechCrunch Disrupt: Innovatsiyalar forumi')">
          <div class="hemis-story-ring"><div class="hemis-story-circle"><i class="fa-solid fa-laptop-code"></i></div></div>
          <span class="hemis-story-label">TechCrunch</span>
        </div>
        <div class="hemis-story-item" onclick="showToast('Career EDU: Karyera va amaliyot')">
          <div class="hemis-story-ring"><div class="hemis-story-circle"><i class="fa-solid fa-graduation-cap"></i></div></div>
          <span class="hemis-story-label">Career EDU</span>
        </div>
        <div class="hemis-story-item" onclick="showToast('Talabalar uchun yangi imkoniyatlar')">
          <div class="hemis-story-ring"><div class="hemis-story-circle"><i class="fa-solid fa-bullhorn"></i></div></div>
          <span class="hemis-story-label">Talabalar...</span>
        </div>
        <div class="hemis-story-item" onclick="openHemisIdFullScreen()">
          <div class="hemis-story-ring"><div class="hemis-story-circle"><i class="fa-solid fa-qrcode"></i></div></div>
          <span class="hemis-story-label">HEMIS tizim...</span>
        </div>
        <div class="hemis-story-item" onclick="showToast('HEMIS mobil ilovasi yangilandi')">
          <div class="hemis-story-ring"><div class="hemis-story-circle"><i class="fa-solid fa-mobile-screen"></i></div></div>
          <span class="hemis-story-label">HEMIS mob...</span>
        </div>
      </div>

      <!-- Главная карточка пары (Фото 1) -->
      <div class="hemis-current-hero" style="margin-bottom:12px;cursor:pointer" onclick="navigateTo('schedule')">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
          <div style="font-size:10.5px;font-weight:700;letter-spacing:0.4px;opacity:0.9">СЕГОДНЯ · 30-ОКТЯБРЬ, ПЯТНИЦА</div>
          <span style="background:rgba(255,255,255,0.92);color:#1D4ED8;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:800">Сейчас</span>
        </div>
        <div style="font-size:22px;font-weight:800;margin-bottom:10px">Сейчас · 13:00</div>
        
        <div style="background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.18);border-radius:16px;padding:11px 13px;display:flex;justify-content:space-between;align-items:center">
          <div style="display:flex;gap:11px;align-items:center">
            <div style="width:38px;height:38px;border-radius:12px;background:rgba(255,255,255,0.22);display:flex;align-items:center;justify-content:center;font-size:16px">
              <i class="fa-solid fa-book-open"></i>
            </div>
            <div>
              <div style="font-size:13.5px;font-weight:800">Kompyuter tarmoqlari · ...</div>
              <div style="font-size:10.5px;opacity:0.85;margin-top:2px">UMAROV U. U. · 5/111 · 13:00–...</div>
            </div>
          </div>
          <i class="fa-solid fa-chevron-right" style="font-size:12px;opacity:0.8"></i>
        </div>
      </div>

      <!-- Индикатор страниц (точки) -->
      <div style="display:flex;justify-content:center;gap:4px;margin-bottom:12px">
        <span style="width:14px;height:4px;background:#38BDF8;border-radius:2px"></span>
        <span style="width:4px;height:4px;background:rgba(255,255,255,0.3);border-radius:2px"></span>
        <span style="width:4px;height:4px;background:rgba(255,255,255,0.3);border-radius:2px"></span>
        <span style="width:4px;height:4px;background:rgba(255,255,255,0.3);border-radius:2px"></span>
      </div>

      <!-- Две большие карточки (Фото 1) -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px">
        <div class="hemis-glass-card" style="padding:14px;cursor:pointer" onclick="openHemisAttendanceScreen()">
          <div style="width:38px;height:38px;border-radius:12px;background:#0284C7;display:flex;align-items:center;justify-content:center;color:#FFF;margin-bottom:10px">
            <i class="fa-solid fa-qrcode" style="font-size:17px"></i>
          </div>
          <div style="font-size:12.5px;font-weight:800;color:#FFF;line-height:1.2">QR-Посещаем...</div>
          <div style="font-size:10px;color:#94A3B8;margin-top:3px">Отметьте посещае...</div>
        </div>

        <div class="hemis-glass-card" style="padding:14px;cursor:pointer" onclick="showIfiDetailModal()">
          <div style="width:38px;height:38px;border-radius:12px;background:#DB2777;display:flex;align-items:center;justify-content:center;color:#FFF;margin-bottom:10px">
            <i class="fa-solid fa-lightbulb" style="font-size:17px"></i>
          </div>
          <div style="font-size:12.5px;font-weight:800;color:#FFF;line-height:1.2">Социальная а...</div>
          <div style="font-size:10px;color:#94A3B8;margin-top:3px">Заполните свои ба...</div>
        </div>
      </div>

      <!-- 3 карточки второго ряда (Фото 1) -->
      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px">
        <div class="hemis-glass-card" style="padding:10px;text-align:center;cursor:pointer" onclick="showToast('UniLibrary elektron kutubxona')">
          <div style="width:34px;height:34px;border-radius:10px;background:#EF4444;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;color:#FFF">
            <i class="fa-solid fa-book"></i>
          </div>
          <div style="font-size:10.5px;font-weight:800">UniLibrary</div>
        </div>

        <div class="hemis-glass-card" style="padding:10px;text-align:center;cursor:pointer" onclick="showToast('Grant arizalari bo\'limi')">
          <div style="width:34px;height:34px;border-radius:10px;background:#D97706;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;color:#FFF">
            <i class="fa-solid fa-file-contract"></i>
          </div>
          <div style="font-size:10.5px;font-weight:800">Гранд заявки</div>
        </div>

        <div class="hemis-glass-card" style="padding:10px;text-align:center;cursor:pointer" onclick="showToast('Talaba topshiriqlari')">
          <div style="width:34px;height:34px;border-radius:10px;background:#059669;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;color:#FFF">
            <i class="fa-solid fa-list-check"></i>
          </div>
          <div style="font-size:10.5px;font-weight:800">Задания</div>
        </div>
      </div>

    </div>
  `;
}

// PHOTO 5: РАСПИСАНИЕ (SCHEDULE)
function renderHemisExactSchedule() {
  const d = STATE.digitalIdentity;
  const days = [
    { name: 'Пн', num: 26 },
    { name: 'Вт', num: 27 },
    { name: 'Ср', num: 28 },
    { name: 'Чт', num: 29 },
    { name: 'Пт', num: 30, active: true },
    { name: 'Сб', num: 31 },
    { name: 'Вс', num: 1 }
  ];

  return `
    <div style="padding-bottom:76px">
      <!-- Шапка (Фото 5) -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <button class="pro-pill-btn" style="width:38px;height:38px;padding:0;justify-content:center;border-radius:50%" onclick="openHemisProfileDrawer()">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div style="font-size:17px;font-weight:800;color:#FFF">Расписание</div>
        <button class="pro-pill-btn" style="width:38px;height:38px;padding:0;justify-content:center;border-radius:50%" onclick="showToast('Xabarnomalar mavjud emas')">
          <i class="fa-solid fa-bell"></i>
        </button>
      </div>

      <!-- Месяц и кнопка Сегодня (Фото 5) -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <div style="font-size:20px;font-weight:800;color:#FFF">Октябрь 2026 г.</div>
        <button class="pro-pill-btn active" style="font-size:11px;padding:5px 12px;border-radius:18px" onclick="showToast('Bugungi darslar ko\'rsatilmoqda')">
          <i class="fa-solid fa-calendar-check"></i> Сегодня
        </button>
      </div>

      <!-- Лента кружков дней недели (Фото 5) -->
      <div style="display:flex;justify-content:space-between;margin-bottom:12px">
        ${days.map(day => `
          <div style="display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer" onclick="showToast('${day.name} ${day.num}-oktabr darslari')">
            <span style="font-size:10px;color:#94A3B8">${day.name}</span>
            <div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;${day.active ? 'background:#0284C7;color:#FFF;box-shadow:0 0 16px rgba(2,132,199,0.5)' : 'background:rgba(255,255,255,0.06);color:#E2E8F0'}">
              ${day.num}
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:11.5px">
        <span style="color:#94A3B8">Сегодня, 30 октября · 3 зан...</span>
        <span style="color:#38BDF8;font-weight:700;cursor:pointer" onclick="showToast('Oylik jadval ko\'rinishi')">Месячный вид</span>
      </div>

      <!-- Карточки пар (Фото 5) -->
      <!-- Пара 1: Сейчас -->
      <div style="display:flex;gap:12px;margin-bottom:12px">
        <div style="width:48px;font-size:12px;font-weight:800;color:#38BDF8;padding-top:4px">
          13:00<div style="font-size:10px;color:#64748B;font-weight:500">14:20</div>
        </div>
        <div class="hemis-glass-card" style="flex:1;padding:12px 14px;border-left:4px solid #10B981 !important;margin:0">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
            <div style="font-size:14px;font-weight:800;color:#FFF">Kompyuter tarmoqlari</div>
            <span style="background:rgba(16,185,129,0.2);color:#34D399;font-size:9.5px;font-weight:800;padding:2px 7px;border-radius:10px">● Сейчас</span>
          </div>
          <div style="font-size:11px;color:#CBD5E1;margin-bottom:8px">UMAROV U. U.</div>
          <div style="display:flex;gap:8px">
            <span style="background:rgba(255,255,255,0.1);padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700">Лекция</span>
            <span style="background:rgba(255,255,255,0.1);padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700"><i class="fa-solid fa-location-dot"></i> 5/111</span>
          </div>
        </div>
      </div>

      <!-- Пара 2 -->
      <div style="display:flex;gap:12px;margin-bottom:12px">
        <div style="width:48px;font-size:12px;font-weight:800;color:#E2E8F0;padding-top:4px">
          14:30<div style="font-size:10px;color:#64748B;font-weight:500">15:50</div>
        </div>
        <div class="hemis-glass-card" style="flex:1;padding:12px 14px;margin:0">
          <div style="font-size:14px;font-weight:800;color:#FFF;margin-bottom:4px">Chiziqli algebra</div>
          <div style="font-size:11px;color:#CBD5E1;margin-bottom:8px">JABBOROV N. M.</div>
          <div style="display:flex;gap:8px">
            <span style="background:rgba(255,255,255,0.1);padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700">Лекция</span>
            <span style="background:rgba(255,255,255,0.1);padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700"><i class="fa-solid fa-location-dot"></i> 4/7</span>
          </div>
        </div>
      </div>

      <!-- Пара 3 -->
      <div style="display:flex;gap:12px">
        <div style="width:48px;font-size:12px;font-weight:800;color:#E2E8F0;padding-top:4px">
          16:00<div style="font-size:10px;color:#64748B;font-weight:500">17:20</div>
        </div>
        <div class="hemis-glass-card" style="flex:1;padding:12px 14px;margin:0">
          <div style="font-size:14px;font-weight:800;color:#FFF;margin-bottom:4px">Diskret tuzilmalar</div>
          <div style="font-size:11px;color:#CBD5E1;margin-bottom:8px">ABDURAXMANOVA Y. M.</div>
          <div style="display:flex;gap:8px">
            <span style="background:rgba(255,255,255,0.1);padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700">Практика</span>
            <span style="background:rgba(255,255,255,0.1);padding:3px 8px;border-radius:6px;font-size:10px;font-weight:700"><i class="fa-solid fa-location-dot"></i> 5/317</span>
          </div>
        </div>
      </div>

    </div>
  `;
}

// PHOTO 6: HEMIS AI
function renderHemisExactAi() {
  return `
    <div style="padding-bottom:76px">
      <!-- Шапка (Фото 6) -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-size:20px;font-weight:900;color:#FFF;letter-spacing:0.5px">HEMIS AI</div>
        <button class="pro-pill-btn" style="width:36px;height:36px;padding:0;justify-content:center;border-radius:50%" onclick="showToast('HEMIS AI haqida ma\'lumot')">
          <i class="fa-solid fa-circle-info"></i>
        </button>
      </div>

      <!-- Главная AI карточка (Фото 6) -->
      <div class="hemis-glass-card" style="padding:16px;margin-bottom:16px">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
          <div style="display:flex;gap:8px;align-items:center">
            <div style="width:28px;height:28px;border-radius:8px;background:rgba(147,51,234,0.3);color:#C084FC;display:flex;align-items:center;justify-content:center;font-size:13px">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div>
              <div style="font-size:13px;font-weight:800;color:#FFF">AI-итог на сегодня</div>
              <div style="font-size:10px;color:#94A3B8">Расписание</div>
            </div>
          </div>
          <span style="background:rgba(59,130,246,0.25);color:#60A5FA;padding:2px 7px;border-radius:6px;font-size:10px;font-weight:800">Новое</span>
        </div>

        <div style="font-size:12px;color:#CBD5E1;line-height:1.45;margin-bottom:12px">
          Hurmatli talaba, jadvalingizda 4 ta darsli kun bor — bu diqqatni oxirgi darsgacha saqlashni talab qiladi. Maslahat: darslar orasida 5 daqiqa ko'zni dam ol
        </div>

        <div style="display:flex;gap:8px;margin-bottom:12px">
          <div style="flex:1;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:8px">
            <div style="font-size:14px;font-weight:800;color:#34D399">4.00</div>
            <div style="font-size:10px;color:#94A3B8">GPA</div>
          </div>
          <div style="flex:1;background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);border-radius:10px;padding:8px">
            <div style="font-size:14px;font-weight:800;color:#60A5FA">3-semestr</div>
            <div style="font-size:10px;color:#94A3B8">Семестр</div>
          </div>
        </div>

        <button class="pro-pill-btn" style="width:100%;justify-content:center;padding:9px;font-size:12px" onclick="showToast('Tavsiya buferga nusxalandi!')">
          <i class="fa-solid fa-copy"></i> Копировать
        </button>
      </div>

      <!-- Инструменты AI (Фото 6) -->
      <div style="font-size:14px;font-weight:800;color:#FFF;margin-bottom:10px">AI-инструменты</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div class="hemis-glass-card" style="padding:12px;cursor:pointer" onclick="showToast('Shaxsiy o\'quv reja yo\'l xaritasi')">
          <i class="fa-solid fa-map-location-dot" style="font-size:18px;color:#818CF8;margin-bottom:6px"></i>
          <div style="font-size:12.5px;font-weight:800;color:#FFF">Дорожная карта</div>
          <div style="font-size:10px;color:#94A3B8">Личный учебный план</div>
        </div>

        <div class="hemis-glass-card" style="padding:12px;cursor:pointer" onclick="showToast('Semestr umumiy yakunlari')">
          <i class="fa-solid fa-chart-pie" style="font-size:18px;color:#A855F7;margin-bottom:6px"></i>
          <div style="font-size:12.5px;font-weight:800;color:#FFF">Итоги</div>
          <div style="font-size:10px;color:#94A3B8">Общий итог</div>
        </div>

        <div class="hemis-glass-card" style="padding:12px;cursor:pointer" onclick="openHemisTranscriptModal()">
          <i class="fa-solid fa-arrow-trend-up" style="font-size:18px;color:#34D399;margin-bottom:6px"></i>
          <div style="font-size:12.5px;font-weight:800;color:#FFF">Оценки</div>
          <div style="font-size:10px;color:#94A3B8">Оценки и GPA</div>
        </div>

        <div class="hemis-glass-card" style="padding:12px;cursor:pointer" onclick="openHemisAttendanceScreen()">
          <i class="fa-solid fa-clipboard-check" style="font-size:18px;color:#38BDF8;margin-bottom:6px"></i>
          <div style="font-size:12.5px;font-weight:800;color:#FFF">Посещаемость</div>
          <div style="font-size:10px;color:#94A3B8">Пропуски и риски</div>
        </div>
      </div>
    </div>
  `;
}

// PHOTO 7: ПРЕДМЕТЫ (SUBJECTS)
function renderHemisExactSubjects() {
  const list = [
    { title: 'База данных', icon: 'fa-database', color: '#0284C7', desc: 'Обязательные · 180 часов · 6 кре...', status: 'Не начато' },
    { title: 'Chiziqli algebra', icon: 'fa-code', color: '#8B5CF6', desc: 'Обязательные · 180 часов · 6 кре...', status: 'Не начато' },
    { title: 'Diskret tuzilmalar', icon: 'fa-network-wired', color: '#10B981', desc: 'Обязательные · 180 часов · 6 кре...', status: '0/1 задания' },
    { title: 'Elektronika va sxemalar', icon: 'fa-microchip', color: '#F59E0B', desc: 'Обязательные · 180 часов · 6 кре...', status: '0/5 задания' },
    { title: 'Kompyuter tarmoqlari', icon: 'fa-server', color: '#EC4899', desc: 'Обязательные · 180 часов · 6 кре...', status: 'Не начато' }
  ];

  return `
    <div style="padding-bottom:76px">
      <!-- Шапка (Фото 7) -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <button class="pro-pill-btn" style="width:38px;height:38px;padding:0;justify-content:center;border-radius:50%" onclick="openHemisProfileDrawer()">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div style="font-size:17px;font-weight:800;color:#FFF">Предметы</div>
        <button class="pro-pill-btn" style="font-size:11px;padding:5px 12px;border-radius:16px" onclick="showToast('3-semestr tanlangan')">
          3-semestr <i class="fa-solid fa-chevron-down" style="font-size:9px"></i>
        </button>
      </div>

      <div style="font-size:11px;color:#94A3B8;margin-bottom:10px">3-semestr</div>

      <!-- Список предметов (Фото 7) -->
      ${list.map(s => `
        <div class="hemis-glass-card" style="padding:14px;margin-bottom:10px;cursor:pointer" onclick="showToast('Fan ma\'lumotlari: ${esc(s.title)}')">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <div style="display:flex;gap:12px;align-items:center">
              <div style="width:40px;height:40px;border-radius:12px;background:${s.color};color:#FFF;display:flex;align-items:center;justify-content:center;font-size:16px">
                <i class="fa-solid ${s.icon}"></i>
              </div>
              <div>
                <div style="font-size:14px;font-weight:800;color:#FFF">${esc(s.title)}</div>
                <div style="font-size:10.5px;color:#94A3B8;margin-top:2px">${esc(s.desc)}</div>
              </div>
            </div>
            <i class="fa-solid fa-chevron-right" style="font-size:12px;color:#64748B"></i>
          </div>

          <div style="height:4px;background:rgba(255,255,255,0.1);border-radius:2px;overflow:hidden;margin-bottom:6px">
            <div style="height:100%;width:15%;background:#0284C7"></div>
          </div>
          <div style="font-size:9.5px;color:#94A3B8;text-align:right">${esc(s.status)}</div>
        </div>
      `).join('')}

    </div>
  `;
}

// PHOTO 8: ВСЕ СЕРВИСЫ (ALL SERVICES)
function renderHemisExactAllServices() {
  return `
    <div style="padding-bottom:76px">
      <!-- Шапка (Фото 8) -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
        <button class="pro-pill-btn" style="width:38px;height:38px;padding:0;justify-content:center;border-radius:50%" onclick="openHemisProfileDrawer()">
          <i class="fa-solid fa-bars"></i>
        </button>
        <div style="flex:1;margin:0 10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.14);border-radius:20px;padding:8px 12px;display:flex;align-items:center;gap:8px">
          <i class="fa-solid fa-magnifying-glass" style="color:#94A3B8;font-size:12px"></i>
          <input type="text" placeholder="Поиск сервиса или ..." style="background:transparent;border:none;outline:none;color:#FFF;font-size:11.5px;width:100%">
        </div>
      </div>

      <!-- Избранное (Фото 8) -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <div style="font-size:15px;font-weight:800;color:#FFF">Избранное</div>
        <span style="font-size:11.5px;color:#38BDF8;cursor:pointer" onclick="showToast('Tahrirlash rejimi')">Изменить</span>
      </div>

      <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;margin-bottom:16px">
        <div class="hemis-glass-card" style="padding:10px 4px;text-align:center;cursor:pointer" onclick="openHemisAttendanceScreen()">
          <div style="width:38px;height:38px;border-radius:12px;background:#059669;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;color:#FFF">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
          <div style="font-size:10px;font-weight:700">Посещаем...</div>
        </div>

        <div class="hemis-glass-card" style="padding:10px 4px;text-align:center;cursor:pointer" onclick="openHemisTranscriptModal()">
          <div style="width:38px;height:38px;border-radius:12px;background:#0D9488;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;color:#FFF">
            <i class="fa-solid fa-file-lines"></i>
          </div>
          <div style="font-size:10px;font-weight:700">Дневные...</div>
        </div>

        <div class="hemis-glass-card" style="padding:10px 4px;text-align:center;cursor:pointer" onclick="navigateTo('schedule')">
          <div style="width:38px;height:38px;border-radius:12px;background:#2563EB;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;color:#FFF">
            <i class="fa-solid fa-calendar-days"></i>
          </div>
          <div style="font-size:10px;font-weight:700">Расписани...</div>
        </div>

        <div class="hemis-glass-card" style="padding:10px 4px;text-align:center;cursor:pointer" onclick="openHemisFinanceScreen()">
          <div style="width:38px;height:38px;border-radius:12px;background:#10B981;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;color:#FFF">
            <i class="fa-solid fa-money-bill-wave"></i>
          </div>
          <div style="font-size:10px;font-weight:700">Финансов...</div>
        </div>
      </div>

      <!-- Учебный процесс (Фото 8) -->
      <div style="font-size:15px;font-weight:800;color:#FFF;margin-bottom:8px">Учебный процесс</div>
      <div class="hemis-glass-card" style="padding:4px 10px;margin-bottom:14px">
        ${[
          { title: 'Расписание', icon: 'fa-calendar-days', color: '#2563EB', fn: "navigateTo('schedule')" },
          { title: 'Предметы', icon: 'fa-book-open', color: '#7C3AED', fn: "navigateTo('kafedra')" },
          { title: 'Успеваемость', icon: 'fa-graduation-cap', color: '#059669', fn: "openHemisTranscriptModal()" },
          { title: 'Дневные оценки', icon: 'fa-file-signature', color: '#0D9488', fn: "openHemisTranscriptModal()" },
          { title: 'Баллы GPA', icon: 'fa-chart-column', color: '#0284C7', fn: "showGpaDetailModal()" },
          { title: 'Задания', icon: 'fa-list-check', color: '#D97706', fn: "showToast('Topshiriqlar ro\'yxati')" },
          { title: 'Расписание экзаменов', icon: 'fa-envelope-open-text', color: '#EA580C', fn: "showToast('Imtihonlar jadvali')" },
          { title: 'Посещаемость', icon: 'fa-calendar-check', color: '#16A34A', fn: "openHemisAttendanceScreen()" },
          { title: 'Рейтинговая книжка', icon: 'fa-award', color: '#DB2777', fn: "openHemisTranscriptModal()" },
          { title: 'Рейтинг GPA', icon: 'fa-star', color: '#9333EA', fn: "showGpaDetailModal()" }
        ].map(item => `
          <div style="display:flex;align-items:center;gap:12px;padding:9px 4px;border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer" onclick="${item.fn}">
            <div style="width:32px;height:32px;border-radius:8px;background:${item.color};color:#FFF;display:flex;align-items:center;justify-content:center;font-size:13px">
              <i class="fa-solid ${item.icon}"></i>
            </div>
            <div style="font-size:12.5px;font-weight:700;color:#FFF;flex:1">${esc(item.title)}</div>
            <i class="fa-solid fa-chevron-right" style="font-size:10px;color:#64748B"></i>
          </div>
        `).join('')}
      </div>

      <!-- Экосистема & Финансы ТГЭУ -->
      <div style="font-size:15px;font-weight:800;color:#FFF;margin-bottom:8px">Экосистема & Финансы</div>
      <div class="hemis-glass-card" style="padding:4px 10px">
        <div style="display:flex;align-items:center;gap:12px;padding:9px 4px;border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer" onclick="navigateTo('equity')">
          <div style="width:32px;height:32px;border-radius:8px;background:#D4A017;color:#0F172A;display:flex;align-items:center;justify-content:center;font-size:13px"><i class="fa-solid fa-coins"></i></div>
          <div style="font-size:12.5px;font-weight:700;color:#FFF;flex:1">RIAT Equity Bank (285 EQ)</div>
          <i class="fa-solid fa-chevron-right" style="font-size:10px;color:#64748B"></i>
        </div>
        <div style="display:flex;align-items:center;gap:12px;padding:9px 4px;border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer" onclick="navigateTo('qrmerchant')">
          <div style="width:32px;height:32px;border-radius:8px;background:#0D9488;color:#FFF;display:flex;align-items:center;justify-content:center;font-size:13px"><i class="fa-solid fa-store"></i></div>
          <div style="font-size:12.5px;font-weight:700;color:#FFF;flex:1">QR-Касса & Магазины кампуса</div>
          <i class="fa-solid fa-chevron-right" style="font-size:10px;color:#64748B"></i>
        </div>
        <div style="display:flex;align-items:center;gap:12px;padding:9px 4px;cursor:pointer" onclick="openParentPortalModal()">
          <div style="width:32px;height:32px;border-radius:8px;background:#8B5CF6;color:#FFF;display:flex;align-items:center;justify-content:center;font-size:13px"><i class="fa-solid fa-people-roof"></i></div>
          <div style="font-size:12.5px;font-weight:700;color:#FFF;flex:1">Связь с родителями (Ota-Ona Nazorati)</div>
          <i class="fa-solid fa-chevron-right" style="font-size:10px;color:#64748B"></i>
        </div>
      </div>

    </div>
  `;
}

// PHOTO 4: ПОСЕЩАЕМОСТЬ (ATTENDANCE SCREEN)
function openHemisAttendanceScreen() {
  openProModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <div style="font-size:16px;font-weight:800;color:#FFF">Посещаемость — 3-семестр</div>
      <button class="pro-pill-btn" onclick="closeProModal()">✕</button>
    </div>

    <!-- Карточка календаря (Фото 4) -->
    <div class="hemis-glass-card" style="padding:14px;margin-bottom:12px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
        <div style="font-size:16px;font-weight:800;color:#FFF">Октябрь 2026</div>
        <div style="display:flex;gap:4px">
          <button class="pro-pill-btn" style="padding:4px 8px"><i class="fa-solid fa-calendar"></i></button>
          <button class="pro-pill-btn" style="padding:4px 8px"><i class="fa-solid fa-chart-simple"></i></button>
        </div>
      </div>

      <!-- Статистика (Фото 4) -->
      <div style="display:flex;gap:8px;margin-bottom:14px">
        <div style="flex:1;background:rgba(16,185,129,0.18);border:1px solid #10B981;border-radius:10px;padding:6px;text-align:center">
          <div style="font-size:14px;font-weight:800;color:#34D399">82%</div>
          <div style="font-size:9.5px;color:#94A3B8">Итого</div>
        </div>
        <div style="flex:1;background:rgba(245,158,11,0.18);border:1px solid #F59E0B;border-radius:10px;padding:6px;text-align:center">
          <div style="font-size:14px;font-weight:800;color:#FBBF24">0</div>
          <div style="font-size:9.5px;color:#94A3B8">Причина</div>
        </div>
        <div style="flex:1;background:rgba(239,68,68,0.18);border:1px solid #EF4444;border-radius:10px;padding:6px;text-align:center">
          <div style="font-size:14px;font-weight:800;color:#F87171">6</div>
          <div style="font-size:9.5px;color:#94A3B8">Без при...</div>
        </div>
      </div>

      <!-- Сетка календаря 1..31 (Фото 4) -->
      <div style="display:grid;grid-template-columns:repeat(7, 1fr);gap:6px;text-align:center;font-size:11px">
        <span style="color:#94A3B8">По</span><span style="color:#94A3B8">Вт</span><span style="color:#94A3B8">Ср</span><span style="color:#94A3B8">Че</span><span style="color:#94A3B8">Пя</span><span style="color:#94A3B8">Су</span><span style="color:#94A3B8">Во</span>
        
        <span style="opacity:0.3">28</span><span style="opacity:0.3">29</span><span style="opacity:0.3">30</span>
        <span style="padding:6px 0">1</span><span style="padding:6px 0">2</span><span style="padding:6px 0">3</span><span style="padding:6px 0">4</span>
        <span style="padding:6px 0">5</span><span style="padding:6px 0">6</span><span style="padding:6px 0">7</span>
        <span style="background:#EF4444;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">8</span>
        <span style="background:#10B981;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">9</span>
        <span style="padding:6px 0">10</span><span style="padding:6px 0">11</span>

        <span style="background:#10B981;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">12</span>
        <span style="background:#10B981;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">13</span>
        <span style="background:#EF4444;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">14</span>
        <span style="background:#10B981;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">15</span>
        <span style="background:#10B981;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">16</span>
        <span style="padding:6px 0">17</span><span style="padding:6px 0">18</span>

        <span style="background:#10B981;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">19</span>
        <span style="background:#EF4444;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">20</span>
        <span style="background:#10B981;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">21</span>
        <span style="background:#10B981;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">22</span>
        <span style="background:#10B981;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">23</span>
        <span style="padding:6px 0">24</span><span style="padding:6px 0">25</span>

        <span style="background:#10B981;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">26</span>
        <span style="background:#10B981;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">27</span>
        <span style="background:#10B981;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">28</span>
        <span style="background:#10B981;color:#FFF;border-radius:8px;padding:6px 0;font-weight:700">29</span>
        <span style="border:2px solid #38BDF8;color:#FFF;border-radius:8px;padding:4px 0;font-weight:800;background:rgba(56,189,248,0.2)">30</span>
        <span style="padding:6px 0">31</span><span style="opacity:0.3">1</span>
      </div>

      <!-- Легенда (Фото 4) -->
      <div style="display:flex;justify-content:space-between;margin-top:14px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.1);font-size:10px">
        <span style="color:#34D399">● Присутствовал</span>
        <span style="color:#FBBF24">● Причина</span>
        <span style="color:#F87171">● Без причины</span>
        <span style="color:#38BDF8">● Сегодня</span>
      </div>
    </div>
  `);
}

// PHOTO 9: БОКОВОЕ МЕНЮ ПРОФИЛЯ (PROFILE DRAWER)
function openHemisProfileDrawer() {
  const d = STATE.digitalIdentity;
  openProModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <div style="display:flex;gap:12px;align-items:center">
        <div style="position:relative">
          <img src="/${esc(d.photo)}" style="width:48px;height:48px;border-radius:50%;object-fit:cover;border:2px solid #38BDF8" onerror="this.src='/assets/images/faculty_logo.png'">
          <span style="position:absolute;bottom:-2px;right:-2px;background:#2563EB;color:#FFF;font-size:9.5px;font-weight:800;padding:1px 5px;border-radius:8px">4.00</span>
        </div>
        <div>
          <div style="font-size:15px;font-weight:800;color:#FFF">G'ulomov Muham...</div>
          <div style="font-size:11px;color:#94A3B8">AT-31/25r · 2-курс</div>
        </div>
      </div>
      <button class="pro-pill-btn" onclick="closeProModal()">✕</button>
    </div>

    <!-- Контактная карточка (Фото 9) -->
    <div class="hemis-glass-card" style="padding:12px;margin-bottom:12px">
      <div style="font-size:12px;color:#FFF;margin-bottom:6px"><i class="fa-solid fa-phone" style="color:#38BDF8;margin-right:8px"></i> +998940081246</div>
      <div style="font-size:12px;color:#FFF"><i class="fa-solid fa-envelope" style="color:#38BDF8;margin-right:8px"></i> monarch.team.official@gmail.com</div>
    </div>

    <!-- Пункты меню (Фото 9) -->
    <div class="hemis-glass-card" style="padding:4px 10px;margin-bottom:14px">
      <div style="display:flex;align-items:center;gap:12px;padding:10px 4px;border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer" onclick="openHemisIdFullScreen()">
        <i class="fa-solid fa-user" style="color:#38BDF8;width:18px"></i>
        <span style="font-size:12.5px;font-weight:700;flex:1">Профиль</span>
        <i class="fa-solid fa-chevron-right" style="font-size:10px;color:#64748B"></i>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:10px 4px;border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer" onclick="showToast('HEMIS yordam markazi: @TDIU_Support_Bot')">
        <i class="fa-solid fa-comment-dots" style="color:#F59E0B;width:18px"></i>
        <span style="font-size:12.5px;font-weight:700;flex:1">Помощь и связь</span>
        <i class="fa-solid fa-chevron-right" style="font-size:10px;color:#64748B"></i>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:10px 4px;border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer" onclick="showToast('Язык приложения: Русский')">
        <i class="fa-solid fa-globe" style="color:#10B981;width:18px"></i>
        <span style="font-size:12.5px;font-weight:700;flex:1">Язык приложения 🇷🇺</span>
        <i class="fa-solid fa-chevron-right" style="font-size:10px;color:#64748B"></i>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:10px 4px;border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer" onclick="toggleTheme()">
        <i class="fa-solid fa-sun" style="color:#FBBF24;width:18px"></i>
        <span style="font-size:12.5px;font-weight:700;flex:1">Тема приложения</span>
        <span style="background:#2563EB;color:#FFF;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:800">ТЁМНАЯ</span>
      </div>
      <div style="display:flex;align-items:center;gap:12px;padding:10px 4px;cursor:pointer" onclick="navigateTo('settings')">
        <i class="fa-solid fa-gear" style="color:#818CF8;width:18px"></i>
        <span style="font-size:12.5px;font-weight:700;flex:1">Настройки приложения</span>
        <i class="fa-solid fa-chevron-right" style="font-size:10px;color:#64748B"></i>
      </div>
    </div>

    <!-- SOS кнопка экстренной связи (Фото 9) -->
    <div style="background:rgba(220,38,38,0.22);border:1px solid #DC2626;border-radius:14px;padding:12px;display:flex;align-items:center;gap:12px;margin-bottom:12px;cursor:pointer" onclick="showToast('Экстренная связь с охраной кампуса ТГЭУ!')">
      <div style="width:36px;height:36px;border-radius:10px;background:#DC2626;color:#FFF;display:flex;align-items:center;justify-content:center;font-size:16px">
        <i class="fa-solid fa-triangle-exclamation"></i>
      </div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:800;color:#FFF">SOS</div>
        <div style="font-size:10.5px;color:#FCA5A5">Экстренная связь</div>
      </div>
      <i class="fa-solid fa-chevron-right" style="font-size:11px;color:#FCA5A5"></i>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:#64748B;padding:0 4px">
      <span style="color:#EF4444;font-weight:700;cursor:pointer" onclick="showToast('Chiqish bajarildi')"><i class="fa-solid fa-right-from-bracket"></i> Выйти</span>
      <span>v4.4.7</span>
    </div>
  `);
}

// PHOTO 12: ПОЛНОРАЗМЕРНЫЙ СТУДЕНЧЕСКИЙ ID
function openHemisIdFullScreen() {
  const d = STATE.digitalIdentity;
  const qrData = 'MYGOV_TSUE|HEMIS:' + d.hemisId + '|STUDENT_ID:' + d.studentId + '|JSHSHIR:' + d.jshshir + '|GRP:' + d.group;

  openProModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
      <div style="font-size:15px;font-weight:800;color:#FFF">Студенческий ID — удостоверение</div>
      <button class="pro-pill-btn" onclick="closeProModal()">✕</button>
    </div>

    <!-- Студенческий билет HEMIS OTM (Фото 12) -->
    <div class="hemis-student-id-card" style="margin-bottom:14px">
      <div class="hemis-id-header">
        <div style="display:flex;align-items:center;gap:8px">
          <img src="/assets/images/faculty_logo.png" style="width:28px;height:28px;border-radius:50%;background:#FFF;padding:1px">
          <div>
            <div style="font-size:9px;font-weight:800;letter-spacing:0.4px">O‘ZBEKISTON RESPUBLIKASI</div>
            <div style="font-size:10px;font-weight:700">Toshkent Davlat Iqtisodiyot Universiteti</div>
          </div>
        </div>
        <div style="font-size:16px;font-weight:900;background:rgba(255,255,255,0.25);width:26px;height:26px;border-radius:6px;display:flex;align-items:center;justify-content:center">H</div>
      </div>

      <div style="padding:10px 14px 4px 14px;display:flex;justify-content:space-between;align-items:center">
        <b style="font-size:11px;color:#004899;text-transform:uppercase">Студенческий билет</b>
        <span style="font-size:10px;font-weight:800;color:#64748B">№ ${esc(d.studentCardNumber)}</span>
      </div>

      <div class="hemis-id-body">
        <div class="hemis-id-photo-box">
          <img src="/${esc(d.photo)}" class="hemis-id-photo" onerror="this.src='/assets/images/faculty_logo.png'">
          <div class="hemis-id-holo"></div>
        </div>

        <div style="flex:1;font-size:10.5px;color:#334155;line-height:1.35">
          <div style="font-size:9px;color:#64748B;font-weight:700">Ф.И.О.</div>
          <div style="font-size:12px;font-weight:800;color:#0F172A;margin-bottom:4px">${esc(d.fullName)}</div>

          <div style="font-size:9px;color:#64748B;font-weight:700">КУРС · ФОРМА ОБУЧЕНИЯ</div>
          <div style="font-weight:700;color:#0F172A;margin-bottom:4px">2-курс · Бакалавр · Дневная</div>

          <div style="font-size:9px;color:#64748B;font-weight:700">ГРУППА · ДАТА РОЖДЕНИЯ</div>
          <div style="font-weight:800;color:#004899">${esc(d.group)} · ${esc(d.birthDate)}</div>
        </div>
      </div>

      <div style="padding:4px 14px 10px 14px;display:flex;justify-content:space-between;align-items:flex-end">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1px;color:#475569">
          |||| || | ||||| |||| ||<br>
          <span style="font-size:9px">${esc(d.studentCardNumber)} · UZ</span>
        </div>
        <div style="text-align:right">
          <div style="font-size:8.5px;color:#64748B">СРОК ДЕЙСТВИЯ</div>
          <b style="font-size:11px;color:#004899">${esc(d.validYears)}</b>
        </div>
      </div>
    </div>

    <!-- Крупный QR код (Фото 12) -->
    <div class="hemis-glass-card" style="padding:16px;text-align:center">
      <div style="background:#FFFFFF;border-radius:16px;padding:12px;display:inline-block;box-shadow:0 8px 25px rgba(0,0,0,0.25)">
        <div class="qr-box-center" id="hemisModalBigQr" data-qr="${esc(qrData)}" style="width:200px;height:200px"></div>
      </div>

      <div style="font-size:12px;color:#E2E8F0;font-weight:600;margin-top:10px">
        Покажите QR-код проверяющему для сканирования или поднесите к турникету
      </div>
    </div>
  `);
  setTimeout(drawActiveQrCodes, 40);
}

// Hook renderMobAll into routing switch


function openParentPortalModal() {
  const p = STATE.digitalIdentity.parentPortal;
  openProModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid var(--border-color);padding-bottom:12px">
      <div style="display:flex;gap:12px;align-items:center">
        <div style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#06B6D4,#2563EB);color:#FFF;font-size:20px">
          <i class="fa-solid fa-people-roof"></i>
        </div>
        <div>
          <h3 style="font-size:18px;font-weight:800">Портал Родителей · Ota-Ona Nazorati</h3>
          <div style="font-size:12px;color:var(--text-muted)">Связь с родителями, SMS/Telegram уведомления и посещаемость</div>
        </div>
      </div>
      <button class="pro-pill-btn" onclick="closeProModal()">✕</button>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div style="background:var(--bg-elevated);padding:14px;border-radius:12px;border:1px solid var(--border-color)">
        <div style="font-size:11px;color:var(--text-muted);font-weight:700">Отец:</div>
        <div style="font-size:15px;font-weight:800;color:var(--text-main);margin:2px 0">${esc(p.fatherName)}</div>
        <div style="font-size:12px;color:var(--tsue-blue-mid);font-weight:600"><i class="fa-solid fa-phone"></i> ${esc(p.fatherPhone)}</div>
      </div>

      <div style="background:var(--bg-elevated);padding:14px;border-radius:12px;border:1px solid var(--border-color)">
        <div style="font-size:11px;color:var(--text-muted);font-weight:700">Мать:</div>
        <div style="font-size:15px;font-weight:800;color:var(--text-main);margin:2px 0">${esc(p.motherName)}</div>
        <div style="font-size:12px;color:var(--tsue-blue-mid);font-weight:600"><i class="fa-solid fa-phone"></i> ${esc(p.motherPhone)}</div>
      </div>
    </div>

    <div style="background:rgba(6,182,212,0.12);border:1px solid rgba(6,182,212,0.4);border-radius:12px;padding:14px;margin-bottom:16px">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
        <b style="color:var(--text-main);font-size:13px"><i class="fa-brands fa-telegram" style="color:#0088cc"></i> Telegram-бот для родителей (@TDIU_Parent_Bot)</b>
        <span style="background:#047857;color:#FFF;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:800">ПОДКЛЮЧЕНО</span>
      </div>
      <div style="font-size:11.5px;color:var(--text-secondary);line-height:1.4">
        Родители еженедельно получают автоматический отчет: посещаемость занятий (НБ), текущие оценки по 100-балльной шкале, баланс контракта и статус входа/выхода через турникеты кампуса ТГЭУ.
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button class="pro-pill-btn active" style="flex:1;justify-content:center;padding:9px" onclick="showToast('Тестовое SMS-уведомление отправлено на номер родителей!')">
        <i class="fa-solid fa-paper-plane"></i> Отправить отчет родителям сейчас
      </button>
      <button class="pro-pill-btn" style="padding:9px 14px" onclick="closeProModal()">Закрыть</button>
    </div>
  `);
}

function openHemisFinanceModal() {
  const d = STATE.digitalIdentity;
  openProModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid var(--border-color);padding-bottom:12px">
      <div style="display:flex;gap:12px;align-items:center">
        <div style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#10B981,#047857);color:#FFF;font-size:20px">
          <i class="fa-solid fa-coins"></i>
        </div>
        <div>
          <h3 style="font-size:18px;font-weight:800">Финансовый платеж · HEMIS v4.4.7</h3>
          <div style="font-size:12px;color:var(--text-muted)">Мониторинг контракта, общежития (TTJ) и пересдач</div>
        </div>
      </div>
      <button class="pro-pill-btn" onclick="closeProModal()">✕</button>
    </div>

    <div style="background:var(--bg-elevated);border-radius:16px;padding:18px;border:1px solid var(--border-color);margin-bottom:16px">
      <div style="font-size:11px;color:var(--text-muted);font-weight:700">2026-2027 O'QUV YILI · УЧЕБНЫЙ ГОД</div>
      <div style="font-size:28px;font-weight:800;color:var(--text-main);margin:4px 0">9 780 000 сум</div>
      <div style="font-size:12px;color:var(--text-secondary);margin-bottom:14px">Сумма договора на текущий учебный год</div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px">
        <div style="background:rgba(16,185,129,0.12);border:1px solid #10B981;padding:10px;border-radius:10px">
          <div style="font-size:10.5px;color:#047857;font-weight:700">Оплаченная сумма:</div>
          <div style="font-size:15px;font-weight:800;color:#047857">2 445 000 сум (25%)</div>
        </div>
        <div style="background:rgba(239,68,68,0.12);border:1px solid #EF4444;padding:10px;border-radius:10px">
          <div style="font-size:10.5px;color:#B91C1C;font-weight:700">Общая задолженность:</div>
          <div style="font-size:15px;font-weight:800;color:#B91C1C">7 335 000 сум</div>
        </div>
      </div>

      <div style="height:8px;background:var(--border-color);border-radius:4px;overflow:hidden;margin-bottom:10px">
        <div style="height:100%;width:25%;background:#10B981;border-radius:4px"></div>
      </div>
    </div>

    <div style="background:rgba(212,160,23,0.12);border:1px solid var(--tsue-gold);padding:14px;border-radius:12px;margin-bottom:16px">
      <div style="font-weight:800;color:var(--text-main);margin-bottom:4px"><i class="fa-solid fa-landmark"></i> Интеграция с RIAT Equity Bank:</div>
      <div style="font-size:12px;color:var(--text-secondary)">
        Вы можете покрыть оставшиеся 25% контракта со скидкой в 50% баллами Equity (EQ). Текущий баланс студента: <b>${STATE.eqBalance} EQ</b>.
      </div>
    </div>

    <div style="display:flex;gap:8px">
      <button class="pro-pill-btn active" style="flex:1;justify-content:center;padding:9px" onclick="closeProModal();navigateTo('equity')">
        <i class="fa-solid fa-coins"></i> Применить Equity к контракту
      </button>
      <button class="pro-pill-btn" style="padding:9px 14px" onclick="closeProModal()">Закрыть</button>
    </div>
  `);
}


function simulateTurnstileTap() {
  const gates = [
    '2-Bino Asosiy Kirish (Turniket #02)',
    '1-Bino Bosh Korpus (Turniket #01)',
    'Kutubxona & Coworking (Turniket #05)',
    'Sport Majmuasi & Fitnes (Turniket #03)'
  ];
  const chosenGate = gates[Math.floor(Math.random() * gates.length)];
  const now = new Date();
  const timeStr = 'Bugun, ' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2);
  
  STATE.turnstilePassHistory.unshift({
    time: timeStr,
    gate: chosenGate,
    status: 'RUXSAT BERILDI',
    type: 'KIRISH',
    icon: 'fa-arrow-right-to-bracket'
  });
  if (STATE.turnstilePassHistory.length > 8) STATE.turnstilePassHistory.pop();

  renderAll();
  showToast('✓ TURNIKET OCHILDI: ' + chosenGate);
}

function openHemisTranscriptModal() {
  const activeSem = STATE.hemisSemesters[0];
  openProModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid var(--border-color);padding-bottom:12px">
      <div style="display:flex;gap:12px;align-items:center">
        <div style="width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:var(--tsue-navy);color:#FFF;font-size:18px">
          <i class="fa-solid fa-book-bookmark"></i>
        </div>
        <div>
          <h3 style="font-size:18px;font-weight:800">HEMIS OTM · Reyting Daftarchasi & Transkript</h3>
          <div style="font-size:12px;color:var(--text-muted)">Rasmiy baholar reyestri, ECTS kreditlari va o'zlashtirish</div>
        </div>
      </div>
      <button class="pro-pill-btn" onclick="closeProModal()">✕</button>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;margin-bottom:16px">
      <div style="background:var(--bg-elevated);padding:12px;border-radius:10px;border:1px solid var(--border-color);text-align:center">
        <div style="font-size:11px;color:var(--text-muted);font-weight:700">Joriy GPA</div>
        <div style="font-size:24px;font-weight:800;color:#047857">${STATE.gpa}</div>
      </div>
      <div style="background:var(--bg-elevated);padding:12px;border-radius:10px;border:1px solid var(--border-color);text-align:center">
        <div style="font-size:11px;color:var(--text-muted);font-weight:700">Kreditlar jami</div>
        <div style="font-size:24px;font-weight:800;color:var(--tsue-blue-mid)">60 / 60</div>
      </div>
      <div style="background:var(--bg-elevated);padding:12px;border-radius:10px;border:1px solid var(--border-color);text-align:center">
        <div style="font-size:11px;color:var(--text-muted);font-weight:700">Qarzdorlik</div>
        <div style="font-size:24px;font-weight:800;color:#047857">0 fan</div>
      </div>
    </div>

    <div style="font-size:13px;font-weight:800;margin-bottom:8px">Fanlar bo'yicha joriy semestr natijalari:</div>
    <div style="display:flex;flex-direction:column;gap:6px;max-height:280px;overflow-y:auto;padding-right:4px">
      ${activeSem.subjects.map(s => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:var(--bg-elevated);border-radius:8px;border:1px solid var(--border-color);font-size:12px">
          <div>
            <div style="font-weight:700">${esc(s.name)} <span style="font-size:10px;color:var(--text-muted)">(${s.code})</span></div>
            <div style="font-size:10.5px;color:var(--text-secondary)">${s.credit} kredit · O'qituvchi: ${esc(s.teacher)}</div>
          </div>
          <div style="text-align:right">
            <span style="font-size:14px;font-weight:800;color:${s.score >= 90 ? '#047857' : '#1D4ED8'}">${s.score} ball</span>
            <div style="font-size:10.5px;color:var(--text-muted)">Baho: <b>${s.grade}</b></div>
          </div>
        </div>
      `).join('')}
    </div>
  `);
}

/* ==========================================================================
   TSUE SUPERAPP ENGINE — PRODUCTION ARCHITECTURE (БЕЗ САЙДБАРА)
   1. Прямая интеграция с API tsue-digital-economy и tsue.edupage.org (/api/edupage-sync)
   2. Единое расписание недели (без переключения чётная/нечётная - все пары)
   3. 100% паритет функций между Веб-версией и Мобильным приложением:
      - Расписание с фильтрами по курсам, дням (Пн-Сб), поиском по группе/преподавателю/аудитории
      - Электронный журнал посещаемости и НБ (HEMIS/Староста)
      - 5 кафедр и 172 преподавателя с детальными досье
      - Equity: Каталог, шкала скидок на контракт (5%-50%), 18 критериев начислений, штрафы
      - QR-Оплата: Выпуск купонов, кассовый POS-терминал магазина, реестр разрешений Комиссии
      - Telegram Messenger: Папки каналов, чатов, ботов
      - Динамический Цифровой ID по HEMIS, Student ID и JSHSHIR
   ========================================================================== */

const SUPABASE_URL = 'https://qngiieztqecrkywnstom.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuZ2lpZXp0cWVjcmt5d25zdG9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMjQ4OTcsImV4cCI6MjEwNTgwMDg5N30.xogkvq8w0dgYbIt9gzMGE9BLpxxPBSgtge9wQOwmuOk';

let supabaseClient = null;
try {
  if (typeof supabase !== 'undefined' && supabase.createClient) {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    window._supabaseClient = supabaseClient;
  }
} catch (e) {
  console.warn('Supabase init note:', e);
}

const STATE = {
  mode: 'split',
  lang: 'ru',
  dark: false,
  section: 'hub',
  role: 'student',

  // Расписание EduPage (Live Sync)
  schedCourse: 'all',
  schedDayIdx: (function() {
    const d = new Date().getDay();
    return (d >= 1 && d <= 6) ? d - 1 : 0;
  })(),
  schedSearchMode: 'group', // 'group' | 'teacher' | 'room'
  schedQuery: '',
  schedGroup: 'AT 31',
  schedCustomFilter: null, // { type: 'teacher' | 'room', value: '...' }
  schedViewSubTab: 'grid',
  mobGroupSheetOpen: false,
  currentThemePalette: 'hemis',
  liquidGlassEnabled: true,
  dark: true,
  gpa: 4.62,
  contractPaidPct: 75,
  ifiScore: 84.5,
  activeSettingsTab: 'general',
  hemisFaceVerified: true,
  hemisTurnstileStatus: 'READY_TO_TAP',
  turnstilePassHistory: [
    { time: 'Сегодня, 08:24', gate: '2-Bino Asosiy Kirish (Turniket #02)', status: 'RUXSAT BERILDI', type: 'KIRISH', icon: 'fa-arrow-right-to-bracket' },
    { time: 'Kecha, 17:15', gate: '2-Bino Asosiy Kirish (Turniket #01)', status: 'RUXSAT BERILDI', type: 'CHIQISH', icon: 'fa-arrow-right-from-bracket' },
    { time: 'Kecha, 08:31', gate: 'Kutubxona & Coworking (Turniket #05)', status: 'RUXSAT BERILDI', type: 'KIRISH', icon: 'fa-arrow-right-to-bracket' },
    { time: '28 Okt, 16:40', gate: 'Sport Majmuasi & Fitnes (Turniket #03)', status: 'RUXSAT BERILDI', type: 'CHIQISH', icon: 'fa-arrow-right-from-bracket' }
  ],
  hemisSemesters: [
    { sem: '3-semestr (Joriy)', gpa: 4.62, credits: 30, subjects: [
      { name: 'Raqamli iqtisodiyot', code: 'DE201', credit: 6, score: 94, grade: '5', teacher: 'Ilxamova Yo.S.' },
      { name: 'Ma’lumotlar bazasi va SQL', code: 'DB202', credit: 5, score: 91, grade: '5', teacher: 'Yuldashev A.R.' },
      { name: 'Algoritmlar va ma’lumotlar tuzilmasi', code: 'AL203', credit: 5, score: 86, grade: '4', teacher: 'Maxkamova D.D.' },
      { name: 'Ekonometrika asoslari', code: 'EC204', credit: 5, score: 88, grade: '4', teacher: 'Allayarov P.A.' },
      { name: 'Iqtisodiy xavfsizlik', code: 'IS205', credit: 5, score: 92, grade: '5', teacher: 'Xalikov S.S.' },
      { name: 'Xorijiy til (IELTS/CEFR)', code: 'FL206', credit: 4, score: 95, grade: '5', teacher: 'Karimova N.A.' }
    ]},
    { sem: '2-semestr (Tugallangan)', gpa: 4.54, credits: 30, subjects: [
      { name: 'Hisob (Calculus II)', code: 'MC102', credit: 6, score: 90, grade: '5', teacher: 'Muminov B.B.' },
      { name: 'Dasturlash asoslari (Python)', code: 'PR101', credit: 6, score: 93, grade: '5', teacher: 'Sultanov M.B.' },
      { name: 'Iqtisodiyot nazariyasi', code: 'ET101', credit: 6, score: 85, grade: '4', teacher: 'Utanov B.Q.' },
      { name: 'Akademik yozuv', code: 'AW101', credit: 6, score: 89, grade: '4', teacher: 'Abidov A.A.' },
      { name: 'Falsafa va mantiq', code: 'PH101', credit: 6, score: 88, grade: '4', teacher: 'Jo‘rayev G‘.U.' }
    ]}
  ],
  apiSyncStatus: 'OK (108 групп EduPage)',

  // Журнал посещаемости (HEMIS / Староста)
  journalDate: new Date().toISOString().split('T')[0],
  journalPair: '1',
  journalSubject: 'Цифровая экономика',
  journalAttendanceMap: {
    'st_1': { name: 'Алишеров Сардорбек Б.', hemis: '392241101842', hours: 0, todayNb: 0 },
    'st_2': { name: 'Бобоев Жасурбек М.', hemis: '392241101843', hours: 2, todayNb: 2 },
    'st_3': { name: 'Вохидова Мадина Ш.', hemis: '392241101844', hours: 0, todayNb: 0 },
    'st_4': { name: 'Давронов Отабек К.', hemis: '392241101845', hours: 0, todayNb: 0 },
    'st_5': { name: 'Закирова Нилуфар Р.', hemis: '392241101846', hours: 2, todayNb: 2 },
    'st_6': { name: 'Исмоилов Шерзод Ф.', hemis: '392241101847', hours: 0, todayNb: 0 },
    'st_7': { name: 'Каримов Азизжон Х.', hemis: '392241101848', hours: 0, todayNb: 0 },
    'st_8': { name: 'Махмудов Дониёр У.', hemis: '392241101849', hours: 0, todayNb: 0 }
  },

  // Кафедры и преподаватели
  activeDepId: 'dep-raqamli',
  teacherSearch: '',

  // Equity & Низом
  equityTab: 'catalog', // 'catalog' | 'contract' | 'earning' | 'penalties'
  eqBalance: 285,
  eqTotalEarned: 345,
  eqMonthlySpent43_45: 14,
  eqContractSpentYear: 250,

  // QR-Оплата и Аккредитованные Партнёры (Hamkorlar)
  qrTab: 'student_pay', // 'student_pay' | 'merchant_pos' | 'commission_reg'
  selectedMerchantId: 'M-TSUE-01',
  selectedServiceIdx: 0,
  activeCoupons: [
    {
      code: 'EQ-KUP-8841-TSUE',
      merchantId: 'M-TSUE-01',
      merchantName: 'Ошхона ва Буфет ТГЭУ (Корпус 2)',
      itemTitle: 'Комплексный обед в столовой Университета (п. 4.3.4)',
      cost: 20,
      issuedAt: '30.10.2026 09:15',
      expiresAt: '29.11.2026 (30 дней)',
      status: 'ACTIVE'
    }
  ],

  // Динамический Цифровой ID (HEMIS / Student ID / JSHSHIR)
  digitalIdentity: {
    fullName: "G'ulomov Muhammadamin Odiljon o'g'li",
    shortName: 'Muhammadamin',
    studentCardNumber: '324251103654',
    hemisId: '324251103654',
    studentId: 'B32426230996/K',
    jshshir: '52803086100241',
    group: 'AT-31/25r',
    birthDate: '28.03.2008',
    faculty: 'Raqamli iqtisodiyot va axborot texnologiyalari fakulteti',
    specialty: 'Axborot tizimlari va texnologiyalari',
    course: 2,
    educationForm: 'Kunduzgi (Dnevnaya)',
    contractType: "Bazaviy to'lov-shartnoma",
    contractNumber: 'B32426230996/K',
    contractDate: '28.09.2026',
    contractTotal: 9780000,
    contractPaid: 2445000,
    contractDebt: 7335000,
    contractPct: 25,
    phone: '+998940081246',
    email: 'monarch.team.official@gmail.com',
    photo: 'assets/student/muhammadamin.jpg',
    validYears: '2026-2027',
    gpa: 4.00,
    dormitoryContract: {
      status: 'Aktiv',
      room: 'TTJ-3, 402-xona',
      paid: 1200000,
      debt: 0
    },
    parentPortal: {
      fatherName: "G'ulomov Odiljon",
      fatherPhone: '+998901234567',
      motherName: "G'ulomova Umida",
      motherPhone: '+998909876543',
      telegramConnected: true,
      weeklyAttendancePush: true,
      examResultsPush: true
    }
  },

  // Telegram Мессенджер
  tgFolder: 'all',
  tgActiveChatId: 'dekanat'
};

const ROLE_PROFILES = {
  student: {
    name: 'HEMIS: 392241101842 (АТ-31)',
    shortName: 'Студент ТГЭУ (АТ-31)',
    roleLabel: 'Студент · 2 курс · Контракт',
    hemisId: '392241101842',
    studentId: 'TDIU-RIAT-2025-0842',
    jshshir: '51408056710029',
    fullName: 'Алишеров Сардорбек Бахтиёр угли',
    group: 'АТ-31/25r'
  },
  teacher: {
    name: 'Проф. Илхамова Ё.С. (Зав. каф.)',
    shortName: 'Проф. Илхамова Ё.С.',
    roleLabel: 'Зав. кафедрой Цифровой экономики, проф.',
    hemisId: '101984002190',
    studentId: 'PPS-RAQAMLI-001',
    jshshir: '42105740910044',
    fullName: 'Ilxamova Yodgorxon Saidaxmedovna',
    group: 'Кафедра РИ'
  },
  merchant: {
    name: 'Касса Hamkor: TSUE Book & Coffee',
    shortName: 'Касса Hamkor POS',
    roleLabel: 'Аккредитованный партнёр Комиссии Equity',
    hemisId: 'MERCHANT-POS-02',
    studentId: 'HAMKOR-2026-002',
    jshshir: '30981142000188',
    fullName: 'Оператор кассы: TSUE Book & Coffee',
    group: 'TSUE Campus Shop'
  },
  commission: {
    name: 'Комиссия Equity: Акбаров Н.Г.',
    shortName: 'Акбаров Н.Г. (Деканат)',
    roleLabel: 'Член Комиссии Equity (п. 8.1 Низома)',
    hemisId: '100001000209',
    studentId: 'DEAN-RIAT-001',
    jshshir: '31109821000012',
    fullName: 'Акбаров Нодир Гафурович',
    group: 'Деканат РИат'
  }
};

const SCHED_DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const SCHED_DAYS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
const SCHED_SLOTS = [
  '08:00–09:20', '09:30–10:50', '11:00–12:20',
  '13:00–14:20', '14:30–15:50', '16:00–17:20',
  '17:30–18:50', '19:00–20:20'
];

// Низом Equity
const EQUITY_NIZOM = {
  earningRules: [
    { id: 1, title: 'Зачисление в Университет (1 курс бакалавриата или магистратуры)', points: '+100 EQ', period: 'Единоразово, автоматически в течение 5 раб. дней (п. 3.1, 3.4)' },
    { id: 2, title: 'Средний балл за семестр от 4,50 до 4,79 (без академической задолженности)', points: '+25 EQ', period: 'За каждый семестр' },
    { id: 3, title: 'Средний балл за семестр 4,80 и выше (без академической задолженности)', points: '+40 EQ', period: 'За каждый семестр' },
    { id: 4, title: '100% посещаемость занятий в течение календарного месяца', points: '+4 EQ', period: 'Ежемесячно' },
    { id: 5, title: 'Университетская олимпиада, кейс-чемпионат, конкурс (призёр / участник)', points: '+15 / +8 EQ', period: 'За каждое мероприятие' },
    { id: 6, title: 'Республиканская олимпиада или конкурс (1 / 2 / 3 место)', points: '+65 / +50 / +30 EQ', period: 'За каждое мероприятие' },
    { id: 7, title: 'Международная олимпиада или конкурс (1 / 2 / 3 место)', points: '+120 / +100 / +65 EQ', period: 'За каждое мероприятие' },
    { id: 8, title: 'Тезисы доклада на научной конференции', points: '+12 EQ', period: 'За каждую публикацию' },
    { id: 9, title: 'Статья в национальном рецензируемом научном журнале (ВАК)', points: '+30 EQ', period: 'За каждую статью' },
    { id: 10, title: 'Статья в международном журнале Scopus или Web of Science', points: '+80 EQ', period: 'За каждую статью' },
    { id: 11, title: 'Международный сертификат IELTS 7.0+ или CEFR C1+', points: '+40 EQ', period: 'Единоразово за сертификат' },
    { id: 12, title: 'Международный сертификат IELTS 6.5 или CEFR B2', points: '+25 EQ', period: 'Единоразово за сертификат' },
    { id: 13, title: 'Волонтёрская и общественная работа (Союз молодёжи)', points: '+1 EQ / 4 часа', period: 'Не более 25 EQ за семестр' },
    { id: 14, title: 'Наставничество над студентами 1 курса (студент-тьютор)', points: '+12 EQ', period: 'За каждый семестр' },
    { id: 15, title: 'Работа в Студенческом совете или старостой учебной группы', points: '+8 EQ', period: 'За каждый семестр' },
    { id: 16, title: 'Защищённый перед Комиссией студенческий проект или стартап', points: '+10 ... +80 EQ', period: 'По оценке Комиссии' },
    { id: 17, title: 'Стажировка у Партнёра (мин. 4 недели с положительной характеристикой)', points: '+20 EQ', period: 'За каждую стажировку' },
    { id: 18, title: 'Победа в спортивных/творческих соревнованиях (ВУЗ / Респ. / Междунар.)', points: '+8 / +30 / +80 EQ', period: 'За каждое соревнование' }
  ],
  contractScale: [
    { eq: 100, discount: 5 },
    { eq: 250, discount: 10 },
    { eq: 500, discount: 15 },
    { eq: 1000, discount: 20 },
    { eq: 1500, discount: 25 },
    { eq: 2000, discount: 30 },
    { eq: 3000, discount: 40 },
    { eq: 5000, discount: 50 }
  ],
  catalogItems: [
    { id: 'cat-42-1', sec: '4.2 Учёба', title: 'Оплата платного пересдачи предмета (Retake)', cost: 1000, limit: 'До 2 раз в семестр', merchantId: 'M-TSUE-EDU', countsMonthly60: false },
    { id: 'cat-42-2', sec: '4.2 Учёба', title: 'Курс подготовки к IELTS / CEFR в Языковом центре ТГЭУ (8 недель)', cost: 50, limit: 'Приоритетная запись', merchantId: 'M-TSUE-EDU', countsMonthly60: false },
    { id: 'cat-42-3', sec: '4.2 Учёба', title: 'Курс цифровых навыков: Excel & Power BI, Python, 1C, МСФО', cost: 30, limit: 'По расписанию ВУЗа', merchantId: 'M-TSUE-EDU', countsMonthly60: false },
    { id: 'cat-42-4', sec: '4.2 Учёба', title: 'Доступ к Coursera / Udemy на 3 месяца', cost: 25, limit: 'По квоте соглашения', merchantId: 'M-TSUE-EDU', countsMonthly60: false },
    { id: 'cat-42-5', sec: '4.2 Учёба', title: 'Компенсация 50% взноса за экзамен IELTS / TOEFL / ACCA', cost: 60, limit: '1 раз в учебный год', merchantId: 'M-TSUE-EDU', countsMonthly60: false },
    { id: 'cat-42-6', sec: '4.2 Учёба', title: 'Бронь коворкинга и переговорной комнаты ТГЭУ (4 часа)', cost: 1, limit: 'Онлайн через платформу', merchantId: 'M-TSUE-COWORK', countsMonthly60: false },
    { id: 'cat-42-7', sec: '4.2 Учёба', title: 'Подписка на LinkedIn Premium и ИИ-сервисы от Университета', cost: 150, limit: 'Заявка через Ecosystem', merchantId: 'M-TSUE-EDU', countsMonthly60: false },
    { id: 'cat-43-1', sec: '4.3 Питание', title: 'Скидка 10% в столовой Университета на календарный месяц', cost: 30, limit: 'Весь ассортимент', merchantId: 'M-TSUE-01', countsMonthly60: true },
    { id: 'cat-43-3', sec: '4.3 Питание', title: 'Скидка 30% в столовой Университета на календарный месяц (Макс)', cost: 100, limit: 'Не суммируется', merchantId: 'M-TSUE-01', countsMonthly60: true },
    { id: 'cat-43-4', sec: '4.3 Питание', title: 'Купон на комплексный обед в столовой Университета', cost: 20, limit: 'До 20 купонов в месяц', merchantId: 'M-TSUE-01', countsMonthly60: true },
    { id: 'cat-43-5', sec: '4.3 Питание', title: 'Купон на чай/кофе и выпечку в буфете ТГЭУ', cost: 1, limit: 'До 20 купонов в месяц', merchantId: 'M-TSUE-01', countsMonthly60: true },
    { id: 'cat-43-6', sec: '4.3 Питание (Hamkor)', title: 'Купон на комбо-набор в партнёрской сети фастфуда', cost: 3, limit: 'До 8 купонов/мес · 30 дней', merchantId: 'M-HAMKOR-FOOD', countsMonthly60: true },
    { id: 'cat-43-7', sec: '4.3 Питание (Hamkor)', title: 'Купон на лаваш, бургер или пиццу у Партнёра', cost: 2, limit: 'До 8 купонов/мес · 30 дней', merchantId: 'M-HAMKOR-FOOD', countsMonthly60: true },
    { id: 'cat-43-8', sec: '4.3 Питание (Hamkor)', title: 'Купон на напиток в партнёрской кофейне', cost: 2, limit: 'До 8 купонов/мес · 30 дней', merchantId: 'M-HAMKOR-COFFEE', countsMonthly60: true },
    { id: 'cat-44-1', sec: '4.4 Быт и Спорт', title: 'Скидка 10% на оплату общежития (ТТЖ) за семестр', cost: 8, limit: 'Для проживающих в ТТЖ', merchantId: 'M-TSUE-TTJ', countsMonthly60: true },
    { id: 'cat-44-2', sec: '4.4 Быт и Спорт', title: 'Скидка 20% на оплату общежития (ТТЖ) за семестр (Макс)', cost: 15, limit: 'Скидки не суммируются', merchantId: 'M-TSUE-TTJ', countsMonthly60: true },
    { id: 'cat-44-3', sec: '4.4 Быт и Спорт', title: 'Пополнение транспортной карты ATTO на 30 поездок', cost: 4, limit: 'До 2 раз в месяц', merchantId: 'M-HAMKOR-TELECOM', countsMonthly60: true },
    { id: 'cat-44-4', sec: '4.4 Быт и Спорт', title: 'Мобильный интернет-пакет 20 ГБ на 30 дней (Оператор-Партнёр)', cost: 4, limit: '1 раз в месяц', merchantId: 'M-HAMKOR-TELECOM', countsMonthly60: true },
    { id: 'cat-44-5', sec: '4.4 Быт и Спорт', title: 'Печать и копирование в Копи-центре ТГЭУ (30 стр. А4)', cost: 1, limit: 'Без ограничений', merchantId: 'M-TSUE-COPY', countsMonthly60: true },
    { id: 'cat-44-6', sec: '4.4 Быт и Спорт', title: 'Абонемент в спортзал Университета на календарный месяц', cost: 8, limit: 'Справка не требуется', merchantId: 'M-TSUE-SPORT', countsMonthly60: true },
    { id: 'cat-45-4', sec: '4.5 Мерч TSUE', title: 'Фирменный брендированный блокнот и ручка TSUE', cost: 3, limit: 'В наличии в TSUE Shop', merchantId: 'M-TSUE-SHOP', countsMonthly60: true },
    { id: 'cat-45-5', sec: '4.5 Мерч TSUE', title: 'Фирменная брендированная футболка TSUE', cost: 12, limit: 'В наличии в TSUE Shop', merchantId: 'M-TSUE-SHOP', countsMonthly60: true },
    { id: 'cat-45-6', sec: '4.5 Мерч TSUE', title: 'Фирменное брендированное худи TSUE', cost: 30, limit: 'Не более 1 шт. в уч. год', merchantId: 'M-TSUE-SHOP', countsMonthly60: true },
    { id: 'cat-45-7', sec: '4.5 Мерч TSUE', title: 'Фирменный брендированный термос TSUE', cost: 10, limit: 'В наличии в TSUE Shop', merchantId: 'M-TSUE-SHOP', countsMonthly60: true },
    { id: 'cat-46-1', sec: '4.6 Карьера', title: 'Приоритетная запись на стажировку в Банк / Аудит / Министерство', cost: 25, limit: 'До 2 раз в учебный год', merchantId: 'M-TSUE-CAREER', countsMonthly60: false },
    { id: 'cat-46-2', sec: '4.6 Карьера', title: 'Индивидуальная менторская сессия с практиком (60 мин)', cost: 10, limit: 'По предварительной записи', merchantId: 'M-TSUE-CAREER', countsMonthly60: false }
  ],
  penalties: [
    { id: 1, rule: 'Систематические пропуски занятий без уважительной причины (>10 ак. часов в месяц)', penalty: '-10 EQ', note: 'По рапортичке деканата' },
    { id: 2, rule: 'Грубое нарушение Правил внутреннего распорядка или Кодекса этики студента', penalty: '-20 ... -50 EQ', note: 'По решению Комиссии' },
    { id: 3, rule: 'Порча имущества Университета или студенческого общежития (ТТЖ)', penalty: '-20 EQ + возмещение', note: 'По акту коменданта' },
    { id: 4, rule: 'Нарушение академической честности: списывание, плагиат, чужие работы', penalty: '-50 ... -100 EQ', note: '+ аннулирование баллов за работу' },
    { id: 5, rule: 'Попытка продать или передать Equity другому лицу, чужой аккаунт, подделка QR-купона', penalty: '-50 EQ / Блок на семестр', note: 'Строгий запрет P2P-переводов (п. 6.4)' },
    { id: 6, rule: 'Подделка подтверждающих документов для получения Equity', penalty: 'Обнуление баланса (0 EQ)', note: 'Полное списание всех баллов' },
    { id: 7, rule: 'Предложение или передача денег, подарков или услуг за начисление Equity', penalty: 'Обнуление + передача органам', note: 'Антикоррупционный протокол' }
  ]
};

const ACCREDITED_MERCHANTS = [
  {
    merchantId: 'M-TSUE-01',
    name: 'Столовая и Буфет ТГЭУ (Корпус 2)',
    category: 'Питание Университета (п. 4.3)',
    inn: '201122914',
    commissionOrder: 'Приказ Ректора №14-EQ от 05.09.2026',
    status: 'VERIFIED',
    allowedServices: [
      { title: 'Комплексный обед в столовой (п. 4.3.4)', cost: 20 },
      { title: 'Чай/кофе и выпечка в буфете (п. 4.3.5)', cost: 1 },
      { title: 'Месячный абонемент 10% скидки (п. 4.3.1)', cost: 30 }
    ]
  },
  {
    merchantId: 'M-HAMKOR-COFFEE',
    name: 'TSUE Book & Coffee (Партнёрская кофейня)',
    category: 'Аккредитованный Партнёр · Кофейня (п. 4.3.8)',
    inn: '309811420',
    commissionOrder: 'Соглашение Комиссии №08-H от 12.09.2026',
    status: 'VERIFIED',
    allowedServices: [
      { title: 'Купон на напиток в кофейне-партнёре (п. 4.3.8)', cost: 2 },
      { title: 'Кофе + круассан по студенческому купону', cost: 2 }
    ]
  },
  {
    merchantId: 'M-HAMKOR-FOOD',
    name: 'EVOS / Oqtepa Lavash · Кампус-партнёр ТГЭУ',
    category: 'Сеть быстрого питания · Hamkor (п. 4.3.6–4.3.7)',
    inn: '304551902',
    commissionOrder: 'Соглашение Комиссии №11-H от 15.09.2026',
    status: 'VERIFIED',
    allowedServices: [
      { title: 'Комбо-набор в партнёрской сети (п. 4.3.6)', cost: 3 },
      { title: 'Лаваш, бургер или пицца у Партнёра (п. 4.3.7)', cost: 2 }
    ]
  },
  {
    merchantId: 'M-TSUE-COPY',
    name: 'Копи-центр и Полиграфия ТГЭУ (Корпус 1)',
    category: 'Услуги кампуса (п. 4.4.5)',
    inn: '201122914',
    commissionOrder: 'Приказ Ректора №14-EQ от 05.09.2026',
    status: 'VERIFIED',
    allowedServices: [
      { title: 'Печать и копирование 30 стр. А4 (п. 4.4.5)', cost: 1 }
    ]
  },
  {
    merchantId: 'M-TSUE-SHOP',
    name: 'TSUE Brand Store (Официальный мерч)',
    category: 'Брендированная продукция (п. 4.5)',
    inn: '201122914',
    commissionOrder: 'Приказ Ректора №14-EQ от 05.09.2026',
    status: 'VERIFIED',
    allowedServices: [
      { title: 'Брендированный блокнот и ручка TSUE (п. 4.5.4)', cost: 3 },
      { title: 'Брендированный термос TSUE (п. 4.5.7)', cost: 10 },
      { title: 'Брендированная футболка TSUE (п. 4.5.5)', cost: 12 },
      { title: 'Брендированное худи TSUE (п. 4.5.6)', cost: 30 }
    ]
  },
  {
    merchantId: 'M-HAMKOR-TELECOM',
    name: 'Uztelecom / Ucell & ATTO · Цифровой шлюз',
    category: 'Связь и Транспорт (п. 4.4.3–4.4.4)',
    inn: '200834119',
    commissionOrder: 'Соглашение Комиссии №19-H от 20.09.2026',
    status: 'VERIFIED',
    allowedServices: [
      { title: 'Пополнение карты транспорта на 30 поездок (п. 4.4.3)', cost: 4 },
      { title: 'Мобильный интернет-пакет 20 ГБ на 30 дней (п. 4.4.4)', cost: 4 }
    ]
  }
];


const TG_CHATS = [
  {
    id: 'c-dean',
    folder: 'channels',
    title: 'Деканат Цифровой Экономики (TDIU)',
    official: true,
    verified: true,
    avatarColor: '#003B81',
    avatarLetter: 'ДЦ',
    subtitle: '1 480 подписчиков · Официальный канал',
    unread: 2,
    online: true,
    pinned: true,
    messages: [
      { id: 'm1', text: 'Уважаемые студенты и старосты! Расписание занятий на следующую неделю синхронизировано через EduPage API. Просьба сверить аудитории.', time: '08:45', out: false, sender: 'Деканат TDIU' },
      { id: 'm2', text: 'Напоминаем, что подача подтверждающих документов по критериям Ijtimoiy Faollik (IFI) открыта до конца месяца через кабинет UniverLife.', time: '11:20', out: false, sender: 'Деканат TDIU' }
    ]
  },
  {
    id: 'c-group-at31',
    folder: 'groups',
    title: 'Академическая группа АТ-31/25r',
    official: false,
    verified: false,
    avatarColor: '#10B981',
    avatarLetter: 'АТ',
    subtitle: '28 участников · 6 онлайн',
    unread: 5,
    online: true,
    pinned: true,
    messages: [
      { id: 'm10', text: 'Кто взял методички по «Цифровой экономике» из библиотеки?', time: '09:05', out: false, sender: 'Шахзод (Староста)' },
      { id: 'm11', text: 'Я скинул PDF-версию в документы группы, можете скачивать.', time: '09:12', out: true, sender: 'Вы' },
      { id: 'm12', text: 'Спасибо! Сегодня вторая пара в 204 аудитории у доцента Ильхамовой.', time: '09:15', out: false, sender: 'Мадина' }
    ]
  },
  {
    id: 'c-bot-equity',
    folder: 'bots',
    title: 'RIAT Equity Treasury Bot',
    official: true,
    verified: true,
    avatarColor: '#D4A017',
    avatarLetter: 'EQ',
    subtitle: 'Бот · Университетское казначейство EQ',
    unread: 0,
    online: true,
    pinned: false,
    messages: [
      { id: 'm20', text: '✅ На ваш персональный счет начислено +350.00 EQ по критерию 1.1 (Публикация в журнале ВАК). Квитанция #TX-9042 сформирована.', time: 'Вчера', out: false, sender: 'Equity Bot' },
      { id: 'm21', text: '💳 Баланс: 285.00 EQ. Доступна скидка на контракт 25% при накоплении 400 EQ.', time: 'Вчера', out: false, sender: 'Equity Bot' }
    ]
  },
  {
    id: 'c-tutor-nodir',
    folder: 'personal',
    title: 'Тьютор курса: Рахимов Нодир А.',
    official: true,
    verified: false,
    avatarColor: '#6366F1',
    avatarLetter: 'НР',
    subtitle: 'был(а) недавно · Тьютор 1-2 курсов',
    unread: 0,
    online: false,
    pinned: false,
    messages: [
      { id: 'm30', text: 'Сардорбек, здравствуйте! Проверьте, пожалуйста, отметки посещаемости в журнале HEMIS за прошлую среду.', time: '28 Окт', out: false, sender: 'Рахимов Н.А.' },
      { id: 'm31', text: 'Здравствуйте, Нодир ака! Всё сверили со старостой, уважительные справки прикреплены.', time: '28 Окт', out: true, sender: 'Вы' }
    ]
  },
  {
    id: 'c-kafedra-raqamli',
    folder: 'channels',
    title: 'Кафедра «Цифровая экономика»',
    official: true,
    verified: true,
    avatarColor: '#004899',
    avatarLetter: 'ЦЭ',
    subtitle: '50 преподавателей · Официальный канал',
    unread: 0,
    online: true,
    pinned: false,
    messages: [
      { id: 'm40', text: 'График предзащиты дипломных и курсовых работ утвержден на Ученом Совете. Ознакомиться можно на доске объявлений 2-го корпуса.', time: '27 Окт', out: false, sender: 'Кафедра' }
    ]
  }
];


function esc(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function showToast(msg) {
  const el = document.getElementById('proToast');
  const txt = document.getElementById('proToastText');
  if (!el || !txt) return;
  txt.textContent = msg;
  el.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

function closeProModal() {
  const bd = document.getElementById('proModalBackdrop');
  if (bd) bd.style.display = 'none';
}

function openProModal(html) {
  const bd = document.getElementById('proModalBackdrop');
  const cnt = document.getElementById('proModalContent');
  if (!bd || !cnt) return;
  cnt.innerHTML = html;
  bd.style.display = 'flex';
}

function setStudioMode(mode) {
  STATE.mode = mode;
  const stage = document.getElementById('studioStage');
  if (stage) stage.className = `studio-stage mode-${mode}`;
  document.querySelectorAll('.studio-mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });
}

function toggleTheme() {
  STATE.dark = !STATE.dark;
  document.body.classList.toggle('dark-mode', STATE.dark);
  const ic = document.getElementById('studioThemeIcon');
  if (ic) ic.className = STATE.dark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

function setLang(lang) {
  STATE.lang = lang;
  document.querySelectorAll('.studio-lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  showToast(`Язык переключён: ${lang.toUpperCase()}`);
}

function setRole(roleKey) {
  STATE.role = roleKey;
  const prof = ROLE_PROFILES[roleKey] || ROLE_PROFILES.student;
  STATE.digitalIdentity.fullName = prof.fullName;
  STATE.digitalIdentity.hemisId = prof.hemisId;
  STATE.digitalIdentity.studentId = prof.studentId;
  STATE.digitalIdentity.jshshir = prof.jshshir;
  STATE.digitalIdentity.group = prof.group || 'АТ-31/25r';

  if (roleKey === 'merchant') {
    STATE.qrTab = 'merchant_pos';
    navigateTo('qrmerchant');
  } else if (roleKey === 'commission') {
    STATE.qrTab = 'commission_reg';
    navigateTo('qrmerchant');
  } else {
    renderAll();
  }
  showToast(`Активный профиль SSO: ${prof.shortName}`);
}

function navigateTo(section) {
  STATE.section = section;
  document.querySelectorAll('.launcher-tile').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.sec === section);
  });
  document.querySelectorAll('.hemis-dock-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === section);
  });
  renderAll();
}

// ==========================================================================
// API СИНХРОНИЗАЦИЯ РАСПИСАНИЯ С TSUE-DIGITAL-ECONOMY / TSUE.EDUPAGE.ORG
// ==========================================================================

async function syncScheduleFromApi() {
  showToast('Синхронизация с API расписания EduPage...');
  try {
    const res = await fetch('/api/edupage-sync');
    const json = await res.json();
    if (json.ok && json.schedule) {
      window.EDUPAGE_SCHEDULE_DATA = json.schedule;
      STATE.apiSyncStatus = `Live API (${json.groupsCount} групп)`;
      const badge = document.getElementById('mobApiStatusBadge');
      if (badge) badge.textContent = `EduPage: ${json.groupsCount} гр.`;
      showToast(`Расписание обновлено: ${json.groupsCount} групп (${json.source})`);
      renderAll();
    }
  } catch (err) {
    console.warn('API sync warning, using local cache:', err);
    showToast('Используется кэш расписания EduPage');
  }
}

// Единый поиск для ПК и мобильного
function searchOmniCommon(q) {
  const clean = (q || '').trim().toLowerCase();
  if (!clean) return [];

  const hits = [];
  const groups = Object.keys(window.EDUPAGE_SCHEDULE_DATA || {});
  groups.forEach(g => {
    if (g.toLowerCase().includes(clean)) {
      hits.push({
        icon: 'fa-users-rectangle',
        title: `Группа ${g}`,
        tag: 'Расписание',
        action: `selectOmniGroup('${esc(g)}')`
      });
    }
  });

  const teachers = (window.TSUE_KAFEDRA_DATA && window.TSUE_KAFEDRA_DATA.teachers) || [];
  teachers.forEach(t => {
    if (t.fullName.toLowerCase().includes(clean) || (t.depName && t.depName.toLowerCase().includes(clean))) {
      hits.push({
        icon: 'fa-chalkboard-user',
        title: `${t.fullName} (${t.position})`,
        tag: t.depName.split(' ')[0],
        action: `openTeacherProfileModal('${esc(t.id)}')`
      });
    }
  });

  EQUITY_NIZOM.catalogItems.forEach(item => {
    if (item.title.toLowerCase().includes(clean)) {
      hits.push({
        icon: 'fa-coins',
        title: `${item.title} (${item.cost} EQ)`,
        tag: item.sec,
        action: `navigateTo('equity')`
      });
    }
  });

  return hits.slice(0, 10);
}

function onGlobalOmniSearch(val) {
  const drop = document.getElementById('globalOmniDropdown');
  if (!drop) return;
  const hits = searchOmniCommon(val);
  if (!val.trim()) { drop.style.display = 'none'; return; }
  if (hits.length === 0) {
    drop.innerHTML = `<div style="padding:10px;font-size:12px;color:var(--text-muted)">Ничего не найдено</div>`;
    drop.style.display = 'block';
    return;
  }
  drop.innerHTML = hits.map(h => `
    <div class="omni-item" onclick="${h.action}; document.getElementById('globalOmniDropdown').style.display='none'">
      <div style="display:flex;align-items:center;gap:8px">
        <i class="fa-solid ${h.icon}" style="color:var(--tsue-blue-mid)"></i>
        <b>${esc(h.title)}</b>
      </div>
      <span style="font-size:10.5px;color:var(--text-muted)">${esc(h.tag)}</span>
    </div>
  `).join('');
  drop.style.display = 'block';
}

function onMobOmniSearch(val) {
  const drop = document.getElementById('mobOmniDropdown');
  if (!drop) return;
  const hits = searchOmniCommon(val);
  if (!val.trim()) { drop.style.display = 'none'; return; }
  if (hits.length === 0) {
    drop.innerHTML = `<div style="padding:8px;font-size:11px;color:var(--text-muted)">Ничего не найдено</div>`;
    drop.style.display = 'block';
    return;
  }
  drop.innerHTML = hits.map(h => `
    <div class="omni-item" onclick="${h.action}; document.getElementById('mobOmniDropdown').style.display='none'">
      <div style="display:flex;align-items:center;gap:6px;font-size:11.5px">
        <i class="fa-solid ${h.icon}" style="color:var(--tsue-blue-mid)"></i>
        <b>${esc(h.title)}</b>
      </div>
    </div>
  `).join('');
  drop.style.display = 'block';
}

function selectOmniGroup(g) {
  STATE.schedGroup = g;
  STATE.schedCustomFilter = null;
  navigateTo('schedule');
}

// ==========================================================================
// ЛОГИКА ЕДИНОГО РАСПИСАНИЯ (БЕЗ ЧЁТ/НЕЧЁТ — ПОЛНОЕ РАСПИСАНИЕ НЕДЕЛИ)
// ==========================================================================

function getFilteredGroups() {
  const data = window.EDUPAGE_SCHEDULE_DATA || {};
  let groups = Object.keys(data);
  if (STATE.schedCourse !== 'all') {
    const cNum = parseInt(STATE.schedCourse, 10);
    groups = groups.filter(g => {
      const item = data[g];
      if (item && item.course === cNum) return true;
      if (cNum === 1 && (g.includes('1') || g.includes('/26'))) return true;
      if (cNum === 2 && (g.includes('2') || g.includes('31') || g.includes('/25'))) return true;
      if (cNum === 3 && (g.includes('3') || g.includes('/24'))) return true;
      if (cNum === 4 && (g.includes('4') || g.includes('/23'))) return true;
      return false;
    });
  }
  groups.sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }));
  return groups;
}

// Извлекает пару без разделения на чётную/нечётную: если есть в odd или even - отображается
function getLessonCellUnified(dayIdx, slotIdx, groupOverride) {
  const data = window.EDUPAGE_SCHEDULE_DATA || {};
  const gName = groupOverride || STATE.schedGroup;

  if (STATE.schedCustomFilter) {
    for (const gKey of Object.keys(data)) {
      const gObj = data[gKey];
      const l = gObj?.odd?.[dayIdx]?.[slotIdx] || gObj?.even?.[dayIdx]?.[slotIdx];
      if (l) {
        if (STATE.schedCustomFilter.type === 'teacher' && l.teacher === STATE.schedCustomFilter.value) {
          return { ...l, subject: `${l.subject} (${gKey})` };
        }
        if (STATE.schedCustomFilter.type === 'room' && l.room === STATE.schedCustomFilter.value) {
          return { ...l, subject: `${l.subject} (${gKey})` };
        }
      }
    }
    return null;
  }

  const grp = data[gName];
  if (!grp) return null;
  return grp.odd?.[dayIdx]?.[slotIdx] || grp.even?.[dayIdx]?.[slotIdx] || null;
}

function updateHeaders() {
  const prof = ROLE_PROFILES[STATE.role] || ROLE_PROFILES.student;
  const webName = document.getElementById('webUserName');
  const mobName = document.getElementById('mobUserName');
  const mobRole = document.getElementById('mobUserRole');
  const webEq = document.getElementById('webHeaderEqBalance');
  const mobEq = document.getElementById('mobHeaderEqVal');

  if (webName) webName.textContent = prof.name;
  if (mobName) mobName.textContent = prof.shortName;
  if (mobRole) mobRole.textContent = `HEMIS: ${STATE.digitalIdentity.hemisId}`;
  if (webEq) webEq.textContent = `${STATE.eqBalance} EQ`;
  if (mobEq) mobEq.textContent = `${STATE.eqBalance} EQ`;
}

function renderAll() {
  updateHeaders();
  const webEl = document.getElementById('webMainScroll');
  const mobEl = document.getElementById('mobViewport');
  if (!webEl || !mobEl) return;

  if (STATE.section === 'hub') {
    webEl.innerHTML = renderWebHub();
    mobEl.innerHTML = renderMobHub();
  } else if (STATE.section === 'schedule') {
    webEl.innerHTML = renderWebSchedule();
    mobEl.innerHTML = renderMobSchedule();
  } else if (STATE.section === 'kafedra') {
    webEl.innerHTML = renderWebKafedra();
    mobEl.innerHTML = renderMobKafedra();
  } else if (STATE.section === 'equity') {
    webEl.innerHTML = renderWebEquity();
    mobEl.innerHTML = renderMobEquity();
  } else if (STATE.section === 'qrmerchant') {
    webEl.innerHTML = renderWebQrMerchant();
    mobEl.innerHTML = renderMobQrMerchant();
    setTimeout(drawActiveQrCodes, 40);
  } else if (STATE.section === 'messenger') {
    webEl.innerHTML = renderWebMessenger();
    mobEl.innerHTML = renderMobMessenger();
  } else if (STATE.section === 'id') {
    webEl.innerHTML = renderWebDigitalId();
    mobEl.innerHTML = renderMobDigitalId();
    setTimeout(drawActiveQrCodes, 40);
  }
}

// ==========================================================================
// ВЕБ & МОБИЛЬНЫЙ ХАБ (ГЛАВНЫЙ ЭКРАН)
// ==========================================================================

function renderWebHub() {
  const totalGroups = Object.keys(window.EDUPAGE_SCHEDULE_DATA || {}).length || 108;
  const totalTeachers = ((window.TSUE_KAFEDRA_DATA && window.TSUE_KAFEDRA_DATA.teachers) || []).length;

  return `
    <div class="web-container">
      <div class="super-hero-banner">
        <div>
          <div class="sh-badge">
            <i class="fa-solid fa-bolt"></i>
            <span>TSUE SUPERAPP · ПРЯМАЯ ИНТЕГРАЦИЯ TSUE-DIGITAL-ECONOMY</span>
          </div>
          <h2>Единая платформа факультета и университета</h2>
          <p>Архитектура без сайдбара с прямым подключением к API расписания EduPage (${totalGroups} групп), электронному журналу посещаемости и НБ, 5 кафедрам со 172 преподавателями, финансовому регламенту Equity и QR-оплате в кампусе.</p>
        </div>
        <div class="sh-stats-grid">
          <div class="sh-stat-box">
            <div class="sh-stat-val">${totalGroups} групп</div>
            <div class="sh-stat-lbl">Единое расписание EduPage API</div>
          </div>
          <div class="sh-stat-box">
            <div class="sh-stat-val">5 кафедр · ${totalTeachers}</div>
            <div class="sh-stat-lbl">Преподавателей в базе с фото</div>
          </div>
          <div class="sh-stat-box">
            <div class="sh-stat-val">${STATE.eqBalance} EQ</div>
            <div class="sh-stat-lbl">Баланс Equity · ТОП-42 рейтинга</div>
          </div>
          <div class="sh-stat-box">
            <div class="sh-stat-val">${ACCREDITED_MERCHANTS.length} касс</div>
            <div class="sh-stat-lbl">Аккредитованных Hamkor POS</div>
          </div>
        </div>
      </div>

      
      <!-- АКАДЕМИЧЕСКИЕ И ФИНАНСОВЫЕ ИНДИКАТОРЫ: GPA, GRANT, КОНТРАКТ, IFI -->
      <div class="academic-gauge-grid">
        <div class="academic-gauge-card" onclick="showGpaDetailModal()" style="cursor:pointer">
          <div class="ag-title">
            <span>Академический GPA</span>
            <i class="fa-solid fa-graduation-cap" style="color:var(--tsue-blue-mid)"></i>
          </div>
          <div class="ag-value">${STATE.gpa} <span style="font-size:14px;color:var(--text-muted);font-weight:600">/ 5.0</span></div>
          <div class="ag-bar-bg">
            <div class="ag-bar-fill" style="width:${(STATE.gpa / 5) * 100}%;background:#047857"></div>
          </div>
          <div class="ag-desc"><i class="fa-solid fa-check" style="color:#047857"></i> Выше порога гранта (3.50). Претендент на Грант.</div>
        </div>

        <div class="academic-gauge-card" onclick="showContractDetailModal()" style="cursor:pointer">
          <div class="ag-title">
            <span>Оплата Контракта</span>
            <i class="fa-solid fa-file-invoice-dollar" style="color:var(--tsue-gold)"></i>
          </div>
          <div class="ag-value">${STATE.contractPaidPct}% <span style="font-size:14px;color:var(--text-muted);font-weight:600">оплачено</span></div>
          <div class="ag-bar-bg">
            <div class="ag-bar-fill" style="width:${STATE.contractPaidPct}%;background:var(--tsue-gold)"></div>
          </div>
          <div class="ag-desc">Остаток 25% можно покрыть скидкой за 400 EQ.</div>
        </div>

        <div class="academic-gauge-card" onclick="showIfiDetailModal()" style="cursor:pointer">
          <div class="ag-title">
            <span>Ijtimoiy Faollik (IFI)</span>
            <i class="fa-solid fa-chart-line" style="color:#2563EB"></i>
          </div>
          <div class="ag-value">${STATE.ifiScore} <span style="font-size:14px;color:var(--text-muted);font-weight:600">/ 100</span></div>
          <div class="ag-bar-bg">
            <div class="ag-bar-fill" style="width:${STATE.ifiScore}%;background:#2563EB"></div>
          </div>
          <div class="ag-desc">1-я категория активности. 6 справок одобрено тьютором.</div>
        </div>

        <div class="academic-gauge-card" onclick="navigateTo('equity')" style="cursor:pointer">
          <div class="ag-title">
            <span>Баланс RIAT Equity</span>
            <i class="fa-solid fa-coins" style="color:#D4A017"></i>
          </div>
          <div class="ag-value">${STATE.eqBalance} <span style="font-size:14px;color:var(--text-muted);font-weight:600">EQ</span></div>
          <div class="ag-bar-bg">
            <div class="ag-bar-fill" style="width:75%;background:#D4A017"></div>
          </div>
          <div class="ag-desc">Месячный лимит 4.3–4.5: <b>${STATE.eqMonthlySpent43_45}/60 EQ</b>.</div>
        </div>
      </div>

      <div class="uzum-service-grid">
        <div class="uzum-card" onclick="navigateTo('schedule')">
          <div class="uzum-card-top">
            <div>
              <div class="uzum-card-title">1. Расписание и Журнал НБ (tsue-digital-economy)</div>
              <div class="uzum-card-desc">Единое недельное расписание без чётных/нечётных недель. Мультипоиск по группе, преподавателю, аудитории, а также электронный журнал посещаемости HEMIS.</div>
            </div>
            <div class="lt-icon lt-blue"><i class="fa-solid fa-calendar-days"></i></div>
          </div>
          <div class="uzum-card-meta">
            <span>Группа: ${esc(STATE.schedGroup)}</span>
            <span>Открыть расписание →</span>
          </div>
        </div>

        <div class="uzum-card" onclick="navigateTo('kafedra')">
          <div class="uzum-card-top">
            <div>
              <div class="uzum-card-title">2. 5 Кафедр и ППС (${totalTeachers} преподавателей)</div>
              <div class="uzum-card-desc">Реальный штат 5 кафедр (Цифровая экономика, АТТ, ИИ, Эконометрика, Статистика) с фотографиями из архивов, контактами и часами консультаций.</div>
            </div>
            <div class="lt-icon lt-indigo"><i class="fa-solid fa-chalkboard-user"></i></div>
          </div>
          <div class="uzum-card-meta">
            <span>Кафедра РИат: 50 преп.</span>
            <span>База преподавателей →</span>
          </div>
        </div>

        <div class="uzum-card" onclick="navigateTo('equity')">
          <div class="uzum-card-top">
            <div>
              <div class="uzum-card-title">3. Баллы «Equity» (Положение / Низом)</div>
              <div class="uzum-card-desc">Официальный Низом: 18 критериев начислений, скидки на контракт 5%–50% для ТОП-250, каталог купонов на обеды, мерч, спорт и таблица штрафов.</div>
            </div>
            <div class="lt-icon lt-gold"><i class="fa-solid fa-coins"></i></div>
          </div>
          <div class="uzum-card-meta">
            <span>Баланс: ${STATE.eqBalance} EQ</span>
            <span>Открыть каталог →</span>
          </div>
        </div>

        <div class="uzum-card" onclick="navigateTo('qrmerchant')">
          <div class="uzum-card-top">
            <div>
              <div class="uzum-card-title">4. QR-Оплата & Кассы Hamkorlar POS</div>
              <div class="uzum-card-desc">Генерация QR-счетов кассами магазинов и оплата студентами. Защита от P2P-переводов: оплата доступна только аккредитованным Комиссией кассам.</div>
            </div>
            <div class="lt-icon lt-emerald"><i class="fa-solid fa-qrcode"></i></div>
          </div>
          <div class="uzum-card-meta">
            <span>Кассы кампуса: ${ACCREDITED_MERCHANTS.length} точек</span>
            <span>QR-терминал →</span>
          </div>
        </div>

        <div class="uzum-card" onclick="navigateTo('messenger')">
          <div class="uzum-card-top">
            <div>
              <div class="uzum-card-title">5. RIAT-Messenger (Telegram-стиль)</div>
              <div class="uzum-card-desc">Каналы деканата, группы курса, чаты кафедр и уведомления бота начислений Equity в привычном мессенджер-интерфейсе.</div>
            </div>
            <div class="lt-icon lt-sky"><i class="fa-brands fa-telegram"></i></div>
          </div>
          <div class="uzum-card-meta">
            <span>4 активных диалога</span>
            <span>Открыть чаты →</span>
          </div>
        </div>

        <div class="uzum-card" onclick="navigateTo('id')">
          <div class="uzum-card-top">
            <div>
              <div class="uzum-card-title">6. Динамический Цифровой ID</div>
              <div class="uzum-card-desc">Динамический QR-пропуск турникетов кампуса на базе HEMIS ID, Student ID и JSHSHIR (ПИНФЛ) с возможностью редактирования параметров в реальном времени.</div>
            </div>
            <div class="lt-icon lt-slate"><i class="fa-solid fa-id-card-clip"></i></div>
          </div>
          <div class="uzum-card-meta">
            <span>HEMIS: ${esc(STATE.digitalIdentity.hemisId)}</span>
            <span>Мой пропуск →</span>
          </div>
        </div>
      </div>
    </div>
  `;
}


function renderMobHub() { return renderHemisExactHome(); }


// ==========================================================================
// МОДУЛЬ 1: РАСПИСАНИЕ И ЖУРНАЛ НБ (TSUE-DIGITAL-ECONOMY)
// УБРАНО ДЕЛЕНИЕ НА ЧЁТ/НЕЧЁТ, ВНЕДРЕНО ЕДИНОЕ РАСПИСАНИЕ НЕДЕЛИ
// ==========================================================================

function onSchedCourseChange(c) {
  STATE.schedCourse = c;
  STATE.schedCustomFilter = null;
  const groups = getFilteredGroups();
  if (groups.length > 0 && !groups.includes(STATE.schedGroup)) {
    STATE.schedGroup = groups[0];
  }
  renderAll();
}

function onSchedGroupChange(g) {
  STATE.schedGroup = g;
  STATE.schedCustomFilter = null;
  renderAll();
}

function onSchedDaySelect(dIdx) {
  STATE.schedDayIdx = dIdx;
  renderAll();
}

function setSchedSearchMode(mode) {
  STATE.schedSearchMode = mode;
  STATE.schedQuery = '';
  STATE.schedCustomFilter = null;
  renderAll();
}

function onSchedQueryInput(val) {
  STATE.schedQuery = val;
  const box = document.getElementById('schedQuickSuggest');
  if (!box) return;
  const clean = val.trim().toLowerCase();
  if (!clean) { box.style.display = 'none'; return; }

  const hits = [];
  const data = window.EDUPAGE_SCHEDULE_DATA || {};

  if (STATE.schedSearchMode === 'group') {
    Object.keys(data).forEach(g => {
      if (g.toLowerCase().includes(clean)) hits.push({ type: 'group', value: g, label: `Группа ${g}` });
    });
  } else if (STATE.schedSearchMode === 'teacher') {
    const teachers = new Set();
    Object.values(data).forEach(g => {
      [0,1,2,3,4,5].forEach(d => {
        [0,1,2,3,4,5,6,7].forEach(s => {
          const l = g.odd?.[d]?.[s] || g.even?.[d]?.[s];
          if (l?.teacher && l.teacher.toLowerCase().includes(clean)) teachers.add(l.teacher);
        });
      });
    });
    teachers.forEach(t => hits.push({ type: 'teacher', value: t, label: `Преподаватель: ${t}` }));
  } else if (STATE.schedSearchMode === 'room') {
    const rooms = new Set();
    Object.values(data).forEach(g => {
      [0,1,2,3,4,5].forEach(d => {
        [0,1,2,3,4,5,6,7].forEach(s => {
          const l = g.odd?.[d]?.[s] || g.even?.[d]?.[s];
          if (l?.room && l.room.toLowerCase().includes(clean)) rooms.add(l.room);
        });
      });
    });
    rooms.forEach(r => hits.push({ type: 'room', value: r, label: `Аудитория: ${r}` }));
  }

  if (hits.length === 0) {
    box.innerHTML = `<div style="padding:8px 12px;font-size:12px;color:var(--text-muted)">Ничего не найдено</div>`;
    box.style.display = 'block';
    return;
  }

  box.innerHTML = hits.slice(0, 15).map(h => `
    <div class="omni-item" onclick="applySchedMatch('${esc(h.type)}','${esc(h.value)}')">
      <b>${esc(h.label)}</b>
      <span style="font-size:11px;color:var(--tsue-blue-mid)">Выбрать →</span>
    </div>
  `).join('');
  box.style.display = 'block';
}

function applySchedMatch(type, value) {
  if (type === 'group') {
    STATE.schedGroup = value;
    STATE.schedCustomFilter = null;
  } else {
    STATE.schedCustomFilter = { type, value };
  }
  STATE.schedQuery = value;
  renderAll();
}

function setJournalHours(stId, val) {
  const h = Math.max(0, parseInt(val, 10) || 0);
  if (STATE.journalAttendanceMap[stId]) {
    STATE.journalAttendanceMap[stId].hours = h;
    STATE.journalAttendanceMap[stId].todayNb = h;
  }
  renderAll();
}

function setAllJournalStatus(h) {
  Object.keys(STATE.journalAttendanceMap).forEach(k => {
    STATE.journalAttendanceMap[k].hours = h;
    STATE.journalAttendanceMap[k].todayNb = h;
  });
  renderAll();
}

function saveJournalAttendance() {
  showToast(`✅ Отметки за ${STATE.journalPair}-ю пару сохранены в журнале HEMIS!`);
}

function renderWebSchedule() {
  const groups = getFilteredGroups();
  if (!groups.includes(STATE.schedGroup) && groups.length > 0) {
    STATE.schedGroup = groups[0];
  }

  const filterBanner = STATE.schedCustomFilter
    ? `<div style="background:rgba(24,100,171,0.12);border:1px solid var(--tsue-blue-mid);padding:9px 14px;border-radius:9px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;font-size:12.5px">
         <span><i class="fa-solid fa-filter"></i> Фильтр: <b>${esc(STATE.schedCustomFilter.type === 'teacher' ? 'Преподаватель' : 'Аудитория')} — ${esc(STATE.schedCustomFilter.value)}</b></span>
         <button class="pro-pill-btn" onclick="STATE.schedCustomFilter=null;STATE.schedQuery='';renderAll()">Сбросить ✕</button>
       </div>`
    : '';

  let mainContent = '';

  if (STATE.schedViewSubTab === 'journal') {
    mainContent = `
      <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:14px;padding:16px;box-shadow:var(--shadow-card)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <div>
            <h3 style="font-size:16px;font-weight:800"><i class="fa-solid fa-clipboard-user" style="color:var(--tsue-blue-mid)"></i> Электронный журнал посещаемости HEMIS / Рапортичка старосты</h3>
            <p style="font-size:12px;color:var(--text-muted)">1 пара = 2 академических часа (2 соат НБ). Синхронизация с базой данных контингента.</p>
          </div>
          <div style="display:flex;gap:8px">
            <button class="pro-pill-btn" onclick="setAllJournalStatus(0)"><i class="fa-solid fa-circle-check"></i> Все присутствуют</button>
            <button class="pro-pill-btn" onclick="setAllJournalStatus(2)"><i class="fa-solid fa-circle-xmark"></i> Всем 2ч НБ</button>
            <button class="pro-pill-btn active" onclick="saveJournalAttendance()"><i class="fa-solid fa-cloud-arrow-up"></i> Сохранить в HEMIS</button>
          </div>
        </div>

        <div style="display:grid;grid-template-columns:180px 180px 180px 1fr;gap:10px;margin-bottom:14px">
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-muted)">Группа</label>
            <input type="text" class="pro-input" value="${esc(STATE.schedGroup)}" readonly>
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-muted)">Дата пары</label>
            <input type="date" class="pro-input" value="${STATE.journalDate}" onchange="STATE.journalDate=this.value;renderAll()">
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-muted)">Пара</label>
            <select class="pro-select" onchange="STATE.journalPair=this.value;renderAll()">
              ${[1,2,3,4,5,6,7,8].map(p => `<option value="${p}" ${STATE.journalPair == p ? 'selected' : ''}>${p}-я пара (${SCHED_SLOTS[p-1] || ''})</option>`).join('')}
            </select>
          </div>
          <div>
            <label style="font-size:11px;font-weight:700;color:var(--text-muted)">Дисциплина</label>
            <input type="text" class="pro-input" value="${esc(STATE.journalSubject)}" onchange="STATE.journalSubject=this.value">
          </div>
        </div>

        <table class="nizom-rule-table">
          <thead>
            <tr>
              <th style="width:40px">№</th>
              <th>Ф.И.О. Студента</th>
              <th>HEMIS ID</th>
              <th style="width:120px">Отметка на паре</th>
              <th style="width:120px">Итого сегодня</th>
            </tr>
          </thead>
          <tbody>
            ${Object.keys(STATE.journalAttendanceMap).map((k, idx) => {
              const st = STATE.journalAttendanceMap[k];
              const isNb = st.hours > 0;
              return `
                <tr style="background:${isNb ? 'rgba(201,42,42,0.06)' : 'transparent'}">
                  <td><b>${idx + 1}</b></td>
                  <td><b>${esc(st.name)}</b></td>
                  <td style="font-family:'JetBrains Mono',monospace">${esc(st.hemis)}</td>
                  <td>
                    <select class="pro-select" style="padding:4px 8px;font-size:12px" onchange="setJournalHours('${k}', this.value)">
                      <option value="0" ${st.hours === 0 ? 'selected' : ''}>Был (0ч)</option>
                      <option value="2" ${st.hours === 2 ? 'selected' : ''}>НБ (2ч)</option>
                    </select>
                  </td>
                  <td>
                    <span class="${st.todayNb > 0 ? 'eq-badge-minus' : 'eq-badge-plus'}">${st.todayNb > 0 ? st.todayNb + 'ч НБ' : 'Норма'}</span>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else {
    // Единая таблица расписания всей недели (Пн-Сб)
    let rowsHtml = '';
    for (let s = 0; s < SCHED_SLOTS.length; s++) {
      rowsHtml += `<tr>
        <td class="slot-col">
          <div class="slot-num">${s + 1}</div>
          <div class="slot-time">${SCHED_SLOTS[s]}</div>
        </td>`;
      for (let d = 0; d < 6; d++) {
        const les = getLessonCellUnified(d, s);
        if (les) {
          const typeCls = les.type ? `type-${les.type}` : 'type-lecture';
          rowsHtml += `<td>
            <div class="lesson-card-pro ${typeCls}">
              <div class="lc-subj">${esc(les.subject)}</div>
              <div class="lc-meta">
                <span><i class="fa-solid fa-user-tie"></i> ${esc(les.teacher || 'ППС кафедры')}</span>
                ${les.room ? `<span class="lc-room-badge">Ауд. ${esc(les.room)}</span>` : ''}
              </div>
            </div>
          </td>`;
        } else {
          rowsHtml += `<td></td>`;
        }
      }
      rowsHtml += `</tr>`;
    }

    mainContent = `
      <div class="sched-table-wrap">
        <table class="pro-sched-table">
          <thead>
            <tr>
              <th>Пара</th>
              ${SCHED_DAYS.map(d => `<th>${d}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `;
  }

  return `
    <div class="web-container">
      <div class="sched-toolbar-pro">
        <div class="sched-toolbar-row">
          <div>
            <h2 style="font-size:17px;font-weight:800">Расписание занятий ТГЭУ (tsue-digital-economy · EduPage API)</h2>
            <p style="font-size:12px;color:var(--text-muted)">Единая сетка недели без разделения на чётную/нечётную недели. Синхронизировано в реальном времени.</p>
          </div>
          <div style="display:flex;gap:8px">
            <button class="pro-pill-btn ${STATE.schedViewSubTab === 'grid' ? 'active' : ''}" onclick="STATE.schedViewSubTab='grid';renderAll()">
              <i class="fa-solid fa-table-cells"></i> Сетка занятий
            </button>
            <button class="pro-pill-btn 
    ${STATE.mobGroupSheetOpen ? `
      <div class="mob-sheet-overlay" onclick="if(event.target===this)toggleMobGroupSheet()">
        <div class="mob-sheet-card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <b style="font-size:14px"><i class="fa-solid fa-layer-group" style="color:var(--tsue-gold)"></i> Выберите группу (${groups.length})</b>
            <button class="pro-pill-btn" style="padding:4px 10px" onclick="toggleMobGroupSheet()">✕</button>
          </div>
          
          <div class="mob-sheet-pills">
            ${['all', '1', '2', '3', '4'].map(c => `
              <button class="pro-pill-btn ${STATE.schedCourse === c ? 'active' : ''}" style="font-size:11px;padding:4px 10px" onclick="onSchedCourseChange('${c}')">
                ${c === 'all' ? 'Все курсы' : c + ' курс'}
              </button>
            `).join('')}
          </div>

          <div class="mob-groups-grid">
            ${groups.map(g => `
              <div class="mob-group-chip ${g === STATE.schedGroup ? 'active' : ''}" onclick="selectMobGroupAndClose('${esc(g)}')">
                ${esc(g)}
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    ` : ''}

    ${STATE.schedViewSubTab === 'journal' ? 'active' : ''}" onclick="STATE.schedViewSubTab='journal';renderAll()">
              <i class="fa-solid fa-clipboard-user"></i> Журнал НБ (HEMIS)
            </button>
            <button class="pro-pill-btn" onclick="syncScheduleFromApi()" title="Запросить Live API EduPage">
              <i class="fa-solid fa-rotate"></i> Синхронизация API
            </button>
          </div>
        </div>

        <div class="sched-toolbar-row" style="margin-bottom:10px">
          <div class="sched-course-pills">
            ${['all', '1', '2', '3', '4'].map(c => `
              <button class="pro-pill-btn ${STATE.schedCourse === c ? 'active' : ''}" onclick="onSchedCourseChange('${c}')">
                ${c === 'all' ? 'Все курсы' : `${c} курс`}
              </button>
            `).join('')}
          </div>

          <div class="sched-mode-pills">
            <button class="pro-pill-btn ${STATE.schedSearchMode === 'group' ? 'active' : ''}" onclick="setSchedSearchMode('group')">
              <i class="fa-solid fa-users"></i> По группе
            </button>
            <button class="pro-pill-btn ${STATE.schedSearchMode === 'teacher' ? 'active' : ''}" onclick="setSchedSearchMode('teacher')">
              <i class="fa-solid fa-chalkboard-user"></i> По преподавателю
            </button>
            <button class="pro-pill-btn ${STATE.schedSearchMode === 'room' ? 'active' : ''}" onclick="setSchedSearchMode('room')">
              <i class="fa-solid fa-door-open"></i> По аудитории
            </button>
          </div>
        </div>

        <div class="sched-search-box-pro">
          <select class="pro-select" onchange="onSchedGroupChange(this.value)">
            ${groups.map(g => `<option value="${esc(g)}" ${g === STATE.schedGroup ? 'selected' : ''}>Группа: ${esc(g)}</option>`).join('')}
          </select>

          <div style="position:relative">
            <input type="text" class="pro-input" value="${esc(STATE.schedQuery)}"
              placeholder="${STATE.schedSearchMode === 'group' ? 'Быстрый поиск группы (напр. AT 31, RI-70)...' : STATE.schedSearchMode === 'teacher' ? 'Введите фамилию преподавателя...' : 'Введите номер аудитории (напр. 214, 305)...'}"
              oninput="onSchedQueryInput(this.value)">
            <div id="schedQuickSuggest" class="omni-dropdown" style="display:none"></div>
          </div>

          <button class="pro-pill-btn" style="justify-content:center;height:38px" onclick="STATE.schedCustomFilter=null;STATE.schedQuery='';renderAll()">
            <i class="fa-solid fa-xmark"></i> Очистить
          </button>
        </div>
      </div>

      ${filterBanner}
      ${mainContent}
    </div>
  `;
}

function renderMobSchedulePreview() {
  const items = [];
  for (let s = 0; s < 4; s++) {
    const l = getLessonCellUnified(STATE.schedDayIdx, s);
    if (l) items.push({ slot: SCHED_SLOTS[s], ...l });
  }
  if (items.length === 0) {
    return `<div style="font-size:11.5px;color:var(--text-muted)">В этот день пар нет по расписанию</div>`;
  }
  return items.slice(0, 3).map(it => `
    <div style="padding:7px 9px;border-left:3px solid var(--tsue-blue-mid);background:var(--bg-elevated);border-radius:6px;margin-bottom:5px;font-size:11.5px">
      <div style="display:flex;justify-content:space-between;font-weight:700">
        <span>${esc(it.subject)}</span>
        <span style="color:var(--tsue-blue-mid)">Ауд. ${esc(it.room || '—')}</span>
      </div>
      <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px">${it.slot} · ${esc(it.teacher || '')}</div>
    </div>
  `).join('');
}


function toggleMobGroupSheet() {
  STATE.mobGroupSheetOpen = !STATE.mobGroupSheetOpen;
  renderAll();
}

function selectMobGroupAndClose(grp) {
  STATE.schedGroup = grp;
  STATE.mobGroupSheetOpen = false;
  STATE.schedCustomFilter = null;
  renderAll();
  showToast('Группа ' + grp + ' выбрана');
}

function setThemePalette(p) {
  STATE.currentThemePalette = p;
  document.body.classList.remove('theme-hemis', 'theme-emerald', 'theme-purple', 'theme-indigo');
  document.body.classList.add('theme-' + p);
  renderAll();
  showToast('Цветовая гамма: ' + p.toUpperCase());
}

function toggleLiquidGlass() {
  STATE.liquidGlassEnabled = !STATE.liquidGlassEnabled;
  document.body.classList.toggle('liquid-glass', STATE.liquidGlassEnabled);
  renderAll();
  showToast(STATE.liquidGlassEnabled ? 'Liquid Glass стиль включён' : 'Liquid Glass стиль выключен');
}

function renderMobSchedule() { return renderHemisExactSchedule(); }

// ==========================================================================
// МОДУЛЬ 2: 5 КАФЕДР И 172 ПРЕПОДАВАТЕЛЯ С ФОТОГРАФИЯМИ
// ==========================================================================

function setActiveDep(depId) {
  STATE.activeDepId = depId;
  renderAll();
}

function onTeacherSearchInput(val) {
  STATE.teacherSearch = val;
  renderAll();
}

function openTeacherProfileModal(teacherId) {
  const data = window.TSUE_KAFEDRA_DATA || { teachers: [] };
  const t = data.teachers.find(x => x.id === teacherId);
  if (!t) return;

  const sa = t.scientificAchievements || {
    scopusHIndex: 4,
    googleScholarHIndex: 9,
    articlesCount: 28,
    scopusArticles: 6,
    monographsCount: 2,
    patentsCount: 3,
    scientificInterests: t.subjects || ['Цифровая экономика'],
    recentPublications: [
      '«Metodologik yondashuvlar va ilmiy tadqiqotlar natijalari» // TDIU Axborotnomasi, 2024',
      '«Digital transformation and security architecture in modern economy» // Scopus Journal, 2023'
    ],
    orcid: '0000-0002-7104-9821'
  };

  openProModal(`
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;border-bottom:1.5px solid var(--border-color);padding-bottom:16px">
      <div style="display:flex;gap:18px;align-items:center">
        <img src="/${esc(t.photo)}" alt="${esc(t.fullName)}" class="teacher-modal-avatar" onerror="this.src='/assets/images/faculty_logo.png'">
        <div>
          <div style="font-size:12px;font-weight:800;color:var(--tsue-blue-mid);text-transform:uppercase;letter-spacing:0.5px">${esc(t.depName)}</div>
          <h2 style="font-size:21px;font-weight:800;margin:4px 0;color:var(--text-main)">${esc(t.fullName)}</h2>
          <div style="font-size:13.5px;color:var(--text-secondary);font-weight:600">${esc(t.position)} · ${esc(t.degree)}</div>
          <div style="font-size:12px;color:var(--text-muted);margin-top:4px">
            <i class="fa-solid fa-id-badge"></i> ORCID: <b style="color:var(--tsue-blue-mid)">${esc(sa.orcid)}</b>
          </div>
        </div>
      </div>
      <button class="pro-pill-btn" style="font-size:16px;padding:6px 14px" onclick="closeProModal()">✕</button>
    </div>

    <!-- КРАТКАЯ БИОГРАФИЯ / ДОСЬЕ -->
    <div style="background:var(--bg-elevated);border-left:4px solid var(--tsue-gold);padding:12px 14px;border-radius:8px;font-size:12.5px;color:var(--text-secondary);margin-bottom:14px;line-height:1.5">
      ${esc(t.bio || (t.fullName + ' — ведущий ученый и педагог ТГЭУ, автор передовых публикаций и учебных пособий.'))}
    </div>

    <!-- НАУЧНЫЕ ДОСТИЖЕНИЯ И МЕТРИКИ (SCOPUS, GOOGLE SCHOLAR, СТАТЬИ) -->
    <div style="font-size:13px;font-weight:800;margin-bottom:6px;color:var(--text-main);display:flex;align-items:center;gap:6px">
      <i class="fa-solid fa-award" style="color:var(--tsue-gold)"></i> Наукометрические показатели и достижения
    </div>

    <div class="teacher-achieve-grid">
      <div class="teacher-achieve-box">
        <div class="teacher-achieve-val" style="color:#047857">${sa.scopusHIndex}</div>
        <div class="teacher-achieve-lbl">Scopus h-index</div>
      </div>
      <div class="teacher-achieve-box">
        <div class="teacher-achieve-val" style="color:#1D4ED8">${sa.googleScholarHIndex}</div>
        <div class="teacher-achieve-lbl">Google Scholar h-index</div>
      </div>
      <div class="teacher-achieve-box">
        <div class="teacher-achieve-val">${sa.articlesCount}</div>
        <div class="teacher-achieve-lbl">Научных статей</div>
      </div>
      <div class="teacher-achieve-box">
        <div class="teacher-achieve-val" style="color:var(--tsue-navy)">${sa.scopusArticles} / ${sa.monographsCount}</div>
        <div class="teacher-achieve-lbl">Scopus / Монографий</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;font-size:12.5px">
      <div style="background:var(--bg-elevated);padding:10px 12px;border-radius:10px;border:1px solid var(--border-color)">
        <div style="color:var(--text-muted);font-size:11px;font-weight:700">Кабинет на факультете</div>
        <b><i class="fa-solid fa-door-open" style="color:var(--tsue-blue-mid)"></i> ${esc(t.room)}</b>
      </div>
      <div style="background:var(--bg-elevated);padding:10px 12px;border-radius:10px;border:1px solid var(--border-color)">
        <div style="color:var(--text-muted);font-size:11px;font-weight:700">Часы консультаций со студентами</div>
        <b><i class="fa-solid fa-clock" style="color:var(--tsue-gold)"></i> ${esc(t.consultation)}</b>
      </div>
    </div>

    <!-- ПОСЛЕДНИЕ НАУЧНЫЕ ПУБЛИКАЦИИ -->
    <div style="margin-bottom:14px">
      <div style="font-size:12.5px;font-weight:800;margin-bottom:6px">Основные научные труды и публикации:</div>
      <div style="display:flex;flex-direction:column;gap:5px">
        ${(sa.recentPublications || []).map(p => `
          <div style="font-size:11.5px;padding:6px 10px;background:var(--bg-elevated);border-radius:6px;border:1px solid var(--border-color);color:var(--text-secondary)">
            <i class="fa-solid fa-book-bookmark" style="color:var(--tsue-blue-mid);margin-right:4px"></i> ${esc(p)}
          </div>
        `).join('')}
      </div>
    </div>

    <div style="margin-bottom:16px">
      <div style="font-size:12.5px;font-weight:800;margin-bottom:6px">Преподаваемые дисциплины:</div>
      <div class="tc-subjects">
        ${(t.subjects || []).map(s => `<span class="tc-subj-tag" style="font-size:11.5px;padding:5px 10px">${esc(s)}</span>`).join('')}
      </div>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;padding-top:14px;border-top:1px solid var(--border-color);font-size:12.5px">
      <span><i class="fa-solid fa-envelope" style="color:var(--tsue-blue-mid)"></i> <b>${esc(t.email)}</b></span>
      <button class="pro-pill-btn active" style="padding:8px 16px;font-size:12.5px" onclick="closeProModal();STATE.schedSearchMode='teacher';applySchedMatch('teacher','${esc(t.fullName.split(' ')[0])}');navigateTo('schedule')">
        <i class="fa-solid fa-calendar-days"></i> Смотреть пары в EduPage
      </button>
    </div>
  `);
}

function renderWebKafedra() {
  const data = window.TSUE_KAFEDRA_DATA || { departments: [], teachers: [] };
  const activeDep = data.departments.find(d => d.id === STATE.activeDepId) || data.departments[0];
  const q = (STATE.teacherSearch || '').trim().toLowerCase();

  const filtered = data.teachers.filter(t => {
    const matchDep = q ? true : t.depId === STATE.activeDepId;
    const matchQ = !q || t.fullName.toLowerCase().includes(q) || (t.position && t.position.toLowerCase().includes(q)) || (t.subjects || []).some(s => s.toLowerCase().includes(q));
    return matchDep && matchQ;
  });

  return `
    <div class="web-container">
      <div class="sched-toolbar-pro">
        <div class="sched-toolbar-row" style="margin-bottom:10px">
          <div>
            <h2 style="font-size:17px;font-weight:800">5 Кафедр факультета · ${data.teachers.length} преподавателей</h2>
            <p style="font-size:12px;color:var(--text-muted)">Реальные досье и фотографии из архивов кафедр (Цифровая экономика, АТТ, ИИ, Эконометрика, Статистика)</p>
          </div>
          <div style="width:300px">
            <input type="text" class="pro-input" value="${esc(STATE.teacherSearch)}" placeholder="Поиск по ФИО, предмету, степени..." oninput="onTeacherSearchInput(this.value)">
          </div>
        </div>

        <div class="kafedra-tabs-strip">
          ${data.departments.map(d => `
            <div class="kafedra-tab-card ${d.id === STATE.activeDepId && !q ? 'active' : ''}" onclick="STATE.teacherSearch='';setActiveDep('${esc(d.id)}')">
              <b><i class="fa-solid ${esc(d.icon)}"></i> ${esc(d.nameRu || d.name)}</b>
              <span>${d.teachersCount} преп. · ${esc(d.room)}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="teachers-grid-pro">
        ${filtered.map(t => `
          <div class="teacher-card-pro" onclick="openTeacherProfileModal('${esc(t.id)}')">
            <div class="tc-header">
              <img class="tc-avatar" src="/${esc(t.photo)}" alt="${esc(t.fullName)}" loading="lazy" onerror="this.src='/assets/images/faculty_logo.png'">
              <div>
                <div class="tc-name">${esc(t.fullName)}</div>
                <div class="tc-role">${esc(t.position)}</div>
              </div>
            </div>
            <div class="tc-subjects">
              ${(t.subjects || []).slice(0, 3).map(s => `<span class="tc-subj-tag">${esc(s)}</span>`).join('')}
            </div>
            <div class="tc-footer">
              <span><i class="fa-solid fa-location-dot"></i> ${esc(t.room)}</span>
              <span style="color:var(--tsue-blue-mid);font-weight:700">Профиль →</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderMobKafedra() { return renderHemisExactSubjects(); }

function setEquityTab(tab) {
  STATE.equityTab = tab;
  renderAll();
}

function issueCatalogCoupon(itemId) {
  const item = EQUITY_NIZOM.catalogItems.find(x => x.id === itemId);
  if (!item) return;

  if (STATE.eqBalance < item.cost) {
    showToast(`Недостаточно Equity! Требуется ${item.cost} EQ.`);
    return;
  }
  if (item.countsMonthly60 && (STATE.eqMonthlySpent43_45 + item.cost > 60)) {
    showToast(`Превышен месячный лимит 60 EQ по разделам 4.3–4.5 (п. 5.5 Низома)!`);
    return;
  }

  STATE.eqBalance -= item.cost;
  if (item.countsMonthly60) {
    STATE.eqMonthlySpent43_45 += item.cost;
  }

  const merchant = ACCREDITED_MERCHANTS.find(m => m.merchantId === item.merchantId) || ACCREDITED_MERCHANTS[0];
  const code = `EQ-KUP-${Math.floor(1000 + Math.random() * 9000)}-TSUE`;
  STATE.activeCoupons.unshift({
    code,
    merchantId: merchant.merchantId,
    merchantName: merchant.name,
    itemTitle: item.title,
    cost: item.cost,
    issuedAt: '30.10.2026 13:00',
    expiresAt: '29.11.2026 (30 дней)',
    status: 'ACTIVE'
  });

  showToast(`Выпущен QR-купон ${code} (${item.cost} EQ)`);
  STATE.qrTab = 'student_pay';
  navigateTo('qrmerchant');
}

function renderWebEquity() {
  let contentHtml = '';

  if (STATE.equityTab === 'catalog') {
    contentHtml = `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:12px">
        ${EQUITY_NIZOM.catalogItems.map(item => `
          <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:12px;padding:14px;display:flex;flex-direction:column;justify-content:space-between;gap:10px">
            <div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                <span style="font-size:10.5px;font-weight:800;color:var(--tsue-blue-mid);background:var(--bg-subtle);padding:2px 8px;border-radius:5px">${esc(item.sec)}</span>
                <span class="eq-badge-plus">${item.cost} EQ</span>
              </div>
              <div style="font-size:13.5px;font-weight:700;line-height:1.35;margin-bottom:4px">${esc(item.title)}</div>
              <div style="font-size:11.5px;color:var(--text-muted)">Условие Низома: ${esc(item.limit)}</div>
            </div>
            <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid var(--border-color)">
              <span style="font-size:10.5px;color:var(--text-muted)">${item.countsMonthly60 ? 'Лимит 60 EQ/мес (п. 5.5)' : 'Без месячного лимита'}</span>
              <button class="pro-pill-btn active" onclick="issueCatalogCoupon('${esc(item.id)}')">
                <i class="fa-solid fa-qrcode"></i> Выпустить купон
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  } else if (STATE.equityTab === 'contract') {
    contentHtml = `
      <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:14px;padding:18px">
        <h3 style="font-size:15.5px;font-weight:800;margin-bottom:6px">Шкала скидок на оплату контракта (Раздел 4.2 Низома)</h3>
        <p style="font-size:12.5px;color:var(--text-secondary);margin-bottom:14px">Скидка со 2-го семестра для студентов контрактной формы обучения из <b>ТОП-250 рейтинга</b> без задолженностей (макс. 50% за 5000 EQ).</p>
        <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px">
          ${EQUITY_NIZOM.contractScale.map(s => {
            const reached = STATE.eqContractSpentYear >= s.eq;
            return `
              <div style="padding:12px;border-radius:10px;border:1.5px solid ${reached ? 'var(--tsue-emerald)' : 'var(--border-color)'};background:${reached ? 'rgba(11,138,86,0.08)' : 'var(--bg-elevated)'}">
                <div style="font-size:18px;font-weight:800;color:${reached ? 'var(--tsue-emerald)' : 'var(--tsue-navy)'}">Скидка ${s.discount}%</div>
                <div style="font-size:12.5px;font-weight:700;margin-top:2px">${s.eq} Equity</div>
                <div style="font-size:10.5px;color:var(--text-muted);margin-top:4px">${reached ? '✓ Достигнуто' : `Осталось ${s.eq - STATE.eqContractSpentYear} EQ`}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else if (STATE.equityTab === 'earning') {
    contentHtml = `
      <table class="nizom-rule-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Основание для начисления (Раздел 3.2 Низома)</th>
            <th>Баллы Equity</th>
            <th>Периодичность и условия</th>
          </tr>
        </thead>
        <tbody>
          ${EQUITY_NIZOM.earningRules.map(r => `
            <tr>
              <td><b>${r.id}</b></td>
              <td>${esc(r.title)}</td>
              <td><span class="eq-badge-plus">${esc(r.points)}</span></td>
              <td style="color:var(--text-secondary)">${esc(r.period)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else if (STATE.equityTab === 'penalties') {
    contentHtml = `
      <table class="nizom-rule-table">
        <thead>
          <tr>
            <th>№</th>
            <th>Нарушение (Раздел 6.1 Низома)</th>
            <th>Санкция Комиссии</th>
            <th>Примечание</th>
          </tr>
        </thead>
        <tbody>
          ${EQUITY_NIZOM.penalties.map(p => `
            <tr>
              <td><b>${p.id}</b></td>
              <td>${esc(p.rule)}</td>
              <td><span class="eq-badge-minus">${esc(p.penalty)}</span></td>
              <td style="color:var(--text-secondary)">${esc(p.note)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  return `
    <div class="web-container">
      <div class="sched-toolbar-pro">
        <div class="sched-toolbar-row">
          <div>
            <h2 style="font-size:17px;font-weight:800">Баллы «Equity» по официальному Низому ТГЭУ</h2>
            <p style="font-size:12px;color:var(--text-muted)">Внутренняя единица ВУЗа (п. 1.4). Запрет P2P-переводов и продажи.</p>
          </div>
          <div class="equity-subtabs" style="margin-bottom:0">
            <button class="pro-pill-btn ${STATE.equityTab === 'catalog' ? 'active' : ''}" onclick="setEquityTab('catalog')">Каталог (Раздел 4)</button>
            <button class="pro-pill-btn ${STATE.equityTab === 'contract' ? 'active' : ''}" onclick="setEquityTab('contract')">Скидка контракта (п. 4.2)</button>
            <button class="pro-pill-btn ${STATE.equityTab === 'earning' ? 'active' : ''}" onclick="setEquityTab('earning')">Начисления (18 правил)</button>
            <button class="pro-pill-btn ${STATE.equityTab === 'penalties' ? 'active' : ''}" onclick="setEquityTab('penalties')">Штрафы (Раздел 6)</button>
          </div>
        </div>
      </div>
      ${contentHtml}
    </div>
  `;
}

function renderMobEquity() {
  return `
    <div style="display:flex;gap:5px;overflow-x:auto;padding-bottom:8px;margin-bottom:8px">
      <button class="pro-pill-btn ${STATE.equityTab === 'catalog' ? 'active' : ''}" onclick="setEquityTab('catalog')">Каталог</button>
      <button class="pro-pill-btn ${STATE.equityTab === 'contract' ? 'active' : ''}" onclick="setEquityTab('contract')">Контракт</button>
      <button class="pro-pill-btn ${STATE.equityTab === 'earning' ? 'active' : ''}" onclick="setEquityTab('earning')">Начисления</button>
      <button class="pro-pill-btn ${STATE.equityTab === 'penalties' ? 'active' : ''}" onclick="setEquityTab('penalties')">Штрафы</button>
    </div>

    ${STATE.equityTab === 'contract' ? `
      <div class="mob-section-card">
        <b style="font-size:12.5px;color:var(--tsue-navy)">Скидки на контракт для ТОП-250</b>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px">
          ${EQUITY_NIZOM.contractScale.slice(0, 6).map(s => `
            <div style="padding:8px;border-radius:7px;border:1px solid var(--border-color);background:var(--bg-elevated)">
              <div style="font-size:14px;font-weight:800;color:var(--tsue-navy)">Скидка ${s.discount}%</div>
              <div style="font-size:10.5px;color:var(--text-muted)">${s.eq} Equity</div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : STATE.equityTab === 'earning' ? `
      <div class="mob-section-card">
        <b style="font-size:12.5px;color:var(--tsue-navy)">18 Оснований начисления Equity</b>
        <div style="display:flex;flex-direction:column;gap:6px;margin-top:8px">
          ${EQUITY_NIZOM.earningRules.slice(0, 8).map(r => `
            <div style="padding:6px 0;border-bottom:1px solid var(--border-color);font-size:11px">
              <div style="display:flex;justify-content:space-between">
                <b>${r.id}. ${esc(r.title)}</b>
                <span class="eq-badge-plus">${esc(r.points)}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : `
      <div style="display:flex;flex-direction:column;gap:8px">
        ${EQUITY_NIZOM.catalogItems.map(item => `
          <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:11px;padding:10px">
            <div style="display:flex;justify-content:space-between;margin-bottom:3px">
              <span style="font-size:10px;font-weight:700;color:var(--tsue-blue-mid)">${esc(item.sec)}</span>
              <span class="eq-badge-plus">${item.cost} EQ</span>
            </div>
            <div style="font-size:12px;font-weight:700;margin-bottom:5px">${esc(item.title)}</div>
            <button class="pro-pill-btn active" style="width:100%;justify-content:center;padding:5px" onclick="issueCatalogCoupon('${esc(item.id)}')">
              Выпустить купон (${item.cost} EQ)
            </button>
          </div>
        `).join('')}
      </div>
    `}
  `;
}

// ==========================================================================
// МОДУЛЬ 4: QR-ОПЛАТА И КАССЫ АККРЕДИТОВАННЫХ МАГАЗИНОВ (HAMKORLAR POS)
// ==========================================================================

function setQrTab(tab) {
  STATE.qrTab = tab;
  renderAll();
}

function selectPosMerchant(mId) {
  STATE.selectedMerchantId = mId;
  STATE.selectedServiceIdx = 0;
  renderAll();
}

function payMerchantInvoiceNow() {
  const m = ACCREDITED_MERCHANTS.find(x => x.merchantId === STATE.selectedMerchantId) || ACCREDITED_MERCHANTS[0];
  const srv = m.allowedServices[STATE.selectedServiceIdx] || m.allowedServices[0];
  if (!srv) return;

  if (STATE.eqBalance < srv.cost) {
    showToast(`Недостаточно Equity (${srv.cost} EQ)`);
    return;
  }
  STATE.eqBalance -= srv.cost;
  const code = `EQ-PAID-${Math.floor(1000 + Math.random() * 9000)}`;
  STATE.activeCoupons.unshift({
    code,
    merchantId: m.merchantId,
    merchantName: m.name,
    itemTitle: srv.title,
    cost: srv.cost,
    issuedAt: '30.10.2026 13:00',
    expiresAt: 'ОПЛАЧЕНО В КАССЕ',
    status: 'PAID'
  });
  showToast(`Оплачено ${srv.cost} EQ → «${m.name}»`);
  renderAll();
}

function renderWebQrMerchant() {
  const activeMerchant = ACCREDITED_MERCHANTS.find(m => m.merchantId === STATE.selectedMerchantId) || ACCREDITED_MERCHANTS[0];
  const activeService = activeMerchant.allowedServices[STATE.selectedServiceIdx] || activeMerchant.allowedServices[0];
  const latestCoupon = STATE.activeCoupons[0];

  const qrPayload = JSON.stringify({
    ver: 'TSUE_EQ_QR_V2',
    merchant_id: activeMerchant.merchantId,
    inn: activeMerchant.inn,
    hemis_id: STATE.digitalIdentity.hemisId,
    code: latestCoupon ? latestCoupon.code : 'EQ-POS-901',
    eq: activeService ? activeService.cost : 20
  });

  return `
    <div class="web-container">
      <div class="sched-toolbar-pro">
        <div class="sched-toolbar-row">
          <div>
            <h2 style="font-size:17px;font-weight:800">Система QR-Оплаты и Касс Магазинов (Hamkorlar POS)</h2>
            <p style="font-size:12px;color:var(--text-muted)">Разрешение на приём QR выдаётся только аккредитованным партнёрам (п. 2.1, 8.1 Низома).</p>
          </div>
          <div style="display:flex;gap:8px">
            <button class="pro-pill-btn ${STATE.qrTab === 'student_pay' ? 'active' : ''}" onclick="setQrTab('student_pay')">1. Мои QR-Купоны</button>
            <button class="pro-pill-btn ${STATE.qrTab === 'merchant_pos' ? 'active' : ''}" onclick="setQrTab('merchant_pos')">2. Кассовый POS-терминал</button>
            <button class="pro-pill-btn ${STATE.qrTab === 'commission_reg' ? 'active' : ''}" onclick="setQrTab('commission_reg')">3. Реестр Аккредитации</button>
          </div>
        </div>
      </div>

      ${STATE.qrTab === 'commission_reg' ? `
        <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:14px;padding:18px">
          <table class="nizom-rule-table">
            <thead>
              <tr>
                <th>MERCHANT_ID</th>
                <th>Наименование магазина</th>
                <th>Категория</th>
                <th>ИНН</th>
                <th>Приказ / Решение Комиссии</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              ${ACCREDITED_MERCHANTS.map(m => `
                <tr>
                  <td style="font-family:'JetBrains Mono',monospace"><b>${esc(m.merchantId)}</b></td>
                  <td><b>${esc(m.name)}</b></td>
                  <td>${esc(m.category)}</td>
                  <td>${esc(m.inn)}</td>
                  <td>${esc(m.commissionOrder)}</td>
                  <td><span class="eq-badge-plus">АККРЕДИТОВАН</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      ` : `
        <div class="qr-pos-grid">
          <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:14px;padding:18px">
            <h3 style="font-size:15px;font-weight:800;margin-bottom:10px">
              ${STATE.qrTab === 'merchant_pos' ? 'Кассовый POS-терминал магазина: генерация счёта' : 'Оплата на кассе партнёра и активные купоны'}
            </h3>
            <div style="margin-bottom:12px">
              <label style="font-size:11px;font-weight:700;color:var(--text-muted)">Точка продаж / Магазин</label>
              <select class="pro-select" onchange="selectPosMerchant(this.value)">
                ${ACCREDITED_MERCHANTS.map(m => `<option value="${esc(m.merchantId)}" ${m.merchantId === STATE.selectedMerchantId ? 'selected' : ''}>${esc(m.name)}</option>`).join('')}
              </select>
            </div>

            <div style="margin-bottom:14px">
              <label style="font-size:11px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px">Услуга / Товар по прейскуранту:</label>
              <div style="display:flex;flex-direction:column;gap:6px">
                ${activeMerchant.allowedServices.map((s, idx) => `
                  <div onclick="STATE.selectedServiceIdx=${idx};renderAll()" style="padding:9px 12px;border-radius:8px;border:1.5px solid ${idx === STATE.selectedServiceIdx ? 'var(--tsue-blue-mid)' : 'var(--border-color)'};background:${idx === STATE.selectedServiceIdx ? 'rgba(0,72,153,0.08)' : 'var(--bg-elevated)'};cursor:pointer;display:flex;justify-content:space-between;align-items:center">
                    <span style="font-size:12.5px;font-weight:700">${esc(s.title)}</span>
                    <span class="eq-badge-plus">${s.cost} EQ</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <button class="pro-pill-btn active" style="width:100%;justify-content:center;padding:10px" onclick="payMerchantInvoiceNow()">
              Подтвердить оплату по QR (${activeService ? activeService.cost : 0} EQ)
            </button>
          </div>

          <div class="qr-receipt-card">
            <div style="font-size:11px;font-weight:800;color:var(--tsue-emerald)"><i class="fa-solid fa-lock"></i> HAMKOR POS VERIFIED</div>
            <h4 style="font-size:15px;font-weight:800;margin-top:3px">${esc(activeMerchant.name)}</h4>
            <div style="font-size:11px;color:var(--text-muted)">Касса: ${esc(activeMerchant.merchantId)}</div>
            <div class="qr-box-center" id="webMerchantQrCanvas" data-qr="${esc(qrPayload)}"></div>
            <div style="font-size:22px;font-weight:800;color:var(--tsue-navy)">${activeService ? activeService.cost : 0} Equity</div>
            <div style="font-size:12px;font-weight:600;color:var(--text-secondary);margin-top:2px">${esc(activeService ? activeService.title : '')}</div>
          </div>
        </div>
      `}
    </div>
  `;
}

function renderMobQrMerchant() {
  const activeMerchant = ACCREDITED_MERCHANTS.find(m => m.merchantId === STATE.selectedMerchantId) || ACCREDITED_MERCHANTS[0];
  const activeService = activeMerchant.allowedServices[STATE.selectedServiceIdx] || activeMerchant.allowedServices[0];
  const qrPayload = `TSUE_QR|${activeMerchant.merchantId}|${STATE.digitalIdentity.hemisId}|${activeService ? activeService.cost : 20}EQ`;

  return `
    <div style="display:flex;gap:5px;margin-bottom:8px">
      <button class="pro-pill-btn ${STATE.qrTab === 'student_pay' ? 'active' : ''}" style="flex:1;justify-content:center" onclick="setQrTab('student_pay')">Мои Купоны</button>
      <button class="pro-pill-btn ${STATE.qrTab === 'merchant_pos' ? 'active' : ''}" style="flex:1;justify-content:center" onclick="setQrTab('merchant_pos')">POS Касса</button>
    </div>

    <div class="mob-section-card" style="text-align:center">
      <div style="font-size:10px;font-weight:800;color:var(--tsue-emerald)">АККРЕДИТОВАННЫЙ HAMKOR POS</div>
      <div style="font-size:13px;font-weight:800;margin-top:2px">${esc(activeMerchant.name)}</div>
      <div class="qr-box-center" id="mobMerchantQrCanvas" data-qr="${esc(qrPayload)}" style="width:148px;height:148px"></div>
      <div style="font-size:18px;font-weight:800;color:var(--tsue-navy)">${activeService ? activeService.cost : 0} EQ</div>
      <div style="font-size:11px;color:var(--text-secondary);margin-bottom:8px">${esc(activeService ? activeService.title : '')}</div>
      <button class="pro-pill-btn active" style="width:100%;justify-content:center" onclick="payMerchantInvoiceNow()">
        Оплатить по QR (${activeService ? activeService.cost : 0} EQ)
      </button>
    </div>

    <div class="mob-section-card">
      <div style="font-size:12px;font-weight:800;margin-bottom:6px">Активные купоны (${STATE.activeCoupons.length})</div>
      ${STATE.activeCoupons.map(c => `
        <div style="padding:7px 0;border-bottom:1px solid var(--border-color);font-size:11px">
          <div style="display:flex;justify-content:space-between">
            <b>${esc(c.code)}</b>
            <span class="eq-badge-plus">${c.cost} EQ</span>
          </div>
          <div style="color:var(--text-muted);margin-top:2px">${esc(c.itemTitle)} (${esc(c.merchantName)})</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ==========================================================================
// МОДУЛЬ 5: RIAT-MESSENGER (TELEGRAM СТИЛЬ)
// ==========================================================================

function selectTgChat(chatId) {
  STATE.tgActiveChatId = chatId;
  const chat = TG_CHATS.find(c => c.id === chatId);
  if (chat) chat.unread = 0;
  renderAll();
}

function sendTgMessage() {
  const inp = document.getElementById('tgMsgInput');
  const mobInp = document.getElementById('mobTgMsgInput');
  const val = (inp?.value || mobInp?.value || '').trim();
  if (!val) return;

  const chat = TG_CHATS.find(c => c.id === STATE.tgActiveChatId) || TG_CHATS[0];
  chat.messages.push({
    sender: 'Вы',
    text: val,
    time: '13:05',
    out: true
  });
  if (inp) inp.value = '';
  if (mobInp) mobInp.value = '';
  renderAll();
}


function renderWebMessenger() {
  const activeChat = TG_CHATS.find(c => c.id === STATE.tgActiveChatId) || TG_CHATS[0];
  const q = (STATE.tgFolderFilter || 'all');
  const filteredChats = TG_CHATS.filter(c => q === 'all' || c.folder === q);

  return `
    <div class="web-container">
      <div class="tg-app-container">
        
        <!-- TELEGRAM ЛЕВАЯ КОЛОНКА СО СПИСКОМ ЧАТОВ -->
        <div class="tg-sidebar">
          <div class="tg-search-bar">
            <div style="display:flex;gap:6px;margin-bottom:8px">
              <input type="text" class="pro-input" style="padding:6px 10px;font-size:12px;border-radius:20px" placeholder="🔍 Поиск диалогов и сообщений...">
            </div>
            
            <!-- ПАПКИ В СТИЛЕ TELEGRAM -->
            <div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:2px">
              ${[
                { id: 'all', title: 'Все' },
                { id: 'channels', title: 'Каналы' },
                { id: 'groups', title: 'Группы' },
                { id: 'bots', title: 'Боты' },
                { id: 'personal', title: 'Личные' }
              ].map(f => `
                <button class="pro-pill-btn ${(STATE.tgFolderFilter || 'all') === f.id ? 'active' : ''}" style="font-size:10.5px;padding:3px 9px;border-radius:12px" onclick="STATE.tgFolderFilter='${f.id}';renderAll()">
                  ${f.title}
                </button>
              `).join('')}
            </div>
          </div>

          <div class="tg-chats-list">
            ${filteredChats.map(c => `
              <div class="tg-chat-item ${c.id === activeChat.id ? 'active' : ''}" onclick="selectTgChat('${c.id}')">
                <div class="tg-avatar-wrap">
                  <div class="tg-avatar" style="background:${c.avatarColor}">
                    ${c.avatarLetter}
                  </div>
                  ${c.online ? '<div class="tg-online-badge"></div>' : ''}
                </div>
                <div class="tg-chat-info">
                  <div class="tg-chat-title-row">
                    <div class="tg-chat-title">
                      ${c.pinned ? '<i class="fa-solid fa-thumbtack" style="font-size:10px;color:var(--text-muted);margin-right:3px"></i>' : ''}
                      ${esc(c.title)}
                      ${c.verified ? '<i class="fa-solid fa-circle-check" style="font-size:11px;color:var(--tsue-blue-mid);margin-left:3px"></i>' : ''}
                    </div>
                    <div class="tg-chat-time">${esc(c.messages[c.messages.length - 1]?.time || '')}</div>
                  </div>
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <div class="tg-chat-preview">${esc(c.messages[c.messages.length - 1]?.text || 'Нет сообщений')}</div>
                    ${c.unread ? `<div class="tg-chat-badge">${c.unread}</div>` : ''}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- TELEGRAM ПРАВОЕ ОКНО ДИАЛОГА -->
        <div class="tg-chat-window">
          <div class="tg-chat-header">
            <div style="display:flex;gap:12px;align-items:center">
              <div class="tg-avatar" style="width:38px;height:38px;font-size:13px;background:${activeChat.avatarColor}">
                ${activeChat.avatarLetter}
              </div>
              <div>
                <div style="font-size:13.5px;font-weight:800;color:var(--text-main);display:flex;align-items:center;gap:4px">
                  ${esc(activeChat.title)}
                  ${activeChat.verified ? '<i class="fa-solid fa-circle-check" style="font-size:12px;color:var(--tsue-blue-mid)"></i>' : ''}
                </div>
                <div style="font-size:11px;color:var(--text-muted)">${esc(activeChat.subtitle)}</div>
              </div>
            </div>

            <div style="display:flex;gap:8px;align-items:center">
              <button class="pro-pill-btn" title="Поиск в чате"><i class="fa-solid fa-magnifying-glass"></i></button>
              <button class="pro-pill-btn" title="Информация"><i class="fa-solid fa-circle-info"></i></button>
            </div>
          </div>

          <div class="tg-msgs-body">
            ${activeChat.messages.map(m => `
              <div class="tg-msg-bubble ${m.out ? 'out' : 'in'}">
                ${!m.out ? `<div style="font-size:11px;font-weight:800;color:var(--tsue-blue-mid);margin-bottom:3px">${esc(m.sender)}</div>` : ''}
                <div>${esc(m.text)}</div>
                <div class="tg-msg-meta">
                  <span>${esc(m.time)}</span>
                  ${m.out ? '<i class="fa-solid fa-check-double" style="font-size:9.5px;margin-left:3px"></i>' : ''}
                </div>
              </div>
            `).join('')}
          </div>

          <div class="tg-chat-footer">
            <button class="pro-pill-btn" style="border-radius:50%;width:38px;height:38px;padding:0;justify-content:center"><i class="fa-solid fa-paperclip"></i></button>
            <input type="text" id="tgMsgInput" class="pro-input" style="border-radius:20px;padding:9px 16px;font-size:13px" placeholder="Напишите сообщение..." onkeydown="if(event.key==='Enter')sendTgMessage()">
            <button class="pro-pill-btn active" style="border-radius:50%;width:38px;height:38px;padding:0;justify-content:center;background:var(--tsue-navy)" onclick="sendTgMessage()">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </div>

        </div>

      </div>
    </div>
  `;
}



function renderMobMessenger() {
  const activeChat = TG_CHATS.find(c => c.id === STATE.tgActiveChatId) || TG_CHATS[0];

  return `
    <div style="display:flex;gap:4px;overflow-x:auto;padding-bottom:6px;margin-bottom:6px">
      ${TG_CHATS.map(c => `
        <button class="pro-pill-btn ${c.id === activeChat.id ? 'active' : ''}" style="white-space:nowrap;font-size:10.5px;padding:4px 9px" onclick="selectTgChat('${c.id}')">
          ${esc(c.title.split(' ')[0])}
        </button>
      `).join('')}
    </div>

    <div class="mob-section-card" style="display:flex;flex-direction:column;height:calc(100vh - 290px);padding:0;overflow:hidden">
      <!-- ТЕЛЕГРАМ ШАПКА ДИАЛОГА -->
      <div style="padding:10px 12px;background:var(--bg-elevated);border-bottom:1px solid var(--border-color);display:flex;align-items:center;gap:10px">
        <div class="tg-avatar" style="width:34px;height:34px;font-size:12px;background:${activeChat.avatarColor}">
          ${activeChat.avatarLetter}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
            ${esc(activeChat.title)}
          </div>
          <div style="font-size:10px;color:var(--text-muted)">${esc(activeChat.subtitle)}</div>
        </div>
      </div>

      <!-- ЛЕНТА СООБЩЕНИЙ -->
      <div style="flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:8px;padding:12px;background:var(--bg-page)">
        ${activeChat.messages.map(m => `
          <div class="tg-msg-bubble ${m.out ? 'out' : 'in'}" style="max-width:86%;font-size:11.5px;padding:7px 11px">
            ${!m.out ? `<div style="font-size:10px;font-weight:800;color:var(--tsue-blue-mid);margin-bottom:2px">${esc(m.sender)}</div>` : ''}
            <div>${esc(m.text)}</div>
            <div class="tg-msg-meta">
              <span>${esc(m.time)}</span>
              ${m.out ? '<i class="fa-solid fa-check-double" style="font-size:8.5px;margin-left:2px"></i>' : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- ВВОД СООБЩЕНИЯ В СТИЛЕ TELEGRAM -->
      <div style="display:flex;gap:6px;padding:8px 10px;background:var(--bg-surface);border-top:1px solid var(--border-color);align-items:center">
        <i class="fa-solid fa-paperclip" style="color:var(--text-muted);font-size:14px;padding:4px"></i>
        <input type="text" id="mobTgMsgInput" class="pro-input" style="padding:6px 12px;font-size:11.5px;border-radius:18px;flex:1" placeholder="Сообщение..." onkeydown="if(event.key==='Enter')sendTgMessage()">
        <button class="pro-pill-btn active" style="border-radius:50%;width:32px;height:32px;padding:0;justify-content:center;background:var(--tsue-navy)" onclick="sendTgMessage()">
          <i class="fa-solid fa-paper-plane" style="font-size:11px"></i>
        </button>
      </div>
    </div>
  `;
}


// ==========================================================================
// МОДУЛЬ 6: ДИНАМИЧЕСКИЙ ЦИФРОВОЙ ID (HEMIS / STUDENT ID / JSHSHIR)
// ==========================================================================

function updateDynamicIdentityField(field, val) {
  STATE.digitalIdentity[field] = val.trim();
  renderAll();
}



function renderWebDigitalId() {
  const idObj = STATE.digitalIdentity;
  const qrData = 'MYGOV_TSUE|HEMIS:' + idObj.hemisId + '|STUDENT_ID:' + idObj.studentId + '|JSHSHIR:' + idObj.jshshir + '|GRP:' + idObj.group + '|SEC_KEY:TDIU_' + Date.now();

  return `
    <div class="web-container">
      <div class="qr-pos-grid">
        
        <!-- ОФИЦИАЛЬНЫЙ СТУДЕНЧЕСКИЙ БИЛЕТ В СТИЛЕ MYGOV + HEMIS OTM 4.4.7 -->
        <div>
          <div class="mygov-pass-card">
            <i class="fa-solid fa-building-columns mygov-watermark"></i>
            <div class="mygov-pass-top">
              <div style="display:flex;align-items:center;gap:10px">
                <img src="/assets/images/faculty_logo.png" style="width:38px;height:38px;border-radius:50%;background:#FFF;padding:2px">
                <div>
                  <div style="font-size:11px;font-weight:800;letter-spacing:0.5px">O‘ZBEKISTON RESPUBLIKASI OLIY TA’LIM VAZIRLIGI</div>
                  <div style="font-size:13px;font-weight:800;color:var(--tsue-gold)">TOSHKENT DAVLAT IQTISODIYOT UNIVERSITETI</div>
                </div>
              </div>
              <div style="text-align:right">
                <span style="background:rgba(212,160,23,0.25);border:1px solid var(--tsue-gold);color:#FFF;padding:3px 8px;border-radius:6px;font-size:10px;font-weight:800">
                  <i class="fa-solid fa-shield-halved"></i> MyGOV · HEMIS v4.4
                </span>
              </div>
            </div>

            <div class="mygov-pass-body">
              <div style="position:relative">
                <img src="/assets/teachers/raqamli/Ilxamova Yodgorxon Saidaxmedovna.png" class="mygov-pass-photo" onerror="this.src='/assets/images/faculty_logo.png'">
                <div style="position:absolute;bottom:4px;right:4px;background:#047857;color:#FFF;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:10px" title="Face ID verifikatsiyadan o'tgan">
                  <i class="fa-solid fa-user-check"></i>
                </div>
              </div>

              <div style="flex:1;font-size:12px;line-height:1.45">
                <div style="font-size:16px;font-weight:800;margin-bottom:3px">${esc(idObj.fullName)}</div>
                <div style="color:#CBD5E1">Fakultet: <b>Raqamli iqtisodiyot va IT</b></div>
                <div style="color:#CBD5E1">Guruh: <b>${esc(idObj.group)}</b> · Bosqich: <b>2-kurs</b></div>
                <div style="color:#CBD5E1">HEMIS ID: <b style="letter-spacing:0.5px">${esc(idObj.hemisId)}</b></div>
                <div style="color:#CBD5E1">JSHSHIR: <b>${esc(idObj.jshshir)}</b></div>
                <div style="font-size:10.5px;color:var(--tsue-gold);margin-top:4px">
                  <i class="fa-solid fa-fingerprint"></i> Biometrik autentifikatsiya & Face Detection: <b>FAOL</b>
                </div>
              </div>

              <div class="mygov-pass-qr-box">
                <div class="qr-box-center" id="mygovWebQrCanvas" data-qr="${esc(qrData)}" style="width:96px;height:96px"></div>
              </div>
            </div>

            <div style="margin-top:14px;padding-top:10px;border-top:1px solid rgba(255,255,255,0.15);display:flex;justify-content:space-between;align-items:center;font-size:10.5px;color:#CBD5E1">
              <span>Berilgan: <b>02.09.2024</b></span>
              <span>Amal qilish: <b>30.06.2028</b></span>
              <button class="pro-pill-btn" style="background:#047857;color:#FFF;border:none;padding:3px 8px;font-size:10px" onclick="simulateTurnstileTap()">
                <i class="fa-solid fa-id-badge"></i> Simulyatsiya: Turniketga bosish
              </button>
            </div>
          </div>
        </div>

        <!-- ЖУРНАЛ ПРОХОДОВ ТУРНИКЕТОВ КАМПУСА (LIVE ACCESS LOG) -->
        <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:14px;padding:20px;box-shadow:var(--shadow-card)">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <h3 style="font-size:16px;font-weight:800"><i class="fa-solid fa-door-open" style="color:var(--tsue-blue-mid);margin-right:6px"></i> Tizimli Kirish-Chiqish Tarixi (Turniketlar)</h3>
            <span style="font-size:11px;color:#047857;font-weight:700">● ONLAYN MONITORING</span>
          </div>

          <p style="font-size:12px;color:var(--text-secondary);margin-bottom:14px">
            Barcha korpuslar, kutubxona va kovorking hududlariga NFC/QR yoki Face ID orqali amalga oshirilgan oxirgi proyektlar.
          </p>

          <div style="display:flex;flex-direction:column;gap:8px;max-height:220px;overflow-y:auto;padding-right:4px">
            ${STATE.turnstilePassHistory.map(h => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:var(--bg-elevated);border-radius:8px;border:1px solid var(--border-color);font-size:12px">
                <div style="display:flex;gap:10px;align-items:center">
                  <div style="width:30px;height:30px;border-radius:6px;background:rgba(0,59,129,0.1);display:flex;align-items:center;justify-content:center;color:var(--tsue-blue-mid)">
                    <i class="fa-solid ${h.icon}"></i>
                  </div>
                  <div>
                    <div style="font-weight:700">${esc(h.gate)}</div>
                    <div style="font-size:10.5px;color:var(--text-muted)">${esc(h.time)}</div>
                  </div>
                </div>
                <span style="background:rgba(4,120,87,0.12);color:#047857;border:1px solid #047857;padding:3px 8px;border-radius:6px;font-size:10.5px;font-weight:800">
                  ${esc(h.status)}
                </span>
              </div>
            `).join('')}
          </div>

          <div style="display:flex;gap:8px;margin-top:14px">
            <button class="pro-pill-btn active" style="flex:1;justify-content:center;padding:8px" onclick="simulateTurnstileTap()">
              <i class="fa-solid fa-qrcode"></i> Turniketdan O'tish
            </button>
            <button class="pro-pill-btn" style="flex:1;justify-content:center;padding:8px" onclick="openHemisTranscriptModal()">
              <i class="fa-solid fa-graduation-cap"></i> Reyting Daftarchasi
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}






function renderMobDigitalId() { return renderHemisExactAllServices(); }




function drawActiveQrCodes() {
  const qrIds = [
    'webMerchantQrCanvas',
    'mobMerchantQrCanvas',
    'webDigitalIdQrCanvas',
    'mobDigitalIdQrCanvas',
    'mygovWebQrCanvas',
    'mygovMobQrCanvas',
    'hemisMobQrCanvas'
  ];
  qrIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.getAttribute('data-qr') || 'TSUE_ECOSYSTEM';
    el.innerHTML = '';
    const w = Math.max(80, (el.clientWidth || 160) - 10);
    const h = Math.max(80, (el.clientHeight || 160) - 10);
    if (typeof QRCode !== 'undefined') {
      try {
        new QRCode(el, {
          text: text.slice(0, 180),
          width: w,
          height: h,
          colorDark: '#00224D',
          colorLight: '#FFFFFF',
          correctLevel: QRCode.CorrectLevel.M
        });
      } catch (e) {
        console.warn('QR Code generation notice:', e);
      }
    } else {
      el.innerHTML = '<i class="fa-solid fa-qrcode" style="font-size:60px;color:#00224D"></i>';
    }
  });
}

document.addEventListener('click', e => {
  if (!e.target.closest('.tsue-omni-search') && !e.target.closest('.mob-omni-bar')) {
    const d1 = document.getElementById('globalOmniDropdown');
    const d2 = document.getElementById('mobOmniDropdown');
    if (d1) d1.style.display = 'none';
    if (d2) d2.style.display = 'none';
  }
});

window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('liquid-glass', 'dark-mode');
  const groups = Object.keys(window.EDUPAGE_SCHEDULE_DATA || {});
  if (groups.length > 0 && !groups.includes(STATE.schedGroup)) {
    STATE.schedGroup = groups[0];
  }
  renderAll();
});


function renderWebSettings() {
  return `
    <div class="web-container">
      <div style="background:var(--bg-surface);border:1px solid var(--border-color);border-radius:14px;padding:24px;box-shadow:var(--shadow-card)">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--border-color)">
          <div>
            <h2 style="font-size:20px;font-weight:800;color:var(--text-main)"><i class="fa-solid fa-sliders" style="color:var(--tsue-gold);margin-right:8px"></i> Настройки Экосистемы и Персонализация</h2>
            <p style="font-size:13px;color:var(--text-secondary);margin-top:2px">Управление темами оформления, цветовыми палитрами HEMIS, стилем Liquid Glass и параметрами аккаунта.</p>
          </div>
          <button class="pro-pill-btn active" onclick="showToast('Все настройки синхронизированы с вашим профилем!')">
            <i class="fa-solid fa-floppy-disk"></i> Сохранить настройки
          </button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
          
          <!-- БЛОК 1: ТЕМЫ И LIQUID GLASS (КАК В HEMIS) -->
          <div style="background:var(--bg-elevated);border:1px solid var(--border-color);border-radius:12px;padding:18px">
            <h3 style="font-size:15px;font-weight:800;margin-bottom:12px;color:var(--text-main)">
              <i class="fa-solid fa-wand-magic-sparkles" style="color:var(--tsue-blue-mid)"></i> Визуальный стиль и Liquid Glass
            </h3>
            
            <div style="margin-bottom:16px">
              <label style="font-size:12px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:8px">Стиль интерфейса (HEMIS Liquid Glass)</label>
              <div style="display:flex;gap:10px">
                <button class="pro-pill-btn ${STATE.liquidGlassEnabled ? 'active' : ''}" style="flex:1;justify-content:center;padding:10px" onclick="if(!STATE.liquidGlassEnabled)toggleLiquidGlass()">
                  <i class="fa-solid fa-droplet"></i> Liquid Glass (Стекло)
                </button>
                <button class="pro-pill-btn ${!STATE.liquidGlassEnabled ? 'active' : ''}" style="flex:1;justify-content:center;padding:10px" onclick="if(STATE.liquidGlassEnabled)toggleLiquidGlass()">
                  <i class="fa-solid fa-square"></i> Flat Classic (Строгий)
                </button>
              </div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:6px">
                Liquid Glass добавляет мягкое стеклянное размытие (backdrop-filter) и градиентное свечение элементов как в обновленной системе HEMIS.
              </div>
            </div>

            <div style="margin-bottom:16px">
              <label style="font-size:12px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:8px">Цветовая гамма HEMIS</label>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
                <button class="pro-pill-btn ${STATE.currentThemePalette === 'hemis' ? 'active' : ''}" style="justify-content:center;padding:8px" onclick="setThemePalette('hemis')">
                  <span style="width:10px;height:10px;background:#003B81;border-radius:50%;margin-right:6px"></span> TSUE Blue
                </button>
                <button class="pro-pill-btn ${STATE.currentThemePalette === 'emerald' ? 'active' : ''}" style="justify-content:center;padding:8px" onclick="setThemePalette('emerald')">
                  <span style="width:10px;height:10px;background:#059669;border-radius:50%;margin-right:6px"></span> HEMIS Emerald
                </button>
                <button class="pro-pill-btn ${STATE.currentThemePalette === 'purple' ? 'active' : ''}" style="justify-content:center;padding:8px" onclick="setThemePalette('purple')">
                  <span style="width:10px;height:10px;background:#7E22CE;border-radius:50%;margin-right:6px"></span> Tech Purple
                </button>
                <button class="pro-pill-btn ${STATE.currentThemePalette === 'indigo' ? 'active' : ''}" style="justify-content:center;padding:8px" onclick="setThemePalette('indigo')">
                  <span style="width:10px;height:10px;background:#4338CA;border-radius:50%;margin-right:6px"></span> Deep Indigo
                </button>
              </div>
            </div>

            <div>
              <label style="font-size:12px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:8px">Режим освещения</label>
              <div style="display:flex;gap:10px">
                <button class="pro-pill-btn ${!STATE.dark ? 'active' : ''}" style="flex:1;justify-content:center" onclick="if(STATE.dark)toggleTheme()">
                  <i class="fa-solid fa-sun"></i> Светлая тема
                </button>
                <button class="pro-pill-btn ${STATE.dark ? 'active' : ''}" style="flex:1;justify-content:center" onclick="if(!STATE.dark)toggleTheme()">
                  <i class="fa-solid fa-moon"></i> Тёмная тема
                </button>
              </div>
            </div>

          </div>

          <!-- БЛОК 2: АКАДЕМИЧЕСКИЕ И УВЕДОМИТЕЛЬНЫЕ ПАРАМЕТРЫ -->
          <div style="background:var(--bg-elevated);border:1px solid var(--border-color);border-radius:12px;padding:18px">
            <h3 style="font-size:15px;font-weight:800;margin-bottom:12px;color:var(--text-main)">
              <i class="fa-solid fa-bell" style="color:var(--tsue-gold)"></i> Уведомления и параметры расписания
            </h3>

            <div style="margin-bottom:14px">
              <label style="font-size:12px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px">Уведомления о переносе пар</label>
              <div style="font-size:12px;color:var(--text-secondary)">Получать мгновенный push в Telegram за 30 мин до начала занятия</div>
            </div>

            <div style="margin-bottom:14px">
              <label style="font-size:12px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px">Язык интерфейса по умолчанию</label>
              <div style="display:flex;gap:8px">
                <button class="pro-pill-btn ${STATE.lang === 'uz' ? 'active' : ''}" onclick="setLang('uz')">O‘zbekcha</button>
                <button class="pro-pill-btn ${STATE.lang === 'ru' ? 'active' : ''}" onclick="setLang('ru')">Русский</button>
                <button class="pro-pill-btn ${STATE.lang === 'en' ? 'active' : ''}" onclick="setLang('en')">English</button>
              </div>
            </div>

            <div style="margin-bottom:14px">
              <label style="font-size:12px;font-weight:700;color:var(--text-muted);display:block;margin-bottom:4px">Текущая академическая группа по умолчанию</label>
              <input type="text" class="pro-input" value="${esc(STATE.schedGroup)}" onchange="onSchedGroupChange(this.value)">
            </div>

          </div>

        </div>
      </div>
    </div>
  `;
}

function renderMobSettings() {
  return `
    <div class="mob-section-card">
      <div style="font-size:14px;font-weight:800;margin-bottom:12px;display:flex;align-items:center;gap:6px">
        <i class="fa-solid fa-sliders" style="color:var(--tsue-gold)"></i> Настройки приложения
      </div>

      <!-- LIQUID GLASS ПЕРЕКЛЮЧАТЕЛЬ -->
      <div style="padding:10px 0;border-bottom:1px solid var(--border-color)">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <div>
            <div style="font-size:12px;font-weight:700">Стиль HEMIS Liquid Glass</div>
            <div style="font-size:10.5px;color:var(--text-muted)">Размытие и мягкое свечение</div>
          </div>
          <button class="pro-pill-btn ${STATE.liquidGlassEnabled ? 'active' : ''}" onclick="toggleLiquidGlass()">
            ${STATE.liquidGlassEnabled ? 'ВКЛ' : 'ВЫКЛ'}
          </button>
        </div>
      </div>

      <!-- ТЕМА ОФОРМЛЕНИЯ -->
      <div style="padding:10px 0;border-bottom:1px solid var(--border-color)">
        <div style="font-size:12px;font-weight:700;margin-bottom:6px">Тема (Светлая / Тёмная)</div>
        <div style="display:flex;gap:6px">
          <button class="pro-pill-btn ${!STATE.dark ? 'active' : ''}" style="flex:1;justify-content:center;font-size:11px" onclick="if(STATE.dark)toggleTheme()">
            <i class="fa-solid fa-sun"></i> Светлая
          </button>
          <button class="pro-pill-btn ${STATE.dark ? 'active' : ''}" style="flex:1;justify-content:center;font-size:11px" onclick="if(!STATE.dark)toggleTheme()">
            <i class="fa-solid fa-moon"></i> Тёмная
          </button>
        </div>
      </div>

      <!-- ЦВЕТОВЫЕ ГАММЫ HEMIS -->
      <div style="padding:10px 0;border-bottom:1px solid var(--border-color)">
        <div style="font-size:12px;font-weight:700;margin-bottom:6px">Цветовая палитра HEMIS</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          <button class="pro-pill-btn ${STATE.currentThemePalette === 'hemis' ? 'active' : ''}" style="font-size:10.5px;padding:6px;justify-content:center" onclick="setThemePalette('hemis')">
            TSUE Blue
          </button>
          <button class="pro-pill-btn ${STATE.currentThemePalette === 'emerald' ? 'active' : ''}" style="font-size:10.5px;padding:6px;justify-content:center" onclick="setThemePalette('emerald')">
            HEMIS Emerald
          </button>
          <button class="pro-pill-btn ${STATE.currentThemePalette === 'purple' ? 'active' : ''}" style="font-size:10.5px;padding:6px;justify-content:center" onclick="setThemePalette('purple')">
            Tech Purple
          </button>
          <button class="pro-pill-btn ${STATE.currentThemePalette === 'indigo' ? 'active' : ''}" style="font-size:10.5px;padding:6px;justify-content:center" onclick="setThemePalette('indigo')">
            Deep Indigo
          </button>
        </div>
      </div>

      <!-- ЯЗЫК -->
      <div style="padding:10px 0">
        <div style="font-size:12px;font-weight:700;margin-bottom:6px">Язык интерфейса</div>
        <div style="display:flex;gap:6px">
          <button class="pro-pill-btn ${STATE.lang === 'uz' ? 'active' : ''}" style="flex:1;justify-content:center;font-size:11px" onclick="setLang('uz')">UZ</button>
          <button class="pro-pill-btn ${STATE.lang === 'ru' ? 'active' : ''}" style="flex:1;justify-content:center;font-size:11px" onclick="setLang('ru')">RU</button>
          <button class="pro-pill-btn ${STATE.lang === 'en' ? 'active' : ''}" style="flex:1;justify-content:center;font-size:11px" onclick="setLang('en')">EN</button>
        </div>
      </div>

    </div>
  `;
}

// Модальные окна детального просмотра GPA, Контракта и IFI
function showGpaDetailModal() {
  openProModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid var(--border-color);padding-bottom:12px">
      <div style="display:flex;gap:10px;align-items:center">
        <div class="lt-icon lt-emerald" style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:#047857;color:#FFF">
          <i class="fa-solid fa-graduation-cap"></i>
        </div>
        <div>
          <h3 style="font-size:17px;font-weight:800">Академическая успеваемость & GPA</h3>
          <div style="font-size:11.5px;color:var(--text-muted)">Расчет по ECTS кредитам и баллам HEMIS</div>
        </div>
      </div>
      <button class="pro-pill-btn" onclick="closeProModal()">✕</button>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px">
      <div style="background:var(--bg-elevated);padding:14px;border-radius:10px;border:1px solid var(--border-color)">
        <div style="font-size:11px;color:var(--text-muted);font-weight:700">Текущий GPA студента</div>
        <div style="font-size:32px;font-weight:800;color:#047857">${STATE.gpa}</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px">Претендент на государственный грант (порог ≥ 3.50)</div>
      </div>

      <div style="background:var(--bg-elevated);padding:14px;border-radius:10px;border:1px solid var(--border-color)">
        <div style="font-size:11px;color:var(--text-muted);font-weight:700">Освоенные кредиты ECTS</div>
        <div style="font-size:32px;font-weight:800;color:var(--tsue-navy)">60 / 60</div>
        <div style="font-size:11px;color:var(--text-secondary);margin-top:2px">Академических задолженностей нет</div>
      </div>
    </div>

    <div style="font-size:12.5px;font-weight:800;margin-bottom:8px">Оценки по модулям текущего семестра:</div>
    <div style="display:flex;flex-direction:column;gap:6px;font-size:12px">
      <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg-elevated);border-radius:8px">
        <span>Цифровая экономика (6 кредитов)</span>
        <b style="color:#047857">94 балла (5 / Отлично)</b>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg-elevated);border-radius:8px">
        <span>Базы данных и SQL (5 кредитов)</span>
        <b style="color:#047857">91 балл (5 / Отлично)</b>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg-elevated);border-radius:8px">
        <span>Алгоритмы и структуры данных (5 кредитов)</span>
        <b style="color:#1D4ED8">86 баллов (4 / Хорошо)</b>
      </div>
    </div>
  `);
}

function showContractDetailModal() {
  openProModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid var(--border-color);padding-bottom:12px">
      <div style="display:flex;gap:10px;align-items:center">
        <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:var(--tsue-gold);color:#001530;font-size:18px">
          <i class="fa-solid fa-file-invoice-dollar"></i>
        </div>
        <div>
          <h3 style="font-size:17px;font-weight:800">Финансовый контракт и скидка за EQ</h3>
          <div style="font-size:11.5px;color:var(--text-muted)">Договор №CON-2024-8491 · Бакалавриат</div>
        </div>
      </div>
      <button class="pro-pill-btn" onclick="closeProModal()">✕</button>
    </div>

    <div style="background:var(--bg-elevated);border-radius:10px;padding:16px;margin-bottom:14px;border:1px solid var(--border-color)">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:12px;color:var(--text-muted)">Сумма контракта за 2024/2025 учебный год:</span>
        <b style="font-size:13px">16 800 000 сум</b>
      </div>
      <div style="display:flex;justify-content:space-between;margin-bottom:6px">
        <span style="font-size:12px;color:var(--text-muted)">Оплачено фактически:</span>
        <b style="font-size:13px;color:#047857">12 600 000 сум (75%)</b>
      </div>
      <div style="display:flex;justify-content:space-between;padding-top:6px;border-top:1px solid var(--border-color)">
        <span style="font-size:12px;color:var(--text-muted)">Остаток к оплате:</span>
        <b style="font-size:14px;color:var(--tsue-danger)">4 200 000 сум (25%)</b>
      </div>
    </div>

    <div style="background:rgba(212,160,23,0.12);border:1px solid var(--tsue-gold);border-radius:10px;padding:14px;font-size:12.5px;color:var(--text-main);margin-bottom:14px">
      <b style="color:var(--tsue-navy)"><i class="fa-solid fa-coins"></i> Погашение остатка через Equity (EQ):</b>
      <p style="margin-top:4px;line-height:1.4">
        Согласно пункту 2.3 Устава Equity, студенты с балансом от <b>400 EQ</b> имеют право на 25% скидку на контракт. Ваш текущий баланс: <b>${STATE.eqBalance} EQ</b> (необходимо еще 115 EQ).
      </p>
    </div>

    <button class="pro-pill-btn active" style="width:100%;justify-content:center;padding:10px" onclick="closeProModal();navigateTo('equity')">
      Перейти к правилам начисления EQ →
    </button>
  `);
}

function showIfiDetailModal() {
  openProModal(`
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;border-bottom:1px solid var(--border-color);padding-bottom:12px">
      <div style="display:flex;gap:10px;align-items:center">
        <div style="width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:#2563EB;color:#FFF;font-size:18px">
          <i class="fa-solid fa-chart-line"></i>
        </div>
        <div>
          <h3 style="font-size:17px;font-weight:800">Рейтинг Ijtimoiy Faollik Indeksi (IFI)</h3>
          <div style="font-size:11.5px;color:var(--text-muted)">11 официальных критериев социальной и научной активности</div>
        </div>
      </div>
      <button class="pro-pill-btn" onclick="closeProModal()">✕</button>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;background:var(--bg-elevated);padding:14px;border-radius:10px;margin-bottom:14px;border:1px solid var(--border-color)">
      <div>
        <div style="font-size:11px;color:var(--text-muted);font-weight:700">Итоговый балл IFI</div>
        <div style="font-size:32px;font-weight:800;color:#2563EB">${STATE.ifiScore} / 100</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:12px;font-weight:700;color:#047857">1-я категория активности</div>
        <div style="font-size:11px;color:var(--text-muted)">ТОП-5 по факультету</div>
      </div>
    </div>

    <div style="font-size:12.5px;font-weight:800;margin-bottom:8px">Начисленные баллы по критериям:</div>
    <div style="display:flex;flex-direction:column;gap:6px;font-size:11.5px">
      <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg-elevated);border-radius:8px">
        <span>1. Научные статьи и патенты</span>
        <b>20 / 20 баллов</b>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg-elevated);border-radius:8px">
        <span>2. Олимпиады и хакатоны</span>
        <b>18 / 20 баллов</b>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg-elevated);border-radius:8px">
        <span>3. Общественные и волонтерские проекты</span>
        <b>25 / 25 баллов</b>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 12px;background:var(--bg-elevated);border-radius:8px">
        <span>4. Спортивные и культурные клубы ТГЭУ</span>
        <b>21.5 / 25 баллов</b>
      </div>
    </div>
  `);
}
