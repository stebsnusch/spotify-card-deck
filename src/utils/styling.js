
import * as Vibrant from "node-vibrant";
export class Colors {
  lightColor;
  darkColor;
  mutedColor;
  lightMutedColor;
  darkMutedColor;
  vibrantColor;

  constructor(image) {
    this.vibrantInstance = new Vibrant(image);
  }

  setPageBackground = (pageElement) => this.vibrantInstance.getPalette()
    .then(res => pageElement.style.backgroundImage = `linear-gradient(to bottom right, 
    ${res.LightVibrant.getHex()}, 
    ${res.DarkVibrant.getHex()}`)


  getDarkColor = async () => this.darkColor = await this.vibrantInstance
    .getPalette()
    .then((palette) => palette.DarkVibrant.hex);

  getLightColor = async () => this.lightColor = await this.vibrantInstance
    .getPalette()
    .then((palette) => palette.LightVibrant.hex);

  getMutedColor = async () => this.mutedColor = await this.vibrantInstance
    .getPalette()
    .then((palette) => palette.Muted.hex);

  getLightMutedColor = async () => this.lightMutedColor = await this.vibrantInstance
    .getPalette()
    .then((palette) => palette.LightMuted.hex);

  getDarkMutedColor = async () => this.darkMutedColor = await this.vibrantInstance
    .getPalette()
    .then((palette) => palette.DarkMuted.hex);

  getVibrantColor = async () => this.vibrantColor = await this.vibrantInstance
    .getPalette()
    .then((palette) => palette.Vibrant.hex);
}

export class Canvas {
  context;
  constructor(canvas) {
    this.canvas = canvas;
    this.init();
  }

  init = () => {
    this.getContext();
    this.context.save();
  }

  reset = () => {
    this.context.restore();
    this.context.textAlign = 'start';
    this.context.filter = 'none';
  }

  getContext = () => this.context = this.canvas.getContext("2d");

  setBlackBackground = () => {
    this.context.fillStyle = '#000';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.reset();
  }

  placeImageCenter = (image, width, height) => {
    let imgWidth = width / 2;
    let imgHeight = height / 2
    let middleX = (this.canvas.width / 2) - imgWidth;
    let middleY = (this.canvas.height / 2) - imgHeight;

    this.drawImage(image, middleX, middleY, width, height);
  }

  getLightColorText = (text, size, x, y) => {
    this.context.font = `400 ${size}px Chakra Petch`;
    this.context.textAlign = "center";
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#fff';
    this.context.fillText(text, x, y);

    this.reset()
  }

  drawImage = (image, x, y, imageWidth, imageHeight) => {
    window.console.log(image);
    let canvinhas = this;
    window.setTimeout(function(canvinhas){
      canvinhas.banana(canvinhas, image, x, y, imageWidth, imageHeight)
    }, 1500, canvinhas);
    this.reset();
  }

  banana = (canvas, image, x, y, imageWidth, imageHeight) => {
    window.console.log(image.complete)
    canvas.context.drawImage(image, x, y, imageWidth, imageHeight);
  }
}
