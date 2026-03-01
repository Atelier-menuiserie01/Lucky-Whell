const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const adminPanel = document.getElementById("admin-panel");
const lockIcon = document.getElementById("lock-icon");
const saveBtn = document.getElementById("saveBtn");

let currentRotation = 0;
let isSpinning = false;
let config = {
    pass: "1234",
    names: [],
    duration: 5,
    colors: ["#ff0055", "#ff9900"]
};

// Ouvrir/Fermer le panneau
lockIcon.onclick = () => adminPanel.classList.toggle("hidden-panel");

saveBtn.onclick = () => {
    config.names = document.getElementById("namesInput").value.split('\n').filter(n => n.trim() !== "");
    config.duration = document.getElementById("spinDuration").value;
    config.colors = [document.getElementById("color1").value, document.getElementById("color2").value];
    config.pass = document.getElementById("adminPass").value;
    
    drawWheel();
    adminPanel.classList.add("hidden-panel");
};

function drawWheel() {
    const names = config.names.length > 0 ? config.names : ["Ajoute", "des", "noms"];
    const arc = (2 * Math.PI) / names.length;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    names.forEach((name, i) => {
        ctx.fillStyle = config.colors[i % config.colors.length];
        ctx.beginPath(); ctx.moveTo(250, 250);
        ctx.arc(250, 250, 245, i * arc, (i + 1) * arc);
        ctx.fill();
        
        ctx.save(); ctx.translate(250, 250);
        ctx.rotate(i * arc + arc / 2);
        ctx.textAlign = "right"; ctx.fillStyle = "white";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(name, 230, 10); ctx.restore();
    });
}

spinBtn.onclick = () => {
    if (isSpinning) return;
    isSpinning = true;

    const rotation = Math.floor(Math.random() * 360) + 3600;
    currentRotation += rotation;

    canvas.style.transition = `transform ${config.duration}s cubic-bezier(0.1, 0, 0.1, 1)`;
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        const angleParSegment = 360 / config.names.length;
        const winnerIndex = Math.floor(((360 - (currentRotation % 360)) % 360) / angleParSegment);
        const winner = config.names[winnerIndex];

        document.getElementById("wheel-container").classList.add("hidden-wheel");
        
        setTimeout(() => {
            document.getElementById("winner-name").innerText = winner;
            document.getElementById("winner-overlay").style.display = "flex";
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

            setTimeout(() => {
                document.getElementById("winner-overlay").style.display = "none";
                document.getElementById("wheel-container").classList.remove("hidden-wheel");
                isSpinning = false;
            }, 10000);
        }, 600);
    }, config.duration * 1000);
};

// Initialisation
document.getElementById("saveBtn").click();
