const express=require("express");
const app=express();
const path=require("path");
const hbs=require("hbs");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
require("./db/conn");
const Register=require("./models/register");
const { urlencoded } = require("express");
const port=process.env.PORT || 3000;

const static_path=path.join(__dirname,"../public");
const views_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");

//console.log(path.join(__dirname,"../public"));
app.use(express.static(static_path));

//app.set('views', '../views');
app.set('views',views_path);
app.set("view engine","hbs");
hbs.registerPartials(partials_path);


app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/register",(req,res)=>{
    res.render("register")
})
app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/login",async (req,res)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;

    const userEmail=await Register.findOne({email:email});

    const isMatch=bcrypt.compare(password,userEmail.password);
       // console.log(`Entered password is ${password} and actual hashpassword is ${userEmail.password}`);

      const token=await userEmail.generateAuthToken();
       console.log("Token is "+token);
    if(isMatch){
        res.render("index");
    }else{
        res.send("Invalid Credentials");
    }
   /* if(password===userEmail.password){
        res.render("index");
    }else{
        res.send("Invalid Credentials");
    }*/
    // res.send(userEmail.password);
    // console.log(userEmail.password);
    }catch(e){
        res.status(400).send(e)
    }
    
})

app.post("/register",async (req,res)=>{
    try{
        
        const password=req.body.password;
        const rpassword=req.body.rpassword;
        console.log(password);
        console.log(rpassword);
        if(password===rpassword){
            const registerEmp=new Register({
                name:req.body.name,
                email:req.body.email,
                password:req.body.password,
                rpassword:req.body.rpassword
            })
            const token=await registerEmp.generateAuthToken();
            console.log("Token is "+token);
            const data=await registerEmp.save();
            res.status(201).send("You have successfully registered");
        }else{
            res.send("Passwords don't match");
        }
        res.send(password);

    }catch(e){
        res.status(400).send(e);
    }
})

const createToken=async()=>{
    const token=await jwt.sign({_id:"60ec795d87f099092d152b27"},"mynameischitranshnigamra1611003010932");
    console.log(token);
    const userVer=await jwt.verify(token,"mynameischitranshnigamra1611003010932");
    console.log(userVer);
}
//createToken();
app.listen(port,()=>{
    console.log(`connection sucessfull at port ${port}`);
})