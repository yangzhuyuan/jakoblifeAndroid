// Run with: node --test tests/zk872-auto-connect.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const vueScript = file => read(file).split('<script>')[1].split('</script>')[0]
  .replace(/import[\s\S]*?from\s+'[^']+';?/g, '').replace('export default', 'module.exports =');
const serviceId = '0000FFFF-0000-1000-8000-00805F9B34FB';
const characteristic = { uuid: 'test-write', properties: { write: true, notify: true } };
const flush = () => new Promise(resolve => setImmediate(resolve));

function openManagementWifi(file, item) {
  const navigation = [], prompts = [];
  const context = {
    module: { exports: {} }, mapState: () => ({}), mapMutations: () => ({}),
    uni: {
      navigateTo: options => navigation.push(options.url),
      showModal: options => prompts.push(options),
      showToast: options => prompts.push(options)
    }
  };
  vm.runInNewContext(vueScript(file), context);
  const page = { $t: key => key, connectedBleMacSet: {} };
  for (const [key, method] of Object.entries(context.module.exports.methods)) page[key] = method.bind(page);
  page.onSetWifiClick(item);
  assert.equal(prompts.length, 0, 'a disconnected device must enter provisioning without a connection warning');
  assert.equal(navigation.length, 1);
  const url = new URL(navigation[0], 'https://example.invalid');
  assert.match(url.pathname, /Bing_xueya\/Bing_xueya$/);
  return Object.fromEntries(url.searchParams);
}

function setup({ devices = [{ deviceId: 'zk-device', name: 'Jakoblife872B' }], overrides = {}, route = {} } = {}) {
  let now = 0, timerId = 0, page, component;
  const timers = new Map(), listeners = new Set(), storage = new Map();
  const calls = { open: 0, scans: 0, scanOptions: [], stops: 0, connects: [], closes: [], services: 0, mtu: 0,
    navigation: [], loading: false, titles: [], modals: [], toasts: [], events: [] };
  const api = {
	getStorageSync: key => storage.get(key),
	setStorageSync: (key, value) => storage.set(key, value),
    getSystemInfoSync: () => ({ platform: 'android' }), getLocale: () => 'zh-Hans',
    openBluetoothAdapter(o) { calls.open++; o.success({}); },
    onBluetoothDeviceFound(fn) { listeners.add(fn); },
    offBluetoothDeviceFound(fn) { listeners.delete(fn); },
    startBluetoothDevicesDiscovery(o) {
      calls.scans++;
      calls.scanOptions.push(o);
      o.success({});
      for (const fn of listeners) fn({ devices });
    },
    stopBluetoothDevicesDiscovery(o) { calls.stops++; o.success?.({}); },
    createBLEConnection(o) { calls.connects.push(o); o.success({}); },
    closeBLEConnection(o) { calls.closes.push(o.deviceId); o.success?.({}); o.complete?.({}); },
    setBLEMTU(o) { calls.mtu++; o.success({}); },
    getBLEDeviceServices(o) { calls.services++; o.success({ services: [{ uuid: '00001800' }, { uuid: serviceId }] }); },
    getBLEDeviceCharacteristics(o) { o.success({ characteristics: [characteristic] }); },
    showLoading(o) { calls.loading = true; calls.titles.push(o.title); },
    hideLoading() { calls.loading = false; },
    showModal(o) { calls.modals.push(o); },
    showToast(o) { calls.toasts.push(o); },
    setNavigationBarTitle() {},
    $emit(event) { calls.events.push(event); },
    navigateTo(o) { calls.navigation.push(o.url); component.onHide.call(page); o.success?.({}); },
    ...overrides
  };
  const context = {
    module: { exports: {} }, uni: api, console: { log() {} },
    setTimeout(fn, ms) { const id = ++timerId; timers.set(id, { fn, at: now + ms }); return id; },
    clearTimeout(id) { timers.delete(id); }
  };
  vm.runInNewContext(read('pages/api/zk872WifiConnection.js').replace(/export function /g, 'function ') +
    '\nmodule.exports = { createZk872WifiConnector, isZk872WifiModel };', context);
  const helper = context.module.exports;
  Object.assign(context, helper);
  vm.runInNewContext(read('pages/api/language.js').replace('export default', 'module.exports ='), context);
  const messages = context.module.exports['zh-CN'];
  vm.runInNewContext(vueScript('pages/Bind/Bing_xueya/Bing_xueya.vue'), context);
  component = context.module.exports;
  page = Object.assign(component.data(), { $t: key => messages[key] || key, $globalTimers: {} });
  for (const [key, method] of Object.entries(component.methods)) page[key] = method.bind(page);
  component.onLoad.call(page, { modelId: '10005', modelname: 'ZK-B872', sn: 'test-sn', SELECT_TYPE: '0', ...route });

  async function tick(ms) {
    await flush();
    const target = now + ms;
    for (let guard = 0; guard < 100; guard++) {
      const next = [...timers].filter(([, t]) => t.at <= target).sort((a, b) => a[1].at - b[1].at)[0];
      if (!next) break;
      const [id, timer] = next;
      now = timer.at;
      timers.delete(id);
      timer.fn();
      await flush();
    }
    now = target;
    await flush();
  }
  return { page, calls, api, timers, listeners, storage, tick, helper, context,
    hide: () => component.onHide.call(page), unload: () => component.onUnload.call(page),
    start() { page.cb = true; return page.btn_next(); },
    emit(devices) { for (const fn of listeners) fn({ devices }); }
  };
}

