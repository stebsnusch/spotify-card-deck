<template>
  <div>
    <div>
      <div
        class="track mb-10"
        :ref="id"
        v-if="id && filteredStats"
        :style="dynamicStyle()"
      >
        <div class="header">
          <div class="num">#1</div>
          <div class="text">
            <h3 class="name">{{ name.toUpperCase() }}</h3>
          </div>
        </div>
        <img :src="image" v-on:load="loaded(image)" />
        <div class="skills">
          <div class="skill" v-for="stat in filteredStats" :key="stat.value">
            <span>{{ getFeatureTitle(stat.name).toUpperCase() }}</span>
            {{ (stat.value * 100).toFixed(1) }}
          </div>
        </div>
      </div>
      <div class="download d-flex flex-row justify-center my-5" align="center">
        <v-btn
          color="primary"
          align="center"
          v-on:click.stop="card.downloadCardImage($refs, id, name)"
        >
          <v-icon class="mr-2">mdi-download</v-icon>
          Download card
        </v-btn>
      </div>
    </div>
    <div :ref="`${id}-${name}-DIV`" style="height: 0; overflow: hidden"></div>
  </div>
</template>
<style lang="scss" scoped>
@import "../utils/fonts";
@import "../utils/cardStyling";
</style>

<script>
import { CardInfo } from "../utils/cardInfo";

export default {
  name: "PrismCard",
  data() {
    return {
      card: "",
      filteredStats: null,
      imgSrc: null,
    };
  },
  props: ["stats", "image", "artist", "name", "id"],
  mounted: async function () {
    this.card = new CardInfo();
    this.filteredStats = await this.card.getStats(this.stats);
  },
  methods: {
    async emitLoadedCard() {
      await this.card
        .generateImage(this.$refs, this.id, this.name)
        .then((response) => this.$emit("prismCard", response));
    },
    getFeatureTitle(name) {
      return this.card.getFeatureText(name);
    },
    loaded(src) {
      window.console.log(src);
      this.imgSrc = src;
      this.card.generateClone(this.$refs, this.id, this.name);
      this.emitLoadedCard();
    },
    dynamicStyle() {
      let background = `background-image: linear-gradient(to bottom right, rgb(194, 255, 182), rgb(255, 163, 182), rgb(221, 169, 255), rgb(162, 209, 255); box-shadow: inset 0 0 20px #fff, inset 10px 0 30px #f0f, inset -10px 0 30px #0ff, inset 10px 0 100px #f0f, inset -10px 0 100px #0ff, 0 0 20px #fff, -10px 0 30px #f0f, 10px 0 30px #0ff;`;

      let width = this.$vuetify.breakpoint.smAndDown
        ? "width: 90%; font-size: 0.8em;"
        : "width: 400px";
      return `${background} ${width}`;
    },
  },
};
</script>