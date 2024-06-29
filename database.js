// database.js

import { ref, set, get, child } from "firebase/database";
import { database } from './firebase-config.js';

function saveProgress(nickname, playerData) {
  set(ref(database, 'players/' + nickname), playerData);
}

function loadProgress(nickname) {
  const dbRef = ref(database);
  return get(child(dbRef, `players/${nickname}`)).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return null;
    }
  }).catch((error) => {
    console.error(error);
  });
}

function updateTopPlayers(nickname, playerData) {
  set(ref(database, 'topPlayers/' + nickname), playerData);
}

function displayTopPlayers() {
  const dbRef = ref(database);
  return get(child(dbRef, 'topPlayers')).then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No data available");
      return {};
    }
  }).catch((error) => {
    console.error(error);
  });
}

export { saveProgress, loadProgress, updateTopPlayers, displayTopPlayers };
