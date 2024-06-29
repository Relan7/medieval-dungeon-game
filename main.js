// main.js

import { saveProgress, loadProgress, updateTopPlayers, displayTopPlayers } from './database.js';

let nickname = '';
let currentLevel = 1;
let gold = 0;
let playerHealth = 100;
let weaponPower = 10;
let weaponName = 'Кулаки';
let weaponLevel = 0;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let currentScreen = 'menu';
let monsterHealth = 100;
let hits = 0;
let baseMonsterHealth = 100;
let levels = new Array(100).fill().map((_, i) => ({ number: i + 1, stars: 0, completed: false }));

const backgroundImage = new Image();
backgroundImage.src = 'background.png';
const dungeonGateImage = new Image();
dungeonGateImage.src = 'dung.png';
const monsterImage = new Image();
monsterImage.src = 'mob.png';
const mapImage = new Image();
mapImage.src = 'карта.png';
const starImage = new Image();
starImage.src = 'star.png';

const peasantImage = 'peasant.png';
const peasantWithSwordImage = 'peasant_with_sword.png';

starImage.onload = function() {
    drawLevelMap();
};

function startGame() {
  const input = document.getElementById('nicknameInput').value;
  if (input) {
    nickname = input;
    loadProgress(nickname).then(data => {
      if (data) {
        currentLevel = data.currentLevel;
        gold = data.gold;
        playerHealth = data.playerHealth;
        weaponPower = data.weaponPower;
        weaponName = data.weaponName;
        weaponLevel = data.weaponLevel;
        updateCharacterMenu();
      } else {
        resetGame();
      }
    });
    document.getElementById('nicknameMenu').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';
    document.getElementById('bottomMenu').style.display = 'flex';
    currentScreen = 'menu';
    drawMenu();
  } else {
    alert('Пожалуйста, введите никнейм.');
  }
}

function buyWeapon(type, power, cost) {
  if (gold >= cost) {
    weaponPower = power;
    gold -= cost;
    weaponLevel = 1;
    if (type === 'sword') {
      weaponName = 'Меч';
      document.getElementById('characterImage').src = peasantWithSwordImage;
    }
    updateCharacterMenu();
    updateShop();
    saveProgress(nickname, {
      currentLevel,
      gold,
      playerHealth,
      weaponPower,
      weaponName,
      weaponLevel
    });
  }
}

function upgradeWeapon(type, costPerLevel) {
  if (gold >= costPerLevel && weaponName === 'Меч') {
    weaponPower += 15;
    gold -= costPerLevel;
    weaponLevel++;
    updateCharacterMenu();
    updateShop();
    saveProgress(nickname, {
      currentLevel,
      gold,
      playerHealth,
      weaponPower,
      weaponName,
      weaponLevel
    });
  }
}

function continueGame() {
  document.getElementById('shopMenu').style.display = 'none';
  if (currentLevel < 100) {
    currentLevel++;
    startLevel(currentLevel);
  } else {
    currentScreen = 'victory';
    drawVictoryScreen();
  }
  updateTopPlayers(nickname, { nickname, level: currentLevel });
}

function hitMonster() {
  monsterHealth -= weaponPower;
  hits += 1;
  if (monsterHealth <= 0) {
    monsterHealth = 0;
    gold += 10;
    levels[currentLevel - 1].completed = true;
    saveProgress(nickname, {
      currentLevel,
      gold,
      playerHealth,
      weaponPower,
      weaponName,
      weaponLevel
    });
    showVictoryMessage();
    currentScreen = 'shop';
    setTimeout(() => {
      document.getElementById('victoryMessage').style.display = 'none';
      document.getElementById('shopMenu').style.display = 'block';
      updateShop();
    }, 2000);
  }
}

function drawMenu() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

function drawDungeonEntrance() {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(dungeonGateImage, canvas.width / 2 - dungeonGateImage.width / 2, canvas.height / 2 - dungeonGateImage.height / 2);
}

function drawVictoryScreen() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'white';
  ctx.font = '50px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Вы победили!', canvas.width / 2, canvas.height / 2);
}

function showVictoryMessage() {
  const victoryMessage = document.getElementById('victoryMessage');
  victoryMessage.style.display = 'block';
}

function startLevel(levelNumber) {
  currentLevel = levelNumber;
  monsterHealth = baseMonsterHealth * Math.pow(1.1, levelNumber - 1);
  currentScreen = 'battle';
  drawBattle();
}

