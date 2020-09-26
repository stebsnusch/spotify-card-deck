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
}