<template>
  <div id="track-info">
    <div v-for="feature in topFeatures" :key="feature.index" class="description">
      <font-awesome-icon :icon="['fas', getFeatureIcon(feature)]" size="10x"></font-awesome-icon>
      <span class="feature-title">{{ getFeatureTitle(feature) }}</span>
    </div>
  </div>
</template>
<style lang="scss" scoped>

#track-info {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 100%;  
}
.feature-title{
  font-size: 30px;
  display: block;
}
</style>

<script>
export default {
  name: "AboutTrack",
  data() {
    return {
      topFeatures: [],
      featureText: {
        acousticness: {
          text: 'Acoustic',
          icon: 'guitar',
        },
        valence: {
          text: 'Cheerful',
          icon: 'laugh-squint',
        },
        energy: {
          text: 'Energetic',
          icon: 'bolt',
        },
        danceability: {
          text: 'Danceable',
          icon: 'music',
        },
        liveness: {
          text: 'Live',
          icon: 'hand-peace',
        },
        instrumentalness: {
          text: 'Instrumental',
          icon: 'drum',
        },
        speechiness: {
          text: 'Spoken',
          icon: 'comment-dots',
        },
      }
    };
  },
  props: ["track-data"],
  mounted: function () {
    this.getTopValues(this.trackData);
  },
  methods: {
    getTopValues(trackData) {
      let songFeatures = {};

      songFeatures.acousticness = trackData.acousticness;
      songFeatures.danceability = trackData.danceability;
      songFeatures.energy = trackData.energy;
      songFeatures.instrumentalness = trackData.instrumentalness;
      songFeatures.liveness = trackData.liveness;
      songFeatures.speechiness = trackData.speechiness;
      songFeatures.valence = trackData.valence;

      let topValues = Object.values(songFeatures)
        .sort((a, b) => b - a)
        .slice(0, 3);

      this.topFeatures = topValues.map((value) =>
        Object.keys(songFeatures).find((key) => songFeatures[key] === value)
      );
    },
    getFeatureTitle(feature) {
      return this.featureText[feature].text;
    },
    getFeatureIcon(feature) {
      return this.featureText[feature].icon;
    }
  },
};
</script>