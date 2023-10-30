const axios = require("axios");
const cheerio = require("cheerio");
let chart;
async function getHTML() {
    try {
      return await axios.get("https://music.apple.com/kr/room/1457138285");
    } catch (error) {
      console.error(error);
    }
  }

getHTML()
    .then(html => {
        let titleList = [];
        const $ = cheerio.load(html.data);
        
        const bodyList = $("#web-main > div.loading-inner > div > div > div > div.titled-box-content > div.songs-list.typography-callout").children("div.songs-list-row.songs-list-row--web-preview.web-preview.songs-list-row--two-lines.songs-list-row--song");

        
        bodyList.each(function(i, elem) {
        titleList[i] = {
            title: $(this)
            .find("div.songs-list__col.songs-list__col--song.typography-body > div > div.songs-list-row__song-wrapper > div > div.songs-list-row__explicit-wrapper > div")
            .text()!=''?$(this)
            .find("div.songs-list__col.songs-list__col--song.typography-body > div > div.songs-list-row__song-wrapper > div > div.songs-list-row__explicit-wrapper > div")
            .text():$(this)
            .find("div.songs-list__col.songs-list__col--song.typography-body > div > div.songs-list-row__song-wrapper > div > div.songs-list-row__song-name")
            .text(),

            artist:$(this)
            .find("div.songs-list__col.songs-list__col--song.typography-body > div > div.songs-list-row__song-wrapper > div > div.songs-list-row__by-line > span > a")
            .text(),

            img:$(this).find("div.songs-list__col.songs-list__col--song.typography-body > div.songs-list-row__song-container > div.songs-list-row__index-wrapper > div.songs-list-row__song-index > div>picture>source").attr("srcset")
        };
    });
    return titleList;
  }).then(r=>console.log(r));


  


