const express = require('express');
const logger = require('morgan');
const axios = require('axios');
const list = require('./data');
const firebase = require('./firebase');


var app = express()
const port = 3000
const db = firebase.firestore();

app.use(express.json())
app.use(express.urlencoded({'extended' : true}));
app.use(logger('dev'));
app.use(express.static('public'));   // html, image 등 정적파일 제공 폴더 지정


app.get('/', (req, res) => {
  res.sendFile('index.html')
})


//curl localhost:3000/user/tommy
app.get('/user/:id', (req, res) => {
  res.send(`User id is ${req.params.id}`); // Or res.send('User id is ' + req.params.id);
})

// In zsh, u should try curl "http://localhost:{port}/user?id={ur-id}" //curl "http://localhost:3000/user?id=tommy"
app.get('/user', (req, res) => {
  res.send(`User id is ${req.query.id}`);
})

// curl -X POST localhost:3000/user -d '{"id" : "jyc", "name" : "Jae Young"}' -H "Content-Type: application/json"
app.post('/user', (req, res) => {
  console.log(req.body.name);
  res.send(req.body);
})

app.get('/music_list', (req,res) => {
  res.json(list);
})

app.get('/musicSearch/:term', async (req, res) => {
  const params = {
    term : req.params.term,
    media: "music",

  }
  var response = await axios.get('https://itunes.apple.com/search', {params : params}).catch(e => console.log(e));
  console.log(response.data);
  res.json(response.data);
})


app.get('/likes', async (req,res) =>{
  var db = firebase.firestore();
  const snapshot = await db.collection('likes')
    .get()
    .catch(e => console.log(e));
  var results = [];

  if (snapshot.empty){
    console.log("No result!");
    res.json([]);

  } else{
    snapshot.forEach(doc => {
      results.push({id: doc.id, like: doc.data().like});
      console.log(doc.id, '=>', doc.data());
    })
    res.json(results);
  }
})

app.post('/like/:id',(req,res) =>{
  console.log(req.params.id);
  let {collectionName,artistName,primaryGenreName,trackCensoredName,artworkUrl100,status} =req.body;
  console.log(trackCensoredName);
  let id = req.params.id;
  // let db = firebase.firestore();
  let result = db.collection('likes').doc(id)
    .set({like : status,
      collectionName: collectionName,
      artistName: artistName,
      primaryGenreName: primaryGenreName,
      trackCensoredName: trackCensoredName,
      artworkUrl100: artworkUrl100
    }) // search 결과가 앨범,아티스트->노래명,아티스트로 바뀌어서 collectionCensoredName -> trackCensoredName로 바꾸었습니다..
    .then(() => {
    console.log("Document successfully written!");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });

  res.send(result);
})

app.get('/favorite', async (req, res) => {
  const params = {
    id : ""
  }
  var idstring=""
  var db=firebase.firestore();
  const like=db.collection('likes');
  const snapshot=await like.where('like','==',true)
  .get()
  .catch(e=>console.log(e));
  if(snapshot.empty){
    console.log("No result!");
  }else{
    snapshot.forEach(doc=>{
      console.log(doc.id, '=>', doc.data());
      idstring=idstring+String(doc.id)+',';
    })
    params.id+=idstring.substr(0,idstring.length-1);
    const response = await axios.get('https://itunes.apple.com/lookup', {params : params}).catch(e=>console.log(e));
    console.log(response.data);
    res.json(response.data);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/charts', async (req,res) =>{
  const axios = require("axios");
  const cheerio = require("cheerio");
  async function getHTML() {
      try {
        //아이튠즈 실시간 차트 순위
        return await axios.get("https://music.apple.com/kr/room/1457138285");
      } catch (error) {
        console.error("아이튠즈 파싱 에러!!");
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

            img:$(this).find("div.songs-list__col.songs-list__col--song.typography-body > div.songs-list-row__song-container > div.songs-list-row__index-wrapper > div.songs-list-row__song-index > div>picture>source").attr("srcset").toString().split(" ")[2]
        };
    });
    return titleList;
  })
  .then(r=>{
    console.log(r);
    res.json(r);
  });
})

