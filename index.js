const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const userModel = require("./models/user");
const path = require('path');
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

 
app.get('/', (req, res) => {
  res.render('index');
}   );  
app.post('/create',  (req, res) => {
  const { username, email, password, age } = req.body;
bycrypt.genSalt(10, async (err, salt) => {
    bycrypt.hash(password,salt, async (err, hash) => {
        let createdUser =await userModel.create({ username, email, password:hash, age });
       let token= jwt.sign({email},"ssfssss");
       res.cookie("token", token);

  res.send(createdUser);
       
    });});

    app.get("/login", (req, res) => {
           res.render('login');
        });  

        app.post("/login", async (req, res) => {
            let user= await userModel.findOne({ email: req.body.email });
            if (!user) {
                return res.send('User not found');
            }
            
            bycrypt.compare(req.body.password, user.password, (err, result) => {
                if(result)
                {
                let token = jwt.sign({ email: user.email }, "ssfssss");
                res.cookie("token", token);
                }
              else
                res.send("no you can not login"); 
            });
            });

        
        
    app.get('/logout', (req, res) => {
        res.clearCookie('token');
        res.redirect('/');
        });


});
  //let createdUser =await userModel.create({ username, email, password, age });
  //res.send(createdUser);


app.listen(3000);


