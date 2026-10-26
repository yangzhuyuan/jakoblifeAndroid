// Run with: node --test tests/wifi-provisioning.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../pages/Bind/Bing_xueya/Bing_xueya_2.vue'), 'utf8')
  .split('<script>')[1].split('</script>')[0]
  .replace(/import[\s\S]*?from\s+'[^']+';?/g, '')
  .replace('export default', 'module.exports =');

function setup({ fromManage = true, platform = 'ios', notify, write, request, pageRoutes = [] } = {}) {
  let now = 0, nextTimer = 0;
  const timers = new Map(), listeners = new Set();
  const calls = { writes: [], requests: [], navigation: [], toasts: [], loading: false, order: [] };
  const schedule = (fn, delay) => {
    const id = ++nextTimer;
    timers.set(id, { fn, at: now + delay });
    return id;
  };
  const navigate = (kind, options) => {
    calls.navigation.push({ kind, ...options });
    options.complete?.();
  };
  const uni = {
    getSystemInfoSync() { return { platform }; },
    showLoading() { calls.loading = true; },
    hideLoading() { calls.loading = false; },
    showToast(options) { calls.toasts.push(options); },
    getStorageSync() { return 'test-token'; },
    setStorageSync() {},
    onBLECharacteristicValueChange(fn) { calls.order.push('listen'); listeners.add(fn); },
    offBLECharacteristicValueChange(fn) { listeners.delete(fn); },
    notifyBLECharacteristicValueChange(options) {
      calls.order.push('notify');
      if (notify) notify(options); else options.success({});
    },
    writeBLECharacteristicValue(options) {
      calls.order.push('write');
      const command = Buffer.from(options.value).toString('ascii');
      calls.writes.push({ ...options, command });
      if (write) write(options, command); else options.success({});
    },
    request(options) {
      const entry = { ...options, aborted: false };
      calls.requests.push(entry);
      if (request) request(options);
      return { abort() { entry.aborted = true; options.fail?.({ errMsg: 'abort' }); } };
    },
    navigateBack(options) { navigate('back', options); },
    navigateTo(options) { navigate('to', options); },
    redirectTo(options) { navigate('redirect', options); },
    reLaunch(options) { navigate('relaunch', options); }
  };
  const context = {
    module: { exports: {} }, uni, console: { log() {} },
    u16proBLE: {
      addScopedNotifyHandler(deviceId, serviceId, characteristicId, handler) { uni.onBLECharacteristicValueChange(handler); },
      removeScopedNotifyHandler(handler) { uni.offBLECharacteristicValueChange(handler); }
    },
    setTimeout: schedule, clearTimeout: id => timers.delete(id),
    getCurrentPages: () => pageRoutes.map(route => ({ route })),
    getLocalTimeAllJSON: () => ({ YMDHMSWIFI: '20261015161109' })
  };
  vm.runInNewContext(source, context);
  const component = context.module.exports;
  const page = Object.assign(component.data(), {
    fromManage, deviceId: 'test-device', serviceId: 'test-service', uuid: 'test-write',
    notifyuuid: 'test-notify', sn: 'test-sn', modelId: 'test-model',
    wifi_name: 'TestWifi', wifi_password: 'test-password',
    $t: key => key, $url_APP_IP: 'https://example.invalid',
    $url_bind_device: '/bind', $url_getunbind: '/unbind'
  });
  for (const [name, method] of Object.entries(component.methods)) page[name] = method.bind(page);
  return {
    page, calls, listeners, timers,
    load: options => component.onLoad.call(page, options),
    unload: () => component.onUnload.call(page),
    emit(text, extra = {}) {
      for (const fn of [...listeners]) fn({
        deviceId: page.deviceId, serviceId: page.serviceId, characteristicId: page.notifyuuid,
        value: page.asciiToBuffer(text), ...extra
      });
    },
    tick(ms) {
      const target = now + ms;
      while (true) {
        const next = [...timers].filter(([, timer]) => timer.at <= target)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        const [id, timer] = next;
        timers.delete(id);
        now = timer.at;
        timer.fn();
      }
      now = target;
    }
  };
}

