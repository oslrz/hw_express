const express = require("express");
const body_parser = require("body-parser")
const fs = require("fs");
const e = require("express");
const app = express();
const jsonParser = express.json();


app.get("/",(request, response)=>{
    response.send("Все працює!!!");
});

app.get("/getAll",(req,res)=>{  // no params
    let authorsName = [];
    fs.readFile("./data.json","utf-8",(error,data)=>{
        if(error) throw error;
        data = JSON.parse(data)
        for(let elem of data){
            authorsName.push(elem.name)
        }
        res.send(authorsName)
    })
})

app.post('/addAuthor',jsonParser,(req,res)=>{   // params: name, id int(5)
    const name = req.body.name;
    const id = req.body.id;
    fs.readFile("./data.json","utf-8",(error,data)=>{
        if(error) throw error;
        data = JSON.parse(data);
        for(let elem of data){
            if(elem.id === id){
                res.send("ID "+id+" вже існує")
            }
        }
        let newAuthor = {
            "name":name,
            "id":id,
            "posts":[]
        }
        data[data.length] = newAuthor;
        fs.writeFile("./data.json",JSON.stringify(data),()=>{
            res.send("New author with name-"+name+" and id-"+id+" was created")
        })
        
    })
})

app.post('/remove',jsonParser,(req,res)=>{   // params: name
    const name = req.body.name;
    fs.readFile("./data.json","utf-8",(error,data)=>{
        if(error) throw error;
        let NewData = []
        data = JSON.parse(data);
        for(let i=0;i<data.length;i++){
            if(data[i].name !== name){
                NewData.push(data[i])
            }
        }
        fs.writeFile("./data.json",JSON.stringify(NewData),()=>{
            res.send("Author "+name+" was deleted")
        })
    })
})

app.post('/getPosts',jsonParser,(req,res)=>{  // params: name
    const name = req.body.name;
    fs.readFile("./data.json","utf-8",(error,data)=>{
        if(error) throw error;
        let Posts = []
        data = JSON.parse(data);
        for(let i=0;i<data.length;i++){
            if(data[i].name == name){
                for(let j = i;j<data[i].posts.length;j++){
                    Posts.push(data[i].posts[j].text)
                }
            }
        }
        res.send(Posts)
    })
})

app.post('/getPost',jsonParser,(req,res)=>{   // params: name,id
    const name =req.body.name;
    const post_id = req.body.id;
    fs.readFile("./data.json","utf-8",(error,data)=>{
        if(error) throw error;
        data = JSON.parse(data);
        for(let elem of data){
            if(elem.name == name){
                for(let post of elem.posts){
                    if(post.id == post_id){
                        res.send(post.text)
                    }
                }
            }
        }
    })
})




app.post('/rename',jsonParser,(req,res)=>{  // params: oldName, newName
    const oldName = req.body.oldName;
    const newName = req.body.newName;
    fs.readFile("./data.json","utf-8",(error,data)=>{
        if(error) throw error;
        data = JSON.parse(data);
        for(let elem of data){
            if(elem.name === oldName){
                elem.name = newName;
            }
        }
        fs.writeFile("./data.json",JSON.stringify(data),()=>{
            res.send("Author "+oldName+" was renamed to "+newName)
        })
    })
})

app.listen(3000);