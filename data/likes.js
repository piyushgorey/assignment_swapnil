const mongoCollections = require("../config/mongoCollections");
// const animals = require("./animals");
const posts = require("./posts")
//const posts = mongoCollections.posts;
const animals = mongoCollections.animals;
const uuid = require("node-uuid");

let exportedMethods ={
    async likePost(animalid, postid){
        if (animalid==undefined||postid==undefined){
            throw `Animal_ID and Post_ID field is mandatory for liking a post.`
        }
        const mypost = await posts.getPostById(postid)
        const animalCollection = await animals();
        let updateAnimal ={
            likes:{
                _id:postid,
                title:mypost.title
            }
        }
        const updatedanimalInfo = await animalCollection.updateOne({_id:animalid}, {$set: updateAnimal})
            if (updatedanimalInfo.modifiedCount === 0){
                throw "Something went wrong, Could not like the post";
        }
        else{
            console.log("The like is added to animal account info")
        }
    }
}
module.exports= exportedMethods