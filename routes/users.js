const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users

const loginSuccess = async (req,res, next)=>{
  const{username,password} = req.body;
  const user = await userData.authenticate(username,password)
  console.log("reached login success again after authentcating")
  console.log(user)
  //console.log(Object.keys(user).length)
  try{
      if (Object.keys(user).length>0){
          var hour = 3600000
          req.session.name='AuthCookie'
          req.session.user = user
          req.session.cookie.expires = new Date(Date.now() + hour)
          req.session.cookie.maxAge = hour
      }
      else{
          res.error = 'Invalid username or password';
      }

  }catch(e){
      next(e);
  }
  next();
};

router.get('/', (req, res)=>{
    
  if (req.session.name=='AuthCookie') {
      res.redirect('/private');
  }
  else{
      res.render('login',{ title: 'Welcome To User Login Page Of Blog Website', error: req.query.error ? req.query.error : null });
  }
});

router.post('/private',loginSuccess, (req,res)=>{
  if (req.session.name=='AuthCookie') {
      //res.sendStatus(200)
      res.redirect('/private');
  } else {
      res.redirect('/?error=' + encodeURIComponent(res.error));
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(function(err){
      if(err){
          res.negotiate(err);
      }else{
          res.redirect('/')
      }
  });  
});

router.get('/private', (req, res) => {
  if (req.session.name=='AuthCookie') {
      const user = req.session.user;
      const title = 'Welcome ' + user.name;
      res.render('private', { title: title, user: user });
  } else {
      res.status(403);
      url = req.url;
      res.render('error', { title: '403', url: url });
  }
});

router.use('*', (req, res) => {
  res.redirect('/');
});
//The Below Route i will use for sign up user. Right now used this API to create user through postman

router.post("/", async (req, res) => {
  const userInfo = req.body;  
  if (!userInfo) {
    res.status(400).json({ error: "You must fill required fields to create a User" });
    return;
  }

  if (!userInfo.username) {
    res.status(400).json({ error: "You must provide a username" });
    return;
  }

  if (!userInfo.password) {
    res.status(400).json({ error: "You must provide a password" });
    return;
  }
  if (!userInfo.firstname) {
    res.status(400).json({ error: "You must provide a Firstname" });
    return;
  }
  if (!userInfo.lastname) {
    res.status(400).json({ error: "You must provide a Lastname" });
    return;
  }

  try {
    const newUser = await userData.registerUser(
      userInfo.username,
      userInfo.password,
      userInfo.firstname,
      userInfo.lastname
    );
    res.json(newUser);
  } catch (e) {
    res.sendStatus(500).json({ error: e });
  }
});


//--------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------
// router.get("/", async (req, res) => {
//     try {
//       const userList = await userData.getAllusers()
//       res.json(userList);
//     } catch (e) {
//       res.sendStatus(500);
//     }
//   });



//   router.get("/:id", async (req, res) => {
//     try {
//       const animal = await animalData.getAnimalById(req.params.id);
//       res.json(animal);
//     } catch (e) {
//       res.status(404).json({ error: e });
//     }
//   });


// router.put("/:id", async (req, res) => {
//   const animalInfo = req.body;
//   console.log(animalInfo)

//   if (!animalInfo) {
//     res.status(400).json({ error: "You must provide id data to update the animal" });
//     return;
//   }

//   if (!animalInfo.name) {
//     res.status(400).json({ error: "You must provide a name" });
//     return;
//   }

//   if (!animalInfo.animalType) {
//     res.status(400).json({ error: "You must provide an animalType" });
//     return;
//   }

//   try {
//       await animalData.getAnimalById(req.params.id);
//   } catch (e) {
//     res.status(404).json({ error: "Animal is not found" });
//     return;
//   }

//   try {
//     const updatedAnimal = await animalData.updateAnimal(req.params.id, animalInfo.name,animalInfo.animalType);
//     res.sendStatus(200)
//     res.json(updatedAnimal);
//   } catch (e) {
//     res.sendStatus(500);
//   }
// });

// router.delete("/:id", async (req, res) => {
//   try {
//       await animalData.getAnimalById(req.params.id);
//   } catch (e) {
//     res.status(404).json({ error: "Animal is not found" });
//     return;
//   }

//   try {
//     await animalData.deleteAnimal(req.params.id);
//     res.sendStatus(200);
//   } catch (e) {
//     res.sendStatus(500);
//     return;
//   }
// });
  
module.exports = router;
  