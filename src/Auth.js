import React, { useContext, useEffect, useState } from 'react';
import firebase from './firebase';

export const AuthContext = React.createContext();

export function useAuth() {
    return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser ] = useState(null);
    const [pending, setPending ] = useState(true);
    const [currentMessages, setCurrentMessages] = useState(null);

    function logout() {
        setCurrentUser();
        return firebase.auth.signOut();
    }

    function updateEmail(email) {
        //console.log('got into update email');
        try {
            return currentUser.updateEmail(email);
        } catch(err) {
            return (`error updating email: ${err}`, null);
        }
        
    }    

    function updatePassword(password) {
        return currentUser.updatePassword(password)
    }
    
    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (user) =>{

            const db = firebase.firestore();
            var deviceToken = '';
            if(user){
                //get device token for messaging
                const msg=firebase.messaging();
                msg.getToken({vapidKey: "BNg_8F5MR9bcDyWKPd4IPbZM9m62yGv_aiw715HRXWE0QMg26iThniG_XjCCXGpr_jatV8sLk-yBPOaEMDrkgzk"})
                .then((token)=>{
                    console.warn("messaging token",token);
                    deviceToken = token;
                }).catch(err => {
                    console.error("notifications blocked");
                });
                msg.onMessage((payload) => {
                    console.log('Message received. ', payload);
                    setCurrentMessages(payload);
                });                

                //look up service seekers custom fields
                const data = await db.collection("userSeekers").where("createdByUser", "==", user.uid).get();
                user.customData = [];
                user.mode = 'all';
     
                if (data.empty) {
                    console.log('No matching userSeekers documents.');
                    return;
                }
                           
                data.forEach(async (doc) => {
                    //check if a devices array has been added to this doc
                    if(doc.data().devices){
                        if(doc.data().devices.indexOf(deviceToken) === -1) {
                            const aryDevices = doc.data().devices;
                            aryDevices.push(deviceToken); 
                            const updExistingDoc = await db.collection("userSeekers").doc(doc.id).update({devices: aryDevices});    
                        }
                    } else {
                        const updDoc = await db.collection("userSeekers").doc(doc.id).update({devices: [deviceToken]});
                    }
                    user.customData.push(doc.data());
                });    
            }

            setCurrentUser(user)
            setPending(false)
        });
    }, []);

    if(pending){
        return <>Loading... </>
    }

    const value = {
        currentUser,
        logout,
        updateEmail,
        updatePassword,
        currentMessages
    }        

    return(
        <AuthContext.Provider
            value={value}
        >
            {children}
        </AuthContext.Provider>


    );
};