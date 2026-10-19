// Run with: node --test tests/zk872-home-refresh.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const readScript = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8')
  .split('<script>')[1].split('</script>')[0];
const mainScript = readScript('pages/tabBar/main/Main.vue');
const methodNames = ['isValidRegisterVal', 'registerUpdateTimeSec', 'normalizeHomeVitalTs',
  'getLatestRegisterFromList', 'getLatestRegisterEntry', 'getLatestBloodPressurePair', 'formatDate',
  'shouldKeepBpw6PendingHrAgainstServer', 'processBloodPressureData', 'refreshArmCuffHomeBpFromLog'];
// Load only the actual data-refresh methods; do not initialize native BLE or other home-page services.
const mainMethodsSource = '({' + methodNames.map(name => {
  const start = mainScript.indexOf('\t\t\t' + name + '(');
  const end = mainScript.indexOf('\n\t\t\t},', start);
  assert.ok(start >= 0 && end > start, 'Missing method: ' + name);
  return mainScript.slice(start, end + '\n\t\t\t}'.length);
}).join(',\n') + '})';
const panelSource = readScript('pages/tabBar/main/Health_Summary_Panel.vue')
  .replace(/import[\s\S]*?from\s+'[^']+';?/g, '').replace('export default', 'module.exports =');
const T = 1792108800;
const flush = () => new Promise(resolve => setImmediate(resolve));
const overview = (time, high = 120, low = 80, pulse = 70, slaveSn = '2') => ({ code: 200,
  data: [['highPressure', high], ['lowPressure', low], ['heartrate', pulse]]
    .map(([register, registerVal]) => ({ slaveSn, register, registerVal, updateTime: time })) });
const log = (time, high = 128, low = 84, pulse = 70) => ({ code: 200,
  data: [{ dateTime: '2026-10-16', object: { details: [
    { timestamp: time, highPressure: high, lowPressure: low, heartrate: pulse }
  ] } }] });

function setup() {
  const storage = new Map(Object.entries({ parseBloodDatatime: T, highPressure: 120, lowPressure: 80,
    pulse: 70, userid: 'test-user', token: 'test-token', lixianlist: [{ deviceModelId: '10005', deviceSn: 'zk-sn' }] }));
  const requests = [];
  const context = { module: { exports: {} }, console: { log() {} }, uni: {
    getStorageSync: key => storage.get(key) ?? '',
    setStorageSync: (key, value) => storage.set(key, value)
  } };
  const request = (url, data) => new Promise(resolve => requests.push({ url, data, resolve }));
  const main = Object.assign({ highPressure: 120, lowPressure: 80, pulse: 70, Blood: 'mmHg', list: [],
    armCuffHomeBp: null, bpw6PendingHrUi: null, _listRecipeReqId: 1,
    $url_APP_IP: '', $url_query_log_v2: '/log', $post: request,
    getTimeAllJSON: () => ({ YMD: '2026-10-16' }), updateBloodPressureStatus() {}
  }, vm.runInNewContext(mainMethodsSource, context));
  vm.runInNewContext(panelSource, context);
  const component = context.module.exports;
  const panel = Object.assign({ embedded: true, highPressure: 120, lowPressure: 80, pulse: 70, apiBpTs: T,
    syncHighPressure: 120, syncLowPressure: 80, syncPulse: 70, syncList: [], syncArmCuffBp: null,
    $t: key => key, $url_APP_IP: '', $url_list_recipe: '/overview', $post: request
  }, component.methods);
  const sync = () => {
    panel.syncHighPressure = main.highPressure;
    panel.syncLowPressure = main.lowPressure;
    panel.syncPulse = main.pulse;
    panel.syncArmCuffBp = main.armCuffHomeBp;
    panel.applyHomeSync();
  };
  async function receiveLog(response) {
    main.refreshArmCuffHomeBpFromLog();
    requests.at(-1).resolve(response);
    await flush();
    sync();
  }
  return { main, panel, component, storage, requests, sync, receiveLog };
}

test('a newer ZK Wi-Fi record reaches the visible panel even when the pulse did not change', async () => {
  const h = setup();
  await h.receiveLog(log(T + 60));
  assert.equal(h.requests[0].data.deviceSn[0], 'zk-sn');
  assert.equal(h.main.highPressure, 128);
  assert.equal(h.panel.highPressure, 128);
  assert.equal(h.panel.lowPressure, 84);
  assert.equal(h.panel.pulse, 70);
});

test('an older overview within 90 seconds cannot roll a confirmed ZK record or its cache backwards', async () => {
  const h = setup();
  await h.receiveLog(log(T + 60));
  for (const olderTime of [T, T + 60, 0]) {
    h.main.processBloodPressureData(overview(olderTime).data);
    h.sync();
    assert.equal(h.main.highPressure, 128);
    assert.equal(h.main.lowPressure, 84);
    assert.equal(h.storage.get('parseBloodDatatime'), T + 60);
    assert.equal(h.panel.highPressure, 128);
  }
});

