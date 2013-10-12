

function gameLoop(){
	player.re_crop();
	
};

document.onkeydown = function(k){
		if(k.keyCode == 32){
			player.update_status('shooting');
		}else if(k.keyCode == 39){
			player.update_status('running');
		}else{
			player.update_status('standing');
		}
};

function O_robot(name, html_id){
	this.sprite_sheet = "shooter_bot.png";
	this.name = name;
	this.html_id = html_id;
	this.x = 0;
	this.y = 0;
	this.hoz = 0;
	this.action = 'standing';
	var counter = 0;
	var frames = {
		'standing': { 'y': 0 , 'x': 0},
		'shooting': { 'y': 0 , 'x': 1},
		'running': { 'y': 1 , 'x': [0,1]}
	}
	this.spawn = function(){
		this.box = document.createElement("DIV");
		this.box.height = 100;
		this.box.width = 100;
		this.box.id = this.name;
		document.body.appendChild(this.box);
		$("#"+this.name).css('background', "url('shooter_bot.png') 0px 0px");	
	};
	this.drawSprite = function(top,left){
		$("#"+this.name).css('background', "url('shooter_bot.png') "+left*(-100)+"px "+top*(-100)+"px");
		console.log('background', "url('shooter_bot.png') "+left*(-100)+"px "+top*(-100)+"px");
	};
	this.update_status = function(action){
		counter=0;
		this.action = action;
	};

	this.count = function(){
		if(counter>  1){
			counter=0;
		}
	};
	this.re_crop = function(){
		console.log(this.action, frames[this.action].y, frames[this.action].x);
		if(this.action == 'running'){
			this.drawSprite(frames[this.action].y, frames[this.action].x[counter++]);
			this.count();
		}else{
			this.drawSprite(frames[this.action].y, frames[this.action].x);
		}
	};
};

