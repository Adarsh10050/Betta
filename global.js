window.addEventListener('DOMContentLoaded', () => {
  // --- Configuration ---
  const GLOBE_RADIUS = 5;
  const GLOBE_ROTATION_SPEED = 0.0005;
  const LINE_ANIMATION_DURATION = 1.5;
  const LINE_STAGGER = 0.1;
  const NUMBER_OF_LINES = 15;
  const POINT_COLOR = 0x000000;
  const LINE_COLOR = 0x4488ff;

  // --- Scene & Canvas ---
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return console.error("Canvas not found");
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // --- Camera ---
  const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 15;
  scene.add(camera);

  // --- Controls ---
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.enablePan = false;
  controls.minDistance = 7;
  controls.maxDistance = 30;

  // --- Lights ---
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
  dirLight.position.set(5, 5, 5);
  scene.add(dirLight);

  // --- Globe ---
  const globeGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
  const globeMaterial = new THREE.MeshStandardMaterial({
    map: new THREE.TextureLoader().load('https://dariush-hassani.github.io/react-threejs-globe/texture.png'),
    metalness: 0.1,
    roughness: 0.8
  });
  const globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
  scene.add(globeMesh);

  // --- Atmosphere ---
  const atmosphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.05, 64, 64);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(0.5, 0.7, 1.0, 1.0) * intensity * 0.4;
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true
  });
  const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  scene.add(atmosphereMesh);

  // --- Points ---
  const locations = [
    { lat: 34.05, lon: -118.24 }, { lat: 40.71, lon: -74.00 },
    { lat: 48.85, lon: 2.35 }, { lat: 51.50, lon: -0.12 },
    { lat: -33.86, lon: 151.20 }, { lat: 35.68, lon: 139.69 },
    { lat: -23.55, lon: -46.63 }, { lat: 19.43, lon: -99.13 },
    { lat: 39.90, lon: 116.40 }, { lat: 6.52, lon: 3.37 },
    { lat: 4.71, lon: -74.07 }
  ];
  function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + 180) * Math.PI / 180;
    return new THREE.Vector3(
      -radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.cos(phi),
      radius * Math.sin(phi) * Math.sin(theta)
    );
  }
  const points3D = locations.map(loc => latLonToVector3(loc.lat, loc.lon, GLOBE_RADIUS));
  const pointsMaterial = new THREE.PointsMaterial({ color: POINT_COLOR, size: 0.08 });
  const pointsGeometry = new THREE.BufferGeometry().setFromPoints(points3D);
  globeMesh.add(new THREE.Points(pointsGeometry, pointsMaterial));

  // --- Lines ---
  const linesGroup = new THREE.Group();
  globeMesh.add(linesGroup);
  function createCurve(startVec, endVec) {
    const midPoint = startVec.clone().add(endVec).normalize().multiplyScalar(GLOBE_RADIUS + startVec.distanceTo(endVec)*0.3);
    const curve = new THREE.QuadraticBezierCurve3(startVec, midPoint, endVec);
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
    geometry.setDrawRange(0, 0);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: LINE_COLOR, transparent: true, opacity: 0.7 }));
    linesGroup.add(line);
    return line;
  }
  const lines = [];
  for(let i=0;i<NUMBER_OF_LINES;i++){
    let start = Math.floor(Math.random()*points3D.length);
    let end = Math.floor(Math.random()*points3D.length);
    while(end===start) end = Math.floor(Math.random()*points3D.length);
    lines.push(createCurve(points3D[start], points3D[end]));
  }

  // --- Line Animation ---
  let tl, linesAnimated = false;
  canvas.addEventListener('mouseenter', () => {
    if(linesAnimated) return;
    tl = gsap.timeline({repeat:-1, delay:0.5});
    lines.forEach((line,i)=>{
      const drawRange = {count:0};
      const total = line.geometry.attributes.position.count;
      tl.to(drawRange,{
        count: total,
        duration: LINE_ANIMATION_DURATION,
        ease: "power1.inOut",
        onUpdate: ()=>line.geometry.setDrawRange(0, Math.floor(drawRange.count)),
        onComplete: ()=>{ gsap.to(line.material,{opacity:0,duration:0.5,delay:0.2,onComplete:()=>{line.geometry.setDrawRange(0,0);line.material.opacity=0.7}});}
      }, i*LINE_STAGGER);
    });
    linesAnimated = true;
  });
  canvas.addEventListener('mouseleave', ()=>{
    if(tl) tl.kill();
    lines.forEach(line=>{line.geometry.setDrawRange(0,0); line.material.opacity=0.7;});
    linesAnimated=false;
  });

  // --- Animate Loop ---
  function animate(){
    requestAnimationFrame(animate);
    globeMesh.rotation.y += GLOBE_ROTATION_SPEED;
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // --- Resize Handler ---
  window.addEventListener('resize', ()=>{
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.aspect = canvas.clientWidth/canvas.clientHeight;
    camera.updateProjectionMatrix();
  });
});
 