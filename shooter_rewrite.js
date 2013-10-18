var GLOBALdirection = 'right';
var PLAYERaction = 'running';

function O_game(){
	

	this.init = function(){
		om = new O_map();
		pc = new O_player();
		pc.spawn();
		om.drawmap();
	}


	this.add_floor = function(){
		var numbers = [4,3,6,4,3,5,5,5];
		var x = numbers[Math.round(Math.random()*5)];
		om.build_floor(x);
	};

	this.check_direction = function(){
		document.onkeydown = function(k){
			switch(k.keyCode){
				case 39:
					om.direction = 'right';
					pc.direction = 'right';
					pc.action = 'running';
					break;
				case 37:
					om.direction = 'left';
					pc.direction = 'left';
					pc.action = 'running';
					break;
				case 38:
					om.direction = pc.direction;
					pc.action = 'jumping';
					break;
				case 90:
					//GLOBALdirection = 'none';
					om.direction = '';
					pc.action = 'shooting';
					break;

				case 70:
					g.add_floor();
					break;

				case 71:
					om.remove_all_floors();
					
					break;

				default:
					//pc.action = 'running';
			};
		};
		document.onkeyup = function(){

			pc.action = 'standing';
			if(om.direction != ''){
			om.lastdirection = om.direction;
			}
			om.direction = '';
		}
	};
	
	this.gameLoop = function(){
			g.check_direction();
			pc.animate(pc.action, pc.direction);
			om.roll(om.direction);
			g.is_falling();
	};
	
	this.is_falling = function(){
		item = pc;
		//console.log("falling checked");
		var no_floor = true;
		//console.log(item.y_pos+item.hitbox['height'], item.x_pos);
		
		var on_floor = false;
		$('.floor').each(function(){
			var floor = $(this);
			
			
			//console.log('floor offset top',floor.offset().top,'floor offset bottom', floor.offset().bottom,'floor width', floor.outerWidth());
			if(((floor.offset().top >= (item.y_pos+item.hitbox['height']) && floor.offset().top-20 <= item.y_pos + item.hitbox['height'] -10 )&&((floor.offset().left + floor.outerWidth()) >= item.x_pos+item.hitbox['width'] && floor.offset().left <= item.x_pos+item.hitbox['width']))||(item.action == 'jumping')){
				//console.log('on floor');
				pc.falling = false;
				on_floor = true;
			}else{
				//console.log('is falling');
				if(!on_floor){
				pc.falling = true;
				};
			};
		no_floor = false;
		});
		if(no_floor){
			pc.falling = true;
		};
	};
	
};



function O_player(){
	var count = 0;
	//var vert = 560;
	this.x_pos = 450;
	this.y_pos = 560;
	this.falling = true;
	this.direction = 'right';
	this.action = 'running';
	this.hitbox = {
		'height': 100,
		'width': 80
	};
	var animations = {
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
		$("#player").css('background-image','url("shooter.png")').css('top', this.y_pos +'px').css('left', 450+'px');
	};
	this.move = function(direction){
		switch(direction){
			case 'right':
				this.animate(this.action,this.direction);
				break;
			case 'left':
				this.animate(this.action,this.direction);
				break;

		};
	};
	
	this.animate = function(action, direction){
		
		var x = animations[direction][action].x[count];
		var y = animations[direction][action].y;
		//console.log(x,y);
		if(action == 'jumping'){
			this.y_pos -= 12;
			this.falling = false;
		}else{
			if(this.y_pos <= 550 && this.falling){
				//this.falling = true;
				this.y_pos += 12;
			}
		};
		//if(this.action != 'jumping'){
		//if(this.falling){this.action == 'falling';}else{this.action='standing';};};
		/*
		if(this.falling && this.action != 'jumping'){
			this.action == 'falling';
		}
		else{
			this.action = 'standing';
		};
			*/
		$("#player").css('background','url("shooter.png") '+ (x * -100) +'px '+ (y * -100) + 'px').css('top', this.y_pos +'px');
		count++;
		if(count > animations[direction][action].x.length){
			count = 0;
			//console.log(animations[direction][action].x.length);
		};
	};
};

