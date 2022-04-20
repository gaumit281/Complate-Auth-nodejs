const jwt = require("jsonwebtoken");
const authRegister = require("../modals/registers");

const auth = async (req,res,next) => {
    try{
           const token = req.cookies.jwt;
           const verifyUser = jwt.verify(token,process.env.SECRET_KEY);
           //    console.log(verifyUser);
           const user = await authRegister.findOne({_id:verifyUser._id})
        //    console.log(user);

        req.token = token;
        req.user = user;

       
         next();

    }catch(e){
        //    res.status(401).send(`erroe is:- ${e}`);
        res.status(401).render("login");
    }
}

module.exports = auth;