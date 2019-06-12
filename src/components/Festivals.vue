<template>
  <v-layout align-space-around justify-start column fill-height>
    <!-- Change List \ Carousel View -->
    <v-flex xs1>
      <v-layout align-center justify-center fill-height>
        <v-btn :class="carouselView ? 'success' : ''" @click="carouselView = true">
          <v-icon>view_carousel</v-icon>Carousel View
        </v-btn>
        <v-btn :class="carouselView ? '' : 'success'" @click="carouselView = false">
          <v-icon>list</v-icon>List View
        </v-btn>
      </v-layout>
    </v-flex>
    <!-- The View -->
    <v-flex xs12>
      <v-layout align-space-around justify-start column fill-height>
        <!-- Carousel View -->
        <v-carousel hide-delimiters light :cycle="false" height="100%" v-show="carouselView">
          <v-carousel-item v-for="(festivalId, i) in allFestivalsData" :key="i" style="height:100%">
            <v-container fluid fill-height>
              <v-layout row fill-height class="white mx-4">
                <v-container fluid fill-height>
                  <v-layout row fill-height :reverse="isHebrewArr[i]">
                    <!-- Left Side -Title, Description and Buttons -->
                    <v-flex :class="smallScreen ? '' : 'xs8'">
                      <v-layout align-space-around justify-start column fill-height>
                        <v-flex xs1>
                          <v-layout align-center justify-center fill-height>
                            <span
                              disabled
                              class="text-xs-center"
                              :class="smallScreen ? 'title' : 'display-1'"
                            >{{festivalName(i)}} - {{festivalDate(i)}}</span>
                          </v-layout>
                        </v-flex>
                        <v-flex xs10>
                          <v-layout align-center justify-center fill-height>
                            <span
                              disabled
                              :style="isHebrewArr[i] ? 'direction: rtl;' : ''"
                              :class="[smallScreen ? 'caption' : 'subheading', isHebrewArr[i] ? 'text-xs-right' : 'text-xs-left']"
                            >{{festivalDescription(i)}}</span>
                          </v-layout>
                        </v-flex>
                        <v-flex xs1>
                          <v-layout justify-center wrap>
                            <v-btn
                              v-show="currentUser"
                              class="primary text-none"
                              :style="isHebrewArr[i] ? 'direction: rtl;' : 'ltr'"
                              :class="[smallScreen ? 'caption' : 'title', isHebrewArr[i] ? 'text-xs-right' : 'text-xs-left']"
                              @click="registerTo(i)"
                            >
                              <v-icon class="mr-1">fas fa-file-signature</v-icon>
                              {{isHebrewArr[i] ? 'לחץ להרשמה' : 'Click to Register'}}
                            </v-btn>
                            <v-btn
                              class="warning text-none"
                              :style="isHebrewArr[i] ? 'direction: rtl;' : ''"
                              :class="[smallScreen ? 'caption' : 'title', isHebrewArr[i] ? 'text-xs-right' : 'text-xs-left']"
                              @click="openWebsite(i)"
                            >
                              <v-icon class="mr-1">open_in_new</v-icon>
                              {{isHebrewArr[i] ? 'אתר הפסטיבל לפרטים נוספים' : 'Festival Website'}}
                            </v-btn>
                          </v-layout>
                        </v-flex>
                      </v-layout>
                    </v-flex>
                    <!-- Right Side - Picture -->
                    <v-flex xs4 v-if="!smallScreen">
                      <v-img :src="festivalImg(i)" contain width="100%" height="100%"></v-img>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-layout>
            </v-container>
          </v-carousel-item>
        </v-carousel>
        <!-- List View -->
        <v-expansion-panel v-show="carouselView == false">
          <v-expansion-panel-content v-for="(festivalId, i) in allFestivalsId" :key="i">
            <!-- Panel Header\Title -->
            <template v-slot:header>
              <span class="text-xs-center">{{festivalName(i)}} - {{festivalDate(i)}}</span>
            </template>
            <!-- Panel Contents - The Festival -->
            <v-container fluid fill-height>
              <v-layout row fill-height :reverse="isHebrewArr[i]">
                <!-- Left Side -Title, Description and Buttons -->
                <v-flex :class="smallScreen ? '' : 'xs8'">
                  <v-layout align-space-around justify-start column fill-height>
                    <v-flex xs1>
                      <v-layout align-center justify-center fill-height>
                        <span
                          disabled
                          class="text-xs-center"
                          :class="smallScreen ? 'title' : 'display-1'"
                          v-show="!smallScreen"
                        >{{festivalName(i)}} - {{festivalDate(i)}}</span>
                      </v-layout>
                    </v-flex>
                    <v-flex xs10>
                      <v-layout align-center justify-center fill-height>
                        <span
                          disabled
                          :style="isHebrewArr[i] ? 'direction: rtl;' : ''"
                          :class="[smallScreen ? 'caption' : 'subheading', isHebrewArr[i] ? 'text-xs-right' : 'text-xs-left']"
                        >{{festivalDescription(i)}}</span>
                      </v-layout>
                    </v-flex>
                    <v-flex xs1>
                      <v-layout justify-center wrap>
                        <v-btn
                          v-show="currentUser"
                          class="primary text-none"
                          :style="isHebrewArr[i] ? 'direction: rtl;' : 'ltr'"
                          :class="[smallScreen ? 'caption' : 'title', isHebrewArr[i] ? 'text-xs-right' : 'text-xs-left']"
                          @click="registerTo(i)"
                        >
                          <v-icon class="mr-1">fas fa-file-signature</v-icon>
                          {{isHebrewArr[i] ? 'לחץ להרשמה' : 'Click to Register'}}
                        </v-btn>
                        <v-btn
                          class="warning text-none"
                          :style="isHebrewArr[i] ? 'direction: rtl;' : ''"
                          :class="[smallScreen ? 'caption' : 'title', isHebrewArr[i] ? 'text-xs-right' : 'text-xs-left']"
                          @click="openWebsite(i)"
                        >
                          <v-icon class="mr-1">open_in_new</v-icon>
                          {{isHebrewArr[i] ? 'אתר הפסטיבל לפרטים נוספים' : 'Festival Website'}}
                        </v-btn>
                      </v-layout>
                    </v-flex>
                  </v-layout>
                </v-flex>
                <!-- Right Side - Picture -->
                <v-flex xs4 v-if="!smallScreen">
                  <v-img :src="festivalImg(i)" contain width="100%" height="100%"></v-img>
                </v-flex>
              </v-layout>
            </v-container>
            <v-dialog width="50%" :fullscreen="smallScreen" v-model="regDialog">
              <v-layout align-start justify-center row fill-height class="white">
                <FestivalRegistration
                  v:on:closeDialogs="closeDialogs"
                  :isHebrew="isHebrewArr[i]"
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
    </v-flex>
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
    routeTo(_name, _params = {}) {
      this.$router.push({ name: _name, params: _params });
    },
    getFestivals() {
      db.collection("festivals")
        .get()
        .then(festivals => {
          festivals.forEach(festival => {
            this.allFestivalsId.push(festival.id); // Festival ID == Doc Id
            var festivalData = festival.data(); // Festival Data == Doc Data
            this.allFestivalsData.push(festivalData); // Push the Doc Data
            this.isHebrewArr.push(this.isHebrew(festivalData.description)); // Check isHebrew?
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
    isHebrew(testOn) {
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
        if (!(this.allFestivalsId[i] in data.my_festivals)) {
          this.routeTo("Packages", { parmID: this.allFestivalsId[i] });
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
      isHebrewArr: [],
      regDialog: false,
      snackbar: false,
      carouselView: true
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user;
    });
    this.getFestivals();
  }
};
</script>