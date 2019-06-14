<template>
  <v-container class="white" @keyup.enter="pay()">
    <v-layout column fill-height>
      <!-- Info Message -->
      <v-flex>
        <v-alert :value="true"
      color="info"
      icon="info"
      outline>
          <span class="subheading">
            Select the guests you wish to pay for
          </span>
        </v-alert>
      </v-flex>
      <!-- Guests in room - Payment Status -->
      <v-layout align-center justify-start row>
        <v-flex>
          <span>Guest Name</span>
        </v-flex>
        <span>Payment Status</span>
      </v-layout>
      <v-layout align-space-around column fill-height v-for="(guestId, i) in roomGuestsList" :key=i>
      <v-layout align-center justify-space-between row fill-height>
        <v-flex xs12>
        <span>{{guestDisplayName(guestId)}}</span>
        </v-flex>
        <v-checkbox :v-model="guestPaymentStatus(guestId)" color='success' :disabled="guestPaymentStatus(guestId)" @change="isUserPaymentChecked(guestId)"></v-checkbox></v-layout>
      </v-layout>
    </v-layout>
    <!-- Cancel - Pay Button -->
    <v-layout row wrap align-center justify-center>
      <v-btn class="text-none" @click="$emit('closeDialogs')">Cancel</v-btn>
      <v-btn class="info text-none" @click="pay()">Pay</v-btn>
      <!-- <PayPal
        :amount="amount"
        currency="ILS"
        :client="credentials"
        env="sandbox"
        v-on:payment-authorized="paymentAuthorized"
        v-on:payment-completed="paymentCompleted"
        v-on:payment-cancelled="paymentCancelled">
      </PayPal> -->
    </v-layout>
  </v-container>
</template>

<script>
// import PayPal from 'vue-paypal-checkout'
import firebase from "firebase";
export default {
  name: "JoinRoom",
  components: {
    // PayPal
  },
  props: [
    "roomData",
    "myUsersDataMap",
  ],
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
    pay() {
      console.log(this.amount);
    },
    guestDisplayName(guestId) {
      return this.myUsersDataMap.get(guestId).display_name;
    },
    guestPaymentStatus(guestId) {
      if (this.paymentStatus) {
        this.paymentStatus = this.roomGuestsMap.get(guestId);
      } else {
        return this.paymentStatus;
      }
    },
    generateCopyRoomGuestMap() {
      var copiedMap = this.toES6Map(this.roomData.guests_and_payment);
      for (let guest in copiedMap.keys()) {
        if (copiedMap.get(guest) == true) {
          copiedMap.delete(guest);
        }
      }
      return copiedMap;
    },
    isUserPaymentChecked(guestId) {
      var paymentStatus = this.copyOfGuestPaymentStatus.get(guestId);
      if (paymentStatus == false) {
        this.amount = parseInt(this.amount)
        this.amount += this.singleGuestAmount
        this.amount = this.amount.toString()
        this.copyOfGuestPaymentStatus.set(guestId,true);
      } else {
        this.amount = parseInt(this.amount)
        this.amount -= this.singleGuestAmount
        this.amount = this.amount.toString()
        this.copyOfGuestPaymentStatus.set(guestId,false);
      }
    },
    paymentAuthorized: function (data) {
          console.log(data);
    },
    paymentCompleted: function (data) {
      console.log(data);
    },
    paymentCancelled: function (data) {
      console.log(data);
    },
  },
  computed: {
    roomGuestsMap: function () {
      return this.toES6Map(this.roomData.guests_and_payment);
    },
    roomGuestsList: function() {
      return Array.from(this.roomGuestsMap.keys());
    },
    singleGuestAmount: function() {
      return 1;
    }
  },
  data() {
    return {
      currentUser: firebase.auth().currentUser,
      alertMsg: null,
      showSuccessAlert: false,
      showErrorAlert: false,
      roomID: "",
      paymentStatus: false,
      copyOfGuestPaymentStatus: this.generateCopyRoomGuestMap(),
      amount: "0",
      credentials: {
        sandbox: '"AahvQYumm1jR8_gfxY_CogT-8Bv7CFBsAnf0_6nt4ZaxaaztoZOOVO-4qdkQ83EuGgB6_PQDw4eoMIyu"',
        production: '<production client id>'
      }
    };
  }
};
</script>