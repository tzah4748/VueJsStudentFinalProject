<template>
  <v-toolbar dark fixed color="transparent">
    <v-toolbar-items>
      <v-btn flat :icon="headerIcon" @click="routeTo('Home')">
        <v-icon large>beach_access</v-icon>
        {{headerTitle}}
      </v-btn>
    </v-toolbar-items>
    <v-spacer></v-spacer>
    <v-toolbar-items v-if="currentUser">
      <v-btn flat fab @click="routeTo('Profile', {user_id: currentUser.uid})">
        <v-avatar>
          <v-img v-if="photoURL" :src="photoURL"></v-img>
          <v-icon v-else>person_outline</v-icon>
        </v-avatar>
      </v-btn>
      <v-btn flat @click="signout()">
        Signout
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar-items>
    <v-toolbar-items v-else>
      <v-btn @click="openLogin()" flat>Login</v-btn>
      <v-dialog width="50%" :fullscreen="$vuetify.breakpoint.smAndDown" v-model="authDialog">
        <v-layout align-start justify-center row fill-height class="white">
          <Authentication
            v-on:closeDialogs="closeDialogs"
            :authType="authType"
            @setAuthType="v => {authType=v}"
          ></Authentication>
        </v-layout>
      </v-dialog>
    </v-toolbar-items>
    <v-toolbar-items>
      <v-btn flat @click="goBack()">
        <v-icon>arrow_back_ios</v-icon>Back
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import firebase from "firebase";
import Authentication from "../components/dialogs/Authentication.vue";
export default {
  components: {
    Authentication
  },
  computed: {
    headerTitle: function() {
      if (this.$vuetify.breakpoint.smAndDown) return null;
      else return "Festformer";
    },
    headerIcon: function() {
      if (this.headerTitle) return false;
      else return true;
    }
  },
  methods: {
    debug() {},
    goBack() {
      this.$router.go(-1);
    },
    openSignup() {
      this.authType = "Signup";
      this.authDialog = true;
    },
    openLogin() {
      this.authType = "Login";
      this.authDialog = true;
    },
    signout() {
      firebase.auth().signOut();
    },
    closeDialogs() {
      this.authDialog = false;
    },
    routeTo(_name, _params = "null") {
      this.$router.push({ name: _name, params: _params });
    },
    getPhotoURL() {
      if (firebase.auth().currentUser) {
        for (var user of firebase.auth().currentUser.providerData) {
          if (user.providerId == "facebook.com") {
            return user.photoURL;
          }
        }
      }
      return null;
    }
  },
  data() {
    return {
      currentUser: firebase.auth().currentUser,
      authType: "",
      authDialog: false,
      dialogWidth: "",
      photoURL: this.getPhotoURL()
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user;
      this.photoURL = this.getPhotoURL();
      if (!this.currentUser) this.$router.push({ name: "Home" });
    });
  }
};
</script>

<style>
</style>