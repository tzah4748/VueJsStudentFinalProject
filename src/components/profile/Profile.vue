<template>
  <v-container fluid fill-heigh v-if="isMyProfile()">
    <My></My>
  </v-container>
  <v-container fluid fill-height v-else>
    <Other></Other>
  </v-container>
</template>

<script>
import firebase from "firebase";
import My from "@/components/profile/My.vue";
import Other from "@/components/profile/Other.vue";
export default {
  methods: {
    isMyProfile() {
      if (this.currentUser)
        if (this.$route.params.user_id == this.currentUser.uid) return true;
      return false;
    }
  },
  components: {
    My,
    Other
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