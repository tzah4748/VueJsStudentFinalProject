<template>
  <v-layout row fill-height>
    <!-- My Festivals -->
    <v-flex sm4>
      <v-layout column fill-height>
        <v-toolbar>
          <v-toolbar-title disabled>My Festivals</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-text-field append-icon="search" clearable label="Search..." single-line></v-text-field>
          </v-toolbar-items>
        </v-toolbar>
        <v-btn large>Some Festival...</v-btn>
      </v-layout>
    </v-flex>
    <!-- The Management -->
    <v-flex>
      <v-layout column fill-height>
        <v-toolbar>
          <v-spacer></v-spacer>
          <v-toolbar-title disabled class="text-xs-center">
            Some Festival...
            <br>Date...
          </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-layout>
    </v-flex>
  </v-layout>
</template>