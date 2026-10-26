const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const source = read('pages/tabBar/main/Main.vue');
const noop = () => {};
const flush = () => new Promise(resolve => setImmediate(resolve));

// Exercise the production methods with watch/cuff bindings and native BLE writes mocked.
const harness = { require, Buffer, __dirname, setImmediate, module: { exports: {} } };
const isolation = read('tests/ble-device-isolation.test.cjs');
vm.runInNewContext(isolation.slice(0, isolation.indexOf('\nfor (const mode of')) +
  '\nmodule.exports = { setup, extract };', harness);
const { setup: setupBle, extract } = harness.module.exports;

function setup() {
  const h = setupBle();
  let now = 1792548000000;
  h.context.Date = class extends Date { static now() { return now; } };
  h.advance = ms => { now += ms; };
  h.now = () => now;
  h.storage.set('userid', 'PATIENT');
  h.storage.set('token', 'TOKEN');
  h.storage.set('deviceSn', 'CUFF-SN');
  h.storage.set('lixianlist', [{ deviceModelId: '10005', mac: 'CUFF' },
    { deviceModelId: '30000', mac: 'WATCH-1' }, { deviceModelId: '30001', mac: 'WATCH-6' }]);
  Object.assign(h.page, extract(source, [
    'restoreEmotionPageButtons', 'isEmotionMeasureBusySession', 'applyEmotionButtonIdleByBind',
    'syncEmotionMeasureBusyFromStorage', 'hasBoundBpw1OrBpw6', 'isAfterBpAiTrainSessionActive',
    'finishAfterBpAiTrainResult', 'endAfterBpAiTrainLoading', 'clearBpw6AfterBpPpgBusyMark',
    'clearBpw6PpgSessionBusyMark', 'setBpw6EmotionPpgPhase', 'markAfterBpAiTrainCloudPhase',
    'notifyBpw1PpgFailOrInterrupt', 'hasLiveBpw1EmotionSession', 'isQxScheduledPpgSession'
  ], h.context), {
    sleep_alertdisabled: false, yalixueyatype: false,
    clearBpw1LiveBpHrFlushTimer: noop, clearBpw1AfterBpPpgTick: noop,
    clearBpw1LiveBpMeasureGate: noop, hideAfterBpAiTrainNativeLoading: noop,
    hideBpw6PpgLoading: noop, isAfterBpAiTrainTipMuted: () => true,
    canUseAfterBpAiTrainUi: () => true, syncAfterBpAiTrainLoading: noop,
    markBpw6PpgSessionBusy: noop, showBpw6PpgLoading: noop,
    isBpw6EmotionImmediateUi: () => false
  });
  const restore = h.page.restoreEmotionPageButtons;
  h.page.restoreEmotionPageButtons = function(reason) {
    h.calls.restores.push(reason);
    return restore.call(this, reason);
  };
  h.tick = async ms => { h.advance(ms); h.runTimers(ms); await flush(); };
  return h;
}

function setupLaunch(syncing = false) {
  const h = setup();
  h.calls.ota = [];
  Object.assign(h.page, extract(source, [
    'tryStartBpw1PpgAfterBp', '_runBpw1AfterBpPpgDue', 'resumeBpw1AfterBpPpgIfPending',
    'armBpw1AfterBpPpgTick', 'clearBpw1AfterBpPpgTick', 'sendstartheartwatch',
    'clearBpw1EmotionMeasureWait', 'flushBpw1PendingEmotionMeasure',
    'isBpw1HistorySyncing', 'isYaliSwitchEnabled', 'clearStaleBpw1PpgSessionMarks'
  ], h.context), {
    bpw1HistorySyncActive: syncing, writeuuid: 'CUFF-WRITE',
    bpResult: [{ high: 120 }], hrResult: [{ hr: 70 }],
    clearBpw6NativeDelayed: noop, resetPpgMeasureResultModalGuard: noop,
    setEmotionMeasureBusy(busy) { this.sleep_alertdisabled = busy; h.storage.set('sleep_alertdisabled', busy); },
    beginAfterBpAiTrainLoading() { this.afterBpAiTrainPpgRunning = true; },
    advanceAfterBpAiTrainTipToProgress: noop,
    OTAdata: (...args) => h.calls.ota.push(args)
  });
  return h;
}

