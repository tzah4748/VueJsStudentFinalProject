<template>
  <div>
    <v-carousel hide-delimiters v-bind:class="vCard" v-if="vCard" id="hide">
      <v-carousel-item v-for="(item, i) in festivalNames" :key="i" class="carousel_data">
        <!-- Row - 2 items -->
        <v-layout align-center justify-center row fill-height>
          <!-- Left Side - Title and Picture -->
          <!-- Column - 2 items (title, picture) -->
          <v-layout align-center justify-center column fill-height>
            <div disabled class="festivalNames">{{festivalNames[i]}}</div>
            <v-img :src="festivalImgs[i]" width="100%"></v-img>
          </v-layout>
          <!-- Right Side - Description and Registration -->
          <!-- Column - 2 items(about, register button) -->
          <v-layout align-center justify-center column>
            <div disabled class="festivalDescriptions">{{festivalDescriptions[i]}}</div>
            <v-btn
              id="Register"
              @click="loadTabFestival(fesitvalsId[i])"
              flat
              color="purple"
              v-if="currentUser"
            >Click to Register</v-btn>
          </v-layout>
        </v-layout>
      </v-carousel-item>
    </v-carousel>

    <!-- here we choose the package  -->
    <div class="choosePackage" v-if="choosePackage">
      <v-tabs v-model="active" color="cyan" dark slider-color="yellow">
        <v-tab v-for="n in 5" :key="n" ripple>{{tabName[n-1]}}</v-tab>
        <v-tab-item v-for="n in 5" :key="n">
          <v-card flat>
            <v-card-text>
              <div>
                <!-- here we have the deatils about each packages -->
                <v-expansion-panel expand>
                  <v-expansion-panel-content v-for="(item,i) in items" :key="i">
                    <template v-slot:header>
                      <div>Deatils about this package</div>
                    </template>
                    <v-card class="packageDeatils">
                      <v-card-text>
                        {{ tabText[n-1] }}
                        <v-btn
                          @click="MakeVirtualRoom(active)"
                          flat
                          color="red"
                        >Continue to place an order</v-btn>
                      </v-card-text>
                      <v-img
                        :src="packageImage[n-1]"
                        width="300px"
                        height="300px"
                        class="imagePackage"
                      ></v-img>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </div>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </div>

    <!-- here we make a virtual room for the package  -->
    <div class="makeVirtualRoom" v-if="makeVirtualRoom">
      <v-form class="form" ref="virtualRoom">
        <v-text-field v-model="roomId" disabled label="ID Room:" prepend-icon="ID"></v-text-field>
        <v-text-field
          label="Press your password for the room:"
          required
          v-model="password"
          prepend-icon="lock"
          :rules="passwordRules"
          :append-icon="showPassword ? 'visibility' : 'visibility_off'"
          :type="showPassword ? 'text' : 'password'"
          counter
          @click:append="showPassword = !showPassword"
        ></v-text-field>
        <v-text-field
          v-model="maxGuests"
          disabled
          label="The maximum guests for room:"
          prepend-icon="people"
        ></v-text-field>

        <v-text-field v-model="nameOfHotel" disabled label="The name of hotel" prepend-icon="hotel"></v-text-field>

        <v-text-field
          v-model="price"
          disabled
          label="The price of the package"
          prepend-icon="money"
        ></v-text-field>
        <!-- <PayPal amount="10.00" currency="USD" :client="credentials"></PayPal> -->

        <v-btn @click="submit">submit</v-btn>
        <v-btn @click="clear">clear</v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
// import PayPal from "vue-paypal-checkout";

