const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));
const originalZone = process.env.TZ;
test.after(() => { if (originalZone === undefined) delete process.env.TZ; else process.env.TZ = originalZone; });

function setup(time, zone = 'Asia/Shanghai') {
  process.env.TZ = zone;
  let now = Date.parse(time);
  const requests = [], navigations = [];
  const context = vm.createContext({
    Date: class extends Date {
      constructor(...args) { super(...(args.length ? args : [now])); }
      static now() { return now; }
    },
    Intl, console: { log() {}, warn() {}, error() {} }, module: { exports: {} },
    mapState: () => ({}), mapMutations: () => ({ setBloodPressureLevel() {} }),
    uni: {
      getStorageSync: key => ({ userid: 'user', token: 'token' }[key] || ''),
      setStorageSync() {}, setNavigationBarTitle() {},
      navigateTo: options => navigations.push(options.url)
    }
  });
  vm.runInContext(read('pages/api/unitls/timezone.js').replace(/\bexport /g, ''), context);
  function load(file) {
    const script = read(file).split('<script>')[1].split('</script>')[0]
      .replace(/^\s*import[\s\S]*?from\s+['"][^'"]+['"];?/gm, '')
      .replace('export default', 'module.exports =');
    vm.runInContext(script, context);
    const component = context.module.exports;
    const page = Object.assign({
      $t: (key, params) => params ? params.date : key, $i18n: { locale: 'zh-CN' },
      $url_APP_IP: '', $refs: { popup: { close() {} } },
      $post: (url, data) => new Promise(resolve => requests.push({ url, data, resolve }))
    }, component.methods);
    Object.assign(page, component.data.call(page));
    for (const [key, get] of Object.entries(component.computed || {})) {
      Object.defineProperty(page, key, { get: () => get.call(page) });
    }
    return { page, show: () => component.onShow.call(page), onLoad: params => component.onLoad.call(page, params) };
  }
  return { load, context, requests, navigations, setTime: time => { now = Date.parse(time); } };
}

const smoothFile = 'pages/tabBar/main/report_all_type/Smooth_BP_Data.vue';
const supplementFile = 'pages/tabBar/tendency/supplement.vue';
const cases = [
  ['2026-10-23T00:00:00+08:00', '2026-10-20', '2026-10-21', '2026-10-22', '10月21日'],
  ['2026-10-23T01:01:00+08:00', '2026-10-20', '2026-10-21', '2026-10-22', '10月21日'],
  ['2026-10-23T06:59:59+08:00', '2026-10-20', '2026-10-21', '2026-10-22', '10月21日'],
  ['2026-10-23T07:00:00+08:00', '2026-10-21', '2026-10-22', '2026-10-23', '10月22日'],
  ['2026-10-23T07:01:00+08:00', '2026-10-21', '2026-10-22', '2026-10-23', '10月22日'],
  ['2027-01-01T06:59:59+08:00', '2026-12-29', '2026-12-30', '2026-12-31', '12月30日'],
  ['2027-01-01T07:00:00+08:00', '2026-12-30', '2026-12-31', '2027-01-01', '12月31日'],
  ['2028-03-01T07:00:00+08:00', '2028-02-28', '2028-02-29', '2028-03-01', '2月29日']
];

for (const [time, start, end, profYmd, tip] of cases) {
  test(`domestic smooth report: ${time} keeps details, request and tip together`, async () => {
    const h = setup(time), s = h.load(smoothFile);
    s.show();
    assert.equal(h.requests[0].data.profDate, profYmd);
    assert.equal(h.requests[0].data.filterVarList, 'JLvFLGvJL01v1W');
    assert.deepEqual(Array.from(s.page.getTargetDateSet()).sort(), [start, end]);
    assert.equal(s.page.dataTipText, tip);
    // Preserve the original full-calendar-day detail range and day/night classification.
    const inside = [start + ' 00:00:00', start + ' 06:00:00', end + ' 21:30:00', end + ' 23:59:59'];
    const times = [h.context.shiftCalendarDay(start, -1) + ' 23:59:59', ...inside, profYmd + ' 00:00:00'];
    h.requests[0].resolve({ code: 200, data: { retVarList: times.map(t => `${t},120,80,70`).join(';') } });
    await flush();
    assert.deepEqual(Array.from(s.page.dataList, row => row.time), inside.reverse().map(t => t.slice(0, 16)));
    assert.equal(s.page.dayCount, 1);
    assert.equal(s.page.nightCount, 3);
    assert.equal(s.page.loading, false);
    s.page.switchTab('day');
    assert.equal(s.page.filteredList.length, 1);
  });

  test(`domestic continuous report: ${time} defaults to the phone date and keeps 07:00 readiness`, () => {
    const h = setup(time), s = h.load(supplementFile);
    assert.equal(s.page.profDate, time.slice(0, 10));
    assert.equal(s.page.getProfDateForNextPage(), profYmd);
    s.page.bindDateChange({ detail: { value: end } });
    assert.equal(s.page.getProfDateForNextPage(), profYmd, 'manually selecting the monitoring day keeps its report date');
  });
}