test('reported OK -> disconnected -> connected -> GOT_IP closes loading and finishes once', () => {
  const h = setup();
  h.page.btn_start();
  assert.deepEqual(h.calls.order, ['notify', 'listen']);
  h.tick(1000);
  assert.deepEqual(h.calls.order, ['notify', 'listen', 'write']);
  h.emit('OK\r\n');
  h.emit('+QSTASTAT:WLAN_DISCONNECTED\r\n');
  h.tick(2000);
  h.emit('+QSTASTAT:WLAN_CONNECTED\r\n');
  assert.equal(h.calls.loading, true);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  assert.equal(h.calls.loading, false);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  h.tick(500);
  assert.equal(Buffer.from(h.calls.writes[1].value).toString('hex'), '74696d654020261015161109');
  h.tick(90000);
  assert.equal(h.calls.writes.length, 2);
  assert.equal(h.calls.navigation.length, 1);
  assert.equal(h.calls.navigation[0].kind, 'back');
  assert.equal(h.calls.loading, false);
  assert.equal(h.listeners.size, 0);
});

test('managed Wi-Fi success shows confirmation before returning to the originating manager without binding again', () => {
  for (const manager of ['pages/tabBar/device/Equipment_management', 'pages/tabBar/my/Equipment_management1']) {
    for (const useBluetoothList of [false, true]) {
      const setupPages = ['pages/Bind/Bing_xueya/Bing_xueya'];
      if (useBluetoothList) setupPages.push('pages/Bind/Bing_xueya/lanya_wifi');
      setupPages.push('pages/Bind/Bing_xueya/Bing_xueya_2');
      const h = setup({ pageRoutes: ['pages/tabBar/main/Main', manager, ...setupPages] });
      h.page.btn_start();
      h.tick(300);
      assert.equal(h.calls.toasts.length, 0, 'writing credentials alone is not success');
      h.emit('+QSTASTAT:GOT_IP\r\n');
      h.tick(500);
      assert.equal(h.calls.toasts.length, 1);
      assert.equal(h.calls.toasts[0].title, 'WiFi更换成功');
      assert.equal(h.calls.toasts[0].duration, 1500);
      assert.equal(h.calls.loading, false);
      h.emit('+QSTASTAT:GOT_IP\r\n');
      h.tick(1499);
      assert.equal(h.calls.navigation.length, 0, 'leave time to read the confirmation');
      h.tick(1);
      assert.equal(h.calls.toasts.length, 1, 'duplicate device replies must not repeat the confirmation');
      assert.equal(h.calls.navigation.length, 1);
      assert.equal(h.calls.navigation[0].kind, 'back');
      assert.equal(h.calls.navigation[0].delta, setupPages.length);
      assert.equal(h.calls.requests.length, 0, 'reconfiguring Wi-Fi must not bind or unbind the saved device');
      assert.equal(Buffer.from(h.calls.writes[1].value).toString('hex'), '74696d654020261015161109');
    }
  }
});

test('listener is registered only inside the notification callback', () => {
  let notifyCallback;
  const h = setup({ notify(options) { notifyCallback = options; } });
  h.page.btn_start();
  assert.equal(h.listeners.size, 0);
  assert.deepEqual(h.calls.order, ['notify']);
  h.tick(1000);
  assert.equal(h.calls.writes.length, 0);
  assert.equal(h.listeners.size, 0);
  notifyCallback.success({});
  assert.deepEqual(h.calls.order, ['notify', 'listen']);
  h.emit('+QSTASTAT:GOT_IP\r\n'); // Ignore a previous connection's state before sending AT.
  assert.equal(h.calls.loading, true);
  h.tick(299);
  assert.equal(h.calls.writes.length, 0);
  h.tick(1);
  assert.deepEqual(h.calls.order, ['notify', 'listen', 'write']);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  assert.equal(h.calls.loading, false);
  h.tick(90000);
  assert.equal(h.calls.writes.length, 2);
  assert.equal(h.calls.navigation.length, 1);
  assert.equal(h.timers.size, 0);
});

test('repeat clicks are ignored; OK alone times out without resending AT', () => {
  const h = setup();
  h.page.btn_start();
  h.page.btn_start();
  h.tick(1000);
  h.emit('OK\r\n');
  h.tick(43000);
  h.emit('OK\r\n');
  assert.equal(h.calls.loading, true);
  h.tick(1000);
  assert.equal(h.calls.loading, false);
  assert.equal(h.page.wifiConnecting, false);
  assert.equal(h.calls.writes.length, 1);
  assert.equal(h.calls.toasts.length, 0);
  h.tick(90000);
  assert.equal(h.calls.navigation.length, 1);
  assert.equal(h.calls.navigation[0].url, '../Bing_page/Bind_fail?bindcode=0&fromManage=1');
  assert.equal(h.calls.requests.length, 0, 'a managed Wi-Fi timeout must not unbind the device');
});

