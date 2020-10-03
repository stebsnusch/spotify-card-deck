<template>
  <div id="other-tracks" v-if="myTopTracks.tracks.length > 0">
    <v-carousel hide-delimiters height="auto">
      <v-carousel-item
        v-for="(track, index) in myTopTracks.tracks"
        :key="track.id"
      >
        <Card
          :name="track.name"
          :index="index + 2"
          :id="track.id"
          :artist="track.artists[0].name"
          :image="track.album.images[0].url"
          :colors="getColors(track.album.images[0].url)"
          :stats="myTopTracks.audioFeatures[index]"
        />
      </v-carousel-item>
    </v-carousel>
    <div style="height: 0; overflow: hidden">
      <div v-for="(track, index) in myTopTracks.tracks" :key="track.name">
        <Card
          :browser="browser"
          :name="track.name"
          :index="index + 2"
          :id="track.id"
          :artist="track.artists[0].name"
          :image="track.album.images[0].url"
          :colors="getColors(track.album.images[0].url)"
          :stats="myTopTracks.audioFeatures[index]"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Card from "./Card";
import { Colors } from "../utils/colors";

export default {
  name: "OtherTracks",
  data() {
    return {
      generalTopFeature: "",
    };
  },
  components: {
    Card,
  },
  props: ["myTopTracks", "browser"],
  mounted: async function () {},
  methods: {
    async getColors(image) {
      let colors = new Colors(image);
      let colorArray = [];
      await colors.getLightColor().then((res) => colorArray.push(res));
      await colors.getDarkColor().then((res) => colorArray.push(res));

      return colorArray;
    },
    getStats(data) {
      let statsArray = [];

      let featureArray = Object.keys(this.getSongFeatures(data));
      featureArray.map((item) =>
        featureArray.find((key) => {
          if (key === item) {
            statsArray.push({ name: key, value: data[key] });
          }
        })
      );

      return statsArray;
    },
    getSongFeatures(track) {
      let songFeatures = {};

      songFeatures.acousticness = track.acousticness;
      songFeatures.danceability = track.danceability;
      songFeatures.energy = track.energy;
      songFeatures.instrumentalness = track.instrumentalness;
      songFeatures.speechiness = track.speechiness;
      songFeatures.valence = track.valence;
      return songFeatures;
    },
  },
};
</script>