const express = require("express");
const multer = require("multer");
const fs = require("fs");

const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const app = express();

const upload = multer({dest:'uploads/'});

app.post('/upload',upload.single('file'),(req, res)=>{
    //if file is available in req.file
    const file = req.file;
    //move the file to a permanenet location 
    fs.rename(file.path, 'storage/' + file.originalname, (err)=>{
        if(err){
            return res.status(500).send(err);
        }
        res.json({
            message:'File uploaded successfully',
            file:file.originalname
        })
    })
});
app.get('/media',(req,res)=>{
    
    const filePath = 'C:/Users/User/source/repos/mediaserver/earth.mp4';
    const stat = fs.statSync(filePath);
    res.set('Content-Type','video/mp4');
    res.set('Content-Length',stat.size);
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);

})
app.get("/media/:filename", (req,res)=>{
    //get file from permanent storage
    const file = 'storage/' + req.params.filename;
    fs. readFile(file,(err, data)=>{
        if(err){
            return res.status(404).send(err);
        }
        res.contentType('video/mp4');
        res.send(data);
    })
});

app.listen(3000,()=>{
    console.log("Media Server API started at  3000");
})