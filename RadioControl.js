(() => {
  // Start an Arrow Function and execute it immediately
  // Similar to: (function() { ... })();

  'use strict';
  // Enable strict mode to prevent common JavaScript mistakes


  kintone.events.on(
    ['app.record.create.show', 'app.record.edit.show'],
    // Run when Create screen or Edit screen is opened

    (event) => {

      event.record['Table'].value.forEach((row) => {
        // Loop through every row inside the Table field

        row.value['Text'].disabled =
          row.value['Radio_button'].value === 'Unavailable';

        // If Radio_button = '不可'
        // → Text field becomes disabled (cannot type)

        // If Radio_button ≠ '不可'
        // → Text field becomes enabled

      });

      return event;
      // Return the updated record to Kintone

    }
  );


  kintone.events.on(
    ['app.record.create.change.radio', 'app.record.edit.change.radio'],
    // Run when the radio button value changes

    (event) => {

      const isEdit = event.changes.row.value;
      // Get the value of the current row that was changed

      event.changes.row.value['Text'].disabled =
        isEdit === 'Unavailable';

      // If selected value is '不可'
      // → Disable Text field

      // Otherwise
      // → Enable Text field

      return event;
      // Return updated record

    }
  );

})();