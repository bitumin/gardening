//todo: implementar toastr messages
//todo: filter form to db data
//todo: implementar loading spinners within modals
//todo: build up plants stats by date range
//todo: pick date range -> filter plants stats by date range
//todo: update genetics combobox at start app and at adding genetics form any form

$.fn.serializeObject = function() {var o = {};var a = this.serializeArray();$.each(a, function() {if (o[this.name] !== undefined) {if (!o[this.name].push) {o[this.name] = [o[this.name]];}o[this.name].push(this.value || '');} else {o[this.name] = this.value || '';}});return o;};
moment.locale('es');

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
      "render": function (data, type, row) { return data !== null ? moment(data).format("DD/MM/YYYY") : ""; },
      "targets": [2,3] //format date columns
    },
    {
      "render": function (data, type, row) { return "<span class='uuid'>" + data + "</span>"; },
      "visible": function() { return app.config.env !== 'dev'; },
      "searchable": false,
      "targets": [1] //hide uuid column
    },
    {
      "render": function (data, type, row) { 
        return '<span class="fa-stack btn-open-edit-child-modal" child-uuid="' + data + '">' +
          '<i class="fa fa-square fa-stack-2x"></i>' +
          '<i class="fa fa-pencil fa-stack-1x fa-inverse"></i>' +
        '</span>';
      },
      "searchable": false,
      "targets": [12]   
    },
    {
      "render": function (data, type, row) { 
        return '<span class="fa-stack btn-open-delete-child-modal" child-uuid="' + data + '">' +
          '<i class="fa fa-square fa-stack-2x"></i>' +
          '<i class="fa fa-times fa-stack-1x fa-inverse"></i>' +
        '</span>';
      },
      "searchable": false,
      "targets": [13]   
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
    { "data": 'UUID' },
    { "data": 'Fecha entrada' },
    { "data": 'Fecha salida'},
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
      "data": "UUID",
      "orderable": false,
      "searchable": false,
      "defaultContent": "error"
    },
    {
      "data": "UUID",
      "orderable": false,
      "searchable": false,
      "defaultContent": "error"
    }
  ],
  'order': [[2, 'desc']]
});
// app.s.childDatatable.DataTable();
app.l('Datatables initialized');

var datepickerOptions = {
  language: 'es',
  endDate: "0d",
  autoclose: true,
  clearBtn: true
}
$.fn.datepicker.dates['es'] = {
  days: moment.weekdays(),
  daysShort: moment.weekdaysShort(),
  daysMin: moment.weekdaysMin(),
  months: moment.months(),
  monthsShort: moment.monthsShort(),
  today: "Today",
  clear: "Cancelar",
  format: 'dd/mm/yyyy',
  weekStart: moment.localeData().firstDayOfWeek(),
  showOnFocus: false
};
app.s.addChildInDate.datepicker(datepickerOptions);
app.s.addChildOutDate.datepicker(datepickerOptions);
app.s.editChildInDate.datepicker(datepickerOptions);
app.s.editChildOutDate.datepicker(datepickerOptions);
app.s.plantStatsDateFrom.datepicker(datepickerOptions);
app.s.plantStatsDateFrom.datepicker('setDate', moment(new Date()).subtract(7, "days").format("DD/MM/YYYY"));
app.s.plantStatsDateTo.datepicker(datepickerOptions);
app.s.plantStatsDateTo.datepicker('setDate', moment(new Date()).format("DD/MM/YYYY"));
app.s.plantChildrenTableInDateFilter.datepicker(datepickerOptions);
app.s.plantChildrenTableOutDateFilter.datepicker(datepickerOptions);
app.l('Datepickers initialized');

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
