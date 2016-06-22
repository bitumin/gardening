app.selector = app.s = {
  //main regions
  app: $('#app'),
  leftMenu: $('#left-menu'),
  leftMenuItemsList: $('#left-menu-items-list'),
  content: $('#content'),
  //modals
  addPlantModal: $("#add-plant-modal"),
  editPlantModal: $("#edit-plant-modal"),
  delPlantModal: $("#delete-plant-modal"),
  addChildModal: $("#add-child-modal"),
  editChildModal: $("#edit-child-modal"),
  delChildModal: $("#delete-child-modal"),
  //comboboxes
  addGeneticsCombobox: $("#addPlantGenetics"),
  editGeneticsCombobox: $("#editPlantGenetics"),
  //date-range picker
  plantStatsDateRange: $('#plant-stats-date-range'),
  //left menu buttons
  btnOpenAddPlantModal: $('#btn-open-add-plant-modal'),
  btnOpenEditPlantModal: $('.btn-open-edit-plant-modal'),
  btnOpenDeletePlantModal: $('.btn-open-delete-plant-modal'),
  btnLoadPlantView: $('.btn-load-plant-view'),
  //content views
  contentWelcome: $('#content-welcome'), 
  contentPlant: $('#content-plant'),
  contentChild: $('#content-child'),
  //plant view
  contentPlantTitle: $('#content-plant-title'),
  contentPlantSubtitle: $('#content-plant-subtitle'),
  btnOpenAddChildModal: $('#btn-open-add-child-modal'),
  plantChildrenTab: $('#plant-children'),
  plantStatsTab: $('#plant-stats'),
  //plant view > children tab
  childDatatable: $('#plant-children-datatable'),
  //plant view > stats tab
  plantDatatable: $('#plant-stats-datatable')
  //child view
  //...
};

app.l('Selectors loaded');