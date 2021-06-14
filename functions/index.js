const functions = require("firebase-functions");

//imports admin key
const admin = require("firebase-admin");

const serviceAccount = require("./account_key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

//import Constant js file
const Constant = require('./constant.js')

//functions to export to client side

//checks if user is admin
function isAdmin(email){
    return Constant.adminEmails.includes(email);
}

// cloud function to retrieve replies by docid
async function getReplyById(data, context){
    //checks if admin is signed in
   if (!isAdmin(context.auth.token.email)){
       if(Constant.DEV) console.log('not admin', context.auth.token.email)
       throw new functions.https.HttpsError('unauthenticated', 'Only admins may update this')
   }

    try{

    }catch(e){
        if(Constant.DEV) console.log(e)
        throw new functions.https.HttpsError('internal', 'getReplyById Failed')
    }
}
