const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '../pages/tabBar/main/Main.vue'), 'utf8');
const noop = () => {};
const flush = () => new Promise(resolve => setImmediate(resolve));
const names = [
  'deviceppgdatalist', 'restoreEmotionPageButtons', 'isEmotionMeasureBusySession',
  'applyEmotionButtonIdleByBind', 'syncEmotionMeasureBusyFromStorage', 'hasBoundBpw1OrBpw6',
  'isAfterBpAiTrainSessionActive', 'finishAfterBpAiTrainResult', 'endAfterBpAiTrainLoading',
  'clearBpw1PpgTransferWatchdog', 'clearBpw1PpgAckTimeout', 'clearBpw6AfterBpPpgBusyMark',
  'clearBpw6PpgSessionBusyMark', 'setBpw6EmotionPpgPhase', 'markAfterBpAiTrainCloudPhase',
  'parsePpgRowTimeMs'
];
const methods = names.map(name => {
  const start = source.indexOf('\n\t\t\t' + name + '(') + 1;
  assert.ok(start > 0, name);
  const end = source.indexOf('\n\t\t\t},', start);
  assert.ok(end > start, name);
  return source.slice(start, end + 5);
}).join(',\n');

function setup(model, responses, immediate = false) {
  let now = 1792548000000, timerId = 0;
  const timers = new Map(), requests = [], details = [], polls = [];
  const storage = new Map([
    ['sleep_alertdisabled', true],
    ['lixianlist', [{deviceModelId: '10005', mac: 'CUFF'},
      {deviceModelId: model === 'BPW1' ? '30000' : '30001', mac: 'WATCH'}]],
    [model === 'BPW1' ? 'deviceIdwatch' : 'BPW6devicemac', 'WATCH']
  ]);
  if (model === 'BPW6' && !immediate) storage.set('bpw6_after_bp_ppg', 1);
  class FakeDate extends Date { static now() { return now; } }
  const context = vm.createContext({
    console: {log: noop, warn: noop, error: noop}, Date: FakeDate,
    setTimeout: (fn, ms) => { timers.set(++timerId, {fn, ms}); return timerId; },
    clearTimeout: id => timers.delete(id), clearInterval: id => timers.delete(id),
    uni: {getStorageSync: key => storage.get(key) || '',
      setStorageSync: (key, value) => storage.set(key, value),
      removeStorageSync: key => storage.delete(key), hideLoading: noop}
  });
  const page = Object.assign(vm.runInContext('({' + methods + '})', context), {
    sleep_alertdisabled: true, afterBpAiTrainCloudActive: !immediate,
    afterBpAiTrainAwaitResult: !immediate, afterBpAiTrainProgressActive: !immediate,
    afterBpAiTrainPpgRunning: !immediate, bpw6PpgMeasuring: false,
    bpw6PpgFinishing: false, ppgUploadInProgress: false, bpw6EmotionPpgPhase: '',
    bpw1CloudWaitActive: immediate && model === 'BPW1',
    bpw6EmotionPpgActive: immediate && model === 'BPW6', immediateEmotionMeasure: immediate,
    $url_APP_IP: 'local-mock', getTimeAllJSON: () => ({YMD: '2026-10-21'}),
    isBpw6EmotionImmediateUi: () => immediate && model === 'BPW6',
    $get: (...args) => {
      requests.push(args);
      const response = responses[Math.min(requests.length - 1, responses.length - 1)];
      return response instanceof Error ? Promise.reject(response) : Promise.resolve(response);
    },
    ppgdatalist: (...args) => details.push(args),
    clearBpw1LiveBpHrFlushTimer: noop, clearBpw1AfterBpPpgTick: noop,
    clearBpw1LiveBpMeasureGate: noop, hideAfterBpAiTrainNativeLoading: noop,
    hideBpw6PpgLoading: noop, isAfterBpAiTrainTipMuted: () => true,
    canUseAfterBpAiTrainUi: () => true, syncAfterBpAiTrainLoading: noop,
    markBpw6PpgSessionBusy: noop, showBpw6PpgLoading: noop
  });
  const poll = page.deviceppgdatalist;
  page.deviceppgdatalist = function(...args) { polls.push(args); return poll.apply(this, args); };
  return {page, storage, timers, requests, details, polls,
    start: () => page.deviceppgdatalist('WATCH-SN', 'WATCH', {
      bpw1Poll: !immediate || model === 'BPW1', afterBpTrain: !immediate,
      wasAfterBpCloud: !immediate, wasImmediateCloud: immediate && model === 'BPW1', startedAt: now
    }),
    advance: ms => { now += ms; },
    tick: async () => {
      assert.equal(timers.size, 1, 'exactly one retry should be pending');
      const [id, timer] = timers.entries().next().value;
      timers.delete(id); now += timer.ms; timer.fn(); await flush();
    }
  };
}

