define(['router', 'backbone/backbone'], function(router, Backbone) {
  var initialize = function() {
    // todo: menu has all existing plants loaded
    // todo: content has the empty welcome screen
    Backbone.history.start();
  };

  return {
    initialize: initialize
  };
});