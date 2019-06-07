<template>
  <My v-if="isMyProfile()"></My>
  <Other v-else></Other>
</template>

<script>
import firebase from "firebase";
import My from "@/components/profile/my/My.vue";
import Other from "@/components/profile/other/Other.vue";
export default {
  components: {
    My,
    Other
  },
  methods: {
    isMyProfile() {
      if (this.currentUser)
        if (this.$route.params.user_id == this.currentUser.uid) return true;
      return false;
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