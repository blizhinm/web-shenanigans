	window.onload = function(){
		let camera, scene, controls, renderer, rope;
		let bead_forms = [];
		let beads = [];
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize($("#project-preview").width(), $("#project-preview").height());
		renderer.setClearColor(0x151515, 1);
		$("#project-preview").append(renderer.domElement);
		camera = new THREE.PerspectiveCamera(65, $("#project-preview").width()/$("#project-preview").height(),0.1,1000);
		scene = new THREE.Scene();
		controls = new THREE.TrackballControls(camera, renderer.domElement);
		controls.rotateSpeed = 1;
		controls.zoomSpeed = 0.11;
		controls.noPan = true;
		// controls.noZoom = true;

		let textureLoader = new THREE.TextureLoader();
		let ropeTexture = textureLoader.load("assets/textures/rope1.png", function(txr){
			txr.wrapT = THREE.RepeatWrapping;
			txr.wrapS = THREE.RepeatWrapping;
			txr.repeat.set(50, 2);
		});
		let beadTexture1 = textureLoader.load("assets/textures/wood1.jpg", function(txr){
			txr.wrapT = THREE.RepeatWrapping;
			txr.wrapS = THREE.RepeatWrapping;
			txr.repeat.set(2,2);
		});
		let beadTexture2 = textureLoader.load("assets/textures/wood2.jpg", function(txr){
			txr.wrapT = THREE.RepeatWrapping;
			txr.wrapS = THREE.RepeatWrapping;
			txr.repeat.set(2,2);
		});
		let beadTexture3 = textureLoader.load("assets/textures/wood3.jpg", function(txr){
			txr.wrapT = THREE.RepeatWrapping;
			txr.wrapS = THREE.RepeatWrapping;
			txr.repeat.set(2,2);
		});
		let beadTexture4 = textureLoader.load("assets/textures/wood4.jpg", function(txr){
			txr.wrapT = THREE.RepeatWrapping;
			txr.wrapS = THREE.RepeatWrapping;
			txr.repeat.set(2,2);
		});

		let remember = [1,1,1,3,0,4,1,0,2,3,4,1,4,1,1,4,3,3,4,1,4,0,1,2,2,2,2,0,0,0,1,2,4,2,2,2,0,0,3,3];

		let lights = [];
		lights[0] = new THREE.AmbientLight(0xffffff, 0.25);
		lights[1] = new THREE.DirectionalLight(0xffffff,0.5);
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

		rope = new tube(3,0.03,10,50,ropeTexture,'Нить');
		scene.add(rope.mesh);

		let beadAmount = 40;
		let degrees = 0;
		let angle = 360/beadAmount;

		// $("#explorer-base-ul").append('<li id="'+rope.name+'">'+rope.name+"</li>");

		for(let i = 0; i < beadAmount; i++){
			let option_texture = [null,beadTexture1,beadTexture2,beadTexture3,beadTexture4];

			let b = new tube(0.15,0.2,10,10,option_texture[remember[i]],"Шар"+i,bead_forms[3].geom.geometry);
			b.mesh.rotation.y = Math.PI/2;

			let x = Math.cos(toRadians(degrees))*rope.radius;
			let y = -Math.sin(toRadians(degrees))*rope.radius;
			let z = 0;

			b.mesh.rotateX(toRadians(degrees)-Math.PI/2);
			b.mesh.position.set(x,y,z);
			scene.add(b.mesh);
			beads[i] = b;

			if(option_texture[remember[i]] == null) b.mesh.material.color.setRGB(0.25,0,0.1);

			degrees += angle;

		}

		// $("#explorer-base-ul li").on('mouseover', function(){
		// 	if(!rope.active) rope.material.color.setHex(0x00ff00);
		// });
		// $("#explorer-base-ul li").on('mouseleave', function(){
		// 	if(!rope.active) rope.material.color.setHex(0xffffff);
		// });
		// $("#explorer-base-ul li").click(function(){
		// 	$("#explorer-base-ul li").removeClass('active');
		// 	$("#explorer-beads-ul li").removeClass('active');
		// 	$(this).toggleClass("active");
		// 	$(this).toggleClass("active");
		// 	for(let bead of beads){
		// 		bead.active = false;
		// 	}
		// 	rope.active = true;
		// 	$("#properties-object-name").html($(this).html());
		// });

		// $("#explorer-beads-ul li").on('mouseover', function(){
		// 	let id = $(this).attr('id');
		// 	let ind = id.slice(id.indexOf('-')+1);
		// 	if(!beads[ind].active) beads[ind].material.color.setHex(0x00ff00);
		// });
		// $("#explorer-beads-ul li").on('mouseleave', function(){
		// 	let id = $(this).attr('id');
		// 	let ind = id.slice(id.indexOf('-')+1);
		// 	if(!beads[ind].active) beads[ind].material.color.setHex(0xffffff);
		// });
		// $("#explorer-beads-ul li").click(function(){
		// 	let id = $(this).attr('id');
		// 	let ind = id.slice(id.indexOf('-')+1);
		// 	$("#explorer-base-ul li").removeClass('active');
		// 	$("#explorer-beads-ul li").removeClass('active');
		// 	$(this).toggleClass("active");
		// 	beads[ind].active = true;
		// 	rope.active = false;
		// 	$("#properties-object-name").html($(this).html());
		// });

		camera.position.set(0,0,6);

		requestAnimationFrame(render);
		
		function render(){
			controls.update();
			renderer.render(scene,camera);
			requestAnimationFrame(render);

		};

		window.addEventListener('resize', function () {
			camera.aspect = $("#project-preview").width()/$("#project-preview").height();
			camera.updateProjectionMatrix();
			renderer.setSize($("#project-preview").width(), $("#project-preview").height());
		}, false);
	}

	function tube(r,t,rs,ts,texture,name,geom){
		this.name = name;
		this.texture = texture;
		this.color = 0xffffff;
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
	}

	function toRadians(degrees){
		return degrees*(Math.PI/180);
	}

яя