test('a delayed panel overview cannot overwrite a ZK record received while the request was in flight', async () => {
  const h = setup();
  h.panel.loadHomeMetrics();
  const pendingOverview = h.requests[0];
  await h.receiveLog(log(T + 60));
  pendingOverview.resolve(overview(T));
  await flush();
  assert.equal(h.panel.highPressure, 128);
  assert.equal(h.panel.lowPressure, 84);
  assert.equal(h.panel.apiBpTs, T);
});

test('returning with an equal cached ZK record confirms its source and refreshes the panel', async () => {
  const h = setup();
  h.storage.set('parseBloodDatatime', T + 60);
  h.storage.set('highPressure', 128);
  h.storage.set('lowPressure', 84);
  h.main.highPressure = 128;
  h.main.lowPressure = 84;
  h.sync();
  assert.equal(h.panel.highPressure, 120, 'reproduce the original same-pulse gate before identifying the source');
  await h.receiveLog(log(T + 60));
  assert.equal(h.main.armCuffHomeBp.time, T + 60);
  assert.equal(h.panel.highPressure, 128);
  let scheduled = 0;
  h.component.watch.syncArmCuffBp.call({ scheduleHomeSync() { scheduled++; } });
  assert.equal(scheduled, 1, 'source confirmation must trigger synchronization even if parent values did not change');
});

test('a newer watch overview can replace the ZK value; late older panel responses cannot revert it while ZK is current', async () => {
  const h = setup();
  await h.receiveLog(log(T + 60));
  h.panel.loadHomeMetrics();
  const older = h.requests.at(-1);
  h.panel.loadHomeMetrics();
  h.requests.at(-1).resolve(overview(T + 120, 135, 85, 75, '3'));
  await flush();
  assert.equal(h.panel.highPressure, 135);
  older.resolve(overview(T));
  await flush();
  assert.equal(h.panel.highPressure, 135);
  h.main.processBloodPressureData(overview(T + 120, 135, 85, 75, '3').data);
  h.sync();
  assert.equal(h.main.highPressure, 135);
  assert.equal(h.panel.highPressure, 135);
  assert.equal(h.panel.getSyncedArmCuffBp(), null, 'the old ZK marker must not apply to a later watch measurement');
});

test('other sources retain their existing synchronization behavior even with an old ZK marker', () => {
  for (const marker of [null, { time: T - 60, high: 128, low: 84 }, { time: T + 60, high: 150, low: 90 }]) {
    const h = setup();
    h.storage.set('parseBloodDatatime', T + 60);
    h.storage.set('highPressure', 128);
    h.storage.set('lowPressure', 84);
    h.main.armCuffHomeBp = marker;
    h.main.processBloodPressureData(overview(T).data);
    h.sync();
    assert.equal(h.main.highPressure, 120);
    assert.equal(h.panel.getSyncedArmCuffBp(), null);
    h.panel.syncHighPressure = 128;
    h.panel.syncLowPressure = 84;
    h.storage.set('parseBloodDatatime', T + 600);
    h.panel.applyHomeSync();
    assert.equal(h.panel.highPressure, 120, 'do not change the existing rule for unmarked data');
  }
});

test('standalone summary panels and accounts without ZK keep the original behavior', async () => {
  const h = setup();
  await h.receiveLog(log(T + 60));
  h.panel.embedded = false;
  assert.equal(h.panel.getSyncedArmCuffBp(), null);
  h.storage.set('lixianlist', [{ deviceModelId: '30001', deviceSn: 'watch-sn' }]);
  const count = h.requests.length;
  h.main.refreshArmCuffHomeBpFromLog();
  assert.equal(h.requests.length, count);
  assert.equal(h.main.armCuffHomeBp, null);
});

test('stale responses, older records, and same-time different values cannot claim a newer measurement', async () => {
  const h = setup();
  h.main.refreshArmCuffHomeBpFromLog();
  h.main._listRecipeReqId++;
  h.requests[0].resolve(log(T + 60));
  await flush();
  assert.equal(h.main.armCuffHomeBp, null);
  await h.receiveLog(log(T - 60));
  assert.equal(h.main.armCuffHomeBp, null);
  await h.receiveLog(log(T));
  assert.equal(h.main.armCuffHomeBp, null);
  assert.equal(h.main.highPressure, 120);
});

test('ZK source matching uses raw values while the displayed kPa unit remains unchanged', async () => {
  const h = setup();
  h.main.Blood = 'kPa';
  await h.receiveLog(log(T + 60));
  assert.equal(h.panel.highPressure, (128 * 0.133).toFixed(1));
  assert.equal(h.panel.lowPressure, (84 * 0.133).toFixed(1));
  h.main.processBloodPressureData(overview(T).data);
  h.sync();
  assert.equal(h.panel.highPressure, (128 * 0.133).toFixed(1));
});
