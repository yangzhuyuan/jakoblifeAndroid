// node --test tests/notification-permission.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const RESPONDED = 'keepAlive_notification_user_responded';
const noop = () => {};

function setup(options = {}) {
  const storage = new Map(), modals = [], checks = [], requests = [], invokes = [], nativeCalls = [];
  const timers = new Map();
  let timerId = 0, bound = true, enabled = options.enabled ?? true;
  const nm = options.nm || {};
  const native = new Proxy({}, { get: (_, name) => (...args) => {
    nativeCalls.push(name);
    const cb = args.at(-1);
    if (typeof cb === 'function') cb({ code: 0 });
  } });
  const uni = {
    getStorageSync: key => storage.get(key) ?? '',
    setStorageSync: (key, value) => storage.set(key, value),
    removeStorageSync: key => storage.delete(key), clearStorageSync: () => storage.clear(),
    getLocale: () => 'zh-Hans', getSystemInfoSync: () => ({ platform: 'android' }),
    requireNativePlugin: () => native, $on: noop, $off: noop, $emit: noop,
    showModal: opts => { modals.push(opts); options.showModal?.(opts); }, showToast: noop, reLaunch: noop
  };
  const context = vm.createContext({ uni, module: { exports: {} }, console: { log: noop, warn: noop },
    hasAnyBoundDevice: () => bound, systemInfo: { appVersion: 'test-version' },
    setTimeout: (fn, ms) => { timers.set(++timerId, { fn, ms }); return timerId; },
    clearTimeout: id => timers.delete(id),
    setInterval: (fn, ms) => { timers.set(++timerId, { fn, ms, interval: true }); return timerId; },
    clearInterval: id => timers.delete(id),
    plus: { os: { name: 'Android' }, android: {
      importClass: () => ({ VERSION: { SDK_INT: options.sdk ?? 33 } }),
      runtimeMainActivity: () => ({ getSystemService: () => nm }),
      invoke: (obj, name, ...args) => {
        invokes.push({ name, args });
        if (options.invoke) return options.invoke(obj, name, ...args);
        return args.length === 0 ? enabled : undefined;
      },
      checkPermission: (permission, cb) => checks.push(cb),
      requestPermissions: (permissions, success, fail) => requests.push({ permissions, success, fail })
    } }
  });
  vm.runInContext(read('nativeplugins/KeepAlivesdkplugin/keepAliveManager.js')
    .replace(/^import .*;\r?\n/m, '').replace('export default keepAliveManagerInstance;', 'module.exports = keepAliveManagerInstance;'), context);
  const manager = context.module.exports;
  manager.createNotificationChannel = noop;
  function check(granted = true) {
    manager.checkAndroidNotificationPermission();
    const callback = checks.shift();
    assert.ok(callback, 'native permission check expected');
    callback({ checkResult: granted ? 0 : -1 });
  }
  return { manager, storage, modals, checks, requests, invokes, nativeCalls, timers, context, uni, nm, check,
    setBound: value => { bound = value; }, setEnabled: value => { enabled = value; } };
}

test('granted notifications use a zero-argument native call and do not show the reported false alarm', () => {
  const h = setup();
  h.check(true);
  assert.deepEqual(h.invokes, [{ name: 'areNotificationsEnabled', args: [] }]);
  assert.equal(h.manager.notificationEnabled, true);
  assert.equal(h.modals.length, 0);
});

test('a real disabled notification switch still shows the existing settings guide', () => {
  const h = setup({ enabled: false });
  h.check(true);
  assert.equal(h.manager.notificationEnabled, false);
  assert.equal(h.modals[0].title, '需要通知权限');
});

for (const invalid of [undefined, null]) {
  for (const fallback of [true, false]) {
    test(`native result ${invalid} uses the direct-method fallback (${fallback})`, () => {
      let fallbackCalls = 0;
      const h = setup({ invoke: () => invalid, nm: { areNotificationsEnabled: () => { fallbackCalls++; return fallback; } } });
      h.check(true);
      assert.equal(fallbackCalls, 1);
      assert.equal(h.manager.notificationEnabled, fallback);
      assert.equal(h.modals.length, fallback ? 0 : 1);
    });
  }
}

