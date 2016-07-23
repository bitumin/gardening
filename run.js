var NwjsBuilder = require('nwjs-builder');
var env = require('./env');

NwjsBuilder.commands.nwbuild(['./app/'], {
  run: true,
  version: env.nwjsVersion
}, function(err, code) {
  if(err) throw err;
  else if(code == 233) return done();
  else throw new Error('ERROR_EXIT_CODE_UNEXPECTED');
});
