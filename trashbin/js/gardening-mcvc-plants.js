var Plant = Backbone.Model.extend({
  idAttribute: '_id',
  sync: BackbonePouch.sync({
    db: new PouchDB('gardening')
  }),
  defaults : {
    _id: "",
    name: "",
    number: 0,
    gen: "",
    origin: ""
  }
});

var Plants = Backbone.Collection.extend({
  model : Plant,
  sync: BackbonePouch.sync({
    db: new PouchDB('gardening'),
    fetch: 'query',
    options: {
      query: {
        include_docs: true,
        fun: {
          map: function(doc, emit) {
            if (doc.type === 'post') {
              emit(doc.position, null)
            }
          }
        },
        limit: 10
      },
      changes: {
        include_docs: true,
        filter: function(doc) {
          return doc._deleted || doc.type === 'post';
        }
      }
    }
  }),
  parse: function(result) {
    return _.pluck(result.rows, 'doc');
  }
});

//var PlantsController = Backbone.Controller.extend({
//  createPlant: createPlant(plant),
//  readPlant: readPlant(id),
//  readAllPlants: readAllPlants(),
//  updatePlant: updatePlant(id, newPlant),
//  deletePlant: deletePlant(id)
//});

var PlantsList = Backbone.View.extend({
  el: "#plants-ul",
  template: _.template($('plant-li-template').html()),

  events: {
    "click .button.name":   "openPlantPage",
    "click .button.edit":   "openEditModal",
    "click .button.delete": "openDeleteModal"
  },

  initialize: function() {
    this.render = _.bind(this.render, this);
    this.model.bind('change', this.render);
  },

  render: function(eventName) {
    _.each(this.model.models, function(plant){
      var plantTemplate = this.template(plant.toJSON());
      $(this.el).append(plantTemplate);
    }, this);

    return this;
  }
});
