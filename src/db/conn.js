const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/authenticatio_data",{

}).then(()=>{
    console.log("database connection successful...")
}).catch((e)=>{
    console.log(e);
})