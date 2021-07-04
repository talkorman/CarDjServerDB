const express = require('express');
const router = express.Router();
const Post = require('../models/postSong');
const bodyParser = require('body-parser');

router.get("/:songDetail", (req, res, next) => {
    let songsList = new Set();
    const songs = String(req.params.songDetail);
    const songData = songs.replaceAll('+', ' ');
    console.log(songData);
    Post.find({title: {$regex : songData, $options: 'i'}}, {_id: 0}).then(results => {
       for(let i = 0; i < results.length; i++){
           if(i < 11)
           songsList.add(results[i]);
       }
       console.log(songsList);
       res.json({
           item: songsList
       })
    })
})
    module.exports = router;