const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const posts = require("./posts");
const uuid = require("node-uuid");
const bcrypt = require('bcrypt');

let exportedMethods = {
    async getAllusers() {
        const userCollection = await users();
        const userList = await userCollection.find({}).toArray();
        return userList;
    },

    async registerUser(username,password,firstname,lastname) {
        const userCollection = await users();
        // if (name==undefined||animalType==undefined){
        //     throw `Name and animal type field is mandatory while creating animal`
        // }
        // if (typeof(name)!='string'||typeof(animalType)!='string'){
        //     throw `Name and animal type should be a string`
        // }
        var BCRYPT_SALT_ROUNDS = 12
        let hashedPassword = await bcrypt.hash(password,BCRYPT_SALT_ROUNDS);
        console.log(hashedPassword)
        let newUser={
            _id:uuid.v4(),
            username: username,
            hashedPassword: hashedPassword,
            firstName: firstname,
            lastName: lastname,
            posts:[],
            followers:[],
            following:[],
            favoritePosts:[]
        };
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0){
             throw "Could not add this user";
        }
        const myUser = await userCollection.findOne({ username: username });
        if (myUser === null) throw "No User found with that username";
        return myUser;
    },

    async authenticate (username,password){
        // console.log("reached in authenticate" )
        // console.log(`username is ${username}`)
        // console.log(`username is ${password}`)
        let users = await this.getAllusers()
        // console.log(users)
        let myuser ={}
        for (i=0;i<users.length;i++){
            if (users[i].username==username && await bcrypt.compare(password,users[i].hashedPassword)){
                
                myuser={
                    id: users[i]['_id'],
                    name: users[i]['firstName'] +" "+ users[i]['lastName'],
                    message:"Logged In Successfully"
                }
            }
        }
        // console.log(myuser)
        return myuser;
    },
    async getUserById(id) {
        const userCollection = await users();
        const myuser = await userCollection.findOne({_id: id});

        if (myuser === null){
            throw "user not found with the given id: " + id;
        }
        return myuser;
    },

    async likePost(userid, postid){
        // if (userid==undefined||postid==undefined){
        //     throw `Please Sign In to Like the Post`
        // }
        const favoritePost = await posts.getPostById(postid)
        const userCollection = await users();
        // const myuser = await userCollection.findOne({_id:userid})
        // console.log('My user is \n')
        // console.log(myuser)
        let updatedUserInfo ;
        if(favoritePost.isLiked) {
            updatedUserInfo = await userCollection.updateOne({_id:userid}, {$push: {favoritePosts:favoritePost}})
         
        } else {
            updatedUserInfo = await userCollection.updateOne({_id:userid}, {$pull: {favoritePosts: {_id: favoritePost._id}}})
        }
        // const updatedUserInfo = await userCollection.updateOne({_id:userid}, {$push: {favoritePosts:favoritePost}})
        
        //     if (updatedUserInfo.modifiedCount === 0 ||1){
        //         throw "Something went wrong, Could not like the post";
        //     }
        // else{
        //     console.log("The like is added to user account info")
        // }
        return favoritePost

    },

    // async updateAnimal(id, newName, newAnimalType) {
    //     if (!id){
    //         throw "Please provide an id to update an animal";
    //     }
    //     if (!newName){
    //         throw "Please provide a new name to update an animal";
    //     }
    //     if (!newAnimalType){
    //         throw "Please provide a new animal type to update an animal";
    //     }

    //     const animalCollection = await animals();
    //     let updatedAnimalData = {
    //         name:newName,
    //         animalType:newAnimalType
    //     };
    //     const updatedAnimalInfo = await animalCollection.updateOne({_id: id}, {$set: updatedAnimalData})
    //     if (updatedAnimalInfo.modifiedCount === 0){
    //          throw "Could not update this animal";
    //     }
    //     const updatedAnimal = await this.getAnimalById(id);
    //     return updatedAnimal;
    // },
    // async deleteAnimal(id){
    //     const animalCollection = await animals();     
    //     const newretobj={};
    //     const myanimal = await animalCollection.findOne({_id:id});
    //     // myanimal = await animalCollection.remove({_id:object_id});
    //     if (myanimal === null){
    //         throw "No animal with that id";
    //     } 
    //     else{
    //         newretobj['deleted']="true",
    //         newretobj['data']=myanimal
    //         await animalCollection.deleteOne({_id:id});
    //     }
    //     return newretobj
    // },
}
module.exports = exportedMethods;