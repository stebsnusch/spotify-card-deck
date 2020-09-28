
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
    let middleX = (this.canvas.width / 2) - width;
    let middleY = (this.canvas.height / 2) - height;
    this.drawImage(image, middleX, middleY, width, height);
  }

  getLightColorFill = async (x, y, width, height) => {
    this.context.fillStyle = await this.colors.getLightColor();
    this.context.fillRect(x, y, width, height);
    this.reset()
  }

  getLightColorText = async (text, x, y) => {
    if (text.length >= 15) {
      this.context.font = "600 100px Poppins";
    }
    this.context.textBaseline = 'middle';
    this.context.fillStyle = '#fff';
    this.context.fillText(text, x, y);

    this.reset()
  }

  drawImage = (image, x, y, imageWidth, imageHeight) => (
    window.console.log(image),
    this.context.drawImage(image, x, y, imageWidth, imageHeight),
    this.reset()
  )

  generateImage = () => this.canvas.toDataURL();

  getGradientColorTransparentFill = async (x, y, width, height, opacity) => {
    let gradient = this.context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, await this.colors.getVibrantColor());
    gradient.addColorStop(1, await this.colors.getDarkColor());
    this.context.fillStyle = gradient;
    this.context.globalAlpha = opacity;
    this.context.filter = 'contrast(175%) saturate(200%)';
    this.context.fillRect(x, y, width, height);
    this.context.globalAlpha = 1;
    this.reset()
  }
}
