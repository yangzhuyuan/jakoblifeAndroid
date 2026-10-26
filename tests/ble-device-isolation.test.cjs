const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const mainSource = read('pages/tabBar/main/Main.vue');
const managerSource = read('pages/api/protocol/u16pro-ble-manager.js');
const noop = () => {};
const flush = () => new Promise(resolve => setImmediate(resolve));
const BPW1 = '81EEA001-E735-49EC-8A11-7E32CAE1E14E';
const BPW6 = '6E40FFF0-B5A3-F393-E0A9-E50E24DCCA9E';
const BC = 'DE5BF728-D711-4E47-AF26-65E3012A5DC7';
const CUFF = '0000FFF2-0000-1000-8000-00805F9B34FB';
const packet = (deviceId, serviceId, hex) => ({ deviceId, serviceId,
  value: Uint8Array.from(Buffer.from(hex, 'hex')).buffer });
const cuffPacket = () => packet('CUFF', CUFF,
  Buffer.from('sys=120&dia=80&pul=70&pad='.padEnd(194, ' ')).toString('hex'));

function extract(source, names, context, indent = '\t\t\t', classMethods = false) {
  const body = names.map(name => {
    const match = source.match(new RegExp('^' + indent + '(?:async )?' + name + '\\(', 'm'));
    assert.ok(match, name);
    const end = source.indexOf('\n' + indent + '}' + (classMethods ? '' : ','), match.index);
    assert.ok(end > match.index, name);
    return source.slice(match.index, end + indent.length + 2);
  }).join(',\n');
  return vm.runInContext('({' + body + '})', context);
}

function setup(mode = 'replace') {
  const listeners = [], timers = new Map(), calls = { bpw6: [], bc: [], main: [], cuff: [], writes: [], fail: [], restores: [] };
  const storage = new Map([['deviceIdwatch', 'WATCH-1'], ['BPW1deviceSn', 'SN-1'],
    ['BPW6devicemac', 'WATCH-6'], ['BPW6deviceSn', 'SN-6']]);
  let nextTimer = 0;
  const context = vm.createContext({ Uint8Array, ArrayBuffer, Date, Set,
    console: { log: noop, warn: noop, error: noop }, BPW1serviceId: BPW1, BPW1write: 'WRITE-1',
    BPW6SERVICE: BPW6, BPW6BC_SERVICE: BC, BC_PACKET: { HEADER: 0xbc },
    BLE_UUID: { SERVICE: BPW6 }, BC_BLE_UUID: { SERVICE: BC },
    OTA_DATA_RES_WATCH_CMD_IDS: new Set(), refreshQxBleKeepAliveNotification: noop,
    onQxBleWatchCollectionEnded: noop,
    setTimeout: (fn, ms) => { timers.set(++nextTimer, { fn, ms }); return nextTimer; },
    setInterval: (fn, ms) => { timers.set(++nextTimer, { fn, ms }); return nextTimer; },
    clearTimeout: id => timers.delete(id), clearInterval: id => timers.delete(id),
    uni: {
      getStorageSync: key => storage.get(key) || '', setStorageSync: (key, value) => storage.set(key, value),
      removeStorageSync: key => storage.delete(key),
      onBLECharacteristicValueChange: fn => { if (mode === 'replace') listeners.length = 0; listeners.push(fn); },
      writeBLECharacteristicValue: options => { calls.writes.push(options); options.success({}); },
      getNetworkType: noop, hideLoading: noop, showLoading: noop, showToast: noop
    }
  });
  const manager = Object.assign(extract(managerSource,
    ['setForwardNotifyHandler', 'addScopedNotifyHandler', 'removeScopedNotifyHandler',
      'clearForwardNotifyRouting', '_registerUnifiedBleListener', '_isSameBleUuid'], context, '\t', true), {
    deviceId: 'WATCH-6', bcDeviceId: 'WATCH-6', state: { ppgMeasuring: false },
    _handleBcDataReceived: (bytes, id) => { calls.bc.push({ bytes, id }); return { type: 'ppg_chunk' }; },
    _handleDataReceived: (res, id) => { calls.main.push(id); return { type: 'BPdata' }; }
  });
  context.u16proBLE = manager;
  const page = Object.assign(extract(mainSource, [
    'onBLECharacteristicValueChange1', 'onBLECharacteristicValueChange2', 'onBLECharacteristicValueChange3',
    'registerOtherBleNotifyHandler', 'registerBpw6BleNotifyListener', 'forwardOtherDeviceBleNotify',
    'routeOtherDeviceBleNotify', 'buildLegacyBleNotifyDispatch', 'releaseBpw6BleNotifyOwnership',
    'normalizeBleMac', 'isSameBleUuid', 'resetDataState', 'ab2hex', 'hexToAscii', 'parseQueryString',
    'writeBpw1EmotionMeasureCmd', 'clearBpw1PpgAckTimeout', 'armBpw1PpgAckTimeout',
    'clearBpw1PpgTransferWatchdog', 'handleProtocol0e', 'armBpw6PpgCompleteWatch',
    'endBpw6QxScheduledMeasureIfNeeded', 'isBpw1ActivePpgSession'
  ], context), {
    deviceIdwatch: 'WATCH-1', shoubiaosn: 'SN-1', xeuyejimac: 'CUFF', xeuyejisn: 'CUFF-SN',
    dataBuffer: [], bufferPPG: [], xueyehuilian: true, touchBpw1BleLinkAlive: noop,
    resolveBpw1DeviceSn: () => 'SN-1', resolveUploadTime: () => '2026-10-21 10:00:00',
    runHomeVitalRefreshIfAllowed: noop, $t: key => key,
    jakoblife_fat_scale: (...args) => calls.cuff.push(args),
    BPW6paredata: (...args) => calls.bpw6.push(args),
    notifyBpw1PpgFailOrInterrupt: reason => calls.fail.push(reason),
    restoreEmotionPageButtons: reason => { calls.restores.push(reason); page.sleep_alertdisabled = false;
      page._bpw6PpgCompleteWatchToken = null; page._bpw6PpgCompleteWatchArmed = false; },
    toArrayBuffer: hex => Uint8Array.from(Buffer.from(hex, 'hex')).buffer
  });
  function runTimers(ms) {
    for (const [id, timer] of [...timers]) if (timer.ms === ms) { timers.delete(id); timer.fn(); }
  }
  return { page, manager, calls, timers, storage, context, listeners, runTimers,
    emit: res => [...listeners].forEach(fn => fn(res)),
    bindCuff: () => page.onBLECharacteristicValueChange1('CUFF', CUFF, 'CUFF-SN'),
    bindWatch: () => page.onBLECharacteristicValueChange3('WATCH-1', BPW1, 'SN-1') };
}

