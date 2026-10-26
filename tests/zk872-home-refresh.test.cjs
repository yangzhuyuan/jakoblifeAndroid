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
  'shouldKeepBpw6PendingHrAgainstServer', 'processBloodPressureData', 'refreshArmCuffHomeBpFromLog',
  'isDeviceNewerThanApiBaseline', 'runHomeVitalRefreshIfAllowed', 'rememberLiveUploadedHrUi',
  'BPW6paredata', 'handleXueyaBufferData', 'handleXinlvBufferData'];
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
  const context = { module: { exports: {} }, console: { log() {}, error() {}, warn() {} },
    Date: class extends Date { static now() { return (T + 120) * 1000; } },
    Healthparser: { parseProtocolData: () => ({ data: { records: [] } }) }, uni: {
    getStorageSync: key => storage.get(key) ?? '',
    setStorageSync: (key, value) => storage.set(key, value),
    getNetworkType: options => options.success({ networkType: 'none' })
  } };
  const request = (url, data) => new Promise(resolve => requests.push({ url, data, resolve }));
  const main = Object.assign({ highPressure: 120, lowPressure: 80, pulse: 70, Blood: 'mmHg', list: [],
    armCuffHomeBp: null, watchHomeBp: null, bpw6PendingHrUi: null, _listRecipeReqId: 1,
    $url_APP_IP: '', $url_query_log_v2: '/log', $post: request,
    getTimeAllJSON: () => ({ YMD: '2026-10-16' }), updateBloodPressureStatus() {}
  }, vm.runInNewContext(mainMethodsSource, context));
  vm.runInNewContext(panelSource, context);
  const component = context.module.exports;
  const panel = Object.assign({ embedded: true, highPressure: 120, lowPressure: 80, pulse: 70, apiBpTs: T,
    syncHighPressure: 120, syncLowPressure: 80, syncPulse: 70, syncList: [], syncArmCuffBp: null, syncWatchBp: null,
    $t: key => key, $url_APP_IP: '', $url_list_recipe: '/overview', $post: request
  }, component.methods);
  const sync = () => {
    panel.syncHighPressure = main.highPressure;
    panel.syncLowPressure = main.lowPressure;
    panel.syncPulse = main.pulse;
    panel.syncArmCuffBp = main.armCuffHomeBp;
    panel.syncWatchBp = main.watchHomeBp;
    panel.applyHomeSync();
  };
  async function receiveLog(response) {
    main.refreshArmCuffHomeBpFromLog();
    requests.at(-1).resolve(response);
    await flush();
    sync();
  }
  function receiveWatch(model, { time = T + 120, high = 135, low = 85, pulse = 70, live = true } = {}) {
    const noop = () => {};
    Object.assign(main, {
      bpw6BpBuffer: [], bpw6BpSyncing: !live, isBpw6LiveBpUploadWindow: () => live,
      confirmBpw6AfterBpMeasureOk: noop, persistBpw6LocalMac: noop,
      normalizeUnixTimestamp: value => Number(value), formatTimestampKey: value => String(value),
      dataBuffer: [], bpResult: [], hrResult: [], isBpw1HistorySyncing: () => !live,
      formatData: () => '00'.repeat(32), normalizeDateTimeKey: value => value,
      parseProtocolData: () => ({ Protocolsubcommand: model === 'BPW1-19' ? '19' : '01', Covmamlueand: '00'.repeat(16) }),
      parseBinaryTime: () => ({ datealltime: '2026-10-16' }), datatime: () => time,
      parseHeartRateData: () => ({ systolic: high, diastolic: low, bloodPressureType: pulse, time: '08:02:00' }),
      isBpw1BpPacketEligibleForLiveMeasure: () => live, isBpw1VeryRecentLiveVitalTs: () => live,
      isLikelyBpw1BpPacketPulse: () => true, tryFlushBpw1LiveBpHrUpload: noop,
      scheduleBpw1LiveBpHrRetry: noop, sendack2: noop, resetDataState: noop
    });
    if (model === 'BPW6') main.BPW6paredata({ type: 'BPdata', timestamp: time,
      systolic: high, diastolic: low, pulse }, 'WATCH-6', 'WATCH-SN-6');
    else if (model === 'BPW1-19') main.handleXinlvBufferData('WATCH-1', 'SERVICE-1', 'WRITE-1');
    else main.handleXueyaBufferData('WATCH-1', 'SERVICE-1', 'WRITE-1');
    sync();
  }
  return { main, panel, component, storage, requests, sync, receiveLog, receiveWatch };
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

