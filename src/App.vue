<template>
  <v-app id="app">
    <v-app-bar class="flex-grow-0" v-if="isMobile" dark>
      <v-app-bar-nav-icon
        v-if="!isLoggedOut"
        @click="$refs.drawer.drawer = !$refs.drawer.drawer"
      ></v-app-bar-nav-icon>
      <v-toolbar-title>Spotify Card Deck</v-toolbar-title>
    </v-app-bar>
    <MobileNavigation
      v-if="isMobile && !isLoggedOut"
      :drawer="drawer"
      v-on:logout="logout"
      :user="user"
      ref="drawer"
      v-on:timeSpan="setTimeSpan($event)"
    />
    <SideNavigation
      v-if="!isLoading && !isMobile && !isLoggedOut"
      v-on:logout="logout"
      v-on:timeSpan="setTimeSpan($event)"
      :user="user"
    />
    <v-main>
      <div id="testeimg"></div>
      <Login v-if="isLoggedOut && !isLoading" />
      <Loading v-if="isLoading" />

      <v-container v-if="!isLoading && !isLoggedOut && topTrack">
        <v-row>
          <v-col class="my-10" align-self="center" :cols="12">
            <h2 class="text-center">Your prism card is</h2>
          </v-col>
          <v-col align-self="center" class="text-center" :cols="12">
            <PrismCard
              :image="topTrack.album.images[0].url"
              :artist="topArtist.name"
              :stats="topTrackData"
              :name="topTrack.name"
              :id="topTrack.id"
              :isIOS="isIOS"
            />
          </v-col>
        </v-row>
        <v-row v-if="myTopTracks.tracks.length > 0">
          <v-col class="text-center my-16" :cols="12">
            <h2>More on your deck:</h2>
          </v-col>
          <v-col :cols="12">
            <OtherTracks :myTopTracks="myTopTracks" :isIOS="isIOS" />
          </v-col>
        </v-row>
      </v-container>
      <v-container
        class="fill-height justify-center flex-column"
        v-if="!isLoading && !isLoggedOut && !topTrack"
      >
        <h2 class="mb-5">
          Sorry, but you don't have enough tracks to be analyzed...
        </h2>
        <v-btn color="secondary" depressed rounded large @click="logout"
          >Login with another account!</v-btn
        >
      </v-container>
      <div id="cardImageStories" style="height: 0; overflow: hidden">
        <canvas
          id="storiesCanvas"
          width="1080"
          height="1920"
          style="background-color: #000"
        ></canvas>
      </div>
      <div id="cardImageFeed" style="height: 0; overflow: hidden">
        <canvas
          id="feedCanvas"
          width="1080"
          height="1080"
          style="background-color: #000"
        ></canvas>
      </div>
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
import { Colors } from "./utils/colors";

export default {
  data() {
    return {
      isLoggedOut: true,
      drawer: false,
      isIOS: null,
      chosenTime: "short_term",
      colors: {},
      token: "",
      spotify: "",
      user: "",
      topTrack: "",
      isLoading: true,
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
    this.isIOS = this.getOS() === 'iOS';
    this.spotify = await apiInit();
    await this.makeRequests(this.spotify);
    this.isLoading = false;
    this.colors = new Colors(this.topTrack.album.images[0].url);
  },
  methods: {
    async makeRequests(api) {
      this.isLoading = true;
      try {
        await api.getMe().then((res) => {
          if (res.status === 401) {
            this.isLoggedOut = true;
            this.isLoading = false;
            return;
          }
          this.user = res;
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
    logout() {
      this.isLoggedOut = true;
      apiReset(this.spotify);
    },
    async setTimeSpan(time) {
      this.chosenTime = time;
      await this.makeRequests(this.spotify);
      this.isLoading = false;
    },
    getOS() {
      var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
        windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
        iosPlatforms = ["iPhone", "iPad", "iPod"],
        os = null;

      if (macosPlatforms.indexOf(platform) !== -1) {
        os = "Mac OS";
      } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = "iOS";
      } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = "Windows";
      } else if (/Android/.test(userAgent)) {
        os = "Android";
      } else if (!os && /Linux/.test(platform)) {
        os = "Linux";
      }

      return os;
    },
  },
};
</script>
