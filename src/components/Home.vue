<template>
  <v-container fluid fill-height>
    <v-layout align-space-around justify-start column fill-height>
      <v-flex xs1 sm3></v-flex>
      <v-flex>
        <v-layout align-center justify-start fill-height column>
          <span
            class="white--text text-xs-center"
            :style="smallScreen ? 'font-size:18px;' : 'font-size:26px;'"
          >
            Festformer is an innovative platform for management and registration
            <br>of various festivals and events all over the world!
            <br>We aim to give our customers the most convenient and
            <br>inviting experience to manage
            festivals either as a guest or host
          </span>
          <v-flex xs3></v-flex>
          <v-btn
            class="text-none primary"
            :style="smallScreen ? 'font-size:16px;' : 'font-size:18px;'"
            :large="!smallScreen"
            @click="routeTo('Festivals')"
          >The Festivals</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  props: ["smallScreen"],
  methods: {
    routeTo(_name) {
      this.$router.push({ name: _name });
    }
  },
  data() {
    return {};
  }
};
</script>