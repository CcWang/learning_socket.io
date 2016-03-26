var express = require('express');
var path = require('path');
var app = express();

app.set('views', path.join(__dirname,'./views'));
app.set('view engine', 'ejs')

app.get('/', function(req,res){
	res.render('index');
})

var server = app.listen(8888,function () {
	// body...
	console.log('is listening 8888');
})

var io = require('socket.io').listen(server);
var all_user = [];
var all_messages = [];
io.sockets.on('connection', function(socket){
	socket.on('got_a_new_user', function(data){
		var user = {};
		user[socket.id] = data.user;
		all_user.push(user);
		console.log(all_user);
		socket.emit('all_user', {user:all_user});
		socket.broadcast.emit('new_user',{user: [user]});
		socket.emit('all_messages',{messages: all_messages })
	});

	socket.on('get_a_message', function(data){
		console.log(data);
		var message = {};
		message[data.name]=data.message;
		all_messages.push(message);
		io.emit('a_new_message',{message:message});
	})

	socket.on('disconnect',function(){
		var i = all_user.indexOf(socket.id);
		all_user.splice(i,1);
		io.emit('exit_user', {exit:socket.id});
	})
})
