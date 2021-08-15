import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore";

//handles the authentication to the back end
const firebaseConfig = {
    apiKey: "AIzaSyBIZUh5JGnR3ZuHRHEH_-Scodkf7iHsTXE",
    authDomain: "ez-math-editor.firebaseapp.com",
    projectId: "ez-math-editor",
    storageBucket: "ez-math-editor.appspot.com",
    messagingSenderId: "254306906260",
    appId: "1:254306906260:web:c1e08043359d912454c481",
    measurementId: "G-FEDCPCWDRR"
};
firebase.initializeApp(firebaseConfig);

export default firebase;