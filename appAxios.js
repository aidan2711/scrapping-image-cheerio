const axios = require("axios");
const today = new Date();
const todayGMT = today.toGMTString();

const appAxios = axios.create({});

appAxios.interceptors.request.use(
  async (config) => {
    config.headers = {
      Authorization: "stats.fn.sportradar.com",
      Referer: "https://s5.sir.sportradar.com/",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9,vi;q=0.8",
      // "if-modified-since": `${todayGMT}`,
      origin: "https://s5.sir.sportradar.com",
      referer: "https://s5.sir.sportradar.com/",
      "sec-ch-ua":
        '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
    };
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

module.exports = {
  appAxios,
};
