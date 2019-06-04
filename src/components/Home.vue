<template>
  <v-container fluid fill-height align-center>
    <v-layout fill-height align-center justify-space-around column>
      <v-spacer></v-spacer>
      <span class="thePlatform" :style="{'font-size': fontSize}">
        Fastformer is an innovative platform for management and registration
        <br>of various festivals and events all over the world!
        <br>We aim to give our customers the most convenient and
        <br>inviting experience to manage
        festivals either as a guest or host
      </span>
      <v-btn class="mt-4 text-none primary" large @click="routeTo('Festivals')">The Festivals</v-btn>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from "firebase";

export default {
  name: "Home",
  computed: {
    fontSize: function() {
      switch (this.$vuetify.breakpoint.name) {
        case "mdAndDown":
          return "20px";
        case "mdAndUp":
          return "30px";
        default:
          return "20px";
      }
    }
  },
  methods: {
    routeTo(_name) {
      this.$router.push({ name: _name });
    }
  },
  data() {
    return {
      currentUser: firebase.auth().currentUser
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user;
    });
  }
};
</script>

<style>
.thePlatform {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  font-size: 20px;
  color: white;
  text-align: center;
}
</style>