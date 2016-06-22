//todo: implementar toastr messages
//todo: implementar loading... state to in-modal actions 

/*
 * Event handlers
 */

// left menu navigation
app.s.leftMenu.on('click', '.btn-open-add-plant-modal', function() {
  // todo: to inject all genetics to the genetics combobox input, then...
  app.s.addPlantModal.modal('show');
});
app.s.leftMenu.on('click', '.btn-open-edit-plant-modal', function() {
  // todo: inject selected plant data to respective inputs, including plant id, then...
  app.s.editPlantModal.modal('show');
});
app.s.leftMenu.on('click', '.btn-open-delete-plant-modal', function() {
  app.s.delPlantModal.modal('show');
});
app.s.leftMenu.on('click', '.btn-load-plant-view', function() {
  //todo: load all plant data and related children to the plant view
  app.switchView(app.s.contentPlant);
});

// modals - add/edit data
app.s.addPlantModal.on('click', 'button[type="submit"]', function() {
  //disable button
  
  //close modal
  
  //gather form data in single var
  
  //add plant passing plant data
  
  //add new plant to menu
  
  //clear form
  
  //re-enable button
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

/*
 * View update helpers
 */
app.addNewPlantToLeftMenu = function(newPlant) {
  var newPlantId = newPlant._id;
  var newPlantName = newPlant.name;
  
  app.s.leftMenuItemsList.append(
    '<li class="active" data-plant-id="' + newPlantId + '">' +
      '<a href="javascript:" class="btn-load-plant-view">' +
        '<span>' + newPlantName + '</span>' +
        '<i class="btn-open-delete-plant-modal fa fa-times-circle"></i>' +
      '</a>' +
    '</li>'
  );
};

/*
 * DB helpers
 */
app.db.addPlant = function(newPlantData) {
  return new Promise(function (resolve, reject) {
    app.db.plants.insert({
      name: newPlantData.addPlantName,
      number: newPlantData.addPlantNumber,
      gen: newPlantData.addPlantGenetics,
      origin: newPlantData.addPlantOrigin,
      insertDate: new Date(),
      lastModDate: null
    }, function (err, newPlant) {
      if (err) {
        reject(Error('Unable to seed plants datastore, with error: ' + err));
      } else {
        resolve(newPlant);
      }
    });
  });
};

//todo: build up plants stats by date range
//todo: pick date range -> filter plants stats by date range

app.l('All handlers set');
