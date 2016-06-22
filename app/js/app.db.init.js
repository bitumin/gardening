var NeDB = require('nedb');
app.l('NeDB database node module required', 'Node');

app.l('Initializing NeDB datastores', 'DB');
app.db = {
  options: new NeDB({filename: '../datastores/options.db', autoload: true}),
  genetics: new NeDB({filename: '../datastores/genetics.db', autoload: true}),
  plants: new NeDB({filename: '../datastores/plants.db', autoload: true})
};

// DB helpers
app.db.countDocs = function (datastore) {
  return new Promise(function (resolve, reject) {
    app.db[datastore].count({}, function (err, count) {
      if (err) {
        reject(Error('Unable to count docs from ' + datastore + ', with error: ' + err));
      } else {
        resolve(count);
      }
    });
  });
};
app.db.getDocByPosition = function (position, datastore) {
  return new Promise(function (resolve, reject) {
    app.db[datastore].find({}).skip(position).limit(1).exec(function (err, docs) {
      if (err) {
        reject(Error('Unable to obtain doc with position ' + position + ' from ' + datastore + ', with error: ' + err));
      } else {
        resolve(_.first(docs));
      }
    });
  });
};
app.db.getRandomDoc = function (datastore) {
  return new Promise(function (resolve, reject) {
    app.db.countDocs(datastore)
      .then(function (n) {
        return Math.floor(Math.random() * (n - 2));
      })
      .then(function (randomPos) {
        return app.db.getDocByPosition(randomPos, datastore);
      })
      .then(function (doc) {
        resolve(doc);
      })
      .catch(function (err) {
        reject(Error('Unable to obtain a random doc from ' + datastore + ', with error: ' + err));
      });
  });
};
app.db.getAllDocs = function (datastore) {
  return new Promise(function (resolve, reject) {
    app.db[datastore].find({}, function (err, docs) {
      if (err) {
        reject(Error('Unable to all docs from datastore ' + datastore + ', with error: ' + err));
      } else {
        resolve(docs);
      }
    })
  });
};
app.db.removeAllDocs = function (datastores) {
  return new Promise(function (resolve, reject) {
    if (typeof datastores === 'string') {
      app.db[datastores].remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
          reject(Error('Unable to delete all docs from ' + datastores + ', with error: ' + err));
        } else {
          resolve(numRemoved);
        }
      });
    } else if (_.isArray(datastores)) {
      _.each(datastores, function (datastore) {
        app.db[datastore].remove({}, {multi: true}, function (err, numRemoved) {
          if (err) {
            reject(Error('Unable to all docs from ' + datastores.join(', ') + ', with error: ' + err));
          } else {
            resolve(numRemoved);
          }
        });
      });
    }
  });
};

// Seeders
app.db.seeders = {};
app.db.seeders.genetics = function () {
  app.l('Seeding genetics...', 'DB');
  return new Promise(function (resolve, reject) {
    var faker = require('faker');
    var counter = 0;

    _.times(app.c.seeders.genetics, function () {
      app.db.genetics.insert({
        name: faker.lorem.word(),
        insertDate: new Date(),
        lastModDate: new Date()
      }, function (err) {
        if (err) {
          reject(Error('Unable to seed genetics datastore, with error: ' + err));
        }
        counter++;
        if (counter >= app.c.seeders.genetics) {
          resolve();
        }
      });
    });
  });
};
app.db.seeders.plants = function () {
  app.l('Seeding plants...', 'DB');
  return new Promise(function (resolve, reject) {
    var faker = require('faker');
    var counter = 0;

    _.times(app.c.seeders.plants, function () {
      app.db.getRandomDoc('genetics').then(function (gen) {
        app.db.plants.insert({
          name: faker.commerce.productName(),
          number: Math.floor(Math.random() * 99) + 1, //random int from 1 to 100
          gen: gen.name,
          origin: faker.address.country(),
          insertDate: new Date(),
          lastModDate: new Date()
        }, function (err) {
          if (err) {
            reject(Error('Unable to seed plants datastore, with error: ' + err));
          }
          counter++;
          if (counter >= app.c.seeders.plants) {
            resolve();
          }
        });
      });
    });
  });
};
app.db.seeders.children = function () {
  app.l('Seeding children...', 'DB');

  return new Promise(function (resolve, reject) {
    var faker = require('faker');
    var counter = 0;
    var qualities = ['extremely bad','very bad','bad','normal','fine','good','very good','excellent'];
    
    app.db.getAllDocs('plants').then(function (plants) {
      _.each(plants, function (plant) {
        _.times(app.c.seeders.childrenPerPlant, function () {

          //Some children are out (have been gathered), the rest are still in (growing)
          var childIsOutProbability = app.c.seeders.childIsOutProbability;
          var outDate, outHeight, outQuality, production;
          outDate = outHeight = outQuality = production = null;

          if (Math.random() < childIsOutProbability) {
            outDate = faker.date.recent();
            outHeight = Math.floor(Math.random() * 130) + 20; //20 - 150 cm
            outQuality = _.sample(qualities);
            production = Math.floor(Math.random() * 49) + 1; //1 - 50 kg
          }

          app.db.plants.update(plant, { $push: { children: {
            inDate: faker.date.past(),
            outDate: outDate,
            inHeight: Math.floor(Math.random() * 19) + 1, // 1 - 19 cm
            outHeight: outHeight,
            inQuality: _.sample(qualities),
            outQuality: outQuality,
            room: faker.commerce.color(),
            production: production,
            defects: faker.lorem.sentence(),
            comments: faker.lorem.paragraph(),
            insertDate: new Date(),
            lastModDate: null
          } } }, {}, function (err) {
            if (err) {
              reject(Error('Unable to seed the children of plant ' + plant.name + ', with error: ' + err));
            }
            counter++;
            if (counter >= (app.c.seeders.childrenPerPlant * app.c.seeders.plants)) {
              resolve();
            }
          });

        });
      });
    });
  });
};

// Seeders wrapper
app.db.seed = function () {
  app.db.seeders.genetics()
    .then(app.db.seeders.plants)
    .then(app.db.seeders.children)
    .then(function () {
      app.l('Seeding done without errors', 'DB');
    })
    .catch(function (err) {
      app.l('Seeding aborted with error: ' + err, 'DB');
    });
};

// Main db init script
app.db.options.count({}, function (err, count) {
  if (count === 0) {
    app.l('Initializing datastores for the first time', 'DB');
    app.db.options.insert({name: 'firstRun', value: false, insertDate: new Date()}, function (err) {
      if (err) {
        app.l('Unable to insert firstRun doc in options datastore with error: ' + err, 'DB');
      }
    });
    if (app.c.env === 'dev' || app.c.env === 'development') {
      app.l('Developer mode detected, seeding database...', 'DB');
      app.db.seed();
    }
  }
});

app.l('Database initialized', 'DB');
