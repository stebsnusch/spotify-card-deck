<template>
  <v-container class="fill-height text-center flex-column justify-center" align="center" fluid>
    <div>
      <h1 class="mb-5">Spotify Card Deck</h1>
      <v-btn rounded color="secondary" :href="authLink" large>Login to get yours!</v-btn>
    </div>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      authLink: "https://spotify-card-deck-backend.herokuapp.com/login",
    };
  },
};
</script>