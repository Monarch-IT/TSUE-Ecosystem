

const TG_CHANNELS = [
  {
    id: 'tutor-direct-umar',
    type: 'direct',
    folder: 'direct',
    name: 'Abdurahmonov Umar (Guruh tyutori · RST-81/25)',
    verified: true,
    avatarBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    avatarIcon: 'fa-chalkboard-user',
    unread: 1,
    statusText: 'в сети · +998 90 345 12 67',
    desc: 'Ota-onalar va talabalar uchun guruh tyutori Abdurahmonov Umar bilan bevosita tezkor aloqa (davomat, TTJdan ruxsat olish, ijara xonadonlari).',
    members: [
      { name: 'Abdurahmonov Umar', role: 'Guruh tyutori (RST-81/25, RST-83/25)', status: 'в сети' },
      { name: 'Shodiyev Bekmurod aka', role: "Ota-ona (Ro'ziyev Qodirjonning otasi)", status: 'в сети' },
      { name: "Ro'ziyev Qodirjon", role: 'Talaba (RST-81/25)', status: 'был(а) недавно' }
    ]
  },
  {
    id: 'dekanat-channel',
    type: 'channel',
    folder: 'channels',
    name: 'Dekanat · Raqamli iqtisodiyot va AT fakulteti',
    verified: true,
    avatarBg: 'linear-gradient(135deg, #004899, #00224d)',
    avatarIcon: 'fa-bullhorn',
    unread: 2,
    statusText: '2,450 obunachi',
    desc: 'Raqamli Iqtisodiyot va Axborot Texnologiyalari Fakulteti dekanati rasmiy axborot kanali.',
    members: [
      { name: 'Akbarov Nodir G‘afurovich', role: 'Fakultet dekani (+998 71 245 42 43)', status: 'был(а) недавно' },
      { name: 'Amonov Alisher Radjab o‘g‘li', role: "Yoshlar bilan ishlash bo'yicha dekan o'rinbosari (+998 71 239 01 29)", status: 'в сети' },
      { name: 'Yo‘ldoshev Ulug‘bek Asqar o‘g‘li', role: "O'quv ishlari bo'yicha dekan o'rinbosari", status: 'был(а) 15 минут назад' }
    ]
  },
  {
    id: 'academic-group-rst81',
    type: 'group',
    folder: 'groups',
    name: 'Guruh RST-81/25 «Raqamli iqtisodiyot»',
    verified: false,
    avatarBg: 'linear-gradient(135deg, #0284c7, #0369a1)',
    avatarIcon: 'fa-graduation-cap',
    unread: 0,
    statusText: '28 ishtirokchi, 6 tasi tarmoqda',
    desc: 'RST-81/25 o‘quv guruhi rasmiy akademik chati. Guruh tyutori: Abdurahmonov Umar.',
    members: [
      { name: 'Abdurahmonov Umar', role: 'Guruh tyutori', status: 'в сети' },
      { name: "Ro'ziyev Qodirjon", role: 'Talaba (RST-81/25)', status: 'в сети' },
      { name: 'Karimov Aziz', role: 'Guruh sardori', status: 'в сети' },
      { name: 'Rahimova Nigora', role: 'Talaba', status: 'была(а) час назад' }
    ]
  },
  {
    id: 'kafedra-is',
    type: 'channel',
    folder: 'channels',
    name: 'Кафедра «Информационные Системы»',
    verified: true,
    avatarBg: 'linear-gradient(135deg, #0d9488, #115e59)',
    avatarIcon: 'fa-server',
    unread: 1,
    statusText: '840 подписчиков',
    desc: 'Научные семинары, темы выпускных квалификационных работ и практические стажировки.',
    members: [
      { name: 'Махамаджанов Акбар', role: 'Зам. декана по науке', status: 'в сети' },
      { name: 'Куратор производственной практики', role: 'Кафедра ИС', status: 'был(а) вчера' }
    ]
  },
  {
    id: 'bot-equity-ai',
    type: 'bot',
    folder: 'bots',
    name: 'RIAT Academic AI & Equity Bot',
    verified: true,
    avatarBg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    avatarIcon: 'fa-robot',
    unread: 0,
    statusText: 'бот',
    desc: 'Виртуальный ассистент расписания, начисления баллов Equity (EQT) и QR-пропусков ТТЖ.',
    members: [
      { name: 'RIAT Academic Bot', role: 'Официальный Telegram-бот', status: 'всегда в сети' }
    ]
  }
];