for (const mode of ['replace', 'additive']) {
  for (const order of ['cuff-first', 'watch-first']) {
    test(`${mode}/${order}: cuff and both watches retain their own data and SN after re-registration`, () => {
      const h = setup(mode);
      if (order === 'cuff-first') { h.bindCuff(); h.bindWatch(); } else { h.bindWatch(); h.bindCuff(); }
      h.page.registerBpw6BleNotifyListener('WATCH-6', 'SN-6');
      h.bindCuff(); h.bindWatch();
      h.page.quotientPPG = 3;
      h.emit(packet('watch-1', BPW1.toLowerCase(), '010203'));
      h.emit(cuffPacket());
      h.runTimers(1000);
      assert.equal(h.calls.cuff.length, 1);
      assert.equal(h.calls.cuff[0][0], 'CUFF');
      assert.equal(h.calls.cuff[0][2], 'CUFF-SN');
      assert.equal(h.calls.cuff[0][1].sys, '120');
      assert.equal(h.page.dataBuffer.length, 1, 'cuff must not clear watch assembly');
      assert.equal(h.page.quotientPPG, 3);
      h.emit(packet('WATCH-1', BPW1, 'bc020304'));
      assert.equal(h.page.dataBuffer.length, 2, 'BC-prefixed continuation still belongs to BPW1');
      assert.equal(h.calls.bc.length, 0);
      h.emit(packet('WATCH-6', BC.toLowerCase(), 'bc010203'));
      h.emit(packet('WATCH-6', BPW6.toLowerCase(), '32010203'));
      assert.equal(h.calls.bc.length, 1);
      assert.equal(h.calls.main.length, 1);
      assert.equal(h.calls.bpw6.length, 2, 're-registering must not process the same notification twice');
      assert.ok(h.calls.bpw6.every(args => args[1] === 'WATCH-6' && args[2] === 'SN-6'));
      assert.equal(h.page.dataBuffer.length, 2);
    });
  }
}

