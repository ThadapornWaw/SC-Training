(() => {
  'use strict';

  console.log('RadioControl Loaded');

  // Create/Edit Screen Open
  kintone.events.on(
    ['app.record.create.show', 'app.record.edit.show'],
    (event) => {

      event.record.Table.value.forEach((row) => {

        row.value.Text.disabled =
          row.value.Radio_button.value === 'Unavailable';

      });

      return event;
    }
  );

  // Radio Button Changed
  kintone.events.on(
    [
      'app.record.create.change.Radio_button',
      'app.record.edit.change.Radio_button'
    ],
    (event) => {

      const row = event.changes.row;

      if (row) {
        row.value.Text.disabled =
          row.value.Radio_button.value === 'Unavailable';
      }

      return event;
    }
  );

})();
