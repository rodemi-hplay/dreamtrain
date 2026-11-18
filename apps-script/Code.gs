/**
 * 삼척 꿈의 열차 탈출 작전 — Google Apps Script 서버 (저장·교사 로그인 API)
 *
 * 1) Google 스프레드시트 > 확장 프로그램 > Apps Script 에 이 코드를 붙여 넣어요.
 * 2) 프로젝트 설정(톱니바퀴) > 스크립트 속성 > TEACHER_PASSWORD 에 교사 비밀번호를 넣어요.
 *    (비밀번호는 코드에 쓰지 않아요. GitHub 에 올려도 안전해요.)
 * 3) 배포 > 새 배포 > 웹 앱 (실행: 나, 액세스: 모든 사용자) → 나온 주소를 config.js 의 API_URL 에 넣어요.
 */

const SHEET_NAME = 'runs';
const HEADER = ['runId', '업데이트', '이름', '지금 위치', '완료', '걸린 시간(초)', '힌트',
  '진로 가치', '꿈 직업', '진로 장벽', '해결 방법', '10년 뒤의 나', '새로 알게 된 것', '지금부터 할 일', '상태', 'JSON'];

function doGet() {
  return json_({ ok: true, app: 'dreamtrain' });
}

function doPost(e) {
  let req = {};
  try { req = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'bad_request' }); }
  switch (req.action) {
    case 'save': return json_({ ok: saveRun_(req.run) });
    case 'check': return json_({ ok: pwOk_(req.pw) });
    case 'list': return json_(pwOk_(req.pw) ? { ok: true, runs: listRuns_() } : { ok: false });
    case 'clear': return json_({ ok: pwOk_(req.pw) && clearRuns_() });
    default: return json_({ ok: false, error: 'unknown_action' });
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function pwOk_(pw) {
  const real = PropertiesService.getScriptProperties().getProperty('TEACHER_PASSWORD');
  return !!real && typeof pw === 'string' && pw === real;
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADER);
    sh.setFrozenRows(1);
  }
  return sh;
}

// 시트 수식으로 해석되지 않도록 앞에 ' 를 붙여요
function cell_(v, max) {
  let s = String(v == null ? '' : v).slice(0, max || 500);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function saveRun_(run) {
  if (!run || typeof run.runId !== 'string' || !/^[a-z0-9]{6,40}$/.test(run.runId)) return false;
  const text = JSON.stringify(run);
  if (text.length > 20000) return false;
  const r = run.reflection || {};
  const row = [run.runId, new Date(), cell_(run.name, 20), cell_(run.stage, 40), run.done ? '완료' : '',
    Number(run.elapsedSec) || 0, Number(run.hints) || 0, cell_((run.values || []).join(', '), 100),
    cell_(run.dream, 40), cell_(run.barrier, 40), cell_(run.light, 60),
    cell_(r.future, 300), cell_(r.learned, 300), cell_(r.todo, 300), cell_(run.status, 20), text];
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const found = sh.getRange('A:A').createTextFinder(run.runId).matchEntireCell(true).findNext();
    if (found) sh.getRange(found.getRow(), 1, 1, row.length).setValues([row]);
    else sh.appendRow(row);
  } finally {
    lock.releaseLock();
  }
  return true;
}

function listRuns_() {
  const sh = sheet_();
  const n = sh.getLastRow();
  if (n < 2) return [];
  const vals = sh.getRange(2, HEADER.length, n - 1, 1).getValues();
  const runs = [];
  vals.forEach(function (v) { try { runs.push(JSON.parse(v[0])); } catch (e) {} });
  return runs;
}

function clearRuns_() {
  const sh = sheet_();
  const n = sh.getLastRow();
  if (n > 1) sh.deleteRows(2, n - 1);
  return true;
}
