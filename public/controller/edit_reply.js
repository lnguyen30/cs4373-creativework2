import * as FirebaseController from './firebase_controller.js'
import * as Util from '../viewpage/util.js'
import * as Constant from '../model/constant.js'
import * as Element from '../viewpage/element.js'

export async function edit_reply(docId){
    let reply;
    try{
        //calls firebase controller function from fbc.js with docId
        reply = await FirebaseController.getReplyById(docId)
        //if reply doesn't exist
        if(!reply){
            Util.info('getReplyById error', 'No reply found by id')
            return;
        }

    }catch(e){
        if(Constant.DEV) console.log(e)
        Util.info('getReplyById Error', JSON.stringify(e))
        return;
    }

    //show reply on modal
    // docId from firestore is stored into form's docId
    Element.formUpdateReply.form.docId.value = reply.docId
    // content from firestore is store into form's content
    Element.formUpdateReply.form.content.value = reply.content
    Element.modalUpdateReply.show();
}