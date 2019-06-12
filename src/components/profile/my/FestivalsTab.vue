<template>
  <v-layout row fill-height>
    <!-- My Festivals -->
    <v-flex>
      <!-- No Registered Festivals -->
      <v-layout column fill-height v-if="myFestivalsId.length == 0">
        <v-flex xs5>
          <v-alert
            value="any"
            color="warning"
            icon="priority_high"
            class="text-xs-center my-0"
            style="justify-content: center;"
            :style="smallScreen ? 'font-size:14px;' : 'font-size:18px;'"
          >
            We couldn't find any festivals you participate in
            <br>How would you like to continue?
          </v-alert>
        </v-flex>
        <v-flex>
          <v-layout align-center justify-center row wrap>
            <v-btn class="success" @click="joinRoom=true">Join an existing room</v-btn>
            <v-btn class="primary" @click="routeTo('Festivals')">Register and create a new room</v-btn>
          </v-layout>
        </v-flex>
      </v-layout>
      <!-- There are Registered Festivals -->
      <template v-else>
        <!-- Still Loading Data -->
        <template v-if="loading">
          <v-layout align-space-around justify-start column fill-height class="white--text">
            <!-- Select Festival -->
            <v-flex xs1>
              <v-select
                :loading="loading"
                prepend-inner-icon="beach_access"
                label="Select a festival"
                dark
                color="success"
              ></v-select>
            </v-flex>
          </v-layout>
        </template>
        <!-- Done Loading Data -->
        <template v-else>
          <v-layout align-space-around justify-start column fill-height class="white--text">
            <!-- Select Festival -->
            <v-flex xs1>
              <v-select
                v-model="vSelectedKey"
                prepend-inner-icon="beach_access"
                :items="Array.from(vSelectItems.keys())"
                label="Select a festival"
                dark
                color="success"
              ></v-select>
            </v-flex>
            <!-- Selected Festival Details -->
            <v-flex>
              <v-layout justify-start row fill-height>
                <v-flex xs4 v-if="!smallScreen"></v-flex>
                <v-flex>
                  <v-container>
                    <v-layout column fill-height>
                      <!-- Room Title -->
                      <v-flex
                        xs1
                        class="text-xs-center"
                        :class="smallScreen ? 'title' : 'display-1'"
                      >
                        <v-layout align-center justify-center row fill-height>
                          <span aria-disabled>
                            <v-icon
                              :style="smallScreen ? 'font-size:20px;' : 'font-size:34px;'"
                              class="white--text mb-1"
                            >fas fa-door-open</v-icon>
                            {{roomTitle}}
                          </span>
                        </v-layout>
                      </v-flex>
                      <!-- Room Password - Field - Edit(Button) -->
                      <v-flex xs1>
                        <!-- Field - Edit Button -->
                        <v-layout align-center justify-center row fill-height>
                          <!-- Password Field -->
                          <v-text-field
                            dark
                            v-model="roomPassword"
                            prepend-icon="lock"
                            :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                            :type="showPassword ? 'text' : 'password'"
                            @click:append="showPassword = !showPassword"
                            label="Room Password"
                            color="success"
                            dense
                            :disabled="!editing"
                          ></v-text-field>
                          <!-- Edit Button -->
                          <v-btn
                            small
                            :loading="roomPwLoading"
                            :disabled="roomPwLoading"
                            :class="editColor"
                            @click="!editing ? editRoomPassword() : updateRoomPassword()"
                          >
                            {{editPasswordText}}
                            <v-icon small class="pl-1" v-show="!editing">edit</v-icon>
                            <v-icon small class="pl-1" v-show="editing">check</v-icon>
                          </v-btn>
                        </v-layout>
                        <!-- Error Alert -->
                        <v-layout align-center justify-center wrap>
                          <!-- Error Message -->
                          <v-alert
                            :value="showErrorAlert"
                            color="error"
                            icon="warning"
                            outline
                          >{{errorMsg}}</v-alert>
                        </v-layout>
                      </v-flex>
                      <!-- Package Expantion Panel -->
                      <v-flex xs1>
                        <v-expansion-panel v-model="isPackageDetailsOpen">
                          <v-expansion-panel-content>
                            <!-- Panel Header - Package Description -->
                            <template v-slot:header>
                              <span style="font-size:16px">
                                <v-icon
                                  style="font-size:22px"
                                  class="mr-2"
                                  :class="isPackageDetailsOpen==0 ? 'success--text' : ''"
                                >info</v-icon>
                                {{packageName}} - Click for more details
                              </span>
                              <span
                                v-if="packageMaxGuestsNumber"
                                style="font-size:16px"
                                class="text-xs-right"
                              >{{roomCurrentGuestsNumber}} / {{packageMaxGuestsNumber}}</span>
                            </template>
                            <!-- Panel Content - Package Details... #TODO -->
                          </v-expansion-panel-content>
                        </v-expansion-panel>
                      </v-flex>
                      <!-- List of Room Guests -->
                      <v-flex v-show="isPackageDetailsOpen!=0">
                        <v-container class="white black--text">
                          <v-layout column fill-height>
                            <!-- Guests in room - Room Capacity -->
                            <v-layout align-center justify-start row>
                              <v-flex>
                                <span>Guest Name</span>
                              </v-flex>
                              <span>Payment Status</span>
                            </v-layout>
                            <!-- Row i of the list - 1 Guest -->
                            <v-layout
                              align-center
                              justify-start
                              row
                              v-for="(guestId,i) in roomGuestsId"
                              :key="i"
                              class="my-2"
                            >
                              <v-flex>
                                <v-icon class="mr-2">fas fa-user</v-icon>
                                <span>{{myUsersDataMap.get(guestId).display_name}}</span>
                              </v-flex>
                              <v-icon
                                v-if="getGuestPaymentStatus(guestId)"
                                class="success--text"
                              >far fa-check-circle</v-icon>
                              <v-icon v-else class="error--text">far fa-times-circle</v-icon>
                            </v-layout>
                            <!-- Payment - Leave Room - Buttons -->
                            <v-layout align-center justify-center row fill-height>
                              <v-btn class="info" @click="paymentForm=true">Click to Pay</v-btn>
                              <v-btn
                                v-if="!getGuestPaymentStatus(currentUser.uid)"
                                class="error"
                                @click="leaveRoom=true"
                              >Leave Room</v-btn>
                            </v-layout>
                          </v-layout>
                        </v-container>
                      </v-flex>
                    </v-layout>
                    <v-layout column justify-center align-center>
                      <v-btn class="success" small @click="joinRoom=true">Join another room</v-btn>
                    </v-layout>
                  </v-container>
                </v-flex>
                <v-flex xs4 v-if="!smallScreen"></v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </template>
      </template>
    </v-flex>
    <v-dialog width="50%" :fullscreen="smallScreen" v-model="joinRoom">
      <v-layout align-start justify-center row fill-height class="white">
        <JoinRoom :currentUserData="currentUserData" v-on:closeDialogs="closeDialogs"></JoinRoom>
      </v-layout>
    </v-dialog>
    <template v-if="!loading && myFestivalsId.length != 0">
      <v-dialog width="50%" :fullscreen="smallScreen" v-model="paymentForm">
        <v-layout align-start justify-center row fill-height class="white">
          <Payment :myUsersDataMap="myUsersDataMap" v-on:closeDialogs="closeDialogs"></Payment>
        </v-layout>
      </v-dialog>
      <v-dialog width="50%" :fullscreen="smallScreen" v-model="leaveRoom">
        <v-layout align-start justify-center row fill-height class="white">
          <LeaveRoom :leavingRoomId="roomId" v-on:closeDialogs="closeDialogs"></LeaveRoom>
        </v-layout>
      </v-dialog>
    </template>
  </v-layout>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import JoinRoom from "@/components/dialogs/JoinRoom.vue";
