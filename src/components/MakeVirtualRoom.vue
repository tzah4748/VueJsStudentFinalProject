 <template>
  <!-- Here we make a virtual room for the package  -->
  <v-container fluid fill-height>
    <v-flex>
      <v-form ref="virtualRoom" class="white">
        <v-text-field v-model="roomId" disabled label="ID Room:" prepend-icon="fingerprint"></v-text-field>
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

        <v-btn @click="submit">submit</v-btn>
        <v-btn @click="clear">clear</v-btn>
      </v-form>
    </v-flex>
  </v-container>
</template>
 
 <script>
import db from "@/firebase/init";
import firebase from "firebase";
export default {
  props: ["packageIndex", "festivalID"],
  methods: {
    clear() {
      this.password = "";
    },
    routeTo(_name, _params = {}) {
      this.$router.push({ name: _name, params: _params });
    },
    submit() {
      if (this.$refs.virtualRoom.validate()) {
        this.makeVirtualRoom();
      }
    },
    makeVirtualRoom() {
      const roomData = {
        guests_and_payment: { [this.currentUser.uid]: false },
        package_index: this.packageIndex,
        password: this.password,
        festival_id: this.festivalID
      };
      db.collection("virtual_rooms")
        .add(roomData)
        .then(roomRef => {
          this.addFestivalToUser(this.festivalID, roomRef.id);
        })
        .then(() => this.routeTo("Profile", { user_id: this.currentUser.uid }));
    },
    addFestivalToUser(festivalId, roomId) {
      const myFestivals = { my_festivals: { [festivalId]: roomId } };
      db.collection("users")
        .doc(this.currentUser.uid)
        .set(myFestivals, { merge: true });
    }
  },
  data() {
    return {
      currentUser: firebase.auth().currentUser,
      e1: 0,
      password: "",
      roomId: "",
      nameOfHotel: "",
      maxGuests: null,
      price: "",
      checkbox: false,
      idDoc: "",
      my_festivals: {},
      pay_now: {},

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
  validations: {
    checkbox: {
      checked(val) {
        return val;
      }
    }
  }
};
</script>