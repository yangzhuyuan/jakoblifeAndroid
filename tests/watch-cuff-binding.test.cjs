const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const noop = () => {};
const BPW1 = '81EEA001-E735-49EC-8A11-7E32CAE1E14E';
const BPW6 = '6E40FFF0-B5A3-F393-E0A9-E50E24DCCA9E';
const BC = 'DE5BF728-D711-4E47-AF26-65E3012A5DC7';
const WIFI = '0000FFFF-0000-1000-8000-00805F9B34FB';
const script = file => read(file).split('<script>')[1].split('</script>')[0]
  .replace(/import[\s\S]*?from\s+'[^']+';?/g, '').replace('export default', 'module.exports =');

// Reuse the real Main/manager methods and both native callback delivery models.
const harness = { require, Buffer, __dirname, setImmediate, module: { exports: {} } };
const isolation = read('tests/ble-device-isolation.test.cjs');
vm.runInNewContext(isolation.slice(0, isolation.indexOf('\nfor (const mode of')) +
  '\nmodule.exports = { setup, extract };', harness);
const { setup: setupBle, extract } = harness.module.exports;

test('real ES modules link the Wi-Fi page to the shared manager and keep watch notifications alive', () => {
  // Keep imports/exports intact: injecting a manager into the VM hides invalid default imports.
  const { spawnSync } = require('node:child_process');
  const run = async () => {
    const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
    const assert = require('node:assert/strict');
    const root = process.cwd(), modules = new Map(), homePackets = [], wifiLogs = [];
    let listener;
    const context = vm.createContext({ console, uni: {
      $on() {}, getStorageSync: () => '',
      onBLECharacteristicValueChange: fn => { listener = fn; }
    } });
    function load(file) {
      if (!modules.has(file)) {
        let source = fs.readFileSync(file, 'utf8');
        if (file.endsWith('.vue')) source = source.split('<script>')[1].split('</script>')[0];
        modules.set(file, new vm.SourceTextModule(source, { context, identifier: file }));
      }
      return modules.get(file);
    }
    const module = load(path.join(root, 'pages/Bind/Bing_xueya/Bing_xueya_2.vue'));
    await module.link((specifier, parent) => load(specifier.startsWith('@/') ?
      path.resolve(root, specifier.slice(2)) : path.resolve(path.dirname(parent.identifier), specifier)));
    await module.evaluate();
    const manager = modules.get(path.join(root, 'pages/api/protocol/u16pro-ble-manager.js')).namespace.u16proBLE;
    manager.setForwardNotifyHandler(res => homePackets.push(res));
    const component = module.namespace.default;
    const page = Object.assign(component.data(), component.methods, {
      wifiConnecting: true, wifiAtSent: true, wifiAttemptId: 1, addlog: (...args) => wifiLogs.push(args)
    });
    page.onBLEValue('CUFF', 'WIFI-SERVICE', 'WRITE', 'NOTIFY');
    assert.equal(manager._scopedNotifyHandlers.size, 1);
    const watch = { deviceId: 'WATCH', serviceId: 'WATCH-SERVICE', characteristicId: 'WATCH-NOTIFY',
      value: new ArrayBuffer(0) };
    listener(watch);
    listener({ deviceId: 'CUFF', serviceId: 'WIFI-SERVICE', characteristicId: 'NOTIFY',
      value: page.asciiToBuffer('OK') });
    assert.ok(wifiLogs.some(args => args[0] === '收到OK，继续等待GOT_IP'));
    assert.equal(homePackets.length, 1);
    page.stopBleValueListener();
    assert.equal(manager._scopedNotifyHandlers.size, 0);
    listener(watch);
    assert.equal(homePackets.length, 2);
  };
  const result = spawnSync(process.execPath, ['--experimental-vm-modules', '-e',
    '(' + run.toString() + ')().catch(error => { console.error(error); process.exitCode = 1; });'], {
    cwd: path.join(__dirname, '..'), encoding: 'utf8', timeout: 10000
  });
  assert.equal(result.status, 0, result.error?.message || result.stderr || result.stdout);
});

