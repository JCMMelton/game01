

function gameLoop(){
	player.game_func();
	g.team_test();
};

document.onkeydown = function(k){
		if(k.keyCode == 32){
			player.update_status('shooting',player.facing);
			player.spawn_bullet();
		}else if(k.keyCode == 39){
			player.update_status('running','right');
		}else if(k.keyCode == 37){
			player.update_status('running','left');
		}else{
			player.update_status('standing',player.facing);
		}
};

function O_robot(name, html_id){
	this.sprite_sheet = "shooter.png";
	this.name = name;
	this.html_id = html_id;
	this.x_pos = 0;
	this.y_pos = 0;
	this.action = 'standing';
	this.facing = 'right';
	this.b_facing = 'right';
	this.b_active = 0;
	this.bx_pos = 0;
	this.by_pos = 0;
	var b_counter = 0;

	var counter = 0;
	var action_right = {
		'standing': {'y': 0 , 'x': [0,1,2,1]},
		'shooting': {'y': 2 , 'x': [0,1,2]},
		'running': {'y': 1 , 'x': [0,1,2,3,4,5,6,7,8,9]}
	};
	var action_left = {
		'standing': {'y': 0 , 'x': [3,4,5,4]},
		'shooting': {'y': 2 , 'x': [5,4,3]},
		'running': {'y': 3 , 'x': [9,8,7,6,5,4,3,2,1,0]}
	};
	this.spawn = function(){
		this.box = document.createElement("DIV");
		this.box.height = 95;
		this.box.width = 95;
		this.box.id = this.name;
		document.body.appendChild(this.box);
		$("#"+this.name).css('background', "url('shooter.png') 0px 0px");	
	};
	this.drawSprite = function(top,left){
		$("#"+this.name).css('background', "url('shooter.png') "+left*(-100)+"px "+top*(-100)+"px").css('left', this.x_pos+"px");
	};
	this.update_status = function(action, facing){
		counter=0;
		this.action = action;
		this.facing = facing;
	};
	this.move =function(action, facing){
		this.count(this.action);
		if(counter == 0){
			this.action = 'standing';
		}
		if(action == 'running'){
			if(facing == 'right'){
				this.x_pos +=15;
			}else if(facing =='left'){
				this.x_pos -=15;
			}
		}
	}
	this.count = function(action){
		if(action == 'running'){
			if(counter > 9){
				counter=2;
			}
		}else if(action == 'shooting'){
			if(counter > 2){
				counter=2;
			}
		}
		else{
				if(counter>3){
					counter=0;
				}
			}
		
	};
	this.re_crop = function(){

		
 		if(this.facing == 'right'){
 			this.drawSprite(action_right[this.action].y, action_right[this.action].x[counter++]);
 		}else if(this.facing == 'left'){
 			this.drawSprite(action_left[this.action].y, action_left[this.action].x[counter++]);
 		}
		this.move(this.action,this.facing);
		
	};
	var bullet_pulse = {
		'pulse': {'y': 0 , 'x':[0,1,2,3,2,1]}
	}
	this.spawn_bullet = function(){
		if(this.b_active == 0){
		this.box = document.createElement("DIV");
		this.box.height = 100;
		this.box.width = 100;
		this.box.id = 'bullet';
		document.body.appendChild(this.box);
		$("#"+'bullet').css('background', "url('shooter_bullet.png') 0px " + this.x_pos +"px").css('left', this.x_pos +"px").css('top', 0+"px");	
		this.b_active = 1;
		this.b_facing = this.facing;
		this.bx_pos = this.x_pos;
		};

	};
	this.destroy_bullet = function(){
		document.body.removeChild(document.getElementById('bullet'));
		this.b_active = 0;
	};
	this.cycle_bullet = function(){
		if(b_counter>6){
			b_counter = 0;
		}
		if(this.b_facing == 'right'){
			this.bx_pos +=20;
		}else{
			this.bx_pos -= 20;
		}
		if(this.bx_pos > 1000 || this.bx_pos < -100){
			this.destroy_bullet();
		}
	};
	this.move_bullet = function(){
		this.draw_bullet(bullet_pulse['pulse'].y, bullet_pulse['pulse'].x[b_counter++]);
		this.cycle_bullet();
	};
	this.draw_bullet = function(top,left){
		$("#"+'bullet').css('background', "url('shooter_bullet.png') "+left*(-100)+"px "+top*(-100)+"px").css('left', this.bx_pos+"px");
	};
	this.game_func = function(){
		this.re_crop();
		if(this.b_active){
			this.move_bullet();
		};
	};
};

function opfor(name, html_id){
	this.id = html_id;
	this.name = name;
	this.x_pos = 0;
	this.y_pox = 0;
	var counter = 0;
	var facing = 'left';
	this.action = "running";
	this.spawn = function(){
		this.box = document.createElement("DIV");
		this.box.height = 95;
		this.box.width = 95;
		this.box.id = html_id;
		document.body.appendChild(this.box);
		$("#"+this.id).css('background', "url('shooter_opfor.png') 0px 0px").css('width', '100px').css('height', '100px').css('display','inline-block').css('position','absolute');	
	};
	var right_action ={
		'standing': {'y': 0 , 'x': [0,0,0,0,0,0,0,0,2,0,0,0]},
		'running': {'y': 2 , 'x': [0,1,2,3,4,5,6]}
	}
	var left_action = {
		'standing': {'y': 0 , 'x': [0,0,0,0,0,0,0,0,0,0,2,0]},
		'running': {'y': 1 , 'x': [0,1,2,3,4,5,6]}
	};
	this.drawSprite = function(top,left){
		$("#"+this.id).css('background', "url('shooter_opfor.png') "+left*(-100)+"px "+top*(-100)+"px").css('left', this.x_pos+"px");
	};
	this.test = function(){
		if(this.x_pos > 1000){
			facing = 'left';
		}else if(this.x_pos < 0){
			facing = 'right';
		};

		if(facing == 'right'){
			if(counter >= right_action[this.action].x.length){
			counter = 0;
			};
			console.log(right_action[this.action].x[counter]);
			this.drawSprite(right_action[this.action].y, right_action[this.action].x[counter++]);
			this.x_pos += 12;
		}else{
			facing = 'left';
			if(counter >= left_action[this.action].x.length){
			counter = 0;
			};
			console.log(left_action[this.action].x[counter]);
			this.drawSprite(left_action[this.action].y, left_action[this.action].x[counter++]);
			this.x_pos -= 12;
		};
		
	};
}

function game(){
	this.opfor_team = new Array();

	this.init = function(){
		player = new O_robot("player","robot1");
		player.spawn();

		this.spawn_opfor();
	};

	this.spawn_opfor = function(){
		var idn = this.opfor_team.length;
		var name = "ebot"+idn;
		var html_id = "opfor"+idn;
		name = new opfor(name,html_id);
		this.opfor_team.push(name);
		name.spawn();
	};
	this.team_test = function(){
		for(var i=0;i<this.opfor_team.length;i++){
			this.opfor_team[i].test();
		}
	};
	/*this.hit = function(){

	}*/
};