test('BPW1: history wait expires after 20s + 12s and queues one watch PPG command', async () => {
  const h = setupLaunch(true), bp = h.page.bpResult, hr = h.page.hrResult;
  assert.equal(h.page.tryStartBpw1PpgAfterBp('test'), true);
  assert.equal(h.page.tryStartBpw1PpgAfterBp('duplicate'), false);
  await h.tick(20000);
  for (let i = 0; i < 5; i++) await h.tick(2000);
  assert.equal(h.calls.ota.length, 0);
  await h.tick(2000);
  assert.equal(h.calls.ota.length, 1);
  assert.deepEqual(h.calls.ota[0].slice(0, 3), ['WATCH-1', '81EEA001-E735-49EC-8A11-7E32CAE1E14E', 'WRITE-1']);
  assert.equal(h.page.bpw1PendingEmotionMeasure.source, 'after_bp');
  h.page.resumeBpw1AfterBpPpgIfPending('foreground');
  assert.equal(h.calls.ota.length, 1);
  await h.tick(4500);
  assert.equal(h.calls.writes.length, 1);
  assert.equal(h.calls.writes[0].deviceId, 'WATCH-1');
  assert.equal(h.calls.writes[0].characteristicId, 'WRITE-1');
  assert.ok(h.page._bpw1PpgAckTimer);
  assert.equal(h.page.bpw1HistorySyncActive, true);
  assert.equal(h.page.bpResult, bp);
  assert.equal(h.page.hrResult, hr);
  assert.equal(h.page.yalixueyatype, true);
  assert.equal(h.page.sleep_alertdisabled, true);
});

test('BPW1: normal delay and early history completion retain their original timing', async () => {
  for (const syncing of [false, true]) {
    const h = setupLaunch(syncing);
    h.page.tryStartBpw1PpgAfterBp('test');
    assert.equal(h.calls.ota.length, 0);
    await h.tick(20000);
    if (syncing) {
      assert.equal(h.calls.ota.length, 0);
      h.page.bpw1HistorySyncActive = false;
      await h.tick(2000);
    }
    assert.equal(h.calls.ota.length, 1);
    await h.tick(4500);
    assert.equal(h.calls.writes.length, 1);
  }
});

test('BPW1: pressure switched off during the delay restores buttons without a false start', async () => {
  for (const syncing of [false, true]) {
    const h = setupLaunch(syncing);
    h.page.tryStartBpw1PpgAfterBp('test');
    h.storage.set('yaliswitchHER', 'false');
    await h.tick(20000);
    if (syncing) for (let i = 0; i < 6; i++) await h.tick(2000);
    assert.equal(h.calls.ota.length + h.calls.writes.length, 0);
    assert.equal(h.page.yalixueyatype, false);
    assert.equal(h.page._bpw1AfterBpLaunching, false);
    assert.equal(h.page.sleep_alertdisabled, false);
    assert.equal(h.page.isAfterBpAiTrainSessionActive(), false);
    assert.ok(!h.page._bpw1LastPpgAfterBpAt);
    assert.equal(h.timers.size, 0);
  }
});

test('BPW1: timed-out history does not bypass an active immediate/transfer/scheduled measurement', async () => {
  for (const busy of ['immediateEmotionMeasure', 'bpw1PpgTransferActive', 'watchtimer2', 'sendwatch']) {
    const h = setupLaunch(true);
    h.page.tryStartBpw1PpgAfterBp('test');
    await h.tick(20000);
    if (busy === 'sendwatch') h.storage.set(busy, 1);
    else h.page[busy] = true;
    h.advance(12000); h.page._runBpw1AfterBpPpgDue();
    assert.equal(h.calls.ota.length, 0);
    assert.equal(h.calls.restores.length, 0, 'must not end the other measurement');
    assert.equal(busy === 'sendwatch' ? h.storage.get(busy) : h.page[busy], busy === 'sendwatch' ? 1 : true);
  }
});

test('BPW1: direct after-BP requests still wait for history; immediate and scheduled starts still work', () => {
  const h = setupLaunch(true);
  assert.equal(h.page.sendstartheartwatch('CUFF-WRITE', 1, 'after_bp'), false);
  assert.equal(h.calls.ota.length, 0);
  for (const source of ['immediate', 'scheduled']) {
    const h = setupLaunch(true);
    assert.equal(h.page.sendstartheartwatch('CUFF-WRITE', 1, source), true);
    assert.equal(h.calls.ota.length, 1);
    assert.equal(h.page.bpw1PendingEmotionMeasure.source, source);
  }
});

