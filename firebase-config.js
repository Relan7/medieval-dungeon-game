// firebase-config.js

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCPQFqbWCL3XaM-sLYDWgWMdslhS7O7WC8",
  authDomain: "game-7bdb0.firebaseapp.com",
  databaseURL: "https://game-7bdb0-default-rtdb.firebaseio.com",
  projectId: "game-7bdb0",
  storageBucket: "game-7bdb0.appspot.com",
  messagingSenderId: "327382187542",
  appId: "1:327382187542:web:cc82e8673791983404bf37",
  measurementId: "G-8JBZ9PEV84"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
