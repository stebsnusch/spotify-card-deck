import * as Spotify from "spotify-web-api-js"
import queryString from "query-string";

const getToken = () => queryString.parse(window.location.search).access_token;


const setToken = (api) => {
  let token = getToken();
  return api.setAccessToken(token);
}

export const apiReset = () => {
  const url = 'https://www.spotify.com/logout/';
  const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40')
  setTimeout(() => spotifyLogoutWindow.close(), 2000)
};

export const apiInit = async () => {
  let api = new Spotify();
  setToken(api);

  return api;
}