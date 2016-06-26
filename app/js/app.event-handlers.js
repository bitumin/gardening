// left menu event handlers
app.s.leftMenu.on('click', '#btn-open-add-plant-modal', function() {
  // todo: to inject all genetics to the genetics combobox input, then...
  app.s.addPlantModal.modal('show');
});
app.s.leftMenu.on('click', '.btn-open-edit-plant-modal', function(e) {
  // todo: inject selected plant data to respective inputs, including plant id, then...
  app.s.editPlantModal.modal('show');
  e.stopPropagation();
});
app.s.leftMenu.on('click', '.btn-open-delete-plant-modal', function() {
  app.s.delPlantModal.modal('show');
  e.stopPropagation();
});
app.s.leftMenu.on('click', '.btn-load-plant-view', function() {
  //todo: load all plant data and related children to the plant view
  app.v.switchView(app.s.contentPlant);
  app.v.toggleActiveItem(this.closest('li'));
});

// modals - add/edit data
app.s.addPlantModal.on('click', 'button[type="submit"]', function() {
  var submitBtn = this;
  var form = submitBtn.closest("form");
  var formData = $(form).serializeObject();
  var formElements = $(form).find(':input');
  
  //disable all form inputs, buttons, etc.
  formElements.prop("disabled", true);
  
  //prepare plant and genetic data
  var plant = {
    name: formData.addPlantName,
    number: formData.addPlantNumber,
    gen: formData.addPlantGenetics,
    origin: formData.addPlantOrigin
  };
  var genetic = {
    name: formData.addPlantGenetics
  };
  
  //add plant passing plant data
  app.db.addPlant(plant)
    .then(function(newPlant) {
      //add new plant to menu
      app.v.addNewPlantToLeftMenu(newPlant);
      //add new genetics (if it doesn't exist)
      return app.db.addGenetic(genetic);
    })
    .catch(function(err) {
      app.l('Add plant aborted with error: ' + err, 'DB');
    })
    .then(function() {
      //close modal
      app.s.addPlantModal.modal('hide');
      //clear form
      $(form)[0].reset();
      //re-enable button
      formElements.prop("disabled", false);
    });
});
app.s.editPlantModal.on('click', 'button[type="submit"]', function() {
  //disable button

  //close modal

  //gather form data in single var

  //update plant passing new plant data

  //update plant name in left menu

  //clear form

  //re-enable button
});
app.s.delPlantModal.on('click', 'button[type="submit"]', function() {
  //disable button

  //close modal

  //delete plant

  //delete plant from menu

  //clear form

  //re-enable button
});
app.s.addChildModal.on('click', 'button[type="submit"]', function() {
  //disable button

  //close modal

  //gather form data in single var

  //find parent plant
  
  //update plant adding child with form data

  // ¿¿¿ update any currently active view with children ???
  
  //clear form

  //re-enable button
});
app.s.editChildModal.on('click', 'button[type="submit"]', function() {
  //disable button

  //close modal

  //gather form data in single var

  //find parent plant

  //update plant updating child with form data

  // ¿¿¿ update any currently active view with children ???

  //clear form

  //re-enable button
});
app.s.delChildModal.on('click', 'button[type="submit"]', function() {
  //disable button

  //close modal
  
  //find parent plant

  //update plant removing child

  // ¿¿¿ update any currently active view with children ???

  //clear form

  //re-enable button
});

app.l('Event handlers set');