import LeaveRoom from "@/components/dialogs/LeaveRoom.vue";
import Payment from "@/components/dialogs/Payment.vue";
import forAsync from "for-async";
export default {
  components: {
    JoinRoom,
    Payment,
    LeaveRoom
  },
  props: ["smallScreen"],
  methods: {
    size(obj) {
      var size = 0,
        key;
      for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
      }
      return size;
    },
    toES6Map(obj) {
      const ret = new Map();
      for (const item in obj) {
        ret.set(item, obj[item]);
      }
      return ret;
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
    // Get 1 virtual room data
    getVirtualRoomData(virtualRoomId) {
      var promise = db
        .collection("virtual_rooms")
        .doc(virtualRoomId)
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
    // Get 1 festival data
    getFestivalData(festivalId) {
      var promise = db
        .collection("festivals")
        .doc(festivalId)
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
    // Get 1 user data
    getUserData(userId) {
      var promise = db
        .collection("users")
        .doc(userId)
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
    routeTo(_name) {
      this.$router.push({ name: _name });
    },
    getGuestPaymentStatus(guestId) {
      return this.toES6Map(this.roomData.guests_and_payment).get(guestId);
    },
    closeDialogs() {
      this.joinRoom = false;
      this.leaveRoom = false;
      this.paymentForm = false;
    },
    editRoomPassword() {
      this.editPasswordText = "done";
      this.editColor = "success";
      this.editing = true;
    },
    updateRoomPassword() {
      this.loader = "roomPwLoading";
      try {
        db.collection("virtual_rooms")
          .doc(this.myVirtualRoomsId[this.vSelectedIndex])
          .set(this.myVirtualRoomsData[this.vSelectedIndex], { merge: true });
        this.editPasswordText = "edit";
        this.editColor = "secondary";
        this.editing = false;
        this.showErrorAlert = false;
      } catch (err) {
        this.errorMsg = err.message;
        this.showErrorAlert = true;
      }
    }
  },
  computed: {
    // The Selected Festival Index In the v-select Componenet
    vSelectedIndex: function() {
      return this.vSelectItems.get(this.vSelectedKey);
    },
    // The Selected Festivals' Virtual Room TITLE
    festivalId: function() {
      return this.myFestivalsId[this.vSelectedIndex];
    },
    festivalData: function() {
      return this.myFestivalsData[this.vSelectedIndex];
    },
    roomId: function() {
      return this.myVirtualRoomsId[this.vSelectedIndex];
    },
    roomData: function() {
      return this.myVirtualRoomsData[this.vSelectedIndex];
    },
    roomTitle: function() {
      return "Room ID : " + this.roomId;
    },
    roomGuestsId: function() {
      return Array.from(this.toES6Map(this.roomData.guests_and_payment).keys());
    },
    roomCurrentGuestsNumber: function() {
      return this.size(this.roomData.guests_and_payment);
    },
    roomPassword: {
      get: function() {
        return this.roomData.password;
      },
      set: function(newPassword) {
        this.roomData.password = newPassword;
      }
    },
    packageData: function() {
      const packageIndex = this.roomData.package_index;
      const packageData = this.festivalData.packages[packageIndex];
      return packageData;
    },
    packageName: function() {
      return this.packageData.description;
    },
    packageMaxGuestsNumber: function() {
      return this.packageData.max_guests;
    }
  },
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];

      setTimeout(() => (this[l] = false), 750);

      this.loader = null;
    }
  },
  data() {
    return {
      currentUser: firebase.auth().currentUser,
      currentUserData: null,
      myFestivalsId: new Array(),
      myFestivalsData: new Array(),
      myVirtualRoomsId: new Array(),
      myVirtualRoomsData: new Array(),
      myUsersDataMap: new Map(),
      vSelectItems: new Map(),
      vSelectedKey: "",
      joinRoom: false,
      leaveRoom: false,
      password: "",
      editPasswordText: "edit",
      editColor: "secondary",
      editing: false,
      showPassword: false,
      requiredRules: [v => !!v || "This field is required"],
      errorMsg: null,
      showErrorAlert: false,
      loader: null,
      roomPwLoading: false,
      loading: true,
      isPackageDetailsOpen: null,
      paymentForm: false
    };
  },
  async created() {
    await firebase.auth().onAuthStateChanged(user => {
      this.currentUser = user;
    });
    // Fetch all the user's festivals and rooms data
    // created is async - meaning it returns a promise
    // await is the same as doing ".then" after the function - meaning it waits for the promise to resolve (resolve = finish)
    this.loading = true;
    await this.getCurrentUserFirebaseData().then(userData => {
      this.currentUserData = userData;
      const festivalsIdToRoomIdMap = this.toES6Map(userData.my_festivals);
      this.myFestivalsId = Array.from(festivalsIdToRoomIdMap.keys());
      this.myVirtualRoomsId = Array.from(festivalsIdToRoomIdMap.values());
    });

    // forAsync does a loop Async, but because await at the beginning, the code will wait for the Async for to resolve
    // this way we can make many promise calls without losing time and still wait for the data we need next.

    // Load all festivals data
    await forAsync(this.myFestivalsId, (festivalId, idx) =>
      this.getFestivalData(festivalId).then(festivalData => {
        this.myFestivalsData.push(festivalData);
        if (idx == 0) {
          this.vSelectedKey = festivalData.name + " - " + festivalData.date;
        }
        this.vSelectItems.set(
          festivalData.name + " - " + festivalData.date,
          idx
        );
      })
    );
    // Load all rooms data
    await forAsync(this.myVirtualRoomsId, roomId =>
      this.getVirtualRoomData(roomId).then(roomData => {
        this.myVirtualRoomsData.push(roomData);
      })
    );
    // For each room, load the users data
    await forAsync(this.myVirtualRoomsData, roomData =>
      forAsync(
        Array.from(this.toES6Map(roomData.guests_and_payment).keys()),
        userId =>
          this.getUserData(userId).then(userData => {
            if (!this.myUsersDataMap.has(userId)) {
              this.myUsersDataMap.set(userId, userData);
            }
          })
      )
    );
    this.loading = false;
  }
};
</script>

<style lang="css">
.v-alert > div {
  flex: unset;
}
</style>