//todo: implementar toastr messages
//todo: filter form to db data
//todo: implementar loading spinners within modals
//todo: build up plants stats by date range
//todo: pick date range -> filter plants stats by date range
//todo: update genetics combobox at start app and at adding genetics form any form

//init datatables 
app.s.plantChildrenDatatable = app.s.plantChildrenTable.DataTable({
  "autoFill": true,
  "colReorder": true,
  "responsive": {
    "details": {
      "type": 'column' //first column displays "show more" control element
    }
  },
  "columnDefs": [
    {
      "render": function (data, type, row) { return app.formatDate(data); },
      "targets": [1,2]
    }
  ],
  "columns": [
    {
      "className": 'control',
      "orderable": false,
      "data": null,
      "defaultContent":
        '<span class="fa-stack btn-details-child">' +
          '<i class="fa fa-square fa-stack-2x"></i>' +
          '<i class="fa fa-info fa-stack-1x fa-inverse"></i>' +
        '</span>'
    },
    { "data": 'Fecha entrada' },
    { "data": 'Fecha salida' },
    { "data": 'Altura entrada' },
    { "data": 'Altura salida' },
    { "data": 'Calidad entrada' },
    { "data": 'Calidad salida' },
    { "data": 'Sala' },
    { "data": 'Producción' },
    { 
      "data": 'Defectos',
      "orderable": false,
      "searchable": false,
      "className": 'none' //this column is always hidden and it will be shown within a child row instead
    },
    { 
      "data": 'Comentarios',
      "orderable": false,
      "searchable": false,
      "className": 'none' //this column is always hidden and it will be shown within a child row instead
    },
    {
      "orderable": false,
      "searchable": false,
      "data": null,
      "defaultContent":
        '<span class="fa-stack btn-edit-child">' +
          '<i class="fa fa-square fa-stack-2x"></i>' +
          '<i class="fa fa-pencil fa-stack-1x fa-inverse"></i>' +
        '</span>'
    },
    {
      "orderable": false,
      "searchable": false,
      "data": null,
      "defaultContent":
        '<span class="fa-stack btn-delete-child">' +
          '<i class="fa fa-square fa-stack-2x"></i>' +
          '<i class="fa fa-times fa-stack-1x fa-inverse"></i>' +
        '</span>'
    }
  ],
  'order': [[1, 'desc']]
});
// app.s.childDatatable.DataTable();
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
