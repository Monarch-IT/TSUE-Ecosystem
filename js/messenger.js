/**
 * RIAT-Messenger (Telegram Web Edition)
 * True Telegram UX: Folders, channels, double-checks, audio-visual feedback, reply & file simulation
 */

const TG_CHANNELS = [
  {
    id: 'dekanat-channel',
    type: 'channel',
    folder: 'channels',
    name: 'Деканат · Официальный канал',
    verified: true,
    avatarBg: 'linear-gradient(135deg, #004899, #00224d)',
    avatarIcon: 'fa-bullhorn',
    unread: 2,
    statusText: '1,420 подписчиков',
    desc: 'Официальные приказы руководства факультета, академические дедлайны, распоряжения и новости.',
    members: [
      { name: 'Акбаров Нодир Гафурович', role: 'Декан факультета', status: 'был(а) недавно' },
      { name: 'Амонов Алишер Раджаб угли', role: 'Зам. декана по молодёжи', status: 'в сети' },
      { name: 'Юлдошев Улугбек Аскар угли', role: 'Зам. декана по учёбе', status: 'был(а) 15 минут назад' }
    ]
  },
  {
    id: 'academic-group-711',
    type: 'group',
    folder: 'groups',
    name: 'Группа 711-23 «Цифровая Экономика»',
    verified: false,
    avatarBg: 'linear-gradient(135deg, #0284c7, #0369a1)',
    avatarIcon: 'fa-graduation-cap',
    unread: 0,
    statusText: '28 участников, 4 в сети',
    desc: 'Официальный академический чат учебной группы 711-23. Тьютор: Dilrabo Vahidovna.',
    members: [
      { name: 'Dilrabo Vahidovna', role: 'Тьютор группы', status: 'в сети' },
      { name: 'Каримов Азиз', role: 'Староста группы', status: 'в сети' },
      { name: 'Алимов Сардор', role: 'Студент', status: 'был(а) недавно' },
      { name: 'Рахимова Нигора', role: 'Студент', status: 'была(а) час назад' }
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
    id: 'tutor-direct-dilrabo',
    type: 'direct',
    folder: 'direct',
    name: 'Dilrabo Vahidovna (Тьютор)',
    verified: false,
    avatarBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
    avatarIcon: 'fa-chalkboard-user',
    unread: 0,
    statusText: 'в сети',
    desc: 'Персональная оперативная консультация с наставником учебной группы факультета.',
    members: [
      { name: 'Dilrabo Vahidovna', role: 'Тьютор факультета', status: 'в сети' }
    ]
  },
  {
    id: 'bot-equity-ai',
    type: 'bot',
    folder: 'bots',
    name: 'RIAT Academic AI Bot',
    verified: true,
    avatarBg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    avatarIcon: 'fa-robot',
    unread: 0,
    statusText: 'бот',
    desc: 'Виртуальный ассистент расписания, начисления баллов Equity и справок с места учёбы.',
    members: [
      { name: 'RIAT Academic Bot', role: 'Официальный Telegram-бот', status: 'всегда в сети' }
    ]
  }
];

const DEFAULT_TG_MESSAGES = {
  'dekanat-channel': [
    {
      id: 1,
      author: 'Деканат RIAT',
      authorRole: 'Администрация',
      text: ' <b>Уважаемые студенты и преподаватели факультета Цифровой Экономики!</b><br><br>Напоминаем, что весенний модуль рубежного контроля завершается 25 числа. Просьба своевременно проверить академические баллы в платформе HEMIS.',
      time: '10:15',
      out: false
    },
    {
      id: 2,
      author: 'Амонов Алишер Раджаб угли',
      authorRole: 'Зам. декана',
      text: ' <b>СТАРТ ПРИЁМА ЗАЯВОК НА ХАКАТОН RIAT 2026!</b><br><br>Приглашаем команды студентов принять участие в хакатоне по машинному обучению и финтеху. Победители получат прямой грант и <b>2,500 Equity</b> на личный счет!',
      time: '11:40',
      out: false,
      doc: {
        name: 'Reglament_Hackathon_RIAT_2026.pdf',
        size: '1.4 MB'
      }
    }
  ],
  'academic-group-711': [
    {
      id: 101,
      author: 'Dilrabo Vahidovna',
      authorRole: 'Тьютор',
      text: 'Ребята, всем добрый день! Завтра в 14:00 состоится кураторский час в 304 аудитории. Посещаемость обязательна.',
      time: '09:20',
      out: false
    },
    {
      id: 102,
      author: 'Каримов Азиз',
      authorRole: 'Староста',
      text: 'Здравствуйте, Dilrabo Vahidovna! Принято, старостат группы явку обеспечит ',
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
  'tutor-direct-dilrabo': [
    {
      id: 301,
      author: 'Dilrabo Vahidovna',
      authorRole: 'Тьютор',
      text: 'Здравствуйте! Ваши документы на академическую стипендию и ведомости согласованы деканатом. Отличная учеба!',
      time: '12:05',
      out: false
    }
  ],
  'bot-equity-ai': [
    {
      id: 401,
      author: 'RIAT Academic AI Bot',
      authorRole: 'Bot',
      text: ' <b>Приветствую в Telegram-боте RIAT!</b><br><br>Я могу проверить ваш баланс Equity, выдать расписание занятий или подсказать контакты деканата. Напишите, например: <i>«расписание»</i> или <i>«баланс equity»</i>.',
      time: '12:00',
      out: false
    }
  ]
};

// Global State
let currentFolder = 'all';
let currentChatId = 'dekanat-channel';
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
  const stored = localStorage.getItem('riat_tg_messages');
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
  localStorage.setItem('riat_tg_messages', JSON.stringify(messagesStore));
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

    // Clean snippet HTML tags
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

  // Header update
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

  // Right Profile Drawer update
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

  // Render chat messages
  renderMessages();

  // Mobile layout switch
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

  // Automatic Bot Interaction
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
