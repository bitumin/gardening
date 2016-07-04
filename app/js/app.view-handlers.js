app.view = app.v = {};
app.v.switchView = function(contentEl) {
  if(! contentEl.attr('id').startsWith('content-'))
    return;

  if(contentEl.is(':hidden')) {
    app.s.content.children()
      .filter(function() {
        return $(this).is(':visible');
      })
      .hide()
      .removeClass(app.c.inAnimation);

    contentEl.addClass(app.c.inAnimation).show();
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
