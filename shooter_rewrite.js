/*var GLOBALdirection = 'right';

document.onkeydown = function(k){
			switch(k.keyCode){
				case 39:
					GLOBALdirection = 'right';
					//this.direction = 'right';
					break;
				case 37:
					GLOBALdirection = 'left';
					//this.direction = 'left';
					break;
				default:
			};
		};
/*
function O_game(m_name, p_name, g_name){
	this.name = g_name;
	this.direction = 'right';
	/*
	this.check_direction = function(){
		
	};
	this.gameLoop = function(){
		m_name.roll(this.direction);
		p_name.move(this.direction);
		g_name.check_direction();
	};
	
};
*/


function O_player(){
	var count = 0;
	this.direction = 'right';
	this.animations = {
		'right': {'standing': {'y': 0 , 'x': [0,1,2,1]},
				'shooting': {'y': 2 , 'x': [0,1,2,3,2,3]},
				'running': {'y': 1 , 'x': [0,1,2,3,4,5,6,7,8,9]},
				'jumping': {'y': 4 , 'x': [0,1,2,1,2,1,2,1,2,1,2]},
				'falling': {'y': 4, 'x':[6,6,7,7,6,6,7,7,6,7]}
			},
		'left': {'standing': {'y': 0 , 'x': [3,4,5,4]},
				'shooting': {'y': 2 , 'x': [7,6,5,4,5,4]},
				'running': {'y': 3 , 'x': [9,8,7,6,5,4,3,2,1,0]},
				'jumping': {'y': 4 , 'x': [5,4,3,4,3,4,3,4,3,4,3]},
				'falling': {'y': 4, 'x':[8,8,9,9,8,8,9,9,8,9]}
		}

	};

	this.spawn = function(){
		this.box = document.createElement("DIV");
		this.box.height = 95;
		this.box.width = 95;
		this.box.id = 'player';
		document.body.appendChild(this.box);
		$("#player").css('background-image','url("shooter.png")').css('top', 560+'px').css('left', 450+'px');
	};
	this.move = function(direction){
		switch(direction){
			case 'right':
				this.animate('running','right');
				break;

		};
	};
	this.animate = function(action, direction){
		if(count > this.animations.right.running.x.length){
			count = 0;
		};
		var x = this.animations.right.running.x[count];
		var y = this.animations.right.running.y;
		//console.log(x,y);
		$("#player").css('background','url("shooter.png") '+ (x * -100) +'px '+ (y * -100) + 'px');
		count++;
	};
};

function O_map(){
	this.direction = 'right';
	this.x_pos = new Array();
	this.x_pos = [0,0,0,0,0,0,0];
	this.y_pos = 0;
	var map_layers = new Array();
	map_layers[0] = "base_floor.png";
	map_layers[1] = "smog_1.png";
	map_layers[2] = "smog2.png";
	map_layers[4] = "cityscape1.png";
	map_layers[3] = "smog3.png";
	map_layers[5] = "cityscape2.png";
	map_layers[6] = "skybox.png";
	var layer_id = new Array();
	layer_id[0] = "#map";
	layer_id[1] = "#smog1";
	layer_id[2] = "#smog2";
	layer_id[4] = "#cityscape1";
	layer_id[3] = "#smog3";
	layer_id[5] = "#cityscape2";
	layer_id[6] = "#skybox";
	this.drawmap = function(){
		for(var i=0; i<7;i++){
			$(layer_id[i]).css('background', 'URL('+map_layers[i]+') 0px 0px');
		};
		
		
	};
	
	this.roll = function(direction){
		switch(direction){
			case 'right':
				//console.log('map move',direction,this.x_pos);
				for(var i=0; i<7;i++){
					var tempx = this.x_pos[i] += (-15+(i*2));
					$(layer_id[i]).css('background', 'URL('+map_layers[i]+') ' + tempx +'px 0px');
				};
				break;
			case 'left':
				//console.log('map move',direction,this.x_pos);
				for(var i=0; i<7;i++){
					var tempx = this.x_pos[i] += (+15-(i*2));
					$(layer_id[i]).css('background', 'URL('+map_layers[i]+') ' + tempx +'px 0px');
				};
				break;
			default:

		};
		
	};
};
