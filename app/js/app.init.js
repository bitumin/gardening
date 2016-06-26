//todo: implementar toastr messages
//todo: filter form to db data
//todo: implementar loading spinners within modals
//todo: build up plants stats by date range
//todo: pick date range -> filter plants stats by date range
//todo: update genetics combobox at start app and at adding genetics form any form

//init datatables 
app.s.plantDatatable.DataTable();
app.s.childDatatable.DataTable();
app.l('Datatables initialized');

//init plant stats date range picker
app.s.plantStatsDateRange.daterangepicker({
  locale: {
    format: 'DD/MM/YYYY',
    separator: ' - ',
    applyLabel: 'Aplicar',
    cancelLabel: 'Cancelar',
    weekLabel: 'S',
    customRangeLabel: 'Rango personalizado',
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.months(),
    firstDay: moment.localeData().firstDayOfWeek()
  }
});
app.l('Date-range picker initialized');

app.db.options.count({}, function (err, count) {
  if (count === 0) {
    app.l('Initializing datastores for the first time', 'DB');
    app.db.options.insert({name: 'firstRun', value: false, insertDate: new Date()}, function (err) {
      if (err) { app.l('Unable to insert firstRun doc in options datastore with error: ' + err, 'DB'); }
    });

    app.l('Adding indexes to datastores', 'DB');
    app.db.genetics.ensureIndex({ fieldName: 'name', unique: true }, function (err) {
      if (err) { app.l('Unable to set name fields as an index with unique constraint, with error: ' + err, 'DB'); }
    });

    if (app.c.env === 'dev' || app.c.env === 'development') {
      app.db.runSeeder()
        .then(function () { app.l('Datastores seeded without errors', 'DB'); })
        .catch(function (err) { app.l('Unable to seed datastores, with error: ' + err); })
        .then(app.v.populateLeftMenu)
        .then(app.v.populateGenetics)
        .then(function () {app.l('Views populated with datastores data');})
        .catch(function (err) {app.l('Unable to populate views with datastore data, with error: ' + err);});
    }
  } else {
    app.v.populateLeftMenu()
      .then(app.v.populateGenetics)
      .then(function () {app.l('Views populated with datastores data');})
      .catch(function (err) {app.l('Unable to populate views with datastore data, with error: ' + err);});
  }
});

$(function() {
  //todo: remove splash screen
});

app.l('App initialized', 'DB');