import firebase from "firebase";
import db from "@/firebase/init";
export default {
  methods: {
    submit() {
      if (this.$refs.virtualRoom.validate()) {
        db.collection("virtual_rooms")
          .doc(this.roomId)
          .update({
            roow_pw: this.password
          });
        this.routeTo("Profile", { user_id: this.currentUser.uid });
        console.log("ok");
      }
    },
    routeTo(_name, _params = "null") {
      this.$router.push({ name: _name, params: _params });
    },
    clear() {
      this.password = "";
    },
    // this function is get the general of deatils of festivals
    getCollectionFestivalsFirebaseData() {
      db.collection("festivals")
        .get()
        .then(document => {
          document.docs.forEach(element => {
            var dataReturned = element.data();
            this.festivalNames[this.i] = dataReturned.name;
            this.festivalDescriptions[this.i] = dataReturned.text;
            this.fesitvalsId[this.i] = dataReturned.id_doc;
            this.festivalImgs[this.i] = dataReturned.img;
            this.i++;
          });
        });
    },
    // the function is load the deatils about the packages of the festivals
    loadTabFestival: function(fesitvalsId) {
      this.idDoc = fesitvalsId;
      this.vCard = false;
      this.choosePackage = true;
      this.getCollectionFestivalsFirebaseDataNew(this.idDoc).then(data => {
        if (data) {
          this.tabText[0] = data.inside_text_package[0];
          this.tabText[1] = data.inside_text_package[1];
          this.tabText[2] = data.inside_text_package[2];
          this.tabText[3] = data.inside_text_package[3];
          this.tabText[4] = data.inside_text_package[4];

          this.packageImage[0] = data.package_image[0];
          this.packageImage[1] = data.package_image[1];
          this.packageImage[2] = data.package_image[2];
          this.packageImage[3] = data.package_image[3];
        }
      });
    },
    //return the data from the festivals by id identify
    getCollectionFestivalsFirebaseDataNew(idDoc) {
      var promise = db
        .collection("festivals")
        .doc(idDoc)
        .get()
        .then(document => {
          return document.data();
        });
      return promise;
    },
    // the function is make a virtual room in the firebase(DB)
    MakeVirtualRoom: function(active) {
      console.log(active);
      this.choosePackage = false;
      this.makeVirtualRoom = true;
      this.uid = this.currentUser.uid;
      this.getCollectionFestivalsFirebaseDataNew(this.idDoc).then(data => {
        if (data) {
          db.collection("virtual_rooms")
            .add({
              // this.currentUser.uid
              festivals_id: data.id_doc,
              guest_payment_status: [false],
              guests: [this.currentUser.uid],
              // update the id user in array(in firebase)
              hotel_and_package: {
                hotel_id: data.hotel_name[0]
              },
              maxGuests: data.package_number[active],
              roow_pw: "empty",
              price: data.price[active]
            })
            .then(ref => {
              this.roomId = ref.id;
              this.nameOfHotel = data.hotel_name[0];
              this.price = data.price[active];
              this.maxGuests = data.package_number[active];
              db.collection("users")
                .doc(this.currentUser.uid)
                .update({
                  my_festivals: {
                    festival_id: data.id_doc,
                    virtual_room_id: this.roomId
                  }
                });
              // update the array(in firebase) of the user to pay (for start all users is false)
              // switch (active) {
              //   case 1:
              //     db.collection("virtual_rooms")
              //       .doc(this.roomId)
              //       .update({
              //         guest_payment_status: {
              //           user1: false,
              //           user2: false
              //         }
              //       });
              //     break;

              //   case 2:
              //     db.collection("virtual_rooms")
              //       .doc(this.roomId)
              //       .update({
              //         guest_payment_status: {
              //           user1: false,
              //           user2: false,
              //           user3: false
              //         }
              //       });
              //     break;

              //   case 3:
              //     db.collection("virtual_rooms")
              //       .doc(this.roomId)
              //       .update({
              //         guest_payment_status: {
              //           user1: false,
              //           user2: false,
              //           user3: false,
              //           user4: false
              //         }
              //       });
              //     break;

              //   default:
              //     break;
              // }
            });
        }
      });
    }
  },
  created() {
    this.getCollectionFestivalsFirebaseData();
  },
  data() {
    return {
      credentials: {
        sandbox: "<sandbox client id>",
        production: "<production client id>"
      },
      myItems: [
        {
          name: "hat",
          description: "Brown hat.",
          quantity: "1",
          price: "5",
          currency: "USD"
        },
        {
          name: "handbag",
          description: "Black handbag.",
          quantity: "1",
          price: "5",
          currency: "USD"
        }
      ],
      i: 0,
      festivalDate: [],
      fesitvalsId: [],
      festivalNames: ["Funjoya", "sovetlv"],
      festivalImgs: [
        "https://firebasestorage.googleapis.com/v0/b/festformer.appspot.com/o/funjoya15.jpg?alt=media&token=929262f8-dd23-4ea5-8902-e897174bc216",
        "https://firebasestorage.googleapis.com/v0/b/festformer.appspot.com/o/maratonLogoMobile.png?alt=media&token=b842aa92-ea63-4620-b64f-564d55b1ca0f"
      ],
      festivalDescriptions: [
        "What is the Panjouya Festival? Beyond the Oleh, cooperative activity with student associations in Israel, the Panjia Festival in Israel. To promote the Spring Break Israel, we call it an experience. Every Saturday, every Thursday, Friday, Thursday, Thursday, 5th of Elul 5767 Panawa If you have heard the phrase when you grow up understand or study is important, this is exactly the reason. We are desiccated by the organizations that enlist in the organization, the joy of hamburgers for the letters, the arrangements of each and every one of the trees, the worshipers, each of them, a colleague in our festivals, and once you hear the word panjouya On your face and remember an unforgettable moment from the festival.",
        "As every year, the city of Tel Aviv holds a huge bicycle festival. In the event, a cycling tour takes place around Tel Aviv, where all ages take part in different age and category cycling tracks. During the festival, various cycling events will be held in the square. Detailed information, directions and parking, registration, map of the routes, etc. are presented on the Tel Aviv-Jaffa site."
      ],
      vCard: true,
      j: 0,
      uid: "",
      currentUser: firebase.auth().currentUser,
      choosePackage: false,
      makeVirtualRoom: false,
      authType: "",
      authDialog: false,
      dialogWidth: "",
      packageImage: [],
      tabName: [
        "This package includes an entrance ticket for the event",
        "Package with Hotel + 2",
        "Package with Hotel + 3",
        "Package with Hotel + 4"
      ],
      tabText: [],
      active: null,
      e1: 0,
      roomId: "",
      nameOfHotel: "",
      maxGuests: null,
      price: "",
      checkbox: false,
      idDoc: "",

      items: [
        {
          src: ""
        }
      ],
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
      ]
    };
  },
  // components: {
  //   PayPal
  // },
  computed: {
    // fontSize() {
    //   if (this.$vuetify.breakpoint.smAndDown) {
    //     return "title";
    //   }
    //   return "display-1";
    // }
  },
  validations: {
    checkbox: {
      checked(val) {
        return val;
      }
    }
  }
};
</script>


