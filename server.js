


const http=require("http");


const express=  require("express")

const port=80;
const app = express()

const server=http.createServer(app)

server.listen(port)



const { Server } = require("socket.io");
const io = new Server(server);








app.use(express.static("public"))

app.set("view engine","ejs")


app.get("/",function(req,res){


    res.render("index")
})


app.get("/contact",function(req,res){


    res.render("contact")
})


app.get("/price",function(req,res){


    res.render("price")
})


app.get("/us",function(req,res){


    res.render("us")
})




io.on("connection",function(socket){


     socket.on("user",function(data){

      users[data.name]= data.id

      console.log(users)

        if(data.name != "Admin"){

          io.to(users["Admin"]).emit("user",data.name)

        }
    })


   socket.on("msg",function(data){

        console.log(data.user)
        console.log(data.rec)

        console.log(users[data.user])
        console.log(users[data.rec])







          io.to([users[data.rec],users[data.user]]).emit("msg",{id:users[data.user], name:data.user,rec:data.rec, msg:data.msg})









   })




  })


