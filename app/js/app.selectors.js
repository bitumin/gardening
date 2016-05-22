app.selector = app.s = {
  //modals
  addPlantModal: $("#add-plant-modal"),
  editPlantModal: $("#edit-plantModal"),
  delPlantModal: $("#delete-plantModal"),
  addChildModal: $("#add-child-modal"),
  editChildModal: $("#edit-child-modal"),
  delChildModal: $("#delete-child-modal"),
  //comboboxes
  addGeneticsCombobox: $("#add-plant-genetics-combobox"),
  editGeneticsCombobox: $("#edit-plant-genetics-combobox"),
  //datarange picker
  plantStatsRange: $('#plant-stats-range'),
  //datatables
  plantDatatable: $('#plant-stats-datatable'),
  childDatatable: $('#plant-children-datatable'),
  //left menu buttons
  btnOpenAddPlantModal: $('#btn-open-add-plant-modal'),
  btnOpenEditPlantModal: $('.btn-open-edit-plant-modal'),
  btnOpenDeletePlantModal: $('.btn-open-delete-plant-modal'),
  btnLoadPlantView: $('.btn-load-plant-view'),
  //content views
  contentWelcome: $('#content-welcome'), 
  contentPlant: $('#content-plant'),
  contentChild: $('#content-child'),
  //plant view target elements
  contentPlantTitle: $('#content-plant-title'),
  contentPlantSubtitle: $('#content-plant-subtitle'),
  //plant view buttons
  btnOpenAddChildModal: $('#btn-open-add-child-modal'),
};

app.l('Selectors loaded');