function setupBinding(storageEntries = {}, options = {}) {
  const storage = new Map(Object.entries(storageEntries)), connections = new Set(['WATCH', 'CUFF']);
  const calls = { adapterCloses: 0, opens: 0, scanStops: 0, closed: [] }, timers = [];
  const context = vm.createContext({ module: { exports: {} }, mapMutations: () => ({}),
    appScan: {}, u16proBLE: {}, console, setTimeout: fn => timers.push(fn), clearInterval: noop,
    uni: {
      getLocale: () => 'zh-Hans', getSystemInfoSync: () => ({ platform: 'android' }),
      getStorageSync: key => storage.get(key) || '', $emit: noop,
      closeBluetoothAdapter() { calls.adapterCloses++; connections.clear(); },
      openBluetoothAdapter(options) { calls.opens++; options.success?.(); },
      closeBLEConnection(options) { calls.closed.push(options?.deviceId); },
      stopBluetoothDevicesDiscovery() { calls.scanStops++; }
    }
  });
  vm.runInContext(read('pages/api/zk872WifiConnection.js').replace(/export function /g, 'function '), context);
  vm.runInContext(script('pages/Bind/Bing_page/Bind_page_2.vue'), context);
  const component = context.module.exports;
  const page = Object.assign(component.data.call({ $t: key => key }), component.methods, {
    modelId: '10005', modelname: 'ZK-B872', modelConnectType: '2', handleBluetoothReady: noop, ...options
  });
  return { page, calls, connections, show: () => component.onShow.call(page),
    unload: () => component.onUnload.call(page), tick: () => timers.splice(0).forEach(fn => fn()) };
}

for (const key of ['deviceIdwatch', 'BPW6devicemac']) {
  for (const byName of [false, true]) {
    test(`${key}: entering and leaving ZK872 binding preserves watch BLE (${byName ? 'name' : 'model ID'})`, () => {
      const h = setupBinding({ [key]: 'WATCH' }, byName ? { modelId: '' } : {});
      h.show(); h.tick(); h.unload();
      assert.equal(h.calls.opens, 1, 'binding must still initialize scanning/permissions');
      assert.equal(h.calls.scanStops, 1, 'page cleanup must still stop discovery');
      assert.equal(h.calls.adapterCloses, 0);
      assert.deepEqual(h.calls.closed, []);
      assert.equal(h.connections.has('WATCH'), true);
    });
  }
}

test('cuff-only binding and other model binding retain their existing adapter lifecycle', () => {
  for (const [storage, options] of [[{}, {}], [{ deviceIdwatch: 'WATCH' },
    { modelId: '20000', modelname: 'JL-S260' }], [{ BPW6devicemac: 'WATCH' },
    { modelConnectType: '1' }]]) {
    const h = setupBinding(storage, options);
    h.show(); h.tick(); h.unload();
    assert.equal(h.calls.adapterCloses, 2);
    assert.equal(h.calls.opens, 1);
  }
});

test('successful BPW1 binding keeps its original BLE handoff', () => {
  const h = setupBinding({}, { modelId: '30000', modelname: 'BPW1', modelConnectType: '1', _bpw1BindKeepBle: true });
  h.unload();
  assert.equal(h.calls.adapterCloses, 0);
  assert.equal(h.calls.scanStops, 1);
});

function setupWifi(h) {
  h.context.module = { exports: {} };
  h.context.getCurrentPages = () => [];
  vm.runInContext(script('pages/Bind/Bing_xueya/Bing_xueya_2.vue'), h.context);
  const component = h.context.module.exports;
  const wifi = Object.assign(component.data(), component.methods, {
    deviceId: 'CUFF', serviceId: WIFI, uuid: 'WIFI-WRITE', notifyuuid: 'WIFI-NOTIFY',
    wifiConnecting: true, wifiAtSent: true, wifiAttemptId: 1, fromManage: true,
    $t: key => key, $url_APP_IP: 'https://example.invalid', addlog: noop
  });
  wifi.onBLEValue(wifi.deviceId, wifi.serviceId, wifi.uuid, wifi.notifyuuid);
  return { wifi, unload: () => component.onUnload.call(wifi) };
}

function watchPackets(h) {
  const packet = (deviceId, serviceId, hex) => ({ deviceId, serviceId,
    characteristicId: 'WATCH-NOTIFY', value: Uint8Array.from(Buffer.from(hex, 'hex')).buffer });
  h.emit(packet('WATCH-1', BPW1, '010203'));
  h.emit(packet('WATCH-6', BC, 'bc010203'));
  h.emit(packet('WATCH-6', BPW6, '32010203'));
}

