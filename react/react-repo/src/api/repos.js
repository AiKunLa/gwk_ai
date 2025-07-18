import axios from "axios";

const BASE_URL = "https://api.github.com/users/";

export const getRepos = (username) => {
  return axios.get(`${BASE_URL}${username}/repos`);
};