test('missing notify callback is bounded by overall deadline; late callback is ignored', () => {
  let notifyCallback;
  const h = setup({ notify(options) { notifyCallback = options; } });
  h.page.btn_start();
  h.tick(45000);
  assert.equal(h.calls.loading, false);
  notifyCallback.success({});
  h.tick(1000);
  assert.equal(h.calls.writes.length, 0);
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
});

test('late notify callback after GOT_IP cannot restart waiting or send another AT command', () => {
  let notifyCallback;
  const h = setup({ notify(options) { notifyCallback = options; } });
  h.page.btn_start();
  assert.equal(h.calls.loading, true);
  assert.equal(h.calls.writes.length, 0);
  notifyCallback.success({});
  notifyCallback.success({});
  h.tick(300);
  assert.equal(h.calls.writes.length, 1);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  notifyCallback.success({});
  assert.equal(h.calls.loading, false);
  h.tick(90000);
  assert.equal(h.calls.writes.length, 2);
  assert.equal(h.calls.navigation.length, 1);
  assert.equal(h.timers.size, 0);
});

test('management notify failure stops before writing; WiFi ERROR still ends an active attempt', () => {
  const failedNotify = setup({ notify(options) { options.fail({ errMsg: 'notify failed' }); } });
  failedNotify.page.btn_start();
  failedNotify.tick(1000);
  assert.equal(failedNotify.calls.loading, false);
  assert.equal(failedNotify.listeners.size, 0);
  assert.equal(failedNotify.calls.writes.length, 0);
  assert.equal(failedNotify.calls.requests.length, 0);
  assert.equal(failedNotify.timers.size, 0);
  const h = setup();
  h.page.btn_start();
  h.tick(1000);
  h.emit('ERROR\r\n');
  assert.equal(h.calls.loading, false);
  assert.equal(h.page.wifiConnecting, false);
  assert.equal(h.calls.requests.length, 0);
  assert.equal(h.timers.size, 0);
  assert.equal(h.calls.navigation[0].url, '../Bing_page/Bind_fail?bindcode=0&fromManage=1');
});

test('time write with no callback finishes after 3 seconds without restoring spinner', () => {
  const h = setup({ write(options, command) {
    if (command.startsWith('AT+')) options.success({});
  } });
  h.page.btn_start();
  h.tick(1000);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  h.tick(3500);
  assert.equal(h.calls.loading, false);
  assert.equal(h.calls.toasts.at(-1).title, 'WiFi更换成功');
  h.calls.writes[1].success({});
  h.tick(1500);
  assert.equal(h.calls.navigation.length, 1);
});

test('combined disconnect/GOT_IP packet succeeds; unrelated devices and characteristics are ignored', () => {
  const h = setup();
  h.page.btn_start();
  h.tick(1000);
  h.emit('+QSTASTAT:GOT_IP\r\n', { deviceId: 'other-device' });
  h.emit('+QSTASTAT:GOT_IP\r\n', { characteristicId: 'other-char' });
  assert.equal(h.calls.loading, true);
  h.emit('+QSTASTAT:WLAN_DISCONNECTED\r\n+QSTASTAT:GOT_IP\r\n');
  assert.equal(h.calls.loading, false);
  h.tick(2000);
  assert.equal(h.calls.navigation.length, 1);
});

test('binding timeout aborts request; same credentials retry binding without another AT', () => {
  const h = setup({ fromManage: false });
  h.page.btn_start();
  h.tick(1000);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  h.tick(500);
  assert.equal(h.calls.requests[0].timeout, 15000);
  h.page.btn_start();
  assert.equal(h.calls.requests.length, 1);
  h.tick(15000);
  assert.equal(h.calls.requests[0].aborted, true);
  assert.equal(h.calls.loading, false);
  assert.equal(h.page.wifiConnecting, false);
  h.page.btn_start();
  assert.equal(h.calls.requests.length, 2);
  assert.equal(h.calls.writes.length, 2);
  h.calls.requests[0].success({ statusCode: 200, data: { code: 200 } });
  assert.equal(h.calls.navigation.length, 0);
  h.calls.requests[1].success({ statusCode: 200, data: { code: 200 } });
  assert.equal(h.calls.navigation[0].kind, 'redirect');
  assert.match(h.calls.navigation[0].url, /Bind_success/);
  assert.equal(h.timers.size, 0);
});

test('binding request network failure releases button and allows binding retry', () => {
  const h = setup({ fromManage: false });
  h.page.btn_start();
  h.tick(1000);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  h.tick(500);
  h.calls.requests[0].fail({ errMsg: 'network failure' });
  assert.equal(h.calls.loading, false);
  assert.equal(h.page.wifiConnecting, false);
  h.page.btn_start();
  assert.equal(h.calls.requests.length, 2);
  assert.equal(h.calls.writes.length, 2);
});

