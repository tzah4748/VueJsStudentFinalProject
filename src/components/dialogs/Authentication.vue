<template>
  <v-container class="white" @keyup.enter="submitForm()">
    <!-- Close(X) Button -->
    <v-layout row wrap justify-end>
      <v-btn flat icon color="error" @click="$emit('closeDialogs')">
        <v-icon>clear</v-icon>
      </v-btn>
    </v-layout>
    <!-- Signup -->
    <v-form ref="signupForm" v-if="authType=='Signup'">
      <v-layout justify-center column>
        <!-- Row #1 -->
        <v-layout row wrap>
          <!-- Email -->
          <v-flex sm12 md4>
            <v-text-field
              type="email"
              prepend-icon="email"
              v-model="email"
              :rules="emailRules"
              label="Email"
            ></v-text-field>
          </v-flex>
          <!-- Password -->
          <v-flex sm12 md4>
            <v-text-field
              v-model="password"
              prepend-icon="lock"
              :rules="passwordRules"
              :append-icon="showPassword ? 'visibility' : 'visibility_off'"
              :type="showPassword ? 'text' : 'password'"
              counter
              @click:append="showPassword = !showPassword"
              label="Password"
            ></v-text-field>
          </v-flex>
          <!-- Confirm Password -->
          <v-flex sm12 md4>
            <v-text-field
              prepend-icon="lock"
              v-model="confirmPassword"
              :rules="confirmPasswordRules"
              type="password"
              label="Confirm Password"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <!-- Row #2 -->
        <v-layout row wrap>
          <v-flex sm12 md4>
            <!-- First Name -->
            <v-text-field
              prepend-icon="person"
              v-model="firstName"
              :rules="requiredRules"
              label="First Name"
            ></v-text-field>
          </v-flex>
          <v-flex sm12 md4>
            <!-- Last Name -->
            <v-text-field
              prepend-icon="person"
              v-model="lastName"
              :rules="requiredRules"
              label="Last Name"
            ></v-text-field>
          </v-flex>
          <v-flex sm12 md4>
            <!-- ID Number -->
            <v-text-field
              prepend-icon="fingerprint"
              v-model="ID"
              mask="#########"
              :rules="IDRules"
              label="ID"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <!-- Row #3 -->
        <v-layout row wrap>
          <!-- Mobile / Phone Number -->
          <v-flex sm12 md4>
            <v-text-field
              prepend-icon="phone"
              v-model="mobile"
              :rules="requiredRules"
              label="Mobile"
              type="tel"
            ></v-text-field>
          </v-flex>
          <!-- Date of birth -->
          <v-flex sm12 md4>
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
                  v-model="date"
                  :rules="requiredRules"
                  label="Date of birth"
                  prepend-icon="date_range"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" @input="showDatePicker = false" no-title></v-date-picker>
            </v-menu>
          </v-flex>
          <!-- Gender -->
          <v-flex sm12 md4>
            <v-radio-group
              v-model="gender"
              prepend-icon="fas fa-venus-mars"
              row
              :rules="requiredRules"
            >
              <v-radio key="m" label="Male" value="Male"></v-radio>
              <v-radio key="f" label="Female" value="Female"></v-radio>
            </v-radio-group>
          </v-flex>
        </v-layout>
        <!-- Row #4 -->
        <v-layout row wrap>
          <!-- Address -->
          <GeoSuggest
            v-slot="{ suggestions, loading }"
            :search="searchInput"
            country="il"
            :suggestion="selectedSuggestion"
            @geocoded="address = $event.normalizedAddress"
          >
            <VCombobox
              prepend-icon="place"
              :rules="addressRules"
              v-model="selectedSuggestion"
              :search-input.sync="searchInput"
              :loading="loading"
              :items="suggestions"
              item-text="description"
              no-filter
              clearable
            />
          </GeoSuggest>
        </v-layout>
      </v-layout>
      <!-- Error Message -->
      <v-alert :value="showErrorAlert" color="error" icon="warning" outline>{{errorMsg}}</v-alert>
      <!-- Signup Buttons -->
      <v-layout row justify-center>
        <v-btn class="primary text-none" @click="signup()">Sign Up</v-btn>
        <v-btn class="primary text-none hidden-sm-and-down" @click="facebookLogin()">
          <v-icon class="fab fa-facebook pr-2"></v-icon>Continue With Facebook
        </v-btn>
      </v-layout>
      <v-layout row justify-center class="hidden-md-and-up">
        <v-btn class="primary text-none" @click="facebookLogin()">
          <v-icon class="fab fa-facebook pr-2"></v-icon>Continue With Facebook
        </v-btn>
      </v-layout>
      <!-- Facebook Alert -->
      <v-alert
        :value="true"
        color="info"
        icon="info"
        outline
      >We recommend connecting through Facebook to maximize the operation of our matching system</v-alert>
    </v-form>
    <!-- Login -->
    <v-form ref="loginForm" v-else-if="authType=='Login'">
      <v-layout justify-center column>
        <!-- Row #1 -->
        <v-layout row wrap>
          <v-flex sm12 md6>
            <v-text-field
              type="email"
              prepend-icon="email"
              v-model="email"
              :rules="emailRules"
              label="Email"
              required
            ></v-text-field>
          </v-flex>
          <v-flex sm12 md6>
            <v-text-field
              v-model="password"
              prepend-icon="lock"
              :rules="passwordRules"
              :append-icon="showPassword ? 'visibility' : 'visibility_off'"
              :type="showPassword ? 'text' : 'password'"
              counter
              @click:append="showPassword = !showPassword"
              label="Password"
              required
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-layout>
      <!-- Error Message -->
      <v-alert :value="showErrorAlert" color="error" icon="warning" outline>{{errorMsg}}</v-alert>
      <!-- Login Buttons -->
      <v-layout align-center justify-center row fill-height>
        <v-btn class="primary text-none" @click="login()">Login</v-btn>
        <v-btn class="primary text-none hidden-sm-and-down" @click="facebookLogin()">
          <v-icon class="fab fa-facebook pr-2"></v-icon>Continue With Facebook
        </v-btn>
      </v-layout>
      <v-layout row justify-center class="hidden-md-and-up">
        <v-btn class="primary text-none" @click="facebookLogin()">
          <v-icon class="fab fa-facebook pr-2"></v-icon>Continue With Facebook
        </v-btn>
      </v-layout>
      <v-layout row justify-center>
        <v-btn small flat class="text-none" @click="openSignUpForm()">New Account? Sign Up Here</v-btn>
      </v-layout>
    </v-form>
    <!-- Link Facebook -->
    <v-form ref="linkFacebookForm" v-else-if="authType=='LinkFacebook'">
      <v-alert :value="true" color="info" icon="info" outline>
        You already have an account, we need to link your current account to Facebook.
        <br>Please enter account's password
      </v-alert>
      <v-layout row wrap>
        <v-flex sm12 md4>
          <v-text-field
            type="email"
            prepend-icon="email"
            v-model="email"
            :rules="emailRules"
            label="Email"
            required
            readonly
            disabled
          ></v-text-field>
        </v-flex>
        <v-flex sm12 md8>
          <v-text-field
            v-model="password"
            prepend-icon="lock"
            :rules="passwordRules"
            :append-icon="showPassword ? 'visibility' : 'visibility_off'"
            :type="showPassword ? 'text' : 'password'"
            counter
            @click:append="showPassword = !showPassword"
            label="Password"
            required
          ></v-text-field>
        </v-flex>
      </v-layout>
      <!-- Error Message -->
      <v-alert :value="showErrorAlert" color="error" icon="warning" outline>{{errorMsg}}</v-alert>
      <!-- Linking Button -->
      <v-layout align-center justify-center row fill-height>
        <v-btn class="primary text-none hidden-sm-and-down" @click="facebookLogin()">
          <v-icon class="fab fa-facebook pr-2"></v-icon>Link My Account
        </v-btn>
      </v-layout>
    </v-form>
    <!-- Forgot Password -->
  </v-container>
