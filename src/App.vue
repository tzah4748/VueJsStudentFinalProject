<template>
  <v-app>
    <Header :smallScreen="smallScreen"></Header>
    <v-content class="coverImg appFont">
      <v-snackbar v-model="snackbar" top multi-line>
        You were logged out due to long inactivity
        <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
      </v-snackbar>
      <router-view :smallScreen="smallScreen"></router-view>
    </v-content>
    <Footer v-if="!smallScreen"></Footer>
  </v-app>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import axios from "axios";

export default {
  name: "app",
  components: {
    Header,
    Footer
  },
  methods: {
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
    }
  },
  computed: {
    smallScreen: function() {
      return this.$vuetify.breakpoint.smAndDown;
    }
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
      // axios
      //     .get(
      //       "https://graph.facebook.com/v3.3/me?fields=id%2Cname&access_token=" +
      //         accessToken
      //     )
    }
  }
};
</script>

<style lang="css">
.coverImg {
  background-size: cover;
  background-image: url("../src/assets/home.jpg");
}
.appFont {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}
</style>