for (const model of ['BPW1-01', 'BPW1-19', 'BPW6']) {
  test(`${model}: live watch BP replaces cuff BP immediately even with the same pulse and no network`, async () => {
    const h = setup();
    await h.receiveLog(log(T + 60));
    h.receiveWatch(model);
    assert.equal(h.main.highPressure, 135);
    assert.equal(h.panel.highPressure, 135);
    assert.equal(h.panel.lowPressure, 85);
    assert.equal(h.panel.pulse, 70);
    assert.equal(h.main.watchHomeBp.time, T + 120);
    assert.equal(h.panel.getSyncedArmCuffBp(), null);
  });

  test(`${model}: old/empty/equal-time overview cannot roll live BP back before or after upload`, async () => {
    const h = setup();
    await h.receiveLog(log(T + 60));
    h.receiveWatch(model);
    h.main.rememberLiveUploadedHrUi(70, T + 120);
    for (const time of [T + 60, 0, T + 120]) {
      h.main.processBloodPressureData(overview(time, 128, 84, 70).data);
      h.sync();
      assert.equal(h.main.highPressure, 135);
      assert.equal(h.panel.highPressure, 135);
      assert.equal(h.storage.get('parseBloodDatatime'), T + 120);
      h.panel.loadHomeMetrics(); h.requests.at(-1).resolve(overview(time, 128, 84, 70)); await flush();
      assert.equal(h.panel.highPressure, 135);
    }
    h.main.processBloodPressureData(overview(T + 120, 135, 85, 70, '3').data); h.sync();
    assert.equal(h.panel.highPressure, 135, 'same-pulse server confirmation must not restore the old panel value');
  });

  test(`${model}: newer server/cuff measurements take over and late panel responses cannot roll back`, async () => {
    const h = setup();
    await h.receiveLog(log(T + 60));
    h.panel.loadHomeMetrics(); const old = h.requests.at(-1);
    h.receiveWatch(model);
    h.panel.loadHomeMetrics(); h.requests.at(-1).resolve(overview(T + 180, 140, 90, 70, '3')); await flush();
    h.main.processBloodPressureData(overview(T + 180, 140, 90, 70, '3').data); h.sync();
    assert.equal(h.panel.getSyncedWatchBp(), null);
    old.resolve(overview(T + 60, 128, 84, 70)); await flush();
    assert.equal(h.main.highPressure, 140);
    assert.equal(h.panel.highPressure, 140);
    await h.receiveLog(log(T + 240, 130, 82, 70));
    assert.equal(h.main.highPressure, 130);
    assert.equal(h.panel.highPressure, 130);
  });

  test(`${model}: history packets retain the existing timestamp rules without a live marker`, () => {
    const h = setup();
    h.receiveWatch(model, { time: T - 60, live: false });
    assert.equal(h.main.highPressure, 120);
    assert.equal(h.panel.highPressure, 120);
    assert.equal(h.main.watchHomeBp, null);
  });
}

test('a late panel request started before live BP cannot cover the new watch reading', async () => {
  const h = setup();
  await h.receiveLog(log(T + 60));
  h.panel.loadHomeMetrics(); const old = h.requests.at(-1);
  h.receiveWatch('BPW6', { pulse: 75 });
  old.resolve(overview(T + 60, 128, 84, 70)); await flush();
  assert.equal(h.panel.highPressure, 135);
  assert.equal(h.panel.lowPressure, 85);
});

test('live watch marker handles equal baseline, kPa display and repeated same-value measurements', () => {
  const h = setup(); h.main.Blood = 'kPa';
  h.panel.apiBpTs = T + 120; h.storage.set('parseBloodDatatime', T + 120);
  h.receiveWatch('BPW6');
  assert.equal(h.panel.highPressure, (135 * 0.133).toFixed(1));
  assert.equal(h.panel.getSyncedWatchBp().high, 135, 'match raw values, not converted display values');
  const first = h.main.watchHomeBp;
  h.receiveWatch('BPW6', { time: T + 180 });
  assert.notEqual(h.main.watchHomeBp, first);
  let scheduled = 0;
  h.component.watch.syncWatchBp.call({ scheduleHomeSync() { scheduled++; } });
  assert.equal(scheduled, 1, 'a new timestamp must synchronize even when BP/pulse values are unchanged');
});

test('unmarked cuff/other vitals, standalone panels and another account do not use watch protection', () => {
  const h = setup();
  h.main.runHomeVitalRefreshIfAllowed(T + 60, 'parseBloodDatatime', () => {}, { forceLiveRefresh: true });
  h.main.runHomeVitalRefreshIfAllowed(T + 60, 'heartRateDatatime', () => {}, { forceLiveRefresh: true, watchBp: true });
  assert.equal(h.main.watchHomeBp, null);
  h.receiveWatch('BPW6');
  h.panel.embedded = false;
  assert.equal(h.panel.getSyncedWatchBp(), null);
  h.panel.embedded = true; h.storage.set('userid', 'another-user');
  assert.equal(h.panel.getSyncedWatchBp(), null);
  h.main.processBloodPressureData(overview(T + 60, 128, 84, 70).data);
  assert.equal(h.main.highPressure, 128, 'an old account marker cannot override normal server reconciliation');
});
