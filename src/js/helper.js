'use strict';

const helper = {
  /*
  * poop
  *
  * Based on current HP, randomly select and display poops for Tamagotchi.
  */
  poop: (elements, state) => {
    const allPoops = [elements.poop.poop1, elements.poop.poop2, elements.poop.poop3,
      elements.poop.poop4, elements.poop.poop5, elements.poop.poop6];
    let displayPoops = [];

    // reset poops
    allPoops.forEach(elem => {
      elem.style.display = `none`;
    });

    // level 1 and level 2 have color thus we need colorized poops
    if (state.evolutionLevel > 0) {
      allPoops.forEach(elem => {
        elem.classList.add(`color`);
      });
    }

    if (state.hp <= 59 && state.hp >= 40) {
      // monster is angry, show 4 poops
      displayPoops = allPoops.slice(0,1);
    } else if (state.hp <= 39 && state.hp >= 20) {
      // monster is sick, show 5 poops
      displayPoops = allPoops.slice(0,3);
    } else if (state.hp <= 19 && state.hp >= 1) {
      // monster is dying, show 6 poops
      // no need to reassign poops array if all shown
      displayPoops = allPoops;
    }

    // display the poops
    displayPoops.forEach(elem => {
      elem.style.display = `block`;
    });
  },
  /*
  * setRandomAsset
  *
  * Pick one of the three assets randomly, at each state. Diversified graphics to keep the
  * user entertained.
  */
  setRandomAsset: (elements, state) => {
    const randIndex = Math.floor(Math.random() * 3);
    const stateAssets = {
      state1: [
        `../../assets/level-${state.evolutionLevel}/monster-state-1-v1.gif`,
        `../../assets/level-${state.evolutionLevel}/monster-state-1-v2.gif`,
        `../../assets/level-${state.evolutionLevel}/monster-state-1-v3.gif`
      ],
      state2: [
        `../../assets/level-${state.evolutionLevel}/monster-state-2-v1.gif`,
        `../../assets/level-${state.evolutionLevel}/monster-state-2-v2.gif`,
        `../../assets/level-${state.evolutionLevel}/monster-state-2-v3.gif`
      ],
      state3: [
        `../../assets/level-${state.evolutionLevel}/monster-state-3-v1.gif`,
        `../../assets/level-${state.evolutionLevel}/monster-state-3-v2.gif`,
        `../../assets/level-${state.evolutionLevel}/monster-state-3-v3.gif`
      ],
      state4: [
        `../../assets/level-${state.evolutionLevel}/monster-state-4-v1.gif`,
        `../../assets/level-${state.evolutionLevel}/monster-state-4-v2.gif`,
        `../../assets/level-${state.evolutionLevel}/monster-state-4-v3.gif`
      ],
      state5: [
        `../../assets/level-${state.evolutionLevel}/monster-state-5-v1.gif`,
        `../../assets/level-${state.evolutionLevel}/monster-state-5-v2.gif`,
        `../../assets/level-${state.evolutionLevel}/monster-state-5-v3.gif`
      ],
      state6: [
        `../../assets/level-${state.evolutionLevel}/monster-state-6-v1.gif`,
        `../../assets/level-${state.evolutionLevel}/monster-state-6-v1.gif`,
        `../../assets/level-${state.evolutionLevel}/monster-state-6-v1.gif`
      ]
    };

    if (state.hp === 100) {
      // monster is full health
      elements.monster.src = stateAssets.state1[randIndex];
    } else if (state.hp <= 99 && state.hp >= 80) {
      // monster is content
      elements.monster.src = stateAssets.state1[randIndex];
    } else if (state.hp <= 79 && state.hp >= 60) {
      // monster is irritated
      elements.monster.src = stateAssets.state2[randIndex];
    } else if (state.hp <= 59 && state.hp >= 40) {
      // monster is angry
      elements.monster.src = stateAssets.state3[randIndex];
    } else if (state.hp <= 39 && state.hp >= 20) {
      // monster is sick
      //TODO: CHANGE THIS TO STATE 4
      elements.monster.src = stateAssets.state4[randIndex];
    } else if (state.hp <= 19 && state.hp >= 1) {
      // monster is dying
      //TODO: CHANGE THIS TO STATE 5
      elements.monster.src = stateAssets.state5[randIndex];
    } else if (state.hp <= 0) {
      // monster is dead (RIP)
      //TODO: CHANGE THIS TO STATE 6
      elements.monster.src = stateAssets.state6[randIndex];
    }
  },
  /*
  * handleEvolutionTimer
  *
  * Start the interval timer that will be used to evolve based on tab count
  * over a period of time.
  */
  handleEvolutionTimer: (elements, state) => {
    // if more than 5 tabs, kill evolution timer else start it if it hasnt already been.
    // remove pending blink animation on next evolution segment.
    if (state.tabCount > 5) {
      const uiSegments = elements.evolutionUISegments;
      for (let idx = 0; idx < uiSegments.length; idx++) {
        uiSegments[idx].classList.remove(`toggle`);
      }
    }
  },
  /*
  * updateEvolutionUI
  *
  * Update evolution UI.
  */
  updateEvolutionUI: (elements, state) => {
    const evolutionLevel = state.evolutionLevel;
    const numberOfSegments = state.evolutionStage;
    const uiSegments = elements.evolutionUISegments;

    // we either havent evolved or are on a new evolution stage. turn off all evolution segments.
    if (numberOfSegments === 0 && evolutionLevel < 2) {
      for (let idx = 0; idx < uiSegments.length; idx++) {
        uiSegments[idx].classList.remove(`on`);
        uiSegments[idx].classList.remove(`toggle`);
        uiSegments[idx].classList.add(`off`);
      }

      uiSegments[0].classList.add(`toggle`);
    } else {
      // we have evolved, turn on required number of segments.
      for (let idx = 0; idx <= numberOfSegments; idx++) {
        uiSegments[idx].classList.remove(`off`);
        uiSegments[idx].classList.remove(`toggle`);
        uiSegments[idx].classList.add(`on`);
      }

      if (numberOfSegments < 10 && evolutionLevel < 2) {
        uiSegments[numberOfSegments].classList.add(`toggle`);
      }
    }

    elements.evolutionSilhouettes.classList.remove(`level-0`);
    elements.evolutionSilhouettes.classList.remove(`level-1`);
    elements.evolutionSilhouettes.classList.add(`level-${state.evolutionLevel}`);

    // helper.setUI(elements, state);
  },
  /*
  * setUI
  *
  * set the UI based on current state
  */
  setUI: (elements, state) => {
    const hp = state.hp <= 0 ? 0 : state.hp;

    // handle hp update
    elements.evolutionState.innerText = `${state.evolutionStage}/10`;
    elements.hpProgressBar.style.width = `${hp}%`;
    elements.hpState.innerText = `${hp}/100`;
    elements.monsterStatus.innerText = `${state.monsterStatus}`;
    elements.tabCount.innerText = `You have ${state.tabCount} tabs open`;

    // set random monster asset from the variants
    helper.setRandomAsset(elements, state);

    // to poop or not to poop, that is the question
    helper.poop(elements, state);
  }
};
