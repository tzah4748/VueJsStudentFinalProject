<template>
  <v-app>
    <v-snackbar v-model="snackbar" top multi-line>
      You were logged out due to long inactivity
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <Header></Header>
    <v-content class="coverImg">
      <router-view></router-view>
    </v-content>
    <!-- <Footer></Footer> -->
  </v-app>
</template>

<script>
import firebase from "firebase";
import db from "./firebase/init";
import Header from "./components/Header.vue";
// import Footer from "./components/Footer.vue";
import axios from "axios";

export default {
  name: "app",
  methods: {
    isProviderFacebook() {
      if (firebase.auth().currentUser) {
        for (var user of firebase.auth().currentUser.providerData) {
          if (user.providerId == "facebook.com") {
            return true;
          }
        }
        return false;
      }
      return false;
    },
    checkAccessToken(accessToken) {
      if (this.isProviderFacebook()) {
        axios
          .get(
            "https://graph.facebook.com/v3.3/me?fields=id%2Cname&access_token=" +
              accessToken
          )
          .then(response => {
            db.collection("users")
              .doc(firebase.auth().currentUser.uid)
              .get()
              .then(doc => {
                if (doc.data().fb_id != response.data.id) {
                  firebase.auth().signOut();
                  this.snackbar = true;
                }
              });
          });
      }
    },
    getCurrentUserFirebaseData() {
      var promise = db
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then(doc => {
          if (doc.exists) {
            return doc.data();
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch(function(error) {
          console.log("Error getting document:", error);
        });
      return promise;
    }
  },
  components: {
    Header
    // Footer
  },
  data() {
    return {
      currentUser: firebase.auth().currentUser,
      snackbar: false
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user;
    });
    if (firebase.auth().currentUser) {
      this.getCurrentUserFirebaseData().then(data => {
        this.checkAccessToken(data.access_token);
      });
    }
  }
};
</script>

<style>
.coverImg {
  background-size: cover;
  background-image: url("../src/assets/home.jpg");
}
</style>
