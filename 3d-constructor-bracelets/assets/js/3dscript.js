	window.onload = function(){
		let camera, scene, controls, renderer, rope;
		let bead_forms = [];
		let beads = [];
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize($("#preview-canvas").width(), $("#preview-canvas").height());
		renderer.setClearColor(0x151515, 1);
		$("#preview-canvas").append(renderer.domElement);
		camera = new THREE.PerspectiveCamera(65, $("#preview-canvas").width()/$("#preview-canvas").height(),0.1,1000);
		scene = new THREE.Scene();
		controls = new THREE.TrackballControls(camera, renderer.domElement);
		controls.rotateSpeed = 1;
		controls.zoomSpeed = 0.11;
		controls.noPan = true;
		// controls.noZoom = true;

		let textureLoader = new THREE.TextureLoader();
		let textures = {};

		for(let i = 0; i < $("#textures-list li img").length; i++){
			let li_imgs = $("#textures-list li img");
			let temp_t_link = li_imgs[i].src;
			let temp_t = textureLoader.load(temp_t_link, function(txr){
				txr.wrapT = THREE.RepeatWrapping;
				txr.wrapS = THREE.RepeatWrapping;
				if(temp_t_link.split('/')[temp_t_link.split('/').length-1] == "rope1.png"){
					txr.repeat.set(50, 2);	
				}if(temp_t_link.split('/')[temp_t_link.split('/').length-1] == "evil_eye.png"){
					txr.repeat.set(1, 1);	
				}else {
					txr.repeat.set(2, 2);	
				}
			});
			// textures.push({name:temp_t_link.split('/')[temp_t_link.split('/').length-1].split(".")[0],txt:temp_t});
			textures[temp_t_link.split('/')[temp_t_link.split('/').length-1].split(".")[0]] = temp_t;
		}

		
		// let ropeTexture = textureLoader.load("assets/textures/rope1.png", function(txr){
		// 	txr.wrapT = THREE.RepeatWrapping;
		// 	txr.wrapS = THREE.RepeatWrapping;
		// 	txr.repeat.set(50, 2);
		// });
		// let beadTexture1 = textureLoader.load("assets/textures/wood1.jpg", function(txr){
		// 	txr.wrapT = THREE.RepeatWrapping;
		// 	txr.wrapS = THREE.RepeatWrapping;
		// 	txr.repeat.set(2,2);
		// });
		// let beadTexture2 = textureLoader.load("assets/textures/wood2.jpg", function(txr){
		// 	txr.wrapT = THREE.RepeatWrapping;
		// 	txr.wrapS = THREE.RepeatWrapping;
		// 	txr.repeat.set(2,2);
		// });
		// let beadTexture3 = textureLoader.load("assets/textures/wood3.jpg", function(txr){
		// 	txr.wrapT = THREE.RepeatWrapping;
		// 	txr.wrapS = THREE.RepeatWrapping;
		// 	txr.repeat.set(2,2);
		// });
		// let beadTexture4 = textureLoader.load("assets/textures/wood4.jpg", function(txr){
		// 	txr.wrapT = THREE.RepeatWrapping;
		// 	txr.wrapS = THREE.RepeatWrapping;
		// 	txr.repeat.set(2,2);
		// });

		let remember = [];

		let lights = [];
		lights[0] = new THREE.AmbientLight(0xffffff, 0.25);
		lights[1] = new THREE.DirectionalLight(0xffffff,0.6);
		lights[1].position.set(30,0,10);
		lights[2] = new THREE.DirectionalLight(0xffffff,0.25);
		lights[2].position.set(-30,0,-10);
		scene.add(lights[0]);
		scene.add(lights[1]);
		scene.add(lights[2]);

		bead_forms.push({name:"1",geom:new tube(0.15,0.2,4,50)});
		bead_forms.push({name:"2",geom:new tube(0.15,0.2,10,5)});
		bead_forms.push({name:"3",geom:new tube(0.1,0.2,4,4)});
		bead_forms.push({name:"4",geom:new tube(0.15,0.2,10,10)});

		rope = new tube(3,0.03,10,50,null,'Нить');
		scene.add(rope.mesh);

		let beadAmount = 40;
		let degrees = 0;
		let angle = 360/beadAmount;

		$("#explorer-base-ul").append('<li id="'+rope.name+'">'+rope.name+"</li>");

		for(let i = 0; i < beadAmount; i++){
			let rnd_num = Math.floor(Math.random()*1);
			remember.push(rnd_num);
			// let option_texture = [null,beadTexture1,beadTexture2,beadTexture3,beadTexture4];

			let b = new tube(0.15,0.2,10,10,0,"Шар"+Number.parseInt(i+1),bead_forms[3].geom.geometry);
			b.mesh.rotation.y = Math.PI/2;

			let x = Math.cos(toRadians(degrees))*rope.radius;
			let y = -Math.sin(toRadians(degrees))*rope.radius;
			let z = 0;

			b.mesh.rotateX(toRadians(degrees)-Math.PI/2);
			b.mesh.position.set(x,y,z);
			scene.add(b.mesh);
			beads[i] = b;

			// if(option_texture[rnd_num] == null) b.mesh.material.color.setRGB(0.25,0,0.1);

			degrees += angle;

			$("#explorer-beads-ul").append('<li id="'+"Шар"+'-'+i+'">'+b.name+'</li>');
		}

		let active_objects_tab = $(".properties-tab-objects-type-name.active");

		$(".explorer-folder-items-list").slideToggle(0);
		$(".explorer-folder-item-objects-list").slideToggle(0);
		$(".properties-panel-content").slideToggle(0);

		$(".explorer-folder-hover-div").click(function(){
			$(this).parent().find(".explorer-folder-items-list").slideToggle(500);
		});
		$(".explorer-folder-item-hover-div").click(function(){
			$(this).parent().find(".explorer-folder-item-objects-list").slideToggle(500);
		});

		$(".properties-panel-header").click(function(){
			// $(".properties-panel-header.active").parent().find(".properties-panel-content").slideToggle(500);
			// $(".properties-panel-header").removeClass("active");
			$(this).parent().find(".properties-panel-content").slideToggle(500);
			$(this).toggleClass('active');
		});

		$(".properties-tab-objects-type-name").click(function(){
			$(".properties-tab-objects-type-name").removeClass('active');
			$(this).toggleClass("active");
			active_objects_tab = $(".properties-tab-objects-type-name.active");
			if($(this).attr("id") == 'properties-tab-all-objects'){
				$(".rope-only").hide();
				$(".beads-only").show();
				$(".all-only").show();
			}else if($(this).attr("id") == 'properties-tab-object-name'){
				if($("#properties-tab-object-name").html() == "Нить"){
					$(".rope-only").show();
					$(".beads-only").hide();
				}else{
					$(".rope-only").hide();
					$(".beads-only").show();
				}
				$(".all-only").hide();
			}
		});

		$("#explorer-base-ul li").on('mouseover', function(){
			rope.material.color.setHex(0x00ff00);
		});
		$("#explorer-base-ul li").on('mouseleave', function(){
			rope.material.color.setRGB(rope.color.r,rope.color.g,rope.color.b);
		});
		$("#explorer-base-ul li").click(function(){
			$("#explorer-base-ul li").removeClass('active');
			$("#explorer-beads-ul li").removeClass('active');
			$(this).toggleClass("active");
			$(this).toggleClass("active");
			// for(let bead of beads){
			// 	bead.active = false;
			// }
			// rope.active = !rope.active;
			$("#properties-tab-object-name").html($(this).html());
			$(".rope-only").show();
			$(".beads-only").hide();
			$(".all-only").hide();
			$('#properties-tab-object-name').addClass('active');
			$('#properties-tab-all-objects').removeClass('active');
			active_objects_tab = $(".properties-tab-objects-type-name.active");
		});

		$("#explorer-beads-ul li").on('mouseover', function(){
			let id = $(this).attr('id');
			let ind = id.slice(id.indexOf('-')+1);
			beads[ind].material.color.setHex(0x00ff00);
		});
		$("#explorer-beads-ul li").on('mouseleave', function(){
			let id = $(this).attr('id');
			let ind = id.slice(id.indexOf('-')+1);
			beads[ind].material.color.setRGB(beads[ind].color.r,beads[ind].color.g,beads[ind].color.b);
		});
		$("#explorer-beads-ul li").click(function(){
			let id = $(this).attr('id');
			let ind = id.slice(id.indexOf('-')+1);
			$("#explorer-base-ul li").removeClass('active');
			$("#explorer-beads-ul li").removeClass('active');
			$(this).toggleClass("active");
			// beads[ind].active = true;
			// rope.active = false;
			$("#properties-tab-object-name").html($(this).html());
			$(".rope-only").hide();
			$(".beads-only").show();
			$(".all-only").hide();
			$('#properties-tab-object-name').addClass('active');
			$('#properties-tab-all-objects').removeClass('active');
			active_objects_tab = $(".properties-tab-objects-type-name.active");
		});

		$("#textures-list .beads-only").click(function(){
			if($(active_objects_tab).attr('id') == 'properties-tab-all-objects'){
				let li_src = $(this).find("img").attr('src');
				let txt_name = li_src.split('/')[li_src.split('/').length-1].split(".")[0];
				for(let b of beads){
					b.changeTexture(textures[txt_name]);
				}
			}else if($(active_objects_tab).attr('id') == 'properties-tab-object-name'){
				let li_src = $(this).find("img").attr('src');
				let li_name = $("#properties-tab-object-name").html();
				let ind = li_name.slice(3)-1;
				let txt_name = li_src.split('/')[li_src.split('/').length-1].split(".")[0];
				beads[ind].changeTexture(textures[txt_name]);
			}
		});
		$("#textures-list .rope-only").click(function(){
			if($(active_objects_tab).attr('id') == 'properties-tab-all-objects'){
				let li_src = $(this).find("img").attr('src');
				let txt_name = li_src.split('/')[li_src.split('/').length-1].split(".")[0];
				rope.changeTexture(textures[txt_name]);
			}else if($(active_objects_tab).attr('id') == 'properties-tab-object-name'){
				let li_src = $(this).find("img").attr('src');
				let txt_name = li_src.split('/')[li_src.split('/').length-1].split(".")[0];
				rope.changeTexture(textures[txt_name]);
			}
		});
		$("#shapes-list li").click(function(){
			if($(active_objects_tab).attr('id') == 'properties-tab-all-objects'){
				let sh_ind = $(this).attr('value');
				for(let b of beads){
					b.changeForm(bead_forms[sh_ind].geom);
				}
			}else if($(active_objects_tab).attr('id') == 'properties-tab-object-name'){
				let li_name = $("#properties-tab-object-name").html();
				let b_ind = li_name.slice(3)-1;
				let sh_ind = $(this).attr('value');
				beads[b_ind].changeForm(bead_forms[sh_ind].geom);
			}
		});
		$(".slider-bar").on('input', function(){
			let r = $('#object-color-red-input').val();
			let g = $('#object-color-green-input').val();
			let b = $('#object-color-blue-input').val();
			let am = $('#all-objects-amount-input').val();
			if($(this).attr('id') == 'object-color-red-value'){
				$("#object-color-red-input").val($(this).val());
				r = $(this).val();
			}else if($(this).attr('id') == 'object-color-green-value'){
				$("#object-color-green-input").val($(this).val());
				g = $(this).val();
			}else if($(this).attr('id') == 'object-color-blue-value'){
				$("#object-color-blue-input").val($(this).val());
				b = $(this).val();
			}else if($(this).attr('id') == 'all-objects-amount-value'){
				$("#all-objects-amount-input").val($(this).val());
				am = $(this).val();
				recreateBeads($(this).val());
			}else if($(this).attr('id') == 'object-size-value'){
				$("#object-size-input").val($(this).val());
				if($(active_objects_tab).attr('id') == 'properties-tab-all-objects'){
					for(let i = 0; i < beads.length; i++){
						beads[i].radius = $(this).val()/1;
						beads[i].tube = $(this).val()*1.25;
						beads[i].changeForm(beads[i]);
					}
				}else if($(active_objects_tab).attr('id') == 'properties-tab-object-name'){
					let li_name = $("#properties-tab-object-name").html();
					let b_ind = li_name.slice(3)-1;
					if(li_name != "Нить"){
						beads[b_ind].radius = $(this).val()/1;
						beads[b_ind].tube = $(this).val()*1.25;
						beads[b_ind].changeForm(beads[b_ind]);
					}else {
						rope.radius = $(this).val()*10;
						rope.changeForm(rope);
						recalculateBeadsPosition();
					}
				}
			}
			if($(this).attr('id') != 'object-size-value'){
				$("#objects-color-preview").css('background','rgb('+r+','+g+','+b+')');
				if($(active_objects_tab).attr('id') == 'properties-tab-all-objects'){
					for(let i = 0; i < beads.length; i++){
						beads[i].material.color.setRGB(map(r,0,255,0,1),map(g,0,255,0,1),map(b,0,255,0,1));
						beads[i].color = new THREE.Color(map(r,0,255,0,1),map(g,0,255,0,1),map(b,0,255,0,1));
					}
				}else if($(active_objects_tab).attr('id') == 'properties-tab-object-name'){
					let li_name = $("#properties-tab-object-name").html();
					let b_ind = li_name.slice(3)-1;
					if(li_name != "Нить"){
						beads[b_ind].material.color.setRGB(map(r,0,255,0,1),map(g,0,255,0,1),map(b,0,255,0,1));
						beads[b_ind].color = new THREE.Color(map(r,0,255,0,1),map(g,0,255,0,1),map(b,0,255,0,1));
					}else {
						rope.material.color.setRGB(map(r,0,255,0,1),map(g,0,255,0,1),map(b,0,255,0,1));
						rope.color = new THREE.Color(map(r,0,255,0,1),map(g,0,255,0,1),map(b,0,255,0,1));;
					}
				}
			}

			function recalculateBeadsPosition(){
				degrees = 0;
				for(let i = 0; i < beadAmount; i++){
					let b = beads[i];
					b.mesh.rotation.y = Math.PI/2;

					let x = Math.cos(toRadians(degrees))*rope.radius;
					let y = -Math.sin(toRadians(degrees))*rope.radius;
					let z = 0;

					b.mesh.rotateX(toRadians(degrees)-Math.PI/2);
					b.mesh.position.set(x,y,z);

					degrees += angle;
				}
			}

			function recreateBeads(am){
				deleteBeads();

				beadAmount = am;
				degrees = 0;
				angle = 360/beadAmount;
				for(let i = 0; i < beadAmount; i++){
					let rnd_num = Math.floor(Math.random()*1);
					remember.push(rnd_num);
					// let option_texture = [null,beadTexture1,beadTexture2,beadTexture3,beadTexture4];

					let b = new tube(1,1,10,10,0,"Шар"+Number.parseInt(i+1),bead_forms[3].geom.geometry);
					b.mesh.rotation.y = Math.PI/2;

					let x = Math.cos(toRadians(degrees))*rope.radius;
					let y = -Math.sin(toRadians(degrees))*rope.radius;
					let z = 0;

					b.mesh.rotateX(toRadians(degrees)-Math.PI/2);
					b.mesh.position.set(x,y,z);
					scene.add(b.mesh);
					beads[i] = b;

					// if(option_texture[rnd_num] == null) b.mesh.material.color.setRGB(0.25,0,0.1);

					degrees += angle;

					$("#explorer-beads-ul").append('<li id="'+"Шар"+'-'+i+'">'+b.name+'</li>');
				}
				$("#explorer-beads-ul li").on('mouseover', function(){
					let id = $(this).attr('id');
					let ind = id.slice(id.indexOf('-')+1);
					beads[ind].material.color.setHex(0x00ff00);
				});
				$("#explorer-beads-ul li").on('mouseleave', function(){
					let id = $(this).attr('id');
					let ind = id.slice(id.indexOf('-')+1);
					beads[ind].material.color.setRGB(beads[ind].color.r,beads[ind].color.g,beads[ind].color.b);
				});
				$("#explorer-beads-ul li").click(function(){
					let id = $(this).attr('id');
					let ind = id.slice(id.indexOf('-')+1);
					$("#explorer-base-ul li").removeClass('active');
					$("#explorer-beads-ul li").removeClass('active');
					$(this).toggleClass("active");
					// beads[ind].active = true;
					// rope.active = false;
					$("#properties-tab-object-name").html($(this).html());
					$(".rope-only").hide();
					$(".beads-only").show();
					$(".all-only").hide();
					$('#properties-tab-object-name').addClass('active');
					$('#properties-tab-all-objects').removeClass('active');
					active_objects_tab = $(".properties-tab-objects-type-name.active");
				});
			}

			function deleteBeads(){
				for(let i = 0; i < beadAmount; i++){
					scene.remove(beads[i].mesh);
					beads[i].mesh.geometry.dispose();
					beads[i].mesh.material.dispose();
					beads[i].mesh = undefined;
				}
				beads = [];
				$("#explorer-beads-ul").html('');
			}

		});

		// console.log(JSON.stringify(remember));

		camera.position.set(0,0,6);

		requestAnimationFrame(render);
		
		function render(){
			controls.update();
			renderer.render(scene,camera);
			requestAnimationFrame(render);

			// if(rope.active) rope.material.color.setHex(0x00ff00);
			// else rope.material.color.setHex(0xffffff);

			// for(let el of beads){
			// 	if(el.active) el.material.color.setHex(0x00ff00);
			// 	else el.material.color.setHex(0xffffff);
			// }
		};

		window.addEventListener('resize', function () {
			camera.aspect = $("#preview-canvas").width()/$("#preview-canvas").height();
			camera.updateProjectionMatrix();
			renderer.setSize($("#preview-canvas").width(), $("#preview-canvas").height());
		}, false);

		window.addEventListener("keydown", function(e){
			if(e.keyCode == 17){
				if($(active_objects_tab).attr('id') == 'properties-tab-object-name' && $("#properties-tab-object-name").html() != "..." && $("#properties-tab-object-name").html() != "Нить"){
					let r = $("#object-color-red-input").val();
					let g = $("#object-color-green-input").val();
					let b = $("#object-color-blue-input").val();
					let li_name = $("#properties-tab-object-name").html();
					let b_ind = li_name.slice(3)-1;
					beads[b_ind].radius = $("#object-size-input").val()/1;
					beads[b_ind].tube = $("#object-size-input").val()*1.25;
					beads[b_ind].changeForm(beads[b_ind]);
					beads[b_ind].material.color.setRGB(map(r,0,255,0,1),map(g,0,255,0,1),map(b,0,255,0,1));
					beads[b_ind].color = new THREE.Color(map(r,0,255,0,1),map(g,0,255,0,1),map(b,0,255,0,1));
				}
			}
		});
	}

	function tube(r,t,rs,ts,texture,name,geom){
		this.name = name;
		this.texture = texture;
		this.color = new THREE.Color(1,1,1);
		this.radius = r;
		this.tube = t;
		this.radialSegments = rs;
		this.tubularSegments = ts;
		this.arc = Math.PI*2;
		if(geom) this.geometry = geom;
		else this.geometry = new THREE.TorusGeometry(this.radius,this.tube,this.radialSegments,this.tubularSegments,this.arc);
		if(texture) this.material = new THREE.MeshLambertMaterial({color:this.color,map:this.texture});
		else this.material = new THREE.MeshPhongMaterial({color:this.color});
		this.mesh = new THREE.Mesh(this.geometry,this.material);

		this.changeForm = function(obj){
			this.radius = obj.radius;
			this.tube = obj.tube;
			this.radialSegments = obj.radialSegments;
			this.tubularSegments = obj.tubularSegments;
			this.mesh.geometry = new THREE.TorusGeometry(this.radius,this.tube,this.radialSegments,this.tubularSegments,this.arc);
		}

		this.changeTexture = function(txt){
			this.material.map = txt;
			this.material.needsUpdate = true;
		}
	}

	function toRadians(degrees){
		return degrees*(Math.PI/180);
	}

	function map(x,a,b,c,d){
		return y = (x-a)/(b-a)*(d-c)+c;
	}
