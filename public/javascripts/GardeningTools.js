define(['router', 'backbone/backbone'], function(router, Backbone) {
  var initialize = function() {
    // ensure that menu has all existing plants loaded
    // ensure content has the empty welcome screen
    Backbone.history.start();
  };

  return {
    initialize: initialize
  };
});