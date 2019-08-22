const data = require("../data");
const postData = data.posts;
const userData = data.users;

const loginSuccess = async (req,res, next)=>{
    const{email,password} = req.body;
    console.log(email)
    console.log(password)
    const user = await userData.authenticate(email,password)
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

const constructorMethod = app =>{

    app.get('/', async (req, res)=>{
         if (req.session.name=='AuthCookie') {
            isUserLoggedIn = true
            var postsList = await postData.getAllPosts();
            postsList.forEach(element => {
                element['img']= 'public/img/appstore-new.png'
            }); 
            // console.log(req.session.user)
            res.render('home', 
            {posts : postsList, isUserLoggedIn : isUserLoggedIn, user: req.session.user});
            
        }
        else{
            var postsList = await postData.getAllPosts();
            postsList.forEach(element => {
                element['img']= 'public/img/appstore-new.png';
                element.isLiked = false;
            });
            res.render('home',{
                posts : postsList,
                error: req.query.error ? req.query.error : null
            });
            //res.render('login',{ title: 'welcome To User Login Page', error: req.query.error ? req.query.error : null });
        }
    });
    
    // app.get('/', async (req, res)=>{
    //     if (req.session.name=='AuthCookie') {
    //         var postsList = await postData.getAllPosts()
    //         res.render('home',{
    //             posts : postsList
    //         });
    //     }
    //     else{
    //         res.render('login',{ title: 'welcome To User Login Page', error: req.query.error ? req.query.error : null });
    //     }
    // });

    // app.post('/', async (req,res)=>{
    //     if(req.getElementById('signUpBox')){
    //         const {username,password,firstName,lastName} =req.body;
    //         const adduser = await userData.registerUser(username,password,firstName,lastName)

    //         if (adduser!==null){
    //             res.render('home')
    //         } else {
    //             res.redirect('/?error=' + encodeURIComponent(res.error));
    //         }
    //     }
    //     else if (document.getElementById('loginBox')){
    //         loginSuccess()
    //         if (loginSuccess){
    //             isUserLoggedIn = true
    //             res.render('private', {isUserLoggedIn : isUserLoggedIn});
    //         }
    //     }
    //     else{
    //         res.status(403);
    //         url = req.url;
    //         res.render('error', { title: '403', url: url });
    //     }

    // });

    app.post('/private',loginSuccess, (req,res)=>{
        if (req.session.name=='AuthCookie') {
            isUserLoggedIn = true
            res.render('private', {isUserLoggedIn : isUserLoggedIn, user: req.session.user});
        }
        else {
            // res.status(403);
            // url = req.url;
            res.redirect('/?error=' + encodeURIComponent(res.error));
    
            //res.redirect('/error=' + encodeURIComponent(res.error));
        }
    });

    app.post('/registered', async (req,res)=>{
        const {username,password,firstName,lastName} =req.body;
        const adduser = await userData.registerUser(username,password,firstName,lastName)

        if (adduser!==null){
            res.render('register')
        } else {
            res.redirect('/?error=' + encodeURIComponent(res.error));
        }
    });

    app.get('/like/:id', async(req,res)=>{
        try{
            if (req.session.user===undefined){
                throw `Please Sign In to Like the Post`
            }
            const postId =req.params.id
            const setLike = await postData.likePost(postId);
            const addLike = await userData.likePost(req.session.user.id,postId);
        }
        catch(e){
            console.log(e)
            res.status(403).json({error:e});
        }
    });
    
    app.get('/myFav', async(req, res)=>{
        const user = await userData.getUserById(req.session.user.id) 
        console.log('reached my Fav')
        console.log(user.favoritePosts)
        if (user.favoritePosts!==null){
            res.render('home',{
                posts:user.favoritePosts,
                isUserLoggedIn:isUserLoggedIn,
                //user:user.favoritePosts.author.name
            });
        }
        else{
            res.render('home',{
                posts:"There are no favorite posts available",
                isUserLoggedIn:isUserLoggedIn,
            });
        
        }

    });


    app.get('/logout', (req, res) => {
        req.session.destroy(function(err){
            if(err){
                res.negotiate(err);
            }else{
                res.redirect('/')
            }
        });  
    });

    app.get('/private', (req, res) => {
        if (req.session.name=='AuthCookie') {
            isUserLoggedIn = true
            const user = req.session.user;
            const title = 'Welcome ' + user.name;
            res.render('private', { title: title, user: user, isUserLoggedIn:isUserLoggedIn });
        } else {
            res.status(403);
            url = req.url;
            res.render('error', { title: '403', url: url });
        }
    });
    app.post("/addpost", async (req, res) => {
        const postInfo = req.body;
        postInfo.author= {id: req.session.user.id, name:req.session.user.name}
            
        console.log(postInfo)
      
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
    
    app.get ('/myPosts', async(req, res)=>{
        // const user = await userData.getUserById(req.session.user.id)
        const postsList = await postData.getPostByName(req.session.user.name)
        postsList.forEach(element => {
            element['img']= 'public/img/appstore-new.png'
        });
        console.log(postsList)
        if (postsList!==null){
            res.render('home',{
                posts:postsList,
                isUserLoggedIn:isUserLoggedIn,
                user:req.session.user

            });
        }
    });
    
    

    app.use('*', (req, res) => {
        res.redirect('/');
    });
}
module.exports = constructorMethod;
  