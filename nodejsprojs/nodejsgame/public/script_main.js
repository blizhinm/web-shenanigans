var socket;
var canvas,ctx,width,height;
var directions = {left:false,up:false,right:false,down:false};
var players = [],player1,bullets = [];
var player_speed = 5, bullet_speed = 10,bullet_cooldown = 0;
var mouseDown = false;
var sprites = {map: new Image(),player: new Image(),fireball: new Image()};
var sound_main_theme,sound_step = {},sound_fireball;
var shootAngle;
var map_cropX,map_cropY;

$(document).ready(function(){
	socket = io.connect('http://192.168.1.53:3000');// current network IP
	// socket = io.connect('http://localhost:1000');
	width = window.innerWidth;
	height = window.innerHeight;
	sound_main_theme = new Audio('sounds/multgamemaintheme.wav');
	sound_step.step1 = new Audio('sounds/stepL.mp3');
	sound_step.step2 = new Audio('sounds/step2L.mp3');
	sound_step.step1.volume = 0.5;
	sound_step.step2.volume = 0.5;
	sound_fireball = new Audio('sounds/fireball.wav');
	sound_fireball.volume = 0.15;
	sound_main_theme.addEventListener('ended', function() {
	    this.play();
	});
	map_cropX = sprites.map.width/2;
	map_cropY = sprites.map.height/2;
	sound_main_theme.play();
	sprites.map.src = 'sprites/map.png';
	sprites.player.src = 'sprites/player_sprite_45x36.png';
	sprites.fireball.src = 'sprites/fireball.png';
	$('#username-form').css('left',width/2-$('#username-form').css('width').slice(0,$('#username-form').css('width').length-2)/2);
	$('#username-form').css('display','block');
	canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;
	var WH = {width:width,height:height};
	socket.emit('width and height',WH);
	$('#canvas').append(canvas);
	ctx = canvas.getContext('2d');
	ctx.font = '15px sans-serif';
	ctx.drawImage(sprites.map,map_cropX,map_cropY,width,height,0,0,width,height);
	// ctx.fillStyle = 'black';
	// ctx.fillRect(0,0,width,height);

	$('#username-form').submit(function(e){
		e.preventDefault();
		player1 = new Player(0,width/2,height/2);
		if($('#username').val().match(/[a-zа-я]/i)){
			player1.nickname = $('#username').val();
			$(this).css('display','none');
			start();
		}
	});

	$('#sounds').click(function(e){
		if(sound_main_theme.paused == false){
			$("#icon_play").hide();
			$("#icon_mute").show();
			sound_main_theme.pause();
		}else {
			$("#icon_play").show();
			$("#icon_mute").hide();
			sound_main_theme.play();
		}
	});
	
	function start(){
		socket.emit('start',player1);
		socket.on('new player id',function(data){
			player1.id = data;
		});
		socket.on('players info', function(data){
			players = data;
		});
		socket.on('bullets info',function(data){
			bullets = data;
		});
		socket.on('new bullet',function(){
			sound_fireball = new Audio('sounds/fireball.wav');
			sound_fireball.volume = 0.15;
			sound_fireball.play();
		});

		setInterval(function(){
			bullet_cooldown--;
			ctx.drawImage(sprites.map,0,0,width,height,0,0,width,height);
			// ctx.strokeStyle = 'green';
			for(var i = 0; i < players.length; i++){
				if(players[i].id !== player1.id){
					ctx.fillStyle = 'green';
					// ctx.fillRect(players[i].pos.x,players[i].pos.y,20,20);
					ctx.drawImage(sprites.player,players[i].sprite.frameWidth*(sprites.player.width/3),players[i].sprite.frameHeight*(sprites.player.height/4),sprites.player.width/3,sprites.player.height/4,players[i].pos.x,players[i].pos.y,players[i].width,players[i].height);
					ctx.fillStyle = 'white';
					ctx.fillText(players[i].nickname,(players[i].pos.x+players[i].width/2)-(players[i].nickname.length*(15/players[i].nickname.length)),players[i].pos.y-5);
					players[i].pos.x += players[i].velx;
					players[i].pos.y += players[i].vely;

					var diffX = players[i].pos.x+players[i].width/2-players[i].mousePos.x;
					var diffY = players[i].pos.y+players[i].height/2-players[i].mousePos.y;
					var other_players_angle = 180-Math.atan2(diffY,diffX)/Math.PI*180;

					if(other_players_angle >= 45 && other_players_angle <= 135) players[i].sprite.frameHeight = 3;
					else if(other_players_angle > 135 && other_players_angle <= 225 ) players[i].sprite.frameHeight = 2;
					else if(other_players_angle > 225 && other_players_angle <= 315) players[i].sprite.frameHeight = 0;
					else players[i].sprite.frameHeight = 1;

					if(players[i].velx != 0 || players[i].vely != 0){
						sound_step.step1.play();
						if(sound_step.step1.currentTime > sound_step.step1.duration/2) sound_step.step2.play();
						animatePlayer(players[i]);
					}else{
						players[i].sprite.frameMod_counter = 0;
						players[i].sprite.frameWidth = 1;
					}
				}
			}
			ctx.fillStyle = 'yellow';
			for(var i = 0; i < bullets.length; i++){
				// drawCircle(bullets[i].pos.x,bullets[i].pos.y,bullets[i].size,'fill');
				ctx.drawImage(sprites.fireball,bullets[i].pos.x,bullets[i].pos.y);
			}
			// ctx.strokeStyle = 'white';
			// ctx.fillStyle = 'black';
			// player1.show();
			ctx.drawImage(sprites.player,player1.sprite.frameWidth*(sprites.player.width/3),player1.sprite.frameHeight*(sprites.player.height/4),sprites.player.width/3,sprites.player.height/4,player1.pos.x,player1.pos.y,player1.width,player1.height);
			ctx.fillStyle = 'white';
			ctx.fillText(player1.nickname,(player1.pos.x+player1.width/2)-(player1.nickname.length*(15/player1.nickname.length)),player1.pos.y-5);
			player1.move();

			if(mouseDown == true && bullet_cooldown <= 0){
				shoot();
				bullet_cooldown = 99;
			}

			if(shootAngle >= 45 && shootAngle <= 135) player1.sprite.frameHeight = 3;
			else if(shootAngle > 135 && shootAngle <= 225 ) player1.sprite.frameHeight = 2;
			else if(shootAngle > 225 && shootAngle <= 315) player1.sprite.frameHeight = 0;
			else player1.sprite.frameHeight = 1;

			if(player1.velx != 0 || player1.vely != 0){
				sound_step.step1.play();
				if(sound_step.step1.currentTime > sound_step.step1.duration/2) sound_step.step2.play();
				animatePlayer(player1);
			}else{
				player1.sprite.frameMod_counter = 0;
				player1.sprite.frameWidth = 1;
				if(shootAngle >= 45 && shootAngle <= 135) player1.sprite.frameHeight = 3;
				else if(shootAngle > 135 && shootAngle <= 225 ) player1.sprite.frameHeight = 2;
				else if(shootAngle > 225 && shootAngle <= 315) player1.sprite.frameHeight = 0;
				else player1.sprite.frameHeight = 1;
			}

			socket.emit('players update', player1);

			if(directions.up){
				player1.vely = -player_speed;
				player1.sprite.frameHeight = 3;
			}
			if(directions.down){
				player1.vely = player_speed;
				player1.sprite.frameHeight = 0;
			}
			if(directions.left){
				player1.velx = -player_speed;
				player1.sprite.frameHeight = 2;
			}
			if(directions.right){
				player1.velx = player_speed;
				player1.sprite.frameHeight = 1;
			}

			if(!directions.up && !directions.down) player1.vely = 0;
			if(!directions.left && !directions.right) player1.velx = 0;
			// if((player1.pos.x+player1.width)-width/2 < width/2 && (player1.pos.x+player1.width)-width/2 > 0) map_cropX = player1.pos.x-width/2;
			// if((player1.pos.y+player1.height)-height/2 < height/2 && (player1.pos.y+player1.height)-height/2 > 0) map_cropY = player1.pos.y-height/2;
			if(player1.pos.x <= 0) player1.pos.x = 0;
			if(player1.pos.x+player1.width >= width) player1.pos.x = width-player1.width;
			if(player1.pos.y <= 20) player1.pos.y = 20;
			if(player1.pos.y+player1.height >= height) player1.pos.y = height-player1.height;
		},33);
		document.addEventListener('mousemove',function(e){
			player1.mousePos.x = e.pageX;
			player1.mousePos.y = e.pageY;
			if(player1){
				var diffX = player1.pos.x+player1.width/2-player1.mousePos.x;
				var diffY = player1.pos.y+player1.height/2-player1.mousePos.y;
				shootAngle = 180-Math.atan2(diffY,diffX)/Math.PI*180;
			}
		});
		document.addEventListener('mousedown',function(e){
			player1.mousePos.x = e.pageX;
			player1.mousePos.y = e.pageY;
			mouseDown = true;
		});
		document.addEventListener('mouseup',function(){
			mouseDown = false;
		});

		document.addEventListener('keydown',function(e){
			if(e.keyCode == 87 || e.keyCode == 38) directions.up = true;
			if(e.keyCode == 83 || e.keyCode == 40) directions.down = true;
			if(e.keyCode == 65 || e.keyCode == 37) directions.left = true;
			if(e.keyCode == 68 || e.keyCode == 39) directions.right = true;
		});
		document.addEventListener('keyup',function(e){
			if(e.keyCode == 87 || e.keyCode == 38) directions.up = false;
			if(e.keyCode == 83 || e.keyCode == 40) directions.down = false;
			if(e.keyCode == 65 || e.keyCode == 37) directions.left = false;
			if(e.keyCode == 68 || e.keyCode == 39) directions.right = false;
		});
	}

	
});