const DEFAULT_TG_MESSAGES = {
  'tutor-direct-umar': [
    {
      id: 301,
      author: 'Abdurahmonov Umar',
      authorRole: 'Guruh tyutori · RST-81/25',
      text: "Assalomu alaykum, Bekmurod aka! Farzandingiz <b>Ro'ziyev Qodirjon</b> (RST-81/25) sentyabr oyidan beri <b>36 soat (18 para)</b> sababsiz dars qoldirgan. Shuningdek, shanba-yakshanba kunlari TTJ-5 yotoqxonasidan uyga (Samarqandga) borib kelish uchun elektron ariza yubordi. Ota-ona profilidan <b>Face ID</b> orqali tasdiqlab bersangiz, men ham yashil tugmani bosib ruxsat beraman.",
      time: '11:30',
      out: false
    },
    {
      id: 302,
      author: 'Shodiyev Bekmurod aka',
      authorRole: 'Ota-ona',
      text: "Va alaykum assalom, Umarjon! Xabar uchun katta rahmat. Hozir Ota-ona profilidan Face ID orqali ruxsatnomani tasdiqladim. Davomati va 6 mln so'm kontrakt qoldig'i bo'yicha bugun o'zi bilan gaplashib, chora ko'raman.",
      time: '11:42',
      out: true
    },
    {
      id: 303,
      author: 'Abdurahmonov Umar',
      authorRole: 'Guruh tyutori · RST-81/25',
      text: "Rahmat, Bekmurod aka! Tizimda sizning Face ID tasdig'ingiz <b>Yashil</b> bo'lib ko'rindi. Men ham TTJ tarbiyachi-pedagogi va dekan o'rinbosari uchun elektron ruxsatnomani tasdiqladim.",
      time: '11:45',
      out: false
    }
  ],
  'dekanat-channel': [
    {
      id: 1,
      author: 'Akbarov Nodir G‘afurovich',
      authorRole: 'Fakultet dekani',
      text: '<b>Hurmatli Raqamli Iqtisodiyot va Axborot Texnologiyalari Fakulteti talabalari hamda ota-onalar!</b><br><br>Fakultetimizda barcha jarayonlar to‘liq raqamlashtirildi: ota-onalar JSHSHIR va Face ID orqali farzandining davomati, fanlarni o‘zlashtirishi, uch bosqichli JONLI REYTINGI (Universitet / Fakultet / Guruh kesimida) va TTJdan ruxsat olish jarayonini onlayn kuzatishlari mumkin.',
      time: '10:15',
      out: false
    },
    {
      id: 2,
      author: 'Amonov Alisher Radjab o‘g‘li',
      authorRole: "Yoshlar bilan ishlash bo'yicha dekan o'rinbosari",
      text: '<b>IJTIMOIY FAOLLIK INDEKSI VA EQUITY (EQT) COIN!</b><br><br>Endilikda tadbirlarda va klublarda ishtirok etgan talabalar <b>dinamik QR-kod</b>ni skanerlash orqali yil davomida avtomatik ball va <b>Equity (EQT)</b> coin yig‘adilar. To‘plangan coinlarni universitet brend sovg‘alari, oshxona vaucherlari va kontrakt to‘loviga chegirmaga yo‘naltirish mumkin!',
      time: '11:40',
      out: false,
      doc: {
        name: 'Ijtimoiy_Faollik_va_Equity_Nizomi_2026.pdf',
        size: '1.4 MB'
      }
    }
  ],
  'academic-group-rst81': [
    {
      id: 101,
      author: 'Abdurahmonov Umar',
      authorRole: 'Guruh tyutori',
      text: "Hurmatli RST-81/25 guruhi talabalari! Hamma o'z profilidan yashash manzili (ijara xonadoni, TTJ-5 yoki o'z uyi) ma'lumotlarini va geolokatsiyasini bugun 18:00 gacha kiritib qo'ysin. RIAT-Maps xaritasi orqali ijara xonadonlarini o'rganish marshruti shakllantirilmoqda.",
      time: '09:20',
      out: false
    },
    {
      id: 102,
      author: 'Karimov Aziz',
      authorRole: 'Guruh sardori',
      text: 'Assalomu alaykum, ustoz! Tushunarli, guruhimizdagi 28 nafar talabaning barchasiga yetkazdim, hozir anketa jadvalini to‘ldiryapmiz.',
      time: '09:24',
      out: false
    }
  ],
  'kafedra-is': [
    {
      id: 201,
      author: 'Кафедра ИС',
      authorRole: 'Методист',
      text: 'Опубликованы методические указания к прохождению практики в IT-Park и коммерческих банках.',
      time: 'Вчера',
      out: false,
      doc: {
        name: 'Metodicheskie_Ukazaniya_2026.pdf',
        size: '2.8 MB'
      }
    }
  ],
  'bot-equity-ai': [
    {
      id: 401,
      author: 'RIAT Academic AI Bot',
      authorRole: 'Bot',
      text: '<b>TDIU RIAT Academic & Equity Botga xush kelibsiz!</b><br><br>Men orqali Equity (EQT) balansingizni tekshirishingiz, dars jadvalini olishingiz yoki Dekanat va Tyutor telefon raqamlarini bilib olishingiz mumkin. Masalan: <i>«расписание»</i> yoki <i>«баланс equity»</i> deb yozing.',
      time: '12:00',
      out: false
    }
  ]
};