test('unrelated device packets and wrong services never enter another device parser', () => {
  const h = setup(); h.bindWatch(); h.bindCuff();
  h.emit(packet('FOREIGN', BPW1, '010203'));
  h.emit(packet('FOREIGN', BC, 'bc010203'));
  h.emit({ ...cuffPacket(), deviceId: 'FOREIGN' });
  h.emit(packet('WATCH-1', CUFF, '010203'));
  h.runTimers(1000);
  assert.equal(h.calls.cuff.length + h.calls.bc.length + h.calls.main.length, 0);
  assert.equal(h.page.dataBuffer.length, 0);
});

test('unbinding BPW6 retains BPW1 and cuff handlers', () => {
  const h = setup('additive'); h.bindWatch(); h.bindCuff();
  h.storage.delete('BPW6devicemac'); h.storage.delete('BPW6deviceSn');
  h.page.releaseBpw6BleNotifyOwnership();
  h.emit(packet('WATCH-1', BPW1, '010203')); h.emit(cuffPacket()); h.runTimers(1000);
  assert.equal(h.page.dataBuffer.length, 1);
  assert.equal(h.calls.cuff.length, 1);
});

test('legacy two-service device keeps its original parser and does not consume BPW1 data', () => {
  const h = setup(); const legacy = [];
  h.page.jakoblife_fat_scale2 = (...args) => legacy.push(args);
  h.page.onBLECharacteristicValueChange2('OLD-WATCH', 'OLD-SERVICE', 'OLD-SN'); h.bindWatch();
  h.emit(packet('OLD-WATCH', 'old-service', '00000000000000014800'));
  h.emit(packet('WATCH-1', BPW1, '010203'));
  assert.equal(legacy.length, 1);
  assert.equal(legacy[0][0], 'OLD-WATCH'); assert.equal(legacy[0][4], 'OLD-SN');
  assert.equal(h.page.dataBuffer.length, 1);
});

test('BPW1 completion uploads watch samples with watch identity after an interleaved cuff result', () => {
  const h = setup('additive'); const uploads = [], acks = [];
  h.bindWatch(); h.bindCuff();
  Object.assign(h.page, {
    immediateEmotionMeasure: true, bufferPPG: [120, -20, 130], quotientPPG: 3,
    parseBinaryTime: () => ({}), parsePPGConfigDescOrder: () => ({}),
    packInt16: samples => samples, setEmotionMeasureBusy: noop,
    ppgdata: (...args) => uploads.push(args), sendack: (...args) => acks.push(args)
  });
  h.emit(cuffPacket()); h.runTimers(1000);
  h.emit(packet('WATCH-1', BPW1.toLowerCase(), 'e0000b0003001d0000000005000102'));
  h.runTimers(3000);
  assert.equal(h.calls.cuff.length, 1);
  assert.equal(uploads.length, 1);
  assert.deepEqual(uploads[0][0], [120, -20, 130]);
  assert.equal(uploads[0][1], 'SN-1');
  assert.equal(uploads[0][2], 'WATCH-1');
  assert.equal(uploads[0][3].wasImmediateCloud, true);
  assert.equal(acks.length, 1); assert.equal(acks[0][1], 'WATCH-1');
  assert.equal(h.calls.restores.length, 0, 'normal completion must preserve cloud analysis state');
});

test('cuff error fallback closes only the cuff connection', () => {
  const h = setup(); const closed = [], disconnected = [];
  h.bindWatch();
  h.context.uni.closeBLEConnection = ({ deviceId }) => closed.push(deviceId);
  h.page.disconnectAll = id => disconnected.push(id);
  h.page.getUserInfo = noop;
  h.page.deviceList = [{ mac: 'WATCH-1' }, { mac: 'CUFF' }];
  h.emit(packet('CUFF', CUFF, Buffer.from('error').toString('hex')));
  assert.deepEqual(closed, ['CUFF']); assert.deepEqual(disconnected, ['CUFF']);
  assert.deepEqual(h.page.deviceList, [{ mac: 'WATCH-1' }]);
});

test('BPW1 command still writes to watch; missing ACK has a bounded failure path', () => {
  const h = setup(); h.bindCuff();
  h.page.writeBpw1EmotionMeasureCmd('after_bp');
  assert.equal(h.calls.writes[0].deviceId, 'WATCH-1');
  assert.equal(h.calls.writes[0].serviceId, BPW1);
  assert.equal(h.page.sleep_alertdisabled, true);
  h.runTimers(90000);
  assert.equal(h.calls.fail.length, 1);
});

