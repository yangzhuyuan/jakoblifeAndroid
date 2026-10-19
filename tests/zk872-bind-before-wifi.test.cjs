const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));

// Reuse the existing BLE and Wi-Fi simulators without registering their test cases.
function loadSetup(file) {
  const source = read(file);
  const context = { require, Buffer, __dirname, setImmediate, module: { exports: {} } };
  vm.runInNewContext(source.slice(0, source.indexOf('\ntest(')) + '\nmodule.exports = setup;', context);
  return context.module.exports;
}
const setupBle = loadSetup('tests/zk872-auto-connect.test.cjs');
const setupWifi = loadSetup('tests/wifi-provisioning.test.cjs');

function setupScan(options = {}) {
  const calls = { queries: [], requests: [], navigation: [], toasts: [], loading: false, order: [] };
  const api = {
    getLocale: () => 'zh-Hans', getSystemInfoSync: () => ({ platform: 'android' }),
    getStorageSync: () => 'test-token', setStorageSync() {}, $emit() {},
    showLoading() { calls.loading = true; },
    hideLoading() { calls.loading = false; calls.order.push('hide'); },
    showToast(o) { calls.toasts.push(o.title); calls.order.push('toast'); },
    navigateTo(o) { calls.navigation.push(o.url); component.onHide.call(page); },
    switchTab(o) { calls.navigation.push(o.url); },
    request(o) {
      const task = { abort() { o.fail({ errMsg: 'abort' }); o.complete(); } };
      calls.requests.push({ ...o, task });
      return task;
    }
  };
  const context = {
    module: { exports: {} }, uni: api, mapMutations: () => ({}), appScan: {}, u16proBLE: {},
    console: { log() {} }, setTimeout: fn => fn()
  };
  vm.runInNewContext(read('pages/api/zk872WifiConnection.js').replace(/export function /g, 'function ') +
    '\nmodule.exports = { isZk872WifiModel };', context);
  Object.assign(context, context.module.exports);
  const source = read('pages/Bind/Bing_page/Bind_page_2.vue').split('<script>')[1].split('</script>')[0]
    .replace(/import[\s\S]*?from\s+'[^']+';?/g, '').replace('export default', 'module.exports =');
  vm.runInNewContext(source, context);
  const component = context.module.exports;
  const page = Object.assign(component.data.call({ $t: key => key }), {
    $t: key => key, $url_APP_IP: 'https://example.invalid', $url_queryDevices: '/query', $url_bind_device: '/bind',
    modelId: '10005', modelname: 'ZK-B872', modelConnectType: '2', SELECT_TYPE: '0',
    context_msg: 'SN:test-sn', context_msg1: 'test-sn', wifiDeviceId: '', ...options
  });
  for (const [name, method] of Object.entries(component.methods)) page[name] = method.bind(page);
  page.$post = (url, data, header) => new Promise((resolve, reject) => calls.queries.push({ url, data, header, resolve, reject }));
  page.cleanup = () => {};
  return { page, calls, api,
    hide() { component.onHide.call(page); },
    unload() { component.onUnload.call(page); },
    async confirm(rows = []) {
      page.True_Bind();
      calls.queries.at(-1).resolve({ code: 200, rows });
      await flush();
    },
    reply(code, statusCode = 200, extra = {}, index = calls.requests.length - 1) {
      const request = calls.requests[index];
      request.success({ statusCode, data: { code, ...extra } });
      request.complete();
    }
  };
}

test('scanning alone does not bind; confirm checks the current account before sending the scanned SN', async () => {
  const h = setupScan();
  h.page.updateScanImage = () => {};
  h.page.handleDeviceInfoResponse({ code: 200, data: { model: 'ZK-B872', modelId: '10005', deviceSn: 'fresh-sn', mac: 'AA:BB:CC:DD:EE:FF' } });
  assert.equal(h.calls.requests.length, 0);
  assert.equal(h.calls.queries.length, 0);
  await h.confirm();
  assert.equal(h.calls.queries[0].url, 'https://example.invalid/query');
  assert.equal(h.calls.requests[0].url, 'https://example.invalid/bind');
  assert.equal(h.calls.requests[0].data.deviceSn, 'fresh-sn');
  assert.equal(h.calls.requests[0].data.mac, 'AA:BB:CC:DD:EE:FF');
  assert.equal(h.calls.requests[0].timeout, 15000);
  assert.equal(h.calls.navigation.length, 0);
});

