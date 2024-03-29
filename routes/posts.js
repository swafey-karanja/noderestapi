const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//update a post
router.put("/:id", async (req,res) =>{
   try{
    const post = await Post.findById(req.params.id);
    if(post.userId === req.body.userId){
        await post.updateOne({$set: req.body});
        res.status(200).json("Post successfuly updated");
    }else{
        res.status(403).json("You can only update your posts");
    }
   }catch(err){
    res.status(500).json(err);
   }
});

//delete a post
router.delete("/:id", async (req,res) =>{
    try{
     const post = await Post.findById(req.params.id);
     if(post.userId === req.body.userId){
         await post.deleteOne();
         res.status(200).json("Post successfuly deleted");
     }else{
         res.status(403).json("You can only delete your posts");
     }
    }catch(err){
     res.status(500).json(err);
    }
 });

//like and unlike a post
router.put("/:id/like", async (req,res) =>{
  try{
    const post = await Post.findById(req.params.id);
    //check if the likes array had the liker's Id
    if(!post.likes.includes(req.body.userId)){
      await post.updateOne( {$push: {likes: req.body.userId} });
      res.status(200).json("You liked this post");
    } else{
      await post.updateOne( {$pull: {likes: req.body.userId} });
      res.status(200).json("You unliked this post");
    }
  }catch(err) {
    res.status(500).json(err);
  }
});

//get a post
router.get("/:id", async (req,res) =>{
  try{
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  }catch(err) {
    res.status(500).json(err);
  }
});

//get timeline posts from people the user is following
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts));
  } catch (err) {
      console.error(err); // Log the error
      res.status(500).json(err);
  }
});

module.exports = router;