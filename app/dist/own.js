app.start = new Date().getTime();

app.execTime = function() {
  return new Date().getTime() - app.start;
};

app.log = app.l = function(msg, mode) {
  if(typeof mode === 'undefined')
    mode = 'Notice';
  if(app.c.env === 'dev'){
    console.log(app.config.appName+' ['+mode+']: '+msg);
  }
};

app = app || {};
app.config = app.c = {
  appName: 'Gardening Tools',
  env: 'dev', //dev, pre, pro
  inAnimation: 'fadeIn',
  outAnimation: 'fadeOut',
  seeders: {
    genetics: 50,
    plants: 25,
    childrenPerPlant: 10,
    childIsOutProbability: 0.8
  }
};

//todo: to main init script
if(app.config.env === 'dev') {
  app.l('Developer mode is ON', 'Warning');
}

app.l('App config set');

app.selector = app.s = {
  //main regions
  app: $('#app'),
  leftMenu: $('#left-menu'),
  leftMenuItemsList: $('#left-menu-items-list'),
  content: $('#content'),
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
  contentPlantTitleName: $('#content-plant-title-name'),
  contentPlantTitleGenetics: $('#content-plant-title-genetic'),
  contentPlantTitleOrigin: $('#content-plant-title-origin'),
  plantChildrenTab: $('#plant-children'),
  plantStatsTab: $('#plant-stats'),
  //add plant modal
  addPlantModal: $("#add-plant-modal"),
  addPlantForm: $('#add-plant-form'),
  addPlantGenetics: $('#add-plant-genetics'),
  //edit plant modal
  editPlantModal: $("#edit-plant-modal"),
  editPlantForm: $('#edit-plant-form'),
  editPlantTitle: $('#edit-plant-title'),
  editPlantId: $('#edit-plant-id'),
  editPlantName: $('#edit-plant-name'),
  editPlantNumber: $('#edit-plant-number'),
  editPlantGenetics: $('#edit-plant-genetics'),
  editPlantOrigin: $('#edit-plant-origin'),
  //delete plant modal
  delPlantModal: $("#delete-plant-modal"),
  delPlantForm: $('#delete-plant-form'),
  delPlantId: $('#delete-plant-id'),
  //children view
  btnOpenAddChildModal: $('.btn-open-add-child-modal'),
  btnOpenEditChildModal: $('.btn-open-edit-child-modal'),
  btnOpenDeleteChildModal: $('.btn-open-delete-child-modal'),
  plantChildrenTable: $('#plant-children-table'),
  plantChildrenTableInDateFilter: $("#plant-child-in-date-filter"),
  plantChildrenTableOutDateFilter: $("#plant-child-out-date-filter"),
  plantChildrenTableInHeightFilter: $("#plant-child-in-height-filter"),
  plantChildrenTableOutHeightFilter: $("#plant-child-out-height-filter"),
  plantChildrenTableInQualityFilter: $("#plant-child-in-quality-filter"),
  plantChildrenTableOutQualityFilter: $("#plant-child-out-quality-filter"),
  plantChildrenTableRoomFilter: $("#plant-child-room-filter"),
  plantChildrenTableProductionFilter: $("#plant-child-production-filter"),
  //add child modal
  addChildModal: $("#add-child-modal"),
  addChildForm: $('#add-child-form'),
  addChildInDate: $('#add-child-in-date'),
  addChildOutDate: $('#add-child-out-date'),
  //edfit child modal
  editChildModal: $("#edit-child-modal"),
  editChildForm: $("#edit-child-form"),
  editChildTitle: $("#edit-child-title"),
  editChildUuid: $("#edit-child-uuid"),
  editChildInDate: $("#edit-child-in-date"),
  editChildOutDate: $("#edit-child-out-date"),
  editChildInHeight: $("#edit-child-in-height"),
  editChildOutHeight: $("#edit-child-out-height"),
  editChildInQuality: $("#edit-child-in-quality"),
  editChildOutQuality: $("#edit-child-out-quality"),
  editChildRoom: $("#edit-child-room"),
  editChildProduction: $("#edit-child-production"),
  editChildDefects: $("#edit-child-defects"),
  editChildComments: $("#edit-child-comments"),
  //delete child modal
  delChildModal: $("#delete-child-modal"),
  delChildForm: $("#delete-child-form"),
  delChildUuid: $("#delete-child-uuid"),
  //stats
  plantStatsForm: $('#stat-form'),
  plantStatsDatePeriod: $("#plant-stats-date-reporting"),
  plantStatsDateFrom: $('#plant-stats-date-from'),
  plantStatsDateTo: $('#plant-stats-date-to'),
};

app.l('Selectors set');

var NeDB = require('nedb');
var uuid = require('node-uuid');

app.db = {
  options: new NeDB({filename: './datastores/options.db', autoload: true}),
  genetics: new NeDB({filename: './datastores/genetics.db', autoload: true}),
  plants: new NeDB({filename: './datastores/plants.db', autoload: true})
};
app.l('NeDB datastores initialized', 'DB');

