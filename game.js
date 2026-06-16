// Dados dos Pokemon do jogador
const playerPokemons = [
    {
        id: 6,
        name: "Charizard",
        type: "Fire/Flying",
        hp: 220,
        maxHp: 220,
        attack: 130,
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/6.png",
        moves: [
            { name: "Blast Burn", power: 150, type: "Fire", accuracy: 90, effect: "high_damage" },
            { name: "Flamethrower", power: 90, type: "Fire", accuracy: 100 },
            { name: "Air Slash", power: 75, type: "Flying", accuracy: 95 },
            { name: "Dragon Claw", power: 80, type: "Dragon", accuracy: 100 }
        ]
    },
    {
        id: 9,
        name: "Blastoise",
        type: "Water",
        hp: 218,
        maxHp: 218,
        attack: 110,
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/9.png",
        moves: [
            { name: "Hydro Cannon", power: 150, type: "Water", accuracy: 90, effect: "high_damage" },
            { name: "Water Pulse", power: 60, type: "Water", accuracy: 100 },
            { name: "Aqua Tail", power: 90, type: "Water", accuracy: 90 },
            { name: "Ice Beam", power: 90, type: "Ice", accuracy: 100 }
        ]
    },
    {
        id: 3,
        name: "Venusaur",
        type: "Grass/Poison",
        hp: 216,
        maxHp: 216,
        attack: 100,
        sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/3.png",
        moves: [
            { name: "Frenzy Plant", power: 150, type: "Grass", accuracy: 90, effect: "high_damage" },
            { name: "Solar Beam", power: 120, type: "Grass", accuracy: 100 },
            { name: "Sludge Bomb", power: 90, type: "Poison", accuracy: 100 },
            { name: "Petal Blizzard", power: 90, type: "Grass", accuracy: 100 }
        ]
    }
];

// BOSS ZOROARK
const zoroark = {
    id: 571,
    name: "BOSS Zoroark",
    type: "Dark",
    hp: 600,
    maxHp: 600,
    attack: 140,
    sprite: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/571.png",
    moves: [
        { name: "Night Daze", power: 150, type: "Dark", accuracy: 95, effect: "high_damage" },
        { name: "Foul Play", power: 110, type: "Dark", accuracy: 100 },
        { name: "Shadow Ball", power: 100, type: "Ghost", accuracy: 100 },
        { name: "Dark Pulse", power: 130, type: "Dark", accuracy: 100, effect: "high_damage" }
    ]
};

// Cutscene
const cutsceneScript = [
    "VOCE CHEGOU A FINAL DO TORNEIO",
    "UM VAZIO ESCURO TOMA CONTA DA ARENA",
    "BOSS ZOROARK SURGE DAS SOMBRAS",
    "VIDA: 600 - ATAQUE: 140",
    "USE SEUS 3 POKEMONS PARA VENCER"
];

let trainerName = "";
let currentPokemonIndex = 0;
let currentPlayerPokemon = { ...playerPokemons[0], hp: playerPokemons[0].maxHp };
let currentEnemy = { ...zoroark, hp: zoroark.maxHp };
let waitingForAction = false;
let cutsceneIndex = 0;

function updateBattleUI() {
    const playerPercent = (currentPlayerPokemon.hp / currentPlayerPokemon.maxHp) * 100;
    document.getElementById('player-hp-fill').style.width = playerPercent + '%';
    document.getElementById('player-hp-text').textContent = Math.ceil(currentPlayerPokemon.hp) + '/' + currentPlayerPokemon.maxHp;
    document.getElementById('player-name').textContent = currentPlayerPokemon.name;
    document.getElementById('player-sprite-img').src = currentPlayerPokemon.sprite;
    
    const enemyPercent = (currentEnemy.hp / currentEnemy.maxHp) * 100;
    document.getElementById('enemy-hp-fill').style.width = enemyPercent + '%';
    document.getElementById('enemy-hp-text').textContent = Math.ceil(currentEnemy.hp) + '/' + currentEnemy.maxHp;
}

