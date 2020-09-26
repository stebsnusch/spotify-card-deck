<template>
  <v-app id="app">
    <v-app-bar v-if="isMobile" dark>
      <v-app-bar-nav-icon
        v-if="!isLoggedOut"
        @click="$refs.drawer.drawer = !$refs.drawer.drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Spotify Card Deck</v-toolbar-title>
    </v-app-bar>
    <MobileNavigation
      v-if="isMobile"
      :drawer="drawer"
      v-on:logout="logout"
      ref="drawer"
      v-on:timeSpan="setTimeSpan($event)"
    />
    <SideNavigation
      v-if="!isLoading && !isMobile && !isLoggedOut"
      v-on:logout="logout"
      v-on:timeSpan="setTimeSpan($event)"
    />
    <v-main>
      <Login v-if="isLoggedOut && !isLoading" />
      <Loading v-if="isLoading" />

      <v-container v-if="!isLoading && !isLoggedOut">
        <v-row>
          <v-col class="my-16" align-self="center" :cols="12">
            <h2 class="text-center">Your prism card is</h2>
          </v-col>
          <v-col align-self="center" class="text-center" :cols="12">
            <PrismCard
              :image="topTrack.album.images[0].url"
              :artist="topArtist.name"
              :stats="topTrackData"
              :name="topTrack.name"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center my-16" :cols="12">
            <h2>More on your deck:</h2>
          </v-col>
          <v-col :cols="12">
            <OtherTracks v-if="myTopTracks.tracks.length > 0" :myTopTracks="myTopTracks" />
          </v-col>
        </v-row>
        <v-row>
          <v-col class="text-center my-16" :cols="12">
            <h2>Share with with your friends</h2>
          </v-col>
          <v-col class="mb-16" align="center" :cols="12">
            <v-btn color="accent d-block mb-5" depressed rounded large>Download All Cards</v-btn>
            <v-btn color="primary d-block mb-5" depressed rounded large>Instagram Stories</v-btn>
            <v-btn color="secondary d-block" depressed rounded large>Square</v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>
<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&display=swap");

$body-font-family: "Chakra Petch";
$title-font: "Chakra Petch";
$heading-font-family: "Chakra Petch";

.v-application {
  font-family: $body-font-family, sans-serif !important;
  .title {
    font-family: $title-font, sans-serif !important;
  }
}

#app {
  color: white;
  width: 100%;
  position: relative;
  background: black;
  a {
    color: white;
    text-decoration: none;
  }
  #mostPlayedTrack {
    width: 500px;
    height: 500px;
    -webkit-box-shadow: 6px 6px 5px 0px rgba(0, 0, 0, 0.28);
    -moz-box-shadow: 6px 6px 5px 0px rgba(0, 0, 0, 0.28);
    box-shadow: 6px 6px 5px 0px rgba(0, 0, 0, 0.28);
  }
}
h1 {
  font-size: 4em;
  font-weight: 600;
}
h2 {
  font-size: 3em;
  font-weight: 600;
}
.subtitle {
  font-size: 1.5em;
}
.song-info {
  position: relative;
  .title-artist {
    position: absolute;
    top: 150px;
    left: 460px;
    text-align: left;
    width: 400px;
    word-wrap: break-word;
    span {
      font-size: 2em;
      background-color: black;
      padding: 0 4px;
      line-height: 1.4em;
      &.title {
        font-size: 4em;
      }
    }
  }
}
</style>

<script>
import Login from "./components/Login";
import Loading from "./components/Loading";
import MobileNavigation from "./components/MobileNavigation";
import SideNavigation from "./components/SideNavigation";
import PrismCard from "./components/PrismCard";
import OtherTracks from "./components/OtherTracks";
import { apiInit, apiReset } from "./utils/api";
import { Colors } from "./utils/styling";

export default {
  data() {
    return {
      isLoggedOut: true,
      drawer: false,
      chosenTime: "short_term",
      colors: {},
      token: "",
      spotify: "",
      user: "",
      topTrack: "",
      isLoading: false,
      topTrackData: "",
      otherTopArtistsTopTracks: [],
      myTopTracks: {
        tracks: [],
        audioFeatures: [],
      },
      topArtist: {},
      topArtistImage: "",
      artistTopTracksAudioFeatures: [],
    };
  },
  name: "App",
  components: {
    Login,
    Loading,
    MobileNavigation,
    SideNavigation,
    OtherTracks,
    PrismCard,
  },
  computed: {
    isMobile: {
      get() {
        return this.$vuetify.breakpoint.smAndDown;
      },
    },
  },
  created: async function () {},
  mounted: async function () {
    this.spotify = await apiInit();

    this.isLoading = true;
    await this.makeRequests(this.spotify);
    this.isLoading = false;
    this.colors = new Colors(this.topTrack.album.images[0].url);
  },
  methods: {
    async makeRequests(api) {
      try {
        this.user = await api.getMe().then((res) => {
          if (res.status === 401) {
            this.isLoggedOut = true;
            return;
          }
          this.isLoggedOut = false;
        });

        this.topTrack = await api
          .getMyTopTracks({
            time_range: this.chosenTime,
          })
          .then((response) => response.items[0]);

        this.topTrackData = await api.getAudioFeaturesForTrack(
          this.topTrack.id
        );

        this.myTopTracks.tracks = await api
          .getMyTopTracks({
            limit: 10,
            time_range: this.chosenTime,
          })
          .then((response) => {
            let items = response.items;
            items.shift();
            return items;
          });

        let topTracksIds = this.myTopTracks.tracks.map((track) => track.id);

        this.myTopTracks.audioFeatures = await api
          .getAudioFeaturesForTracks(topTracksIds)
          .then((response) => (response = response.audio_features));

        this.topArtist = await api.getArtist(this.topTrack.artists[0].id);

        this.topArtistImage = this.topArtist.images[0].url;

        this.topArtist = await api.getArtist(this.topTrack.artists[0].id);

        this.topArtistImage = this.topArtist.images[0].url;
      } catch (e) {
        window.console.log(e);
      }
    },
    getUserFirstName() {
      let userFirstName = this.user.display_name.split(" ")[0];
      if (userFirstName > 15) {
        userFirstName.slice(0, 14);
      }

      return userFirstName;
    },
    logout() {
      apiReset();
      this.isLoggedOut = true;
    },
    setTimeSpan(time) {
      window.console.log("aaa");
      this.isLoading = true;
      this.chosenTime = time;
      this.makeRequests(this.spotify);
      this.isLoading = false;
    },
    generateStoryImage() {},
  },
};
</script>
