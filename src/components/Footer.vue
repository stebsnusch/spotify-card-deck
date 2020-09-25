<template>
  <footer>
    <div class="item">
      
      <h1>Spotify Card Deck</h1>
    </div>
    <div class="item">
     
      <a href="https://stebsnusch.github.io/">stebsnusch</a>
    </div>
  </footer>
</template>
<style lang="scss" scoped>
footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: black;
  color: white;
  font-size: 1em;
  position: relative;
  padding: 20px;
  z-index: 9;
  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    svg {
      margin-right: 8px;
    }
    h1 {
      font-size: 1.2em;
    }
  }
}
</style>

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