/*
 * Helper
 */
  google.charts.setOnLoadCallback(function(){});
  google.charts.load('current', {'packages':['line']});
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

      var headers = ['Date'];
      for(var index = 0; index < desiredReports.length; index++){
        headers.push(desiredReports[index]);
      }

      var reducedData = [headers];
      for(var reportingIndex = 0; reportingIndex < reportingRows.length; reportingIndex++){
        var reportingRow = reportingRows[reportingIndex];
        var reducedRow = [reportingRow.date];

        for(var indexDimension = 0; indexDimension < desiredReports.length; indexDimension++){
          var dimension = desiredReports[indexDimension];
          var dimensionFactory = reportEntryFactory[dimension];

          reducedRow.push(dimensionFactory.reduce(reportingRow));
        }

        reducedData.push(reducedRow);
      }

      (function drawChart(reducedData) {
        var data = google.visualization.arrayToDataTable(reducedData);

        var options = {
          title: 'Gardening report',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.charts.Line(document.getElementById('curve_chart'));

        chart.draw(data, options);

        reportSuccess("Generated report", data);
        enableForm(app.s.plantStatsForm);
      })(reducedData);
    })
    .catch(function(err) { 
      reportError("Could not retrieve plant children", err); 
    });

  return false;
});

app.l('Event handlers set');
