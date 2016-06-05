var NwjsBuilder = require('nwjs-builder');

var version = '0.15.1-sdk';

NwjsBuilder.commands.nwbuild('./app/', {
  version: version,
  platforms: 'linux64',
  outputDir: './build/'+version,
  includes: [
    ['./', 'README.md', './'] // cp -r ./README.md ${DIR_BUILD}/README.md
  ],
  withFFmpeg: true,
  sideBySide: false,
  production: true,
  macIcns: './icons/dummy.icns',
  winIco: './icons/dummy.ico'
}, function(err) {
  if(err) throw err;
});
