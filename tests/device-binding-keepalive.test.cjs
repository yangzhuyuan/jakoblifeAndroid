// node --test tests/device-binding-keepalive.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));
const noop = () => {};

function setup(extra = {}) {
  const storage = new Map(Object.entries({ token: 'account-a', URL_APP_IP: 'https://example.invalid', ...extra }));
  const events = new Map(), emitted = [], calls = [], timers = new Map();
  let timerId = 0;
  const plugin = new Proxy({}, { get: (_, name) => (...args) => {
    calls.push({ name, args });
    const callback = args.at(-1);
    if (name !== 'init' && name !== 'startLocationKeepAlive' && typeof callback === 'function') callback({ code: 0 });
  } });
  const uni = {
    getStorageSync: key => storage.get(key) ?? '',
    setStorageSync: (key, value) => storage.set(key, value),
    removeStorageSync: key => storage.delete(key),
    getSystemInfoSync: () => ({ platform: 'android' }),
    requireNativePlugin: () => plugin,
    $on: (name, fn) => { if (!events.has(name)) events.set(name, new Set()); events.get(name).add(fn); },
    $off: (name, fn) => { if (fn) events.get(name)?.delete(fn); else events.delete(name); },
    $emit: (name, value) => { emitted.push({ name, value }); for (const fn of events.get(name) || []) fn(value); }
  };
  const context = vm.createContext({ uni, console: { log: noop, warn: noop },
    setTimeout: (fn, ms) => { timers.set(++timerId, { fn, ms }); return timerId; },
    setInterval: (fn, ms) => { timers.set(++timerId, { fn, ms, interval: true }); return timerId; },
    clearTimeout: id => timers.delete(id), clearInterval: id => timers.delete(id),
    module: { exports: {} }
  });
  vm.runInContext(read('pages/api/deviceBindingState.js').replace(/export /g, ''), context);
  const binding = vm.runInContext('({ hasAnyBoundDevice, getDeviceBindingContext, recordBoundDevices, markDeviceBound, recordDeviceUnbound })', context);
  function manager() {
    vm.runInContext(read('nativeplugins/KeepAlivesdkplugin/keepAliveManager.js')
      .replace(/^import .*;\r?\n/m, '').replace('export default keepAliveManagerInstance;', 'module.exports = keepAliveManagerInstance;'), context);
    const result = context.module.exports;
    result.checkAndGuideNotificationPermission = noop;
    result._buildKeepAliveNotificationPayload = () => ({ title: 'test', content: 'test', isNight: false });
    result._isNightHour = () => false;
    result.checkLocationPermission = async () => ({ granted: true });
    result._emitLocationEvent = noop;
    return result;
  }
  return { storage, events, emitted, calls, timers, uni, context, binding, manager };
}

function methods(file, names, context, indent = '\t\t\t') {
  const source = read(file);
  const body = names.map(name => {
    const start = source.indexOf(indent + name + '(');
    const end = source.indexOf('\n' + indent + '},', start);
    assert.ok(start >= 0 && end > start, name);
    return source.slice(start, end + 1 + indent.length + 1);
  }).join(',\n');
  return vm.runInContext('({' + body + '})', context);
}

test('no devices means false even with stale MACs and enabled timer settings', () => {
  const h = setup({ BPW6devicemac: 'stale', deviceIdwatch: 'stale', deviceList: ['stale'], switchHER: true,
    blood_pressure_timer_config: { currentMode: '24h' } });
  assert.equal(h.binding.hasAnyBoundDevice(), false);
  h.binding.recordBoundDevices([]);
  const ka = h.manager();
  ka.init(); ka.ensureRunningForAppTimers(); ka.updateNotification(); ka.onWakeUp(); ka.onAppHide(); ka.onAppShow();
  assert.equal(ka.shouldKeepAliveForAppTimers(), false);
  assert.equal(h.calls.length, 0);
  assert.equal(h.timers.size, 0);
});

