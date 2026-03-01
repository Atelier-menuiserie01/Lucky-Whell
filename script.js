const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const namesInput = document.getElementById("namesInput");
const wheelContainer = document.getElementById("wheel-container");
const winnerOverlay = document.getElementById("winner-overlay");
const winnerName = document.getElementById("winner-name");

let currentRotation = 0;
let isSpinning = false;

function drawWheel() {
    const names = namesInput.value.split('\n').filter(n => n.trim() !== "");
    if (names.length === 0) return;
    const arc = (2 * Math.PI) / names.length;
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#F333FF", "#FF33A1", "#33FFF5"];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    names.forEach((name, i) => {
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath(); ctx.moveTo(250, 250);
        ctx.arc(250, 250, 245, i * arc, (i + 1) * arc);
        ctx.fill(); ctx.stroke();
        ctx.save(); ctx.translate(250, 250);
        ctx.rotate(i * arc + arc / 2); ctx.textAlign = "right";
        ctx.fillStyle = "white"; ctx.font = "bold 22px sans-serif";
        ctx.fillText(name, 230, 10); ctx.restore();
    });
}

spinBtn.addEventListener("click", () => {
    if (isSpinning) return;
    const names = namesInput.value.split('\n').filter(n => n.trim() !== "");
    if (names.length === 0) return;

    isSpinning = true;
    const spinTime = 5000; // 5 secondes de rotation
    const rotation = Math.floor(Math.random() * 360) + 3600;
    currentRotation += rotation;

    canvas.style.transition = `transform ${spinTime}ms cubic-bezier(0.1, 0, 0.1, 1)`;
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        // 1. Calcul du gagnant
        const angleParSegment = 360 / names.length;
        const actualRotation = currentRotation % 360;
        const winnerIndex = Math.floor(((360 - actualRotation) % 360) / angleParSegment);
        const winningName = names[winnerIndex];

        // 2. Disparition de la roue et apparition du nom
        wheelContainer.classList.add("hidden");
        
        setTimeout(() => {
            winnerName.innerText = winningName;
            winnerOverlay.style.display = "flex";
            
            // 3. Explosion de confettis !
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });

            // 4. Retour à la normale après 10 secondes
            setTimeout(() => {
                winnerOverlay.style.display = "none";
                wheelContainer.classList.remove("hidden");
                isSpinning = false;
            }, 10000); 
        }, 500);

    }, spinTime);
});

namesInput.addEventListener("input", drawWheel);
drawWheel();
