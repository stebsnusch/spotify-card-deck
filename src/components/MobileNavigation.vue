<template>
  <v-navigation-drawer fixed dark temporary v-model="drawer">
    <v-list>
      <v-list-item v-if="userPicture">
        <v-list-item-avatar>
          <v-img :src="userPicture"></v-img>
        </v-list-item-avatar>
      </v-list-item>
      <v-list-item v-else>
        <v-icon class="mdi-36px">mdi-account-circle</v-icon>
      </v-list-item>

      <v-list-item>
        <v-list-item-content>
          <v-list-item-subtitle>HELLO,</v-list-item-subtitle>
          <v-list-item-title class="title">
            {{ getUserFirstName() }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list>
      <v-list-item-group v-model="group" color="primary">
        <v-list-item v-for="(item, index) in menuItems" :key="item.title" link>
          <v-list-item-content>
            <v-list-item-title @click="handleTimeSpan(index)">{{
              item.title
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <div class="ma-4">
      <v-btn class="primary" rounded depressed block @click="logout"
        >Logout</v-btn
      >
    </div>

    <template v-slot:append>
      <Footer />
    </template>
  </v-navigation-drawer>
</template>

<script>
import Footer from "./Footer";

export default {
  data() {
    return {
      drawer: false,
      group: null,
      userPicture: null,
      menuItems: [
        {
          title: "Last month",
        },
        {
          title: "Last 6 months",
        },
        {
          title: "All time",
        },
      ],
    };
  },
  name: "MobileNavigation",
  components: {
    Footer,
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
  props: ["user"],
  mounted: function () {
    this.userPicture = this.user.images[0].url;
  },
  methods: {
    logout() {
      this.$emit("logout");
    },
    handleTimeSpan(index) {
      switch (index) {
        case 0:
          return this.$emit("timeSpan", "short_term");

        case 1:
          return this.$emit("timeSpan", "medium_term");

        default:
          return this.$emit("timeSpan", "long_term");
      }
    },
    getUserFirstName() {
      let userFirstName = this.user.display_name.split(" ")[0];

      return userFirstName;
    },
  },
};
</script>