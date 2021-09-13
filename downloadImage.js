const { appAxios } = require("./appAxios");
const fs = require("fs");

module.exports = {
  async downloadImage(url) {
    try {
      const imageName = url.substring(url.lastIndexOf("/") + 1);
      const removeLink = url.replace(
        "http://static.bongda.wap.vn/team-logo/",
        ""
      );
      const folder = removeLink.substring(0, removeLink.indexOf("/"));
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      }
      if (!fs.existsSync(`${folder}/${imageName}`)) {
        console.log(`[DOWNLOADING]: ${imageName}`);
        await appAxios({
          url,
          responseType: "stream",
        }).then((response) => {
          new Promise((resolve, reject) => {
            response.data
              .pipe(fs.createWriteStream(`${folder}/${imageName}`))
              .on("finish", () => {
                resolve();
                console.log(`[DOWNLOADED]: ${imageName}`);
              })
              .on("error", (e) => reject(e));
          });
        });
      }
      new Promise((resolve, _) => resolve());
    } catch (error) {
      console.log(`${error.message} with ${url}`);
    }
  },
};