<style lang="stylus">
#example-custom-transition {
  .fade {
    &-enter-active, &-leave-active, &-leave-to {
      transition: 0.3s ease-out;
      position: absolute;
      top: 0;
      left: 0;
    }

    &-enter, &-leave, &-leave-to {
      opacity: 0;
    }
  }
}
</style>

<style lang="css">
.packageDeatils {
  display: flex;
}
.v-card.v-card--flat.v-sheet.theme--light {
  width: 100%;
  margin-left: 1px;
}
.cards {
  display: flex;
  margin: auto;
  width: 50%;
  font-size: 21px;
  font-weight: 500;
}
.v-content__wrap {
  margin-top: 70px;
}
.choosePackage {
  width: 75%;
  margin: auto;
}
.title {
  font-size: 20px;
  color: red;
}
.v-responsive__content {
  width: 1000px;
}
.v-image__image.v-image__image--cover {
  background-size: contain;
}
.flex.xs12.sm6.offset-sm3 {
  display: flex;
}
.v-card.v-sheet.theme--light {
  width: 500px;
  margin-left: 10px;
}
.v-card__actions {
  background-color: red;
}
.form {
  background-color: white;
  opacity: 1 !important;
  width: 50%;
  margin: auto;
}
#Register {
  background: red !important;
  color: white !important;
  margin-top: 5%;
}
#hide {
  color: white;
}
.carousel_data {
  width: 80%;
  margin: auto;
}
.imagePackage {
  margin-left: 207px;
  margin-top: -35px;
}
.festivalDescriptions {
  width: 80%;
}
.festivalNames {
  font-size: 40px;
}
</style>