test('ZK872 model gating and the ready checkbox preserve other devices and preceding UI', () => {
  const h = setup();
  h.page.btn_next();
  assert.equal(h.calls.open, 0);
  assert.equal(h.calls.toasts.length, 1);
  for (const [id, name] of [['10005', ''], ['', 'ZK-872'], ['', 'ZK-B872B']]) {
    assert.equal(h.helper.isZk872WifiModel(id, name), true);
  }
  for (const [id, name] of [['10001', 'JL-BP68W'], ['30000', 'BPW1'], ['30001', 'BPW6'], ['20001', 'JL-S260']]) {
    assert.equal(h.helper.isZk872WifiModel(id, name), false);
  }
  const other = setup({ route: { modelId: '10001', modelname: 'JL-BP68W', fromManage: '1', deviceId: 'known-id' } });
  other.start();
  assert.match(other.calls.navigation[0], /lanya_wifi\?/);
  assert.match(other.calls.navigation[0], /fromManage=1&deviceId=known-id/);
  assert.equal(other.calls.open, 0);
});

test('scan connects only the matching ZK device and goes directly to Wi-Fi with all route parameters', async () => {
  const h = setup({ devices: [
    { deviceId: 'watch', name: 'BPW1' }, { deviceId: 'other', name: 'JL-BP68W' },
    { deviceId: 'zk-device', localName: 'Jakoblife872B' }, { deviceId: 'zk-device', name: 'Jakoblife872B' }
  ], route: { sn: 'sn&with=value', fromManage: '1' } });
  const pending = h.start();
  h.page.btn_next();
  await h.tick(11000);
  await pending;
  assert.equal(h.calls.connects.length, 1);
  assert.equal(h.calls.connects[0].deviceId, 'zk-device');
  assert.equal(h.calls.navigation.length, 1);
  const url = new URL(h.calls.navigation[0], 'https://example.invalid');
  assert.match(url.pathname, /Bing_xueya_2$/);
  assert.equal(url.searchParams.get('sn'), 'sn&with=value');
  assert.equal(url.searchParams.get('SELECT_TYPE'), '0');
  assert.equal(url.searchParams.get('modelId'), '10005');
  assert.equal(url.searchParams.get('fromManage'), '1');
  assert.equal(url.searchParams.get('deviceId'), 'zk-device');
  assert.equal(url.searchParams.get('serviceId'), serviceId);
  assert.equal(url.searchParams.get('uuid'), 'test-write');
  assert.equal(url.searchParams.get('notifyuuid'), 'test-write');
  assert.equal(url.searchParams.get('writeTypeHint'), 'writeNoResponse');
  assert.equal(h.calls.closes.length, 0);
  assert.equal(h.storage.get('listdadsa')[0].deviceId, 'zk-device');
  assert.equal(h.calls.loading, false);
  assert.equal(h.page.zkConnecting, false);
  assert.equal(h.page.$globalTimers.deviceBindingActive, false);
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
  h.unload();
  assert.equal(h.calls.closes.length, 0, 'successful Wi-Fi handoff retains the BLE connection');
});

