<template>
  <v-container class="white" @keyup.enter="submitForm()">
    <v-layout row wrap justify-end>
      <v-btn flat icon color="error" @click="$emit('closeDialogs')">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-layout>
    <v-btn>Register</v-btn>
  </v-container>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
export default {
  name: "Authentication",
  props: ["isHebrew", "festivalData", "festivalId"],
  methods: {
    submitForm() {},
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
      password: "",
      showPassword: false,
      passwordRules: [
        v => !!v || "Password is required",
        v => {
          if (v) {
            if (v.length < 8) {
              return "Password must be at least 8 digits";
            }
            return true;
          }
          return false;
        }
      ],
      confirmPassword: "",
      confirmPasswordRules: [
        v => !!v || "Confirm password is required",
        v => v == this.password || "Password doesn't match"
      ],
      requiredRules: [v => !!v || "This field is required"],
      errorMsg: null,
      showErrorAlert: false
    };
  }
};
</script>