// Async NeDB "promisified" helpers
app.db.resetAllDatastores = function() {
  if (app.config.env === 'dev') {
    app.db.options.remove({}, { multi: true }, function (err, n) { app.l(n + ' options removed'); });
    app.db.genetics.remove({}, { multi: true }, function (err, n) { app.l(n + ' genetics removed'); });
    app.db.plants.remove({}, { multi: true }, function (err, n) {  app.l(n + ' plants removed'); });
  }
};
app.db.countDocs = function (datastore) {
  return new Promise(function (resolve, reject) {
    app.db[datastore].count({}, function (err, count) {
      if (err) {
        reject(Error('Unable to count docs from ' + datastore + ', with error: ' + err));
      } else {
        resolve(count);
      }
    });
  });
};
app.db.getDocByPosition = function (position, datastore) {
  return new Promise(function (resolve, reject) {
    app.db[datastore].find({}).skip(position).limit(1).exec(function (err, docs) {
      if (err) {
        reject(Error('Unable to obtain doc with position ' + position + ' from ' + datastore + ', with error: ' + err));
      } else {
        resolve(_.first(docs));
      }
    });
  });
};
app.db.getRandomDoc = function (datastore) {
  return new Promise(function (resolve, reject) {
    app.db.countDocs(datastore)
      .then(function (n) {
        return Math.floor(Math.random() * (n - 2));
      })
      .then(function (randomPos) {
        return app.db.getDocByPosition(randomPos, datastore);
      })
      .then(function (doc) {
        resolve(doc);
      })
      .catch(function (err) {
        reject(Error('Unable to obtain a random doc from ' + datastore + ', with error: ' + err));
      });
  });
};
app.db.getAllDocs = function (datastore, sf) {
  return new Promise(function (resolve, reject) {
    if(typeof sf === 'string') {
      var sortObj = {};
      sortObj[sf] = 1;
      app.db[datastore].find({}).sort(sortObj).exec(function (err, docs) {
        if (err) {
          reject(Error('Unable to all docs from datastore ' + datastore + ', with error: ' + err));
        } else {
          resolve(docs);
        }
      });
    } else {
      app.db[datastore].find({}, function (err, docs) {
        if (err) {
          reject(Error('Unable to all docs from datastore ' + datastore + ', with error: ' + err));
        } else {
          resolve(docs);
        }
      })
    }
  });
};
app.db.removeDoc = function (datastore, query) {
  return new Promise(function (resolve, reject) {
    app.db[datastore].remove(query, {}, function (err, numRemoved) {
      if (err) {
        reject(Error('Unable to remove doc in ' + datastore + ' datastore, with error: ' + err));
      } else {
        resolve(numRemoved);
      }
    });
  });
};
app.db.removeAllDocs = function (datastores) {
  return new Promise(function (resolve, reject) {
    if (typeof datastores === 'string') {
      app.db[datastores].remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
          reject(Error('Unable to delete all docs from ' + datastores + ', with error: ' + err));
        } else {
          resolve(numRemoved);
        }
      });
    } else if (_.isArray(datastores)) {
      _.each(datastores, function (datastore) {
        app.db[datastore].remove({}, {multi: true}, function (err, numRemoved) {
          if (err) {
            reject(Error('Unable to all docs from ' + datastores.join(', ') + ', with error: ' + err));
          } else {
            resolve(numRemoved);
          }
        });
      });
    }
  });
};
app.db.getOneDoc = function(datastore, query) {
  return new Promise(function (resolve, reject) {
    app.db[datastore].findOne(query, function (err, doc) {
      if (err) {
        reject(Error('Unable to find doc in ' + datastore + ', with error: ' + err));
      } else {
        resolve(doc);
      }
    });
  });
};
app.db.insertDoc = function(datastore, doc) {
  return new Promise(function (resolve, reject) {
    app.db[datastore].insert(doc, function (err, newDoc) {
      if (err) {
        reject(Error('Unable to add plant to plants datastore, with error: ' + err));
      } else {
        resolve(newDoc);
      }
    });
  });
};
app.db.insertDocIfDoesNotExist = function(datastore, doc) {
  return new Promise(function (resolve, reject) {
    app.db[datastore].insert(doc, function (err, newDoc) {
      if (err) {
        if(err.errorType === 'uniqueViolated') {
          resolve();
        } else {
          reject(Error('Unable to add new doc to ' + datastore + ' datastore, with error: ' + err));
        }
      } else {
        resolve(newDoc);
      }
    });
  });
};
app.db.updateDoc = function(datastore, query, doc) {
  return new Promise(function (resolve, reject) {
    app.db[datastore].update(query, { $set: doc }, function (err, nReplaced) {
      if (err) {
        reject(Error('Unable to update doc in ' + datastore + ' datastore, with error: ' + err));
      } else {
        resolve(nReplaced);
      }
    });
  });
};

