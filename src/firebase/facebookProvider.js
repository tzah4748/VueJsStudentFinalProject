import firebase from 'firebase'
var facebookProvider = new firebase.auth.FacebookAuthProvider();
var scope = ['email', 'user_friends'];

var i;
for (i = 0; i < scope.length; i++) {
    facebookProvider.addScope(scope[i]);
}

export default facebookProvider;