test('changed WiFi credentials after a binding failure start a fresh provisioning attempt', () => {
  const h = setup({ fromManage: false });
  h.page.btn_start();
  h.tick(1000);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  h.tick(500);
  h.calls.requests[0].fail({});
  h.page.wifi_password = 'new-password';
  h.page.btn_start();
  h.tick(300);
  assert.equal(h.calls.writes.length, 3);
  assert.match(h.calls.writes[2].command, /new-password/);
  assert.equal(h.calls.loading, true);
});

test('late write failure from a timed-out attempt cannot fail the next attempt', () => {
  const h = setup({ write() {} });
  h.page.btn_start();
  h.tick(300);
  const oldWrite = h.calls.writes[0];
  h.tick(15000);
  h.page.btn_start();
  h.tick(300);
  oldWrite.fail({});
  oldWrite.success({});
  assert.equal(h.page.wifiConnecting, true);
  assert.equal(h.calls.writes.length, 2);
  h.calls.writes[1].success({});
  h.tick(1000);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  assert.equal(h.calls.loading, false);
});

test('unload removes listener and cancels delayed time write', () => {
  const h = setup();
  h.page.btn_start();
  h.tick(1000);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  h.unload();
  h.tick(90000);
  assert.equal(h.calls.writes.length, 1);
  assert.equal(h.calls.navigation.length, 0);
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
  assert.equal(h.calls.loading, false);
});

test('unload aborts pending binding; late server response cannot navigate', () => {
  const h = setup({ fromManage: false });
  h.page.btn_start();
  h.tick(1000);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  h.tick(500);
  h.unload();
  h.calls.requests[0].success({ statusCode: 200, data: { code: 200 } });
  assert.equal(h.calls.requests[0].aborted, true);
  assert.equal(h.calls.navigation.length, 0);
  assert.equal(h.timers.size, 0);
});

test('iOS AT and time sync honor the write mode selected during service discovery', () => {
  const h = setup();
  h.load({ deviceId: 'test-device', serviceId: 'test-service', uuid: 'test-write',
    notifyuuid: 'test-notify', fromManage: '1', writeTypeHint: 'write' });
  assert.equal(h.page.preferredWriteType, 'write');
  h.page.btn_start();
  h.tick(1000);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  h.tick(2000);
  assert.deepEqual(h.calls.writes.map(w => w.writeType), ['write', 'write']);
  assert.equal(h.calls.navigation.length, 1);
});

test('iOS write target hints prefer acknowledged writes when available', () => {
  const h = setup();
  for (const properties of [
    { write: true, writeNoResponse: false },
    { write: false, writeNoResponse: true },
    { write: true, writeNoResponse: true }
  ]) {
    const target = h.page.pickCharsFromList([{ uuid: 'test-write', properties }]);
    assert.equal(target.uuid, 'test-write');
    assert.equal(target.writeTypeHint, properties.write ? 'write' : 'writeNoResponse');
  }
});

test('Android uses writeNoResponse even when an old route suggests write', () => {
  for (const fromManage of [false, true]) {
    const h = setup({ platform: 'android', fromManage });
    h.load({ deviceId: 'test-device', serviceId: 'test-service', uuid: 'test-write',
      notifyuuid: 'test-notify', fromManage: fromManage ? '1' : '0', writeTypeHint: 'write' });
    h.page.btn_start();
    h.tick(300);
    h.emit('+QSTASTAT:GOT_IP\r\n');
    h.tick(2000);
    assert.deepEqual(h.calls.writes.map(w => w.writeType), ['writeNoResponse', 'writeNoResponse']);
    h.unload();
    assert.equal(h.timers.size, 0);
  }
});

test('Android discovery preserves missing writeNoResponse metadata and selects its platform default', async () => {
  const properties = { read: false, write: true, notify: true, indicate: false };
  const route = discoverWifiRoute(properties, false, 'android');
  assert.equal(route.writeTypeHint, 'writeNoResponse');
  const h = setup({ platform: 'android' });
  h.page.getServicesAsync = async () => [{ uuid: '0000FFFF-0000-1000-8000-00805F9B34FB' }];
  h.page.getCharacteristicsAsync = async () => [{ uuid: 'test-write', properties }];
  const target = await h.page.resolveBleWriteTarget('test-device');
  assert.equal(target.writeTypeHint, 'writeNoResponse');
  const log = h.page.bpDebugLogs.find(log => log.text.includes('ble char原始属性'));
  assert.ok(log.text.includes('"write":true'));
  assert.equal(log.text.includes('"writeNoResponse":false'), false);
});