window.addEventListener('resize',function(e){
	width = window.innerWidth;
	height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
	$('#username-form').css('left',width/2-$('#username-form').css('width').slice(0,$('#username-form').css('width').length-2)/2);
	ctx = canvas.getContext('2d');
	ctx.font = '15px sans-serif';
});
function animatePlayer(player){
	player.sprite.frameWidth = Math.floor(player.sprite.frameMod_counter)%3;
	player.sprite.frameMod_counter += 0.25;
}
function shoot(){
	var dir = {};
	dir.x = player1.mousePos.x-(player1.pos.x+player1.width/2);
	dir.y = player1.mousePos.y-(player1.pos.y+player1.height/2);
	dir.mag = Math.sqrt(dir.x*dir.x+dir.y*dir.y);
	dir.x = (dir.x / dir.mag)*bullet_speed;
	dir.y = (dir.y / dir.mag)*bullet_speed;
	bullet = player1.shoot(dir);
	socket.emit('new bullet',bullet);
}
function drawCircle(x,y,r,type){
	ctx.beginPath();
	ctx.arc(x,y,r,0,Math.PI*2);
	if(type == 'fill') ctx.fill();
	else if(type == 'stroke') ctx.stroke();
}
function Player(id,x,y){
	this.id = id;
	this.pos = {};
	this.pos.x = x;
	this.pos.y = y;
	this.velx = 0;
	this.vely = 0;
	this.width = 45;
	this.height = 36;
	this.mousePos = {x:0,y:0};
	this.sprite = {frameWidth: 0,frameHeight: 0,frameMod: 0,frameMod_counter: 0};

	this.move = function(){
		this.pos.x += this.velx;
		this.pos.y += this.vely;
	}
	this.show = function(){
		ctx.fillRect(this.pos.x,this.pos.y,this.width,this.height);
	}
	this.shoot = function(dir){
		return new Bullet(this.pos.x+this.width/2,this.pos.y+this.height/2,dir);
	}
}
function Bullet(x,y,dir){
	this.pos = {};
	this.pos.x = x;
	this.pos.y = y;
	this.dir = dir;
	this.size = sprites.fireball.width;
}
function toRadians(degrees){  
  return degrees * (Math.PI/180);  
} 
function map(x,a,b,c,d){
	return y = (x-a)/(b-a)*(d-c)+c;
}
