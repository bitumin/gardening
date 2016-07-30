app.config = app.c = {
  appName: 'Gardening Tools',
  env: 'dev', //dev, pre, pro
  inAnimation: 'fadeIn',
  outAnimation: 'fadeOut',
  seeders: {
    genetics: 50,
    plants: 10,
    childrenPerPlant: 200,
    childIsOutProbability: 0.8
  }
};

//todo: to main init script
if(app.config.env === 'dev') {
  app.l('Developer mode is ON', 'Warning');
}

app.l('App config set');
