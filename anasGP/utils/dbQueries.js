const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://admin:admin@cluster0.gjuns.mongodb.net/MyDatabase?retryWrites=true&w=majority";

const getCollection = async (collectionName) => {
  try {
    const connectionDB = await MongoClient.connect(uri);
    const db = await connectionDB.db("MyDatabase");
    return await db.collection(collectionName);
  } catch (exception) {
    console.log("Connection to the database corrupted");
  }
};

const findUserByEmail = async (username) => {
  const collection = await getCollection("users");
  return await collection.findOne({ username: username });
};

const findUserMinistryNumberNumber = async (ministryNumber) => {
  const collection = await getCollection("users");
  return await collection.findOne({ ministryNumber: ministryNumber });
};

const createUser = async (username, ministryNumber, password) => {
  if (
    (await findUserByEmail(username)) ||
    (await findUserMinistryNumberNumber(ministryNumber))
  ) {
    return { Error: "User is already exist" };
  } else {
    const collection = await getCollection("users");
    const ack = await collection.insertOne({
      dateOfRegistration: `${new Date().getDate()}/${new Date().getMonth()}`,
      isPayed: false,
      ministryNumber: ministryNumber,
      password: password,
      points: 0,
      residence: "Jordan",
      role: "user",
      username: username,
    });

    if (ack) return { Okay: "User created" };
  }
};

const checkForVoucher = async (username, voucherId) => {
  const collection = await getCollection("bank");
  const userCollection = await getCollection("users");
  const result =
    (await collection.findOne({
      idOfBuyer: username,
      voucherNumber: voucherId,
    })) || {};
  if (result) {
    userCollection.updateOne(
      { username: username },
      { $set: { isPayed: true } }
    );
    return true;
  }
  return false;
};

const checkForUser = async (username, password) => {
  const collection = await getCollection("users");
  return collection.findOne({ username: username, password: password });
};

const getUser = async (username) => {
  const collection = await getCollection("users");
  return collection.findOne({ username: username });
};

const getPoints = async (username) => {
  const collection = await getCollection("users");
  const user  = await collection.findOne({username: username})
  return (user || {}).points;
}

const checkForPoints = async () => {
  const collection = await getCollection("users");
  const users = await collection
    .find({
      role: "user",
      dateOfRegistration: `${new Date().getDate()}/${new Date().getMonth()}`,
    })
    .toArray();

  (users || []).forEach((el) => {
    collection.updateOne(
      {
        username: el.username,
      },
      {
        $set: {
          points: el.residence === 'Jordan' ?  el.points + 5 : el.points + 3,
        },
      }
    );
  });
};

module.exports = {
  checkForUser,
  checkForVoucher,
  createUser,
  getUser,
  checkForPoints,
  getPoints
};
