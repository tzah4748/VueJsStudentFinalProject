import firebase from 'firebase'
// eslint-disable-next-line
// import firestore from 'firebase/firestore'

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCxWbRt9aerPrR8f69tSIKfM31aJCsPCPg",
    authDomain: "festformer.firebaseapp.com",
    databaseURL: "https://festformer.firebaseio.com",
    projectId: "festformer",
    storageBucket: "festformer.appspot.com",
    messagingSenderId: "1008083887566"
};

const firebaseApp = firebase.initializeApp(config)

export default firebaseApp.firestore();