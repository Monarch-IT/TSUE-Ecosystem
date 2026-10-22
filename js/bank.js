const BANK_VERSION = '1.0.0';
const BANK_NAME = 'RIAT Equity Bank';
const CURRENCY = 'EQ';
const BANK_RESERVE_ID = '__bank_reserve__';
const BANK_FEE_ID = '__bank_fee__';

const TX_STATUS = { PENDING: 'pending', APPROVED: 'approved', REJECTED: 'rejected', CANCELLED: 'cancelled' };
const TX_TYPE = { CREDIT: 'credit', DEBIT: 'debit', TRANSFER: 'transfer', AWARD: 'award', FEE: 'fee', ADJUSTMENT: 'adjustment' };
const ACCOUNT_TYPE = { STUDENT: 'student', STAFF: 'staff', RESERVE: 'reserve', FEE: 'fee' };

function bankNow() { return new Date().toISOString(); }
function bankId(prefix) { return prefix + '-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,6).toUpperCase(); }
function bankLoad(key, def) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch { return def; } }
function bankSave(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

function getAccounts() { return bankLoad('eq_accounts', {}); }
function saveAccounts(a) { bankSave('eq_accounts', a); }
function getLedger() { return bankLoad('eq_ledger', []); }
function saveLedger(l) { bankSave('eq_ledger', l); }
function getPendingTx() { return bankLoad('eq_pending', []); }
function savePendingTx(p) { bankSave('eq_pending', p); }
function getNotifications() { return bankLoad('eq_bank_notifs', []); }
function saveNotifications(n) { bankSave('eq_bank_notifs', n); }

function ensureSystemAccounts() {
  const accs = getAccounts();
  let changed = false;
  if (!accs[BANK_RESERVE_ID]) {
    accs[BANK_RESERVE_ID] = { id: BANK_RESERVE_ID, type: ACCOUNT_TYPE.RESERVE, name: 'Резервный счёт банка', balance: 1000000, created: bankNow() };
    changed = true;
  }
  if (!accs[BANK_FEE_ID]) {
    accs[BANK_FEE_ID] = { id: BANK_FEE_ID, type: ACCOUNT_TYPE.FEE, name: 'Счёт комиссий', balance: 0, created: bankNow() };
    changed = true;
  }
  if (changed) saveAccounts(accs);
}

function ensureUserAccount(userId, userName, accountType) {
  const accs = getAccounts();
  if (!accs[userId]) {
    accs[userId] = { id: userId, type: accountType || ACCOUNT_TYPE.STUDENT, name: userName || userId, balance: 0, frozen: false, created: bankNow(), card_number: generateCardNumber() };
    saveAccounts(accs);
    pushBankNotif(null, 'Открыт счёт для: ' + (userName || userId), 'system');
  }
  return accs[userId];
}

function generateCardNumber() {
  let n = 'RIAT';
  for (let i = 0; i < 12; i++) n += Math.floor(Math.random() * 10);
  return n.match(/.{1,4}/g).join('-');
}

function getAccount(userId) { const accs = getAccounts(); return accs[userId] || null; }
function getBalance(userId) { const acc = getAccount(userId); return acc ? acc.balance : 0; }

function postLedgerEntry(entry) {
  const ledger = getLedger();
  ledger.unshift(entry);
  if (ledger.length > 5000) ledger.splice(5000);
  saveLedger(ledger);
}

function applyTransfer(fromId, toId, amount, description, txId, type, initiator) {
  const accs = getAccounts();
  if (!accs[fromId] || !accs[toId]) return { ok: false, error: 'Счёт не найден' };
  if (accs[fromId].frozen && fromId !== BANK_RESERVE_ID) return { ok: false, error: 'Счёт заморожен' };
  if (accs[fromId].balance < amount) return { ok: false, error: 'Недостаточно средств' };
  accs[fromId].balance = +(accs[fromId].balance - amount).toFixed(4);
  accs[toId].balance = +(accs[toId].balance + amount).toFixed(4);
  saveAccounts(accs);
  const ts = bankNow();
  const txType = type || TX_TYPE.TRANSFER;
  postLedgerEntry({ id: bankId('LE'), tx_id: txId, side: 'debit', account_id: fromId, account_name: accs[fromId].name, amount, balance_after: accs[fromId].balance, description, type: txType, initiator, ts });
  postLedgerEntry({ id: bankId('LE'), tx_id: txId, side: 'credit', account_id: toId, account_name: accs[toId].name, amount, balance_after: accs[toId].balance, description, type: txType, initiator, ts });
  return { ok: true, fromBalance: accs[fromId].balance, toBalance: accs[toId].balance };
}

function requestTransaction(fromId, toId, amount, description, type, initiatorUser) {
  ensureSystemAccounts();
  const accs = getAccounts();
  const from = accs[fromId]; const to = accs[toId];
  if (!from || !to) return { ok: false, error: 'Счёт не найден' };
  if (isNaN(amount) || amount <= 0) return { ok: false, error: 'Неверная сумма' };
  const FEE_RATE = (type === TX_TYPE.TRANSFER) ? 0.01 : 0;
  const fee = +(amount * FEE_RATE).toFixed(4);
  const netAmount = +(amount - fee).toFixed(4);
  const txId = bankId('TX');
  const pending = getPendingTx();
  const tx = { id: txId, from_id: fromId, from_name: from.name, to_id: toId, to_name: to.name, amount, fee, net_amount: netAmount, description: description || '', type: type || TX_TYPE.TRANSFER, status: TX_STATUS.PENDING, initiator_id: initiatorUser ? initiatorUser.id : fromId, initiator_name: initiatorUser ? initiatorUser.name : from.name, created: bankNow(), updated: null, approved_by: null, receipt_id: null };
  pending.unshift(tx);
  savePendingTx(pending);
  pushBankNotif(null, 'Новая заявка: ' + amount + ' ' + CURRENCY + ' от «' + from.name + '» → «' + to.name + '»', 'pending_tx', txId);
  pushBankNotif(fromId, 'Заявка на перевод ' + amount + ' ' + CURRENCY + ' отправлена на рассмотрение', 'tx_submitted', txId);
  return { ok: true, tx };
}

function approvePendingTx(txId, approverUser) {
  const pending = getPendingTx();
  const idx = pending.findIndex(t => t.id === txId);
  if (idx < 0) return { ok: false, error: 'Транзакция не найдена' };
  const tx = pending[idx];
  if (tx.status !== TX_STATUS.PENDING) return { ok: false, error: 'Уже обработана' };
  const result = applyTransfer(tx.from_id, tx.to_id, tx.net_amount, tx.description, tx.id, tx.type, approverUser ? approverUser.id : 'bank');
  if (!result.ok) { tx.status = TX_STATUS.REJECTED; tx.reject_reason = result.error; tx.updated = bankNow(); pending[idx] = tx; savePendingTx(pending); return { ok: false, error: result.error }; }
  if (tx.fee > 0) applyTransfer(tx.from_id, BANK_FEE_ID, tx.fee, 'Комиссия TX ' + tx.id, bankId('TX-FEE'), TX_TYPE.FEE, 'bank');
  tx.status = TX_STATUS.APPROVED; tx.updated = bankNow(); tx.approved_by = approverUser ? approverUser.name : 'Банк'; tx.receipt_id = bankId('RCP');
  pending[idx] = tx; savePendingTx(pending);
  pushBankNotif(tx.from_id, 'Перевод ' + tx.amount + ' ' + CURRENCY + ' одобрен. Чек: ' + tx.receipt_id, 'tx_approved', tx.id);
  pushBankNotif(tx.to_id, 'Получено ' + tx.net_amount + ' ' + CURRENCY + ' от «' + tx.from_name + '»', 'tx_received', tx.id);
  return { ok: true, tx };
}

function rejectPendingTx(txId, reason, approverUser) {
  const pending = getPendingTx();
  const idx = pending.findIndex(t => t.id === txId);
  if (idx < 0) return { ok: false, error: 'Не найдена' };
  const tx = pending[idx];
  if (tx.status !== TX_STATUS.PENDING) return { ok: false, error: 'Уже обработана' };
  tx.status = TX_STATUS.REJECTED; tx.reject_reason = reason || 'Отклонено банком'; tx.updated = bankNow(); tx.approved_by = approverUser ? approverUser.name : 'Банк';
  pending[idx] = tx; savePendingTx(pending);
  pushBankNotif(tx.from_id, 'Перевод ' + tx.amount + ' ' + CURRENCY + ' отклонён. Причина: ' + tx.reject_reason, 'tx_rejected', tx.id);
  return { ok: true, tx };
}

function directCredit(toId, amount, description, approverUser) {
  ensureSystemAccounts();
  if (isNaN(amount) || amount <= 0) return { ok: false, error: 'Неверная сумма' };
  const txId = bankId('TX');
  const result = applyTransfer(BANK_RESERVE_ID, toId, amount, description || 'Начисление банком', txId, TX_TYPE.AWARD, approverUser ? approverUser.id : 'bank');
  if (!result.ok) return result;
  const rcpId = bankId('RCP');
  const to = getAccount(toId);
  const pending = getPendingTx();
  pending.unshift({ id: txId, from_id: BANK_RESERVE_ID, from_name: BANK_NAME, to_id: toId, to_name: to ? to.name : toId, amount, fee: 0, net_amount: amount, description: description || 'Начисление', type: TX_TYPE.AWARD, status: TX_STATUS.APPROVED, initiator_id: approverUser ? approverUser.id : 'bank', initiator_name: approverUser ? approverUser.name : BANK_NAME, created: bankNow(), updated: bankNow(), approved_by: approverUser ? approverUser.name : BANK_NAME, receipt_id: rcpId });
  savePendingTx(pending);
  pushBankNotif(toId, 'Начислено ' + amount + ' ' + CURRENCY + '. ' + (description||'') + ' Чек: ' + rcpId, 'tx_received', txId);
  return { ok: true, txId, rcpId, newBalance: result.toBalance };
}

function directDebit(fromId, amount, description, approverUser) {
  ensureSystemAccounts();
  if (isNaN(amount) || amount <= 0) return { ok: false, error: 'Неверная сумма' };
  const txId = bankId('TX');
  const result = applyTransfer(fromId, BANK_RESERVE_ID, amount, description || 'Списание банком', txId, TX_TYPE.ADJUSTMENT, approverUser ? approverUser.id : 'bank');
  if (!result.ok) return result;
  const rcpId = bankId('RCP');
  const from = getAccount(fromId);
  const pending = getPendingTx();
  pending.unshift({ id: txId, from_id: fromId, from_name: from ? from.name : fromId, to_id: BANK_RESERVE_ID, to_name: BANK_NAME, amount, fee: 0, net_amount: amount, description: description || 'Списание', type: TX_TYPE.ADJUSTMENT, status: TX_STATUS.APPROVED, initiator_id: approverUser ? approverUser.id : 'bank', initiator_name: approverUser ? approverUser.name : BANK_NAME, created: bankNow(), updated: bankNow(), approved_by: approverUser ? approverUser.name : BANK_NAME, receipt_id: rcpId });
  savePendingTx(pending);
  pushBankNotif(fromId, 'Списано ' + amount + ' ' + CURRENCY + '. ' + (description||'') + ' Чек: ' + rcpId, 'tx_debit', txId);
  return { ok: true, txId, rcpId, newBalance: result.fromBalance };
}

function freezeAccount(userId, freeze, adminUser) {
  const accs = getAccounts();
  if (!accs[userId]) return { ok: false, error: 'Счёт не найден' };
  accs[userId].frozen = freeze;
  saveAccounts(accs);
  pushBankNotif(userId, freeze ? 'Ваш счёт временно заморожен банком.' : 'Ваш счёт разморожен.', 'account_status');
  pushBankNotif(null, (freeze ? 'Заморожен' : 'Разморожен') + ' счёт: ' + accs[userId].name, 'system');
  return { ok: true };
}

function pushBankNotif(userId, message, type, refId) {
  const notifs = getNotifications();
  notifs.unshift({ id: bankId('BN'), user_id: userId || null, message, type: type || 'info', ref_id: refId || null, read: false, ts: bankNow() });
  if (notifs.length > 500) notifs.splice(500);
  saveNotifications(notifs);
  if (window.bankUI && typeof window.bankUI.refreshNotifBadge === 'function') window.bankUI.refreshNotifBadge();
}

function getMyNotifications(userId) { return getNotifications().filter(n => n.user_id === userId || n.user_id === null); }
function getMyTransactions(userId) { return getLedger().filter(e => e.account_id === userId); }
function getUserPendingTx(userId) { return getPendingTx().filter(t => t.from_id === userId || t.to_id === userId || t.initiator_id === userId); }
function getAllPendingCount() { return getPendingTx().filter(t => t.status === TX_STATUS.PENDING).length; }

function generateReceiptHTML(tx) {
  const typeLabel = { award:'Начисление', transfer:'Перевод', debit:'Списание', adjustment:'Корректировка', fee:'Комиссия', credit:'Зачисление' };
  const statusLabel = { approved:'ОДОБРЕНО', pending:'НА РАССМОТРЕНИИ', rejected:'ОТКЛОНЕНО', cancelled:'ОТМЕНЕНО' };
  const statusColor = { approved:'#065f46', pending:'#92400e', rejected:'#991b1b', cancelled:'#374151' };
  const statusBg = { approved:'#ecfdf5', pending:'#fffbeb', rejected:'#fef2f2', cancelled:'#f9fafb' };
  return '<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><title>Чек ' + (tx.receipt_id||tx.id) + '</title><style>@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap");*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Outfit",sans-serif;background:#f4f6fa;display:flex;align-items:center;justify-content:center;min-height:100vh}.receipt{background:#fff;width:440px;border-radius:20px;box-shadow:0 8px 40px rgba(0,72,153,.18);overflow:hidden}.rh{background:linear-gradient(135deg,#002d62,#004899);color:#fff;padding:28px 32px 22px}.rh .logo{font-size:11px;letter-spacing:4px;font-weight:700;opacity:.65;margin-bottom:6px}.rh h1{font-size:24px;font-weight:800;margin-bottom:4px}.rh .rid{font-size:11px;opacity:.55;font-family:monospace}.rs{padding:14px 32px;background:' + (statusBg[tx.status]||'#f9fafb') + ';border-bottom:1px solid #e2e8f0;display:flex;align-items:center;gap:10px}.sd{width:9px;height:9px;border-radius:50%;background:' + (statusColor[tx.status]||'#374151') + '}.sl{font-weight:700;font-size:13px;letter-spacing:1px;color:' + (statusColor[tx.status]||'#374151') + '}.rb{padding:28px 32px}.ar{background:#f8fafc;border-radius:12px;padding:18px;margin-bottom:20px;text-align:center}.al{font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px}.av{font-size:38px;font-weight:800;color:#002d62}.ac{font-size:16px;font-weight:600;color:#004899;margin-left:4px}.row{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:13px}.rl{font-size:11px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:.5px;flex-shrink:0}.rv{font-size:13px;color:#1e293b;font-weight:600;text-align:right;max-width:62%}hr{border:none;border-top:1px dashed #e2e8f0;margin:16px 0}.rf{background:#f8fafc;padding:18px 32px;text-align:center;border-top:1px solid #e2e8f0}.rf p{font-size:11px;color:#94a3b8;line-height:1.7}.pb{display:block;width:100%;margin-top:12px;padding:11px;background:#004899;color:#fff;border:none;border-radius:8px;font-family:"Outfit",sans-serif;font-size:14px;font-weight:600;cursor:pointer;letter-spacing:.5px}.pb:hover{background:#002d62}@media print{.pb{display:none}body{background:#fff}.receipt{box-shadow:none}}</style></head><body><div class="receipt"><div class="rh"><div class="logo">RIAT EQUITY BANK</div><h1>Платёжный чек</h1><div class="rid">' + (tx.receipt_id||tx.id) + '</div></div><div class="rs"><div class="sd"></div><div class="sl">' + (statusLabel[tx.status]||tx.status) + '</div></div><div class="rb"><div class="ar"><div class="al">Сумма операции</div><span class="av">' + ((tx.net_amount||tx.amount||0).toLocaleString('ru-RU',{minimumFractionDigits:2})) + '</span><span class="ac">' + CURRENCY + '</span></div><div class="row"><span class="rl">Тип</span><span class="rv">' + (typeLabel[tx.type]||tx.type) + '</span></div><div class="row"><span class="rl">Отправитель</span><span class="rv">' + (tx.from_name||tx.from_id) + '</span></div><div class="row"><span class="rl">Получатель</span><span class="rv">' + (tx.to_name||tx.to_id) + '</span></div>' + (tx.description ? '<div class="row"><span class="rl">Назначение</span><span class="rv">' + tx.description + '</span></div>' : '') + (tx.fee > 0 ? '<div class="row"><span class="rl">Комиссия</span><span class="rv">' + tx.fee + ' ' + CURRENCY + '</span></div>' : '') + '<hr><div class="row"><span class="rl">Дата</span><span class="rv">' + new Date(tx.created).toLocaleString('ru-RU') + '</span></div>' + (tx.approved_by ? '<div class="row"><span class="rl">Одобрил</span><span class="rv">' + tx.approved_by + '</span></div>' : '') + '<div class="row"><span class="rl">ID транзакции</span><span class="rv" style="font-size:10px;font-family:monospace">' + tx.id + '</span></div></div><div class="rf"><p>RIAT Equity Bank · Виртуальная внутренняя валюта<br>Официальное подтверждение финансовой операции в системе RIAT Ecosystem</p><button class="pb" onclick="window.print()">Распечатать / Сохранить PDF</button></div></div></body></html>';
}

function openReceipt(tx) { if (!tx) return; const w = window.open('', '_blank', 'width=500,height=750'); if (w) { w.document.write(generateReceiptHTML(tx)); w.document.close(); } }
function findTxById(txId) { return getPendingTx().find(t => t.id === txId || t.receipt_id === txId) || null; }
function getAllAccounts() { const accs = getAccounts(); return Object.values(accs).filter(a => a.id !== BANK_RESERVE_ID && a.id !== BANK_FEE_ID); }

function bankStats() {
  const accs = getAccounts(); const pending = getPendingTx();
  let totalSupply = 0, totalAccounts = 0;
  Object.values(accs).forEach(a => { if (a.id !== BANK_RESERVE_ID && a.id !== BANK_FEE_ID) { totalSupply += a.balance; totalAccounts++; } });
  return { totalSupply, totalAccounts, reserve: accs[BANK_RESERVE_ID] ? accs[BANK_RESERVE_ID].balance : 0, fees: accs[BANK_FEE_ID] ? accs[BANK_FEE_ID].balance : 0, pendingCount: pending.filter(t => t.status === TX_STATUS.PENDING).length, approvedTotal: pending.filter(t => t.status === TX_STATUS.APPROVED).reduce((s, t) => s + (t.net_amount || t.amount || 0), 0) };
}

window.EquityBank = { ensureSystemAccounts, ensureUserAccount, getAccount, getBalance, requestTransaction, approvePendingTx, rejectPendingTx, directCredit, directDebit, freezeAccount, getMyNotifications, getMyTransactions, getUserPendingTx, getAllPendingCount, getPendingTx, getAccounts, getAllAccounts, openReceipt, findTxById, bankStats, generateReceiptHTML, pushBankNotif, getLedger, CURRENCY, BANK_NAME, TX_STATUS, TX_TYPE, ACCOUNT_TYPE, BANK_RESERVE_ID, BANK_FEE_ID };
