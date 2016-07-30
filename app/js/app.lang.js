app.lang.loadAllStrings = function() {
  var langTargets = $('[data-lang-key]');
  _.each(langTargets, function(el) {
    var $el = $(el);
    var strKey = $el.data('langKey');
    var strVal = app.lang.getString(strKey);
    strVal ? $el.html(strVal) : app.l('Unable to load string with key ' + strKey + '. String not found.', 'Lang');
  });
};

app.lang.getString = function(key) {
  return app.lang.strings[key];
};

app.lang.writeString = function(key) {
  var strVal = app.lang.getString(key);
  strVal ? document.write(strVal) : app.l('Unable to write string with key ' + key + '. String not found.', 'Lang');
};

app.lang.loadAllStrings();
app.l('App strings loaded.', 'Lang');
