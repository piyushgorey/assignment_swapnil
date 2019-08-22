const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;
const animals = mongoCollections.users;
const uuid = require("node-uuid");

let exportedMethods = {
    async getAllPosts(){
        const postCollection = await posts();
        const postlists= await postCollection.find({}).toArray();
        return  postlists
    },
    
    async getPostById(id) {
        if (!id){
            throw "Please provide an id to search for a Post";
        }
        console.log(id)
        const postCollection = await posts();
        const post = await postCollection.findOne({ _id: id });
        console.log()
        if (!post) throw "Post not found";
        return post;
    },

    async getPostByName(name) {
        if (!name){
            throw "Please provide a name to search for the Post";
        }
        console.log(name)
        const postCollection = await posts();
        const post = await postCollection.find({'author.name': name}).toArray();
        console.log(post)
        if (!post) throw "Post not found";
        return post;
    },


    async likePost(postid){
    
        const favoritePost = await this.getPostById(postid)
        const postCollection = await posts();
       
        const updatedPost = await postCollection.updateOne({_id:postid}, {$set: {isLiked:!favoritePost.isLiked}})
        
            if (updatedPost.modifiedCount === 0){
                throw "Something went wrong, Could not like the post";
        }
        else{
            console.log("The like is added to user account info")
        }
        console.log("At post part still",favoritePost.isLiked)
        return favoritePost

    },
    async createPost(title, content, author){
        const postCollection = await posts();
        const animalCollection = await animals();
        if (title==undefined||content==undefined||author==undefined){
            throw `Title, Content and Author fields are mandatory while creating a post.`
        }
        if (typeof(title)!='string'||typeof(title)!='string'){
            throw `Title, Content fields type should be a string`
        }
        if (typeof(author)!='object'){
            throw `Author field Should be an object having AuthorID and AuthorName .`
        }
        //Inserting the New Post  in Post DB
        let newPost={
            _id:uuid.v4(),
            title: title,
            content: content,
            isLiked: false,
            author:{
                _id:author.id,
                name:author.name
            }
        };
        const insertInfo = await postCollection.insertOne(newPost);
        const newId = insertInfo.insertedId;
        if (insertInfo.insertedCount === 0){
            throw "Could not add this post";
        }
        if (newId === null) throw "No Post available with that id" + newId ;

        // Updating Animal DB with the post the animal has created
        const updatedanimalInfo = await animalCollection.updateOne({_id: author.id}, {$push: {
            posts: {
                _id:newId,
                title:title
            }
        }});

        if (updatedanimalInfo.modifiedCount === 0){
            throw "Could not update this Post";
        }
        else{
           console.log("The Post is added to animal account info")
        }
        return await this.getPostById(newId);
    },

    // async updatePost(id, newTitle, newContent) {
    //     try{
    //         if (!id){
    //             throw "Please provide an id to update a Post";
    //         }
    //         if (!newTitle){
    //             throw "Please provide a new title for the post";
    //         }
    //         if (!newContent){
    //             throw "Please provide a new content for the post";
    //         }

    //         const postCollection = await posts();
    //         const animalCollection = await animals();
    //         let updatedPostData = {
    //             title:newTitle,
    //             content:newContent
    //         };
    //         //Updating the post in post DB
    //         const updatedPostInfo = await postCollection.updateOne({_id: id}, {$set: updatedPostData})
    //         if (updatedPostInfo.modifiedCount === 0){
    //             throw "Could not update this Post";
    //         }
    //         const updatedPost = await this.getPostById(id);
            
    //         // Updating the Post Info in Animals DB
    //         const myanimal = await animalCollection.findOne( { 'posts._id' : id  })
    //         for (const x in myanimal.posts){
    //             if (myanimal.posts[x]._id==id){
    //                 // newUpdatedAnimalPost={
    //                 //     title:newTitle
    //                 // }
    //                 // console.log(animalid)
    //                 // const post = await animalCollection.findOne({ 'posts._id' : id })
    //                 // console.log(post)
    //                 animalid = myanimal._id
    //                 updatedAnimalPostInfo = await animalCollection.updateOne({_id:animalid, 'posts._id' : id  }, {$set:{"posts.$.title":newTitle}});
    //                 }
    //             }

    //         if (updatedAnimalPostInfo.modifiedCount === 0){
    //             throw "Could not update this Post for animal";
    //         }
    //         return updatedPost;
    //     }
    //     catch(e){
    //         console.log(e)
    //     }
    // },
    // async deletePost(id){
    //     const postCollection = await posts();  
    //     const animalCollection = await animals();   
    //     const newretobj={};
    //     const mypost = await postCollection.findOne({_id:id});
    //     console.log(mypost)
    //     if (mypost === null){
    //         throw "No Post with that id found";
    //     } 
    //     else{
    //         newretobj['deleted']="true",
    //         newretobj['data']=mypost
    //         await postCollection.deleteOne({_id:id});
    //     }
    //     const myanimal = await animalCollection.findOne( { 'posts._id' : id  })
    //     console.log(myanimal)
    //     if (myanimal==null){
    //         throw `animal is not found with this post`
    //     } 
    //     else{
    //         for (const x in myanimal.posts){
    //             if (myanimal.posts[x]._id==id){
    //                 animalid = myanimal._id
    //                 updatedAnimalPostInfo = await animalCollection.updateOne({_id:animalid}, {$pull:{"posts":{_id:id}}});
    //                 }
    //             }
    //         }
    //     if (updatedAnimalPostInfo.modifiedCount === 0){
    //         throw "Could not update this post info for animal";
    //     }
    //     else{
    //        console.log("The Post is removed from animal account info")
    //     }

    //     // console.log(updatedAnimalPostInfo)

    //     return newretobj
    // }
}
module.exports=exportedMethods;
