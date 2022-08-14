var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').Server(app);
var ioSocket = require('socket.io')(http);
var mangosta = require('mongoose');
var port = process.env.PORT || 5000;

app.use(express.static(__dirname))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var dbUrl = "mongodb+srv://herwing0:notverysafe@chatproyectmongo.v4q4ckj.mongodb.net/?retryWrites=true&w=majority";
var Message = mangosta.model('Message', {
    mensaje : String,
    name : String
})

app.get('/mensajes', (req, res) => {
    Message.find({}, (err, messages) => {
        res.send(messages)
    })
})

ioSocket.on('connection', (socket) => {
    console.log('Nueva conexion')
})

app.post('/mensajes', (req, res) => {
    var message = new Message(req.body);
    message.save((err) =>{
        if(err){
            console.log(err)
        } else {
            ioSocket.emit('mensajes', req.body)
            res.sendStatus(200)
        }
    })
} )

 mangosta.connect(dbUrl, (err)=> {
      console.log("coneccted db")
  })

var server = http.listen((port), function(){
    console.log('listening on %d');
  });


