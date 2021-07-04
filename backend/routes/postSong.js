const express = require('express');
const router = express.Router();
const Post = require('../models/postSong');
const bodyParser = require('body-parser');

let avoidMultipleReq = '';

router.get("/:songDetail", (req, res, next) => {
    setTimeout(()=>{
        if(avoidMultipleReq != '')
        avoidMultipleReq = ''
    }, 200);
    let songsList = new Set();
    const songs = req.params.songDetail;
    if(avoidMultipleReq == songs){
        avoidMultipleReq = '';
        return;
    }
    avoidMultipleReq = songs;
    const reg = /\+/g;
    const songData = songs.replace(reg, ' ');
    console.log(songData);
    Post.find({title: {$regex : songData, $options: 'i'}}, {_id: 0, __v: 0}).then(results => {
       for(let i = 0; i < results.length; i++){
           if(i < 11)
           songsList.add(results[i]);
       }
       const songs = Array.from(songsList);
       console.log(songs);
       res.writeHead(200,{'Content-Type': 'application/json'});
res.write(JSON.stringify({items: songs}));
res.end();
    })
})
    module.exports = router;