// Seeders
app.db.seeders = {};
app.db.seeders.genetics = function () {
  return new Promise(function (resolve, reject) {
    app.l('Seeding genetics...', 'DB');
    var faker = require('faker');
    var counter = 0;

    _.times(app.c.seeders.genetics, function () {
      app.db.genetics.insert({
        name: faker.lorem.word(),
        insertDate: new Date(),
        lastModDate: new Date()
      }, function (err) {
        if (err && err.errorType !== 'uniqueViolated') {
          reject(Error('Unable to seed genetics datastore, with error: ' + err));
        }
        counter++;
        if (counter >= app.c.seeders.genetics) {
          resolve();
        }
      });
    });
  });
};
app.db.seeders.plants = function () {
  return new Promise(function (resolve, reject) {
    app.l('Seeding plants...', 'DB');
    var faker = require('faker');
    var counter = 0;

    _.times(app.c.seeders.plants, function () {
      app.db.getRandomDoc('genetics').then(function (gen) {
        app.db.plants.insert({
          name: faker.commerce.productName(),
          number: Math.floor(Math.random() * 99) + 1, //random int from 1 to 100
          genetic: gen.name,
          origin: faker.address.country(),
          insertDate: new Date(),
          lastModDate: new Date()
        }, function (err) {
          if (err) {
            reject(Error('Unable to seed plants datastore, with error: ' + err));
          }
          counter++;
          if (counter >= app.c.seeders.plants) {
            resolve();
          }
        });
      });
    });
  });
};
app.db.seeders.children = function () {
  return new Promise(function (resolve, reject) {
    app.l('Seeding children...', 'DB');
    var faker = require('faker');
    var counter = 0;
    
    app.db.getAllDocs('plants').then(function (plants) {
      _.each(plants, function (plant) {
        _.times(app.c.seeders.childrenPerPlant, function () {

          //Some children are out (have been gathered), the rest are still in (growing)
          var childIsOutProbability = app.c.seeders.childIsOutProbability;
          var outDate, outHeight, outQuality, production;

          outDate = outHeight = outQuality = production = null;
          if (Math.random() < childIsOutProbability) {
            outDate = faker.date.recent();
            outHeight = Math.floor(Math.random() * 131) + 20; //20 - 150 cm
            outQuality = Math.floor(Math.random() * 11); //0 - 10
            production = Math.floor(Math.random() * 50) + 1; //1 - 50 kg
          }

          app.db.plants.update(plant, { $push: { children: {
            uuid: uuid.v4(),
            inDate: faker.date.past(),
            outDate: outDate,
            inHeight: Math.floor(Math.random() * 19) + 1, //1 - 19 cm
            outHeight: outHeight,
            inQuality: Math.floor(Math.random() * 11), //0 - 10
            outQuality: outQuality,
            room: faker.commerce.color(),
            production: production,
            defects: faker.lorem.sentence(),
            comments: faker.lorem.paragraph(),
            insertDate: new Date(),
            lastModDate: new Date()
          } } }, {}, function (err) {
            if (err) {
              reject(Error('Unable to seed the children of plant ' + plant.name + ', with error: ' + err));
            }
            counter++;
            if (counter >= (app.c.seeders.childrenPerPlant * app.c.seeders.plants)) {
              resolve();
            }
          });

        });
      });
    });
  });
};

// Seeders wrapper
app.db.runSeeder = function () {
  return app.db.seeders.genetics()
      .then(app.db.seeders.plants)
      .then(app.db.seeders.children);
};

