// Run with: node --test tests/wifi-list-refresh.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../pages/Bind/Bing_xueya/Bing_xueya_2.vue'), 'utf8')
  .split('<script>')[1].split('</script>')[0]
  .replace(/import[\s\S]*?from\s+'[^']+'/, '')
  .replace('export default', 'module.exports =');

function setup({ native = true, startScan = () => true, startWifi, registerError, readError } = {}) {
  let now = 0, timerId = 0, scanResults = [], uniListener;
  const timers = new Map(), receivers = new Set();
  const calls = { order: [], toasts: [], logs: [], reads: 0, uniScans: 0, uniOff: 0, removed: 0 };
  const manager = {
    startScan() { calls.order.push('scan'); return startScan(); },
    getScanResults() {
      calls.reads++;
      if (readError) throw readError;
      return {
        size: () => scanResults.length,
        get: i => ({ plusGetAttribute: key => scanResults[i][key] })
      };
    },
    getConnectionInfo() { throw new Error('listing networks must not require a connected Wi-Fi'); }
  };
  const main = {
    getSystemService: () => manager,
    registerReceiver(receiver, filter) {
      assert.equal(filter.action, 'scan-results');
      if (registerError) throw registerError;
      calls.order.push('listen');
      receivers.add(receiver);
    },
    unregisterReceiver(receiver) { calls.removed++; receivers.delete(receiver); }
  };
  const uni = {
    getSystemInfoSync: () => ({ platform: native ? 'android' : 'ios' }),
    startWifi(options) { if (startWifi) startWifi(options); else options.success({}); },
    onGetWifiList(fn) { uniListener = fn; },
    offGetWifiList(fn) { calls.uniOff++; if (uniListener === fn) uniListener = null; },
    getWifiList() { calls.uniScans++; },
    showToast(options) { calls.toasts.push(options); },
    hideLoading() {}
  };
  const context = {
    module: { exports: {} }, uni, console: { log: (...args) => calls.logs.push(args) },
    Date: { now: () => now },
    setTimeout(fn, delay) { const id = ++timerId; timers.set(id, { fn, at: now + delay }); return id; },
    clearTimeout: id => timers.delete(id)
  };
  if (native) context.plus = { android: {
    runtimeMainActivity: () => main,
    importClass(name) {
      if (name === 'android.content.Context') return { WIFI_SERVICE: 'wifi' };
      if (name === 'android.net.wifi.WifiManager') return {
        SCAN_RESULTS_AVAILABLE_ACTION: 'scan-results', EXTRA_RESULTS_UPDATED: 'updated'
      };
      if (name === 'android.content.IntentFilter') return class { constructor(action) { this.action = action; } };
      return {};
    },
    implements(name, receiver) { assert.equal(name, 'io.dcloud.android.content.BroadcastReceiver'); return receiver; },
    invoke: (object, method, ...args) => object[method](...args)
  } };
  vm.runInNewContext(source, context);
  const component = context.module.exports;
  const page = Object.assign(component.data(), {
    $t: key => key, wifi_name: 'Selected network', wifi_password: 'kept-password',
    wifiConnecting: true, wifiArray: [{ name: 'Old network', signal: -70 }], candidates: ['Old network']
  });
  for (const [key, method] of Object.entries(component.methods)) page[key] = method.bind(page);
  return {
    page, calls, receivers, timers,
    unload: () => component.onUnload.call(page),
    emit(updated, list, receiver = [...receivers][0]) {
      scanResults = list;
      receiver?.onReceive(main, { getBooleanExtra: () => updated });
    },
    emitUni: list => uniListener?.({ wifiList: list }),
    tick(ms) {
      const end = now + ms;
      for (;;) {
        const next = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        const [id, timer] = next;
        timers.delete(id); now = timer.at; timer.fn();
      }
      now = end;
    }
  };
}

test('Android actively scans and replaces the list only on a successful scan broadcast', () => {
  const h = setup();
  h.page.refreshWifiList();
  assert.deepEqual(h.calls.order, ['listen', 'scan']);
  assert.equal(h.calls.uniScans, 0);
  assert.equal(h.calls.reads, 0, 'do not read cached results before completion');
  h.tick(2000);
  h.emit(false, [{ SSID: 'Cached network', level: -50 }]);
  assert.deepEqual([...h.page.candidates], ['Old network']);
  assert.equal(h.calls.reads, 0);
  h.emit(true, [{ SSID: 'New network', level: -40 }, { SSID: 'New network', level: -60 }, { SSID: '', level: -90 }]);
  assert.deepEqual([...h.page.candidates], ['New network']);
  assert.equal(h.page.wifiArray[0].signal, -40);
  assert.equal(h.page.wifi_name, 'Selected network');
  assert.equal(h.page.wifi_password, 'kept-password');
  assert.equal(h.page.wifiConnecting, true);
  assert.equal(h.receivers.size, 0);
  assert.equal(h.calls.uniOff, 0, 'do not remove shared uni-wifi listeners');
  assert.equal(h.page.wifiListRefreshing, true);
  assert.equal(h.page.wifiListRefreshSeconds, 8);
  h.tick(8000);
  assert.equal(h.page.wifiListRefreshing, false);
  assert.equal(h.page.wifiListRefreshSeconds, 0);
  assert.equal(h.calls.toasts.length, 0);
});

