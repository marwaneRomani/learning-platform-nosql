// Question: Pourquoi créer des services séparés ?
// Réponse: 

const { ObjectId } = require('mongodb');

const db = require('../config/db');


async function findOneById(collectionName, id) {
  try {
    const dbInstance = db.getMongoDb();
    const collection = dbInstance.collection(collectionName);

    if (!ObjectId.isValid(id)) {
      throw new Error('ID invalide.');
    }

    const result = await collection.findOne({ _id: new ObjectId(id) });
    return result;
  } catch (error) {
    console.error(`Erreur lors de la recherche par ID dans ${collectionName}:`, error);
    throw error;
  }
}

async function insertOne(collectionName, document) {
  try {
    const dbInstance = db.getMongoDb();
    const collection = dbInstance.collection(collectionName);

    const result = await collection.insertOne(document);
    return result.insertedId;
  } catch (error) {
    console.error(`Erreur lors de l'insertion dans ${collectionName}:`, error);
    throw error;
  }
}

async function updateOne(collectionName, id, updateData) {
  try {
    const dbInstance = db.getMongoDb();
    const collection = dbInstance.collection(collectionName);

    if (!ObjectId.isValid(id)) {
      throw new Error('ID invalide.');
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      throw new Error('Document non trouvé.');
    }

    return result.modifiedCount;
  } catch (error) {
    console.error(`Erreur lors de la mise à jour du document dans ${collectionName}:`, error);
    throw error;
  }
}

async function deleteOne(collectionName, id) {
  try {
    const dbInstance = db.getMongoDb();
    const collection = dbInstance.collection(collectionName);

    if (!ObjectId.isValid(id)) {
      throw new Error('ID invalide.');
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      throw new Error('Document non trouvé.');
    }

    return result.deletedCount;
  } catch (error) {
    console.error(`Erreur lors de la suppression du document dans ${collectionName}:`, error);
    throw error;
  }
}

async function countDocuments(collectionName) {
  try {
    const dbInstance = db.getMongoDb();
    const collection = dbInstance.collection(collectionName);

    const count = await collection.countDocuments();
    return count;
  } catch (error) {
    console.error(`Erreur lors du comptage des documents dans ${collectionName}:`, error);
    throw error;
  }
}

async function findAll(collectionName) {
  try {
    const dbInstance = db.getMongoDb();
    const collection = dbInstance.collection(collectionName);

    const result = await collection.find({}).toArray();
    return result;
  } catch (error) {
    console.error(`Erreur lors de la récupération de tous les documents dans ${collectionName}:`, error);
    throw error;
  }
}



// Export des services
module.exports = {
  findOneById,
  insertOne,
  updateOne,
  deleteOne,
  countDocuments,
  findAll,
};
