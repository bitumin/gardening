var app = app || {};

app.config = app.c = {
  appName: 'Gardening Tools',
  env: 'dev', //dev, pre, pro
  inAnimation: 'fadeIn',
  outAnimation: 'fadeOut',
  seeders: {
    genetics: 50,
    plants: 25,
    childrenPerPlant: 10,
    childIsOutProbability: 0.8
  }
};

app.start = new Date().getTime();
app.execTime = function() {
  return new Date().getTime() - app.start;
};

app.log = app.l = function(msg, mode) {
  if(typeof mode === 'undefined')
    mode = 'Notice';
  if(app.c.env === 'dev')
    console.log(s.lpad(app.execTime(), 8, '0')+' '+app.config.appName+' ['+mode+']: '+msg);
};

//todo: to main init script
if(app.config.env === 'dev') {
  app.l('Developer mode is ON', 'Warning');
}

app.l('Initializing app...');
