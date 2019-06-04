import firebase from 'firebase'
const facebookProvider = new firebase.auth.FacebookAuthProvider();
// var scope = ['email'];
var scope = ['user_friends'];

var i;
for (i = 0; i < scope.length; i++) {
    facebookProvider.addScope(scope[i]);
}

export default facebookProvider;