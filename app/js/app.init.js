var app = app || {};

app.config = app.c = {
  appName: 'GardeningTools',
  env: 'dev', //dev, pre, pro
  inAnimation: 'fadeIn',
  outAnimation: 'fadeOut',
  seeder: {
    genetics: 50,
    plants: 25,
    childrenPerPlant: 10
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

app.switchView = function(contentEl) {
  if(! contentEl.attr('id').startsWith('content-'))
    return;
  
  if(contentEl.is(':hidden')) {
    app.s.content.children()
      .filter(function() {
        return $(this).is(':visible');
      })
      .hide()
      .removeClass(app.c.inAnimation);

    contentEl.addClass(app.c.inAnimation).show();
  }
};

if(app.config.env === 'dev')
  app.l('Developer mode is ON', 'Warning');

app.l('Initializing app...');