for (const code of [401, '401']) {
  test(`another account business code ${JSON.stringify(code)} stops before BLE/Wi-Fi and leaves the warning visible`, async () => {
    const h = setupScan();
    await h.confirm([{ deviceSn: 'different-device' }]);
    h.reply(code);
    assert.deepEqual(h.calls.toasts, ['此设备已被其他账号绑定']);
    assert.deepEqual(h.calls.order, ['hide', 'toast']);
    assert.equal(h.calls.navigation.length, 0);
    assert.equal(h.calls.requests.length, 1);
    assert.equal(h.page.zkBoundSn, '');
    assert.equal(h.page.zkBinding, false);
    assert.equal(h.calls.loading, false);
  });
}

test('success forwards the bound marker once and repeated taps cannot bind twice', async () => {
  const h = setupScan();
  await h.confirm();
  h.page.True_Bind();
  h.page.navigateToBind('10005');
  assert.equal(h.calls.queries.length, 1);
  assert.equal(h.calls.requests.length, 1);
  h.reply('200');
  const url = new URL(h.calls.navigation[0], 'https://example.invalid');
  assert.equal(url.searchParams.get('zkAccountBound'), '1');
  assert.equal(url.searchParams.get('sn'), 'test-sn');
  assert.equal(h.page.zkBoundSn, 'test-sn');
  h.calls.requests[0].success({ statusCode: 200, data: { code: 200 } });
  assert.equal(h.calls.navigation.length, 1);
});

test('already bound to the current account keeps the original warning and never submits binding', async () => {
  const h = setupScan();
  await h.confirm([{ deviceSn: 'test-sn' }]);
  assert.deepEqual(h.calls.toasts, ['当前主页面已绑定该设备']);
  assert.equal(h.calls.requests.length, 0);
  assert.deepEqual(h.calls.navigation, ['/pages/tabBar/main/Main']);
});

test('returning to this scan page resumes its successful binding; an unbound device submits a fresh request', async () => {
  const h = setupScan();
  await h.confirm();
  h.reply(200);
  h.page.zkBindPageActive = true;
  await h.confirm([{ deviceSn: 'test-sn' }]);
  assert.equal(h.calls.requests.length, 1);
  assert.equal(h.calls.navigation.length, 2);
  h.page.zkBindPageActive = true;
  await h.confirm([]);
  assert.equal(h.calls.requests.length, 2);
  assert.equal(h.page.zkBoundSn, '');
});

test('all existing non-ZK and non-Wi-Fi dispatches keep their original paths', async () => {
  for (const [modelId, modelname, type, expected] of [
    ['10001', 'JL-BP68W', '2', 'Bing_xueya?'],
    ['10002', 'JL-BP67W', '2', 'Bing_xueya?'],
    ['20000', 'JL-S260', '2', 'Bing_xueya?'],
    ['10005', 'ZK-B872', '1', 'Bing_xueya_LY?'],
    ['30000', 'BPW1', '1', 'BPW1'], ['30001', 'BPW6', '1', 'BPW6'],
    ['10000', '4G', '0', 'direct']
  ]) {
    const h = setupScan({ modelId, modelname, modelConnectType: type });
    h.page.bindBPW1Device = () => h.calls.navigation.push('BPW1');
    h.page.bindBPW6Device = () => h.calls.navigation.push('BPW6');
    h.page.bindDeviceDirectly = () => h.calls.navigation.push('direct');
    await h.confirm();
    assert(h.calls.navigation[0].includes(expected), modelname);
    assert.equal(h.calls.requests.length, 0, modelname);
    assert.equal(h.calls.navigation[0].includes('zkAccountBound'), false, modelname);
  }
});

