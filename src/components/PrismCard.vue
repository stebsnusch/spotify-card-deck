<template>
  <div>
    <div class="list">
      <div class="track" :style="dynamicStyle()">
        <div class="header">
          <div class="num">#1</div>
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
  </div>
</template>
<style lang="scss" scoped>
.list {
  .track {
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-radius: 10px;
    margin: 0 auto;
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
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
}
</style>

<script>
import { CardInfo } from "../utils/cardInfo";

export default {
  name: "PrismCard",
  data() {
    return {
      card: "",
      filteredStats: [],
    };
  },
  props: ["stats", "image", "artist", "name"],
  mounted: function () {
    this.card = new CardInfo();
    this.filteredStats = this.card.getStats(this.stats);
  },
  methods: {
    getFeatureTitle(name) {
      return this.card.getFeatureText(name);
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