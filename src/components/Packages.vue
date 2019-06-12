<template>
  <v-layout>
    <div class="choosePackage">
      <v-tabs v-model="active" color="cyan" dark slider-color="yellow">
        <v-tab v-for="n in 5" :key="n" ripple>{{tabName[n-1]}}</v-tab>
        <v-tab-item v-for="n in 5" :key="n">
          <v-card flat>
            <v-card-text>
              <div>
                <v-layout row>
                  <v-flex xs3 order-lg2>
                    <v-card-text>
                      {{ tabText[n-1] }}
                      <v-btn
                        @click="routeTo('MakeVirtualRoom', {packageIndex: active, festivalID: parmID})"
                        flat
                        color="red"
                      >Continue to place an order</v-btn>
                    </v-card-text>
                  </v-flex>
                  <v-flex xs6>
                    <v-img id="img" :src="packageImage[n-1]"></v-img>
                  </v-flex>
                </v-layout>
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </div>
  </v-layout>
</template>

<script>
import db from "@/firebase/init";
export default {
  props: ["parmID"],
  methods: {
    loadTabFestival: function() {
      this.getCollectionFestivalsFirebaseDataByID(this.parmID).then(data => {
        if (data) {
          var index = 0;
          for (index; index < data.packages.length; index++) {
            this.tabName.push(data.packages[index].description);
            this.tabText.push(data.packages[index].text);
            this.packageImage.push(data.packages[index].img);
          }
        }
      });
    },
    // return the data from the festivals by id identify
    getCollectionFestivalsFirebaseDataByID(idDoc) {
      var promise = db
        .collection("festivals")
        .doc(idDoc)
        .get()
        .then(document => {
          return document.data();
        });
      return promise;
    },
    routeTo(_name, _params = {}) {
      this.$router.push({ name: _name, params: _params });
    }
  },
  data() {
    return {
      fesitvalsId: "",
      packageImage: [],
      tabName: [],
      tabText: [],
      active: null
    };
  },
  created() {
    this.loadTabFestival();
  }
};
</script>

<style>
.choosePackage {
  width: 100%;
  margin: auto;
}
#img {
  width: "300px";
  height: "300px";
  margin-top: "5%";
  margin-left: 207px;
}
.v-card.v-card--flat.v-sheet.theme--light {
  width: 100%;
  margin-left: 1px;
}
</style>