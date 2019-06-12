<template>
  <v-layout align-space-around justify-start column fill-height>
    <!-- Display Name Toolbar -->
    <v-toolbar extended dense>
      <v-spacer></v-spacer>
      <v-toolbar-title disabled>{{displayName}}</v-toolbar-title>
      <!-- Tabs Items -->
      <template v-slot:extension>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn
            flat
            :outline="isTabActive('Profile')"
            :class="isTabActive('Profile') ? 'primary primary--text' : 'grey--text text--darken-2'"
            class="text-none"
            @click="activeTab='Profile'"
          >
            <v-icon>account_box</v-icon>Profile
          </v-btn>
          <v-btn
            flat
            :outline="isTabActive('Festivals')"
            :class="isTabActive('Festivals') ? 'primary primary--text' : 'grey--text text--darken-2'"
            class="text-none"
            @click="activeTab='Festivals'"
          >
            <v-icon>beach_access</v-icon>Festivals
          </v-btn>
        </v-toolbar-items>
        <v-spacer></v-spacer>
      </template>
      <v-spacer></v-spacer>
    </v-toolbar>
    <!-- Active Tab View -->
    <ProfileTab v-show="isTabActive('Profile')"></ProfileTab>
    <FestivalsTab v-show="isTabActive('Festivals')" :smallScreen="smallScreen"></FestivalsTab>
  </v-layout>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import ProfileTab from "./ProfileTab";
import FestivalsTab from "./FestivalsTab";
export default {
  components: {
    ProfileTab,
    FestivalsTab
  },
  props: ["smallScreen"],
  methods: {
    isTabActive(tabName) {
      return tabName == this.activeTab;
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
  data() {
    return {
      displayName: "",
      activeTab: "Profile"
    };
  },
  created() {
    this.getCurrentUserFirebaseData().then(data => {
      this.displayName = data.display_name;
    });
  }
};
</script>
