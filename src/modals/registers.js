const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    address:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmpassword:{
        type:String,
        required:true,
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
})


// Generate Token
authSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token:token})
        await this.save();
        return token;

      }catch(error){
        res.send("error part");
    }
  }

//password Hashing
authSchema.pre("save",async function (next) {

    if(this.isModified("password")){

       this.password = await bcrypt.hash(this.password,10);
       this.confirmpassword = await bcrypt.hash(this.confirmpassword,10);
       // this.confirmpassword = undefined;
    }
   
    next();
})


// create a collection
const authRegister = new mongoose.model("authRegister",authSchema)
module.exports = authRegister;













