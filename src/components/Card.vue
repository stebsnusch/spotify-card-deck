<template>
  <div>
    <div>
      <div
        class="track"
        :ref="id"
        v-if="lightColor && darkColor"
        :style="dynamicStyle()"
      >
        <div class="header">
          <div class="num">#{{ index }}</div>
          <div class="text">
            <h3 class="name">{{ name.toUpperCase() }}</h3>
          </div>
        </div>
        <img :src="image" />
        <div class="skills">
          <div class="skill" v-for="stat in filteredStats" :key="stat.value">
            <span>{{ getFeatureTitle(stat.name).toUpperCase() }}</span>
            {{ (stat.value * 100).toFixed(1) }}
          </div>
        </div>
      </div>
      <div class="download d-flex flex-row justify-center my-5" align="center">
        <v-btn
          v-if="browser"
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
  name: "Card",
  data() {
    return {
      card: {},
      filteredStats: [],
      lightColor: "",
      darkColor: "",
      cardImage: null,
    };
  },
  props: ["stats", "colors", "image", "artist", "name", "index", "id", "browser"],
  mounted: async function () {
    this.card = new CardInfo();
    this.filteredStats = this.card.getStats(this.stats);
    await this.colors.then((res) => {
      this.lightColor = res[0];
      this.darkColor = res[1];
    });
    (await this.filteredStats) &&
      this.card.generateClone(this.$refs, this.id, this.name);
  },
  methods: {
    getFeatureTitle(name) {
      return this.card.getFeatureText(name);
    },
    dynamicStyle() {
      let background = `background-image: linear-gradient(to right, ${this.lightColor}, ${this.darkColor};`;
      let width = this.$vuetify.breakpoint.smAndDown
        ? "width: 90%; font-size: 0.8em;"
        : "width: 400px;";
      return `${background} ${width}`;
    },
  },
};
</script>