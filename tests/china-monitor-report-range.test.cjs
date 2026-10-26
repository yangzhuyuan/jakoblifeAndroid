const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));
const originalZone = process.env.TZ;
test.after(() => { if (originalZone === undefined) delete process.env.TZ; else process.env.TZ = originalZone; });

function setup(days, time, zone = 'Asia/Shanghai') {
  process.env.TZ = zone;
  let now = Date.parse(time);
  const requests = [];
  const context = vm.createContext({
    Date: class extends Date {
      constructor(...args) { super(...(args.length ? args : [now])); }
      static now() { return now; }
    },
    Intl, console: { log() {}, warn() {}, error() {} }, module: { exports: {} },
    uni: { getStorageSync: key => ({ userid: 'user', token: 'token' }[key] || ''), setNavigationBarTitle() {} }
  });
  vm.runInContext(read('pages/api/unitls/timezone.js').replace(/\bexport /g, ''), context);
  const file = days === 1 ? 'hour_monitoring_report_24.vue' : 'day_monitoring_report_7.vue';
  const script = read('pages/tabBar/main/globalweather/' + file).split('<script>')[1].split('</script>')[0]
    .replace(/^\s*import[\s\S]*?from\s+['"][^'"]+['"];?/gm, '')
    .replace('export default', 'module.exports =');
  vm.runInContext(script, context);
  const component = context.module.exports;
  const page = Object.assign(component.data.call({ $t: value => value }), component.methods, {
    $t: value => value, $url_APP_IP: '', $url_get_trend_data: '/trend', $url_query_month_avg: '/average',
    $post: (url, data) => new Promise(resolve => requests.push({ url, data, resolve }))
  });
  return { page, context, requests, show: () => component.onShow.call(page),
    setTime: time => { now = Date.parse(time); } };
}