function O_map(){
	this.direction = 'right';
	this.lastdirection = '';
	this.x_pos = new Array();
	this.x_pos = [0,0,0,0,0,0,0];
	this.y_pos = 0;
	
	//this.x_tend = 0;
	/*
	map_data = new Array();
	map_data2 = new Array();
	map_data3 = new Array();
	map_data4 = new Array();
	*/
	this.floors = new Array();
	this.floors_img = new Array();
	this.floorcount = 0;
	this.floors_x = new Array();

	map_layers = new Array();
	map_layers[0] = "base_floor.png";
	map_layers[1] = "smog1.png";
	map_layers[2] = "smog2.png";
	map_layers[4] = "cityscape1.png";
	map_layers[3] = "smog3.png";
	map_layers[5] = "cityscape2.png";
	map_layers[6] = "skybox.png";

	// layer_name = new Array();
	// layer_name[0] = "map";
	// layer_name[1] = "smog1";
	// layer_name[2] = "smog2";
	// layer_name[4] = "cityscape1";
	// layer_name[3] = "smog3";
	// layer_name[5] = "cityscape2";
	// layer_name[6] = "skybox";

	layer_id = new Array();
	layer_id[0] = "#map";
	layer_id[1] = "#smog1";
	layer_id[2] = "#smog2";
	layer_id[4] = "#cityscape1";
	layer_id[3] = "#smog3";
	layer_id[5] = "#cityscape2";
	layer_id[6] = "#skybox";

	this.mapinfo ={'floors': [{'y': 6, 'x': [10,6], 'file': '"floor_seg.png"'},
							{'y': 5, 'x': [10,2], 'file': '"floor_seg.png"'},
							{'y': 4, 'x': [10,2], 'file': '"floor_seg.png"'},
							{'y': 4, 'x': [10,2], 'file': '"floor_seg.png"'},
							{'y': 3, 'x': [10,4], 'file': '"floor_seg.png"'},
							{'y': 2, 'x': [10,3], 'file': '"floor_seg.png"'},
							{'y': 2, 'x': [10,3], 'file': '"floor_seg.png"'},
							{'y': 1, 'x': [10,2], 'file': '"floor_seg.png"'}]
						};

}
	O_map.prototype.drawmap = function(){

		for(var i=0; i<7;i+=1){
			$(layer_id[i]).css('background', 'URL('+map_layers[i]+') 0px 0px');
		};
		
		
	};
	
	O_map.prototype.roll = function(direction){
		// console.log(this.x_pos);
		//                                   floors[x] = [0 id, 1[0 x_pos, 1 dist_moved, 2 max width, 3 current width]]
		switch(direction){
			case 'right':
				//console.log('map move',direction,this.x_pos);

				/*   Move the map   */
				for(var i=0; i<7;i++){
					if(this.x_pos[i]<-3000){this.x_pos[i]+=3000;};
					var tempx = this.x_pos[i] += (-15+(i*2));
					
					$(layer_id[i]).css('background', 'URL('+map_layers[i]+') '+ tempx +'px 0px');
				};
				this.roll_floor(15,this.floors, 'right');
				this.roll_floor(15,this.floors_img, 'right');

				/*  Move the floors  */
				// if(this.floors.length){
				// 	for(var f=0; f < this.floors.length; f++){
						
				// 		var fx = this.floors[f][1][0] -= 15;
						
				// 		this.floors[f][1][1] -=15;
				// 		//console.log(this.floors_x[f+this.x_tend][0],this.floors_x[f][0]);
				// 		$("#"+this.floors[f][0]).css('left', fx);

				// 		/* Expand/shrink floor */
				// 		if((this.floors[f][1][0] < 1020 && this.floors[f][1][0] > 120) && (this.floors[f][1][3] < this.floors[f][1][2]*100)){
							
				// 				this.floors[f][1][3] +=15;
				// 			}else if(this.floors[f][1][0] < -20 && (this.floors[f][1][3] > 0)){
				// 				this.floors[f][1][3] -= 15;
				// 			};
				// 			$("#"+this.floors[f][0]).css("width", this.floors[f][1][3]);
				// 			console.log(this.floors[f][1][3]);

				// 			/* Check to delete floor */
				// 			if(this.floors[f][1][1] < -2000){
				// 				console.log('floor deleted');
				// 				this.remove_floor(f);
				// 			};
				// 		};
						
						
						
				// 	};
				
				break;
			case 'left':
				//console.log('map move',direction,this.x_pos);
				/*   Move the map   */
				for(var i=0; i<7;i++){
					if(this.x_pos[i]>=3000){this.x_pos[i]-=3000;};
					var tempx = this.x_pos[i] += (+15-(i*2));
					$(layer_id[i]).css('background', 'URL('+map_layers[i]+')'+ tempx +'px 0px');
				};
				/*  Move the floors  */
				if(this.floors.length){
					this.roll_floor(-15,this.floors, 'left');
					this.roll_floor(-15,this.floors_img, 'left');
					// for(var f=0; f < this.floors.length; f++){
					// 	var fx = this.floors[f][1][0] += 15;
					// 	this.floors[f][1][1] +=15;
					// 	$("#"+this.floors[f][0]).css('left', fx);

					// 	/* Expand/shrink floor */
					// 	if(this.floors[f][1][0] < -20 && (this.floors[f][1][3] < this.floors[f][1][2]*100)){
							
					// 			this.floors[f][1][3] +=15;
					// 		}
					// 	else if(this.floors[f][1][0] > (1012-this.floors[f][1][2]*100) && (this.floors[f][1][3] > 0)){
					// 			this.floors[f][1][3] -= 15;
					// 		};
					// 		$("#"+this.floors[f][0]).css("width", this.floors[f][1][3]);
					// 		console.log(this.floors[f][1][3]);

					// 		/* Check to delete floor */
					// 		if(this.floors[f][1][1] > 1500){
					// 			console.log('floor deleted');
					// 			this.remove_floor(f);
					// 		};
						};

						/* Expand/shrink floor */
						// if(this.floors[f][1][0] < -20 ){
						// 	if(this.floors[f][1][3] > this.floors[f][1][2]*100){
						// 		this.floors[f][1][3] -=15;
						// 	}else if(this.floors[f][1][0] > 1020){
						// 		this.floors[f][1][3] += 15;
						// 	}
						// 	$("#"+this.floors[f][0]).css("width", this.floors[f][1][3]);
						// 	console.log(this.floors[f][1][3]);
						// };

						
					
				
				break;

			default:

		};
		
	};

	O_map.prototype.lay_floor = function(yf,xf0,xf1,f_url){
		this.id = 'floor' + this.floorcount++;
		this.box = document.createElement("DIV");
		this.box.id = this.id;
		document.body.appendChild(this.box);
		$("#"+this.id).css('display','inline-block').css('position','absolute').css('left', (xf0 * 100)+10 +'px').css('top', (yf * 100)+10 + "px").css('width', '0 px').css('height', '10px').addClass('floor');
		this.floors.push([this.id, [ xf0 * 100 /*+10*/ , 0, xf1*100, 0 ] ]);

		this.id = 'floor_img' + this.floorcount;
		this.box = document.createElement("DIV");
		this.box.id = this.id;
		document.body.appendChild(this.box);
		$("#"+this.id).css('background', 'URL('+f_url+') 0px 0px').css('overflow-y', 'visible').css('display','inline-block').css('position','absolute').css('background-repeat','repeat-x').css('left', (xf0 * 100)+10 +'px').css('top', (yf * 100)-16 + "px").css('width', '0 px').css('height', '50px').addClass('floor2');
		this.floors_img.push([this.id, [ xf0 * 100 /*+ 10*/ , 0, xf1*100, 0 ] ]);



		//console.log(this.floors_x);
		//this.floors_x[this.floorcount-1] = [ xf0 * 100 + 10 , 0 ];
		//console.log(this.floors_x);
	};
	O_map.prototype.build_floor = function(f){
		//console.log(f,this.mapinfo.floors[f].y);
		var yf = this.mapinfo.floors[f].y;
		var xf0 = this.mapinfo.floors[f].x[0];
		var xf1 = this.mapinfo.floors[f].x[1];
		var f_url = this.mapinfo.floors[f].file;
		console.log('URL('+f_url+')');
		this.lay_floor(yf, xf0, xf1, f_url);
		
	};

	O_map.prototype.remove_all_floors = function(){
		for(var f=0; f<this.floors.length; f++){
			$("#"+this.floors[f]).remove();
			$("#"+this.floors_img[f]).remove();
		};
		//this.floors_x.length = 0;
		this.floors.length = 0;
		this.floors_img.length = 0;
	};
	O_map.prototype.remove_floor = function(f){
		$("#"+this.floors[f]).remove();
		$("#"+this.floors_img[f]).remove();
		//this.floors_x.splice(f,1);
	};
	O_map.prototype.roll_floor = function(mov, tfloors, dir){
		// if(dir == 'right'){
		// 	// edge1 = 1020;
		// 	// edge2 = 120;
		// 	var mov = 15;
		// }else{
		// 	// edge1 = 1020;
		// 	// edge2 = 120;
		// 	var mov = -15;
		// };
//                                   floors[x] = [0 id, 1[0 x_pos, 1 dist_moved, 2 max width, 3 current width]]
		
		for(var f=0; f < tfloors.length; f++){
			
			var fx = (tfloors[f][1][0] -= mov);
			
			tfloors[f][1][1] -= mov;
			//console.log(this.floors_x[f+this.x_tend][0],this.floors_x[f][0]);
			$("#"+tfloors[f][0]).css('left', fx);

			/* Expand/shrink floor */
			if(dir == 'right'){
			if((tfloors[f][1][0] < 1020 && tfloors[f][1][0] > 120) && (tfloors[f][1][3] < tfloors[f][1][2])){
				
					tfloors[f][1][3] += 15;
				}else if(tfloors[f][1][0] < -20 && (tfloors[f][1][3] > 0)){
					tfloors[f][1][3] -= 15;
				};
				$("#"+tfloors[f][0]).css("width", tfloors[f][1][3]);
				console.log(tfloors[f][1][3]);

				/* Check to delete floor */
				if(tfloors[f][1][1] < -2000){
					console.log('floor deleted');
					this.remove_floor(f);
				};
			}else if(dir == 'left'){
				for(var f=0; f < tfloors.length; f++){
						var fx = tfloors[f][1][0] += 15;
						tfloors[f][1][1] += 15;
						$("#"+tfloors[f][0]).css('left', fx);

						/* Expand/shrink floor */
						if(tfloors[f][1][0] < -20 /*&& (tfloors[f][1][3] < tfloors[f][1][2])*/){
							
								tfloors[f][1][3] += 15;
							}
						else if(tfloors[f][1][0] > 1000-tfloors[f][1][3] && tfloors[f][1][3] > 0){
								tfloors[f][1][3] -= 15;
							};
							$("#"+tfloors[f][0]).css("width", tfloors[f][1][3]);
							console.log(tfloors[f][1][3]);

							/* Check to delete floor */
							if(tfloors[f][1][1] > 1500){
								console.log('floor deleted');
								this.remove_floor(f);
							};

				};	
			};
		};
	};	
	

	// function Person(){
	// 	this.name = "Joseph"
	// }


	// function Person(){
	// 	var self = new Object
	// 	self = {
	// 		name: "Joseph"

	// 	}
	// 	return self;
	// }