test('missing QR and failed own-device query never start binding', async () => {
  const missing = setupScan({ context_msg: '请将条码放入扫码框内即可自动扫描' });
  missing.page.True_Bind();
  assert.deepEqual(missing.calls.toasts, ['请扫描设备的设备码']);
  assert.equal(missing.calls.queries.length, 0);
  const h = setupScan();
  h.page.True_Bind();
  h.calls.queries[0].resolve({ code: 500, msg: 'query failed' });
  await flush();
  assert.deepEqual(h.calls.toasts, ['query failed']);
  assert.equal(h.calls.requests.length, 0);
});

test('HTTP errors, network failure and other business failures do not falsely claim account ownership', async () => {
  for (const kind of ['http401', 'network', 'business', 'throw']) {
    const h = setupScan();
    if (kind === 'throw') h.api.request = () => { throw Error('request unavailable'); };
    await h.confirm();
    if (kind === 'http401') h.reply(401, 401);
    if (kind === 'business') h.reply(500, 200, { msg: 'server failure' });
    if (kind === 'network') { h.calls.requests[0].fail({ errMsg: 'timeout' }); h.calls.requests[0].complete(); }
    assert.equal(h.calls.navigation.length, 0, kind);
    assert.equal(h.calls.toasts.includes('此设备已被其他账号绑定'), false, kind);
    assert.equal(h.page.zkBinding, false, kind);
    assert.equal(h.calls.loading, false, kind);
  }
});

test('leaving or changing the scanned SN cannot let a late response open the wrong device', async () => {
  for (const action of ['unload', 'hide', 'change']) {
    const h = setupScan();
    await h.confirm();
    if (action === 'unload') h.unload();
    if (action === 'hide') h.hide();
    if (action === 'change') h.page.context_msg1 = 'new-sn';
    h.reply(200);
    assert.equal(h.calls.navigation.length, 0, action);
    assert.equal(h.calls.toasts.length, 0, action);
  }
});

test('first binding still discovers the current BLE address and forwards the account marker to Wi-Fi', async () => {
  const h = setupBle({ devices: [{ name: 'ZK-B872', deviceId: 'AA:BB:CC:DD:EE:FF' }],
    route: { zkAccountBound: '1', deviceId: 'old-ios-uuid' } });
  const promise = h.start();
  await h.tick(11000);
  await promise;
  assert.equal(h.calls.connects[0].deviceId, 'AA:BB:CC:DD:EE:FF');
  const params = new URL(h.calls.navigation[0], 'https://example.invalid').searchParams;
  assert.equal(params.get('zkAccountBound'), '1');
  assert.equal(params.get('deviceId'), 'AA:BB:CC:DD:EE:FF');
  assert.equal(h.storage.get('zk872WifiBle:test-sn').deviceId, 'AA:BB:CC:DD:EE:FF');
  const manageAgain = setupBle({ devices: [], route: { fromManage: '1', deviceId: 'old-ios-uuid' },
    overrides: { getStorageSync: key => h.storage.get(key) } });
  const reconnect = manageAgain.start();
  await manageAgain.tick(3000);
  await reconnect;
  assert.equal(manageAgain.calls.connects[0].deviceId, 'AA:BB:CC:DD:EE:FF');
  assert.equal(manageAgain.calls.scans, 0);
  const manage = setupBle({ route: { fromManage: '1', zkAccountBound: '1' } });
  assert.equal(manage.page.zkAccountBound, false);
  const other = setupBle({ route: { modelId: '10001', modelname: 'JL-BP68W', zkAccountBound: '1' } });
  assert.equal(other.page.zkAccountBound, false);
});