let currentFolder = 'all';
let currentChatId = 'tutor-direct-umar';
let currentUser = null;
let messagesStore = {};

document.addEventListener('DOMContentLoaded', () => {
  initUser();
  initTheme();
  loadStoredMessages();
  renderChatList();
  selectChat(currentChatId);
});

function initUser() {
  try {
    const raw = localStorage.getItem('riat_user');
    if (raw) currentUser = JSON.parse(raw);
  } catch(e) {}
  if (!currentUser) {
    currentUser = { username: 'student', name: 'Студент ТГЭУ', role: 'student' };
  }
  const folderUser = document.getElementById('folderUserName');
  if (folderUser) {
    folderUser.textContent = (currentUser.name || 'Профиль').split(' ')[0];
  }
}

function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.add('dark-mode');
    updateThemeIcon(true);
  } else {
    updateThemeIcon(false);
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
}

function updateThemeIcon(isDark) {
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

function loadStoredMessages() {
  const stored = localStorage.getItem('riat_tg_messages_v2');
  if (stored) {
    try {
      messagesStore = JSON.parse(stored);
    } catch(e) {
      messagesStore = DEFAULT_TG_MESSAGES;
    }
  } else {
    messagesStore = DEFAULT_TG_MESSAGES;
    saveMessages();
  }
}

function saveMessages() {
  localStorage.setItem('riat_tg_messages_v2', JSON.stringify(messagesStore));
}

function setFolder(folderKey, el) {
  currentFolder = folderKey;
  document.querySelectorAll('.tg-folder-item').forEach(item => item.classList.remove('active'));
  if (el) el.classList.add('active');
  renderChatList();
}

function renderChatList() {
  const container = document.getElementById('chatsListContainer');
  if (!container) return;

  const search = (document.getElementById('chatSearchInput')?.value || '').toLowerCase();

  const filtered = TG_CHANNELS.filter(item => {
    const matchesFolder = currentFolder === 'all' || item.folder === currentFolder;
    const matchesSearch = item.name.toLowerCase().includes(search) || item.desc.toLowerCase().includes(search);
    return matchesFolder && matchesSearch;
  });

  container.innerHTML = filtered.map(item => {
    const msgs = messagesStore[item.id] || [];
    const lastMsg = msgs.length > 0 ? msgs[msgs.length - 1] : { text: item.desc, time: '', author: '' };
    const isActive = item.id === currentChatId;
    const isOnline = item.statusText.includes('в сети');

    const cleanSnippet = (lastMsg.text || '').replace(/<[^>]*>?/gm, '');

    return `
      <div class="tg-chat-row ${isActive ? 'active' : ''}" onclick="selectChat('${item.id}')">
        <div class="tg-avatar-box">
          <div class="tg-avatar-img" style="background: ${item.avatarBg};">
            <i class="fa-solid ${item.avatarIcon}"></i>
          </div>
          ${isOnline ? '<div class="tg-online-badge"></div>' : ''}
        </div>
        <div class="tg-chat-info">
          <div class="tg-chat-topline">
            <span class="tg-chat-title">
              ${item.name}
              ${item.verified ? '<i class="fa-solid fa-certificate tg-verified-star" title="Верифицировано"></i>' : ''}
            </span>
            <span class="tg-chat-time">${lastMsg.time || ''}</span>
          </div>
          <div class="tg-chat-subline">
            <span class="tg-chat-snippet">
              ${lastMsg.out ? '<span class="tg-chat-author">Вы: </span>' : (lastMsg.author && item.type === 'group' ? `<span class="tg-chat-author">${lastMsg.author.split(' ')[0]}: </span>` : '')}
              ${escapeHtml(cleanSnippet)}
            </span>
            ${item.unread > 0 ? `<span class="tg-badge-unread">${item.unread}</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function selectChat(chatId) {
  currentChatId = chatId;
  const chat = TG_CHANNELS.find(c => c.id === chatId);
  if (!chat) return;

  chat.unread = 0;
  renderChatList();

  const titleEl = document.getElementById('headerTitle');
  const statusEl = document.getElementById('headerStatus');
  const avatarEl = document.getElementById('headerAvatarImg');

  if (titleEl) {
    titleEl.innerHTML = `
      ${chat.name}
      ${chat.verified ? '<i class="fa-solid fa-certificate tg-verified-star" title="Верифицировано"></i>' : ''}
    `;
  }
  if (statusEl) {
    statusEl.innerHTML = chat.statusText.includes('в сети') 
      ? `<span class="tg-status-online">${chat.statusText}</span>` 
      : chat.statusText;
  }
  if (avatarEl) {
    avatarEl.style.background = chat.avatarBg;
    avatarEl.innerHTML = `<i class="fa-solid ${chat.avatarIcon}" style="font-size: 16px;"></i>`;
  }

  const drawerAvatar = document.getElementById('drawerBigAvatar');
  const drawerName = document.getElementById('drawerProfileName');
  const drawerStatus = document.getElementById('drawerProfileStatus');
  const drawerDesc = document.getElementById('drawerProfileDesc');
  const drawerMembers = document.getElementById('drawerMembersList');

  if (drawerAvatar) {
    drawerAvatar.style.background = chat.avatarBg;
    drawerAvatar.innerHTML = `<i class="fa-solid ${chat.avatarIcon}"></i>`;
  }
  if (drawerName) drawerName.textContent = chat.name;
  if (drawerStatus) drawerStatus.textContent = chat.statusText;
  if (drawerDesc) drawerDesc.textContent = chat.desc;

  if (drawerMembers && chat.members) {
    drawerMembers.innerHTML = chat.members.map(m => `
      <div class="tg-member-row">
        <div class="tg-member-avatar">${m.name[0]}</div>
        <div class="tg-member-meta">
          <div class="tg-member-name">${m.name}</div>
          <div class="tg-member-status">${m.role} · ${m.status}</div>
        </div>
      </div>
    `).join('');
  }

  renderMessages();

  if (window.innerWidth <= 768) {
    document.getElementById('chatsColumn')?.classList.add('hidden-mobile');
  }
}

function backToDialogsList() {
  document.getElementById('chatsColumn')?.classList.remove('hidden-mobile');
}

function toggleRightPanel() {
  const panel = document.getElementById('rightProfilePanel');
  if (panel) {
    panel.classList.toggle('closed');
  }
}

function renderMessages() {
  const canvas = document.getElementById('messagesCanvas');
  if (!canvas) return;

  const msgs = messagesStore[currentChatId] || [];

  if (msgs.length === 0) {
    canvas.innerHTML = `
      <div class="tg-day-badge">Сообщений пока нет</div>
    `;
    return;
  }

  let html = `
    <div class="tg-day-badge">Сегодня</div>
  `;

  html += msgs.map(m => {
    const isOut = m.out;

    return `
      <div class="tg-msg-wrapper ${isOut ? 'out' : 'in'}">
        <div class="tg-msg-bubble">
          ${!isOut && m.author ? `
            <div class="tg-msg-author">
              ${m.author}
              ${m.authorRole ? `<span class="tg-msg-author-role">${m.authorRole}</span>` : ''}
            </div>
          ` : ''}
          
          <div class="tg-msg-text">${m.text}</div>

          ${m.doc ? `
            <div class="tg-doc-box" onclick="alert('Скачивание файла: ${m.doc.name}')">
              <div class="tg-doc-icon">
                <i class="fa-solid fa-file-pdf"></i>
              </div>
              <div class="tg-doc-details">
                <div class="tg-doc-name">${m.doc.name}</div>
                <div class="tg-doc-size">${m.doc.size} · Документ</div>
              </div>
              <i class="fa-solid fa-arrow-down" style="font-size: 14px; color: var(--tg-text-muted);"></i>
            </div>
          ` : ''}

          <div class="tg-msg-time-row">
            <span>${m.time}</span>
            ${isOut ? '<i class="fa-solid fa-check-double"></i>' : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');

  canvas.innerHTML = html;
  canvas.scrollTop = canvas.scrollHeight;
}

function handleTelegramInputKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendTelegramMessage();
  }
}

function sendTelegramMessage() {
  const input = document.getElementById('messageInput');
  const text = (input?.value || '').trim();
  if (!text) return;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newMsg = {
    id: Date.now(),
    author: currentUser.name || currentUser.username,
    authorRole: (currentUser.role || 'student').toUpperCase(),
    text: escapeHtml(text).replace(/\n/g, '<br>'),
    time: timeStr,
    out: true
  };

  if (!messagesStore[currentChatId]) {
    messagesStore[currentChatId] = [];
  }
  messagesStore[currentChatId].push(newMsg);
  saveMessages();

  input.value = '';
  renderMessages();
  renderChatList();

  if (currentChatId === 'bot-equity-ai') {
    setTimeout(() => {
      replyFromBot(text);
    }, 700);
  }
}

function replyFromBot(userText) {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const query = userText.toLowerCase();

  let answer = 'Я зафиксировал ваш вопрос. Для справок и приказов обратитесь в Деканат. Для управления переводами откройте раздел <a href="/bank" style="color:#2481cc;font-weight:600;">RIAT Equity Bank</a>.';

  if (query.includes('расписан') || query.includes('пара') || query.includes('урок') || query.includes('аудитор')) {
    answer = ' <b>Расписание на сегодня:</b><br>1 пара: Эконометрика (ауд. 304)<br>2 пара: Базы данных и SQL (ауд. 412)<br>3 пара: Академический коворкинг.';
  } else if (query.includes('equity') || query.includes('баланс') || query.includes('перевод') || query.includes('стипенд')) {
    answer = ' <b>Ваш текущий статус Equity:</b><br>Баланс: <b>1,450 EQ</b><br>Статус счета: Активен (Лимит: 10,000 EQ).<br><a href="/bank" style="color:#2481cc;font-weight:600;">Перейти в Банк RIAT ➔</a>';
  } else if (query.includes('декан') || query.includes('прием')) {
    answer = ' <b>Приём декана:</b><br>Акбаров Нодир Гафурович<br>График: Пн–Пт 14:00 – 17:00.<br>Тел: +998 71 239-01-29.';
  }

  messagesStore['bot-equity-ai'].push({
    id: Date.now(),
    author: 'RIAT Academic AI Bot',
    authorRole: 'Bot',
    text: answer,
    time: timeStr,
    out: false
  });
  saveMessages();
  renderMessages();
  renderChatList();
}

function attachTelegramDoc() {
  const docName = prompt('Название прикрепляемого документа (например: Курсовая_Работа.pdf):', 'Praktika_Otchet_RIAT.pdf');
  if (!docName) return;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newMsg = {
    id: Date.now(),
    author: currentUser.name || currentUser.username,
    authorRole: (currentUser.role || 'student').toUpperCase(),
    text: 'Прикреплён файл к академическому чату:',
    time: timeStr,
    out: true,
    doc: {
      name: docName,
      size: '1.9 MB'
    }
  };

  if (!messagesStore[currentChatId]) {
    messagesStore[currentChatId] = [];
  }
  messagesStore[currentChatId].push(newMsg);
  saveMessages();
  renderMessages();
  renderChatList();
}

function insertQuickEmoji() {
  const input = document.getElementById('messageInput');
  if (input) {
    input.value += '  ';
    input.focus();
  }
}

function toggleMainMenu() {
  alert('Меню RIAT-Telegram:\n• Версия: Telegram Web Engine v2.4\n• Факультет: Цифровая Экономика ТГЭУ\n• Единая авторизация SSO активна.');
}

function searchInsideChat() {
  const term = prompt('Поиск по текущему чату:');
  if (!term) return;
  alert(`Найдено упоминаний запроса "${term}": 1`);
}

function openChatMenu() {
  alert('Параметры чата:\n• Уведомления: Включены\n• Экспорт истории чата: Доступен\n• Очистить историю: Требуются права куратора');
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}
