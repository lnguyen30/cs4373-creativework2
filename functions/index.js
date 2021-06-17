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
exports.cf_getReplyById = functions.https.onCall(getReplyById);
exports.cf_updateReply = functions.https.onCall(updateReply);

// //checks if user is admin
// function isAdmin(email){
//     return Constant.adminEmails.includes(email);
// }

//cloud function to update replies, called in firebase controller
async function updateReply(replyInfo, context){

    if(!context.auth){
        if (Constant.DEV) console.log('not logged in', context.auth.token.email)
        throw new functions.https.HttpsError('unauthenticated', 'only users can invoke update request');
    }
    //replyInfo = {docId, data}
    try{
        await admin.firestore().collection(Constant.collectionNames.REPLIES)
            .doc(replyInfo.docId).update(replyInfo.data)
    }catch(e){
        if(Constant.DEV) console.log(e)
        throw new functions.https.HttpsError('internal', 'updateReply Failed')
    }
}

// cloud function to retrieve replies by docid, data ==>document(reply)id
async function getReplyById(data, context){
    
    // might use admin account if user account doesnt work out
    //checks if admin is signed in
    //    if (!isAdmin(context.auth.token.email)){
    //        if(Constant.DEV) console.log('not admin', context.auth.token.email)
    //        throw new functions.https.HttpsError('unauthenticated', 'Only admins may update this')
    //    }

    // user is not logged in, throw error
    if(!context.auth){
        if (Constant.DEV) console.log('not logged in', context.auth.token.email)
        throw new functions.https.HttpsError('unauthenticated', 'only users can invoke update request');
    }

        try{
            const doc = await admin.firestore().collection(Constant.collectionNames.REPLIES)
                        .doc(data).get();

        //if doc exists, then construct js reply object
        if(doc.exists){
            //destructuring assignment
            const {threadId, uid, email, timestamp, content} = doc.data();
            const r =  {threadId, uid, email, timestamp, content}
            r.docId = doc.id
            return r;
        }else{
            //if doc doesn't exist
            return null;
        }

        }catch(e){
            if(Constant.DEV) console.log(e)
            throw new functions.https.HttpsError('internal', 'getReplyById Failed')
        }
}