test('Android API write success without device notifications still times out without claiming success', () => {
  const h = setup({ platform: 'android' });
  h.page.btn_start();
  h.tick(300);
  assert.equal(h.calls.writes[0].writeType, 'writeNoResponse');
  assert.equal(h.calls.loading, true);
  h.tick(45000);
  assert.equal(h.calls.writes.length, 1);
  assert.equal(h.calls.navigation.length, 1);
  assert.equal(h.calls.navigation[0].url, '../Bing_page/Bind_fail?bindcode=0&fromManage=1');
  assert.equal(h.calls.toasts.length, 0);
  assert.equal(h.calls.loading, false);
  assert.equal(h.timers.size, 0);
});

function discoverWifiRoute(properties, fromManage, platform = 'ios') {
  const discoverySource = fs.readFileSync(path.join(__dirname, '../pages/Bind/Bing_xueya/lanya_wifi.vue'), 'utf8')
    .split('<script>')[1].split('</script>')[0]
    .replace('export default', 'module.exports =');
  let route;
  const context = {
    module: { exports: {} }, console: { log() {} },
    uni: {
      getSystemInfoSync() { return { platform }; },
      getBLEDeviceCharacteristics(options) {
        options.success({ characteristics: [{ uuid: 'test-write', properties: { ...properties, notify: true } }] });
      },
      navigateTo(options) { route = options.url; }
    }
  };
  vm.runInNewContext(discoverySource, context);
  const component = context.module.exports;
  const page = Object.assign(component.data(), {
    fromManage, sn: 'test-sn', modelId: 'test-model', SELECT_TYPE: '0',
    $refs: { popup: { close() {} }, popup1: { open() {}, close() {} } }
  });
  for (const [name, method] of Object.entries(component.methods)) page[name] = method.bind(page);
  page.getBLEDeviceCharacteristics('test-device', 'test-service');
  page.turesss();
  return Object.fromEntries(new URL(route, 'https://example.invalid').searchParams);
}

test('discovery -> route -> AT -> device reply -> time sync respects advertised write modes', () => {
  for (const fromManage of [false, true]) {
    for (const properties of [
      { write: true, writeNoResponse: false },
      { write: false, writeNoResponse: true },
      { write: true, writeNoResponse: true }
    ]) {
      const expectedMode = properties.write ? 'write' : 'writeNoResponse';
      const route = discoverWifiRoute(properties, fromManage);
      const h = setup({ fromManage, write(options, command) {
        options.success({}); // Reproduce a native API success even for an unsupported mode.
        if (command.startsWith('AT+') && properties[options.writeType]) {
          h.emit('OK\r\n');
          h.emit('+QSTASTAT:WLAN_CONNECTED\r\n+QSTASTAT:GOT_IP\r\n');
        }
      } });
      h.load(route);
      h.page.btn_start();
      h.tick(300);
      assert.equal(h.page.bleValueHandled, true, 'device must accept AT and return GOT_IP');
      h.tick(2000);
      assert.deepEqual(h.calls.writes.map(w => w.writeType), [expectedMode, expectedMode]);
      assert.equal(h.calls.writes[0].command, 'AT+QSTAAPINFODEF=TestWifi,test-password');
      assert.equal(Buffer.from(h.calls.writes[1].value).toString('hex'), '74696d654020261015161109');
      if (fromManage) {
        assert.equal(h.calls.navigation[0].kind, 'back');
      } else {
        assert.equal(h.calls.requests[0].url, 'https://example.invalid/bind');
        h.calls.requests[0].success({ statusCode: 200, data: { code: 200 } });
        assert.equal(h.calls.navigation[0].kind, 'redirect');
      }
      assert.equal(h.listeners.size, 0);
      assert.equal(h.timers.size, 0);
    }
  }
});

