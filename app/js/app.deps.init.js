//init datatables 
app.s.plantDatatable.DataTable();
app.s.childDatatable.DataTable();

app.l('Datatables initialized');

//init select2
app.s.addGeneticsCombobox.select2();
app.s.editGeneticsCombobox.select2();

app.l('Select2 comboboxes initialized');

//init plant stats date range picker
app.s.plantStatsRange.daterangepicker({
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