function addMessage(msg) {
    document.getElementById('message-text').innerHTML = msg;
}

function animateDamage(isEnemy) {
    const target = isEnemy ? document.getElementById('enemy-sprite') : document.getElementById('player-sprite');
    target.classList.add('damage');
    target.classList.add('shake');
    setTimeout(() => {
        target.classList.remove('damage');
        target.classList.remove('shake');
    }, 300);
}

function calculateDamage(move, attacker, defender) {
    let damage = Math.floor(((2 * 50 / 5 + 2) * move.power * (attacker.attack / 50)) / 50 + 2);
    damage += Math.floor(Math.random() * 15) - 7;
    damage = Math.max(8, damage);
    if (move.effect === 'high_damage') damage = Math.floor(damage * 1.3);
    return damage;
}

function playerMove(moveIndex) {
    if (!waitingForAction) return;
    
    const move = currentPlayerPokemon.moves[moveIndex];
    if (Math.random() * 100 > move.accuracy) {
        addMessage(currentPlayerPokemon.name + ' usou ' + move.name + '... MAS ERROU');
        waitingForAction = false;
        setTimeout(() => enemyTurn(), 1500);
        return;
    }
    
    const damage = calculateDamage(move, currentPlayerPokemon, currentEnemy);
    currentEnemy.hp = Math.max(0, currentEnemy.hp - damage);
    addMessage(currentPlayerPokemon.name + ' usou ' + move.name + '! DANO: ' + damage);
    animateDamage(true);
    updateBattleUI();
    
    if (currentEnemy.hp <= 0) {
        setTimeout(() => endBattle(true), 1000);
        return;
    }
    
    waitingForAction = false;
    setTimeout(() => enemyTurn(), 1500);
}

function enemyTurn() {
    if (currentEnemy.hp <= 0) return;
    
    const randomMove = currentEnemy.moves[Math.floor(Math.random() * currentEnemy.moves.length)];
    if (Math.random() * 100 > randomMove.accuracy) {
        addMessage('BOSS Zoroark usou ' + randomMove.name + '... MAS ERROU');
        waitingForAction = true;
        showActionArea();
        return;
    }
    
    const damage = calculateDamage(randomMove, currentEnemy, currentPlayerPokemon);
    currentPlayerPokemon.hp = Math.max(0, currentPlayerPokemon.hp - damage);
    addMessage('BOSS usou ' + randomMove.name + '! DANO: ' + damage);
    animateDamage(false);
    updateBattleUI();
    
    if (currentPlayerPokemon.hp <= 0) {
        const aliveIndex = playerPokemons.findIndex((p, idx) => idx !== currentPokemonIndex && p.hp > 0);
        if (aliveIndex !== -1) {
            addMessage(currentPlayerPokemon.name + ' desmaiou');
            setTimeout(() => switchPokemon(aliveIndex), 1500);
        } else {
            setTimeout(() => endBattle(false), 1000);
        }
        return;
    }
    
    waitingForAction = true;
    showActionArea();
}

function switchPokemon(index) {
    currentPokemonIndex = index;
    currentPlayerPokemon = { ...playerPokemons[index], hp: playerPokemons[index].hp };
    addMessage('Voce enviou ' + currentPlayerPokemon.name);
    updateBattleUI();
    hideSwitchArea();
    waitingForAction = true;
    showActionArea();
}

function showActionArea() {
    document.getElementById('action-area').style.display = 'block';
    document.getElementById('moves-area').style.display = 'none';
    document.getElementById('switch-area').style.display = 'none';
}

