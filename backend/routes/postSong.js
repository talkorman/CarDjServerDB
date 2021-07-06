const express = require('express');
const router = express.Router();
const Post = require('../models/postSong');
const bodyParser = require('body-parser');
const https = require('https');

let currentSearchWord = '';
let searchWord = '';
const reqTime = setInterval(()=>{
    currentSearchWord = "";
    }, 10000);

router.get("/:songDetail", (req, res, next) => {   
    let songsList = new Set();
    searchWord = req.params.songDetail;    
    
    if(
        searchWord != currentSearchWord
        && searchWord != "gaocc" 
        && searchWord != "favicon.ico" 
        && searchWord != "guu4" 
        && searchWord != "1" 
        && searchWord.length > 2){
    currentSearchWord = searchWord;
    const reg = /\+/g;
    const songData = searchWord.replace(reg, ' ');
    //console.log(songData);
    Post.find({title: {$regex : songData, $options: 'i'}}, {_id: 0, __v: 0})
    .then(results => {
       for(let i = 0; i < results.length; i++){
           songsList.add(results[i]);
       }
       const songs1 = Array.from(songsList);
       const songs2 = removeDuplicates(songs1, 'videoId');
    })
    .then(results => {
        if(results.length < 10){
            https.get('https://cardjserver.herokuapp.com', res =>{
                let data = '';
                res.on('data', chunk => {
                    data += chunk
                });
                res.on('end', () => {
                    const extraSongs = JSON.parse(data).items;
                    for(let i = 0; i < extraSongs; i++){
                        let song = extraSongs[i];
                        const post = new Post({
                        videoId: song.videoId,
                        title: song.title,
                        description: song.description,
                        photoUrl: song.photoUrl
                 });
                    post.save().then(result => {
                    })
                    }
                    songs2.concat(extraSongs);
                    responseSongs();
                    return;
                })
            })
        }
        responseSongs();
    })
       //console.log(songs);
 function responseSongs(){
       setTimeout(() => {
            res.writeHead(200,{'Content-Type': 'application/json'});
res.write(JSON.stringify({items: songs2}));
res.end();
       }, 2000)
    }
    
}
})
    function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) == pos;
        })
    }

    module.exports = router;