// plants repository
app.db.plantsRepo = {
  insertChild: function(plantId, child){
    return new Promise(function(resolve, reject){
        app.db.plants.update({_id: plantId}, {$push: {children: child}}, {}, function(err, newChild){
        if (err) {
          reject(Error('Unable to add child to plants datastore, with error: ' + err));
        } else {
          resolve(newChild);
        }
      });
    });
  },
  updateChild: function(plantId, child){
    return new Promise(function(resolve, reject){
      app.db.plants.update({_id: plantId}, {$pull: {children: {uuid: child.uuid}}}, {}, function(err){
        if (err) {
          reject(Error('Unable to add child to plants datastore, with error: ' + err));
        } else {
          app.db.plants.update({_id: plantId}, {$push: {children: child}}, {}, function(err, newChild){
            if (err) {
              reject(Error('Unable to add child to plants datastore, with error: ' + err));
            } else {
              resolve(newChild);
            }
          });
        }
      });
    });
  },
  deleteChild: function(plantId, childUuid){
      return new Promise(function(resolve, reject){
        app.db.plants.update({_id: plantId}, {$pull: {children: {uuid: childUuid}}}, {}, function(err){
        if (err) {
          reject(Error('Unable to delete child to plants datastore, with error: ' + err));
        } else {
          resolve(childUuid);
        }
      });
    });
  },
  getChild: function(plantId, childUuid){
      return new Promise(function(resolve, reject){
        app.db.plants.findOne({_id: plantId}, {}, function(err, plant){
        if (err) {
          reject(Error('Unable to find child of plant, with error: ' + err));
        } else {
          var child;
          for(var i = 0; i < plant.children.length; i++){
            if(plant.children[i].uuid === childUuid){
              child = plant.children[i];
              break;
            }
          }
          resolve(child);
        }
      });
    });
  },
  getChildren: function(plantId){
      return new Promise(function(resolve, reject){
        app.db.plants.findOne({_id: plantId}, { children: 1}, function(err, plant){
        if (err) {
          reject(Error('Unable to find children of plant, with error: ' + err));
        } else {
          resolve(plant.children);
        }
      });
    });
  }
};
app.view = app.v = {};
app.v.switchView = function(contentEl, callback) {
  if(! contentEl.attr('id').startsWith('content-'))
    return;

  if(contentEl.is(':visible')) {
    app.s.content.children()[app.c.outAnimation](300);
    setTimeout(function(){ 
      callback();
      contentEl[app.c.inAnimation](300);
    }, 300);
  }
  else{
    if(contentEl.is(':hidden')) {
      app.s.content.children()[app.c.outAnimation](300);
      setTimeout(function(){
        callback();
        contentEl[app.c.inAnimation](300);
      }, 300);
    }
  }
};
app.v.populatePlantView = function(plantId) {
  app.db.getOneDoc('plants', { _id: plantId })
    .then(function (doc) {
      //populate plant info
      app.s.contentPlant.attr('data-plant-id', doc._id);
      app.s.contentPlantTitleName.text(doc.name);
      app.s.contentPlantTitleGenetics.text(doc.genetic);
      app.s.contentPlantTitleOrigin.text(doc.origin);
      //doc.number
      //populate children table
      var childrenData = [];
      _.each(doc.children, function(child) {
        childrenData.push({
          'UUID': child.uuid,
          'Fecha entrada': child.inDate,
          'Fecha salida': child.outDate,
          'Altura entrada': child.inHeight,
          'Altura salida': child.outHeight,
          'Calidad entrada': child.inQuality,
          'Calidad salida': child.outQuality,
          'Sala': child.room,
          'Producción': child.production,
          'Defectos': child.defects,
          'Comentarios': child.comments
        });
      });
      app.s.plantChildrenDatatable.clear().rows.add(childrenData).draw('full-reset');
    })
    .catch(function(err) {
      //todo: do something on exception
    });
};
app.v.addNewPlantToLeftMenu = function(newPlant) {
  var newPlantId = newPlant._id;
  var newPlantName = newPlant.name;

  app.s.leftMenuItemsList.append(
    '<li class="" data-plant-id="' + newPlantId + '">' +
    '<a href="javascript:" class="btn-load-plant-view">' +
    '<span>' + newPlantName + '</span>' +
    '<i class="btn-open-delete-plant-modal fa fa-times-circle"></i>' +
    '<i class="btn-open-edit-plant-modal fa fa-pencil"></i>' +
    '</a>' +
    '</li>'
  );
};
app.v.removePlantFromLeftMenu = function(plantId) {
  app.s.leftMenuItemsList.find('li[data-plant-id="' + plantId + '"]').remove();
};
app.v.updatePlantName = function(plantId, newPlantName) {
  app.s.leftMenuItemsList.find('li[data-plant-id="' + plantId + '"] > a > span').text(newPlantName);
};
app.v.toggleActiveItem = function(el) {
  app.s.leftMenuItemsList.find('li.active').removeClass('active');
  $(el).addClass('active');
};
app.v.populateLeftMenu = function() {
  return app.db.getAllDocs('plants', 'insertDate')
    .then(function(plants) {
      _.each(plants, function (plant) {
        app.v.addNewPlantToLeftMenu(plant);
      })
    });
};
app.v.populateGenetics = function() {
  return app.db.getAllDocs('genetics', 'insertDate')
    .then(function(genetics) {
      var geneticsList = [];
      _.each(genetics, function(gen) {
        if(typeof gen.name === 'string') {
          geneticsList.push(gen.name); 
        }
      });
      var options = {
        data: geneticsList,
        list: {
          match: {enabled: true},
          sort: {enabled: true}
        },
        theme: 'bootstrap'
      };
      app.s.addPlantGenetics.easyAutocomplete(options);
      app.s.editPlantGenetics.easyAutocomplete(options);
    });
};

/*
 * Helper
 */
  // google.charts.setOnLoadCallback(function(){});
  // google.charts.load('current', {'packages':['line']});
function disableForm(form){
  form.find(':input').prop("disabled", true);
}
function enableForm(form){
  form.find(':input').prop("disabled", false);
}
function reportInfo(message, obj){
  toastr.success(message);
  app.l("Info > " + message + " (" + JSON.stringify(obj) + ")");
}
function reportSuccess(message, obj){
  toastr.success(message);
  app.l("Success > " + message + " (" + JSON.stringify(obj) + ")");
}
function reportError(message, obj){
  toastr.error(message);
  app.l("Error > " + message + " (" + JSON.stringify(obj) + ")");
}
function resetModals(){
  app.s.addPlantModal.modal('hide');
  app.s.addPlantForm[0].reset();
  enableForm(app.s.addPlantForm);

  app.s.editPlantModal.modal('hide');
  app.s.editPlantForm[0].reset();
  enableForm(app.s.editPlantForm);

  app.s.delPlantModal.modal('hide');
  app.s.delPlantForm[0].reset();
  enableForm(app.s.delPlantForm);

  app.s.addChildModal.modal('hide');
  app.s.addChildForm[0].reset();
  enableForm(app.s.addChildForm);

  app.s.editChildModal.modal('hide');
  app.s.editChildForm[0].reset();
  enableForm(app.s.editChildForm);

  app.s.delChildModal.modal('hide');
  app.s.delChildForm[0].reset();
  enableForm(app.s.delChildForm);
}
/*
 * Left menu event handlers
 */
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
    .catch(function(err) {reportError('Could not retrieve plant', err);});
});

app.s.leftMenu.on('click', '.btn-open-delete-plant-modal', function(e) {
  e.stopPropagation();
  var plantId = $(this).closest('li').data('plantId');
  app.s.delPlantId.val(plantId);
  app.s.delPlantModal.modal('show');
});

app.s.leftMenu.on('click', '.btn-load-plant-view', function() {
  var self = $(this);
  app.v.switchView(app.s.contentPlant, function(){
    var plantId = self.closest('li').data('plantId');
    app.v.populatePlantView(plantId);
    app.v.toggleActiveItem(self.closest('li'));

    reportSuccess("Loaded plant", plantId);
  });
});

/*
 * Plant modals (add, edit, delete)
 */