function showMovesArea() {
    document.getElementById('action-area').style.display = 'none';
    document.getElementById('moves-area').style.display = 'block';
    document.getElementById('switch-area').style.display = 'none';
    
    const movesGrid = document.getElementById('moves-grid');
    movesGrid.innerHTML = '';
    currentPlayerPokemon.moves.forEach((move, idx) => {
        const btn = document.createElement('button');
        btn.className = 'move-btn';
        btn.innerHTML = move.name + ' ' + move.power;
        btn.onclick = () => {
            playerMove(idx);
            document.getElementById('moves-area').style.display = 'none';
        };
        movesGrid.appendChild(btn);
    });
}

function showSwitchArea() {
    document.getElementById('action-area').style.display = 'none';
    document.getElementById('moves-area').style.display = 'none';
    document.getElementById('switch-area').style.display = 'block';
    
    const switchGrid = document.getElementById('switch-grid');
    switchGrid.innerHTML = '';
    playerPokemons.forEach((p, idx) => {
        const isAlive = p.hp > 0;
        const btn = document.createElement('button');
        btn.className = 'switch-pokemon-btn';
        btn.innerHTML = p.name + ' ' + p.hp + '/' + p.maxHp;
        if (!isAlive) { btn.style.opacity = '0.4'; btn.disabled = true; }
        if (idx === currentPokemonIndex) btn.style.border = '2px solid #ff0000';
        btn.onclick = () => { if (isAlive && idx !== currentPokemonIndex) switchPokemon(idx); };
        switchGrid.appendChild(btn);
    });
}

function hideSwitchArea() { showActionArea(); }

function endBattle(victory) {
    waitingForAction = false;
    if (victory) {
        document.getElementById('result-icon').innerHTML = 'VITORIA';
        document.getElementById('result-title').innerHTML = 'CAMPEAO';
        document.getElementById('result-message').innerHTML = trainerName + ' DERROTOU O BOSS ZOROARK';
    } else {
        document.getElementById('result-icon').innerHTML = 'DERROTA';
        document.getElementById('result-title').innerHTML = 'FIM';
        document.getElementById('result-message').innerHTML = trainerName + ' FOI DERROTADO... TENTE NOVAMENTE';
    }
    showScreen('result-screen');
}

function startBattle() {
    playerPokemons[0].hp = playerPokemons[0].maxHp;
    playerPokemons[1].hp = playerPokemons[1].maxHp;
    playerPokemons[2].hp = playerPokemons[2].maxHp;
    currentPokemonIndex = 0;
    currentPlayerPokemon = { ...playerPokemons[0], hp: playerPokemons[0].maxHp };
    currentEnemy = { ...zoroark, hp: zoroark.maxHp };
    waitingForAction = true;
    updateBattleUI();
    addMessage('FINAL: ' + trainerName + ' VS BOSS ZOROARK');
    showActionArea();
    showScreen('battle-screen');
}

function runCutscene() {
    if (cutsceneIndex >= cutsceneScript.length) { startBattle(); return; }
    document.getElementById('cutscene-text').innerHTML = cutsceneScript[cutsceneIndex];
    cutsceneIndex++;
}

function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// Eventos
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-btn').onclick = () => {
        const name = document.getElementById('trainer-name').value.trim();
        if (!name) { alert('Digite seu nome'); return; }
        trainerName = name;
        cutsceneIndex = 0;
        showScreen('cutscene-screen');
        runCutscene();
    };
    document.getElementById('next-btn').onclick = () => runCutscene();
    document.querySelector('.fight-btn').onclick = () => { if (waitingForAction) showMovesArea(); };
    document.querySelector('.pokemon-btn').onclick = () => { if (waitingForAction) showSwitchArea(); };
    document.getElementById('back-fight-btn').onclick = () => showActionArea();
    document.getElementById('back-switch-btn').onclick = () => showActionArea();
    document.getElementById('restart-btn').onclick = () => {
        cutsceneIndex = 0;
        showScreen('start-screen');
        document.getElementById('trainer-name').value = "";
    };
    updateBattleUI();
});