const functions = require("firebase-functions");
const admin = require("firebase-admin");
const blockchainHandler = require("./functions/handleBlockchainAction");

// Initialize Firebase Admin SDK
admin.initializeApp();

exports.api = functions.https.onRequest((req, res) => {
  blockchainHandler.handleBlockchainAction(req.body)
    .then(result => res.json(result))
    .catch(error => {
      console.error("Blockchain Error:", error);
      res.status(500).send(error.message);
    });
});