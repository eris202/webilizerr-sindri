// db.service.js
const MongoClient = require("mongodb");
const db = require("./config/keys").mongoURI;

const dbService = {
  db: undefined,
  connect: (callback) => {
    MongoClient.connect(db, function (err, data) {
      if (err) {
        MongoClient.close();
        callback(err);
      }
      dbService.db = data;
      console.log("Connected to database");
      callback(null);
    });
  },
};

module.exports = dbService;
