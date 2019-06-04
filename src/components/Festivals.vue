<template>
  <v-carousel height="100%" hide-delimiters class="elevation-0">
    <v-carousel-item v-for="(item, i) in allFestivalsId" :key="i" style="height:100%">
      <!-- Layout of full height columns | | | -->
      <v-layout justify-center row fill-height>
        <!-- 1st column of all 12 slots on the grid -->
        <v-flex xs12>
          <!-- Layout of full width rows -- -- -- -->
          <v-layout align-space-around justify-center column fill-height>
            <!-- 1st row of 2 slot on the grid -->
            <v-flex xs2>
              <!-- Centered columns -->
              <v-layout align-center justify-center row fill-height>
                <v-btn
                  :class="titleFontSize"
                  style="height:auto"
                  class="white--text text-xs-center text-none transparent"
                  @click="openWebsite(i)"
                >
                  {{festivalName(i)}}
                  <br>
                  {{festivalDate(i)}}
                </v-btn>
              </v-layout>
            </v-flex>
            <!-- 2nd row of 8 slots on the grid -->
            <v-flex xs8>
              <!-- Layout of full height columns -->
              <v-layout row justify-center fill-height>
                <v-flex xs2 class="hidden-sm-and-down">
                  <v-img :src="festivalImg(i)" contain width="100%" height="100%"></v-img>
                </v-flex>
                <v-flex xs1 class="hidden-sm-and-down"></v-flex>
                <v-flex xs8>
                  <v-layout align-center justify-start row fill-height>
                    <span
                      :class="descriptionFontSize"
                      disabled
                      style="opacity: 0.85; border-radius:1%;"
                      class="white--text secondary elevation-24"
                      :style="isHebrew(i, festivalDescription(i)) ? 'direction: rtl;' : ''"
                    >{{festivalDescription(i)}}</span>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>
            <!-- 3rd row of 2 slots on the grid -->
            <v-flex xs2>
              <v-layout align-start justify-center row>
                <v-btn
                  v-if="isHebrew(i, festivalDescription(i))"
                  class="primary"
                  flat
                  large
                  @click="()=>{}"
                >לחץ להרשמה</v-btn>
                <v-btn v-else class="primary" flat @click="()=>{}">Click to Register</v-btn>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-carousel-item>
  </v-carousel>
</template>

<script>
// import firebase from "firebase";
import db from "@/firebase/init";
export default {
  data() {
    return {
      allFestivalsData: [],
      allFestivalsId: []
    };
  },
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
    }
  },
  computed: {
    titleFontSize() {
      if (this.$vuetify.breakpoint.smAndDown) {
        return "title";
      }
      return "headline";
    },
    descriptionFontSize() {
      if (this.$vuetify.breakpoint.smAndDown) {
        return "caption";
      }
      return "title";
    }
  },
  mounted() {
    this.getFestivals();
  }
};
</script>


