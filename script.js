const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const namesInput = document.getElementById("namesInput");

let currentRotation = 0;

function drawWheel() {
    const names = namesInput.value.split('\n').filter(n => n.trim() !== "");
    if (names.length === 0) return;

    const arc = (2 * Math.PI) / names.length;
    const colors = ["#4CAF50", "#F44336", "#2196F3", "#FFEB3B", "#9C27B0", "#FF9800"];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    names.forEach((name, i) => {
        const angle = i * arc;
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, angle, angle + arc);
        ctx.fill();

        // Texte
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "20px Bold Arial";
        ctx.fillText(name, 230, 10);
        ctx.restore();
    });
}

spinBtn.addEventListener("click", () => {
    const randomSpin = Math.floor(Math.random() * 360) + 3600; // 10 tours min
    currentRotation += randomSpin;
    canvas.style.transition = "transform 4s cubic-bezier(0.15, 0, 0.15, 1)";
    canvas.style.transform = `rotate(${currentRotation}deg)`;
});

namesInput.addEventListener("input", drawWheel);
drawWheel();