test('BPW1 ACK cancels only the missing-ACK guard and preserves normal collection timeout', () => {
  const h = setup(); h.page.writeBpw1EmotionMeasureCmd('immediate');
  const ackTimer = h.page._bpw1PpgAckTimer;
  h.page.handleProtocol0e('0e000600030025000101', '03', '0e00');
  assert.equal(h.page._bpw1PpgAckTimer, null);
  assert.equal(h.timers.has(ackTimer), false);
  assert.ok(h.page.watchtimer);
  assert.equal(h.calls.fail.length, 0);
});

test('cleared/late BPW1 timeout cannot terminate a subsequent measurement', () => {
  const h = setup(); h.page.armBpw1PpgAckTimeout();
  const old = h.timers.get(h.page._bpw1PpgAckTimer).fn;
  h.page.clearBpw1PpgTransferWatchdog(); h.page.armBpw1PpgAckTimeout();
  old(); assert.equal(h.calls.fail.length, 0);
  assert.ok(h.page._bpw1PpgAckTimer);
});

test('BPW6 after-BP completion timeout restores UI and clears measuring state', async () => {
  const h = setup(); let reject;
  h.manager.watchPpgMeasurementComplete = () => new Promise((resolve, rej) => { reject = rej; });
  h.storage.set('bpw6_after_bp_ppg', 1);
  h.page.bpw6PpgMeasuring = h.page.sleep_alertdisabled = h.manager.state.ppgMeasuring = true;
  h.page.armBpw6PpgCompleteWatch('WATCH-6'); reject(Error('timeout')); await flush();
  assert.equal(h.page.sleep_alertdisabled, false);
  assert.equal(h.page.bpw6PpgMeasuring, false);
  assert.equal(h.manager.state.ppgMeasuring, false);
  assert.equal(h.calls.restores.length, 1);
});

test('BPW6 timeout ends after-BP training instead of keeping cloud analysis pending', async () => {
  const h = setup(); let reject; const results = [];
  h.manager.watchPpgMeasurementComplete = () => new Promise((resolve, rej) => { reject = rej; });
  Object.assign(h.page, extract(mainSource, ['restoreEmotionPageButtons'], h.context), {
    clearBpw1ImmediateStartWait: noop, setBpw6EmotionPpgPhase: noop,
    clearBpw1LiveBpHrFlushTimer: noop, clearBpw1AfterBpPpgTick: noop,
    clearBpw1LiveBpMeasureGate: noop, clearBpw6AfterBpPpgBusyMark: noop,
    clearBpw6PpgSessionBusyMark: noop, hideBpw6PpgLoading: noop,
    isAfterBpAiTrainSessionActive: () => true,
    finishAfterBpAiTrainResult: (...args) => results.push(args),
    markAfterBpAiTrainCloudPhase: () => assert.fail('a timeout must not re-enter cloud analysis'),
    applyEmotionButtonIdleByBind: () => { h.page.sleep_alertdisabled = false; }
  });
  h.storage.set('bpw6_after_bp_ppg', 1);
  h.page.bpw6PpgMeasuring = h.page.sleep_alertdisabled = true;
  h.page.armBpw6PpgCompleteWatch('WATCH-6'); reject(Error('timeout')); await flush();
  assert.equal(results.length, 1); assert.equal(results[0][0], 'fail');
  assert.equal(h.page.sleep_alertdisabled, false);
  assert.equal(h.page.bpw6NeedClearLoadingOnShow, true);
});

test('old BPW6 watch rejection cannot clear a newer measurement', async () => {
  const h = setup(); const rejects = [];
  h.manager.watchPpgMeasurementComplete = () => new Promise((resolve, reject) => rejects.push(reject));
  h.page.bpw6PpgMeasuring = h.page.sleep_alertdisabled = true;
  h.page.armBpw6PpgCompleteWatch('WATCH-6');
  h.page.restoreEmotionPageButtons('previous measurement ended'); h.calls.restores.length = 0;
  h.page.sleep_alertdisabled = true; h.page.armBpw6PpgCompleteWatch('WATCH-6');
  rejects[0](Error('old timeout')); await flush();
  assert.equal(h.calls.restores.length, 0);
  assert.equal(h.page.sleep_alertdisabled, true);
  assert.equal(h.page._bpw6PpgCompleteWatchArmed, true);
});
