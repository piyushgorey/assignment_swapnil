const express = require("express");
const router = express.Router();
const data = require("../data");
const likeData = data.likes

router.post("/", async (req, res) => {
    const likeInfo = req.body;

    if (!likeInfo) {
        res.status(400).json({ error: "You must provide data the Animal id and the Post id" });
        return;
      }
    
      if (!likeInfo.animalid) {
        res.status(400).json({ error: "You must provide an animal id" });
        return;
      }
    
      if (!likeInfo.postid) {
        res.status(400).json({ error: "You must provide a post id" });
        return;
      }

    try {
      await likeData.likePost(likeInfo.animalid,likeInfo.postid);
      //res.sendStatus(200).json(newLike);
      res.sendStatus(200)
    } catch (e) {
      res.sendStatus(500).json({ error: e });
    }
});
module.exports = router;