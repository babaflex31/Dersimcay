const targetImg = document.getElementById('targetImg');
const targetWrapper = document.getElementById('targetWrapper');
const gameArea = document.getElementById('gameArea');
const scoreEl = document.getElementById('score');
const comboEl = document.getElementById('combo');
const punchCursor = document.getElementById('punchCursor');
const kickCursor = document.getElementById('kickCursor');
const damageOverlay = document.getElementById('damageOverlay');

let score = 0;
let combo = 0;
let comboTimer;
let lastX = 0;
let lastY = 0;

const insults = [
    "AHHH!", "YAVAŞ!", "GAVAT!", "ZENCİ!", "ÖLDÜM!",
    "AŞKIM ORASI DEĞİL YANLIŞ DELİK!", "BOM!", "AĞLA!", "YETER!", "SAKSO!",
    "EŞŞEK!", "TOKAT!", "GAVAT!", "TEKME!", "KÜT!"
];

window.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('mousemove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    punchCursor.style.left = e.clientX + 'px';
    punchCursor.style.top = e.clientY + 'px';
    kickCursor.style.left = e.clientX + 'px';
    kickCursor.style.top = e.clientY + 'px';
});

function performAttack(e, type) {
    const isKick = type === 'kick';
    const power = isKick ? 2.5 : (0.8 + Math.random() * 0.4);

    if (isKick) {
        punchCursor.style.display = 'none';
        kickCursor.style.display = 'block';
        kickCursor.style.transform = `translate(-50%, -50%) scale(1.2) rotate(${(Math.random() - 0.5) * 120}deg)`;
    } else {
        kickCursor.style.display = 'none';
        punchCursor.style.display = 'block';
        punchCursor.style.transform = `translate(-50%, -50%) scale(0.6) rotate(${(Math.random() - 0.5) * 60}deg)`;
    }

    document.body.classList.remove('screen-shake', 'kick-shake');
    void document.body.offsetWidth;
    document.body.classList.add(isKick ? 'kick-shake' : 'screen-shake');

    targetWrapper.classList.remove('shake');
    void targetWrapper.offsetWidth;
    targetWrapper.classList.add('shake');

    const moveX = (Math.random() - 0.5) * (isKick ? 150 : 25);
    const moveY = (Math.random() - 0.5) * (isKick ? 150 : 25);
    targetImg.style.transform = `scale(${isKick ? 1.3 : 1.1}) translate(${moveX}px, ${moveY}px) rotate(${(Math.random() - 0.5) * 20}deg)`;

    setTimeout(() => {
        targetImg.style.transform = 'scale(1) translate(0,0) rotate(0deg)';
        document.body.classList.remove('screen-shake', 'kick-shake');
    }, isKick ? 400 : 150);

    createRealisticDamage(e.clientX, e.clientY, power, isKick);

    score += isKick ? 10 : 1;
    combo++;
    scoreEl.innerText = score;
    comboEl.innerText = combo;

    updateDamageLevel();

    clearTimeout(comboTimer);
    comboTimer = setTimeout(() => {
        combo = 0;
        comboEl.innerText = combo;
    }, 1500);

    createFloatingText(e.clientX, e.clientY, isKick ? "KICK!!!" : null, isKick);
}

gameArea.addEventListener('mousedown', (e) => {
    if (e.button === 0) performAttack(e, 'punch');
    if (e.button === 2) performAttack(e, 'kick');
});

gameArea.addEventListener('mouseup', () => {
    punchCursor.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
    kickCursor.style.transform = 'translate(-50%, -50%) scale(1) rotate(0deg)';
});

function createRealisticDamage(x, y, power, isKick) {
    const rect = targetImg.getBoundingClientRect();
    if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
        const bruise = document.createElement('div');
        bruise.className = 'temporary-bruise';
        const size = (isKick ? 120 : 50) + Math.random() * 50;
        bruise.style.width = size + 'px';
        bruise.style.height = size + 'px';
        bruise.style.left = (x - rect.left - size / 2) + 'px';
        bruise.style.top = (y - rect.top - size / 2) + 'px';

        const intensity = Math.min(0.5 + (score / 150), 0.95);
        bruise.style.background = `radial-gradient(ellipse at center, rgba(30, 0, 60, ${intensity}) 0%, rgba(100, 20, 0, ${intensity / 2}) 70%, transparent 100%)`;
        bruise.style.borderRadius = `${35 + Math.random() * 30}% ${35 + Math.random() * 30}%`;

        targetWrapper.appendChild(bruise);

        setTimeout(() => {
            bruise.style.opacity = '0';
            setTimeout(() => bruise.remove(), 2000);
        }, 4000);
    }
}

function updateDamageLevel() {
    targetImg.classList.remove('damage-L1', 'damage-L2', 'damage-L3', 'damage-L4');
    if (score >= 500) targetImg.classList.add('damage-L4');
    else if (score >= 200) targetImg.classList.add('damage-L3');
    else if (score >= 100) targetImg.classList.add('damage-L2');
    else if (score >= 50) targetImg.classList.add('damage-L1');
}

function createFloatingText(x, y, customText = null, isHeavy = false) {
    const text = document.createElement('div');
    text.className = isHeavy ? 'floating-text heavy' : 'floating-text';
    text.innerText = customText || insults[Math.floor(Math.random() * insults.length)];
    text.style.left = x + 'px';
    text.style.top = y + 'px';
    document.body.appendChild(text);
    setTimeout(() => text.remove(), 800);
}

punchCursor.style.display = 'block';