test('undefined, null and throwing bridges retain the existing non-prompting error fallback', () => {
  for (const invoke of [() => undefined, () => null, () => { throw Error('bridge failed'); }]) {
    const h = setup({ invoke });
    h.check(true);
    assert.equal(h.modals.length, 0);
  }
});

test('overlapping checks with a disabled switch produce one dialog', () => {
  const h = setup({ enabled: false });
  h.manager.checkAndroidNotificationPermission();
  h.manager.checkAndroidNotificationPermission();
  h.checks.splice(0).forEach(fn => fn({ checkResult: 0 }));
  assert.equal(h.modals.length, 1);
});

test('both automatic dialog types share the same lock', () => {
  for (const order of [[true, false], [false, true]]) {
    const h = setup({ enabled: false });
    h.manager.checkAndroidNotificationPermission();
    h.manager.checkAndroidNotificationPermission();
    order.forEach(granted => h.checks.shift()({ checkResult: granted ? 0 : -1 }));
    assert.equal(h.modals.length, 1);
  }
});

test('Later prevents both subsequent checks and already queued permission callbacks from reopening a guide', () => {
  for (const granted of [true, false]) {
    const h = setup({ enabled: false });
    h.manager.checkAndroidNotificationPermission();
    h.manager.checkAndroidNotificationPermission();
    h.checks.shift()({ checkResult: granted ? 0 : -1 });
    h.modals[0].success({ confirm: false });
    h.checks.shift()({ checkResult: granted ? 0 : -1 });
    h.check(granted);
    assert.equal(h.storage.get(RESPONDED), true);
    assert.equal(h.modals.length, 1);
    assert.equal(h.requests.length, 0);
  }
});

test('Continue still requests system permission once and prevents prompts during the request', () => {
  for (const granted of [true, false]) {
    const h = setup({ enabled: false });
    h.check(false);
    assert.equal(h.modals[0].title, '通知权限说明');
    h.modals[0].success({ confirm: true });
    assert.deepEqual(Array.from(h.requests[0].permissions), ['android.permission.POST_NOTIFICATIONS']);
    h.check(false);
    assert.equal(h.modals.length, 1);
    assert.equal(h.requests.length, 1);
    h.setEnabled(granted);
    h.requests[0].success({ granted: granted ? ['android.permission.POST_NOTIFICATIONS'] : [] });
    h.check(granted);
    assert.equal(h.storage.get(RESPONDED), true);
    assert.equal(h.manager._notificationGuidePending, false);
    assert.equal(h.modals.length, 1);
  }
});

test('the existing Go enable action still reaches notification settings', () => {
  const h = setup({ enabled: false });
  let opened = 0;
  h.manager.goToNotificationSettings = () => { opened++; };
  h.check(true);
  h.modals[0].success({ confirm: true });
  h.checks.shift()({ checkResult: 0 });
  assert.equal(opened, 1);
  assert.equal(h.storage.get(RESPONDED), true);
  assert.equal(h.manager._notificationGuidePending, false);
});

test('a permission granted while the guide is open completes the guide without a second request', () => {
  const h = setup({ enabled: false });
  h.check(true);
  h.manager.notificationEnabled = true;
  h.modals[0].success({ confirm: true });
  assert.equal(h.storage.get(RESPONDED), true);
  assert.equal(h.manager._notificationGuidePending, false);
  assert.equal(h.requests.length, 0);
});

test('failed dialog presentation releases the lock without treating failure as user consent', () => {
  const h = setup({ enabled: false });
  h.check(true);
  h.modals[0].fail({ errMsg: 'showModal failed' });
  assert.equal(h.manager._notificationGuidePending, false);
  assert.equal(h.storage.has(RESPONDED), false);
  h.check(true);
  assert.equal(h.modals.length, 2);
  const throwing = setup({ enabled: false, showModal: () => { throw Error('bridge failed'); } });
  throwing.check(true);
  assert.equal(throwing.manager._notificationGuidePending, false);
});