test('management connects with the passed MAC without requiring the device to advertise again', async () => {
  const h = setup({ route: { deviceId: 'known-device', fromManage: '1' }, devices: [] });
  const pending = h.start();
  await h.tick(3000);
  await pending;
  assert.equal(h.calls.scans, 0);
  assert.equal(h.calls.connects[0].deviceId, 'known-device');
  assert.equal(h.calls.navigation.length, 1);
});

test('first-binding discovery allows duplicate advertisements but connects and navigates only once on Android and iOS', async () => {
  for (const platform of ['android', 'ios']) {
    const id = platform === 'android' ? '3C:22:7F:94:F9:1B' : 'A49AF943-6FB6-7054-8DBD-66EC2CFBE13C';
    const device = { deviceId: id, name: 'ZK-B872' };
    const h = setup({ route: { deviceId: 'old-address' }, devices: [device, device], overrides: {
      getSystemInfoSync: () => ({ platform })
    } });
    const pending = h.start();
    await h.tick(1000);
    assert.equal(h.calls.scanOptions[0].allowDuplicatesKey, true);
    h.emit([device, { deviceId: id, localName: 'ZK-B872' }]);
    await h.tick(10000);
    await pending;
    h.emit([device]);
    assert.equal(h.calls.connects.length, 1);
    assert.equal(h.calls.connects[0].deviceId, id);
    assert.equal(h.calls.navigation.length, 1);
    assert.equal(h.page.deviceId, id);
    const wifi = new URL(h.calls.navigation[0], 'https://example.invalid');
    assert.equal(wifi.searchParams.get('deviceId'), id);
    assert.equal(wifi.searchParams.get('writeTypeHint'), platform === 'android' ? 'writeNoResponse' : 'write');
    assert.equal(h.calls.modals.length, 0);
    assert.equal(h.listeners.size, 0);
    assert.equal(h.timers.size, 0);
  }
});

test('iOS management reuses the supplied peripheral UUID without discovery', async () => {
  const id = 'A49AF943-6FB6-7054-8DBD-66EC2CFBE13C';
  const h = setup({ route: { deviceId: id, fromManage: '1' }, devices: [], overrides: {
    getSystemInfoSync: () => ({ platform: 'ios' })
  } });
  const pending = h.start();
  await h.tick(3000);
  await pending;
  assert.equal(h.calls.scans, 0);
  assert.equal(h.calls.connects.length, 1);
  assert.equal(h.calls.connects[0].deviceId, id);
  assert.equal(h.calls.navigation.length, 1);
  assert.equal(h.calls.mtu, 0);
});

test('a scanned connection returning no-device triggers one new scan before retrying', async () => {
  for (const error of [{ errCode: 10002 }, { code: '10002' }]) {
    const attemptedIds = [];
    const h = setup({
      route: { deviceId: '  3c:22:7f:94:f9:1b  ' },
      devices: [
        { deviceId: 'watch', name: 'BPW1' },
        { deviceId: '3C:22:7F:94:F9:1B', name: 'ZK-B872' }
      ],
      overrides: { createBLEConnection(o) {
        attemptedIds.push(o.deviceId);
        if (attemptedIds.length === 1) o.fail(error); else o.success({});
      } }
    });
    const pending = h.start();
    await h.tick(22000);
    await pending;
    assert.deepEqual(attemptedIds, ['3C:22:7F:94:F9:1B', '3C:22:7F:94:F9:1B']);
    assert.equal(h.calls.scans, 2);
    assert.equal(h.calls.stops, 2);
    assert.equal(h.calls.modals.length, 0);
    assert.equal(h.calls.navigation.length, 1);
    const url = new URL(h.calls.navigation[0], 'https://example.invalid');
    assert.equal(url.searchParams.get('deviceId'), '3C:22:7F:94:F9:1B');
    assert.equal(url.searchParams.get('fromManage'), null);
    assert.equal(url.searchParams.get('writeTypeHint'), 'writeNoResponse');
    assert.equal(h.calls.loading, false);
    assert.equal(h.listeners.size, 0);
    assert.equal(h.timers.size, 0);
  }
});

test('management retries no-device by scanning and never substitutes another ZK872 when the target is absent', async () => {
  let attempts = 0;
  const h = setup({ route: { deviceId: 'missing-target', fromManage: '1' }, overrides: {
    createBLEConnection(o) { attempts++; o.fail({ errCode: 10002 }); }
  } });
  const pending = h.start();
  await h.tick(25000);
  await pending;
  assert.equal(attempts, 1);
  assert.equal(h.calls.scans, 1);
  assert.equal(h.calls.navigation.length, 0);
  assert.equal(h.calls.modals.length, 1);
  assert.match(h.calls.modals[0].content, /蓝牙配对模式/);
  assert.equal(h.calls.loading, false);
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
});