app.s.addPlantModal.on('click', 'button[type="submit"]', function() {
  var formData = app.s.addPlantForm.serializeObject();
  disableForm(app.s.addPlantForm);
  
  var plant = {
    name: formData.addPlantName,
    number: formData.addPlantNumber,
    genetic: formData.addPlantGenetics,
    origin: formData.addPlantOrigin,
    insertDate: new Date(),
    lastModDate: new Date()
  };
  var genetic = {
    name: formData.addPlantGenetics,
    insertDate: new Date(),
    lastModDate: new Date()
  };
  
  app.db.insertDoc('plants', plant)
    .then(function(newPlant) {
      reportSuccess("Added new plant", newPlant);
      app.v.addNewPlantToLeftMenu(newPlant);
      resetModals();

      app.db.insertDocIfDoesNotExist('genetics', genetic)
        .then(function(newGenetic){app.v.populateGenetics(newGenetic);})
    })
    .catch(function(err) { reportError("Could not add plant", err); });
});

app.s.editPlantModal.on('click', 'button[type="submit"]', function() {
  var formData = app.s.editPlantForm.serializeObject();
  disableForm(app.s.editPlantForm);

  var query = { _id: formData.editPlantId };
  var plant = {
    name: formData.editPlantName,
    number: formData.editPlantNumber,
    genetic: formData.editPlantGenetics,
    origin: formData.editPlantOrigin,
    lastModDate: new Date()
  };
  var genetic = {
    name: formData.editPlantGenetics,
    lastModDate: new Date()
  };

  app.db.updateDoc('plants', query, plant)
    .then(function(nameReplaced) {
      if(nameReplaced === 1) { app.v.updatePlantName(query._id, plant.name); }
      
      reportSuccess("Edited plant", plant);
      resetModals();
      app.db.insertDocIfDoesNotExist('genetics', genetic)
        .then(function(editedGenetic){app.v.populateGenetics(editedGenetic)}); 
    })
    .catch(function(err) { reportError("Could not edit plant", err); });
});

app.s.delPlantModal.on('click', 'button[type="submit"]', function() {
  var formData = app.s.delPlantForm.serializeObject();
  disableForm(app.s.delPlantForm);

  var query = { _id: formData.deletePlantId };

  app.db.removeDoc('plants', query)
    .then(function(removed) {
      if(removed === 1) { app.v.removePlantFromLeftMenu(formData.deletePlantId); }

      reportSuccess("Deleted plant", formData.deletePlantId);
      resetModals();
    })
    .catch(function(err) { reportError("Could not delete plant", err); });
});

/*
 * Plant's children datatable event handlers
 */
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
app.s.plantChildrenTable.find("thead th input").click(function(event){
  //prevent sorting when attempting to filter
  if(event) event.preventDefault();
  return false;
});
app.s.plantChildrenTableInDateFilter.change(function(e){
  var index = $(e.target).parent().index();
  app.s.plantChildrenDatatable.column(index).search($(this).val()).draw();
});
app.s.plantChildrenTableOutDateFilter.change(function(e){
  var index = $(e.target).parent().index();
  app.s.plantChildrenDatatable.column(index).search($(this).val()).draw();
});
app.s.plantChildrenTable.find("thead th input").keydown(function(e){
  //execute filtering when hitting "Enter" button
  if(e.keyCode == 13)
  {
    var index = $(e.target).parent().index();
    app.s.plantChildrenDatatable.column(index).search($(this).val()).draw();
    if(event) event.preventDefault();
    return false;
  }
});

/*
 * Plant children content event handlers
 */
app.s.content.on('click', '.btn-open-add-child-modal', function() {
  app.s.addChildModal.modal('show');
});

app.s.content.on('click', '.btn-open-edit-child-modal', function(e) {
  var plantId = app.s.contentPlant.attr("data-plant-id");
  var childId = $(this).attr("child-uuid");

  app.db.plantsRepo.getChild(plantId, childId)
    .then(function (doc) {
      app.s.editChildTitle.text(doc.name);
      app.s.editChildUuid.val(doc.uuid);
      app.s.editChildInDate.datepicker("update", new Date(doc.inDate));
      app.s.editChildOutDate.datepicker("update", doc.outDate != undefined ? new Date(doc.outDate) : null);
      app.s.editChildInHeight.val(doc.inHeight);
      app.s.editChildOutHeight.val(doc.outHeight);
      app.s.editChildInQuality.val(doc.inQuality);
      app.s.editChildOutQuality.val(doc.outQuality);
      app.s.editChildRoom.val(doc.room);
      app.s.editChildProduction.val(doc.production);
      app.s.editChildDefects.val(doc.defects);
      app.s.editChildComments.val(doc.comments);

      app.s.editChildModal.modal('show');
    })
    .catch(function(err) { reportError('Could not retrieve plant child', err); });
});

app.s.content.on('click', '.btn-open-delete-child-modal', function(e) {
  app.s.delChildUuid.val($(this).attr("child-uuid"));
  app.s.delChildModal.modal('show');
});

/*
 * Plant child modals (add, edit, delete)
 */
