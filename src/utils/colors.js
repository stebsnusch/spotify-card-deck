
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