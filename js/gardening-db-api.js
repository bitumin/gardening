/*
 * DATABASE CONFIG
 */

PouchDB.debug.enable('*'); //Enable debugging
var db = new PouchDB('gardening'); //Creates DB if does not exists, instantiate it if it exists, no need to provide Schema
console.log(db.adapter); //Which adapter am I using?
db.info().then(function(info) { console.log(info); }); //async db info retrieving

/*
 * DATABASE API
 */
function createPlant(plant) {
  db.put({
    _id: "plant"+new Date().toISOString(),
    name: plant.name || "",
    number: plant.number || 0,
    gen: plant.gen || "",
    origin: plant.origin || ""
  }).then(function (response) {
    console.log(response);
  }).catch(function (err) {
    console.log(err);
  });
}
function readPlant(id) {
  db.get(id).then(function (doc) {
    console.log(doc);
  }).catch(function (err) {
    console.log(err);
  });
}
function readAllPlants() {
  return db.allDocs({
    startkey: 'plant',
    endkey: 'plant\uffff'
  });
}
function updatePlant(id, newPlant) {
  db.get(id).then(function(oldPlant) {
    return db.put({
      _id: oldPlant._id,
      _rev: oldPlant._rev,
      name: newPlant.name || oldPlant.name,
      number: newPlant.number || oldPlant.number,
      gen: newPlant.gen || oldPlant.gen,
      origin: newPlant.origin || oldPlant.origin
    });
  }).then(function(response) {
    console.log(response);
  }).catch(function (err) {
    console.log(err);
  });
}
function deletePlant(id) {
  db.get(id).then(function(oldPlant) {
    return db.remove(oldPlant);
  }).then(function (result) {
    console.log(result);
  }).catch(function (err) {
    console.log(err);
  });
}

function createChild(child) {
  db.put({
    _id: "child"+new Date().toISOString(),
    name: child.name || "",
    in_at: child.in_at || "",
    out_at: child.out_at || "",
    height_in: child.height_in || 0,
    height_out: child.height_out || 0,
    quality_in: child.quality_in || "",
    quality_out: child.quality_out || "",
    room: child.room || "",
    production: child.production || 0,
    defects: child.defects || "",
    comments: child.comments || ""
  }).then(function (response) {
    console.log(response);
  }).catch(function (err) {
    console.log(err);
  });
}
function readChild(id) {
  db.get(id).then(function (doc) {
    console.log(doc);
  }).catch(function (err) {
    console.log(err);
  });
}
function readAllChildren() {
  return db.allDocs({
    startkey: 'child',
    endkey: 'child\uffff'
  });
}
function updateChild(id, newChild) {
  db.get(id).then(function(oldChild) {
    return db.put({
      _id: oldChild._id,
      _rev: oldChild._rev,
      name: newChild.name || oldChild.name,
      in_at: newChild.in_at || oldChild.in_at,
      out_at: newChild.out_at || oldChild.out_at,
      height_in: newChild.height_in || oldChild.height_in,
      height_out: newChild.height_out || oldChild.height_out,
      quality_in: newChild.quality_in || oldChild.quality_in,
      quality_out: newChild.quality_out || oldChild.quality_out,
      room: newChild.room || oldChild.room,
      production: newChild.production || oldChild.production,
      defects: newChild.defects || oldChild.defects,
      comments: newChild.comments || oldChild.comments
    });
  }).then(function(response) {
    console.log(response);
  }).catch(function (err) {
    console.log(err);
  });
}
function deleteChild(id) {
  db.get(id).then(function(oldChild) {
    return db.remove(oldChild);
  }).then(function (result) {
    console.log(result);
  }).catch(function (err) {
    console.log(err);
  });
}

function createGen(gen) {
  db.put({
    _id: "gen"+new Date().toISOString(),
    name: gen.name || ""
  }).then(function (response) {
    console.log(response);
  }).catch(function (err) {
    console.log(err);
  });
}
function readGen(id) {
  db.get(id).then(function (doc) {
    console.log(doc);
  }).catch(function (err) {
    console.log(err);
  });
}
function readAllGens() {
  return db.allDocs({
    startkey: 'gen',
    endkey: 'gen\uffff'
  });
}
function updateGen(id, newGen) {
  db.get(id).then(function(oldGen) {
    return db.put({
      _id: oldGen._id,
      _rev: oldGen._rev,
      name: newGen.name || oldGen.name
    });
  }).then(function(response) {
    console.log(response);
  }).catch(function (err) {
    console.log(err);
  });
}
function deleteGen(id) {
  db.get(id).then(function(oldGen) {
    return db.remove(oldGen);
  }).then(function (result) {
    console.log(result);
  }).catch(function (err) {
    console.log(err);
  });
}

function createRoom(room) {
  db.put({
    _id: "room"+new Date().toISOString(),
    name: room.name || ""
  }).then(function (response) {
    console.log(response);
  }).catch(function (err) {
    console.log(err);
  });
}
function readRoom(id) {
  db.get(id).then(function (doc) {
    console.log(doc);
  }).catch(function (err) {
    console.log(err);
  });
}
function readAllRooms() {
  return db.allDocs({
    startkey: 'room',
    endkey: 'room\uffff'
  });
}
function updateRoom(id, newRoom) {
  db.get(id).then(function(oldRoom) {
    return db.put({
      _id: oldRoom._id,
      _rev: oldRoom._rev,
      name: newRoom.name || oldRoom.name
    });
  }).then(function(response) {
    console.log(response);
  }).catch(function (err) {
    console.log(err);
  });
}
function deleteRoom(id) {
  db.get(id).then(function(oldRoom) {
    return db.remove(oldRoom);
  }).then(function (result) {
    console.log(result);
  }).catch(function (err) {
    console.log(err);
  });
}
