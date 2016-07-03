// left menu event handlers
app.s.leftMenu.on('click', '#btn-open-add-plant-modal', function() {
  app.s.addPlantModal.modal('show');
});
app.s.leftMenu.on('click', '.btn-open-edit-plant-modal', function(e) {
  e.stopPropagation();
  var plantId = $(this).closest('li').data('plantId');
  app.db.getOneDoc('plants', { _id: plantId })
    .then(function (doc) {
      //load data into modal
      app.s.editPlantTitle.text(doc.name);
      app.s.editPlantId.val(doc._id);
      app.s.editPlantName.val(doc.name);
      app.s.editPlantNumber.val(doc.number);
      app.s.editPlantGenetics.val(doc.genetic);
      app.s.editPlantOrigin.val(doc.origin);
      //open modal
      app.s.editPlantModal.modal('show');
    })
    .catch(function(err) {
      //todo: do something on exception
    });
});
app.s.leftMenu.on('click', '.btn-open-delete-plant-modal', function(e) {
  e.stopPropagation();
  var plantId = $(this).closest('li').data('plantId');
  app.s.delPlantId.val(plantId);
  app.s.delPlantModal.modal('show');
});
app.s.leftMenu.on('click', '.btn-load-plant-view', function() {
  app.v.populatePlantView($(this).closest('li').data('plantId'));
  app.v.switchView(app.s.contentPlant);
  app.v.toggleActiveItem(this.closest('li'));
});

// modals - add/edit data
app.s.addPlantModal.on('click', 'button[type="submit"]', function() {
  var formData = app.s.addPlantForm.serializeObject();
  var formElements = app.s.addPlantForm.find(':input');
  
  //disable all form inputs, buttons, etc.
  formElements.prop("disabled", true);
  
  //plant doc
  var plant = {
    name: formData.addPlantName,
    number: formData.addPlantNumber,
    genetic: formData.addPlantGenetics,
    origin: formData.addPlantOrigin,
    insertDate: new Date(),
    lastModDate: new Date()
  };
  
  //genetic doc
  var genetic = {
    name: formData.addPlantGenetics,
    insertDate: new Date(),
    lastModDate: new Date()
  };
  
  //add plant
  app.db.insertDoc('plants', plant)
    .then(function(newPlant) {
      //add new plant to menu
      app.v.addNewPlantToLeftMenu(newPlant);
      //add new genetics (if it doesn't exist)
      return app.db.insertDocIfDoesNotExist('genetics', genetic)
        .then(app.v.populateGenetics);
    })
    .catch(function(err) {
      app.l('Add plant aborted with error: ' + err, 'DB');
    })
    .then(function() {
      //close modal
      app.s.addPlantModal.modal('hide');
      //clear form
      app.s.addPlantForm[0].reset();
      //re-enable button
      formElements.prop("disabled", false);
    });
});
app.s.editPlantModal.on('click', 'button[type="submit"]', function() {
  var formData = app.s.editPlantForm.serializeObject();
  var formElements = app.s.editPlantForm.find(':input');

  //disable all form inputs, buttons, etc.
  formElements.prop("disabled", true);

  //query
  var query = {
    _id: formData.editPlantId
  };

  //plant doc
  var plant = {
    name: formData.editPlantName,
    number: formData.editPlantNumber,
    genetic: formData.editPlantGenetics,
    origin: formData.editPlantOrigin,
    lastModDate: new Date()
  };

  //genetic doc
  var genetic = {
    name: formData.editPlantGenetics,
    lastModDate: new Date()
  };

  //update plant
  app.db.updateDoc('plants', query, plant)
    //concurrently add new genetics (if it doesn't exist)
    .then(function(nReplaced) {
      if(nReplaced === 1) {
        app.v.updatePlantName(query._id, plant.name);
      }
      return app.db.insertDocIfDoesNotExist('genetics', genetic)
        .then(app.v.populateGenetics); 
    })
    .catch(function(err) {
      app.l('Edit plant rejected with error: ' + err, 'DB');
    })
    .then(function() {
      //close modal
      app.s.editPlantModal.modal('hide');
      //clear form
      app.s.editPlantForm[0].reset();
      //re-enable button
      formElements.prop("disabled", false);
    });
});
app.s.delPlantModal.on('click', 'button[type="submit"]', function() {
  var formData = app.s.delPlantForm.serializeObject();
  var formElements = app.s.delPlantForm.find(':input');

  //disable all form inputs, buttons, etc.
  formElements.prop("disabled", true);

  //query
  var query = {
    _id: formData.deletePlantId
  };

  //delete plant
  app.db.removeDoc('plants', query)
    .then(function(nRemoved) {
      if(nRemoved === 1) {
        //remove plant from left menu
        app.v.removePlantFromLeftMenu(formData.deletePlantId);
      }
    })
    .catch(function(err) {
      app.l('Remove plant rejected with error: ' + err, 'DB');
    })
    .then(function() {
      //close modal
      app.s.delPlantModal.modal('hide');
      //clear form
      app.s.delPlantForm[0].reset();
      //re-enable button
      formElements.prop("disabled", false);
    });
});
app.s.plantChildrenTable.on('click', 'btn-details-child', function() {
  var tr = $(this).closest('tr');
  var row = table.row( tr );

  if ( row.child.isShown() ) {
    // This row is already open - close it
    row.child.hide();
    tr.removeClass('shown');
  }
  else {
    // Open this row
    row.child( format(row.data()) ).show();
    tr.addClass('shown');
  }
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