test('first binding uses the unique ZK-B872 or ZK-B872B broadcast when the supplied address is not found', async () => {
  for (const name of ['ZK-B872', 'ZK-B872B', 'zk-b872']) {
    const attemptedIds = [];
    const h = setup({
      route: { deviceId: 'server-address' },
      devices: [{ deviceId: 'watch', name: 'BPW6' }, { deviceId: 'ble-address', localName: name }],
      overrides: { createBLEConnection(o) {
        attemptedIds.push(o.deviceId);
        if (o.deviceId === 'server-address') o.fail({ errCode: 10002 }); else o.success({});
      } }
    });
    const pending = h.start();
    await h.tick(12000);
    await pending;
    assert.deepEqual(attemptedIds, ['ble-address']);
    assert.equal(h.calls.scans, 1);
    assert.equal(h.calls.modals.length, 0);
    assert.equal(h.calls.navigation.length, 1);
    const url = new URL(h.calls.navigation[0], 'https://example.invalid');
    assert.equal(url.searchParams.get('deviceId'), 'ble-address');
    assert.equal(url.searchParams.get('sn'), 'test-sn');
    assert.equal(url.searchParams.get('fromManage'), null);
    assert.equal(h.storage.get('listdadsa')[0].deviceId, 'ble-address');
    assert.equal(h.listeners.size, 0);
    assert.equal(h.timers.size, 0);
  }
});

test('first-binding name fallback refuses multiple ZK872 devices and unrelated devices', async () => {
  for (const devices of [
    [{ deviceId: 'watch', name: 'BPW6' }, { deviceId: 'different-model', name: 'ZK-B873' }],
    [{ deviceId: 'a', name: 'ZK-B872' }, { deviceId: 'b', localName: 'ZK-B872B' }]
  ]) {
    let attempts = 0;
    const h = setup({ route: { deviceId: 'missing-target' }, devices, overrides: {
      createBLEConnection(o) { attempts++; o.fail({ errCode: 10002 }); }
    } });
    const pending = h.start();
    await h.tick(25000);
    await pending;
    assert.equal(attempts, 0);
    assert.equal(h.calls.scans, 2);
    assert.equal(h.calls.navigation.length, 0);
    assert.equal(h.calls.modals.length, 1);
    if (devices[0].name === 'ZK-B872') assert.match(h.calls.modals[0].content, /发现多台/);
    assert.equal(h.calls.loading, false);
    assert.equal(h.listeners.size, 0);
    assert.equal(h.timers.size, 0);
  }
});

test('management no-device recovery matches MAC formats and retries with the scanned address', async () => {
    for (const deviceId of ['3c227f94f91b', '3c-22-7f-94-f9-1b']) {
      const attemptedIds = [];
      const h = setup({ route: { deviceId, fromManage: '1' }, devices: [
        { deviceId: 'another-device', name: 'ZK-B872' },
        { deviceId: '3C:22:7F:94:F9:1B', name: '' }
      ], overrides: { createBLEConnection(o) {
        attemptedIds.push(o.deviceId);
        if (!h.calls.scans) o.fail({ errCode: 10002 }); else o.success({});
      } } });
      const pending = h.start();
      await h.tick(12000);
      await pending;
      assert.deepEqual(attemptedIds, [deviceId, '3C:22:7F:94:F9:1B']);
      assert.equal(h.calls.scans, 1);
      assert.equal(h.calls.modals.length, 0);
      assert.equal(h.calls.navigation.length, 1);
    }
});

test('first binding discards the old iOS UUID and keeps the discovered Android MAC through Wi-Fi handoff', async () => {
  const oldId = 'A49AF943-6FB6-7054-8DBD-66EC2CFBE13C';
  const scannedMac = '3C:22:7F:94:F9:1B';
  const h = setup({ route: { deviceId: oldId }, devices: [
    { deviceId: oldId, name: 'BPW1' },
    { deviceId: scannedMac, name: 'ZK-B872' }
  ] });
  const pending = h.start();
  assert.equal(h.page.deviceId, '', 'the old address is cleared before discovery');
  assert.equal(h.calls.connects.length, 0);
  await h.tick(11000);
  await pending;
  assert.equal(h.calls.scans, 1);
  assert.equal(h.calls.connects.length, 1);
  assert.equal(h.calls.connects[0].deviceId, scannedMac);
  assert.equal(h.page.deviceId, scannedMac);
  assert.equal(h.storage.get('listdadsa')[0].deviceId, scannedMac);
  assert.equal(new URL(h.calls.navigation[0], 'https://example.invalid').searchParams.get('deviceId'), scannedMac);
  assert.equal(h.calls.modals.length, 0);
});