test('domestic smooth report freezes one request window across 07:00 and refreshes on re-entry', async () => {
  const h = setup('2026-10-23T06:59:59+08:00'), s = h.load(smoothFile);
  s.show();
  h.setTime('2026-10-23T07:00:00+08:00');
  h.requests[0].resolve({ code: 200, data: { retVarList: '2026-10-20 12:00:00,120,80,70;2026-10-22 12:00:00,120,80,70' } });
  await flush();
  assert.deepEqual(Array.from(s.page.dataList, row => row.datePart), ['2026-10-20']);
  assert.equal(s.page.dataTipText, '10月21日');
  s.show();
  assert.equal(h.requests[1].data.profDate, '2026-10-23');
  h.requests[1].resolve({ code: 200, data: { retVarList: '' } });
  await flush();
  assert.equal(s.page.dataTipText, '10月22日');
  assert.equal(s.page.dataList.length, 0);
  assert.equal(h.requests.length, 2, 'no overseas fallback for domestic empty data');
});

test('domestic continuous report preserves historical/future date selection with a 07:00 threshold', () => {
  const h = setup('2026-10-23T06:59:59+08:00'), s = h.load(supplementFile);
  for (const [selected, expected] of [['2026-10-20', '2026-10-21'], ['2026-10-22', '2026-10-22'], ['2026-10-25', '2026-10-25']]) {
    s.page.bindDateChange({ detail: { value: selected } });
    assert.equal(s.page.getProfDateForNextPage(), expected);
    s.show();
    assert.equal(s.page.profDate, selected, 'returning must not overwrite a manually selected date');
  }
  s.page.bindDateChange({ detail: { value: '2026-10-22' } });
  h.setTime('2026-10-23T07:00:00+08:00');
  assert.equal(s.page.getProfDateForNextPage(), '2026-10-23');
});

for (const time of ['2026-10-23T06:59:59+08:00', '2026-10-23T07:00:00+08:00']) {
  test(`continuous report and PDF retain selected periods and use one report date: ${time}`, () => {
    for (const [index1, period] of [['1', '1D'], ['2', '2D'], ['7', '1W'], ['10', '1M']]) {
      const h = setup(time), s = h.load(supplementFile);
      Object.assign(s.page, { index1, time: '06:00', time1: '21:30', select: '否', index: 1, select2: '否', select4: '否' });
      s.page.btn_tuesss();
      const params = Object.fromEntries(new URLSearchParams(h.navigations[0].split('?')[1]));
      const profYmd = time.includes('06:59') ? '2026-10-22' : '2026-10-23';
      assert.equal(params.profDate, profYmd);
      const r = h.load('pages/tabBar/tendency/Report.vue');
      r.onLoad(params);
      assert.equal(r.page.period, period);
      assert.equal(r.page.filterVarList, 'JLvFLGvJL01v' + period);
      r.page.get_retVarList();
      r.page.get_finalRetVarList();
      r.page.sex_yes();
      const pdfParams = Object.fromEntries(new URLSearchParams(h.navigations[1].split('?')[1]));
      const pdf = h.load('pages/tabBar/tendency/dtyulanya.vue');
      pdf.onLoad(pdfParams);
      pdf.page.get_retVarList();
      pdf.page.get_finalRetVarList();
      assert.equal(pdf.page.period, period);
      assert.equal(h.requests.length, 4);
      for (const request of h.requests) assert.equal(request.data.profDate, profYmd + ' 00:00:00');
    }
  });
}

for (const zone of ['America/Los_Angeles', 'Europe/Berlin', 'Asia/Kolkata', 'Asia/Singapore', 'Australia/Perth']) {
  test(`${zone}: smooth and continuous reports retain their existing overseas dates`, async () => {
    for (const clock of ['00:59:59', '01:00:00', '01:01:00', '06:59:59', '07:00:00', '07:01:00']) {
      const h = setup('2026-10-23T' + clock + '+08:00', zone);
      const s = h.load(smoothFile), c = h.load(supplementFile);
      const localToday = h.context.getLocalTimeAllJSON().YMD;
      const early = clock.startsWith('00:');
      const oldFallback = !h.context.isChinaTimezone() && early;
      const oldEnd = oldFallback ? h.context.resolveAbroadMonitorEndYmd() : h.context.shiftCalendarDay(localToday, -1);
      const oldDates = [h.context.shiftCalendarDay(oldEnd, -1), oldEnd];
      s.show();
      assert.equal(s.page.chinaMonitorRange, null);
      assert.equal(h.requests[0].data.profDate, early ? '2026-10-22' : '2026-10-23');
      assert.deepEqual(Array.from(s.page.getTargetDateSet()).sort(), oldDates);
      assert.equal(c.page.profDate, localToday);
      for (const selected of [localToday, '2026-10-22', '2026-10-20', '2026-10-25']) {
        c.page.profDate = selected;
        const next = h.context.shiftCalendarDay(selected, 1);
        const expected = Date.parse('2026-10-23T' + clock + '+08:00') >= Date.parse(next + 'T01:00:00+08:00') ? next : selected;
        assert.equal(c.page.getProfDateForNextPage(), expected);
      }
      h.requests[0].resolve({ code: 200, data: { retVarList: '' } });
      await flush();
      assert.equal(h.requests.length, oldFallback ? 2 : 1);
      if (oldFallback) assert.equal(h.requests[1].data.profDate, '2026-10-21');
    }
  });
}
