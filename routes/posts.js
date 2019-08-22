const express = require("express");
const router = express.Router();
const data = require("../data");
const postData = data.posts


router.get("/", async (req, res) => {
  try {
    const postList = await postData.getAllPosts();
    res.json(postList);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});


router.get("/:id", async (req, res) => {
    try {
      const post = await postData.getPostById(req.params.id);
      res.json(post);
      res.sendStatus(200)
    } catch (e) {
      res.status(404).json({ error: "Post not found" });
    }
  });

  router.get ("/:name", async(req, res)=>{

    try {
      const post = await postData.getPostByName(req.params.name);
      res.json(post);
      res.sendStatus(200)
    } catch (e) {
      res.status(404).json({ error: "Post not found" });
    }
  });


  
router.post("/", async (req, res) => {
  const postInfo = req.body;

  if (!postInfo) {
      res.status(400).json({ error: "You must provide data to create a Post" });
      return;
    }
  
    if (!postInfo.title) {
      res.status(400).json({ error: "You must provide a title" });
      return;
    }
  
    if (!postInfo.content) {
      res.status(400).json({ error: "You must provide some content for the post" });
      return;
    }

    if (!postInfo.author) {
      res.status(400).json({ error: "You must provide an author for the post" });
      return;
    }

  try {
    const newPost = await postData.createPost(
      postInfo.title,
      postInfo.content,
      postInfo.author
    );

    res.json(newPost);
  } catch (e) {
    res.json({ error: e });
  }
});

router.put("/:id", async (req, res) => {
  const updatedData = req.body;

  if (!updatedData) {
      res.status(400).json({ error: "You must provide data to update the post" });
      return;
    }
  
    if (!updatedData.newTitle) {
      res.status(400).json({ error: "You must provide a new title for the post" });
      return;
    }
  
    if (!updatedData.newContent) {
      res.status(400).json({ error: "You must provide a new content for the post" });
      return;
    }

  try {
    await postData.getPostById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
  }

  try {
    const updatedPost = await postData.updatePost(req.params.id, updatedData.newTitle, updatedData.newContent);
    res.json(updatedPost);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await postData.getPostById(req.params.id);
  } catch (e) {
    res.status(404).json({ error: "Post not found" });
  }

  try {
    const deletedPost=await postData.deletePost(req.params.id);
    res.json(deletedPost)
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

  module.exports = router;
  
  