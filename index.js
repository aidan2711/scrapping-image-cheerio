const cheerio = require("cheerio");
const { appAxios } = require("./appAxios");
const { downloadImage } = require("./downloadImage");

appAxios
  .get("http://bongda.wap.vn/bang-xep-hang-bong-da.html")
  .then(async (res) => {
    if (res.status === 200) {
      const $ = cheerio.load(res.data);
      const colNews = $(".New_col-centre");
      let leagues = [];
      colNews.find(".danh_sach_bxh").each((i, el) => {
        const url = $(el).find("a").attr("href");
        const name = $(el).find("a").text().trim();
        leagues.push({
          name: name,
          url: url.toString(),
        });
      });
      const teams = await getLinksTeam(leagues);
      const imageTeams = await getImagesTeam(teams);
      await download(imageTeams);
    }
  })
  .catch((err) => console.error(err));

const getLinksTeam = async (leagues) => {
  const teams = await Promise.all(
    leagues.map(async (league) => {
      return await getTeams(league);
    })
  );
  var filtered = teams.filter((el) => {
    return el != null;
  });
  return filtered;
};

const getTeams = async (league) => {
  const { name, url } = league;
  try {
    const res = await appAxios.get(url);
    const $ = cheerio.load(res.data);
    const colNews = $("table");
    const teamUrls = [];
    await Promise.all(
      colNews.find(".xanhbxh").each((i, el) => {
        const url = $(el).attr("href");
        teamUrls.push(url);
      })
    );
    return { name: name, urls: teamUrls };
  } catch (error) {
    (error) => console.error(error);
  }
};

const getImagesTeam = async (teams) => {
  try {
    const imageTeams = await Promise.all(
      teams.map(async (team) => {
        const images = await Promise.all(
          team.urls.map(async (url) => {
            return await getImage(url);
          })
        );
        return {
          name: team.name,
          urls: images,
        };
      })
    );
    var filtered = imageTeams.filter((el) => {
      return el != null;
    });
    return filtered;
  } catch (error) {
    console.log(error);
  }
};

const getImage = async (teamUrl) => {
  try {
    const response = await appAxios.get(`http://bongda.wap.vn${teamUrl}`);
    const $ = cheerio.load(response.data);
    const image = $("img.CLB_logo").attr("src");
    console.log(`get image url: ${image}`);
    return image;
  } catch (err) {
    (err) => console.error(err);
  }
};

const download = async (imageTeams) => {
  console.log(imageTeams);
  await Promise.all(
    imageTeams.map(async (team) => {
      if (team.urls.length > 0) {
        await Promise.all(
          team.urls.map(async (url) => {
            if (url) {
              await downloadImage(url);
            }
          })
        );
      }
    })
  );
};