app.s.addChildForm.on('submit', function() {
  var formData = app.s.addChildForm.serializeObject();
  disableForm(app.s.addChildForm);

  var plantId = app.s.contentPlant.attr("data-plant-id");
  var child = {
    uuid: uuid(),
    inDate: app.s.addChildInDate.datepicker("getDate"),
    outDate: app.s.addChildOutDate.datepicker("getDate"),
    inHeight: formData.addChildInHeight,
    outHeight: formData.addChildOutHeight,
    inQuality: formData.addChildInQuality,
    outQuality: formData.addChildOutQuality,
    room: formData.addChildRoom,
    production: formData.addChildProduction,
    defects: formData.addChildDefects,
    comments: formData.addChildComments,
    insertDate: new Date(),
    lastModDate: new Date()   
  }
  
  app.db.plantsRepo.insertChild(plantId, child)
    .then(function(newPlantChild) {
        app.v.populatePlantView(plantId);

        reportSuccess("Added plant child", newPlantChild);
        resetModals();
    })
    .catch(function(err) { reportError("Could not add plant child", err); });

  return false;
});

app.s.editChildForm.on('submit', function() {
  var formData = app.s.editChildForm.serializeObject();
  disableForm(app.s.editChildForm);

  var plantId = app.s.contentPlant.attr("data-plant-id");
  var child = {
    uuid: formData.editChildUuid,
    inDate: app.s.editChildInDate.datepicker("getDate"),
    outDate: app.s.editChildOutDate.datepicker("getDate"),
    inHeight: formData.editChildInHeight,
    outHeight: formData.editChildOutHeight,
    inQuality: formData.editChildInQuality,
    outQuality: formData.editChildOutQuality,
    room: formData.editChildRoom,
    production: formData.editChildProduction,
    defects: formData.editChildDefects,
    comments: formData.editChildComments,
    insertDate: formData.editChildInsertDate,
    lastModDate: new Date()   
  }

  app.db.plantsRepo.updateChild(plantId, child)
    .then(function(editedPlantChild) {
        app.v.populatePlantView(plantId);

        reportSuccess("Edited plant child", editedPlantChild);
        resetModals();
    })
    .catch(function(err) { reportError("Could not edit plant child", err); });
  return false;
});

app.s.delChildForm.on('submit', function() {
  var formData = app.s.delChildForm.serializeObject();
  disableForm(app.s.delChildForm);

  var plantId = app.s.contentPlant.attr("data-plant-id");
  var childUuid = formData.deleteChildUuid;

  app.db.plantsRepo.deleteChild(plantId, childUuid)      
    .then(function() {
        app.v.populatePlantView(plantId);

        reportSuccess("Deleted plant child", {plantId: plantId, childId: childUuid});
        resetModals();
    })
    .catch(function(err) {reportError("Could not delete plant child", err); });
  return false;
});

/*
 * Stats content event handlers
 */
var reportEntryFactory = {
  "total-children-production": {
    getDateDimension: function(child){return child.outDate;},
    getData: function(child){return parseInt(child.production); },
    reduce: function(entry){
      if(entry["total-children-production"] === undefined){
        return 0;
      }
      else{
        return entry["total-children-production"];
      }
    }
  },
  "avg-children-production": {
    getDateDimension: function(child){return child.outDate;},
    getData: function(child){return parseInt(child.production); },
    reduce: function(entry){
      if(entry["avg-children-production"] === undefined){
        return 0;
      }
      else{
        return entry["avg-children-production-count"] === 0 ? 0 : entry["avg-children-production"]/entry["avg-children-production-count"];
      }
    }
  },
  "avg-in-quality": {
    getDateDimension: function(child){return child.inDate;},
    getData: function(child){return parseInt(child.inQuality); },
    reduce: function(entry){
      if(entry["avg-in-quality"] === undefined){
        return 0;
      }
      else{
        return entry["avg-in-quality-count"] === 0 ? 0 :entry["avg-in-quality"]/entry["avg-in-quality-count"];
      }
    }
  },
  "avg-out-quality": {
    getDateDimension: function(child){return child.outDate;},
    getData: function(child){return parseInt(child.outQuality); },
    reduce: function(entry){
      if(entry["avg-out-quality"] === undefined){
        return 0;
      }
      else{
        return entry["avg-out-quality-count"] === 0 ? 0 :entry["avg-out-quality"]/entry["avg-out-quality-count"];
      }
    }
  },
  "avg-in-height": {
    getDateDimension: function(child){return child.inDate;},
    getData: function(child){return parseInt(child.inHeight); },
    reduce: function(entry){
      if(entry["avg-in-height"] === undefined){
        return 0;
      }
      else{
        return entry["avg-in-height-count"] === 0 ? 0 :entry["avg-in-height"]/entry["avg-in-height-count"];
      }
    }
  },
  "avg-out-height": {
    getDateDimension: function(child){return child.outDate;},
    getData: function(child){return parseInt(child.outHeight); },
    reduce: function(entry){
      if(entry["avg-out-height"] === undefined){
        return 0;
      }
      else{
        return entry["avg-out-height-count"] === 0 ? 0 :entry["avg-out-height"]/entry["avg-out-height-count"];
      }
    }
  }
};

var dateFormatAssociations = {
  "D": {parseFormat: "DD/MM/YYYY", displayFormat: "dd/mm/yyyy",addition: "days", viewChange: 0},
  "M": {parseFormat: "MM/YYYY", displayFormat: "mm/yyyy", addition: "months", viewChange: 1},
  "Y": {parseFormat: "YYYY", displayFormat: "yyyy", addition: "years", viewChange: 2}
};