for (const model of ['10005', '10000', '10001', '20000', '20001', '30000', '30001', 'unknown-model']) {
  test('any bound model qualifies, including offline/no-MAC device: ' + model, () => {
    const h = setup();
    h.binding.recordBoundDevices([{ deviceModelId: model, deviceSn: 'sn', mac: null, online: false, deviceTypeId: '11' }]);
    assert.equal(h.binding.hasAnyBoundDevice(), true);
    h.manager().ensureRunningForAppTimers();
    assert.equal(h.calls.filter(c => c.name === 'init').length, 1);
  });
}

test('last-device unbind disables; one of several devices unbound remains eligible', () => {
  const h = setup();
  const rows = [{ deviceSn: 'a', mac: null }, { deviceSn: 'b', mac: null }];
  h.binding.recordBoundDevices(rows);
  h.binding.recordDeviceUnbound('a', rows);
  assert.equal(h.binding.hasAnyBoundDevice(), true);
  h.binding.recordDeviceUnbound('b', [rows[1]]);
  assert.equal(h.binding.hasAnyBoundDevice(), false);
});

test('responses issued before bind/unbind cannot overwrite the new binding state', () => {
  const h = setup();
  const beforeBind = h.binding.getDeviceBindingContext();
  h.binding.markDeviceBound();
  h.binding.recordBoundDevices([], beforeBind);
  assert.equal(h.binding.hasAnyBoundDevice(), true);
  const beforeUnbind = h.binding.getDeviceBindingContext();
  h.binding.recordDeviceUnbound('a', [{ deviceSn: 'a' }]);
  h.binding.recordBoundDevices([{ deviceSn: 'a' }], beforeUnbind);
  assert.equal(h.binding.hasAnyBoundDevice(), false);
});

test('failed/malformed responses keep confirmed state; empty success overrides stale caches', () => {
  const h = setup({ deviceIdwatch: 'stale' });
  h.binding.recordBoundDevices([{ deviceSn: 'a' }]);
  h.binding.recordBoundDevices(undefined);
  assert.equal(h.binding.hasAnyBoundDevice(), true);
  h.binding.recordBoundDevices([]);
  assert.equal(h.binding.hasAnyBoundDevice(), false);
});

test('persisted state survives restart but cannot cross account or server', () => {
  const h = setup();
  h.binding.markDeviceBound();
  const state = h.storage.get('app_bound_device_state');
  assert.equal(setup({ app_bound_device_state: state }).binding.hasAnyBoundDevice(), true);
  const oldContext = h.binding.getDeviceBindingContext();
  h.storage.set('token', 'account-b');
  assert.equal(h.binding.hasAnyBoundDevice(), false);
  h.binding.recordBoundDevices([{ deviceSn: 'a' }], oldContext);
  assert.equal(h.binding.hasAnyBoundDevice(), false);
  h.storage.set('token', 'account-a');
  h.storage.set('URL_APP_IP', 'https://different.invalid');
  assert.equal(h.binding.hasAnyBoundDevice(), false);
});

test('logout clears eligibility and announces cleanup before storage is cleared', () => {
  const h = setup();
  h.binding.markDeviceBound();
  h.uni.$emit('APP_LOGOUT');
  assert.equal(h.binding.hasAnyBoundDevice(), false);
  assert.equal(h.emitted.at(-1).value, false);
});

test('in-flight native init cannot restart a service after last device is unbound', () => {
  const h = setup();
  h.binding.markDeviceBound();
  const ka = h.manager();
  ka.init();
  const done = h.calls.find(c => c.name === 'init').args[1];
  h.binding.recordBoundDevices([]);
  ka.stopForNoBoundDevice();
  done({ code: 0 });
  assert.equal(ka.isRunning, false);
  assert.equal(h.calls.filter(c => c.name === 'startKeepAlive').length, 0);
  assert.equal(h.timers.size, 0);
});

