const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const manualFields = ['xiongwei', 'yaowei', 'tunwei', 'shangtunwei', 'datuiwei', 'xiaotuiwei'];
const rulerFields = ['xw_value', 'yw_value', 'tw_value', 'stw_value', 'dtw_value', 'xtw_value'];
const payloadFields = ['chest_circumference', 'waistline', 'hipline',
  'biceps_circumference', 'thigh_circumference', 'calf_circumference'];

function setup(weightUnit = 0, heightUnit = 1) {
  const storage = new Map([['danwei2', weightUnit], ['danwei1', heightUnit]]);
  const requests = [], listeners = new Map();
  const context = vm.createContext({
    module: { exports: {} }, console: { log() {} },
    mapState: () => ({}), mapMutations: () => ({}),
    setTimeout: () => 1, clearTimeout() {},
    uni: {
      getStorageSync: key => storage.has(key) ? storage.get(key) : '',
      getSystemInfoSync: () => ({ windowWidth: 375 }),
      $on: (event, fn) => listeners.set(event, fn), $off() {},
      request: options => requests.push(options), showToast() {}
    }
  });
  vm.runInContext(read('pages/api/unitls/weightConverter.js').replace('export default WeightConverter;', ''), context);
  const script = read('pages/tabBar/tendency/Tendency.vue').split('<script>')[1].split('</script>')[0]
    .replace(/^\s*import[\s\S]*?from\s+['"][^'"]+['"];?/gm, '')
    .replace('export default', 'module.exports =');
  vm.runInContext(script, context);
  const component = context.module.exports;
  const popup = { open() {}, close() {} };
  const page = {
    $t: key => key, $nextTick: fn => fn(),
    $refs: { tizhong_popup: popup, tihzi_popup_hd: popup, tihzi_popup_sd: popup },
    $url_APP_IP: 'mock-server', $url_fat_scale: '/fat-scale',
    $post: (url, data) => { requests.push({ url, data }); return new Promise(() => {}); }
  };
  for (const [key, fn] of Object.entries(component.methods)) page[key] = fn.bind(page);
  Object.assign(page, component.data.call(page));
  for (const [key, get] of Object.entries(component.computed)) {
    Object.defineProperty(page, key, { get: () => get.call(page) });
  }
  component.onLoad.call(page);
  page.syncUnitSettings();
  return { page, requests, storage, context, changeUnits: () => listeners.get('UNIT_SETTINGS_CHANGED')() };
}

test('metric input keeps the original kg/cm payloads and chosen dates', () => {
  const { page, requests } = setup();
  page.tizhong = '70.5';
  page.birthday2 = '2026-10-20';
  page.jitizhong_tc();
  assert.equal(requests[0].data.slaveData.weight, '70.5');
  assert.equal(requests[0].data.time, Date.parse('2026-10-20') / 1000);
  assert.equal(page.newweightKG, '千克');
  assert.equal(page.circumferenceUnit, 'cm');
  for (const fields of [manualFields, rulerFields]) {
    fields.forEach((field, index) => { page[field] = String(100 + index); });
  }
  page.popup_sd();
  page.select_ruler();
  for (const request of requests.slice(1)) {
    assert.deepEqual(payloadFields.map(key => request.data.slaveData[key]), ['100', '101', '102', '103', '104', '105']);
    assert.equal(request.data.slaveSn, '1');
  }
});

for (const [weightUnit, heightUnit] of [[1, 0], ['1', '0']]) {
  test(`imperial input saves kg/cm for both manual and ruler entry (${typeof weightUnit} settings)`, () => {
    const { page, requests } = setup(weightUnit, heightUnit);
    page.tizhong = '154.32';
    page.jitizhong_tc();
    assert.equal(requests[0].data.slaveData.weight, 70);
    assert.equal(page.newweightKG, '英镑');
    assert.equal(page.circumferenceUnit, 'inch');
    for (const fields of [manualFields, rulerFields]) {
      fields.forEach((field, index) => { page[field] = ['40', '30', '36', '12', '20', '10'][index]; });
    }
    page.popup_sd();
    page.select_ruler();
    for (const request of requests.slice(1)) {
      assert.deepEqual(payloadFields.map(key => request.data.slaveData[key]), [101.6, 76.2, 91.4, 30.5, 50.8, 25.4]);
    }
    assert.equal(page.tizhong, '154.32', 'submitting must not convert the editable value again');
    assert.equal(page.xw_value, '40');
  });
}

test('settings changes convert unfinished entries once and preserve empty fields', () => {
  const { page, storage, changeUnits } = setup();
  page.tizhong = '70';
  manualFields.concat(rulerFields).forEach(field => { page[field] = '101.6'; });
  page.xiaotuiwei = '';
  page.xtw_value = 0;
  storage.set('danwei2', '1');
  storage.set('danwei1', '0');
  changeUnits();
  assert.equal(page.tizhong, 154.32);
  assert.equal(page.xiongwei, 40);
  assert.equal(page.xw_value, 40);
  assert.equal(page.xiaotuiwei, '');
  assert.equal(page.xtw_value, 0);
  changeUnits();
  assert.equal(page.tizhong, 154.32);
  assert.equal(page.xw_value, 40);
  storage.set('danwei2', 0);
  storage.set('danwei1', 1);
  changeUnits();
  assert.equal(page.tizhong, 70);
  assert.equal(page.xiongwei, 101.6);
  assert.equal(page.xw_value, 101.6);
});

test('opening the popups refreshes units even without a settings event', () => {
  const { page, storage } = setup();
  page.tizhong = '70';
  storage.set('danwei2', 1);
  page.Keep();
  assert.equal(page.newweightKG, '英镑');
  assert.equal(page.tizhong, 154.32);
  page.xw_value = '101.6';
  storage.set('danwei1', 0);
  page.Body_circumference();
  page.onTihziPopupHdChange({ show: true });
  assert.equal(page.circumferenceUnit, 'inch');
  assert.equal(page.xw_value, '40.0');
  assert.equal(page.yw_value, '39.4', 'default ruler position represents about 100 cm');
  assert.equal(page.circumferenceRulerValue(page.xw_value), 400);
  assert.equal(page.circumferenceRulerMax, 591);
});

test('the ruler emits the displayed inches and submission converts them to cm', () => {
  const { page, context, requests } = setup(1, 0);
  page.onTihziPopupHdChange({ show: true });
  vm.runInContext(read('components/select-ruler/select-ruler.vue').split('<script>')[1].split('</script>')[0]
    .replace('export default', 'module.exports ='), context);
  const component = context.module.exports;
  const ruler = Object.assign({ min: 0, max: page.circumferenceRulerMax, multiple: 10, point: 1,
    defaultValue: page.circumferenceRulerValue(page.xw_value), $emit: (event, value) => page.xw_handleChange(value)
  }, component.data(), component.methods);
  component.created.call(ruler);
  assert.equal(ruler.number, 394);
  ruler.handleScroll({ detail: { scrollLeft: 2000 } });
  assert.equal(page.xw_value, '40.0');
  page.select_ruler();
  assert.equal(requests[0].data.slaveData.chest_circumference, 101.6);
  page.onTihziPopupHdChange({ show: false });
  page.onTihziPopupHdChange({ show: true });
  assert.equal(page.circumferenceRulerValue(page.xw_value), 400);
});
