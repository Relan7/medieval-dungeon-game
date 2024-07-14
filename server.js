const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const WebSocket = require('ws');

// Инициализация Firebase
const serviceAccount = require('./path/to/your/serviceAccountKey.json'); // Замените путь на путь к вашему файлу ключа

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-database-name.firebaseio.com' // Замените на ваш URL базы данных
});

const db = admin.database();
const app = express();
const wss = new WebSocket.Server({ noServer: true });

app.use(bodyParser.json());

let playersQueue = [];

// Обработка WebSocket соединений
wss.on('connection', (ws, request) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    handleMessage(ws, data);
  });
});

function handleMessage(ws, data) {
  switch (data.type) {
    case 'REGISTER_PVP':
      registerForPvp(ws, data.nickname);
      break;
    case 'PVP_ACTION':
      handlePvpAction(data.battleId, data.action);
      break;
    default:
      break;
  }
}

function registerForPvp(ws, nickname) {
  playersQueue.push({ nickname, ws });

  if (playersQueue.length >= 2) {
    const player1 = playersQueue.shift();
    const player2 = playersQueue.shift();

    const battleId = db.ref('pvpBattles').push().key;
    const battleData = {
      player1: player1.nickname,
      player2: player2.nickname,
      status: 'ongoing'
    };

    db.ref(`pvpBattles/${battleId}`).set(battleData);

    player1.ws.send(JSON.stringify({ type: 'START_PVP', opponent: player2.nickname, battleId }));
    player2.ws.send(JSON.stringify({ type: 'START_PVP', opponent: player1.nickname, battleId }));
  } else {
    ws.send(JSON.stringify({ type: 'WAITING_FOR_OPPONENT' }));
  }
}

function handlePvpAction(battleId, action) {
  db.ref(`pvpBattles/${battleId}`).once('value').then(snapshot => {
    const battleData = snapshot.val();
    if (battleData && battleData.status === 'ongoing') {
      // Обработка действия игрока (например, атака)
      // Обновление состояния боя в базе данных
      // Отправка обновленного состояния обоим игрокам
    }
  });
}

app.post('/end_pvp', async (req, res) => {
  const { battleId, winner } = req.body;

  if (!battleId || !winner) {
    return res.json({ success: false, message: 'Не указаны все необходимые данные.' });
  }

  await db.ref(`pvpBattles/${battleId}`).update({ status: 'completed', winner });
  return res.json({ success: true, message: 'Бой завершен.' });
});

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});
