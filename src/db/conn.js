const mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/registrationform",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
}).then(()=>{
    console.log("connection sucessfull");
}).catch((e)=>{
    console.log("Connection Failed");
});