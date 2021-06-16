import * as FirebaseController from './firebase_controller.js'
import * as Util from '../viewpage/util.js'
import * as Constant from '../model/constant.js'

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
}