test('first binding does not use an old address to choose between multiple nearby ZK872 devices', async () => {
  const h = setup({ route: { deviceId: 'old-address' }, devices: [
    { deviceId: 'old-address', name: 'ZK-B872' },
    { deviceId: 'another-address', name: 'ZK-B872' }
  ] });
  const pending = h.start();
  await h.tick(25000);
  await pending;
  assert.equal(h.calls.scans, 2);
  assert.equal(h.calls.connects.length, 0);
  assert.equal(h.calls.modals.length, 1);
  assert.match(h.calls.modals[0].content, /发现多台/);
});

test('scan-before-connect still stops after the second connection failure', async () => {
  let attempts = 0;
  const h = setup({ route: { deviceId: 'zk-device' }, overrides: {
    createBLEConnection(o) { attempts++; o.fail({ errCode: 10002 }); }
  } });
  const pending = h.start();
  await h.tick(25000);
  await pending;
  assert.equal(attempts, 2);
  assert.equal(h.calls.scans, 2);
  assert.equal(h.calls.navigation.length, 0);
  assert.equal(h.calls.modals.length, 1);
  assert.equal(h.calls.closes.length, 2);
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
});

test('leaving during discovery with a known address cancels without connecting or showing failure', async () => {
  let attempts = 0;
  const h = setup({ route: { deviceId: 'zk-device' }, overrides: {
    createBLEConnection(o) { attempts++; o.fail({ errCode: 10002 }); }
  } });
  const pending = h.start();
  await h.tick(1000);
  assert.equal(h.calls.scans, 1);
  h.hide();
  h.emit([{ deviceId: 'zk-device', name: 'Jakoblife872B' }]);
  await h.tick(25000);
  await pending;
  assert.equal(attempts, 0);
  assert.equal(h.calls.navigation.length, 0);
  assert.equal(h.calls.modals.length, 0);
  assert.equal(h.calls.loading, false);
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
});

test('both management entries skip QR scanning and reuse first-binding BLE preparation with or without a cached MAC', async () => {
  for (const file of ['pages/tabBar/device/Equipment_management.vue', 'pages/tabBar/my/Equipment_management1.vue']) {
    for (const mac of ['  known-device  ', '']) {
      const route = openManagementWifi(file, {
        name: 'ZK-B872B', deviceSn: 'saved-sn&value=1', deviceModelId: '10005', mac
      });
      assert.equal(route.sn, 'saved-sn&value=1');
      assert.equal(route.modelname, 'ZK-B872B');
      assert.equal(route.modelId, '10005');
      assert.equal(route.SELECT_TYPE, '0');
      assert.equal(route.fromManage, '1');
      assert.equal(route.deviceId, mac ? 'known-device' : undefined);
      const h = setup({ route, devices: [{ deviceId: mac ? 'known-device' : 'zk-device', name: 'ZK-B872' }] });
      assert.equal(h.calls.open, 0, 'wait for the ready-page Next button');
      h.page.btn_next();
      assert.equal(h.calls.open, 0, 'the ready checkbox still applies');
      const pending = h.start();
      await h.tick(11000);
      await pending;
      assert.equal(h.calls.scans, mac ? 0 : 1);
      assert.equal(h.calls.navigation.length, 1);
      const wifi = new URL(h.calls.navigation[0], 'https://example.invalid');
      assert.match(wifi.pathname, /Bing_xueya_2$/);
      assert.equal(wifi.searchParams.get('deviceId'), mac ? 'known-device' : 'zk-device');
      assert.equal(wifi.searchParams.get('sn'), route.sn);
      assert.equal(wifi.searchParams.get('fromManage'), '1');
      assert.equal(h.calls.modals.length, 0);
    }
  }
});

