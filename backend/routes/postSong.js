const express = require('express');
const router = express.Router();
const Post = require('../models/postSong');
const bodyParser = require('body-parser');

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
    Post.find({title: {$regex : songData, $options: 'i'}}, {_id: 0, __v: 0}).then(results => {
       for(let i = 0; i < results.length; i++){
           if(i < 11)
           songsList.add(results[i]);
       }
       const songs = Array.from(songsList);
       //console.log(songs);
       setTimeout(() => {
            res.writeHead(200,{'Content-Type': 'application/json'});
res.write(JSON.stringify({items: songs}));
res.end();
       }, 2000)
      
    })
}
})
    module.exports = router;