test('management rediscovery carries the selected characteristic write mode into AT and time sync', async () => {
  for (const properties of [
    { write: true, writeNoResponse: false },
    { write: false, writeNoResponse: true }
  ]) {
    const h = setup();
    h.load({ deviceId: 'test-device', fromManage: '1' });
    h.page.ensureBleSession = async () => {};
    h.page.getServicesAsync = async () => [{ uuid: '0000FFFF-0000-1000-8000-00805F9B34FB' }];
    h.page.getCharacteristicsAsync = async () => [
      { uuid: 'test-write', properties },
      { uuid: 'test-notify', properties: { notify: true } }
    ];
    h.page.btn_start();
    await new Promise(resolve => setImmediate(resolve));
    h.tick(300);
    h.emit('+QSTASTAT:GOT_IP\r\n');
    h.tick(2000);
    const expectedMode = properties.write ? 'write' : 'writeNoResponse';
    assert.deepEqual(h.calls.writes.map(w => w.writeType), [expectedMode, expectedMode]);
    assert.equal(h.calls.navigation[0].kind, 'back');
    assert.equal(h.timers.size, 0);
  }
});

test('every long-data chunk uses the selected write mode in sequence', () => {
  for (const writeTypeHint of ['write', 'writeNoResponse']) {
    const h = setup();
    h.load({ writeTypeHint });
    const command = 'time@' + '1'.repeat(40);
    let completed = 0;
    h.page.writeBleCharacteristicValue('test-device', 'test-service', 'test-write', h.page.asciiToBuffer(command), {
      success() { completed++; },
      fail() { assert.fail('write unexpectedly failed'); }
    });
    assert.equal(h.calls.writes.length, 1);
    h.tick(100);
    assert.deepEqual(h.calls.writes.map(w => w.value.byteLength), [20, 20, 5]);
    assert.equal(h.calls.writes.map(w => w.command).join(''), command);
    assert.deepEqual(h.calls.writes.map(w => w.writeType), [writeTypeHint, writeTypeHint, writeTypeHint]);
    assert.equal(completed, 1);
  }
});

test('time sync failure does not change write mode or fail an established WiFi connection', () => {
  const h = setup({ write(options, command) {
    if (command.startsWith('time@')) options.fail({ errCode: 10007 });
    else options.success({});
  } });
  h.page.btn_start();
  h.tick(1000);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  h.tick(2000);
  assert.deepEqual(h.calls.writes.map(w => w.writeType), ['write', 'write']);
  assert.equal(h.calls.navigation.length, 1);
  assert.equal(h.calls.loading, false);
});

test('first binding waits for notification and listener readiness before writing the current AT format', () => {
  let notifyCallback;
  const h = setup({
    fromManage: false,
    notify(options) { notifyCallback = options; }
  });
  h.page.wifi_name = 'TestWifi';
  h.page.wifi_password = ' password with spaces ';
  const expected = 'AT+QSTAAPINFODEF=TestWifi,password with spaces';
  h.page.btn_start();
  assert.deepEqual(h.calls.order, ['notify']);
  h.tick(1000);
  assert.equal(h.calls.writes.length, 0);
  notifyCallback.success({});
  assert.deepEqual(h.calls.order, ['notify', 'listen']);
  h.tick(299);
  assert.equal(h.calls.writes.length, 0);
  h.tick(1);
  assert.deepEqual(h.calls.order, ['notify', 'listen', 'write']);
  assert.equal(h.calls.writes.length, 1);
  assert.equal(h.calls.writes[0].command, expected);
  assert.equal(h.calls.writes[0].value.byteLength, Buffer.byteLength(expected));
  assert.equal(h.calls.writes[0].writeType, 'write');
  h.emit('+QSTASTAT:GOT_IP\r\n');
  assert.equal(h.calls.loading, false);
  h.tick(1300);
  assert.equal(h.calls.toasts.length, 0, 'first binding retains its success-page flow');
  assert.equal(h.calls.requests.length, 1);
  assert.equal(h.calls.requests[0].url, 'https://example.invalid/bind');
  assert.equal(h.calls.writes.length, 2);
});

test('empty password sends only the trimmed SSID with no comma or CRLF', () => {
  const h = setup();
  h.page.wifi_password = '';
  h.page.wifi_name = ' TestWifi ';
  assert.equal(h.page.buildWifiAtCommand(), 'AT+QSTAAPINFODEF=TestWifi');
});

test('unload during the first-binding notification settling delay cancels AT writing', () => {
  const h = setup({ fromManage: false });
  h.page.btn_start();
  h.tick(299);
  h.unload();
  h.tick(90000);
  assert.equal(h.calls.writes.length, 0);
  assert.equal(h.listeners.size, 0);
  assert.equal(h.calls.loading, false);
  assert.equal(h.timers.size, 0);
});

test('unsupported write failure does not resend with an unadvertised write mode', () => {
  const h = setup({ write(options) { options.fail({ errCode: 10007 }); } });
  h.page.btn_start();
  h.tick(300);
  assert.deepEqual(h.calls.writes.map(w => w.writeType), ['write']);
  h.tick(90000);
  assert.deepEqual(h.calls.order, ['notify', 'listen', 'write']);
  assert.equal(h.calls.loading, false);
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
});

