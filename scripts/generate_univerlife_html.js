const fs = require('fs');

const seed = fs.readFileSync('data/univerlife_v3_seed.json', 'utf8');

const html = `<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#003B81">
<title>TSUE UniverLife · Yagona talabalar va akademik platforma</title>
<meta name="description" content="TSUE UniverLife: RIAT-Study (dars jadvali, GPA), RIAT-Parents (ota-onalar kabineti) va RIAT-Ijtimoiy (IFI 11 band, to'garaklar) yagona tizimi.">
<link rel="icon" href="/assets/images/faculty_logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<link rel="stylesheet" href="/css/univerlife.css">
<style>
  /* TSUE Ecosystem Custom Overrides */
  .brand { text-decoration: none; }
  .brand:hover { opacity: 0.95; }
  .top-back-btn:hover { background: var(--line) !important; color: var(--pri2) !important; }
  body.dark-mode {
    --bg: #060e1a !important;
    --card: #0f1b2e !important;
    --line: #1e293b !important;
    --line2: #24354d !important;
    --ink: #f8fafc !important;
    --ink2: #cbd5e1 !important;
    --muted: #94a3b8 !important;
    --soft: #142238 !important;
    --pri-soft: #142848 !important;
  }
  body.dark-mode .side { background: #091322 !important; border-right-color: #1e293b !important; }
  body.dark-mode .top { background: rgba(15, 27, 46, 0.94) !important; border-bottom-color: #1e293b !important; }
  body.dark-mode .card, body.dark-mode .stat, body.dark-mode .sheet, body.dark-mode .date, body.dark-mode .band, body.dark-mode .note {
    background: var(--card) !important; border-color: var(--line) !important; color: var(--ink) !important;
  }
  body.dark-mode .t, body.dark-mode table.t { background: var(--card) !important; border-color: var(--line) !important; }
  body.dark-mode table.t th { background: var(--soft) !important; border-color: var(--line2) !important; color: #cbd5e1 !important; }
  body.dark-mode table.t td { color: #f8fafc !important; border-color: var(--line2) !important; }
  body.dark-mode .kv div { background: var(--soft) !important; border-color: var(--line2) !important; color: #f8fafc !important; }
</style>
<script src="/js/qrcode.min.js"></script>
</head>
<body>
<div id="root"></div>

<script>
window.__UNIVERLIFE_SEED__ = ${seed};
</script>
<script src="/js/univerlife_engine.js"></script>
</body>
</html>
`;

fs.writeFileSync('apps/univerlife.html', html, 'utf8');
console.log('apps/univerlife.html updated successfully! Size:', html.length);
