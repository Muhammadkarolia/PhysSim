import { Body } from "./body.js";
import { computeForces } from "./physics.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const massSlider = document.getElementById("massSlider");
document.getElementById("start").onclick = () => running = true;
document.getElementById("pause").onclick = () => running = false;
document.getElementById("reset").onclick = () => {
    bodies = [];
};

let bodies = [];
let running = false;
let dt = 0.02; // timestep

let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let mouseX = 0;
let mouseY = 0;

const velocityScale = 0.05; // adjust for sensitivity

function loop() {
    if (running) {
        computeForces(bodies);

        for (let body of bodies) {
            body.update(dt);
        }

        handleCollisions();
    }

    draw();
    requestAnimationFrame(loop);
}

function handleCollisions() {
    for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {

            const dx = bodies[j].x - bodies[i].x;
            const dy = bodies[j].y - bodies[i].y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < bodies[i].radius + bodies[j].radius) {

                const totalMass = bodies[i].mass + bodies[j].mass;

                // Momentum conservation
                bodies[i].vx =
                    (bodies[i].vx * bodies[i].mass +
                     bodies[j].vx * bodies[j].mass) / totalMass;

                bodies[i].vy =
                    (bodies[i].vy * bodies[i].mass +
                     bodies[j].vy * bodies[j].mass) / totalMass;

                bodies[i].mass = totalMass;
                bodies[i].radius = Math.sqrt(totalMass);

                bodies.splice(j, 1);
                j--; // important when removing from array
            }
        }
    }
}

function draw() {

    // Always clear first
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let body of bodies) {

        // Draw body
        body.draw(ctx);

        // Draw velocity vector (green)
        ctx.beginPath();
        ctx.moveTo(body.x, body.y);
        ctx.lineTo(body.x + body.vx * 5, body.y + body.vy * 5);
        ctx.strokeStyle = "green";
        ctx.stroke();

        // Draw force vector (red)
        ctx.beginPath();
        ctx.moveTo(body.x, body.y);
        ctx.lineTo(body.x + body.fx * 0.01, body.y + body.fy * 0.01);
        ctx.strokeStyle = "red";
        ctx.stroke();
    }

    // preview for when adding a mass
    if (isDragging) {
    ctx.beginPath();
    ctx.moveTo(dragStartX, dragStartY);
    ctx.lineTo(mouseX, mouseY);
    ctx.strokeStyle = "yellow";
    ctx.stroke();

    // Preview circle
    ctx.beginPath();
    ctx.arc(dragStartX, dragStartY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
}
}

loop();


// --------------------------------------------------------------------------------------
// Adding objects 
canvas.addEventListener("mousedown", (e) => {
    const rect = canvas.getBoundingClientRect();
    dragStartX = e.clientX - rect.left;
    dragStartY = e.clientY - rect.top;
    isDragging = true;
});

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
});

canvas.addEventListener("mouseup", () => {
    if (!isDragging) return;

    isDragging = false;

    const dx = mouseX - dragStartX;
    const dy = mouseY - dragStartY;

    const dragDistance = Math.sqrt(dx*dx + dy*dy);

    if (dragDistance < 5) return; // ignore tiny drags

    const vx = (dragStartX - mouseX) * velocityScale;
    const vy = (dragStartY - mouseY) * velocityScale;

    const mass = parseFloat(massSlider.value);

    const newBody = new Body(
        dragStartX,
        dragStartY,
        vx,
        vy,
        mass
    );

    bodies.push(newBody);
});