app.s.plantStatsDatePeriod.find("select").on("change", function(e){
  var selected = $(this).val();
  var periodFormatSettings = dateFormatAssociations[selected];
  app.s.plantStatsDateFrom.datepicker('remove');
  app.s.plantStatsDateFrom.datepicker({
    format: periodFormatSettings.displayFormat,
    startView: periodFormatSettings.viewChange, 
    minViewMode: periodFormatSettings.viewChange
  });
  app.s.plantStatsDateFrom.datepicker("update", moment(new Date()).subtract(7, periodFormatSettings.addition).format(periodFormatSettings.parseFormat));

  app.s.plantStatsDateTo.datepicker('remove');
  app.s.plantStatsDateTo.datepicker({
    format: periodFormatSettings.displayFormat,
    startView: periodFormatSettings.viewChange, 
    minViewMode: periodFormatSettings.viewChange
  });
  app.s.plantStatsDateTo.datepicker("update", moment(new Date()).format(periodFormatSettings.parseFormat));
})
app.s.plantStatsForm.on('submit', function(){
  var formData = app.s.plantStatsForm.serializeObject();
  disableForm(app.s.plantStatsForm);

  var plantId = app.s.contentPlant.attr("data-plant-id");
  var periodReporting = formData.plantStatsDateReporting;
  var periodFormat = dateFormatAssociations[periodReporting];
  var dateFrom = moment(formData.plantStatsDateFrom, periodFormat.parseFormat);
  var dateTo = moment(formData.plantStatsDateTo, periodFormat.parseFormat);
  var desiredReports = formData.plantStatsLines;
  if(desiredReports !== undefined && !Array.isArray(desiredReports)){
    desiredReports = [desiredReports];
  }
  if(!Array.isArray(desiredReports) || desiredReports.length === 0){
    reportError("Could not generate report - no checkbox selected");
    enableForm(app.s.plantStatsForm);
    return false;
  }

  app.db.plantsRepo.getChildren(plantId)
    .then(function(children){
      var reportingRows = []; 
      for(var currentDate = dateFrom; currentDate <= dateTo; currentDate.add(1, periodFormat.addition)){
        var row = {date: currentDate.format(periodFormat.parseFormat)};
        for(var indexDimension = 0; indexDimension < desiredReports.length; indexDimension++){
          var dimension = desiredReports[indexDimension];
          row[dimension] = 0;
          row[dimension + "-count"] = 0;
        }
        reportingRows.push(row);
      }

      //process each child
      for(var childIndex = 0; childIndex < children.length; childIndex++){
        var child = children[childIndex];
        //process each reporting dimension
        for(var indexDimension = 0; indexDimension < desiredReports.length; indexDimension++){
          var dimension = desiredReports[indexDimension];
          var dimensionFactory = reportEntryFactory[dimension];
          //get date
          var dateDimension = dimensionFactory.getDateDimension(child);
          //if date dimension is in reporting range
          var reportingRow = undefined;
          if(dateDimension != undefined){
            var dateDimensionString = moment(dateDimension).format(periodFormat.parseFormat);
            reportingRow = _.find(reportingRows, function(row){return row.date === dateDimensionString;});
          }
          if(reportingRow != undefined){
            var data = dimensionFactory.getData(child);
            if(!isNaN(data)){
              //within reporting range
              reportingRow[dimension] += data;
              reportingRow[dimension + "-count"] += 1;
            }
          }
        }
      }

      var headers = [];
      for(var reportingIndex = 0; reportingIndex < reportingRows.length; reportingIndex++){
          headers.push(reportingRows[reportingIndex].date);
        }

      var datasets = [];
      for(var indexDimension = 0; indexDimension < desiredReports.length; indexDimension++){
        var dimension = desiredReports[indexDimension];
        var dimensionFactory = reportEntryFactory[dimension];

        var reducedRow = [];
        for(var reportingIndex = 0; reportingIndex < reportingRows.length; reportingIndex++){
          reducedRow.push(dimensionFactory.reduce(reportingRows[reportingIndex]));
        }

        datasets.push({data: reducedRow, label: dimension, borderColor: randomColor()});
      }
      var canvas = document.getElementById('curve_chart');
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      var myLineChart = new Chart(canvas, {
        type: 'line',
        data: {
          labels: headers,
          datasets: datasets
        }
      });
      reportSuccess("Generated report", data);
      enableForm(app.s.plantStatsForm);
    })
    .catch(function(err) { 
      reportError("Could not retrieve plant children", err); 
    });

  return false;
});

app.l('Event handlers set');

//todo: implementar toastr messages
//todo: filter form to db data
//todo: implementar loading spinners within modals
//todo: build up plants stats by date range
//todo: pick date range -> filter plants stats by date range
//todo: update genetics combobox at start app and at adding genetics form any form

$.fn.serializeObject = function() {var o = {};var a = this.serializeArray();$.each(a, function() {if (o[this.name] !== undefined) {if (!o[this.name].push) {o[this.name] = [o[this.name]];}o[this.name].push(this.value || '');} else {o[this.name] = this.value || '';}});return o;};
moment.locale('es');

