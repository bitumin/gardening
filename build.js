var NwBuilder = require('nw-builder');

var nw = new NwBuilder({
  files: './app/**/**',
  platforms: ['linux64'],
  version: 'latest',
  buildDir: './build',
  cacheDir: './cache'
});

nw.on('log',  console.log);

nw.build().then(function () {
  console.log('all done!');
}).catch(function (error) {
  console.error(error);
});
