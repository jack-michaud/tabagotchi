'use strict';

const TIME_INTERVAL = 3600000;
const MAX_HEALTH = 100;
let evolutionInterval = undefined;
let globalState = {};

function getTabsCount() {
  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => {
      let tabCount = tabs.length > 0 ? tabs.length - 1 : 0;
      resolve(tabCount);
    });
  });
}

function getStorage() {
  return new Promise((resolve) => {
    chrome.storage.local.get(`monster`, (data) => {
      if (typeof data.monster !== `undefined`) {
        globalState = data.monster;
        resolve(data.monster);
      } else {
          console.log("DEBUG: GETSTORAGE ELSE");
          const state = {
            hp: MAX_HEALTH,
            evolutionLevel: 0,
            evolutionStage: 0,
            evolutionTimestamp: 0,
            monster: ``,
            monsterStatus: ``,
            tabCount: 0
          };

          getTabsCount().then(tabCount => {
            state.tabCount = tabCount;
            return chrome.storage.local.set({monster: state});
          }).then(() => {
            globalState = state;
            resolve(state);
          });
      }
    });
  });
}

function clearEvolutionTimer() {
    clearInterval(evolutionInterval);
    evolutionInterval = undefined;
}

function handleEvolutionTimer() {

  // if more than 5 tabs, kill evolution timer else start it if it hasnt already been.
  // remove pending blink animation on next evolution segment.

  const tabCount = globalState.tabCount;

  if (tabCount > 5) {
    clearEvolutionTimer();
    return;
  }

  const now = Date.now();
  const canUpdate = now - globalState.evolutionTimestamp >= TIME_INTERVAL ? true : false;

  if (tabCount < 6 && typeof evolutionInterval === `undefined` && canUpdate) {
    evolutionInterval = setInterval(() => {

      if (globalState.evolutionLevel < 2) {
        if (globalState.evolutionStage < 9) {
          globalState.evolutionStage++;
          globalState.evolutionTimestamp = Date.now();
        } else if (globalState.evolutionStage === 9) {
          globalState.evolutionStage = 0;
          globalState.evolutionLevel++;
          globalState.evolutionTimestamp = Date.now();
        }
      } else if (globalState.evolutionLevel === 2) {
        globalState.evolutionStage = 9;
        globalState.evolutionTimestamp = Date.now();
        clearEvolutionTimer();
      }

      globalState.lastUpdatedAt = Date.now();
      chrome.storage.local.set({monster: globalState});
      // console.log(`DEBUG: evolution timer started`, evolutionInterval, state);
    }, TIME_INTERVAL);
  }
}

function updateMonsterState() {
  let state = {};

  getStorage().then(result => {
    state = result;
    return getTabsCount();
  }).then(tabCount => {
    state.tabCount = tabCount;
    state.hp = MAX_HEALTH - 4 * tabCount;

    let textArray = [];
    const randIndex = Math.floor(Math.random() * (3));
    if (state.hp === MAX_HEALTH) {
      state.monsterStatus = `"Yippee!"`;
    } else if (state.hp <= 99 && state.hp >= 80) {
      textArray = [`"Oh yeah!"`,`"So happy!"`,`"Hi! Hello! Hi!"`];
      state.monsterStatus = textArray[randIndex];
    } else if (state.hp <= 79 && state.hp >= 60) {
      textArray = [`"You are the best!"`,`"Life is good!"`,`"<3"`];
      state.monsterStatus = textArray[randIndex];
    } else if (state.hp <= 59 && state.hp >= 40) {
      textArray = [`"Hmph!"`,`"Too. Many. Tabs."`,`"Please close tabs."`];
      state.monsterStatus = textArray[randIndex];
    } else if (state.hp <= 39 && state.hp >= 20) {
      textArray = [`"So mad at you!"`,`"%(*$&%&"`,`"Argh!"`];
      state.monsterStatus = textArray[randIndex];
    } else if (state.hp <= 19 && state.hp >= 1) {
      textArray = [`"Feeling sick..."`,`"Slipping away..."`,`"Stomachache..."`];
      state.monsterStatus = textArray[randIndex];
    } else if (state.hp <= 0) {
      state.monsterStatus = `"R.I.P."`;
    }

    chrome.storage.local.set({monster: state}, () => {
      globalState = state;
      handleEvolutionTimer();
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  getStorage().then(state => {
    handleEvolutionTimer();

    chrome.tabs.create({
       url: "index.html"
    });
  });
});

chrome.tabs.onCreated.addListener(() => {
  updateMonsterState();
});

chrome.tabs.onRemoved.addListener(() => {
  updateMonsterState();
});

chrome.tabs.onUpdated.addListener(() => {
  updateMonsterState();
});