test('repeat clicks cannot scan again until the 10 second countdown finishes', () => {
  const h = setup();
  h.page.refreshWifiList();
  h.emit(true, [{ SSID: 'First', level: -40 }]);
  h.tick(9999);
  h.page.refreshWifiList();
  assert.equal(h.calls.order.filter(action => action === 'scan').length, 1);
  h.tick(1);
  h.page.refreshWifiList();
  assert.equal(h.calls.order.filter(action => action === 'scan').length, 2);
  assert.equal(h.page.wifiListRefreshSeconds, 10);
  h.emit(true, [{ SSID: 'Second', level: -40 }]);
  assert.deepEqual([...h.page.candidates], ['Second']);
});

test('Android rejecting a scan keeps the list, reports failure and releases only after 10 seconds', () => {
  const h = setup({ startScan: () => false });
  h.page.refreshWifiList();
  assert.deepEqual([...h.page.candidates], ['Old network']);
  assert.equal(h.calls.reads, 0);
  assert.equal(h.calls.toasts.length, 1);
  assert.equal(h.receivers.size, 0);
  assert.equal(h.page.wifiListRefreshing, true);
  h.tick(10000);
  assert.equal(h.page.wifiListRefreshing, false);
  assert.equal(h.calls.toasts.length, 1);
});

test('unsuccessful broadcasts cannot masquerade as a refreshed list; timeout cleans up', () => {
  const h = setup();
  h.page.refreshWifiList();
  const receiver = [...h.receivers][0];
  h.emit(false, [{ SSID: 'Cache', level: -40 }]);
  h.tick(10000);
  assert.equal(h.calls.toasts.length, 1);
  assert.equal(h.receivers.size, 0);
  assert.equal(h.page.wifiListRefreshing, false);
  h.emit(true, [{ SSID: 'Late', level: -40 }], receiver);
  assert.deepEqual([...h.page.candidates], ['Old network']);
});

test('successful empty scan clears vanished networks', () => {
  const h = setup();
  h.page.refreshWifiList();
  h.emit(true, []);
  assert.deepEqual([...h.page.candidates], []);
  assert.deepEqual([...h.page.wifiArray], []);
});

test('scan and result reading exceptions preserve the old list and clean up', () => {
  for (const options of [
    { registerError: new Error('registration failed') },
    { startScan: () => { throw new Error('permission denied'); } },
    { readError: new Error('permission revoked') }
  ]) {
    const h = setup(options);
    h.page.refreshWifiList();
    if (options.readError) h.emit(true, []);
    assert.deepEqual([...h.page.candidates], ['Old network']);
    assert.equal(h.calls.toasts.length, 1);
    assert.equal(h.receivers.size, 0);
    h.tick(10000);
    assert.equal(h.page.wifiListRefreshing, false);
  }
});

test('unloading cancels the receiver and countdown and ignores already queued broadcasts', () => {
  const h = setup();
  h.page.refreshWifiList();
  const receiver = [...h.receivers][0];
  h.unload();
  h.emit(true, [{ SSID: 'Late', level: -30 }], receiver);
  h.tick(10000);
  assert.deepEqual([...h.page.candidates], ['Old network']);
  assert.equal(h.receivers.size, 0);
  assert.equal(h.timers.size, 0);
  assert.equal(h.calls.toasts.length, 0);
});

test('a late startup callback after timeout or unloading cannot start a scan', () => {
  for (const unload of [false, true]) {
    let startup;
    const h = setup({ startWifi: options => { startup = options; } });
    h.page.refreshWifiList();
    if (unload) h.unload(); else h.tick(10000);
    startup.success({});
    assert.deepEqual(h.calls.order, []);
    assert.equal(h.receivers.size, 0);
  }
});

test('an old receiver cannot overwrite the results of the next refresh', () => {
  const h = setup();
  h.page.refreshWifiList();
  const previous = [...h.receivers][0];
  h.emit(true, [{ SSID: 'First', level: -40 }]);
  h.tick(10000);
  h.page.refreshWifiList();
  h.emit(true, [{ SSID: 'Second', level: -40 }]);
  h.emit(true, [{ SSID: 'Late first', level: -40 }], previous);
  assert.deepEqual([...h.page.candidates], ['Second']);
});

test('non-Android keeps the original uni-wifi path and the 10 second countdown', () => {
  const h = setup({ native: false });
  h.page.refreshWifiList();
  h.emitUni([{ SSID: 'Uni network', signalStrength: 70 }]);
  assert.deepEqual([...h.page.candidates], ['Uni network']);
  assert.equal(h.calls.uniScans, 1);
  assert.equal(h.calls.uniOff, 1);
  assert.equal(h.page.wifiListRefreshing, true);
  h.tick(10000);
  assert.equal(h.page.wifiListRefreshing, false);
});

test('startup failure reports once without registering a receiver or altering the list', () => {
  const h = setup({ startWifi: options => options.fail({ errCode: 12001 }) });
  h.page.refreshWifiList();
  h.tick(10000);
  assert.deepEqual([...h.page.candidates], ['Old network']);
  assert.deepEqual(h.calls.order, []);
  assert.equal(h.calls.toasts.length, 1);
  assert.equal(h.page.wifiListRefreshing, false);
});
