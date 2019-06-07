<template>
  <v-layout align-space-around justify-start column fill-height class="white">
    <!-- User Profile Data -->
    <v-flex xs1></v-flex>
    <v-flex>
      <v-form>
        <v-layout align-space-around justify-space-around column fill-height>
          <!-- Row 1 -->
          <v-layout row justify-center wrap>
            <!-- Name -->
            <v-flex sm12 md2>
              <v-text-field
                prepend-icon="person"
                :class="propsPadding"
                :disabled="!editing"
                v-model="displayName"
                label="Name"
              ></v-text-field>
            </v-flex>
            <!-- Email -->
            <v-flex sm12 md2>
              <v-text-field
                prepend-icon="email"
                :class="propsPadding"
                :disabled="!editing"
                :rules="emailRules"
                v-model="email"
                label="Email"
              ></v-text-field>
            </v-flex>
            <!-- ID -->
            <v-flex sm12 md2>
              <v-text-field
                prepend-icon="fingerprint"
                :class="propsPadding"
                :disabled="!editing"
                mask="#########"
                v-model="ID"
                label="ID"
              ></v-text-field>
            </v-flex>
            <!-- Phone Number -->
            <v-flex sm12 md2>
              <v-text-field
                prepend-icon="phone"
                :class="propsPadding"
                :disabled="!editing"
                v-model="mobile"
                label="Phone number"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <!-- Row 2 -->
          <v-layout row justify-center wrap>
            <!-- Gender -->
            <v-flex sm12 md2>
              <v-select
                prepend-icon="fas fa-venus-mars"
                :items="genders"
                :class="propsPadding"
                :disabled="!editing"
                v-model="gender"
                label="Gender"
              ></v-select>
            </v-flex>
            <!-- Date of birth -->
            <v-flex sm12 md2>
              <v-menu
                v-model="showDatePicker"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="scale-transition"
                offset-y
                full-width
                min-width="290px"
              >
                <template v-slot:activator="{ on }">
                  <v-text-field
                    v-model="dateOfBirth"
                    :class="propsPadding"
                    :disabled="!editing"
                    label="Date of birth"
                    prepend-icon="date_range"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dateOfBirth" @input="showDatePicker = false" no-title></v-date-picker>
              </v-menu>
            </v-flex>
            <!-- Address -->
            <v-flex sm12 md4>
              <GeoSuggest
                v-slot="{ suggestions, loading }"
                :search="searchInput"
                country="il"
                :suggestion="selectedSuggestion"
                @geocoded="address = $event.normalizedAddress"
              >
                <VCombobox
                  prepend-icon="place"
                  :class="propsPadding"
                  :disabled="!editing"
                  v-model="address"
                  :search-input.sync="searchInput"
                  :loading="loading"
                  :items="suggestions"
                  item-text="description"
                  label="Address"
                  no-filter
                  clearable
                  ref="addressChange"
                />
              </GeoSuggest>
            </v-flex>
          </v-layout>
        </v-layout>
      </v-form>
      <!-- Error Message Box -->
      <v-flex>
        <v-layout align-center justify-center wrap>
          <!-- Error Message -->
          <v-alert :value="showErrorAlert" color="error" icon="warning" outline>{{errorMsg}}</v-alert>
        </v-layout>
      </v-flex>
      <!-- Edit Account - Delete Account -->
      <v-flex>
        <v-layout align-center justify-center wrap>
          <v-btn
            :loading="loading"
            :disabled="loading"
            :class="editColor"
            @click="!editing ? editProile() : updateProfile()"
          >
            {{editText}}
            <v-icon class="pl-1" v-show="!editing">edit</v-icon>
            <v-icon class="pl-1" v-show="editing">check</v-icon>
          </v-btn>
          <v-btn class="error">
            Delete Account
            <v-icon>delete_forever</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
    </v-flex>
    <v-flex xs1></v-flex>
  </v-layout>
</template>

<script>
import db from "@/firebase/init";
import firebase from "firebase";
import { GeoSuggest, loadGmaps } from "vue-geo-suggest";

export default {
  components: { GeoSuggest },
  methods: {
    editProile() {
      this.editText = "update profile";
      this.editColor = "success";
      this.editing = true;
    },
    updateProfile() {
      this.loader = "loading";
      try {
        db.collection("users")
          .doc(this.currentUser.uid)
          .set(
            {
              display_name: this.displayName,
              email: this.email,
              id: this.ID,
              mobile: this.mobile,
              gender: this.gender,
              date_of_birth: this.dateOfBirth,
              address: this.computedAddress,
              address_id: this.computedAddressId
            },
            { merge: true }
          );
        this.editText = "edit profile";
        this.editColor = "secondary";
        this.editing = false;
        this.showErrorAlert = false;
      } catch (err) {
        this.errorMsg = err.message;
        this.showErrorAlert = true;
      }
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
    }
  },
  computed: {
    computedAddress: function() {
      if (this.address.description) return this.address.description;
      else return this.address;
    },
    computedAddressId: function() {
      if (this.address.placeId) return this.address.placeId;
      else return this.addressId;
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
      displayName: "",
      email: "",
      mobile: "",
      gender: "",
      genders: ["Male", "Female"],
      dateOfBirth: "",
      showDatePicker: false,
      searchInput: "", // Search text
      selectedSuggestion: "", // Selected suggest from dropdown
      address: "", // Information about the selected place
      addressId: "",
      ID: "",
      editText: "Edit Profile",
      editColor: "secondary",
      propsPadding: "px-1",
      editing: false,
      emailRules: [
        v => !!v || "E-mail is required",
        v => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(v) || "E-mail must be valid";
        }
      ],
      showErrorAlert: false,
      errorMsg: "",
      loader: null,
      loading: false
    };
  },
  created() {
    this.getCurrentUserFirebaseData().then(data => {
      (this.displayName = data.display_name),
        (this.email = data.email),
        (this.mobile = data.mobile),
        (this.gender = data.gender),
        (this.dateOfBirth = data.date_of_birth),
        (this.address = data.address),
        (this.addressId = data.address_id),
        (this.ID = data.id);
    });
  },
  mounted() {
    // Load API dependencies globally. This can be called any time
    // before using GeoSuggest component.
    // i.e. in `main.js` or directly in the view where is necessary.
    loadGmaps("AIzaSyBofMglaLhlsElBDw7MF52olFtjLSGflEY");
  }
};
</script>
