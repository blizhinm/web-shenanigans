var express = require('express');
var app = express();
var socket = require('socket.io');
var server = app.listen(3000,'0.0.0.0',function(){
	console.log('Server is running');
});
var io = socket(server);

app.use(express.static('public'));

var width,height;
var players = [],bullets = [];



io.sockets.on('connection',function(socket){
	console.log('New player: '+socket.id);
	socket.on('start',function(data){
		var player = new Player(socket.id,data.nickname,data.pos.x,data.pos.y);
		players.push(player);
		socket.emit('new player id', socket.id);
	});
	socket.on('players update',function(data){
		for(var i = 0; i < players.length; i++){
			if(players[i].id === data.id){
				players[i].pos = data.pos;
				players[i].velx = data.velx;
				players[i].vely = data.vely;
				players[i].mousePos = data.mousePos;
				players[i].sprite = data.sprite;
			}
		}
		io.sockets.emit('players info',players);
	});
	socket.on('new bullet',function(data){
		bullets.push(data);
		io.sockets.emit('new bullet');
	});
	socket.on('disconnect', function(){
		var nickname = '';
		for(var i = 0; i < players.length; i++){
			if(players[i].id === socket.id){
				nickname = players[i].nickname;
				players.splice(i,1);
			}
		}
		console.log('Player disconnected: '+nickname+' - '+socket.id);
	});
});

setInterval(function(){
	for(var i = 0; i < bullets.length; i++){
		bullets[i].pos.x += bullets[i].dir.x;
		bullets[i].pos.y += bullets[i].dir.y;
		bullets[i].time++;
		if(bullets[i].pos.x > 1500 || bullets[i].pos.x < -100 || bullets[i].pos.y > 1000 || bullets[i].pos.y < -100){
			bullets.splice(i,1);
		}
	}
	io.sockets.emit('bullets info',bullets);
},33);


function Player(id,nickname,x,y){
	this.id = id;
	this.nickname = nickname;
	this.pos = {};
	this.pos.x = x;
	this.pos.y = y;
	this.velx = 0;
	this.vely = 0;
	this.width = 45;
	this.height = 36;
	this.mousePos = {x:0,y:0};
	this.sprite = {frameWidth: 0,frameHeight: 0,frameMod: 0,frameMod_counter: 0};
	
}

// function Bullet(x,y,dir){
// 	this.pos = {};
// 	this.pos.x = x;
// 	this.pos.y = y;
// 	this.dir = dir;
// 	this.size = 2;
// }