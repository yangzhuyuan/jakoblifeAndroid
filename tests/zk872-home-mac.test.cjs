const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../pages/tabBar/main/Main.vue'), 'utf8');
const names = ['resolveZk872BleRows', 'queryDevices', 'aaaa', 'handleDeviceType10And13',
  'geturl_queryDevices', 'connectMultipleDevices'];
const methods = '({' + names.map(name => {
  const match = source.match(new RegExp('\\t\\t\\t(?:async )?' + name + '\\('));
  assert(match, 'Missing actual Main method: ' + name);
  const end = source.indexOf('\n\t\t\t},', match.index);
  return source.slice(match.index, end + '\n\t\t\t}'.length);
}).join(',\n') + '})';
const SN = '1000503100000232';
const MAC = '3C:22:7F:94:F9:1B';
const OLD_UUID = 'A49AF943-6FB6-7054-8DBD-66EC2CFBE13C';
const row = extra => ({ deviceSn: SN, deviceModelId: '10005', deviceTypeId: '10', mac: OLD_UUID, ...extra });
const flush = () => new Promise(resolve => setImmediate(resolve));
const noop = () => {};

function setup({ platform = 'android', cache = { deviceId: MAC, platform: 'android' } } = {}) {
  const storage = new Map([['appQX', '1'], ['deviceList', [OLD_UUID]], ['zk872WifiBle:' + SN, cache]]);
  const calls = { requests: [], connections: [], matched: [], initialized: [], bound: [] };
  const context = { console: { log: noop },
    getDeviceBindingContext: () => ({}), recordBoundDevices: rows => calls.bound.push(rows),
    uni: { getStorageSync: key => storage.get(key), setStorageSync: (key, value) => storage.set(key, value),
      removeStorageSync: key => storage.delete(key), getSystemInfoSync: () => ({ platform }), setBLEMTU: noop,
      getNetworkType: options => options.success({ networkType: 'none' }) }
  };
  const page = Object.assign(vm.runInNewContext(methods, context), {
    queryDevicesDone: true, currentIndex: 0, deviceList: [OLD_UUID],
    $url_APP_IP: '', $url_queryDevices: '/query',
    $post: (url, data) => new Promise((resolve, reject) => calls.requests.push({ url, data, resolve, reject })),
    isEmotionMeasureBusySession: () => false, syncEmotionMeasureBusyFromStorage: noop, dropStaleBpw6Binding: noop,
    isBleReconnectBlocked: () => false, initBluetooth: item => calls.initialized.push(item), queryBloodPressureData: noop,
    shouldDeferBpw1ForceRecover: () => false, hasBpw1NeedGattRecover: () => false,
    getBLEDeviceCharacteristics1: (...args) => calls.matched.push(args),
    getBLEDeviceCharacteristics3: noop, handleDeviceType11: noop, isDeviceBindingPageActive: () => true,
    bluetoothManager: { connectedDevices: {}, async connectDevice(deviceId) {
      calls.connections.push(deviceId);
      this.connectedDevices[deviceId] = { deviceId, services: [{ uuid: 'a' }, { uuid: 'b' }, { uuid: 'wifi-service' }] };
    } }
  });
  return { page, calls, storage, context,
    async query(rows) { page.queryDevices(); calls.requests.at(-1).resolve({ code: 200, rows }); await flush(); }
  };
}

test('server iOS UUID cannot overwrite the scanned Android MAC in home reconnect lists', async () => {
  const h = setup();
  const original = row();
  await h.query([original]);
  assert.equal(h.page.deviceList[0], MAC);
  assert.equal(h.page.devicdsdmac[0], MAC);
  assert.equal(h.calls.initialized[0].mac, MAC);
  assert.equal(h.storage.get('deviceList')[0], MAC);
  assert.equal(h.storage.get('devicdsdmac')[0], MAC);
  assert.equal(h.storage.get('lixianlist')[0].mac, MAC);
  assert.equal(original.mac, OLD_UUID, 'do not mutate the server row shared by other consumers');
  await h.query([row()]);
  assert.equal(h.page.deviceList[0], MAC, 'a later server refresh must not restore the old address');
});

