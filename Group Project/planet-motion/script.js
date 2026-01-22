const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const G = 1; // Gravitational constant
const M = 100; // Sun mass
const m = 1; // Planet mass
const dt = 0.01; // Time step

// Sun position (fixed)
const sun = { x: 250, y: 250 };

// Planet initial position and velocity
let planet = { x: 350, y: 250, vx: 0, vy: 1.5 };

function update() {
    // Calculate distance
    const dx = sun.x - planet.x;
    const dy = sun.y - planet.y;
    const r = Math.sqrt(dx * dx + dy * dy);

    // Force magnitude
    const F = G * M * m / (r * r);

    // Acceleration
    const ax = (F / m) * (dx / r);
    const ay = (F / m) * (dy / r);

    // Update velocity
    planet.vx += ax * dt;
    planet.vy += ay * dt;

    // Update position
    planet.x += planet.vx * dt;
    planet.y += planet.vy * dt;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sun
    ctx.beginPath();
    ctx.arc(sun.x, sun.y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'yellow';
    ctx.fill();

    // Draw planet
    ctx.beginPath();
    ctx.arc(planet.x, planet.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = 'blue';
    ctx.fill();
}

function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}

animate();