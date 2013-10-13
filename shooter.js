

function gameLoop(){
	player.game_func();
	//player.falling = true;
	g.is_falling(player);
	//g.team_update();
	//g.is_hit();
};

document.onkeydown = function(k){
		if(k.keyCode == 90){
			player.update_status('shooting',player.facing);
			player.spawn_bullet();
		}else if(k.keyCode == 39){
			player.update_status('running','right');
		}else if(k.keyCode == 37){
			player.update_status('running','left');
		}else if(k.keyCode == 38){
			player.update_status('jumping',player.facing);
		}else{
			player.update_status('standing',player.facing);
		}
};

function O_robot(name, html_id){
	this.sprite_sheet = "shooter.png";
	this.name = name;
	this.html_id = html_id;
	this.health = 100;
	this.x_pos = 200;
	this.y_pos = 410;
	this.falling = false;
	this.action = 'standing';
	this.facing = 'right';
	this.b_facing = 'right';
	this.b_action = 'pulse';
	this.b_active = 0;
	this.bx_pos = 0;
	this.by_pos = 0;
	this.hitbox = { 'height': 100,
					'width': 60};
	this.bullet_hitbox = { 'height': 40,
							'width': 40};
	var b_counter = 0;

	var counter = 0;
	var action_right = {
		'standing': {'y': 0 , 'x': [0,1,2,1]},
		'shooting': {'y': 2 , 'x': [0,1,2]},
		'running': {'y': 1 , 'x': [0,1,2,3,4,5,6,7,8,9]},
		'jumping': {'y': 1 , 'x': [3,4,3,4,3,4,3,4,3,4]}
	};
	var action_left = {
		'standing': {'y': 0 , 'x': [3,4,5,4]},
		'shooting': {'y': 2 , 'x': [5,4,3]},
		'running': {'y': 3 , 'x': [9,8,7,6,5,4,3,2,1,0]},
		'jumping': {'y': 3 , 'x': [3,4,4,4,4,4,4,4,4,4]}
	};
	this.spawn = function(){
		this.box = document.createElement("DIV");
		this.box.height = 95;
		this.box.width = 95;
		this.box.id = this.name;
		document.body.appendChild(this.box);
		$("#"+this.name).css('background', "url('shooter.png') 0px 0px").css('top', '410px').css('left', '200px');	
	};
	this.drawSprite = function(top,left){
		$("#"+this.name).css('background', "url('shooter.png') "+left*(-100)+"px "+top*(-100)+"px").css('left', this.x_pos+"px").css('top', this.y_pos+"px");
	};
	this.update_status = function(action, facing){
		counter=0;
		this.action = action;
		this.facing = facing;
	};
	this.move =function(action, facing){
		if(this.falling){
			this.y_pos +=15;
		}else
			if(action == 'jumping'){
				this.count(this.action);
				if(counter == 0){
					this.action = 'standing';
				}
				if(facing == 'right'){
					this.x_pos +=15;
					this.y_pos -=10;
				}else if(facing =='left'){
					this.x_pos -=15;
					this.y_pos -=10;			
				}
			}else{
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
			};
		
	};
	this.count = function(action){
		if(action == 'jumping'){
			if(counter >9){
				counter = 0;
			}
		}else
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
	var bullet_action = {
		'death': {'y': 1 , 'x':[0,1,2,3]},
		'pulse': {'y': 0 , 'x':[0,1,2,3,2,1]}
	}
	this.spawn_bullet = function(){
		if(this.b_active == 0){
			this.b_action = 'pulse';
		this.bx_pos = 0;
		this.by_pos = 0;
		this.box = document.createElement("DIV");
		this.box.height = 40;
		this.box.width = 40;
		this.box.id = 'bullet';
		document.body.appendChild(this.box);
		$("#"+'bullet').css('background', "url('shooter_bullet.png') 0px " + this.x_pos +"px").css('left', this.x_pos + "px").css('top', this.y_pos+30+"px").css('height','40px').css('width','40px');	
		this.b_active = 1;
		this.b_facing = this.facing;
		this.by_pos = this.y_pos;
		if(this.facing == 'right'){
			this.bx_pos = this.x_pos+70;
			}else{
				this.bx_pos = this.x_pos;
			}	
		
		};

	};
	this.destroy_bullet = function(){
		if(b_counter>4){
			document.body.removeChild(document.getElementById('bullet'));
			this.b_active = 0;
			b_counter = 0;
			this.bx_pos = 0;
			this.by_pos = 0;
			
		}
		this.draw_bullet(bullet_action[this.b_action].y, bullet_action[this.b_action].x[b_counter++]);
		
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
		if(this.bx_pos > 1000 || this.bx_pos < 0){
			this.b_action = 'death';
		}
	};
	this.move_bullet = function(){
		this.draw_bullet(bullet_action['pulse'].y, bullet_action['pulse'].x[b_counter++]);
		this.cycle_bullet();
	};
	this.draw_bullet = function(top,left){
		$("#"+'bullet').css('background', "url('shooter_bullet.png') "+left*(-40)+"px "+top*(-40)+"px").css('left', this.bx_pos+"px");
	};
	this.game_func = function(){
		this.re_crop();
		if(this.b_active){
			if(this.b_action == 'death'){
				this.destroy_bullet();
			}else{
				this.move_bullet();
			};
		};
	};
};

function opfor(name, html_id,idnum){
	this.id = html_id;
	this.name = name;
	this.idnum = idnum;
	this.x_pos = 0;
	this.y_pos = 0;
	var counter = 0;
	var d_counter = 0;
	this.hitbox = {'height': 100,
					'width': 70};
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
	var misc_action = {
		'death': {'y': 3 , 'x': [0,1,2,3,4,5,6,7,8,9]}
	}
	this.drawSprite = function(top,left){
		$("#"+this.id).css('background', "url('shooter_opfor.png') "+left*(-100)+"px "+top*(-100)+"px").css('left', this.x_pos+"px");
	};
	this.update = function(){
		if(this.action == 'death'){
			console.log(this.name, this.action, this.id, counter, d_counter);
			for(var z in g.opfor_team){
				
				console.log(g.opfor_team[z]);
			};
			if(d_counter >= misc_action[this.action].x.length){
				d_counter = 0;
				this.action = 'dead';
				
				console.log(this.name);	
				
				$("#"+this.id).remove();
				
			}else{
				this.drawSprite(misc_action[this.action].y, misc_action[this.action].x[d_counter++]);
			};
		}else{
			if(this.x_pos > 1000){
				facing = 'left';
			}else if(this.x_pos < 0){
				facing = 'right';
			};

			if(facing == 'right'){
				if(counter >= right_action[this.action].x.length){
				counter = 0;
				};
				
				this.drawSprite(right_action[this.action].y, right_action[this.action].x[counter++]);
				this.x_pos += 12;
			}else{
				facing = 'left';
				if(counter >= left_action[this.action].x.length){
				counter = 0;
				};
				
				this.drawSprite(left_action[this.action].y, left_action[this.action].x[counter++]);
				this.x_pos -= 12;
			};
		};
	};
};

function game(){
	this.opfor_team = new Array();
	this.spawn_timer = 0;
	var idnum = 0;
	this.init = function(){
		var m = new O_map();
		m.drawmap();
		m.lay_floor();
		player = new O_robot("player","robot1");
		player.spawn();
		//this.spawn_opfor();
	};

	this.spawn_opfor = function(){
		this.idn = idnum++;
		var name = "ebot"+this.idn;
		
		var html_id = "opfor"+this.idn;
		name = new opfor(name,html_id,this.idn);
		name.action = 'running';
		this.opfor_team.splice(this.ind,0,name);
		
		name.spawn();
	};
	this.team_update = function(){
		
		for(var zz in this.opfor_team){
			if(this.opfor_team[zz].action !='dead'){
				this.opfor_team[zz].update();
			};
		};
		this.f_spawn_timer();
	};
	this.f_spawn_timer = function(){
		if(this.spawn_timer++>100){
			this.spawn_opfor();
			this.spawn_timer = 0;
		};
	};
	this.hit = function(item1,isbullet,item2){
		if(isbullet == 1){
			var test_box1 = item1.bullet_hitbox;
			var x1 = item1.bx_pos;
			var y1 = item1.by_pos;
		}else{
			var test_box1 = item1.hitbox;
			var x1 = item1.x_pos;
			var y1 = item1.y_pos;
		};
		
		var test_box2 = item2.hitbox;
		var x2 = item2.x_pos;
		var y2 = item2.y_pos;

		if((x1 >= x2+test_box2['width'])||(x1 <= x2)){
			return false;
		}
		if((y1 >= y2+test_box2['height'])||(y1+test_box1['height'] <= y2)){
			return false;
		}
		return true;
	};
	
	this.is_hit = function(){
		for (var z in this.opfor_team){
			if(player.b_active == 1 && player.b_action != 'death'){
				if(this.hit(player,1,this.opfor_team[z])){
					
					player.b_action = 'death';
					this.opfor_team[z].action='death';
				};
			};
			if(this.opfor_team[z].action != 'dead'){
				if(this.hit(player,0,this.opfor_team[z])){
					player.health -= 10;
					if(!this.is_player_alive()){
						alert("You died!");
					};
				};
			};
			
		};
	};
	this.is_player_alive = function(){
		if(player.health > 0){
			return true;
		}else{
			return false;
		};
	};
	this.is_falling = function(item){
		$('.floor').each(function(){
			var floor = $(this);
			
			console.log(item.y_pos, item.x_pos);
			console.log(floor.offset().top, floor.offset().left, floor.outerWidth());
			if((floor.offset().top == item.y_pos+100)&&((floor.offset().left + floor.outerWidth()) >= item.x_pos+50 && floor.offset().left <= item.x_pos)){
				item.falling = false;
			}else{
				item.falling = true;
			};
		});


	};
};

function O_map(){
	this.floorcount = 0;
	this.mapinfo = {
		'map1': {'file': 'map_1.png',
				'dimentions': [1000,1000],
				'player_start': [200,800],
				'floors': {'y': 5, 'x': [1,5]}
			}
		};
	this.drawmap = function(){
		var gb = document.getElementById("map");
		var board = gb.getContext("2d");
		gb.height = 700;
		gb.width = 1000;
		//board.fillStyle = "#bbbbbb";
		//board.fillRect(0,0,1000,500);
		$("#map").css('background', 'URL(' + this.mapinfo.map1.file + ') 0px 0px').css('top', '-300px');
	};

	this.lay_floor = function(){
		this.id = 'floor' + this.floorcount++;
		this.box = document.createElement("DIV");
		this.box.id = this.id;
		document.body.appendChild(this.box);
		$("#"+this.id).css('display','inline-block').css('position','absolute').css('left', (this.mapinfo.map1.floors.x[0] * 100)+10 +'px').css('top', (this.mapinfo.map1.floors.y * 100)+10 + "px").css('width', this.mapinfo.map1.floors.x[1]*100 + 'px').css('height', '1px').addClass('floor');
		
	};
};




