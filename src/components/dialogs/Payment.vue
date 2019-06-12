<template>
  <v-container class="white" @keyup.enter="JoinRoom()">
    <!-- Close(X) Button -->
    <v-layout row wrap justify-end>
      <v-btn flat icon color="error" @click="$emit('closeDialogs')">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-layout>
    <v-form ref="JoinRoomForm">
      <!-- Room ID Field -->
      <v-text-field
        prepend-icon="fas fa-door-open"
        v-model="roomId"
        :rules="requiredRules"
        label="Room ID"
        required
      ></v-text-field>
      <!-- Room Password Field -->
      <v-text-field
        v-model="password"
        prepend-icon="lock"
        :rules="requiredRules"
        :append-icon="showPassword ? 'visibility' : 'visibility_off'"
        :type="showPassword ? 'text' : 'password'"
        counter
        @click:append="showPassword = !showPassword"
        label="Password"
        required
      ></v-text-field>
    </v-form>
    <!-- Join Room Button -->
    <v-layout column align-center>
      <v-btn class="primary text-none" @click="JoinRoom()">Join Room</v-btn>
    </v-layout>
    <!-- Error Message -->
    <v-alert :value="showErrorAlert" color="error" icon="warning" outline>{{alertMsg}}</v-alert>
    <!-- Success Message -->
    <v-alert :value="showSuccessAlert" color="success" icon="check_circle" outline>{{alertMsg}}</v-alert>
  </v-container>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
export default {
  name: "JoinRoom",
  props: ["myUsersDataMap"],
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
    getVirtualRoomData(roomId) {
      var promise = db
        .collection("virtual_rooms")
        .doc(roomId)
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
    JoinRoom() {
      this.showErrorAlert = false;
      this.showSuccessAlert = false;
      if (this.$refs.JoinRoomForm.validate()) {
        this.getVirtualRoomData(this.roomId).then(roomData => {
          if (roomData) {
            if (roomData.password == this.password) {
              this.getFestivalData(roomData.festival_id).then(festivalData => {
                const roomMaxGuests =
                  festivalData.packages[roomData.package_index].max_guests;
                if (roomMaxGuests) {
                  const guestsAndPayment = this.toES6Map(
                    roomData.guests_and_payment
                  );
                  if (guestsAndPayment.has(this.currentUser.uid)) {
                    this.alertMsg = "Already in this room!";
                    this.showSuccessAlert = true;
                  } else if (guestsAndPayment.size < roomMaxGuests) {
                    db.collection("virtual_rooms")
                      .doc(this.roomId)
                      .set(
                        {
                          guests_and_payment: { [this.currentUser.uid]: false }
                        },
                        { merge: true }
                      )
                      .then(() => {
                        const myFestivals = {
                          my_festivals: { [roomData.festival_id]: this.roomId }
                        };
                        db.collection("users")
                          .doc(this.currentUser.uid)
                          .set(myFestivals, { merge: true });
                      })
                      .then(() => {
                        this.alertMsg =
                          "Successfully Joined Room : " + this.roomId;
                        this.showSuccessAlert = true;
                      });
                  } else {
                    this.alertMsg = "This room is currently full";
                    this.showErrorAlert = true;
                  }
                } else {
                  this.alertMsg = "Wrong room ID";
                  this.showErrorAlert = true;
                }
              });
            } else {
              this.alertMsg = "Wrong room password";
              this.showErrorAlert = true;
            }
          } else {
            this.alertMsg = "Wrong room ID";
            this.showErrorAlert = true;
          }
        });
      }
    }
  },
  data() {
    return {
      currentUser: firebase.auth().currentUser,
      roomId: "",
      password: "",
      showPassword: false,
      requiredRules: [v => !!v || "This field is required"],
      alertMsg: null,
      showSuccessAlert: false,
      showErrorAlert: false
    };
  }
};
</script>