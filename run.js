var NwjsBuilder = require('nwjs-builder');

var version = '0.15.4-sdk';

NwjsBuilder.commands.nwbuild(['./app/'], {
  run: true,
  version: version
}, function(err, code) {
  if(err) throw err;
  else if(code == 233) return done();
  else throw new Error('ERROR_EXIT_CODE_UNEXPECTED');
});