var NwjsBuilder = require('nwjs-builder');
var env = require('./env');

NwjsBuilder.commands.nwbuild('./app/', {
  version: env.nwjsVersion,
  platforms: 'linux64,osx64,win64',
  outputDir: './build/' + env.nwjsVersion,
  includes: [
    ['./', 'README.md', './'] // cp -r ./README.md ${DIR_BUILD}/README.md
  ],
  withFfmpeg: false,
  sideBySide: false,
  production: false,
  macIcns: './icons/dummy.icns',
  winIco: './icons/dummy.ico'
}, function(err) {
  if(err) throw err;
});