function drawLevelMap() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);

  levels.forEach((level, index) => {
    const { x, y } = getLevelPosition(index);

    ctx.fillStyle = level.completed ? 'gold' : 'silver';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(level.number, x, y + 8);

    drawStars(x - 30, y + 35, level.stars);
  });
}

function getLevelPosition(index) {
  const perRow = 5;
  const spacing = 80;
  const offsetX = (canvas.width - perRow * spacing) / 2;
  const offsetY = 100;

  const x = offsetX + (index % perRow) * spacing;
  const y = offsetY + Math.floor(index / perRow) * spacing;
  return { x, y };
}

function drawBattle() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(monsterImage, canvas.width / 2 - monsterImage.width / 2, canvas.height / 2 - monsterImage.height / 2);
  drawHealthBar(playerHealth, 10, 10, 200, 20, 'green');
  drawHealthBar(monsterHealth, canvas.width - 210, 10, 200, 20, 'red');
  updateStatusBar();
}

function drawHealthBar(health, x, y, width, height, color) {
  ctx.fillStyle = 'grey';
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width * health / 100, height);
}

function updateShop() {
  document.getElementById('shopGold').textContent = gold;
}

function changeScreen(screen) {
  currentScreen = screen;
  document.getElementById('shopMenu').style.display = 'none';
  document.getElementById('statusBar').style.display = 'none';
  if (screen === 'arena' || screen === 'raid' || screen === 'castle') {
    drawMenu();
  } else if (screen === 'dungeon') {
    drawDungeonEntrance();
  } else if (screen === 'shop') {
    drawShop();
  } else if (screen === 'battle') {
    document.getElementById('statusBar').style.display = 'block';
    updateStatusBar();
    drawBattle();
  }
}

function toggleCharacterMenu() {
  const menu = document.getElementById('characterMenu');
  menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
  updateCharacterMenu();
}

function updateCharacterMenu() {
  document.getElementById('weapon').textContent = weaponName;
  document.getElementById('health').textContent = playerHealth;
  document.getElementById('damage').textContent = weaponPower;
  document.getElementById('gold').textContent = gold;
  document.getElementById('level').textContent = currentLevel;
}

function updateStatusBar() {
  document.getElementById('statusGold').textContent = gold;
  document.getElementById('statusLevel').textContent = currentLevel;
  document.getElementById('playerHealthBar').style.width = playerHealth + '%';
}

function toggleTopPlayers() {
  const menu = document.getElementById('topPlayersMenu');
  if (menu.style.display === 'block') {
    menu.style.display = 'none';
  } else {
    displayTopPlayers().then(topPlayers => {
      let topListHTML = '<h2>Топ игроки</h2>';
      for (const key in topPlayers) {
        if (topPlayers.hasOwnProperty(key)) {
          const player = topPlayers[key];
          topListHTML += `<p>${player.nickname} - Уровень ${player.level}</p>`;
        }
      }
      document.getElementById('topPlayersMenu').innerHTML = topListHTML;
      menu.style.display = 'block';
    });
  }
}

function resetGame() {
  currentLevel = 1;
  gold = 0;
  playerHealth = 100;
  weaponPower = 10;
  weaponName = 'Кулаки';
  weaponLevel = 0;
  updateCharacterMenu();
  updateStatusBar();
}

canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  if (currentScreen === 'menu') {
    currentScreen = 'dungeon';
    drawDungeonEntrance();
  } else if (currentScreen === 'dungeon') {
    const gateCenterX = canvas.width / 2;
    const gateCenterY = canvas.height / 2;
    if (mouseX > gateCenterX - dungeonGateImage.width / 2 &&
      mouseX < gateCenterX + dungeonGateImage.width / 2 &&
      mouseY > gateCenterY - dungeonGateImage.height / 2) {
      currentScreen = 'battle';
      drawBattle();
    }
  }
});

canvas.addEventListener('click', function(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  levels.forEach((level, index) => {
    const { x, y } = getLevelPosition(index);
    const radius = 25;

    if (Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2) < radius) {
      if (levels[index].completed || index === currentLevel - 1) {
        startLevel(level.number);
      }
    }
  });
});

function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (currentScreen === 'menu') {
    drawMenu();
  } else if (currentScreen === 'dungeon') {
    drawDungeonEntrance();
  } else if (currentScreen === 'battle') {
    drawBattle();
  } else if (currentScreen === 'levelMap') {
    drawLevelMap();
  } else if (currentScreen === 'victory') {
    drawVictoryScreen();
  } else if (currentScreen === 'shop') {
    drawShop();
  }
}

gameLoop();
