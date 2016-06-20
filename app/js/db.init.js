var NeDB = require('nedb');
app.l('NeDB database node module required', 'Node');

app.l('Initializing NeDB datastores', 'DB');
app.db = {
  options: new NeDB({ filename: '../datastores/options.db', autoload: true }),
  genetics: new NeDB({ filename: '../datastores/genetics.db', autoload: true }),
  plants: new NeDB({ filename: '../datastores/plants.db', autoload: true }),
  children: new NeDB({ filename: '../datastores/children.db', autoload: true })
};

//todo: fix new plants not setting a random genId properly
//todo: refactor this callback nightmare with promises, eg
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
//Example:
//var p1 = new Promise(function(resolve, reject) {
//  window.setTimeout(function() {
//    resolve(thisPromiseCount)
//  }, 2000);
//});
//p1.then(function(val) {
//  console.log(val);
//});
app.db.options.count({}, function (err, count) {
  if(count === 0) {
    app.l('Initializing datastores for the first time', 'DB');
    app.db.options.insert({ name: 'firstRun', value: false, insertDate: new Date() }, function (err) {
      if(err) {
        app.l('Unable to insert firstRun doc in options datastore with error: '+err, 'DB');
      }
    });

    if(app.c.env === 'dev' || app.c.env === 'development') {
      app.l('Developer mode detected, seeding database', 'DB');

      // Faker init
      var faker = require('faker');
      app.l('Faker node module required', 'Node');

      // Genetics seeder
      var genCount = 0;
      app.l('Seeding genetics...', 'DB');
      _.times(app.c.seeder.genetics, function() {

        app.db.genetics.insert({
          name: faker.lorem.word(),
          insertDate: new Date(),
          lastModDate: new Date()
        }, function (err) {
          if(err) {
            app.l('Unable to insert gen doc in genetics datastore with error: '+err, 'DB');
          }
          genCount++;
          if(genCount >= app.c.seeder.genetics) {
            app.l('Done seeding genetics.', 'DB');
            
            app.l('Seeding plants and its children...', 'DB');
            var plantsCount = 0;
            var childrenCount = 0;
            var qualities = ['very bad', 'bad', 'regular', 'good', 'very good'];
            
            // Plants seeder
            _.times(app.c.seeder.plants, function() {
              var randomGen;
              var nGens = Math.floor(Math.random() * (app.c.seeder.genetics - 1));
              app.db.genetics.find({}).skip(nGens).limit(1).exec(function (err, docs) {
                if(err) {
                  app.l('Unable to find random gen in genetics datastore with error: '+err, 'DB');
                }
                
                randomGen = _.first(docs);

                var newPlantId;
                app.db.plants.insert({
                  name: faker.commerce.productName(),
                  number: Math.floor(Math.random()*99)+1, //random int from 1 to 100
                  genId: randomGen._id,
                  origin: faker.address.country(),
                  insertDate: new Date(),
                  lastModDate: new Date()
                }, function (err, newPlant) {
                  var plantChildrenCount = 0;
                  
                  if(err) {
                    app.l('Unable to insert plant doc in plants datastore with error: '+err, 'DB');
                  }
                  plantsCount++;
                  if(plantsCount >= app.c.seeder.plants) {
                    app.l('Done seeding plants.', 'DB');
                  }

                  newPlantId = newPlant._id;

                  // Plant > Children seeder
                  _.times(app.c.seeder.childrenPerPlant, function() {
                    var childIsOutProbability, childIsOut, outDate, outHeight, outQuality, production;
                    outDate = outHeight = outQuality = production = null;

                    childIsOutProbability = 0.8;
                    childIsOut = Math.random();
                    if(childIsOut > (1-childIsOutProbability)) {
                      outDate = faker.date.recent();
                      outHeight = Math.floor(Math.random()*130)+20; //20 - 150 cm
                      outQuality = _.sample(qualities);
                      production = Math.floor(Math.random()*49)+1; //1 - 50 kg
                    }

                    app.db.children.insert({
                      plantId: newPlantId,
                      inDate: faker.date.past(),
                      outDate: outDate,
                      inHeight: Math.floor(Math.random()*19)+1, // 1 - 19 cm
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
                      if(err) {
                        app.l('Unable to insert child doc in plants datastore with error: '+err, 'DB');
                      }

                      plantChildrenCount++;
                      if(plantChildrenCount >= app.c.seeder.childrenPerPlant) {
                        plantChildrenCount = 0;
                      }

                      childrenCount++;
                      if(childrenCount >= (app.c.seeder.childrenPerPlant * app.c.seeder.plants)) {
                        app.l('Done seeding children.', 'DB');
                      }
                    });
                  });
                });
              });
            });
          }
        });
      });
    }
  }
});

app.l('Database initialized', 'DB');
