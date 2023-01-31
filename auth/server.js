const express = require("express");

const app= express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.post("/auth",(req, res)=>{
    console.log(req.body);
    const streamKey = req.body.key;
    if(streamKey==="supersecrete"){
        res.status(200).send();
        return;
    }
    res.status(403).send();
});

app.listen(8000,function(){
    console.log("Listening on port 8000");
});