test('rebinding restores the alarm listener and ignores the previous init callback', () => {
  const h = setup();
  h.binding.markDeviceBound();
  const ka = h.manager();
  ka.init();
  const oldDone = h.calls.find(c => c.name === 'init').args[1];
  h.binding.recordBoundDevices([]);
  ka.stopForNoBoundDevice();
  assert.equal(h.events.get('onAlarmTrigger'), undefined);
  h.binding.markDeviceBound();
  ka.init();
  oldDone({ code: 0 });
  assert.equal(ka.isRunning, false);
  h.calls.filter(c => c.name === 'init').at(-1).args[1]({ code: 0 });
  assert.equal(ka.isRunning, true);
  assert.equal(h.events.get('onAlarmTrigger').size, 1);
  assert.equal([...h.timers.values()].filter(t => t.interval).length, 1);
});

test('unbound location entry skips permissions and pending permission completion cannot start it', async () => {
  const h = setup();
  const ka = h.manager();
  ka.checkLocationPermission = () => { throw Error('permission request is not allowed'); };
  assert.equal((await ka.startLocationKeepAlive()).success, false);
  assert.equal((await ka.ensureLocationRunning()).success, false);
  h.binding.markDeviceBound();
  let resolve;
  ka.checkLocationPermission = () => new Promise(r => { resolve = r; });
  const pending = ka.startLocationKeepAlive();
  h.binding.recordBoundDevices([]);
  resolve({ granted: true });
  assert.equal((await pending).success, false);
  assert.equal(h.calls.filter(c => c.name === 'startLocationKeepAlive').length, 0);
});

test('unbind preserves location preference and rebind actually restarts suspended location service', async () => {
  const h = setup({ keepAlive_location_keepalive_enabled: true });
  h.binding.markDeviceBound();
  const ka = h.manager();
  h.binding.recordBoundDevices([]);
  ka.stopForNoBoundDevice();
  assert.equal(h.storage.get('keepAlive_location_keepalive_enabled'), true);
  h.binding.markDeviceBound();
  const pending = ka.ensureLocationRunning();
  await flush();
  const call = h.calls.find(c => c.name === 'startLocationKeepAlive');
  assert.ok(call, 'must not mistake a saved preference for a running native service');
  call.args[0]({ code: 0 });
  assert.equal((await pending).success, true);
});

test('late native location-start callback cannot enable location keepalive after unbinding', async () => {
  const h = setup();
  h.binding.markDeviceBound();
  const ka = h.manager();
  const pending = ka.startLocationKeepAlive();
  await flush();
  h.binding.recordBoundDevices([]);
  h.calls.find(c => c.name === 'startLocationKeepAlive').args[0]({ code: 0 });
  assert.equal((await pending).success, false);
  assert.equal(h.storage.get('keepAlive_location_keepalive_enabled'), undefined);
  assert.ok(h.calls.some(c => c.name === 'stopLocationKeepAlive'));
});

function mockAlarms(h) {
  const alarms = [], delayed = [];
  const am = { setExactAndAllowWhileIdle: (...args) => alarms.push(args), cancel: noop };
  const main = { getSystemService: () => am, getPackageName: () => 'test' };
  function Intent() { this.setPackage = noop; }
  h.context.plus = { android: { runtimeMainActivity: () => main, importClass: name => ({
    'android.content.Intent': Intent,
    'android.app.PendingIntent': { getBroadcast: () => ({ cancel: noop }), FLAG_IMMUTABLE: 1 },
    'android.app.AlarmManager': { ELAPSED_REALTIME_WAKEUP: 2 },
    'android.os.SystemClock': { elapsedRealtime: () => 1000 }
  })[name] } };
  h.context.isQxBleAppInForeground = () => false;
  const page = methods('pages/tabBar/main/Main.vue', ['scheduleBpw6BgReconnectDozeAlarm',
    'scheduleBpw1BgReconnectDozeAlarm', 'acquireBpw6BgReconnectWakeLock', 'acquireBpw6BgReconnectCpuWakeLock'], h.context);
  Object.assign(page, { postBpw6NativeDelayed: (key, fn, ms) => delayed.push({ key, fn, ms }),
    clearBpw6BgReconnectDozeAlarm: noop, clearBpw1BgReconnectDozeAlarm: noop,
    ensureBpw6BgReconnectDozeReceiver: noop, ensureBpw1BgReconnectDozeReceiver: noop,
    hasBpw1NeedGattRecover: () => true });
  return { page, alarms, delayed };
}

