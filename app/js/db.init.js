app.l('Initializing database', 'DB');

app.db = new Nedb({
  filename: app.c.storagePath + app.c.dbFilename
});

app.db.count({}, function (err, count) {
  app.l('Database is empty', 'DB');
  if(count === 0 && app.c.env === 'dev') {
    app.l('Developer mode detected, seeding database with fake data', 'DB');
    app.db.insert({ planet: 'Earth' }, function (err) {

    });
  }
});

app.l('Database is ready', 'DB');
