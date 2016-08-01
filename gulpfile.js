'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var pump = require('pump');
var browserify = require('browserify');
var tap = require('gulp-tap');
var buffer = require('gulp-buffer');

// var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
// var sourcemaps = require('gulp-sourcemaps');

var jsFiles = {
  node_modules: [
      {name: "jquery/dist/jquery.min.js"},
      {name: "underscore/underscore-min.js"}, 
      // "underscore.string/dist/underscore.string.min.js"},
      {name: "bootstrap/dist/js/bootstrap.min.js"},
      {name: "bootstrap-datepicker/dist/js/bootstrap-datepicker.min.js"},
      {name: "datatables/media/js/jquery.dataTables.min.js"},
      {folder: "datatables-responsive/js/", name: "dataTables.responsive.js"},
      {folder: "chart.js/dist/", name: "Chart.js"},
      {name: "moment/min/moment-with-locales.min.js"},
      {name: "moment-timezone/builds/moment-timezone-with-data.min.js"},
      {name: "easy-autocomplete/dist/jquery.easy-autocomplete.js"},
      {name: "node-uuid/uuid.js"}, 
      {name: "toastr/build/toastr.min.js"},
      {name: "randomcolor/randomColor.js"}
      ],
  other: ["google-charts-loader.min.js"],
  app: [
      "app.log.js",
      "app.config.js",
      "app.selectors.js",
      "app.db.js",
      "app.view-handlers.js",
      "app.event-handlers.js",
      "app.init.js"
  ]
};

var npmModules = [];
for(var index = 0; index < jsFiles.node_modules.length; index++){ 
  var path = "./app/node_modules/";
  if(jsFiles.node_modules[index].folder) 
    path = path + jsFiles.node_modules[index].folder;
    path = path + jsFiles.node_modules[index].name;
  npmModules.push(path); 
}
for(var index = 0; index < jsFiles.other.length; index++){ 
  npmModules.push("./app/external_scripts/" + jsFiles.other[index].name); 
}
//gutil.log("Found the following npm modules: " + npmModules);

var appModules = [];
for(var index = 0; index < jsFiles.app.length; index++){appModules.push("./app/js/" + jsFiles.app[index]);}
//gutil.log("Found the following app modules: " + appModules);

gulp.task('external-js-min', function(callback) {
  pump([
    gulp.src(npmModules),
    tap(function (file) {
      if(jsFiles.node_modules[file.path] !== undefined && jsFiles.node_modules[file.path].browserify === true)
        file.contents = browserify(file.path, {debug: true}).bundle();
    }),
    buffer(),
    concat('external.min.js'),
    gulp.dest('./app/dist/')
  ], callback);
});
gulp.task('internal-js', function(callback) {
  pump([
    gulp.src(appModules),
    concat('own.js'),
    gulp.dest('./app/dist/')
  ], callback);
});
gulp.task('internal-js-min', function(callback) {
  pump([
    gulp.src(appModules),
    concat('own.min.js'),
    uglify(),
    gulp.dest('./app/dist/')
  ], callback);
});
gulp.task('sass', function (callback) {
  pump([
    gulp.src('./app/css/styles.scss'),
    sass().on('error', sass.logError),
    gulp.dest('./app/css/')
  ], callback);
});

gulp.task('default', ['internal-js', 'internal-js-min', 'external-js-min', 'sass']);