<template>
  <div id="other-tracks" v-if="related.length > 0">
    <div v-for="artist in related" :key="artist.id" class="card">
      <h3 class="title">{{ artist.name }}</h3>

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
  name: "Recommendation",
  data() {
    return {
      spotify: '',
    };
  },
  props: ["playlist"],
  
  mounted: async function () {
  },
};
</script>