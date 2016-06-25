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
