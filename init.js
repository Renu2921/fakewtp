const mongoose = require('mongoose');
const Chat=require("./models/chat.js");


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');

};

main().then((result)=>{
    console.log("connection done");
}).catch((error)=>{
    console.log(error);
});

 let allChats=[{
    from:"neha",
    to:"priya",
    msg:"send me your notes",
    created_at:new Date()
},
{
    from:"priya",
    to:"neha",
    msg:"hii",
    created_at:new Date()
},
{
    from:"jack",
    to:"bob",
    msg:"what are you doing",
    created_at:new Date()
},
{
    from:"bob",
    to:"jack",
    msg:"i am doing my school work",
    created_at:new Date()
},
{
    from:"casey",
    to:"adam",
    msg:"lets go to play adam",
    created_at:new Date()
},
{
    from:"adam",
    to:"casey",
    msg:"okk lets go",
    created_at:new Date()
}];

Chat.insertMany(allChats);
