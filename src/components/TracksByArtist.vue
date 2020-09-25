<template>
  <div id="tracks-features">
    <div v-if="generalTopFeature" class="description">
      <span class="feature-title">This artist's deck is overall {{ getFeatureTitle(generalTopFeature) }}</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.feature-title {
  font-size: 30px;
  display: block;
}
</style>

<script>

export default {
  name: "TracksByArtist",
  data() {
    return {
      topFeatures: [],
      generalTopFeature: "",
      featureText: {
        acousticness: {
          text: "Acoustic",
          icon: "guitar",
        },
        valence: {
          text: "Cheerful",
          icon: "laugh-squint",
        },
        energy: {
          text: "Energetic",
          icon: "bolt",
        },
        danceability: {
          text: "Danceable",
          icon: "music",
        },
        liveness: {
          text: "Live",
          icon: "hand-peace",
        },
        instrumentalness: {
          text: "Instrumental",
          icon: "drum",
        },
        speechiness: {
          text: "Spoken",
          icon: "comment-dots",
        },
      },
    };
  },
  props: ["tracks"],
  mounted: async function () {
    let topFeatures = await this.tracks.map((track) => this.getSongTopFeature(track));
    this.generalTopFeature = this.getGeneralTopFeature(topFeatures);
  },
  methods: {
    getSongTopFeature(track) {
      let songFeatures = {};

      songFeatures.acousticness = track.acousticness;
      songFeatures.danceability = track.danceability;
      songFeatures.energy = track.energy;
      songFeatures.instrumentalness = track.instrumentalness;
      songFeatures.liveness = track.liveness;
      songFeatures.speechiness = track.speechiness;
      songFeatures.valence = track.valence;

      let topValue = Object.values(songFeatures).reduce((a, b) =>
        Math.max(a, b)
      );

      let topFeature = Object.keys(songFeatures).find(
        (key) => songFeatures[key] === topValue
      );

      return topFeature;
    },
    getFeatureTitle(feature) {
      return this.featureText[feature].text;
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
  },
};
</script>