function setupRecovery() {
  const h = setupLaunch();
  h.context.isQxBleAppInForeground = () => true;
  h.calls.recoveries = []; h.calls.kicks = []; h.calls.closes = [];
  h.context.uni.closeBLEConnection = options => { h.calls.closes.push(options.deviceId); options.complete(); };
  Object.assign(h.page, extract(source, [
    'shouldDeferBpw1AfterBpRecovery', 'shouldDeferBpw1ForceRecover',
    'hasHardBlePpgTransferInFlight', 'hasBpw1NeedGattRecover',
    'armBpw1PendingHardRecover', 'flushBpw1PendingHardRecover', 'onBpw1EnsureReconnect',
    'tryBpw1ForegroundReconnectOnce', 'resetBpw1LiveWorkGatesOnBleDown'
  ], h.context), {
    acktypes: 1, bpw1NeedGattRecover: true,
    isDeviceBindingPageActive: () => false, isAndroidBluetoothEnabled: () => true,
    isBpw1LiveBpMeasuring: () => false, shouldDeferBleReconnectForPpg: () => false,
    forceBpw1FullPostReconnectSync: (...args) => h.calls.recoveries.push(args),
    kickBpw1ReconnectAfterForce: reason => h.calls.kicks.push(reason),
    ensureBpw1NotifySoft: noop
  });
  return h;
}

test('BPW1: foreground recovery and its delayed retry preserve the original after-BP deadline', async () => {
  const h = setupRecovery();
  h.page.tryStartBpw1PpgAfterBp('test');
  const dueAt = h.page._bpw1AfterBpPpgDueAt;
  h.advance(10000);
  h.page.onBpw1EnsureReconnect({ reason: 'app-show-fg-recover' });
  assert.equal(h.calls.recoveries.length, 0);
  assert.equal(h.calls.kicks.length, 0);
  assert.ok(h.page.bpw1PendingHardRecoverReason);
  await h.tick(3500);
  assert.equal(h.calls.recoveries.length, 0, 'the pending recovery must not bypass the guard');
  assert.equal(h.page._bpw1AfterBpPpgDueAt, dueAt);
  h.page.resumeBpw1AfterBpPpgIfPending('foreground');
  await h.tick(6500);
  assert.equal(h.calls.ota.length, 1);
  await h.tick(4500);
  assert.equal(h.calls.writes.length, 1);
  assert.equal(h.calls.writes[0].deviceId, 'WATCH-1');
  h.page.onBpw1EnsureReconnect({ reason: 'app-show-fg-recover' });
  h.page.flushBpw1PendingHardRecover('timer');
  assert.equal(h.calls.recoveries.length, 0);
  assert.equal(h.page.shouldDeferBpw1ForceRecover('heartbeat'), true);
});

test('BPW1: direct foreground reconnect does not close while waiting, collecting, or transferring', async () => {
  for (const phase of ['waiting', 'collecting', 'transferring']) {
    const h = setupRecovery();
    if (phase === 'waiting') h.page.tryStartBpw1PpgAfterBp('test');
    else {
      h.page._bpw1AfterBpCmdAt = h.now();
      h.page.yalixueyatype = true;
      h.page.bpw1PpgTransferActive = phase === 'transferring';
    }
    const reconnect = h.page.tryBpw1ForegroundReconnectOnce('app-show-longbg');
    await flush();
    assert.deepEqual(h.calls.closes, [], phase);
    await reconnect;
  }
});

test('BPW1: cloud-only, expired, and disconnected sessions still allow pending recovery', () => {
  for (const state of ['cloud', 'expired-command', 'expired-delay', 'disconnected', 'adapter-off', 'idle']) {
    const h = setupRecovery();
    h.page.yalixueyatype = h.page.sleep_alertdisabled = true;
    h.page._bpw1AfterBpCmdAt = h.now();
    if (state === 'cloud') h.page.bpw1CloudWaitStartedAt = h.now();
    if (state === 'expired-command') h.advance(120000);
    if (state === 'expired-delay') {
      h.page._bpw1AfterBpCmdAt = 0;
      h.page._bpw1AfterBpLaunching = true;
      h.page._bpw1AfterBpPpgDueAt = h.now() - 120000;
    }
    if (state === 'disconnected') h.page.resetBpw1LiveWorkGatesOnBleDown('ble_disconnect');
    if (state === 'adapter-off') h.page.bpw1AdapterWasOff = true;
    if (state === 'idle') h.page._bpw1AfterBpCmdAt = 0;
    assert.equal(h.page.shouldDeferBpw1ForceRecover('app-show-fg-recover'), false, state);
    h.page.armBpw1PendingHardRecover('app-show-fg-recover');
    h.page.flushBpw1PendingHardRecover('timer');
    assert.equal(h.calls.recoveries.length, 1, state);
    assert.equal(h.calls.kicks.length, 1, state);
    assert.equal(h.page.bpw1PendingHardRecoverReason, '', state);
  }
});