//init datatables 
app.s.plantChildrenDatatable = app.s.plantChildrenTable.DataTable({
  "autoFill": true,
  "colReorder": true,
  "responsive": {
    "details": {
      "type": 'column' //first column displays "show more" control element
    }
  },
  "columnDefs": [
    {
      "render": function (data, type, row) { return data !== null ? moment(data).format("DD/MM/YYYY") : ""; },
      "targets": [2,3] //format date columns
    },
    {
      "render": function (data, type, row) { return "<span class='uuid'>" + data + "</span>"; },
      "visible": function() { return app.config.env !== 'dev'; },
      "searchable": false,
      "targets": [1] //hide uuid column
    },
    {
      "render": function (data, type, row) { 
        return '<span class="fa-stack btn-open-edit-child-modal" child-uuid="' + data + '">' +
          '<i class="fa fa-square fa-stack-2x"></i>' +
          '<i class="fa fa-pencil fa-stack-1x fa-inverse"></i>' +
        '</span>';
      },
      "searchable": false,
      "targets": [12]   
    },
    {
      "render": function (data, type, row) { 
        return '<span class="fa-stack btn-open-delete-child-modal" child-uuid="' + data + '">' +
          '<i class="fa fa-square fa-stack-2x"></i>' +
          '<i class="fa fa-times fa-stack-1x fa-inverse"></i>' +
        '</span>';
      },
      "searchable": false,
      "targets": [13]   
    }
  ],
  "columns": [
    {
      "className": 'control',
      "orderable": false,
      "data": null,
      "defaultContent":
        '<span class="fa-stack btn-details-child">' +
          '<i class="fa fa-square fa-stack-2x"></i>' +
          '<i class="fa fa-info fa-stack-1x fa-inverse"></i>' +
        '</span>'
    },
    { "data": 'UUID' },
    { "data": 'Fecha entrada' },
    { "data": 'Fecha salida'},
    { "data": 'Altura entrada' },
    { "data": 'Altura salida' },
    { "data": 'Calidad entrada' },
    { "data": 'Calidad salida' },
    { "data": 'Sala' },
    { "data": 'Producción' },
    { 
      "data": 'Defectos',
      "orderable": false,
      "searchable": false,
      "className": 'none' //this column is always hidden and it will be shown within a child row instead
    },
    { 
      "data": 'Comentarios',
      "orderable": false,
      "searchable": false,
      "className": 'none' //this column is always hidden and it will be shown within a child row instead
    },
    {
      "data": "UUID",
      "orderable": false,
      "searchable": false,
      "defaultContent": "error"
    },
    {
      "data": "UUID",
      "orderable": false,
      "searchable": false,
      "defaultContent": "error"
    }
  ],
  'order': [[2, 'desc']]
});
// app.s.childDatatable.DataTable();
app.l('Datatables initialized');

var datepickerOptions = {
  language: 'es',
  endDate: "0d",
  autoclose: true,
  clearBtn: true
}
$.fn.datepicker.dates['es'] = {
  days: moment.weekdays(),
  daysShort: moment.weekdaysShort(),
  daysMin: moment.weekdaysMin(),
  months: moment.months(),
  monthsShort: moment.monthsShort(),
  today: "Today",
  clear: "Cancelar",
  format: 'dd/mm/yyyy',
  weekStart: moment.localeData().firstDayOfWeek(),
  showOnFocus: false
};
app.s.addChildInDate.datepicker(datepickerOptions);
app.s.addChildOutDate.datepicker(datepickerOptions);
app.s.editChildInDate.datepicker(datepickerOptions);
app.s.editChildOutDate.datepicker(datepickerOptions);
app.s.plantStatsDateFrom.datepicker(datepickerOptions);
app.s.plantStatsDateFrom.datepicker('setDate', moment(new Date()).subtract(7, "days").format("DD/MM/YYYY"));
app.s.plantStatsDateTo.datepicker(datepickerOptions);
app.s.plantStatsDateTo.datepicker('setDate', moment(new Date()).format("DD/MM/YYYY"));
app.s.plantChildrenTableInDateFilter.datepicker(datepickerOptions);
app.s.plantChildrenTableOutDateFilter.datepicker(datepickerOptions);
app.l('Datepickers initialized');

app.db.options.count({}, function (err, count) {
  if (count === 0) {
    app.l('Initializing datastores for the first time', 'DB');
    app.db.options.insert({name: 'firstRun', value: false, insertDate: new Date()}, function (err) {
      if (err) { app.l('Unable to insert firstRun doc in options datastore with error: ' + err, 'DB'); }
    });

    app.l('Adding indexes to datastores', 'DB');
    app.db.genetics.ensureIndex({ fieldName: 'name', unique: true }, function (err) {
      if (err) { app.l('Unable to set name fields as an index with unique constraint, with error: ' + err, 'DB'); }
    });

    if (app.c.env === 'dev' || app.c.env === 'development') {
      app.db.runSeeder()
        .then(function () { app.l('Datastores seeded without errors', 'DB'); })
        .catch(function (err) { app.l('Unable to seed datastores, with error: ' + err); })
        .then(app.v.populateLeftMenu)
        .then(app.v.populateGenetics)
        .then(function () {app.l('Views populated with datastores data');})
        .catch(function (err) {app.l('Unable to populate views with datastore data, with error: ' + err);});
    }
  } else {
    app.v.populateLeftMenu()
      .then(app.v.populateGenetics)
      .then(function () {app.l('Views populated with datastores data');})
      .catch(function (err) {app.l('Unable to populate views with datastore data, with error: ' + err);});
  }
});

$(function() {
  //todo: remove splash screen
});

app.l('App initialized', 'DB');
