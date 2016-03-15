$(document).ready(function() {
//http://devdocs.ioex
  /*** SELECTORS AND CONFIG VARIABLES ***/
//    Default MOMENT locale
  moment.locale('es');

//    WINDOWS
  var overviewWindow = $('#overview');
  var plantWindow = $("#plant");

//    MODALS
  var addChildModal = $("#addChildModal");
  var editChildModal = $("#editChildModal");
  var deleteChildModal = $("#deleteChildModal");
  var addPlantModal = $("#addPlantModal");
  var editPlantModal = $("#editPlantModal");
  var deletePlantModal = $("#deletePlantModal");

//    FORMS
  var addPlantGeneticsCombobox = $("#addPlantGeneticsCombobox");
  var editPlantGeneticsCombobox = $("#editPlantGeneticsCombobox");
  var addPlant = function() {
    //
  };

//    DATETIMEPICKERS
  var dtpPlantStatsFromTo = $('#plantStatsFromTo');

//    DATATABLES
  var plantStatsDatatable = $('#plantStatsDatatable');
  var childrenDatatable = $('#plantChildrenDatatable');

//    ANIMATIONS CONFIG
  var slideInAnimation = "slideInRight";
  var slideOutAnimation = "slideOutRight";

  window.startLoading = function () {
    console.log("started loading");
  };

  window.stopLoading = function() {
    console.log("finished loading");
  };

  window.filterPlantStats = function() {

  };

//    WINDOWS
  window.openPlantWindow = function(elem) {
    var plantId = $(elem).closest('li').attr('data-plant-id');
    console.log(plantId);
  };

//    MODALS
  window.openAddChildModal = function(elem) {
    addChildModal.modal('show');
  };

  window.openEditChildModal = function(elem) {
    //load child specific info into modal

    editChildModal.modal('show');
  };

  window.openDeleteChildModal = function(elem) {
    //load child specific info into modal

    deleteChildModal.modal('show');
  };

  window.openAddPlantModal = function(elem) {
    addPlantModal.modal('show');
  };

  window.openEditPlantModal = function(elem) {
    //load plant specific info into modal

    editPlantModal.modal('show');
  };

  window.openDeletePlantModal = function(elem) {
    //load plant specific info into modal

    deletePlantModal.modal('show');
  };

//    DATATABLES

  var testData = [
    [
      "2011/04/25",
      "2011/04/29",
      1.23,
      2.45,
      "Buena",
      "Muy buena",
      "Sala 1",
      15,
      "Ninguno",
      "Comentarios",
      "<form class='form-inline' action='javascript:editChild();'><button class='btn btn-xs btn-primary' type='submit'><i class='fa fa-pencil'></i></button></form>" +
      "<form class='form-inline' action='javascript:deleteChild();'><button class='btn btn-xs btn-warning' type='submit'><i class='fa fa-times'></i></button></form>"
    ],
    [
      "2011/04/25",
      "2011/04/29",
      1.23,
      2.45,
      "Mala",
      "Buena",
      "Sala 2",
      25,
      "Ninguno",
      "Comentarios",
      "<form class='form-inline' action='javascript:editChild();'><button class='btn btn-xs btn-primary' type='submit'><i class='fa fa-pencil'></i></button></form>" +
      "<form class='form-inline' action='javascript:deleteChild();'><button class='btn btn-xs btn-warning' type='submit'><i class='fa fa-times'></i></button></form>"
    ]
  ];

  //datatable init
  var initPlantDatatables = function() {
    //fech customer data

    //init datatable for customer data
    childrenDatatable.DataTable({
      data: testData
    });

    //fetch data for shop stats

    //init datatable
    plantStatsDatatable.DataTable({
      data: testData
    });

    //init timepicker
    dtpPlantStatsFromTo.daterangepicker({
      locale: {
        format: 'DD/MM/YYYY',
        separator: ' - ',
        applyLabel: 'Apply',
        cancelLabel: 'Cancel',
        weekLabel: 'W',
        customRangeLabel: 'Custom Range',
        daysOfWeek: moment.weekdaysMin(),
        monthNames: moment.months(),
        firstDay: moment.localeData().firstDayOfWeek()
      }
    });

  };
  initPlantDatatables();

  //Genetics form >>> select2 init
  addPlantGeneticsCombobox.select2();
  editPlantGeneticsCombobox.select2();

});