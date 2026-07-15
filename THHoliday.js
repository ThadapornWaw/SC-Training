(() => {
  'use strict';

  const API_KEY = 'AIzaSyAqenlKZmlFUaqvJLEOdEMy8G5rSP1PVtc';
  const CALENDAR_ID = 'en.th#holiday@group.v.calendar.google.com';
  const holiday = [];

  // 祝日取得
  const getHoliday = async () => {
    try {
      await gapi.client.init({
        apiKey: API_KEY,
      });
      const response = await gapi.client.request({
        path: `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
      });
      const items = response.result.items;
      items.forEach((element) => holiday.push(element.start.date));
    } catch (err) {
      console.log(err);
    }
  };

  // 編集・追加画面で祝日取得し配列push
  kintone.events.on(['app.record.edit.show', 'app.record.create.show'], () => {
    gapi.load('client', getHoliday);
  });

  // フィールドチェンジ時に祝日判定
  kintone.events.on(['app.record.create.change.Work_date', 'app.record.edit.change.Work_date'], (event) => {
    if (holiday.includes(event.record['Work_date'].value)) {
      event.record['Work_date'].error = 'Selected date is a public holiday.';
    } else {
      event.record['Work_date'].error = null;
    }
    return event;
  });
})();