test('management retry uses the selected device and preserves the management flag after connection succeeds', async () => {
  const route = openManagementWifi('pages/tabBar/device/Equipment_management.vue', {
    name: 'ZK-B872B', deviceSn: 'saved-sn', deviceModelId: '10005', mac: 'selected-device'
  });
  let attempts = 0;
  const h = setup({ route, devices: [{ deviceId: 'selected-device', name: 'ZK-B872' }], overrides: { createBLEConnection(o) {
    attempts++;
    if (attempts === 1) o.fail({ errCode: 10003 }); else o.success({});
  } } });
  const pending = h.start();
  await h.tick(4000);
  await pending;
  assert.equal(attempts, 2);
  assert.equal(h.calls.scans, 0);
  assert.equal(h.calls.modals.length, 0);
  assert.equal(new URL(h.calls.navigation[0], 'https://example.invalid').searchParams.get('fromManage'), '1');
});

test('first connection failure retries once and second success navigates without a failure modal', async () => {
  let attempts = 0;
  const h = setup({ overrides: { createBLEConnection(o) {
    attempts++;
    if (attempts === 1) o.fail({ errCode: 10003 }); else o.success({});
  } } });
  const pending = h.start();
  await h.tick(22000);
  await pending;
  assert.equal(attempts, 2);
  assert.equal(h.calls.scans, 2);
  assert.equal(h.calls.closes.length, 1);
  assert.equal(h.calls.navigation.length, 1);
  assert.equal(h.calls.modals.length, 0);
  assert.ok(h.calls.titles.includes('正在重试连接'));
  assert.equal(h.timers.size, 0);
});

test('two failed attempts show actionable checks once and allow a new user-triggered attempt', async () => {
  let attempts = 0;
  const h = setup({ route: { deviceId: 'known-device' }, devices: [{ deviceId: 'known-device', name: 'ZK-B872' }], overrides: {
    createBLEConnection(o) { attempts++; o.fail({ errCode: 10003 }); }
  } });
  const pending = h.start();
  await h.tick(40000);
  await pending;
  assert.equal(attempts, 2);
  assert.equal(h.calls.navigation.length, 0);
  assert.equal(h.calls.modals.length, 1);
  assert.match(h.calls.modals[0].content, /1\. .*蓝牙配对模式/);
  assert.match(h.calls.modals[0].content, /2\. .*连接范围/);
  assert.equal(h.calls.loading, false);
  assert.equal(h.page.zkConnecting, false);
  assert.equal(h.timers.size, 0);
  h.api.createBLEConnection = o => { attempts++; o.success({}); };
  const retry = h.start();
  await h.tick(11000);
  await retry;
  assert.equal(attempts, 3);
  assert.equal(h.calls.navigation.length, 1);
});

test('scan timeout retries once; multiple candidates never connect an arbitrary device', async () => {
  for (const devices of [[], [{ deviceId: 'a', name: 'ZK-872' }, { deviceId: 'b', name: 'ZK-B872B' }]]) {
    const h = setup({ devices });
    const pending = h.start();
    await h.tick(25000);
    await pending;
    assert.equal(h.calls.scans, 2);
    assert.equal(h.calls.connects.length, 0);
    assert.equal(h.calls.modals.length, 1);
    if (devices.length) assert.match(h.calls.modals[0].content, /发现多台/);
    assert.equal(h.listeners.size, 0);
    assert.equal(h.timers.size, 0);
  }
});

test('connection success without usable Wi-Fi services or notifications cannot navigate', async () => {
  for (const overrides of [
    { getBLEDeviceServices(o) { o.success({ services: [{ uuid: '00001800' }] }); } },
    { getBLEDeviceCharacteristics(o) { o.success({ characteristics: [{ uuid: 'w', properties: { write: true } }] }); } },
    { getBLEDeviceServices() {} }
  ]) {
    const h = setup({ route: { deviceId: 'known' }, devices: [{ deviceId: 'known', name: 'ZK-B872' }], overrides });
    const pending = h.start();
    await h.tick(40000);
    await pending;
    assert.equal(h.calls.connects.length, 2);
    assert.equal(h.calls.navigation.length, 0);
    assert.equal(h.calls.modals.length, 1);
    assert.equal(h.calls.loading, false);
    assert.equal(h.calls.closes.length, 2);
    assert.equal(h.timers.size, 0);
  }
});

