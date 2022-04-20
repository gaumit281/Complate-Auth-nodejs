require('dotenv').config();
const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const path = require("path");
const hbs = require("hbs");
const bcrypt = require("bcryptjs");
const cookieParser = require('cookie-parser');
const auth = require("./middleware/auth");

require("./db/conn");
const authRegister = require("./modals/registers")

//static path
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));

//template path
app.set("view engine", "hbs");

const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");


app.set("views", template_path);
hbs.registerPartials(partials_path);


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))


//routing

app.get("/", (req, res) => { 
    res.render("index")
})

app.get("/about", (req, res) => {
    res.render("about")
})

app.get("/services", auth ,(req, res) => {
    res.render("services")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})


app.get("/logout", auth, async (req,res) => {
    try{
    
        
        // Single LogOut

        // req.user.tokens = req.user.tokens.filter((curElem) => {
        //     return curElem.token !== req.token
        // })

        // LogOut All USer

        req.user.tokens = [];

        res.clearCookie("jwt");
       
        await req.user.save();
        res.render("login");

    }catch(error){
        res.status(500).send(error)
    }

})

//login
app.post("/login", async(req,res) => {
    try{
        const email = req.body.email;
        const password = req.body.password;

        const userEmail = await authRegister.findOne({email:email});
        
        const isMatch = await bcrypt.compare(password,userEmail.password);

        const token = await userEmail.generateAuthToken();
        // console.log(token);
        
        // console.log(userEmail)
      
       
        if(isMatch){

            res.cookie("jwt",token, {
                expires:new Date(Date.now() + 600000),
                httpOnly:true,
                // secure:true
           });
            
            res.status(201).render("index",{
                login: true,
                username:userEmail.name
                
            });
            
        }else{
            res.render("login",{
                error: "Invalid Login Details"
            });
        }

    }catch(e){
        res.status(400).render("login",{
            error: "Invalid Login Details",
        });   
    }
   
})

//registration
app.post("/signup", async (req, res) => {

    try {
        //password ans confirm password same or not
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const registerUser = new authRegister({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                address: req.body.address,
                password: password,
                confirmpassword: cpassword
            })

            const token = await registerUser.generateAuthToken();
            // console.log(token);

            res.cookie("jwt",token, {
                expires:new Date(Date.now() + 600000),
                httpOnly:true
            });

            const registered = await registerUser.save();
            res.status(201).render("index");

        } else {
            res.render("signup",{
                signuperror: "Password are not Matching"
            })
        }
    } catch (e) {
          
           res.status(400).render("signup",{
             signuperror: "You have already registered"
           });
    }
})

app.listen(port, () => {
    console.log(`server is running at ${port}`)
})