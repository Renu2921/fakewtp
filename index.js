const express=require("express");
const app=express();
const path=require("path");
const Chat=require("./models/chat.js");
const methodOverride=require("method-override");
const ExpressError=require("./ExpressError.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
//to parse the data coming from the post request
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"));


const port=8080;
app.listen(port,()=>{
    console.log("server is listening :8080");
});

app.get("/",(req,res)=>{
    res.send("succesfully connected");
})

const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');

};

main().then((result)=>{
    console.log("connection done");
}).catch((error)=>{
    console.log(error);
});



//index route all chats shown
app.get("/chats", async(req,res)=>{
    try{
    // res.send("chats will shown")
    let chats= await Chat.find();
    // res.send(chats);
    res.render("index.ejs",{chats})
    }catch(err){
    next(err);    
}
});

// to add new chat--> button send a get request to the chats/new which render a form after submit, a post request to /chats
app.get("/chats/new",(req,res)=>{
    // res.send("accept the request")
    // throw new ExpressError(404,"PAGE NOT FOUND!");
    res.render("form.ejs");
});

// ************create route
app.post("/chats",async(req,res,next)=>{
    try{
  let {from ,msg,to}=req.body;
  let newChat=new Chat({
    from:from,
    msg:msg,
    to:to,
    created_at:new Date()
  });
//   console.log(newChat);
 await newChat.save()

    //   res.send("working")
res.redirect("/chats");
    }catch(err){
        next(err);
    }
}
);
// ###############async wrap function
function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch(err => next(err));
        
    }
}

// show route
app.get("/chats/:id", asyncWrap(async(req,res,next)=>{ 
    // try{  //it is also done bt try catch
    let{id}=req.params;
   let chat= await Chat.findById(id);
   if(!chat){
    next( new ExpressError(404,"CHAT NOT FOUND!")); 

}
    res.render("edit.ejs",{chat})
// }catch(err){
//     next(err);
// }
}));


//edit/pdate route-->
app.get("/chats/:id/edit",async(req,res)=>{
    try{
    let{id}=req.params;
   let chat= await Chat.findById(id);
    res.render("edit.ejs",{chat})
    }catch(err){
        next(err);
    }
});

app.put("/chats/:id", async(req,res)=>{
    try{
    let {id}=req.params
    let {msg:newMsg}=req.body;
    let updateChat=await Chat.findByIdAndUpdate(
        id,{msg:newMsg},
        {runValidators:true,new:true}
    );
    console.log(updateChat);
    res.redirect("/chats");
    }
    catch(err){
        next(err);
    }
});


// delete route

app.delete("/chats/:id",async(req,res)=>{
    try{
    let {id}=req.params;
    let deletedChat=await Chat.findByIdAndDelete(id);
     console.log(deletedChat);
     res.redirect("/chats");
    }catch(err){
        next(err);
    }
});


const handleValidationErr=(err)=>{
    console.log("this was a validation error, Please follow rules");
console.dir(err.message);
return err;

}

// another middleware
app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name==="ValidationError"){
// console.log("this was a validation error. Please follow  rules")
 err=handleValidationErr(err);
    }
    next(err);
})


// error handling middleware
app.use((err,req,res,next)=>{
   let{status=500,message="SOME ERROR OCCURES"}=err;
   res.status(status).send(message);
})