test('leaving during scan cancels timers/listeners and ignores late discovery success', async () => {
  let callback;
  const h = setup({ overrides: { startBluetoothDevicesDiscovery(o) { callback = o; } } });
  const pending = h.start();
  await flush();
  h.hide();
  callback.success({});
  h.emit([{ deviceId: 'late', name: 'ZK-872' }]);
  await h.tick(40000);
  await pending;
  assert.equal(h.calls.connects.length, 0);
  assert.equal(h.calls.navigation.length, 0);
  assert.equal(h.calls.modals.length, 0);
  assert.ok(h.calls.stops >= 1);
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
  assert.equal(h.calls.loading, false);
  assert.equal(h.page.$globalTimers.deviceBindingActive, false);
});

test('leaving during connection closes a late successful connection without retry or navigation', async () => {
  let callback;
  const h = setup({ route: { deviceId: 'known' }, devices: [{ deviceId: 'known', name: 'ZK-B872' }],
    overrides: { createBLEConnection(o) { callback = o; } } });
  const pending = h.start();
  await h.tick(8000);
  h.unload();
  callback.success({});
  await h.tick(40000);
  await pending;
  assert.ok(h.calls.closes.includes('known'));
  assert.equal(h.calls.navigation.length, 0);
  assert.equal(h.calls.modals.length, 0);
  assert.equal(h.timers.size, 0);
});

test('an existing BLE connection and a rejected MTU request still allow service discovery and handoff', async () => {
  const h = setup({ route: { deviceId: 'known' }, devices: [{ deviceId: 'known', name: 'ZK-B872' }], overrides: {
    createBLEConnection(o) { o.fail({ errCode: 10010, errMsg: 'already connect' }); },
    setBLEMTU(o) { o.fail({ errCode: 10008 }); }
  } });
  const pending = h.start();
  await h.tick(11000);
  await pending;
  assert.equal(h.calls.services, 1);
  assert.equal(h.calls.navigation.length, 1);
  assert.equal(h.calls.closes.length, 0);
});

test('navigation failure releases the pending connection and button without reconnecting', async () => {
  const h = setup({ route: { deviceId: 'known' }, devices: [{ deviceId: 'known', name: 'ZK-B872' }], overrides: {
    navigateTo(o) { o.fail({ errMsg: 'navigation failed' }); }
  } });
  const pending = h.start();
  await h.tick(11000);
  await pending;
  assert.equal(h.calls.connects.length, 1);
  assert.deepEqual(h.calls.closes, ['known']);
  assert.equal(h.page.zkConnecting, false);
  assert.equal(h.calls.toasts.length, 1);
  assert.equal(h.calls.modals.length, 0);
});

test('the earlier scan/bind page binds ZK before forwarding the known MAC without connecting BLE there', () => {
  const h = setup();
  const context = { ...h.context, module: { exports: {} }, mapMutations: () => ({}), appScan: {}, u16proBLE: {} };
  vm.runInNewContext(vueScript('pages/Bind/Bing_page/Bind_page_2.vue'), context);
  const methods = context.module.exports.methods;
  let route;
  h.api.navigateTo = o => { route = o.url; };
  const page = { $t: key => key, SELECT_TYPE: '0', modelConnectType: 2, modelname: 'ZK-B872', updateScanImage() {} };
  for (const [key, method] of Object.entries(methods)) page[key] = method.bind(page);
  page.updateScanImage = () => {};
  const requests = [];
  h.api.request = options => {
    requests.push(options);
    options.success({ statusCode: 200, data: { code: 200 } });
    options.complete();
  };
  methods.setDeviceInfo.call(page, { modelId: '10005', model: 'ZK-B872', mac: 'AA:BB:CC:DD:EE:FF', deviceSn: 'sn' });
  methods.navigateToBind.call(page, '10005');
  assert.match(route, /Bing_xueya\?/);
  assert.match(route, /deviceId=AA%3ABB%3ACC%3ADD%3AEE%3AFF/);
  assert.match(route, /zkAccountBound=1/);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].data.deviceSn, 'sn');
  assert.equal(requests[0].data.mac, 'AA:BB:CC:DD:EE:FF');
  assert.equal(h.calls.connects.length, 0);
  methods.setDeviceInfo.call(page, { modelId: '10001', model: 'JL-BP68W', mac: 'other', deviceSn: 'sn' });
  page.modelname = 'JL-BP68W';
  methods.navigateToBind.call(page, '10001');
  assert.equal(route.includes('deviceId='), false);
  assert.equal(requests.length, 1);
});
