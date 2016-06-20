//todo: comprobar que children, plants y gens se han seedeado correctamente

var NeDB = require('nedb');
app.l('NeDB database node module required', 'Node');

app.l('Initializing NeDB datastores', 'DB');
app.db = {
  options: new NeDB({ filename: '../datastores/options.db', autoload: true }),
  genetics: new NeDB({ filename: '../datastores/genetics.db', autoload: true }),
  plants: new NeDB({ filename: '../datastores/plants.db', autoload: true }),
  children: new NeDB({ filename: '../datastores/children.db', autoload: true })
};

// DB helpers
app.db.getRandomDoc = function(datastore) {
  return new Promise(function(resolve, reject) {
    app.db[datastore].count({}, function (err, count) {
      if (err) {
        reject(Error('Unable to seed children datastore, with error: '+err));
      } else {
        var randomPos = Math.floor(Math.random() * (count - 2)) + 1;
        
        app.db[datastore].find({}).skip(randomPos).limit(1).exec(function (err, docs) {
          if (err) {
            reject(Error('Unable to obtain a random doc from '+datastore+', with error: '+err));
          } else {
            resolve(_.first(docs));
          }
        });
      }
    });
  });
};

// Seeders
app.db.seeders = {};

app.db.seeders.genetics = function() {
  app.l('Seeding genetics...', 'DB');
  var faker = require('faker');
  var counter = 0;

  return new Promise(function(resolve, reject) {
    _.times(app.c.seeders.genetics, function() {

      app.db.genetics.insert({
        name: faker.lorem.word(),
        insertDate: new Date(),
        lastModDate: new Date()
      }, function(err) {
        if(err) {
          reject(Error('Unable to seed genetics datastore, with error: '+err));
        }
        counter++;
        if(counter >= app.c.seeders.genetics) {
          resolve();
        }
      });

    });
  });
};

app.db.seeders.plants = function() {
  app.l('Seeding plants...', 'DB');
  var faker = require('faker');
  var counter = 0;

  return new Promise(function(resolve, reject) {
    _.times(app.c.seeders.plants, function () {

      app.db.getRandomDoc('genetics').then(function(gen) {
        app.db.plants.insert({
          name: faker.commerce.productName(),
          number: Math.floor(Math.random() * 99) + 1, //random int from 1 to 100
          genId: gen._id,
          origin: faker.address.country(),
          insertDate: new Date(),
          lastModDate: new Date()
        }, function(err) {
          if(err) {
            reject(Error('Unable to seed plants datastore, with error: '+err));
          }
          counter++;
          if(counter >= app.c.seeders.plants) {
            resolve();
          }
        });
      });

    });
  });
};

app.db.seeders.children = function() {
  app.l('Seeding children...', 'DB');
  var faker = require('faker');
  var counter = 0;

  return new Promise(function(resolve, reject) {
    app.db.plants.find({}, function (err, docs) {
      if (err) {
        reject(Error('Unable to retrieve plants, children seeders aborted with error: '+err));
      } else {
        _.each(docs, function(doc) {
          _.times(app.c.seeders.childrenPerPlant, function () {
            var childIsOutProbability, outDate, outHeight, outQuality, production;

            //Some children are out (have been gathered), the rest are still in (growing)
            childIsOutProbability = app.c.seeders.childIsOutProbability;
            outDate = outHeight = outQuality = production = null;

            if (Math.random() < childIsOutProbability) {
              outDate = faker.date.recent();
              outHeight = Math.floor(Math.random() * 130) + 20; //20 - 150 cm
              outQuality = _.sample(qualities);
              production = Math.floor(Math.random() * 49) + 1; //1 - 50 kg
            }

            app.db.children.insert({
              plantId: doc._id,
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
              lastModDate: new Date()
            }, function (err) {
              if (err) {
                reject(Error('Unable to seed children datastore, with error: '+err));
              }
              counter++;
              if (counter >= (app.c.seeders.childrenPerPlant * app.c.seeders.plants)) {
                resolve();
              }
            });
          });
        });
      }
    });
  });
};

// Seeders wrapper
app.db.seed = function() {
  app.db.seeders.genetics()
    .then(app.db.seeders.plants)
    .then(app.db.seeders.children)
    .then(function () { app.l('Seeding done without errors', 'DB'); })
    .catch(function(err) { app.l('Seeding aborted with catched error: '+err, 'DB'); });
};

// Main db init script
app.db.options.count({}, function (err, count) {
  if(count === 0) {
    app.l('Initializing datastores for the first time', 'DB');
    app.db.options.insert({ name: 'firstRun', value: false, insertDate: new Date() }, function (err) {
      if(err) {
        app.l('Unable to insert firstRun doc in options datastore with error: '+err, 'DB');
      }
    });

    if(app.c.env === 'dev' || app.c.env === 'development') {
      app.l('Developer mode detected, seeding database...', 'DB');
      app.db.seed();
    }
  }
});

app.l('Database initialized', 'DB');
