import * as Spotify from "spotify-web-api-js"
import queryString from "query-string";

const getToken = () => queryString.parse(window.location.search).access_token;


const setToken = (api) => {
  let token = getToken();
  return api.setAccessToken(token);
}

export const apiInit = async () => {
  let api = new Spotify();
  setToken(api);

  return api;
}