const express = require("express");
const path = require('path');
const fs = require('fs');
const io = require('socket.io')(8000)
let port=process.env.PORT ||80;

const app = express();

app.use('/static', express.static('static'));

//setting pug as template engine 
app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'));

const users = {};

io.on('connection', (socket) => {
   socket.on('new-user-joined', (name) => {
      //console.log(name);
      users[socket.id] = name;
      socket.broadcast.emit('user-joined', name);
   });

   socket.on('send', (message) => {
      socket.broadcast.emit('recive', { message: message, name: users[socket.id] });
   });

   socket.on('disconnect', (message) => {
      socket.broadcast.emit('left', users[socket.id]);
      delete users[socket.id];
   });
}); 


app.get('/',(req,res)=>{
    res.status(200).render('home');
});

app.listen(port, () => {
    console.log(port);
});