test('both Main system-alarm chains are blocked without devices and retain bound-device delays', () => {
  const h = setup();
  const { page, alarms, delayed } = mockAlarms(h);
  page.scheduleBpw6BgReconnectDozeAlarm(12000);
  page.scheduleBpw1BgReconnectDozeAlarm(6000);
  page.acquireBpw6BgReconnectWakeLock();
  page.acquireBpw6BgReconnectCpuWakeLock(90000);
  assert.equal(alarms.length + delayed.length + h.calls.length, 0);
  h.binding.recordBoundDevices([{ deviceSn: 'wifi', mac: null }]);
  page.scheduleBpw6BgReconnectDozeAlarm(12000);
  page.scheduleBpw1BgReconnectDozeAlarm(6000);
  assert.deepEqual(alarms.map(a => a[1]), [13000, 7000]);
  assert.deepEqual(delayed.map(a => a.ms), [12000, 6000]);
  h.binding.recordBoundDevices([]);
  page.stopBpw6BgPresenceWatchdog = noop;
  page.stopBpw1BgPresenceWatchdog = noop;
  delayed.forEach(d => d.fn());
  assert.equal(alarms.length, 2, 'queued handlers must not rearm after last unbind');
});

test('module-level BPW6 Doze scheduling and CPU wake locks are also blocked without devices', () => {
  const h = setup({ BPW6devicemac: 'stale' });
  const source = read('pages/api/qxBleAlignedSchedule.js');
  h.context.clearBpw6BgGattDozeAlarm = noop;
  h.context.stopBpw6BgGattReconnectWatch = noop;
  for (const name of ['acquireBpw6BgGattCpuWakeLock', 'scheduleBpw6BgGattDozeAlarm', 'armBpw6BgGattNext',
    'tickBpw6BgGattReconnectWatch', 'acquireQxBleWakeLock', 'startBpw6BgGattReconnectWatch',
    'ensureQxBleBackgroundRuntime', 'ensureQxBleKeepAliveForBackground']) {
    const start = source.indexOf('function ' + name + '(');
    const end = source.indexOf('\n}', start);
    assert.ok(start >= 0 && end > start);
    vm.runInContext(source.slice(start, end + 2), h.context);
    vm.runInContext(name + '()', h.context);
  }
  assert.equal(h.calls.length, 0);
});

test('module-level BPW6 Doze alarm retains its existing interval when bound and ignores late handlers after unbind', () => {
  const h = setup();
  const { alarms } = mockAlarms(h);
  const source = read('pages/api/qxBleAlignedSchedule.js');
  Object.assign(h.context, { qxAppInForeground: false, _bpw6BgGattWatchActive: true,
    _bpw6BgGattDozeHandler: null, hasBpw6BgGattWatchPersisted: () => true,
    hasBpw6BgGattNeedReconnect: () => true, ensureBpw6BgGattDozeReceiver: noop,
    clearBpw6BgGattDozeAlarm: noop, acquireBpw6BgGattCpuWakeLock: () => { throw Error('late wake'); },
    tickBpw6BgGattReconnectWatch: () => { throw Error('late reconnect'); } });
  const start = source.indexOf('function scheduleBpw6BgGattDozeAlarm(');
  vm.runInContext(source.slice(start, source.indexOf('\n}', start) + 2), h.context);
  h.binding.markDeviceBound();
  vm.runInContext('scheduleBpw6BgGattDozeAlarm(15000)', h.context);
  assert.equal(alarms.length, 1);
  assert.equal(alarms[0][1], 16000);
  assert.equal([...h.timers.values()][0].ms, 15000);
  h.binding.recordBoundDevices([]);
  [...h.timers.values()].forEach(t => t.fn());
  assert.equal(alarms.length, 1);
});

