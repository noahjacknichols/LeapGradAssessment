const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongod = new MongoMemoryServer();

/**
 * This module generates functions to connect, close and clear in-memory mongodb's.
 * I chose this way to test my endpoints since I didn't want to rely on the dev db not being available
 * on your end, and wiping the dev db between tests to verify tests don't effect other tests
 */

// connect to new db
module.exports.connect = async () => {
  const uri = await mongod.getUri();
  const mongooseOpts = {
    useNewUrlParser: true,
    autoReconnect: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000,
  };

  await mongoose.connect(uri, mongooseOpts);
};

// drop the db, close conn and stop mongod
module.exports.closeDatabase = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

// remove all data in collections
module.exports.clearDatabase = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};