test('the actual home reconnect flow connects the scanned MAC and matches a fresh server row to its SN', async () => {
  const h = setup();
  await h.query([row()]);
  await h.page.connectMultipleDevices(h.page.devicdsdmac);
  assert.deepEqual(h.calls.connections, [MAC]);
  assert.equal(h.calls.requests.at(-1).url, '/query');
  h.calls.requests.at(-1).resolve({ code: 200, rows: [row()] });
  await flush();
  assert.equal(h.page.xeuyejisn, SN);
  assert.equal(h.page.xeuyejimac, MAC);
  assert.deepEqual(h.calls.matched, [[MAC, 'wifi-service', SN]]);
});

test('offline reconnect and offline service matching also replace an old cached server UUID', async () => {
  const h = setup();
  h.storage.set('lixianlist', [row()]);
  h.page.aaaa(h.storage.get('lixianlist'));
  assert.equal(h.page.devicdsdmac[0], MAC);
  assert.equal(h.storage.get('devicdsdmac')[0], MAC);
  await h.page.connectMultipleDevices(h.page.devicdsdmac);
  h.calls.requests.at(-1).reject(Error('offline'));
  await flush();
  assert.deepEqual(h.calls.connections, [MAC]);
  assert.deepEqual(h.calls.matched, [[MAC, 'wifi-service', SN]]);
});

test('other devices keep their own addresses even when a ZK cache key exists for the same SN', async () => {
  const h = setup();
  const others = [
    row({ deviceModelId: '30000', deviceTypeId: '13', mac: 'watch-1' }),
    row({ deviceModelId: '30001', deviceTypeId: '13', mac: 'watch-6' }),
    row({ deviceModelId: '10001', mac: 'bp-68' }),
    row({ deviceModelId: '10002', mac: 'bp-67' }),
    row({ deviceModelId: '20000', deviceTypeId: '11', mac: 'scale' })
  ];
  await h.query([row(), ...others]);
  assert.deepEqual(Array.from(h.page.deviceList), [MAC, 'watch-1', 'watch-6', 'bp-68', 'bp-67']);
  const resolved = h.page.resolveZk872BleRows(others);
  others.forEach((original, index) => assert.equal(resolved[index], original));
});

test('cache selection requires the same SN and platform and a nonempty string address', () => {
  for (const cache of [undefined, null, {}, { deviceId: '', platform: 'android' },
    { deviceId: '  ', platform: 'android' }, { deviceId: 123, platform: 'android' },
    { deviceId: MAC, platform: 'ios' }]) {
    const h = setup();
    h.storage.set('zk872WifiBle:' + SN, cache);
    const original = row();
    assert.equal(h.page.resolveZk872BleRows([original])[0], original);
  }
  const h = setup();
  for (const sn of ['', 'another-sn']) {
    const original = row({ deviceSn: sn });
    assert.equal(h.page.resolveZk872BleRows([original])[0], original);
  }
});

test('no cache or a storage exception retains the existing address and never blocks other devices', () => {
  const h = setup();
  h.context.uni.getStorageSync = () => { throw Error('storage unavailable'); };
  const original = row();
  assert.equal(h.page.resolveZk872BleRows([original])[0], original);
  assert.equal(h.page.resolveZk872BleRows(undefined), undefined);
});

test('iOS retains its own discovered UUID instead of an Android MAC', () => {
  const h = setup({ platform: 'ios', cache: { deviceId: OLD_UUID, platform: 'ios' } });
  assert.equal(h.page.resolveZk872BleRows([row({ mac: MAC })])[0].mac, OLD_UUID);
});

test('a missing server MAC uses a confirmed local address without dropping account binding state', async () => {
  const h = setup();
  h.storage.set('appQX', '0');
  await h.query([row({ mac: null })]);
  assert.equal(h.page.deviceList[0], MAC);
  assert.equal(h.calls.bound[0][0].mac, null, 'binding eligibility still sees the original complete server list');
  assert.equal(h.calls.initialized.length, 0, 'permission-off behavior is retained');
});
