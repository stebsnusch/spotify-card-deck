<template>
  <div class="text-center d-flex flex-column">  
    <h3 class="d-block">Spotify Card Deck</h3>
    <p class="d-block">Made with <span class="pink--text">♥</span> by <a href="https://stebsnusch.github.io/">stebsnusch</a></p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      token: "",
      topArtists: [],
      topArtist: "",
      topTrack: "",
      isLoading: true,
    };
  },
  name: "Footer",
};
</script>