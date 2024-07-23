const functions = require('firebase-admin').functions();
const admin = functions.initializeApp();
const db = admin.firestore();

const questCategories = {
  "Убийство монстров": [
    {description: "Убить 10 монстров", goal: 10, progress: 0, reward: 500, completed: false, claimed: false},
    {description: "Убить 30 монстров", goal: 30, progress: 0, reward: 1000, completed: false, claimed: false},
    {description: "Убить 60 монстров", goal: 60, progress: 0, reward: 2500, completed: false, claimed: false},
    {description: "Убить 100 монстров", goal: 100, progress: 0, reward: 5000, completed: false, claimed: false},
    {description: "Убить 150 монстров", goal: 150, progress: 0, reward: 8000, completed: false, claimed: false},
    {description: "Убить 210 монстров", goal: 210, progress: 0, reward: 12000, completed: false, claimed: false},
    {description: "Убить 280 монстров", goal: 280, progress: 0, reward: 17000, completed: false, claimed: false},
    {description: "Убить 360 монстров", goal: 360, progress: 0, reward: 23000, completed: false, claimed: false},
    {description: "Убить 450 монстров", goal: 450, progress: 0, reward: 30000, completed: false, claimed: false},
    {description: "Убить 550 монстров", goal: 550, progress: 0, reward: 40000, completed: false, claimed: false},
  ],
  "Убийство редких монстров": [ // *** Новая категория ***
    {description: "Победить 1 Эпического монстра", goal: 1, progress: 0, reward: 1000, completed: false, claimed: false},
    {description: "Победить 2 Эпических монстров", goal: 2, progress: 0, reward: 5000, completed: false, claimed: false},
    {description: "Победить 3 Эпических монстров", goal: 3, progress: 0, reward: 10000, completed: false, claimed: false},
    {description: "Победить 4 Эпических монстров", goal: 4, progress: 0, reward: 20000, completed: false, claimed: false},
    {description: "Победить 5 Эпических монстров", goal: 5, progress: 0, reward: 50000, completed: false, claimed: false},
  ],
  "Перерождения": [ // *** Новая категория  ***
    {description: "Переродиться  1  раз", goal: 1, progress: 0, reward: 2000, completed: false, claimed: false},
    {description: "Переродиться  3  раза", goal: 3, progress: 0, reward: 20000, completed: false, claimed: false},
    {description: "Переродиться 5  раз", goal: 5, progress: 0, reward: 100000, completed: false, claimed: false},
  ],
  "Трата золота": [
    {description: "Потратить 1000 золота", goal: 1000, progress: 0, reward: 200, completed: false, claimed: false},
    {description: "Потратить 3000 золота", goal: 3000, progress: 0, reward: 500, completed: false, claimed: false},
    {description: "Потратить 6000 золота", goal: 6000, progress: 0, reward: 1200, completed: false, claimed: false},
    {description: "Потратить 10000 золота", goal: 10000, progress: 0, reward: 2500, completed: false, claimed: false},
    {description: "Потратить 15000 золота", goal: 15000, progress: 0, reward: 4000, completed: false, claimed: false},
    {description: "Потратить 21000 золота", goal: 21000, progress: 0, reward: 6000, completed: false, claimed: false},
    {description: "Потратить 28000 золота", goal: 28000, progress: 0, reward: 8500, completed: false, claimed: false},
    {description: "Потратить 36000 золота", goal: 36000, progress: 0, reward: 11500, completed: false, claimed: false},
    {description: "Потратить 45000 золота", goal: 45000, progress: 0, reward: 15000, completed: false, claimed: false},
    {description: "Потратить 55000 золота", goal: 55000, progress: 0, reward: 20000, completed: false, claimed: false},
  ],
};

exports.scheduledFunction = functions.pubsub.schedule("0 0 * * *")
    .timeZone("Etc/UTC")
    .onRun(async (context) => {
      const playersSnapshot = await db.collection("players").get();
      for (const playerDoc of playersSnapshot.docs) {
        const playerData = playerDoc.data();
        playerData.dailyQuests = resetDailyQuestsData();
        await playerDoc.ref.update(playerData);
      }
      console.log("Daily quests reset for all players.");
    });

/**
 * Сбрасывает ежедневные задания.
 * @return {object}  Обновленные данные заданий.
 */
function resetDailyQuestsData() {
  for (const category in questCategories) {
    if (Object.hasOwnProperty.call(questCategories, category)) { // Фильтрация свойств прототипа
      questCategories[category].forEach((quest) => {
        quest.progress = 0;
        quest.completed = false;
        quest.claimed = false;
      });
    }
  }
  return questCategories;
}