function response(status) {
  return {code: 200, rows: [
    {deviceSn: 'WATCH-SN', processingStatus: status},
    {deviceSn: 'OTHER-SN', processingStatus: 'RAW'}
  ]};
}

function assertIdle(h) {
  assert.equal(h.page.sleep_alertdisabled, false);
  assert.equal(h.storage.get('sleep_alertdisabled'), false);
  assert.equal(h.page.isEmotionMeasureBusySession(), false);
  assert.equal(h.page.afterBpAiTrainAwaitResult, false);
  assert.equal(h.storage.has('bpw6_after_bp_ppg'), false);
  assert.equal(h.timers.size, 0);
}

for (const model of ['BPW1', 'BPW6']) {
  test(`${model}: after-BP query retries network failure and restores buttons after analysis`, async () => {
    const h = setup(model, [Error('network offline'), response('ANALYZED')]);
    h.start(); await flush();
    assert.equal(h.page.sleep_alertdisabled, true);
    assert.equal([...h.timers.values()][0]?.ms, 2000);
    await h.tick();
    assertIdle(h);
    assert.deepEqual(h.details, [['WATCH-SN', 'WATCH']]);
    assert.equal(h.polls[1][2].attempt, 1);
    assert.equal(h.polls[1][2].startedAt, h.polls[0][2].startedAt);
    assert.equal(h.polls[1][2].afterBpTrain, true);
  });

  test(`${model}: repeated network failures restore after the existing 45-query limit`, async () => {
    const h = setup(model, [Error('network offline')]);
    h.start(); await flush();
    for (let i = 1; i < 45; i++) await h.tick();
    assert.equal(h.requests.length, 45);
    assertIdle(h);
  });

  test(`${model}: a failed query past the existing 90-second limit restores without retrying`, async () => {
    const h = setup(model, [Error('network offline')]);
    h.start(); await flush(); h.advance(90000); await h.tick();
    assert.equal(h.requests.length, 2);
    assertIdle(h);
  });

  test(`${model}: normal pending, successful and quality-result paths retain their behavior`, async () => {
    for (const pending of [response('RAW'), {code: 200, rows: []}]) {
      const h = setup(model, [pending, response('ANALYZED')]);
      h.start(); await flush();
      assert.equal(h.page.sleep_alertdisabled, true);
      assert.equal([...h.timers.values()][0]?.ms, 2000);
      await h.tick(); assertIdle(h);
    }
    for (const status of ['ANALYZED', 'LOW_QUALITY', 'INVALID_DATA', 'ERROR']) {
      const h = setup(model, [response(status)]);
      h.start(); await flush(); assertIdle(h);
      assert.equal(h.requests.length, 1);
    }
  });

  test(`${model}: immediate measurement retains its existing 1.5-second network retry`, async () => {
    const h = setup(model, [Error('network offline')], true);
    h.start(); await flush();
    assert.equal(h.page.sleep_alertdisabled, true);
    assert.equal([...h.timers.values()][0]?.ms, 1500);
    await h.tick();
    assert.equal(h.page.sleep_alertdisabled, true);
    assert.equal([...h.timers.values()][0]?.ms, 1500);
    assert.equal(h.requests.length, 2);
  });
}
