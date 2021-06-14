const functions = require("firebase-functions");


const admin = require("firebase-admin");

const serviceAccount = require("./account_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


// cloud function to retrieve replies by docid
async function getReplyById(data, context){
    // implement user check?
    
}
