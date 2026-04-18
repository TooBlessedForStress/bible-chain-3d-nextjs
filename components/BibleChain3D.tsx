<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>THE ETERNAL CHAIN</title>
  <style>
    body { margin:0; overflow:hidden; background:#000; font-family:Georgia, serif; color:#eee; }
    #sidebar { position:absolute; top:0; right:0; width:380px; height:100%; background:rgba(15,15,15,0.96); border-left:1px solid #555; padding:40px 30px; overflow-y:auto; z-index:100; box-shadow: -15px 0 40px rgba(0,0,0,0.8); }
    button { background:#fff; color:#000; border:none; padding:16px; margin:8px 0; border-radius:12px; font-weight:700; cursor:pointer; width:100%; transition:0.2s; }
    button:hover { background:#ddd; transform:scale(1.02); }
  </style>
</head>
<body>
  <div id="sidebar">
    <h1 style="font-size:28px; margin:0 0 10px 0;">THE ETERNAL CHAIN</h1>
    <p style="opacity:0.7; margin-bottom:30px;">Mint Bible verses permanently on Solana</p>

    <p style="text-xs opacity:0.6; margin-bottom:10px;">SELECT VERSION</p>
    <div style="display:flex; gap:8px; margin-bottom:30px;">
      <button onclick="selectVersion(0)">KJV</button>
      <button onclick="selectVersion(1)">ASV</button>
      <button onclick="selectVersion(2)">WEB</button>
    </div>

    <div style="background:#222; padding:20px; border-radius:12px; min-height:160px;">
      <div id="preview-version" style="font-size:13px; opacity:0.6;">KJV</div>
      <div id="preview-ref" style="font-size:22px; font-weight:700; margin:8px 0;">Genesis 1:1</div>
      <div id="preview-text" style="line-height:1.5;">In the beginning God created the heaven and the earth.</div>
    </div>

    <button onclick="createBlock()" style="margin-top:30px;">CONNECT WALLET &amp; CREATE BLOCK</button>
  </div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
  <script>
    let scene, camera, renderer, blockMeshes = [];
    let autoRotate = true;

    const exampleBlocks = [
      { ref: "Genesis 1:1" },
      { ref: "John 3:16" },
      { ref: "Psalm 23:1" },
      { ref: "Romans 8:28" },
      { ref: "Philippians 4:13" },
      { ref: "Matthew 6:33" }
    ];

    function init() {
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      // Cinematic lighting
      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      const keyLight = new THREE.PointLight(0xffffff, 2.2);
      keyLight.position.set(0, 80, 60);
      scene.add(keyLight);

      // Vertical 3D Cross
      const cross = new THREE.Group();
      const v = new THREE.Mesh(new THREE.BoxGeometry(6, 160, 6), new THREE.MeshPhongMaterial({color:0xeeeeee, emissive:0xaaaaaa, transparent:true, opacity:0.25}));
      const h = new THREE.Mesh(new THREE.BoxGeometry(80, 6, 6), new THREE.MeshPhongMaterial({color:0xeeeeee, emissive:0xaaaaaa, transparent:true, opacity:0.25}));
      h.position.y = 32;
      cross.add(v); cross.add(h);
      cross.position.z = -85;
      cross.rotation.y = 0.15;
      scene.add(cross);

      // Blocks with pulsing
      const radius = 14;
      exampleBlocks.forEach((block, i) => {
        const angle = i * 0.29;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius * 0.7;
        const y = i * 2.6 - 7.8;

        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(2.3, 2.3, 2.3),
          new THREE.MeshPhongMaterial({color:0xffffff, emissive:0xcccccc, shininess:130})
        );
        mesh.position.set(x, y, z);
        scene.add(mesh);
        blockMeshes.push(mesh);
      });

      camera.position.set(0, 25, 55);
      camera.lookAt(0, 0, 0);

      animate();
    }

    function animate() {
      requestAnimationFrame(animate);

      // Slow elegant pulse
      const pulse = 1 + Math.sin(Date.now() / 1200) * 0.06;
      blockMeshes.forEach(m => m.scale.setScalar(pulse));

      if (autoRotate) scene.rotation.y += 0.0005;

      renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Sidebar functions
    function selectVersion(i) {
      alert("Version " + (i+1) + " selected (demo)");
    }
    function createBlock() {
      alert("Wallet connect + block creation coming soon");
    }

    init();
  </script>
</body>
</html>
