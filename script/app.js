// Import necessary classes from Three.js
const { Scene, PerspectiveCamera, WebGLRenderer, PlaneGeometry, MeshBasicMaterial, Mesh, GridHelper, Clock } = THREE;

// --- Initial Setup ---
const scene = new Scene();
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new WebGLRenderer({ 
    canvas: document.getElementById('wireframe-grid'),
    alpha: true // Transparent background
});
renderer.setSize(window.innerWidth, window.innerHeight);

const clock = new Clock();

// --- Create Wavy Grid 1 (Magenta) ---
const geometry1 = new PlaneGeometry(100, 100, 50, 50);
const material1 = new MeshBasicMaterial({ 
    color: 0xF000FF, // Magenta color
    wireframe: true,
    transparent: true,
    opacity: 0.3 
});
const plane1 = new Mesh(geometry1, material1);
plane1.rotation.x = -Math.PI / 3;
plane1.position.y = -5;
scene.add(plane1);

// --- Create Wavy Grid 2 (Cyan) ---
const geometry2 = new PlaneGeometry(150, 150, 70, 70); // Più grande e più segmenti
const material2 = new MeshBasicMaterial({
    color: 0x00FFFF, // Cyan color
    wireframe: true,
    transparent: true,
    opacity: 0.2 // Ancora più trasparente
});
const plane2 = new Mesh(geometry2, material2);
plane2.rotation.x = -Math.PI / 3;
plane2.position.y = -10; // Più in basso
plane2.position.z = -20; // Più indietro
scene.add(plane2);


// Camera Position
camera.position.z = 20;
camera.position.y = 5;

// --- Animation Function ---
function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // --- Animazione Griglia 1 (Magenta) ---
    const positions1 = plane1.geometry.attributes.position;
    for (let i = 0; i < positions1.count; i++) {
        const x = positions1.getX(i);
        const y = positions1.getY(i);
        const wave = Math.sin(x * 0.2 + time) * 1.5 + Math.sin(y * 0.3 + time) * 1.5;
        positions1.setZ(i, wave);
    }
    plane1.geometry.attributes.position.needsUpdate = true;
    
    // Effetto tunnel per griglia 1
    plane1.position.z += 0.02;
    if(plane1.position.z > 30) {
        plane1.position.z = -20;
    }

    // --- Animazione Griglia 2 (Cyan) ---
    const positions2 = plane2.geometry.attributes.position;
    for (let i = 0; i < positions2.count; i++) {
        const x = positions2.getX(i);
        const y = positions2.getY(i);
        // Onde diverse, più lente
        const wave = Math.sin(x * 0.1 + time * 0.5) * 2 + Math.sin(y * 0.15 + time * 0.5) * 2;
        positions2.setZ(i, wave);
    }
    plane2.geometry.attributes.position.needsUpdate = true;
    
    // Rotazione lenta per griglia 2
    plane2.rotation.z += 0.0005;

    renderer.render(scene, camera);
}

// --- Window Resize Handling ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation
animate();

// --- UI/UX IMPROVEMENT ---
window.addEventListener('load', () => {
    document.body.classList.remove('body-preload');
});