<template>
  <v-app v-if="!isLoading" id="home">
    <div v-if="!isLoading" style="display: none;">
      <img :src="topArtistImage" id="topArtistImage" crossorigin="anonymous" />
      <canvas id="playlistCover" height="1080px" width="1080px" />
    </div>
    <v-container>
      <v-row align="center" align-content="center" justify="center">
        <v-col align-self="center" :cols="12">
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
        <TracksByArtist
          v-if="!isLoading && artistTopTracksAudioFeatures.length > 0"
          :tracks="artistTopTracksAudioFeatures"
        />
      </v-row>
      <v-row>
        <v-col :cols="12">
          <h2>More on your deck:</h2>
        </v-col>
        <v-col :cols="12">
          <OtherTracks
            v-if="myTopTracks.tracks.length > 0"
            :myTopTracks="myTopTracks"
            v-on:valenceLoaded="generatePlaylistText($event)"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col :cols="12">
          <h3 v-if="playlistText">What about getting a playlist {{playlistText}}?</h3>
        </v-col>
        <v-col :cols="12">
          <button v-if="!isLoading" v-on:click="generatePlaylist(spotify)">get my playlist</button>
        </v-col>
      </v-row>
      <Footer />
    </v-container>
  </v-app>
</template>
<style lang="scss" scoped>
@import url("https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@400;600;700&display=swap");

#home {
  font-family: "Chakra Petch", sans-serif;
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
.block {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  h2 {
    font-size: 4em;
    font-weight: 600;
    align-self: left;
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
}
</style>

<script>
import Footer from "./components/Footer";
import PrismCard from "./components/PrismCard";
import TracksByArtist from "./components/TracksByArtist";
import OtherTracks from "./components/OtherTracks";
import { apiInit } from "./utils/api";
import { Colors, Canvas } from "./utils/styling";

export default {
  data() {
    return {
      colors: {},
      token: "",
      spotify: "",
      user: "",
      topTrack: "",
      isLoading: true,
      topTrackData: "",
      artistTopTracks: [],
      otherTopArtists: [],
      otherTopArtistsTopTracks: [],
      otherTopArtistsRandomTracks: [],
      topArtistRandomTracks: [],
      myTopTracks: {
        tracks: [],
        audioFeatures: [],
      },
      playlistTracks: [],
      topArtist: {},
      topArtistImage: "",
      artistTopTracksAudioFeatures: [],
      playlistText: "",
    };
  },
  name: "App",
  components: {
    Footer,
    TracksByArtist,
    OtherTracks,
    PrismCard,
  },
  created: async function () {},
  mounted: async function () {
    this.spotify = await apiInit();
    await this.makeRequests(this.spotify);
    this.isLoading = false;
    this.colors = new Colors(this.topTrack.album.images[0].url);
  },
  methods: {
    async makeRequests(api) {
      try {
        this.user = await api.getMe();

        this.topTrack = await api
          .getMyTopTracks()
          .then((response) => response.items[0]);

        this.topTrackData = await api.getAudioFeaturesForTrack(
          this.topTrack.id
        );

        this.myTopTracks.tracks = await api
          .getMyTopTracks({ limit: 11 })
          .then((response) => {
            let items = response.items;
            items.shift();
            return items;
          });

        let topTracksIds = this.myTopTracks.tracks.map((track) => track.id);

        this.myTopTracks.audioFeatures = await api
          .getAudioFeaturesForTracks(topTracksIds)
          .then((response) => (response = response.audio_features));

        this.artistTopTracks = await api
          .getArtistTopTracks(this.topTrack.artists[0].id, this.user.country)
          .then((response) => response.tracks);

        let artistTopTracksIds = this.artistTopTracks.map((track) => track.id);

        this.artistTopTracksAudioFeatures = await api
          .getAudioFeaturesForTracks(artistTopTracksIds)
          .then((response) => (response = response.audio_features));

        this.otherTopArtists = this.myTopTracks.tracks.map(
          (track) => track.artists[0]
        );

        this.otherTopArtists.map(
          async (artist) =>
            await api
              .getArtistTopTracks(artist.id, this.user.country)
              .then((response) =>
                this.otherTopArtistsTopTracks.push(response.tracks)
              )
        );

        this.topArtist = await api.getArtist(this.topTrack.artists[0].id);

        this.topArtistImage = this.topArtist.images[0].url;

        this.topArtist = await api.getArtist(this.topTrack.artists[0].id);

        this.topArtistImage = this.topArtist.images[0].url;

        this.getRandomTracks(this.artistTopTracks);
        this.otherTopArtistsTopTracks.map((artist) =>
          this.getRandomTracks(artist)
        );
      } catch (e) {
        window.console.log(e);
      }
    },

    async getPrismCardColors() {
      let colorArray = [];
      await this.colors.getLightColor().then((res) => colorArray.push(res));
      await this.colors.getDarkColor().then((res) => colorArray.push(res));

      return colorArray;
    },
    async generatePlaylist(api) {
      let userFirstName = this.user.display_name.split(" ")[0];

      this.playlist = await api.createPlaylist(this.user.id, {
        name: `${userFirstName.toUpperCase()}'s ${this.topArtist.genres[0].toUpperCase()} MIX`,
      });

      let playlistCover = await this.generatePlaylistCover();

      await api.uploadCustomPlaylistCoverImage(this.playlist.id, playlistCover);

      let trackUris = this.playlistTracks.map((track) => track.uri);

      await api.addTracksToPlaylist(this.playlist.id, trackUris);

      this.playlistUrl = await api
        .getPlaylist(this.playlist.id)
        .then((response) => response.href);
    },

    async getRandomTracks(tracks) {
      let count = 0;

      while (count < 3) {
        let randomElement = Math.floor(Math.random() * tracks.length);
        let currentTrack = tracks[randomElement];
        if (
          !this.playlistTracks.includes(currentTrack) &&
          this.isCheerful(this.spotify, currentTrack)
        ) {
          this.playlistTracks.push(currentTrack);
          count++;
        }
      }
    },

    async isCheerful(api, track) {
      let result = await api
        .getAudioFeaturesForTrack(track.id)
        .then((res) => res.valence > 0.5);
      return result;
    },

    async generatePlaylistCover() {
      let canvasElement = document.getElementById("playlistCover");
      let canvas = await new Canvas(canvasElement, this.colors);

      await canvas.getLightColorFill(
        0,
        0,
        canvasElement.height,
        canvasElement.width
      );

      let albumCover = document.getElementById("topArtistImage");

      canvas.drawImage(
        albumCover,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      await canvas.getGradientColorTransparentFill(
        0,
        0,
        canvasElement.height,
        canvasElement.width,
        0.6
      );

      let userFirstName = this.getUserFirstName();

      window.console.log(userFirstName);
      await canvas.getLightColorText(
        `${userFirstName.toUpperCase()}'s`,
        20,
        canvasElement.height / 2 - 150
      );

      await canvas.getLightColorText(
        this.topArtist.genres[0].toUpperCase(),
        20,
        canvasElement.height / 2
      );
      await canvas.getLightColorText("MIX", 20, canvasElement.height / 2 + 150);

      return canvasElement.toDataURL("image/jpeg");
    },

    getUserFirstName() {
      let userFirstName = this.user.display_name.split(" ")[0];
      if (userFirstName > 15) {
        userFirstName.slice(0, 14);
      }

      return userFirstName;
    },
    generatePlaylistText(valence) {
      if (valence <= 0.5) {
        this.playlistText = "to cheer you up";
      }

      this.playlistText = "to keep up the good vibes";
    },

    generateStoryImage() {},
  },
};
</script>
