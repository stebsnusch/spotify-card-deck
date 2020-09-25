<template>
  <div>
    <div class="track" v-if="lightColor && darkColor" :style="gradientBackground()">
      <div class="header">
        <div class="num">#{{index}}</div>
        <div class="text">
          <h3 class="name">{{name.toUpperCase()}}</h3>
        </div>
      </div>
      <img :src="image" />
      <div class="skills">
        <div class="skill" v-for="stat in filteredStats" :key="stat.value">
          <span>{{getFeatureTitle(stat.name).toUpperCase()}}</span>
          {{(stat.value * 100).toFixed(1)}}
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.track {
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
  .name {
    font-size: 1.2em;
    font-weight: 400;
    margin-left: 10px;
  }
  .artist {
    font-size: 1.2em;
    margin-left: 10px;
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
  props: ["stats", "colors", "image", "artist", "name", "index"],
  mounted: async function () {
    this.card = new CardInfo();
    this.filteredStats = this.card.getStats(this.stats);
    await this.colors.then((res) => {
      this.lightColor = res[0];
      this.darkColor = res[1];
    });
  },
  methods: {
    getFeatureTitle(name) {
      return this.card.getFeatureText(name);
    },
    gradientBackground() {
      return `background-image: linear-gradient(to right, ${this.lightColor}, ${this.darkColor}`;
    },
  },
};
</script>