for (const days of [1, 7]) {
  for (const [time, end, start, profYmd] of [
    ['2026-10-23T00:00:00+08:00', '2026-10-21', days === 1 ? '2026-10-20' : '2026-10-15', '2026-10-22'],
    ['2026-10-23T06:59:59+08:00', '2026-10-21', days === 1 ? '2026-10-20' : '2026-10-15', '2026-10-22'],
    ['2026-10-23T07:00:00+08:00', '2026-10-22', days === 1 ? '2026-10-21' : '2026-10-16', '2026-10-23'],
    ['2026-10-23T07:01:00+08:00', '2026-10-22', days === 1 ? '2026-10-21' : '2026-10-16', '2026-10-23'],
    ['2026-10-23T23:59:59+08:00', '2026-10-22', days === 1 ? '2026-10-21' : '2026-10-16', '2026-10-23'],
    ['2027-01-01T06:59:59+08:00', '2026-12-30', days === 1 ? '2026-12-29' : '2026-12-24', '2026-12-31'],
    ['2027-01-01T07:00:00+08:00', '2026-12-31', days === 1 ? '2026-12-30' : '2026-12-25', '2027-01-01'],
    ['2028-03-01T07:00:00+08:00', '2028-02-29', days === 1 ? '2028-02-28' : '2028-02-23', '2028-03-01']
  ]) {
    test(`${days}d China: ${time} keeps display and requests on the same completed period`, async () => {
      const h = setup(days, time);
      h.show();
      assert.equal(h.page.monitorInfo.startTime, start + (days === 1 ? ' 06:00:00' : ' 08:00:00'));
      assert.equal(h.page.monitorInfo.endTime, end + (days === 1 ? ' 06:00:00' : ' 21:05:00'));
      assert.equal(h.requests[0].data.profDate, profYmd + ' 00:00:00', 'API uses the report date, not the monitoring end date');
      assert.equal(h.requests[0].data.filterVarList, days === 1 ? 'JLvFLGvJL01v2D' : 'JLvFLGvJL01v1W');
      for (const request of h.requests.slice(1)) {
        assert.equal(request.data.startTime, h.page.monitorInfo.startTime);
        assert.equal(request.data.endTime, h.page.monitorInfo.endTime);
      }
      // Backend rows outside the displayed window must not enter details/statistics.
      const times = days === 1 ?
        [start + ' 05:59:59', start + ' 06:00:00', end + ' 05:59:59', end + ' 06:00:00', end + ' 06:00:01'] :
        [h.context.shiftCalendarDay(start, -1) + ' 23:59:59', start + ' 08:00:00', end + ' 08:00:00', end + ' 21:05:00', h.context.shiftCalendarDay(end, 1) + ' 00:00:00'];
      h.requests[0].resolve({ code: 200, data: { retVarList: times.map(t => `${t},120,80,70`).join(';') } });
      await flush();
      assert.deepEqual(Array.from(h.page.monitorData, row => row.fullTime), times.slice(1, 4));
      assert.equal(h.page.stats.totalCount, 3);
      if (days === 1) assert.equal(h.requests[1].data.profDate, profYmd + ' 00:00:00', 'summary follows detail profDate');
    });
  }

  test(`${days}d China: crossing 07:00 cannot split one request batch; returning refreshes it`, async () => {
    const h = setup(days, '2026-10-23T06:59:59+08:00');
    h.page.calculateTimeRange();
    h.setTime('2026-10-23T07:00:00+08:00');
    h.page.get_retVarList();
    assert.equal(h.requests[0].data.profDate, '2026-10-22 00:00:00');
    h.requests[0].resolve({ code: 200, data: { retVarList: '' } });
    await flush();
    assert.equal(h.requests.length, days === 1 ? 2 : 1, 'domestic empty data must not trigger overseas fallback');
    if (days === 1) assert.equal(h.requests[1].data.profDate, '2026-10-22 00:00:00');
    h.show();
    assert.equal(h.page.monitorInfo.endTime, '2026-10-22' + (days === 1 ? ' 06:00:00' : ' 21:05:00'));
    assert.equal(h.requests.findLast(r => r.url.endsWith('/get_retVarList')).data.profDate, '2026-10-23 00:00:00');
  });

  for (const [zone, start, end] of [
    ['America/Los_Angeles', days === 1 ? '2026-10-21' : '2026-10-16', '2026-10-22'],
    ['Europe/Berlin', days === 1 ? '2026-10-21' : '2026-10-16', '2026-10-22'],
    ['Asia/Kolkata', days === 1 ? '2026-10-21' : '2026-10-16', '2026-10-22'],
    ['Asia/Singapore', days === 1 ? '2026-10-22' : '2026-10-17', '2026-10-23'],
    ['Australia/Perth', days === 1 ? '2026-10-22' : '2026-10-17', '2026-10-23']
  ]) {
    test(`${days}d ${zone}: existing dates, hours and profDate remain unchanged`, () => {
      const h = setup(days, '2026-10-23T06:59:59+08:00', zone);
      h.show();
      assert.equal(h.page.chinaMonitorRange, null);
      assert.equal(h.page.monitorInfo.startTime, start + (days === 1 ? ' 06:00:00' : ' 08:00:00'));
      assert.equal(h.page.monitorInfo.endTime, end + (days === 1 ? ' 06:00:00' : ' 21:05:00'));
      assert.equal(h.requests[0].data.profDate, '2026-10-23 00:00:00');
    });
  }

  test(`${days}d overseas: the existing empty-report fallback still uses the previous profDate`, async () => {
    const h = setup(days, '2026-10-23T00:30:00+08:00', 'America/Los_Angeles');
    h.show();
    assert.equal(h.requests[0].data.profDate, '2026-10-22 00:00:00');
    h.requests[0].resolve({ code: 200, data: { retVarList: '' } });
    await flush();
    assert.equal(h.requests.at(-1).data.profDate, '2026-10-21 00:00:00');
  });
}

test('the shared ready-date rule for other reports still switches at 01:00', () => {
  const h = setup(1, '2026-10-23T06:59:59+08:00');
  assert.equal(h.context.resolveReportProfYmd(), '2026-10-23');
  h.setTime('2026-10-23T00:59:59+08:00');
  assert.equal(h.context.resolveReportProfYmd(), '2026-10-22');
  h.setTime('2026-10-23T01:00:00+08:00');
  assert.equal(h.context.resolveReportProfYmd(), '2026-10-23');
});
