const express=require('express');
const path=require('path');

const app=express();

//Define protocolo HTTP
const server=require('http').createServer(app);
const io=require('socket.io')(server);//require no socket juntamente ao servidor criado

app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,'public'));//views irão ficar na pasta public
app.engine('html',require('ejs').renderFile)//define views como html
app.set('view engine','html');

//rota padrão do site redireciona a index.html
app.use('/',(req,res)=>{
    res.render('index.html');
});

let messages=[];

//toda vez que um usuário se conectar, o socket fara algo
io.on('connection',socket=>{
    console.log(`Socket conectado:${socket.id}`);
    socket.on('sendMessage',data=>{
        messages.push(data);//salva a mensagem dentro do array
        socket.broadcast.emit('receivedMessage',data);//envia para todos conectados no socket
    });
});

//cria servidor na porta 3000 
server.listen(3000);