</template>

<script>
import firebase from "firebase";
import db from "@/firebase/init";
import facebookProvider from "@/firebase/facebookProvider";
import axios from "axios";
import { GeoSuggest, loadGmaps } from "vue-geo-suggest";
export default {
  name: "Authentication",
  props: { authType: String },
  components: { GeoSuggest },
  methods: {
    openSignUpForm() {
      this.$emit("setAuthType", "Signup");
    },
    submitForm() {
      if (this.authType == "Signup") this.signup();
      else if (this.authType == "Login") this.login();
      else this.facebookLogin;
    },
    validateFacebook() {
      var ret = false;
      if (this.ID) {
        if (this.ID.length == 9) {
          this.showErrorAlert = false;
          ret = true;
        }
      }
      this.errorMsg = "ID is required for Facebook Signup";
      this.showErrorAlert = true;
      if (ret) {
        if (this.mobile) {
          this.showErrorAlert = false;
          return true;
        } else {
          this.errorMsg = "Mobile is required for Facebook Signup";
          this.showErrorAlert = true;
          return false;
        }
      }
    },
    facebookLogin() {
      firebase
        .auth()
        .signInWithPopup(facebookProvider)
        .then(
          result => {
            this.newFacebookUser(result);
          },
          err => {
            if (err.code == "auth/account-exists-with-different-credential") {
              this.$emit("setAuthType", "LinkFacebook");
              this.email = err.email;
              firebase
                .auth()
                .signInWithEmailAndPassword(err.email, this.password)
                .then(
                  () => {
                    firebase
                      .auth()
                      .currentUser.linkAndRetrieveDataWithCredential(
                        err.credential
                      )
                      .then(result => {
                        this.newFacebookUser(result);
                      });
                  },
                  signInErr => {
                    this.errorMsg = signInErr.message;
                    this.showErrorAlert = true;
                  }
                );
            } else {
              this.errorMsg = err.message;
              this.showErrorAlert = true;
            }
          }
        );
    },
    newFacebookUser(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      var token = result.credential.accessToken;
      var user = result.user;
      axios
        .get(
          "https://graph.facebook.com/oauth/client_code?access_token=" +
            token +
            "&client_secret=57dacda34b1ff97d32fdf442f9ed2ebf&redirect_uri=https://festformer.firebaseapp.com/__/auth/handler&client_id=648899465534315"
        )
        .then(response => {
          this.getCurrentUserFirebaseData().then(data => {
            if (data) {
              this.getLongLivedToken(response, user, data.machine_id);
            } else {
              this.getLongLivedToken(response, user, "");
            }
          });
        });
      this.showErrorAlert = false;
      this.$emit("closeDialogs");
    },
    getLongLivedToken(response, user, machine_id) {
      axios
        .get(
          "https://graph.facebook.com/oauth/access_token?code=" +
            response.data.code +
            "&client_id=648899465534315&redirect_uri=https://festformer.firebaseapp.com/__/auth/handler&machine_id=" +
            machine_id
        )
        .then(response => {
          var refereshedData = response.data;
          var fbData = this.getFbProviderData();
          // console.log(fbData);
          db.collection("users")
            .doc(user.uid)
            .set(
              {
                access_token: refereshedData.access_token,
                machine_id: refereshedData.machine_id,
                refresh_token: user.refreshToken,
                fb_id: fbData.uid,
                fb_photo: fbData.photoURL,
                display_name: fbData.displayName,
                email: fbData.email
              },
              { merge: true }
            );
          db.collection("facebook_users")
            .doc(fbData.uid)
            .set(
              { access_token: refereshedData.access_token },
              { merge: true }
            );
        });
    },
    login() {
      if (this.$refs.loginForm.validate()) {
        firebase
          .auth()
          .signInWithEmailAndPassword(this.email, this.password)
          .then(
            () => {
              this.errorAlert = false;
              this.$refs.loginForm.reset();
              this.$emit("closeDialogs");
            },
            err => {
              this.error = err.message;
              this.errorAlert = true;
            }
          );
      }
    },
    signup() {
      this.showLoading = true;
      if (this.$refs.signupForm.validate()) {
        firebase
          .auth()
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(
            cred => {
              db.collection("users")
                .doc(cred.user.uid)
                .set(
                  {
                    email: this.email,
                    display_name: this.firstName + " " + this.lastName,
                    id: this.ID,
                    mobile: this.mobile,
                    date_of_birth: this.date,
                    gender: this.gender,
                    address: this.selectedSuggestion.description,
                    address_id: this.selectedSuggestion.placeId,
                    access_token: "",
                    refresh_token: ""
                  },
                  { merge: true }
                );
              this.showErrorAlert = false;
              this.$refs.signupForm.reset();
              this.$emit("closeDialogs");
            },
            err => {
              this.errorMsg = err.message;
              this.showErrorAlert = true;
            }
          );
      }
      this.showLoading = false;
    },
    /**
     * When the location found
     * @param {Object} addressData Data of the found location
     * @param {Object} placeResultData PlaceResult object
     * @param {String} id Input container ID
     */

    getAddressData: function(addressData) {
      console.log(addressData);
      // console.log(placeResultData)
      // console.log(id)
      this.address = addressData;
    },
    getFbProviderData() {
      if (firebase.auth().currentUser) {
        for (var user of firebase.auth().currentUser.providerData) {
          if (user.providerId == "facebook.com") {
            return user;
          }
        }
        return "";
      }
      return "";
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
  data() {
    return {
      email: "",
      emailRules: [
        v => !!v || "E-mail is required",
        v => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(v) || "E-mail must be valid";
        }
      ],
      password: "",
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
      ],
      confirmPassword: "",
      confirmPasswordRules: [
        v => !!v || "Confirm password is required",
        v => v == this.password || "Password doesn't match"
      ],
      requiredRules: [v => !!v || "This field is required"],
      firstName: "",
      lastName: "",
      ID: "",
      IDRules: [
        v => !!v || "ID is required",
        v => {
          if (v) {
            if (v.length < 9) {
              return "ID must be exactly 9 digits";
            }
            return true;
          }
          return false;
        }
      ],
      mobile: "",
      date: "",
      gender: "",
      searchInput: "", // Search text
      selectedSuggestion: "", // Selected suggest from dropdown
      address: "", // Information about the selected place
      addressRules: [
        v => !!v || "Address is required",
        () => {
          console.log(this.selectedSuggestion);
          console.log(this.address);
          if (this.selectedSuggestion) {
            if (this.selectedSuggestion.description) {
              return true;
            }
          }
          return "Please select a valid address";
        }
      ],
      showDatePicker: false,
      errorMsg: null,
      showErrorAlert: false
    };
  },
  mounted() {
    // Load API dependencies globally. This can be called any time
    // before using GeoSuggest component.
    // i.e. in `main.js` or directly in the view where is necessary.
    loadGmaps("AIzaSyBofMglaLhlsElBDw7MF52olFtjLSGflEY");
  }
};
</script>