test('Main records no-MAC bindings even when appQX is off, before filtering its BLE device list', async () => {
  const h = setup({ appQX: '0' });
  const page = methods('pages/tabBar/main/Main.vue', ['queryDevices', 'resolveZk872BleRows'], h.context);
  let resolve;
  Object.assign(page, { queryDevicesDone: true, $post: () => new Promise(r => { resolve = r; }),
    isEmotionMeasureBusySession: () => false, dropStaleBpw6Binding: noop });
  page.queryDevices();
  resolve({ code: 200, rows: [{ deviceSn: 'wifi', mac: null, deviceModelId: '10005' }] });
  await flush();
  assert.equal(page.deviceList.length, 0);
  assert.equal(h.binding.hasAnyBoundDevice(), true);
  page.queryDevices();
  resolve({ code: 200, rows: [] });
  await flush();
  assert.equal(h.binding.hasAnyBoundDevice(), false);
});

test('first binding enables keepalive at the success page without waiting for Main refresh', () => {
  const h = setup();
  const page = methods('pages/Bind/Bing_page/Bind_success.vue', ['onLoad'], h.context, '\t\t');
  page.onLoad({ modelId: '10005' });
  assert.equal(page.modelIdtype, '血压计');
  assert.equal(h.binding.hasAnyBoundDevice(), true);
});

test('App background starts common keepalive for Wi-Fi-only devices but no stale-watch work when unbound', () => {
  const h = setup();
  const invoked = [];
  Object.assign(h.context, { setQxBleAppForegroundState: noop, canPersistBpw6LocalBind: () => true,
    onQxBleAppBackground: () => invoked.push('qx-background'), startBpw6BgGattReconnectWatch: () => invoked.push('bpw6'),
    keepAliveManager: { shouldKeepAliveForAppTimers: () => false, init: () => invoked.push('init'),
      ensureRunningForAppTimers: () => invoked.push('ensure'), onAppHide: () => invoked.push('hide') }
  });
  const app = methods('App.vue', ['onHide'], h.context, '\t\t');
  Object.assign(app, { stopInterval: noop, startInterval: noop, syncDeviceKeepAlive: () => invoked.push('stop') });
  h.storage.set('BPW6devicemac', 'stale');
  app.onHide();
  assert.deepEqual(invoked, ['stop']);
  assert.equal(h.calls.length, 0);
  h.storage.delete('BPW6devicemac');
  h.binding.recordBoundDevices([{ deviceSn: 'wifi', deviceModelId: '10005', mac: null }]);
  invoked.length = 0;
  app.onHide();
  assert.deepEqual(invoked, ['init', 'ensure', 'hide', 'qx-background']);
  assert.equal(h.calls.filter(c => c.name === 'acquireWakeLock').length, 1);
  assert.equal(h.emitted.some(e => e.name === 'BPW1_ENSURE_RECONNECT' || e.name === 'BPW6_ENSURE_RECONNECT'), false);
});

for (const file of ['pages/tabBar/device/Equipment_management.vue', 'pages/tabBar/my/Equipment_management1.vue']) {
  test(file + ' records the full server list and does not clear binding state on failed requests', () => {
    const h = setup();
    const page = methods(file, ['queryDevices', 'handleQueryDevicesSuccess', 'handleUnbindSuccess'], h.context);
    Object.assign(page, { formatDeviceList: rows => rows, removeDuplicateDeviceNames: noop,
      refreshBleConnectionState: noop, handleQueryDevicesFail: noop, clearHeartbeatInterval: noop,
      showUnbindSuccessToast: noop, removeDeviceFromStorageSync: noop, showUnbindFailToast: noop });
    const requests = [];
    h.uni.request = options => requests.push(options);
    page.queryDevices();
    requests.at(-1).success({ data: { code: 200, rows: [{ deviceSn: 'wifi', mac: null }] } });
    assert.equal(h.binding.hasAnyBoundDevice(), true);
    page.getunbind = noop;
    page.handleUnbindSuccess('10005', null, 'wifi')({ data: { code: 200 } });
    assert.equal(h.binding.hasAnyBoundDevice(), false);
    requests.at(-1).fail();
    assert.equal(h.binding.hasAnyBoundDevice(), false);
  });
}
