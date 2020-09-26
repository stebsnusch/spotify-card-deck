<template>
  <v-container class="fill-height">
    <v-row>
      <v-col align="center">
        <h2 class="mb-5">Analyzing your deck...</h2>
        <v-progress-circular indeterminate size="100" width="10" color="primary"></v-progress-circular>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'Loading'
}
</script>