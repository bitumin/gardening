app.filterPlantStats = function() {
};
app.openPlantWindow = function() {
  var plantId = $(this).closest('li').data('plant-id');
};
app.openAddChildModal = function() {
  addChildModal.modal('show');
};
app.openEditChildModal = function() {
  //load child specific info into modal
  editChildModal.modal('show');
};
app.openDeleteChildModal = function() {
  //load child specific info into modal
  deleteChildModal.modal('show');
};
app.openAddPlantModal = function() {
  addPlantModal.modal('show');
};
app.openEditPlantModal = function() {
  //load plant specific info into modal
  editPlantModal.modal('show');
};
app.openDeletePlantModal = function() {
  //load plant specific info into modal
  deletePlantModal.modal('show');
};

app.l('All handlers set');
