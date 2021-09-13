const { appAxios } = require("./appAxios");
const fs = require("fs");

module.exports = {
  async downloadImage(url) {
    const imageName = url.substring(url.lastIndexOf("/") + 1);
    const removeLink = url.replace(
      "http://static.bongda.wap.vn/team-logo/",
      ""
    );
    const folder = removeLink.substring(0, removeLink.indexOf("/"));
    console.log(`${imageName} downloading`);
    try {
      await appAxios({
        url,
        responseType: "stream",
      }).then((response) => {
        if (!fs.existsSync(folder)) {
          fs.mkdirSync(folder);
        }
        if (fs.existsSync(`${folder}/${imageName}`)) {
          new Promise((resolve, reject) => resolve());
        }
        new Promise((resolve, reject) => {
          response.data
            .pipe(fs.createWriteStream(`${folder}/${imageName}`))
            .on("finish", () => {
              resolve();
              console.log(`${imageName} downloaded`);
            })
            .on("error", (e) => reject(e));
        });
      });
    } catch (error) {
      console.log(error);
    }
  },

  // async downloadImage(url, dir, image) {
  //   try {
  //     if (!fs.existsSync(dir)) {
  //       fs.mkdirSync(dir);
  //     }
  //     if (!fs.existsSync(`${dir}/${image}`)) {
  //       const response = await appAxios({
  //         url,
  //         responseType: "stream",
  //       });
  //       new Promise((resolve, reject) => {
  //         response.data
  //           .pipe(fs.createWriteStream(`${dir}/${image}`))
  //           .on("finish", () => resolve())
  //           .on("error", (e) => reject(e));
  //       });
  //     }
  //     return;
  //   } catch (error) {
  //     return error;
  //   }
  // },
};
