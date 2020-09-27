import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: colors.cyan.darken2,
        secondary: colors.pink.darken2,
        accent: colors.purple.darken2,
        error: colors.red.darken2,
      }
    }
  }
});
