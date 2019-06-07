<template>
  <v-toolbar app fixed dark color="transparent">
    <!-- Side icons for menu (Mobile) -->
    <v-toolbar-side-icon v-if="smallScreen"></v-toolbar-side-icon>
    <!-- Title - Home Link (Not Mobile) -->
    <v-toolbar-items v-else>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn flat :icon="smallScreen" v-on="on" @click="routeTo('Home')">
            <v-icon large>beach_access</v-icon>Festformer
          </v-btn>
        </template>
        <span>Home</span>
      </v-tooltip>
    </v-toolbar-items>
    <!-- Spacer -->
    <v-spacer v-if="!smallScreen"></v-spacer>
    <span :class="smallScreen ? 'subheading' : 'title'">{{pageName}}</span>
    <v-spacer></v-spacer>
    <!-- Profile Avatar - Profile Link (Signed In) -->
    <v-toolbar-items v-if="currentUser">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn flat fab v-on="on" @click="routeTo('Profile', {user_id: currentUser.uid})">
            <v-avatar>
              <v-img v-if="photoURL" :src="photoURL"></v-img>
              <v-icon v-else>person_outline</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <span>Profile</span>
      </v-tooltip>
    </v-toolbar-items>
    <!-- Signout Button (Signed In) -->
    <v-toolbar-items v-if="currentUser">
      <v-btn flat :icon="smallScreen" @click="signout()">
        {{smallScreen ? "" : "Signout"}}
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar-items>
    <!-- Login Button -->
    <v-toolbar-items v-else>
      <v-btn @click="openLogin()" flat>Login</v-btn>
      <v-dialog width="50%" :fullscreen="smallScreen" v-model="authDialog">
        <v-layout align-start justify-center row fill-height class="white">
          <Authentication
            v-on:closeDialogs="closeDialogs"
            :authType="authType"
            @setAuthType="v => {authType=v}"
          ></Authentication>
        </v-layout>
      </v-dialog>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import firebase from "firebase";
import Authentication from "@/components/dialogs/Authentication.vue";
export default {
  name: "Header",
  components: {
    Authentication
  },
  props: ["smallScreen"],
  methods: {
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
  watch: {
    $route() {
      this.pageName = this.$route.name;
    }
  },
  data() {
    return {
      currentUser: firebase.auth().currentUser,
      authType: "",
      authDialog: false,
      photoURL: this.getPhotoURL(),
      pageName: this.$route.name
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(() => {
      this.currentUser = firebase.auth().currentUser;
      this.photoURL = this.getPhotoURL();
    });
  }
};
</script>