test('BPW1: completing or timing out the protected measurement releases the queued recovery', async () => {
  for (const end of ['complete', 'timeout']) {
    const h = setupRecovery();
    h.page.tryStartBpw1PpgAfterBp('test');
    await h.tick(20000); await h.tick(4500);
    h.page.onBpw1EnsureReconnect({ reason: 'app-show-fg-recover' });
    assert.equal(h.calls.recoveries.length, 0);
    if (end === 'complete') {
      h.page.restoreEmotionPageButtons('血压后PPG结束');
      await h.tick(3500);
    } else {
      await h.tick(90000);
    }
    assert.equal(h.calls.recoveries.length, 1, end);
    assert.equal(h.calls.kicks.length, 1, end);
    assert.equal(h.page.bpw1PendingHardRecoverReason, '', end);
    h.page.flushBpw1PendingHardRecover('duplicate');
    assert.equal(h.calls.recoveries.length, 1, end);
  }
});

test('BPW1: stalled transfer retains its existing recovery timeout', () => {
  const h = setupRecovery();
  h.page._bpw1AfterBpCmdAt = h.now() - 40000;
  h.page.bpw1PpgTransferActive = true;
  h.page.bufferPPG = [120];
  h.page.bpw1PpgLastPacketAt = h.now() - 35001;
  assert.equal(h.page.shouldDeferBpw1ForceRecover('app-show-fg-recover'), false);
  h.page.armBpw1PendingHardRecover('app-show-fg-recover');
  h.page.flushBpw1PendingHardRecover('timer');
  assert.equal(h.calls.recoveries.length, 1);
});

const offline = { errMsg: 'request:fail timeout' };
const ok = { code: 200 };

function setupUpload(model, responses, mode = 'after_bp') {
  const h = setup();
  const immediate = mode === 'immediate', afterBp = mode === 'after_bp';
  h.requests = []; h.polls = []; h.scheduledEnds = [];
  Object.assign(h.page, extract(source, ['postWatchPpgRawData', 'ppgdata', 'bpw6PpgRawData'], h.context), {
    $url_APP_IP: 'mock-server', QX_HIDE: true, sleep_alertdisabled: true,
    afterBpAiTrainPpgRunning: afterBp, afterBpAiTrainProgressActive: afterBp,
    immediateEmotionMeasure: immediate, bpw6EmotionPpgActive: model === 'BPW6' && immediate,
    ppgUploadInProgress: model === 'BPW6',
    isBpw6EmotionImmediateUi: () => model === 'BPW6' && immediate,
    getTimeAllJSON: () => ({ YMDHMS: '2026-10-21 10:00:00' }),
    UTCdatatime: () => ({ timestampSec: Math.floor(h.now() / 1000) }),
    $post: (...args) => {
      h.requests.push(args);
      const response = responses[Math.min(h.requests.length - 1, responses.length - 1)];
      return response.reject ? Promise.reject(response.reject) : Promise.resolve(response);
    },
    deviceppgdatalist: (...args) => h.polls.push(args),
    notifyQxScheduledMeasureEnd: reason => h.scheduledEnds.push(reason),
    notifyBpw6EmotionImmediateFail(key, reason) { this.restoreEmotionPageButtons(reason); }
  });
  h.storage.set('sleep_alertdisabled', true);
  if (mode === 'scheduled') h.storage.set('qx_ble_scheduled_measure', 1);
  if (model === 'BPW6' && afterBp) h.storage.set('bpw6_after_bp_ppg', 1);
  h.start = () => model === 'BPW1' ? h.page.ppgdata('RAW-WATCH-1', 'SN-1', 'WATCH-1', {
    wasImmediateCloud: immediate, wasAfterBpCloud: afterBp
  }) : h.page.bpw6PpgRawData('RAW-WATCH-6', 'SN-6', 'WATCH-6');
  return h;
}