test('management receives fast AT replies even before the write success callback', () => {
  const h = setup({ write(options, command) {
    if (command.startsWith('AT+')) {
      assert.equal(h.listeners.size, 1);
      h.emit('OK\r\n');
      h.emit('+QSTASTAT:WLAN_CONNECTED\r\n+QSTASTAT:GOT_IP\r\n');
    }
    options.success({});
  } });
  h.page.wifi_name = ' TestWifi ';
  h.page.wifi_password = ' password with spaces ';
  h.page.btn_start();
  h.tick(300);
  assert.equal(h.calls.loading, false);
  assert.equal(h.calls.writes[0].command, 'AT+QSTAAPINFODEF=TestWifi,password with spaces');
  assert.equal(h.calls.writes[0].writeType, 'write');
  h.tick(90000);
  assert.deepEqual(h.calls.order, ['notify', 'listen', 'write', 'write']);
  assert.equal(h.calls.navigation.length, 1);
  assert.equal(h.calls.navigation[0].kind, 'back');
  assert.equal(h.calls.requests.length, 0);
  assert.equal(h.timers.size, 0);
});

test('unload during management notification setup or settling prevents AT writes', () => {
  for (const pending of [true, false]) {
    let notifyCallback;
    const h = setup({ notify(options) {
      notifyCallback = options;
      if (!pending) options.success({});
    } });
    h.page.btn_start();
    h.tick(299);
    h.unload();
    notifyCallback.success({});
    h.tick(90000);
    assert.equal(h.calls.writes.length, 0);
    assert.equal(h.calls.navigation.length, 0);
    assert.equal(h.calls.loading, false);
    assert.equal(h.listeners.size, 0);
    assert.equal(h.timers.size, 0);
  }
});

test('a previous management notify callback cannot send AT for a new attempt', () => {
  const callbacks = [];
  const h = setup({ notify(options) { callbacks.push(options); } });
  h.page.btn_start();
  h.tick(45000);
  h.page.btn_start();
  callbacks[0].success({});
  callbacks[0].fail({});
  h.tick(300);
  assert.equal(h.calls.writes.length, 0);
  assert.equal(h.calls.loading, true);
  callbacks[1].success({});
  callbacks[1].fail({});
  h.tick(300);
  assert.equal(h.calls.writes.length, 1);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  h.tick(2000);
  assert.equal(h.calls.navigation.length, 2);
  assert.equal(h.calls.navigation[0].url, '../Bing_page/Bind_fail?bindcode=0&fromManage=1');
  assert.equal(h.calls.navigation[1].kind, 'back');
  assert.equal(h.timers.size, 0);
});

test('first-binding notification failure ends the attempt without sending AT or binding', () => {
  const h = setup({ fromManage: false, notify(options) { options.fail({}); } });
  h.page.btn_start();
  h.tick(1000);
  assert.deepEqual(h.calls.order, ['notify']);
  assert.equal(h.calls.writes.length, 0);
  assert.equal(h.calls.loading, false);
  assert.equal(h.calls.requests.length, 1);
  assert.equal(h.calls.requests[0].url, 'https://example.invalid/unbind');
  assert.match(h.calls.navigation[0].url, /Bind_fail/);
  assert.equal(h.timers.size, 0);
});

test('first binding receives immediate device replies and binds exactly once', () => {
  const h = setup({ fromManage: false, write(options, command) {
    if (command.startsWith('AT+')) {
      assert.equal(h.listeners.size, 1);
      h.emit('OK\r\n');
      h.emit('+QSTASTAT:GOT_IP\r\n');
    }
    options.success({});
  } });
  h.page.btn_start();
  h.tick(300);
  assert.equal(h.calls.loading, false);
  h.tick(500);
  assert.deepEqual(h.calls.order, ['notify', 'listen', 'write', 'write']);
  assert.equal(h.calls.requests.length, 1);
  assert.equal(h.calls.requests[0].url, 'https://example.invalid/bind');
  h.calls.requests[0].success({ statusCode: 200, data: { code: 200 } });
  h.emit('+QSTASTAT:GOT_IP\r\n');
  h.tick(90000);
  assert.equal(h.calls.navigation.length, 1);
  assert.equal(h.calls.navigation[0].kind, 'redirect');
  assert.match(h.calls.navigation[0].url, /Bind_success/);
  assert.equal(h.calls.writes.length, 2);
  assert.equal(h.calls.requests.length, 1);
  assert.equal(h.timers.size, 0);
});