for (const mode of ['replace', 'additive']) {
  for (const offAvailable of [false, true]) {
    for (const finish of ['success', 'failure', 'unload']) {
      test(`${mode}/off=${offAvailable}/${finish}: Wi-Fi and both watches receive their own packets before and after cleanup`, () => {
        const h = setupBle(mode);
        if (offAvailable) h.context.uni.offBLECharacteristicValueChange = fn => {
          const i = h.listeners.indexOf(fn); if (i >= 0) h.listeners.splice(i, 1);
        };
        h.context.uni.navigateTo = noop;
        h.bindWatch(); h.bindCuff();
        const { wifi, unload } = setupWifi(h);
        const logs = [];
        wifi.addlog = (...args) => logs.push(args);
        watchPackets(h);
        assert.equal(logs.length, 0, 'watch packets must never enter the Wi-Fi parser');
        // A Main re-registration while the Wi-Fi attempt is pending must preserve both routes.
        h.page.registerBpw6BleNotifyListener();
        watchPackets(h);
        h.emit({ deviceId: 'CUFF', serviceId: WIFI.toLowerCase(), characteristicId: 'WIFI-NOTIFY',
          value: wifi.asciiToBuffer('WLAN_CONNECTED') });
        assert.ok(logs.some(args => args[0] === '收到WLAN_CONNECTED，等待GOT_IP'));
        assert.equal(wifi.WIFITYPE, false);
        if (finish === 'success') wifi.handleWifiSetSuccess('CUFF');
        else if (finish === 'failure') wifi.handleWifiSetFail();
        else unload();
        const logCount = logs.length;
        watchPackets(h);
        assert.equal(logs.length, logCount, 'ended Wi-Fi handlers must be removed even without native off()');
        assert.equal(h.manager._scopedNotifyHandlers.size, 0);
        assert.equal(h.page.dataBuffer.length, 3);
        assert.equal(h.calls.bc.length, 3);
        assert.equal(h.calls.main.length, 3);
        assert.equal(h.calls.bpw6.length, 6, 'additive native callbacks must not duplicate watch parsing');
      });
    }
  }
}

test('scoped Wi-Fi registration checks device, service and characteristic before taking a packet', () => {
  const h = setupBle(); const home = [], wifi = [];
  h.manager.setForwardNotifyHandler(res => home.push(res));
  h.manager.addScopedNotifyHandler('CUFF', WIFI, 'WIFI-NOTIFY', res => wifi.push(res));
  const packet = { deviceId: 'CUFF', serviceId: WIFI, characteristicId: 'WIFI-NOTIFY', value: new ArrayBuffer(0) };
  for (const extra of [{ deviceId: 'FOREIGN' }, { serviceId: 'OTHER' }, { characteristicId: 'OTHER' }]) {
    h.emit({ ...packet, ...extra });
  }
  h.emit(packet);
  h.emit({ ...packet, serviceId: undefined }); // Android may omit the service ID.
  assert.equal(home.length, 3);
  assert.equal(wifi.length, 2);
});

test('releasing homepage ownership cannot cancel an active Wi-Fi attempt', () => {
  const h = setupBle(); const seen = [];
  h.manager.addScopedNotifyHandler('CUFF', WIFI, 'WIFI-NOTIFY', res => seen.push(res));
  h.manager.clearForwardNotifyRouting();
  h.emit({ deviceId: 'CUFF', serviceId: WIFI, characteristicId: 'WIFI-NOTIFY', value: new ArrayBuffer(0) });
  assert.equal(seen.length, 1);
});

test('cuff SN changes neither watch step ownership nor BPW1 upload identity', () => {
  const h = setupBle(); const resets = [];
  h.storage.delete('BPW6deviceSn'); h.storage.delete('BPW6devicemac');
  Object.assign(h.page, extract(read('pages/tabBar/main/Main.vue'), ['getCurrentWatchStepsSourceKey',
    'ensureWatchStepsMatchBoundDevice', 'isStepsPendingNewDevice', 'resolveBpw1DeviceSn', 'isPlaceholderBpw1Id'], h.context), {
    shoubiaosn: '0', clearWatchStepsDisplay: reason => resets.push(reason)
  });
  h.storage.set('steps_source_device_key', 'SN-1');
  for (const sn of ['CUFF-SN', 'SN-1', 'CUFF-SN']) {
    h.storage.set('deviceSn', sn);
    h.page.ensureWatchStepsMatchBoundDevice();
    assert.equal(h.page.getCurrentWatchStepsSourceKey(), 'SN-1');
    assert.equal(h.page.resolveBpw1DeviceSn(), 'SN-1');
  }
  assert.deepEqual(resets, []);
  h.storage.set('BPW1deviceSn', 'NEW-WATCH');
  h.page.ensureWatchStepsMatchBoundDevice();
  assert.deepEqual(resets, ['watch-changed'], 'an actual watch replacement must still clear its steps');
  h.storage.delete('BPW1deviceSn'); h.storage.set('deviceSn', 'LEGACY-WATCH');
  h.page.shoubiaosn = '0';
  assert.equal(h.page.getCurrentWatchStepsSourceKey(), 'LEGACY-WATCH');
  assert.equal(h.page.resolveBpw1DeviceSn(), 'LEGACY-WATCH');
});
