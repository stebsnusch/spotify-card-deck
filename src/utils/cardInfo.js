import * as domtoimage from "dom-to-image";

export class CardInfo {
  featureText = {
    acousticness: {
      text: "MANA",
    },
    valence: {
      text: "WILL",
    },
    energy: {
      text: "STRENGTH",
    },
    danceability: {
      text: "SPEED",
    },
    speechiness: {
      text: "PERSUASION",
    },
  }

  getFeatureText = (text) => {
    return this.featureText[text] && this.featureText[text].text;
  }

  filterFeatures = (song) => {
    let songFeatures = {};

    songFeatures.acousticness = song.acousticness;
    songFeatures.danceability = song.danceability;
    songFeatures.energy = song.energy;
    songFeatures.speechiness = song.speechiness;
    songFeatures.valence = song.valence;
    return songFeatures;
  }

  getStats = (data) => {
    let statsArray = [];

    let featureArray = Object.keys(this.filterFeatures(data));
    featureArray.map((item) =>
      featureArray.find((key) => {
        if (key === item) {
          statsArray.push({ name: key, value: data[key] });
        }
      })
    );

    return statsArray;
  }


  generateClone = (reference, id, name) => {
    let container = `${id}-${name}-DIV`;
    let cloneCardContainer = reference[container];

    let originalCard = reference[id];

    let cloneCard = originalCard.cloneNode(true);
    cloneCard.style.margin = "0";

    cloneCardContainer.appendChild(cloneCard);
  };

  generateImage(reference, id, name) {
    let clone = `${id}-${name}-DIV`;
    let image = reference[clone].children[0];
    return domtoimage
      .toJpeg(image, {
        bgcolor: "#000",
        style: {
          boxShadow: 'none',
        }
      })
  }

  async downloadCardImage(reference, id, name) {
    await this.generateImage(reference, id, name)
      .then(function (dataUrl) {
        let link = document.createElement("a");
        link.download = `CARD-${name}.jpeg`;
        link.href = dataUrl;
        link.click();
      });
  }
}