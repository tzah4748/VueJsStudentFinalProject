<template>
  <v-layout align-start justify-center row fill-height>
    <v-expansion-panel>
      <v-expansion-panel-content
        v-for="(festivalId, i) in allFestivalsId"
        :key="i"
        :isHebrew="isHebrew(i, festivalDescription(i))"
      >
        <!-- Panel Header\Title -->
        <template v-slot:header>
          <span class="text-xs-center">{{festivalName(i)}} - {{festivalDate(i)}}</span>
        </template>
        <!-- Panel Contents - The Festival -->
        <v-layout align-space-around justify-center row fill-height>
          <!-- Image -->
          <v-flex xs3 v-if="!smallScreen" class="mx-4">
            <v-img :src="festivalImg(i)"></v-img>
          </v-flex>
          <!-- Description - Weblink - Register -->
          <v-flex :class="smallScreen ? 'xs9' : 'xs8'">
            <v-layout align-space-around justify-start column fill-height>
              <!-- Description -->
              <span
                disabled
                :style="isHebrew ? 'direction: rtl;' : ''"
                :class="[smallScreen ? 'caption' : 'title', isHebrew ? 'text-xs-right' : 'text-xs-left']"
              >{{festivalDescription(i)}}</span>
              <!-- Weblink - Register -->
              <v-layout align-center justify-center column fill-height>
                <!-- Register -->
                <v-btn
                  v-show="currentUser"
                  class="primary text-none"
                  :style="isHebrew ? 'direction: rtl;' : ''"
                  :class="[smallScreen ? 'caption' : 'title', isHebrew ? 'text-xs-right' : 'text-xs-left']"
                  @click="registerTo(i)"
                >{{isHebrew ? 'לחץ להרשמה' : 'Click to Register'}}</v-btn>
                <!-- Weblink -->
                <v-btn
                  class="warning text-none"
                  :style="isHebrew ? 'direction: rtl;' : ''"
                  :class="[smallScreen ? 'caption' : 'title', isHebrew ? 'text-xs-right' : 'text-xs-left']"
                  @click="openWebsite(i)"
                >{{isHebrew ? 'אתר הפסטיבל לפרטים נוספים' : 'Festival Website'}}</v-btn>
              </v-layout>
            </v-layout>
          </v-flex>
          <!-- Just some space in between -->
          <v-flex v-if="!smallScreen"></v-flex>
        </v-layout>
        <v-dialog width="50%" :fullscreen="smallScreen" v-model="regDialog">
          <v-layout align-start justify-center row fill-height class="white">
            <FestivalRegistration
              v:on:closeDialogs="closeDialogs"
              :isHebrew="isHebrew"
              :festivalId="allFestivalsId[i]"
              :festivalData="allFestivalsData[i]"
            ></FestivalRegistration>
          </v-layout>
        </v-dialog>
      </v-expansion-panel-content>
    </v-expansion-panel>
    <v-snackbar v-model="snackbar" bottom multi-line>
      Already registered to this festival!
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import FestivalRegistration from "@/components/dialogs/FestivalRegistration.vue";
export default {
  components: {
    FestivalRegistration
  },
  props: ["smallScreen"],
  methods: {
    getFestivals() {
      db.collection("festivals")
        .get()
        .then(festivals => {
          festivals.forEach(festival => {
            this.allFestivalsId.push(festival.id);
            this.allFestivalsData.push(festival.data());
          });
        })
        .catch(err => {
          console.log("Error getting documents", err);
        });
    },
    festivalName(i) {
      return this.allFestivalsData[i].name;
    },
    festivalDate(i) {
      return this.allFestivalsData[i].date;
    },
    festivalImg(i) {
      return this.allFestivalsData[i].img;
    },
    festivalDescription(i) {
      return this.allFestivalsData[i].description;
    },
    openWebsite(i) {
      window.open(this.allFestivalsData[i].site, "_blank");
    },
    isHebrew(i, testOn) {
      var hebrew = /^[א-ת]+/;
      if (hebrew.test(testOn)) {
        return true;
      }
      return false;
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
    },
    registerTo(i) {
      this.getCurrentUserFirebaseData().then(data => {
        if (!(this.allFestivalsId[i] in data.festivals)) {
          this.regDialog = true;
        } else {
          this.snackbar = true;
        }
      });
    },
    closeDialogs() {
      this.regDialog = false;
    }
  },
  data() {
    return {
      currentUser: firebase.auth().currentUser,
      allFestivalsData: [],
      allFestivalsId: [],
      regDialog: false,
      snackbar: false
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user;
    });
  },
  mounted() {
    this.getFestivals();
  }
};
</script>