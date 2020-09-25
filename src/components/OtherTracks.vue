<template>
  <div id="other-tracks" v-if="myTopTracks.tracks.length > 0">
    <v-carousel hide-delimiters height="auto">
      <v-carousel-item v-for="(track, index) in myTopTracks.tracks" :key="track.id">
        <Card
          :name="track.name"
          :index="index + 2"
          :artist="track.artists[0].name"
          :image="track.album.images[0].url"
          :colors="getColors(track.album.images[0].url)"
          :stats="myTopTracks.audioFeatures[index]"
        />
      </v-carousel-item>
    </v-carousel>
  </div>
</template>
<script>
//import "swiper/css/swiper.css";
import Card from "./Card";
import { Colors } from "../utils/styling";

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
  props: ["myTopTracks"],
  mounted: async function () {
    let topFeatures = await this.myTopTracks.audioFeatures.map((track) =>
      this.getSongTopFeature(track)
    );
    this.generalTopFeature = this.getGeneralTopFeature(topFeatures);
    this.averageValence =
      this.myTopTracks.audioFeatures.reduce((sum, el) => sum + el.valence, 0) /
      this.myTopTracks.audioFeatures.length;

    this.$emit("valenceLoaded", this.averageValence);
  },
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
    getSongTopFeature(track) {
      let songFeatures = this.getSongFeatures(track);

      let topValue = Object.values(songFeatures).reduce((a, b) =>
        Math.max(a, b)
      );

      let topFeature = Object.keys(songFeatures).find(
        (key) => songFeatures[key] === topValue
      );

      return topFeature;
    },
    getGeneralTopFeature(features) {
      let featureOccurrences = {};

      for (let i = 0; i < features.length; i++) {
        let currentFeature = features[i];
        if (
          Object.keys(featureOccurrences).find((key) => key === features[i])
        ) {
          featureOccurrences[currentFeature] = featureOccurrences[
            currentFeature
          ]++;
        } else {
          featureOccurrences[currentFeature] = 1;
        }
      }

      let maxOcurrences = Object.values(featureOccurrences).reduce((a, b) =>
        Math.max(a, b)
      );

      let result = Object.keys(featureOccurrences).find(
        (key) => featureOccurrences[key] === maxOcurrences
      );

      return result;
    },
    getMoodText() {
      if (0.2 < this.averageValence && this.averageValence < 0.5) {
        return "depressive...";
      }
      if (0.0 <= this.averageValence && this.averageValence <= 0.2) {
        return "kind of sad...";
      }
      if (this.averageValence && this.averageValence === 0.5) {
        return "have a neural mood.";
      }
      if (0.5 < this.averageValence && this.averageValence <= 0.7) {
        return "happy!";
      }
      return "sparkling!";
    },
  },
};
</script>