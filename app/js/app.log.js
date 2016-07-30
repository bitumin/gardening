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