test('repeated scheduling keeps one two-second check; canceled callbacks cannot replace the current timer', () => {
  const h = setup({ enabled: false });
  h.manager.checkAndGuideNotificationPermission();
  const oldCallback = [...h.timers.values()][0].fn;
  h.manager.checkAndGuideNotificationPermission();
  const currentId = h.manager._notificationPermissionTimer;
  assert.equal(h.timers.size, 1);
  oldCallback();
  assert.equal(h.manager._notificationPermissionTimer, currentId);
  assert.equal(h.checks.length, 0);
  assert.equal(h.timers.get(currentId).ms, 2000);
  h.timers.get(currentId).fn();
  h.checks.shift()({ checkResult: 0 });
  assert.equal(h.modals.length, 1);
});

test('stopping keepalive cancels the timer; old timer and permission callbacks cannot prompt after restart', () => {
  const h = setup({ enabled: false });
  h.manager.checkAndGuideNotificationPermission();
  const oldTimer = [...h.timers.values()][0].fn;
  h.manager.checkAndroidNotificationPermission();
  const oldPermission = h.checks.shift();
  h.setBound(false);
  h.manager.stopForNoBoundDevice();
  assert.equal(h.timers.size, 0);
  h.setBound(true);
  h.manager.checkAndGuideNotificationPermission();
  const currentId = h.manager._notificationPermissionTimer;
  oldTimer();
  oldPermission({ checkResult: 0 });
  assert.equal(h.modals.length, 0);
  assert.equal(h.manager._notificationPermissionTimer, currentId);
  h.timers.get(currentId).fn();
  h.checks.shift()({ checkResult: 0 });
  assert.equal(h.modals.length, 1);
});

test('a delayed permission check cannot prompt when there are no bound devices', () => {
  const h = setup({ enabled: false });
  h.manager.checkAndGuideNotificationPermission();
  h.setBound(false);
  [...h.timers.values()][0].fn();
  assert.equal(h.checks.length, 0);
  h.check(true);
  assert.equal(h.modals.length, 0);
});

test('logout preserves notification response while still clearing account data and existing logout flow', () => {
  const h = setup({ enabled: false });
  h.check(true);
  h.modals[0].success({ confirm: false });
  for (const [key, value] of Object.entries({ token: 'old-token', userid: 'old-user', appQX: '1', tongzhi: '1', appQXTipShown: '1' })) h.storage.set(key, value);
  const source = read('pages/tabBar/my/Safety_center.vue');
  const start = source.indexOf('\t\t\tlogout() {'), end = source.indexOf('\n\t\t\t},', start);
  const logout = vm.runInContext('({' + source.slice(start, end + 5) + '})', h.context).logout;
  const events = [], navigation = [];
  h.uni.$emit = name => events.push(name);
  h.uni.reLaunch = opts => navigation.push(opts.url);
  logout.call({ setacktypes: value => assert.equal(value, 0) });
  assert.equal(h.storage.get(RESPONDED), true);
  assert.equal(h.storage.has('token'), false);
  assert.equal(h.storage.has('userid'), false);
  assert.equal(h.storage.get('appQX'), '1');
  assert.equal(h.storage.get('tongzhi'), '1');
  assert.equal(h.storage.get('appQXTipShown'), '1');
  assert.deepEqual(events, ['APP_LOGOUT']);
  assert.deepEqual(navigation, ['/pages/login/login_land']);
  h.check(true);
  assert.equal(h.modals.length, 1);
});

test('Android below API 33 keeps its existing no-runtime-request behavior', () => {
  const h = setup({ sdk: 32, enabled: false });
  h.manager.checkNotificationPermission();
  assert.equal(h.manager.notificationEnabled, true);
  assert.equal(h.modals.length + h.checks.length + h.requests.length, 0);
});