test('registering the first-binding listener never reports fake BLE data or succeeds without GOT_IP', () => {
  const h = setup({ fromManage: false });
  h.page.btn_start();
  assert.equal(h.page.bpDebugLogs.some(log => log.text.includes('蓝牙回包监听已注册')), true);
  assert.equal(h.page.bpDebugLogs.some(log => log.text.includes('接收到蓝牙数据:')), false);
  h.tick(300);
  h.emit('111');
  h.emit('OK\r\n');
  assert.equal(h.calls.loading, true);
  assert.equal(h.calls.requests.length, 0);
  h.tick(45000);
  assert.equal(h.calls.loading, false);
  assert.equal(h.calls.writes.length, 1);
  assert.equal(h.calls.requests.some(r => r.url.endsWith('/bind')), false);
  h.tick(1000);
  assert.match(h.calls.navigation[0].url, /Bind_fail/);
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
});

test('managed Wi-Fi failure opens the failure page once and ignores late success without unbinding', () => {
  const h = setup();
  h.page.btn_start();
  h.tick(300);
  h.emit('ERROR\r\n');
  h.page.handleWifiSetFail();
  h.emit('+QSTASTAT:GOT_IP\r\n');
  h.tick(90000);
  assert.equal(h.calls.navigation.length, 1);
  assert.equal(h.calls.navigation[0].url, '../Bing_page/Bind_fail?bindcode=0&fromManage=1');
  assert.equal(h.calls.requests.length, 0);
  assert.equal(h.calls.writes.length, 1, 'must not write time after failure');
  assert.equal(h.listeners.size, 0);
  assert.equal(h.timers.size, 0);
});

function setupFailurePage(options, routes = []) {
  const script = fs.readFileSync(path.join(__dirname, '../pages/Bind/Bing_page/Bind_fail.vue'), 'utf8')
    .split('<script>')[1].split('</script>')[0].replace('export default', 'module.exports =');
  const calls = [];
  const context = {
    module: { exports: {} }, getCurrentPages: () => routes.map(route => ({ route })),
    uni: {
      navigateBack: options => calls.push({ kind: 'back', ...options }),
      switchTab: options => calls.push({ kind: 'tab', ...options }),
      setNavigationBarTitle: options => calls.push({ kind: 'title', ...options })
    }
  };
  vm.runInNewContext(script, context);
  const component = context.module.exports;
  const page = Object.assign(component.data(), { $t: key => key });
  for (const [key, method] of Object.entries(component.methods)) page[key] = method.bind(page);
  component.onLoad.call(page, options);
  component.onShow.call(page);
  return { page, calls };
}

test('failure page returns past setup pages to either originating device manager', () => {
  for (const manager of ['pages/tabBar/device/Equipment_management', 'pages/tabBar/my/Equipment_management1']) {
    for (const manualBluetoothList of [false, true]) {
      const setupPages = ['pages/Bind/Bing_xueya/Bing_xueya'];
      if (manualBluetoothList) setupPages.push('pages/Bind/Bing_xueya/lanya_wifi');
      setupPages.push('pages/Bind/Bing_xueya/Bing_xueya_2', 'pages/Bind/Bing_page/Bind_fail');
      const h = setupFailurePage({ fromManage: '1', bindcode: '0' }, ['pages/tabBar/main/Main', manager, ...setupPages]);
      assert.equal(h.calls[0].title, '为设备连接WiFi');
      h.page.back();
      assert.deepEqual(h.calls[1], { kind: 'back', delta: setupPages.length });
    }
  }
});

test('managed failure page falls back to the Devices tab when the source page is absent', () => {
  const h = setupFailurePage({ fromManage: '1', bindcode: '0' }, ['pages/Bind/Bing_page/Bind_fail']);
  h.page.back();
  assert.deepEqual(h.calls[1], { kind: 'tab', url: '/pages/tabBar/device/Equipment_management' });
});

test('ordinary binding failure keeps the original account warning and My tab destination', () => {
  for (const fromManage of [undefined, '0']) {
    const h = setupFailurePage({ fromManage, bindcode: '401' });
    assert.equal(h.page.fromManage, false);
    assert.equal(h.page.bindqu, '该设备与其他帐号绑定');
    assert.equal(h.calls[0].title, '绑定设备');
    h.page.back();
    assert.deepEqual(h.calls[1], { kind: 'tab', url: '../../tabBar/my/My' });
  }
});
