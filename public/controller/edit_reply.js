import * as FirebaseController from './firebase_controller.js'
import * as Util from '../viewpage/util.js'
import * as Constant from '../model/constant.js'
import * as Element from '../viewpage/element.js'
import * as Auth from './auth.js'
import { Reply } from '../model/reply.js'

export function addEventListeners(){
    //event listener for reply modal form
    Element.formUpdateReply.form.addEventListener('submit', async e =>{
        e.preventDefault();
        
        const button = e.target.getElementsByTagName('button')[0];
        const label = Util.disableButton(button);

        //checks if current user can update their replies by their emails
        if(Auth.currentUser.email != e.target.email.value){
            Util.info('Error', 'Cannot update other user\'s replies', Element.modalUpdateReply);
            Util.enableButton(button, label)
            return;
        }
        //new reply object is created from modal form
        const r = new Reply({
            content: e.target.content.value,
            email: e.target.email.value,
            threadId: e.target.threadId.value,
            timestamp: Date.now(),
            uid: e.target.uid.value,
        });
        r.docId = e.target.docId.value;

        //update new reply to firebase, calls firebase controller update reply function
        try{
            await FirebaseController.updateReply(r)
            //updates browser
            const cardTag = document.getElementById('card-'+r.docId)
            cardTag.getElementsByClassName('card-text')[0].innerHTML = `${r.content}`;
            
            Util.info('Updated Reply', 'Reply has been updated', Element.modalUpdateReply);
        }catch(e){
            if(Constant.DEV) console.log(e);
            Util.info('Update reply error', JSON.stringify(e), Element.modalUpdateReply)
        }

        Util.enableButton(button, label)
    });
}

// called by update event in thread_page.js
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
    Element.formUpdateReply.form.threadId.value = reply.threadId
    Element.formUpdateReply.form.uid.value = reply.uid
    Element.formUpdateReply.form.email.value = reply.email
    Element.formUpdateReply.form.timestamp.value = reply.timestamp

    Element.modalUpdateReply.show();
}