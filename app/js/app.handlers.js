/*
 * Navigation
 */

app.s.btnOpenAddPlantModal.click(function() {
  app.s.addPlantModal.modal('show');
});

app.s.leftMenu.on('click', '.btn-open-add-plant-modal', function() {
  app.s.addPlantModal.modal('show');
});

app.s.leftMenu.on('click', '.btn-open-edit-plant-modal', function() {
  app.s.editPlantModal.modal('show');
});

app.s.leftMenu.on('click', '.btn-open-delete-plant-modal', function() {
  app.s.delPlantModal.modal('show');
});

app.s.leftMenu.on('click', '.btn-load-plant-view', function() {
  //todo: load data to the plant view
  app.switchView(app.s.contentPlant);
});

/*
 * Data
 */

//todo: add plant -> add plant to menu
//todo: edit plant -> update plant in menu with ID + reload plant view if visible
//todo: delete plant -> event -> remove plant from menu with ID + close plant view if visible

//todo: add child
//todo: edit child
//todo: delete child

//todo: add genetics -> reload genetics data in comboboxes
//todo: edit genetics -> reload genetics data in comboboxes
//todo: delete genetics -> reload genetics data in comboboxes

//todo: build up plants stats by date range
//todo: pick date range -> filter plants stats by date range

app.l('All handlers set');