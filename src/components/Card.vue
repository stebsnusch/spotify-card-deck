<template>
  <div>
    <div>
      <div class="download d-flex flex-row justify-center my-5" align="center">
        <v-btn
          color="primary"
          align="center"
          v-on:click.stop="downloadCardImage(id, name)"
        >
          <v-icon class="mr-2">mdi-download</v-icon>
          Download card
        </v-btn>
      </div>
      <div
        class="track"
        :id="id"
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
    </div>
    <div :id="`${id}-${name}-DIV`" style="height: 0; overflow: hidden"></div>
  </div>
</template>
<style lang="scss" scoped>
@import "../utils/fonts";

.track {
  font-family: "Chakra Petch";
  margin: 0 auto;
  width: 400px;
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  border-radius: 10px;
  -webkit-box-shadow: 0px 3px 28px -2px rgba(235, 235, 235, 0.3);
  -moz-box-shadow: 0px 3px 28px -2px rgba(235, 235, 235, 0.3);
  box-shadow: 0px 3px 28px -2px rgba(235, 235, 235, 0.3);
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.num {
  color: #2d2d2d;
  width: 50px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid black;
  border-radius: 50%;
  padding: 10px;
  box-sizing: border-box;
  font-size: 1em;
  margin-right: 5px;
}

.text {
  color: #2d2d2d;
  width: 100%;
  background-color: #fff;
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
  .name {
    font-size: 1.2em;
    font-weight: 400;
    margin-left: 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
img {
  margin: 20px 0;
  width: 100%;
  box-sizing: border-box;
  border-radius: 10px;
}

.skills {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  background-color: #fff;
  border-radius: 10px;
  border: 1px solid black;
}
.skill {
  display: flex;
  flex-direction: row;
  padding: 10px;
  color: #000;
  justify-content: space-between;
  position: relative;
  border-bottom: 1px dashed black;
  &:last-child {
    border-bottom: none;
  }
}
</style>

<script>
import * as domtoimage from "dom-to-image";
import { CardInfo } from "../utils/cardInfo";

export default {
  name: "Card",
  data() {
    return {
      card: {},
      filteredStats: [],
      lightColor: "",
      darkColor: "",
    };
  },
  props: ["stats", "colors", "image", "artist", "name", "index", "id"],
  mounted: async function () {
    this.card = new CardInfo();
    this.filteredStats = this.card.getStats(this.stats);
    await this.colors.then((res) => {
      this.lightColor = res[0];
      this.darkColor = res[1];
    });
    this.generateClone(this.id, this.name);
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
    generateClone(id, name) {
      let cloneCardContainer = document.getElementById(`${id}-${name}-DIV`);
      let originalCard = document.getElementById(id);
      let cloneCard = document.getElementById(`${id}-${name}`);

      cloneCard = originalCard.cloneNode(true);
      cloneCard.style.margin = "0";
      cloneCard.setAttribute("id", `${id}-${name}`);

      cloneCardContainer.appendChild(cloneCard);
    },
    getCloneCard(id, name) {
      return document.getElementById(`${id}-${name}`);
    },
    downloadCardImage(id, name) {
      let image = this.getCloneCard(id, name);

      domtoimage
        .toPng(image, {
          bgcolor: "#000",
        })
        .then(function (dataUrl) {
          let link = document.createElement("a");
          link.download = `CARD-${name}.png`;
          link.href = dataUrl;
          link.click();
        });
    },
  },
};
</script>