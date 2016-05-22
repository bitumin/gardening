var app = app || {};

app.config = app.c = {
  appName: 'GardeningTools',
  env: 'dev',
  slideInAnimation: 'slideInRight',
  slideOutAnimation: 'slideOutRight',
  storagePath: '../storage',
  dbFilename: 'gardening'
};

app.start = new Date().getTime();
app.execTime = function() {
  return new Date().getTime() - app.start;
};

app.log = app.l = function(msg, mode) {
  if(typeof mode === 'undefined')
    mode = 'Notice';
  console.log(s.lpad(app.execTime(), 6, '0')+' '+app.config.appName+' ['+mode+']: '+msg);
};

if(app.config.env === 'dev')
  app.l('Developer mode is ON', 'Warning');

app.l('Initializing app...');
