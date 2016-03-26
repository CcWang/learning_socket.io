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
io.sockets.on('connection', function(socket){
	socket.on('got_a_new_user', function(data){
		var user = {};
		user[socket.id] = data.user;
		// var user_id = socket.id;
		// console.log(user_id)
		all_user.push(user);
		console.log(all_user);
		socket.emit('all_user', {user:all_user})
		socket.broadcast.emit('new_user',{user: [user]});
	})
	socket.on('disconnect',function(){
		var i = all_user.indexOf(socket.id);
		all_user.splice(i,1);
		io.emit('exit_user', {exit:socket.id});
	})
	// socket.on('connected', function(socket) {
	// 	console.log('got message');
	// 	console.log('all user', all_user);
	// 	io.emit('all_user', {user:all_user})
	// })
})