for (const model of ['BPW1', 'BPW6']) {
  test(`${model}: failed after-BP upload retries the same payload and polls once on success`, async () => {
    const h = setupUpload(model, [{ reject: offline }, { reject: offline }, ok]);
    h.start(); await flush();
    assert.equal(h.page.sleep_alertdisabled, true);
    assert.equal(h.page.isAfterBpAiTrainSessionActive(), true);
    assert.equal(h.polls.length, 0);
    if (model === 'BPW6') assert.equal(h.page.ppgUploadInProgress, true);
    h.storage.set('deviceSn', 'ANOTHER-CUFF-SN');
    await h.tick(2000);
    assert.equal(h.requests.length, 2);
    assert.equal(h.calls.restores.length, 0);
    await h.tick(4000);
    assert.equal(h.requests.length, 3);
    for (const request of h.requests) {
      assert.equal(request[0], 'mock-server/prod-api/device/ppgdata');
      assert.equal(request[1], h.requests[0][1], 'reuse original data, including measurement timestamp');
      assert.equal(request[2], h.requests[0][2]);
      assert.equal(request[1].deviceSn, model === 'BPW1' ? 'SN-1' : 'SN-6');
      assert.equal(request[1].rawData, model === 'BPW1' ? 'RAW-WATCH-1' : 'RAW-WATCH-6');
    }
    assert.equal(h.polls.length, 1);
    assert.equal(h.polls[0][0], model === 'BPW1' ? 'SN-1' : 'SN-6');
    assert.equal(h.polls[0][2].afterBpTrain, true);
    assert.equal(h.page.sleep_alertdisabled, true, 'keep waiting for cloud analysis');
    if (model === 'BPW6') assert.equal(h.page.ppgUploadInProgress, false);
    assert.equal(h.timers.size, 0);
  });

  test(`${model}: three failed after-BP requests stop retrying and restore buttons`, async () => {
    const h = setupUpload(model, [{ reject: offline }]);
    h.start(); await flush(); await h.tick(2000); await h.tick(4000);
    assert.equal(h.requests.length, 3);
    assert.equal(h.polls.length, 0);
    assert.equal(h.page.sleep_alertdisabled, false);
    assert.equal(h.page.isAfterBpAiTrainSessionActive(), false);
    assert.equal(h.page.isEmotionMeasureBusySession(), false);
    assert.equal(h.calls.restores.length, 1);
    assert.equal(h.timers.size, 0);
  });

  test(`${model}: normal upload and business/aborted failures do not retry`, async () => {
    for (const response of [ok, { code: 400 }, { code: 500 }, { reject: { code: 401 } },
      { reject: { errMsg: 'request:fail abort' } }]) {
      const h = setupUpload(model, [response]);
      h.start(); await flush();
      assert.equal(h.requests.length, 1);
      assert.equal(h.polls.length, response === ok ? 1 : 0);
      assert.equal(h.page.sleep_alertdisabled, response === ok);
      assert.equal(h.timers.size, 0);
    }
  });

  test(`${model}: retries stop if account changes or page is destroyed`, async () => {
    for (const stop of ['token', 'userid', '_isDestroyed']) {
      const h = setupUpload(model, [{ reject: offline }, ok]);
      h.start(); await flush();
      if (stop === '_isDestroyed') h.page._isDestroyed = true;
      else h.storage.set(stop, 'CHANGED');
      await h.tick(2000);
      assert.equal(h.requests.length, 1);
      assert.equal(h.polls.length, 0);
      assert.equal(h.timers.size, 0);
    }
  });

  test(`${model}: immediate and scheduled uploads retain single-request behavior`, async () => {
    for (const mode of ['immediate', 'scheduled']) {
      for (const response of [ok, { reject: offline }]) {
        const h = setupUpload(model, [response], mode);
        // Stale after-BP UI flags must not enable retries for another measurement type.
        h.page.afterBpAiTrainCloudActive = true;
        h.start(); await flush();
        assert.equal(h.requests.length, 1);
        assert.equal(h.polls.length, response === ok ? 1 : 0);
        assert.ok(![...h.timers.values()].some(timer => timer.ms === 2000 || timer.ms === 4000));
        if (model === 'BPW6' && mode === 'scheduled') assert.equal(h.scheduledEnds.length, 1);
      }
    }
  });
}

test('BPW6: muted after-BP UI still retries based on the measurement marker', async () => {
  const h = setupUpload('BPW6', [{ reject: offline }, ok]);
  h.page.afterBpAiTrainPpgRunning = false;
  h.page.afterBpAiTrainProgressActive = false;
  h.page.canUseAfterBpAiTrainUi = () => false;
  h.start(); await flush();
  assert.equal(h.page.ppgUploadInProgress, true);
  await h.tick(2000);
  assert.equal(h.requests.length, 2);
  assert.equal(h.polls.length, 1);
  assert.equal(h.page.ppgUploadInProgress, false);
  assert.equal(h.page.sleep_alertdisabled, false);
  assert.equal(h.timers.size, 0);
});
