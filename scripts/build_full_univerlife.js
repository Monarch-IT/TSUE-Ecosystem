const fs = require('fs');

const seed = JSON.parse(fs.readFileSync('/home/monarch/Projects/TSUE-Ecosystem/data/univerlife_seed.json', 'utf8'));

// We construct the complete standalone client-side engine and HTML page
const pageHtml = `<!doctype html>
<html lang="uz">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#003B81">
<title>RIAT-Univerlife · Birlashgan talabalar, ota-onalar va ijtimoiy platforma</title>
<meta name="description" content="RIAT-Univerlife: RIAT-Study, RIAT-Parents va RIAT-Ijtimoiy tizimlarining yagona portali. HEMIS integratsiyasi, interaktiv dars jadvali, IFI 11 band va davomat.">
<link rel="icon" href="/assets/images/faculty_logo.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
<link rel="stylesheet" href="/css/univerlife.css">
<style>
/* RIAT Sovereign Theme Enhancements */
:root {
  --pri: #003B81;
  --pri2: #00255A;
  --pri-soft: #EBF2FC;
  --line: #DCE5F2;
  --line2: #E9EFF8;
  --bg: #F4F7FC;
  --card: #FFFFFF;
  --ink: #0E2A52;
  --ink2: #24416B;
  --muted: #5D7290;
  --accent: #1A66D1;
  --accent-gold: #B38600;
  --r: 14px;
  --sh: 0 4px 18px rgba(0, 59, 129, 0.06);
}
body {
  font-family: 'Manrope', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--bg);
  color: var(--ink);
}
.brand {
  display: flex !important;
  align-items: center;
  gap: 10px;
  font-family: 'Outfit', sans-serif !important;
  font-weight: 800 !important;
  font-size: 19px !important;
  letter-spacing: -0.01em;
  color: #fff !important;
}
.riat-badge {
  background: linear-gradient(135deg, #1A66D1, #003B81);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 3px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.05em;
  color: #fff;
  display: inline-flex;
  align-items: center;
}
.side .brand {
  color: #fff !important;
}
.side {
  background: linear-gradient(180deg, #00255A 0%, #001B40 100%) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.side .who {
  background: rgba(255, 255, 255, 0.06) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
}
.side .who b {
  color: #FFFFFF !important;
}
.side .who small {
  color: #A5C2E8 !important;
}
.side .nav a {
  color: #C0D6F5 !important;
}
.side .nav a:hover {
  background: rgba(255, 255, 255, 0.08) !important;
  color: #fff !important;
}
.side .nav a.on {
  background: #1A66D1 !important;
  color: #fff !important;
  font-weight: 700;
  box-shadow: 0 4px 14px rgba(26, 102, 209, 0.4);
}
.side .nav a svg.i {
  stroke: currentColor;
}
.side .foot {
  color: #7E9DC2 !important;
}
.top {
  background: rgba(255, 255, 255, 0.94) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line) !important;
}
.riat-ecosystem-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 700;
  padding: 6px 14px;
  border-radius: 10px;
  background: var(--pri-soft);
  color: var(--pri);
  text-decoration: none;
  border: 1px solid rgba(0, 59, 129, 0.12);
  transition: all 0.2s ease;
  margin-right: 12px;
}
.riat-ecosystem-link:hover {
  background: #003B81;
  color: #fff;
}
.module-badge-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 10px 16px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
}
.module-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 8px;
  background: var(--pri-soft);
  color: var(--pri);
  text-decoration: none;
  transition: all 0.15s;
}
.module-badge:hover, .module-badge.active {
  background: var(--pri);
  color: #fff;
}
.module-badge i {
  font-size: 12px;
}

/* Schedule UI Enhancements */
.sched-hero {
  background: linear-gradient(135deg, #003B81 0%, #1A66D1 100%);
  border-radius: 16px;
  padding: 24px;
  color: #fff;
  margin-bottom: 20px;
  box-shadow: 0 10px 25px rgba(0, 59, 129, 0.15);
}
.sched-hero h2 {
  font-family: 'Outfit', sans-serif;
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 6px 0;
  color: #fff;
}
.sched-hero p {
  margin: 0 0 16px 0;
  color: #D3E4FF;
  font-size: 14px;
}
.sched-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.12);
  padding: 12px;
  border-radius: 12px;
  backdrop-filter: blur(8px);
}
.sched-select-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 220px;
}
.sched-select-wrap select {
  width: 100%;
  height: 40px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: #fff;
  color: #0E2A52;
  font-weight: 700;
  padding: 0 12px;
  outline: none;
}
.sched-btn-group {
  display: inline-flex;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 2px;
  gap: 2px;
}
.sched-btn-group button {
  border: none;
  background: transparent;
  color: #fff;
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.sched-btn-group button.active {
  background: #fff;
  color: #003B81;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}
.sched-days-nav {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  margin-bottom: 16px;
  scrollbar-width: none;
}
.sched-days-nav::-webkit-scrollbar { display: none; }
.sched-day-pill {
  flex: 1;
  min-width: 110px;
  padding: 12px 14px;
  background: #fff;
  border: 1.5px solid var(--line);
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}
.sched-day-pill:hover {
  border-color: var(--accent);
  background: var(--pri-soft);
}
.sched-day-pill.active {
  border-color: var(--pri);
  background: var(--pri);
  color: #fff;
  box-shadow: 0 4px 14px rgba(0, 59, 129, 0.18);
}
.sched-day-pill .d-title {
  font-weight: 800;
  font-size: 15px;
  display: block;
}
.sched-day-pill .d-sub {
  font-size: 12px;
  opacity: 0.8;
  display: block;
  margin-top: 2px;
}
.lesson-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 12px;
  transition: transform 0.15s, box-shadow 0.15s;
}
.lesson-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 59, 129, 0.08);
}
.lesson-time {
  flex: none;
  min-width: 80px;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  background: var(--pri-soft);
  border: 1px solid rgba(0, 59, 129, 0.1);
  color: var(--pri);
}
.lesson-time b {
  display: block;
  font-size: 17px;
  font-weight: 800;
}
.lesson-time small {
  display: block;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  margin-top: 2px;
}
.lesson-info {
  flex: 1;
  min-width: 0;
}
.lesson-subject {
  font-size: 16px;
  font-weight: 800;
  color: var(--ink);
  margin-bottom: 4px;
}
.lesson-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: var(--muted);
}
.lesson-meta span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.lesson-type-badge {
  font-size: 11.5px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
}
.type-lecture { background: #FFF4E5; color: #B36B00; border: 1px solid #FFE0B2; }
.type-practice, .type-seminar { background: #E8F5E9; color: #2E7D32; border: 1px solid #C8E6C9; }
.type-lab { background: #EDE7F6; color: #5E35B1; border: 1px solid #D1C4E9; }

.search-filter-box {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}
.search-filter-box input {
  flex: 1;
  min-width: 240px;
  height: 42px;
  border-radius: 10px;
  border: 1px solid var(--line);
  padding: 0 14px;
}

/* Auth enhancements */
.auth {
  background: linear-gradient(135deg, #00255A 0%, #003B81 100%) !important;
}
.auth-box {
  background: #ffffff !important;
  box-shadow: 0 20px 50px rgba(0, 37, 90, 0.3) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  border-radius: 20px !important;
}
</style>
<script src="/js/qrcode.min.js"></script>
<script src="/js/edupage_data.js"></script>
</head>
<body>
<div id="root"></div>

<script>
window.__UNIVERLIFE_SEED__ = ${JSON.stringify(seed)};
</script>
<script src="/js/univerlife_engine.js"></script>
</body>
</html>`;

fs.writeFileSync('/home/monarch/Projects/TSUE-Ecosystem/apps/univerlife.html', pageHtml);
console.log('Saved /home/monarch/Projects/TSUE-Ecosystem/apps/univerlife.html');
