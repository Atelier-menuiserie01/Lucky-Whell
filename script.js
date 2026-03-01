const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const namesInput = document.getElementById("namesInput");
const winnerDisplay = document.getElementById("winner-display");

let currentRotation = 0;
let isSpinning = false;
let segments = [];

function drawWheel() {
    const names = namesInput.value.split('\n').filter(n => n.trim() !== "");
    if (names.length === 0) return;
    
    segments = names;
    const arc = (2 * Math.PI) / segments.length;
    const colors = ["#e74c3c", "#3498db", "#f1c40f", "#2ecc71", "#9b59b6", "#e67e22", "#1abc9c", "#e332d2"];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    segments.forEach((name, i) => {
        const angle = i * arc;
        
        // Segment
        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 245, angle, angle + arc);
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.2)";
        ctx.stroke();

        // Texte
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(name, 230, 10);
        ctx.restore();
    });
}

spinBtn.addEventListener("click", () => {
    if (isSpinning || segments.length === 0) return;
    
    isSpinning = true;
    winnerDisplay.innerText = "";
    
    // On tourne beaucoup (entre 5 et 10 tours) + un angle aléatoire
    const rotationSupplementaire = Math.floor(Math.random() * 360) + 2880; 
    currentRotation += rotationSupplementaire;
    
    canvas.style.transition = "transform 5s cubic-bezier(0.1, 0, 0.1, 1)";
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    // Calcul du gagnant à la fin de l'animation
    setTimeout(() => {
        isSpinning = false;
        
        // Calcul de l'index gagnant par rapport au pointeur (à droite, donc 0 rad)
        const rotationReelle = currentRotation % 360;
        const angleParSegment = 360 / segments.length;
        
        // On inverse le calcul car la roue tourne dans le sens horaire
        // et le pointeur est fixe à droite (0°)
        const indexGagnant = Math.floor(((360 - rotationReelle) % 360) / angleParSegment);
        
        winnerDisplay.innerText = "GAGNANT : " + segments[indexGagnant];
    }, 5000);
});

// Mise à jour en temps réel quand on tape des noms
namesInput.addEventListener("input", drawWheel);

// Premier dessin au chargement
drawWheel();