test('cached ZK address is ignored for another SN, another platform and fresh first binding', async () => {
  for (const mode of ['different-sn', 'different-platform', 'first-binding']) {
    const route = { fromManage: '1', deviceId: 'passed-device' };
    if (mode === 'different-sn') route.sn = 'another-sn';
    if (mode === 'first-binding') route.fromManage = '0';
    const h = setupBle({ route, overrides: {
      getStorageSync: key => key === 'zk872WifiBle:test-sn'
        ? { deviceId: 'cached-device', platform: mode === 'different-platform' ? 'ios' : 'android' } : undefined
    } });
    const pending = h.start();
    await h.tick(11000);
    await pending;
    assert.equal(h.calls.connects[0].deviceId, mode === 'first-binding' ? 'zk-device' : 'passed-device', mode);
  }
});

function provisionBoundWifi() {
  const h = setupWifi({ fromManage: false });
  h.page.zkAccountBound = true;
  h.page.$url_queryDevices = '/query';
  h.page.btn_start();
  h.tick(300);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  h.tick(500);
  assert.equal(h.calls.requests[0].url, 'https://example.invalid/query');
  return h;
}

test('Wi-Fi success verifies the account and opens success without a second bind or unbind', () => {
  const h = provisionBoundWifi();
  h.calls.requests[0].success({ statusCode: 200, data: { code: 200, rows: [{ deviceSn: 'test-sn' }] } });
  assert.equal(h.calls.requests.length, 1);
  assert.match(h.calls.navigation[0].url, /Bind_success/);
  assert.equal(h.page.wifiConnecting, false);
  assert.equal(h.calls.writes.length, 2, 'AT and time sync are retained');
});

test('a stale bound marker after rollback uses normal binding with the current scanned MAC', () => {
  const h = provisionBoundWifi();
  h.calls.requests[0].success({ statusCode: 200, data: { code: 200, rows: [] } });
  assert.equal(h.calls.requests[1].url, 'https://example.invalid/bind');
  assert.equal(h.calls.requests[1].data.mac, 'test-device');
  assert.equal(h.page.zkAccountBound, false);
  h.calls.requests[1].success({ statusCode: 200, data: { code: 200 } });
  assert.match(h.calls.navigation[0].url, /Bind_success/);
});

test('query failure is retryable without sending another Wi-Fi command or falsely reporting occupied', () => {
  const h = provisionBoundWifi();
  h.calls.requests[0].success({ statusCode: 200, data: { code: 401 } });
  assert.equal(h.calls.navigation.length, 0);
  assert.equal(h.calls.toasts[0].title, '网络连接失败');
  h.page.btn_start();
  assert.equal(h.calls.requests[1].url, 'https://example.invalid/query');
  assert.equal(h.calls.writes.length, 2);
  h.calls.requests[1].success({ statusCode: 200, data: { code: 200, rows: [{ deviceSn: 'test-sn' }] } });
  assert.match(h.calls.navigation[0].url, /Bind_success/);
});

test('failed first-time provisioning keeps the existing rollback and clears the early-binding marker', () => {
  const h = setupWifi({ fromManage: false });
  h.page.zkAccountBound = true;
  h.page.btn_start();
  h.tick(300);
  h.emit('ERROR\r\n');
  h.tick(1100);
  assert.equal(h.page.zkAccountBound, false);
  assert.equal(h.calls.requests.length, 1);
  assert.equal(h.calls.requests[0].url, 'https://example.invalid/unbind');
  assert.match(h.calls.navigation[0].url, /Bind_fail\?bindcode=0/);
});

test('device-management Wi-Fi ignores the account marker and keeps its return-without-binding behavior', () => {
  const h = setupWifi();
  h.load({ fromManage: '1', zkAccountBound: '1', sn: 'test-sn', deviceId: 'test-device', serviceId: 'test-service', uuid: 'test-write', notifyuuid: 'test-notify' });
  assert.equal(h.page.zkAccountBound, false);
  h.page.btn_start();
  h.tick(1000);
  h.emit('+QSTASTAT:GOT_IP\r\n');
  h.tick(1500);
  assert.equal(h.calls.requests.length, 0);
  assert.equal(h.calls.navigation[0].kind, 'back');
});
