(() => {
  'use strict';
  console.log('JS Loaded');

  const API_KEY = 'AIzaSyAqenlKZmlFUaqvJLEOdEMy8G5rSP1PVtc';
  const CALENDAR_ID = 'en.th#holiday@group.v.calendar.google.com';
  const holiday = [];
  let isHolidayLoaded = false; // flag เช็คว่าโหลดวันหยุดเสร็จหรือยัง

  // 祝日取得
  const getHoliday = () => {
    gapi.load('client', async () => {
      try {
        await gapi.client.init({
          apiKey: API_KEY,
        });
        const response = await gapi.client.request({
          path: `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
        });
        const items = response.result.items;
        items.forEach((element) => {
          if (element.start && element.start.date) {
            holiday.push(element.start.date);
          }
        });
        isHolidayLoaded = true;
        console.log('Holidays loaded:', holiday);
      } catch (err) {
        console.error('Failed to load holidays:', err);
      }
    });
  };

  // 編集・追加画面で祝日取得し配列push
  kintone.events.on(['app.record.edit.show', 'app.record.create.show'], (event) => {
    getHoliday();
    return event;
  });

  // フィールドチェンジ時に祝日判定
  kintone.events.on(['app.record.create.change.Work_date', 'app.record.edit.change.Work_date'], (event) => {
    const field = event.record['Work_date'];
    if (!field) {
      console.error('Field code "Work_date" not found on record.');
      return event;
    }

    if (!isHolidayLoaded) {
      console.warn('Holiday data not loaded yet — please wait a moment and try again.');
      return event;
    }

    if (holiday.includes(field.value)) {
      field.error = 'Selected date is a public holiday.';
    } else {
      field.error = null;
    }
    return event;
  });
})();
