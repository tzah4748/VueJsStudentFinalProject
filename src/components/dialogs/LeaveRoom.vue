<template>
  <v-container class="white" @keyup.enter="JoinRoom()">
    <!-- Close(X) Button -->
    <v-layout column>
      <!-- Info Message -->
      <v-flex>
        <v-alert :value="true" type="error" outline>
          <span class="headline">Leave this room?</span>
          <span class="subheading">
            <br>Doing so will permanently delete you from this room.
            <br>Empty rooms will be deleted.
          </span>
        </v-alert>
      </v-flex>
    </v-layout>
    <v-form ref="LeaveRoomForm" class="mt-4">
      <!-- Waiting Room ID -->
      <span>
        Confirm you want to leave this room by typing its ID:
        <span
          class="font-weight-bold"
        >{{leavingRoomId}}</span>
      </span>
      <v-text-field
        prepend-icon="fas fa-door-open"
        v-model="roomId"
        label="Room ID"
        required
        class="mt-1"
      ></v-text-field>
    </v-form>
    <!-- Join Room Button -->
    <v-layout row wrap align-center justify-center>
      <v-btn class="text-none" @click="$emit('closeDialogs')">Cancel</v-btn>
      <v-btn class="error text-none" :disabled="isDisabled" @click="leaveRoom()">Leave Room</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
export default {
  name: "LeaveRoom",
  props: ["leavingRoomId"],
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
    leaveRoom() {
      // Delete the user from the virtual_room
      db.collection("virtual_rooms")
        .doc(this.leavingRoomId)
        .update({
          ["guests_and_payment." +
          this.currentUser.uid]: firebase.firestore.FieldValue.delete()
        })
        .then(() => {
          this.getVirtualRoomData(this.leavingRoomId).then(roomData => {
            // Delete the festival and room record from the user doc
            db.collection("users")
              .doc(this.currentUser.uid)
              .update({
                ["my_festivals." +
                roomData.festival_id]: firebase.firestore.FieldValue.delete()
              })
              .then(() => {
                // Room is now empty, delete the room from database
                if (this.size(roomData.guests_and_payment) == 0) {
                  db.collection("virtual_rooms")
                    .doc(this.leavingRoomId)
                    .delete();
                }
              })
              .then(() => {
                this.$emit("closeDialogs");
              });
          });
        });
    },
    routeTo(_name, _params = {}) {
      this.$router.push({ name: _name, params: _params });
    }
  },
  watch: {
    roomId() {
      if (this.roomId == this.leavingRoomId) {
        this.isDisabled = false;
      } else {
        this.isDisabled = true;
      }
    }
  },
  data() {
    return {
      currentUser: firebase.auth().currentUser,
      roomId: "",
      isDisabled: true
    };
  }
};
</script>