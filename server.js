const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3008;
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const REWRITES = {
  '/': '/index.html',
  '/pro': '/index.html',
  '/ecosystem': '/ecosystem.html',
  '/auth': '/auth.html',
  '/hub': '/ecosystem.html',
  '/portal': '/portal_legacy.html',
  '/bank': '/apps/bank.html',
  '/apps/bank': '/apps/bank.html',
  '/messenger': '/apps/messenger.html',
  '/apps/messenger': '/apps/messenger.html',
  '/maps': '/apps/maps.html',
  '/apps/maps': '/apps/maps.html',
  '/database': '/apps/database.html',
  '/apps/database': '/apps/database.html',
  '/univerlife': '/apps/univerlife.html',
  '/apps/univerlife': '/apps/univerlife.html'
};

function syncEdupageLive(callback) {
  const payload = JSON.stringify({ "__args": [null, "94"], "__gsh": "00000000" });
  const req = https.request("https://tsue.edupage.org/timetable/server/regulartt.js?__func=regularttGetData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payload)
    },
    timeout: 7000
  }, (res) => {
    let body = "";
    res.on("data", c => body += c);
    res.on("end", () => {
      try {
        const data = JSON.parse(body);
        const tables = data.r.dbiAccessorRes.tables;
        const getT = id => tables.find(t => t.id === id)?.data_rows || [];

        const classes = getT("classes");
        const teachers = getT("teachers");
        const classrooms = getT("classrooms");
        const subjects = getT("subjects");
        const lessons = getT("lessons");
        const cards = getT("cards");

        const tMap = Object.fromEntries(teachers.map(t => [t.id, t.name || t.short]));
        const rMap = Object.fromEntries(classrooms.map(r => [r.id, r.name || r.short]));
        const sMap = Object.fromEntries(subjects.map(s => [s.id, s.name || s.short]));
        const sColorMap = Object.fromEntries(subjects.map(s => [s.id, s.color || '']));
        const lMap = Object.fromEntries(lessons.map(l => [l.id, l]));

        const targetClasses = classes.filter(c => {
          const num = parseInt(c.id.replace("*", ""), 10);
          return num >= 414 && num <= 537;
        });

        const scheduleResult = {};
        targetClasses.forEach(cls => {
          const gName = cls.name.trim();
          let course = 1;
          if (gName.includes('/26')) course = 1;
          else if (gName.includes('/25')) course = 2;
          else if (gName.includes('/24')) course = 3;
          else if (gName.includes('/23')) course = 4;

          scheduleResult[gName] = {
            name: gName,
            edupageClassId: cls.id,
            course: course,
            odd: { 0:{}, 1:{}, 2:{}, 3:{}, 4:{}, 5:{} },
            even: { 0:{}, 1:{}, 2:{}, 3:{}, 4:{}, 5:{} }
          };
        });

        let mappedCards = 0;
        cards.forEach(card => {
          if (!card.period || !card.days || !card.days.includes("1")) return;
          const lesson = lMap[card.lessonid];
          if (!lesson) return;
          const classIds = lesson.classids || [];
          classIds.forEach(clsId => {
            const cls = targetClasses.find(c => c.id === clsId);
            if (!cls) return;
            const gName = cls.name.trim();
            const targetObj = scheduleResult[gName];
            if (!targetObj) return;
            const dayIdx = card.days.indexOf("1");
            if (dayIdx < 0) return;
            const slotIdx = (parseInt(card.period, 10) || 1) - 1;

            const subjectName = (sMap[lesson.subjectid] || 'Занятие').trim();
            const teacherName = (lesson.teacherids || []).map(tid => tMap[tid]).filter(Boolean).join(', ') || '';
            const roomName = (card.classroomids || [])
              .map(rid => (rMap[rid] || '').replace(/-\d+$/, '').trim())
              .filter(Boolean)
              .join(', ') || '';
            const edupageColor = sColorMap[lesson.subjectid] || '';

            let type = 'lecture';
            const sLower = subjectName.toLowerCase();
            if (sLower.includes('lab') || sLower.includes('лаб')) type = 'lab';
            else if (sLower.includes('sem') || sLower.includes('сем')) type = 'seminar';
            else if (sLower.includes('amaliy') || sLower.includes('am)') || sLower.includes('прак')) type = 'practice';
            else if (sLower.includes('naviyo') || sLower.includes('ma\u2018naviyat') || sLower.includes('kelajak')) type = 'naviyat';
            else if (sLower.includes('sport') || sLower.includes('jismoniy')) type = 'sport';

            const lessonCard = {
              subject: subjectName,
              type: type,
              teacher: teacherName,
              room: roomName,
              color: edupageColor
            };

            if (targetObj.odd[dayIdx] && !targetObj.odd[dayIdx][slotIdx]) {
              targetObj.odd[dayIdx][slotIdx] = lessonCard;
            }
            if (targetObj.even[dayIdx] && !targetObj.even[dayIdx][slotIdx]) {
              targetObj.even[dayIdx][slotIdx] = lessonCard;
            }
            mappedCards++;
          });
        });

        const outPath = path.join(ROOT, 'data', 'edupage_schedule.json');
        fs.writeFileSync(outPath, JSON.stringify(scheduleResult, null, 2), 'utf-8');
        const jsPath = path.join(ROOT, 'js', 'edupage_data.js');
        fs.writeFileSync(jsPath, 'const EDUPAGE_SCHEDULE_DATA = ' + JSON.stringify(scheduleResult) + ';\n', 'utf-8');

        callback(null, { source: 'tsue.edupage.org (Live API)', groupsCount: Object.keys(scheduleResult).length, cardsCount: mappedCards, schedule: scheduleResult });
      } catch (e) {
        callback(e);
      }
    });
  });
  req.on("error", err => callback(err));
  req.on("timeout", () => { req.destroy(); callback(new Error("EduPage timeout")); });
  req.write(payload);
  req.end();
}

const server = http.createServer((req, res) => {
  let reqUrl = decodeURI(req.url.split('?')[0]);
  if (reqUrl.length > 1 && reqUrl.endsWith('/')) {
    reqUrl = reqUrl.slice(0, -1);
  }

  // API Эндпоинт живой синхронизации расписания с tsue.edupage.org / tsue-digital-economy
  if (reqUrl === '/api/edupage-sync') {
    syncEdupageLive((err, result) => {
      if (err) {
        try {
          const cached = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'edupage_schedule.json'), 'utf-8'));
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: true, source: 'tsue-digital-economy (Local Sync Cache)', groupsCount: Object.keys(cached).length, schedule: cached }));
        } catch (e) {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ ok: false, error: err.message }));
        }
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ ok: true, ...result }));
    });
    return;
  }

  if (REWRITES[reqUrl]) {
    reqUrl = REWRITES[reqUrl];
  }

  let filePath = path.join(ROOT, reqUrl);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (!path.extname(filePath)) {
        const htmlTry = filePath + '.html';
        if (fs.existsSync(htmlTry)) {
          const content = fs.readFileSync(htmlTry);
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(content);
          return;
        }
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not Found: ' + reqUrl);
      return;
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`TSUE-Ecosystem_Local Pro Server running at http://localhost:${PORT}`);
});
