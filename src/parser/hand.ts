import { setBlinds, setButtonSeat, setFlopData, setMaxNumberOfPlayers, setRiverData, setShowdownData, setTableType, setTurnData } from './setParams';
import { KEY_WORDS } from '@/enums/parser';
import { getArrayFromString, startsWith } from '@/utils';
import { PlayerAction } from '@/enums/actions';
import {
  getActionInfo,
  getBlinds,
  getHandInfo,
  getHeroHand,
  getPlayersInfo,
  getTableTypeAndButtonSeat,
  getPlayerId,
  getStraddleAmount,
  isHero,
  getBoardsAmount,
} from '@/utils/parser';
import type { PlayerId, PokerHand, PositionsInfo } from '@/types';
import { useCountersStore, type Counters } from '@/stores/counters';
import { useStatsStore, type Stats } from '@/stores/stats';

const defaultPokerHand: PokerHand = {
  sizeOfSB: 0,
  sizeOfBB: 0,
  tableType: null,
  buttonSeat: null,
  players: [],
  maxNumberOfPlayers: 0,
  currentNumberOfPlayers: 0,
  potInChips: 0,
  actions: {
    preFlopActions: [],
    flopActions1: [],
    flopActions2: [],
    flopActions3: [],
    turnActions1: [],
    turnActions2: [],
    turnActions3: [],
    riverActions1: [],
    riverActions2: [],
    riverActions3: [],
    showdownActions1: [],
    showdownActions2: [],
    showdownActions3: [],
  },
  boards: [[null, null, null, null, null], [null, null, null, null, null], [null, null, null, null, null]],
  boardsAmount: 1,
};

const counters: Counters = {
  numberOfHands: 0,
  sawFlopTimes: 0,
  sawTurnTimes: 0,
  sawRiverTimes: 0,
  sawShowDownTimes: 0,
  wonShowDownTimes: 0,
  preFlopRaises: 0,
  preFlopThreeBets: 0,
  foldPreFlopThreeBets: 0,
  preFlopSqueeze: 0,
  putIntoPot: 0,
  numberOfSqueezeSituations: 0,
};

export function resetPokerHand() {
  return structuredClone(defaultPokerHand);
}

export async function handHandler(hand: string[]) {
  const pokerHand = resetPokerHand();
  let isMoreThanOneBoard: boolean = false;
  let isHeroWentToShowdown: boolean = false;
  let initInfo: string[] = [];
  let preFlopInfo: string[] = [];
  let flopInfo1: string[] = [];
  let flopInfo2: string[] = [];
  let flopInfo3: string[] = [];
  let turnInfo1: string[] = [];
  let turnInfo2: string[] = [];
  let turnInfo3: string[] = [];
  let riverInfo1: string[] = [];
  let riverInfo2: string[] = [];
  let riverInfo3: string[] = [];
  let showdownInfo1: string[] = [];
  let showdownInfo2: string[] = [];
  let showdownInfo3: string[] = [];
  let summaryInfo: string[] = [];

  /* Create Init Array */
  const initData = getHandInfo(hand, KEY_WORDS.POKER_HAND);
  if (initData.endIndex !== -1) {
    initInfo = initData.info;
    hand = hand.slice(initData.endIndex);
  }

  /* Create PreFlop Array */
  const preFlopData = getHandInfo(hand, KEY_WORDS.HOLE_CARDS);
  if (preFlopData.endIndex !== -1) {
    preFlopInfo = preFlopData.info;
    hand = hand.slice(preFlopData.endIndex);
  }

  if (startsWith(hand[0], KEY_WORDS.FLOP)) {
    /* Create Flop Array */
    const flopData = getHandInfo(hand, KEY_WORDS.FLOP);
    if (flopData.endIndex !== -1) {
      flopInfo1 = flopData.info;
      hand = hand.slice(flopData.endIndex);
    }

    /* Create Turn Array */
    const turnData = getHandInfo(hand, KEY_WORDS.TURN);
    if (turnData.endIndex !== -1) {
      turnInfo1 = turnData.info;
      hand = hand.slice(turnData.endIndex);
    }

    /* Create River Array */
    const riverData = getHandInfo(hand, KEY_WORDS.RIVER);
    if (riverData.endIndex !== -1) {
      riverInfo1 = riverData.info;
      hand = hand.slice(riverData.endIndex);
    }

    /* Create Showdown Array */
    const showdownData = getHandInfo(hand, KEY_WORDS.SHOWDOWN);
    if (showdownData.endIndex !== -1) {
      showdownInfo1 = showdownData.info;
      hand = hand.slice(showdownData.endIndex);
    }

  } else {
    /* If more than one board */
    isMoreThanOneBoard = true;

    if (startsWith(hand[0], KEY_WORDS.FIRST_FLOP)) {
      /* Create First Flop Array */
      const flopData1 = getHandInfo(hand, KEY_WORDS.FIRST_FLOP);
      if (flopData1.endIndex !== -1) {
        flopInfo1 = flopData1.info;
        hand = hand.slice(flopData1.endIndex);
      }
    }

    if (startsWith(hand[0], KEY_WORDS.FIRST_TURN)) {
      /* Create First Turn Array */
      const turnData1 = getHandInfo(hand, KEY_WORDS.FIRST_TURN);
      if (turnData1.endIndex !== -1) {
        turnInfo1 = turnData1.info;
        hand = hand.slice(turnData1.endIndex);
      }
    }

    if (startsWith(hand[0], KEY_WORDS.FIRST_RIVER)) {
      /* Create First River Array */
      const riverData1 = getHandInfo(hand, KEY_WORDS.FIRST_RIVER);
      if (riverData1.endIndex !== -1) {
        riverInfo1 = riverData1.info;
        hand = hand.slice(riverData1.endIndex);
      }
    }

    if (startsWith(hand[0], KEY_WORDS.SECOND_FLOP)) {
      /* Create Second Flop Array */
      const flopData2 = getHandInfo(hand, KEY_WORDS.SECOND_FLOP);
      if (flopData2.endIndex !== -1) {
        flopInfo2 = flopData2.info;
        hand = hand.slice(flopData2.endIndex);
      }
    }

    if (startsWith(hand[0], KEY_WORDS.SECOND_TURN)) {
      /* Create Second Turn Array */
      const turnData2 = getHandInfo(hand, KEY_WORDS.SECOND_TURN);
      if (turnData2.endIndex !== -1) {
        turnInfo2 = turnData2.info;
        hand = hand.slice(turnData2.endIndex);
      }
    }

    if (startsWith(hand[0], KEY_WORDS.SECOND_RIVER)) {
      /* Create Second River Array */
      const riverData2 = getHandInfo(hand, KEY_WORDS.SECOND_RIVER);
      if (riverData2.endIndex !== -1) {
        riverInfo2 = riverData2.info;
        hand = hand.slice(riverData2.endIndex);
      }
    }

    if (startsWith(hand[0], KEY_WORDS.THIRD_FLOP)) {
      /* Create Third Flop Array */
      const flopData3 = getHandInfo(hand, KEY_WORDS.THIRD_FLOP);
      if (flopData3.endIndex !== -1) {
        flopInfo3 = flopData3.info;
        hand = hand.slice(flopData3.endIndex);
      }
    }

    if (startsWith(hand[0], KEY_WORDS.THIRD_TURN)) {
      /* Create Third Turn Array */
      const turnData3 = getHandInfo(hand, KEY_WORDS.THIRD_TURN);
      if (turnData3.endIndex !== -1) {
        turnInfo3 = turnData3.info;
        hand = hand.slice(turnData3.endIndex);
      }
    }

    if (startsWith(hand[0], KEY_WORDS.THIRD_RIVER)) {
      /* Create Third River Array */
      const riverData3 = getHandInfo(hand, KEY_WORDS.THIRD_RIVER);
      if (riverData3.endIndex !== -1) {
        riverInfo3 = riverData3.info;
        hand = hand.slice(riverData3.endIndex);
      }
    }

    if (startsWith(hand[0], KEY_WORDS.FIRST_SHOWDOWN)) {
      /* Create First Showdown Array */
      const showdownData1 = getHandInfo(hand, KEY_WORDS.FIRST_SHOWDOWN);
      if (showdownData1.endIndex !== -1) {
        showdownInfo1 = showdownData1.info;
        hand = hand.slice(showdownData1.endIndex);
      }
    }

    if (startsWith(hand[0], KEY_WORDS.SECOND_SHOWDOWN)) {
      /* Create Second Showdown Array */
      const showdownData2 = getHandInfo(hand, KEY_WORDS.SECOND_SHOWDOWN);
      if (showdownData2.endIndex !== -1) {
        showdownInfo2 = showdownData2.info;
        hand = hand.slice(showdownData2.endIndex);
      }
    }

    if (startsWith(hand[0], KEY_WORDS.THIRD_SHOWDOWN)) {
      /* Create Third Showdown Array */
      const showdownData3 = getHandInfo(hand, KEY_WORDS.THIRD_SHOWDOWN);
      if (showdownData3.endIndex !== -1) {
        showdownInfo3 = showdownData3.info;
        hand = hand.slice(showdownData3.endIndex);
      }
    }
  }

  /* Create Summary Array */
  summaryInfo = hand;

  if (isMoreThanOneBoard) {
    for (const str of summaryInfo) {
      if (startsWith(str, KEY_WORDS.HAND_WAS_RUN)) {
        pokerHand.boardsAmount = getBoardsAmount(str);
        break;
      }
    }
  }

  const positionsInfo: PositionsInfo[] = [];

  /*** Set Init Data ***/
  for (const str of initInfo) {
    if (startsWith(str, KEY_WORDS.POKER_HAND)) {
      const blinds = getBlinds(getArrayFromString(str, ' '));

      setBlinds(pokerHand, blinds);
      continue;
    }

    if (startsWith(str, KEY_WORDS.TABLE)) {
      const { tableType, buttonSeat } = getTableTypeAndButtonSeat(str);

      setTableType(pokerHand, tableType);
      setButtonSeat(pokerHand, buttonSeat);
      setMaxNumberOfPlayers(pokerHand, tableType);
    }

    /*** Set players data ***/
    if (startsWith(str, KEY_WORDS.SEAT)) {
      const player = getPlayersInfo(str);
      pokerHand.players.push(player);
      positionsInfo.push({ id: player.id, seat: player.seatNumber })
    }

    if (str.includes(KEY_WORDS.POSTS_SMALL_BLIND)) {
      const playerId = getPlayerId(str);

      const player = pokerHand.players.find((pl) => pl.id === playerId);

      if (player) {
        pokerHand.potInChips += pokerHand.sizeOfSB;
        player.moneyInPotInChips += pokerHand.sizeOfSB;
        player.currentStackInChips -= pokerHand.sizeOfSB;
      }
    }

    if (str.includes(KEY_WORDS.POSTS_BIG_BLIND)) {
      const playerId = getPlayerId(str);

      const player = pokerHand.players.find((pl) => pl.id === playerId);

      if (player) {
        pokerHand.potInChips += pokerHand.sizeOfBB;
        player.moneyInPotInChips += pokerHand.sizeOfBB;
        player.currentStackInChips -= pokerHand.sizeOfBB;
      }
    }

    if (str.includes(KEY_WORDS.STRADDLE)) {
      const playerId = getPlayerId(str);

      const player = pokerHand.players.find((pl) => pl.id === playerId);

      if (player) {
        player.straddle = getStraddleAmount(str);
      }
    }
  }

  /*** Set ID-Index mapper and Straddle ***/
  const ID_INDEX_MAP: Record<PlayerId, number> = {};

  for (let i = 0; i < pokerHand.players.length; i++) {
    const player = pokerHand.players[i];

    ID_INDEX_MAP[player.id] = i;

    if (player.straddle) {
      pokerHand.potInChips += player.straddle;
      player.moneyInPotInChips += player.straddle;
      player.currentStackInChips -= player.straddle;
    }
  }

  /*** Set Current Players Number ***/
  pokerHand.currentNumberOfPlayers = pokerHand.players.length;

  /*** Set Players Positions ***/
  const buttonIndex = positionsInfo.findIndex((player) => player.seat === pokerHand.buttonSeat);
  if (buttonIndex !== -1) {
    const arrAfterIndex = positionsInfo.slice(buttonIndex + 1);
    const arrBeforeIndex = positionsInfo.slice(0, buttonIndex + 1);

    let positionCounter = 0;

    for (const item of arrAfterIndex) {
      const player = pokerHand.players[ID_INDEX_MAP[item.id]];

      player.position = positionCounter;
      positionCounter++;
    }

    for (const item of arrBeforeIndex) {
      const player = pokerHand.players[ID_INDEX_MAP[item.id]];

      player.position = positionCounter;
      positionCounter++;
    }
  }

  /*** Set PreFlop Data ***/
  for (let i = 0; i < preFlopInfo.length; i++) {
    const str = preFlopInfo[i];

    // Set Hero Hand
    if (i <= pokerHand.currentNumberOfPlayers) {
      const heroHand = getHeroHand(str);
      if (heroHand) {
        const player = pokerHand.players[ID_INDEX_MAP[KEY_WORDS.HERO]];

        player.hand = heroHand;
      }
    } else {
      // Set PreFlopAction
      pokerHand.actions.preFlopActions.push(getActionInfo(str));
    }
  }

  /*** Set Flop Data ***/
  setFlopData(pokerHand, flopInfo1, 1);
  setFlopData(pokerHand, flopInfo2, 2);
  setFlopData(pokerHand, flopInfo3, 3);


  /*** Set Turn Data ***/
  setTurnData(pokerHand, turnInfo1, 1);
  setTurnData(pokerHand, turnInfo2, 2);
  setTurnData(pokerHand, turnInfo3, 3);

  /*** Set River Data ***/
  setRiverData(pokerHand, riverInfo1, 1);
  setRiverData(pokerHand, riverInfo2, 2);
  setRiverData(pokerHand, riverInfo3, 3);

  /*** Set Showdown Data ***/
  setShowdownData(pokerHand, showdownInfo1, 1);
  setShowdownData(pokerHand, showdownInfo2, 2);
  setShowdownData(pokerHand, showdownInfo3, 3);

  /*** PreFlop Actions Handler ***/
  let isHeroPutIntoPot: boolean = false;
  let isHeroPreFlopRaiser: boolean = false;
  let isPreFlopSqueezeSituation: boolean = false;
  let isRaiseBeforeCall: boolean = false;
  let preFlopCallCounter: number = 0;
  let preFlopRaiseCounter: number = 0;

  for (const playerAction of pokerHand.actions.preFlopActions) {
    const { id, action, amount, cards } = playerAction;

    const player = pokerHand.players[ID_INDEX_MAP[id]];

    if (action === PlayerAction.RAISE) {
      if (!amount) continue;

      if (preFlopCallCounter === 0) {
        isRaiseBeforeCall = true;
      }

      if (isHero(id) && !isHeroPreFlopRaiser) {
        counters.preFlopRaises++;
      }

      if (isHero(id)) {
        isHeroPutIntoPot = true;
        isHeroPreFlopRaiser = true;
      }

      if (isHero(id) && preFlopRaiseCounter === 0 && preFlopCallCounter >= 1) {
        counters.preFlopSqueeze++;
      }

      if (isHero(id) && isHeroPreFlopRaiser && preFlopRaiseCounter === 1) {
        counters.preFlopThreeBets++;
      }

      pokerHand.potInChips += amount;
      player.moneyInPotInChips += amount;
      player.currentStackInChips -= amount;

      preFlopRaiseCounter++;

      continue;
    }

    if (action === PlayerAction.CALL) {
      if (!amount) continue;

      if (isHero(id)) {
        isHeroPutIntoPot = true;
      }

      pokerHand.potInChips += amount;
      player.moneyInPotInChips += amount;
      player.currentStackInChips -= amount;


      preFlopCallCounter++;
    }

    if (action === PlayerAction.FOLD) {
      if (isHero(id) && isHeroPreFlopRaiser && preFlopRaiseCounter === 1) {
        counters.foldPreFlopThreeBets++;
      }
    }

    if (action === PlayerAction.UNCALLED) {
      if (!amount) continue;

      player.currentStackInChips += amount;
    }

    if (action === PlayerAction.SHOW) {
      player.hand = cards;

      if (isHero(id)) {
        isHeroWentToShowdown = true;

        counters.sawFlopTimes++;
        counters.sawTurnTimes++;
        counters.sawRiverTimes++;
        counters.sawShowDownTimes++;
      }
    }

    if ((preFlopRaiseCounter === 0 && preFlopCallCounter >= 1) || (preFlopRaiseCounter === 1 && preFlopCallCounter >= 1 && isRaiseBeforeCall)) {
      isPreFlopSqueezeSituation = true;
    }
  }

  // Was PreFlop Squeeze situation
  if (isPreFlopSqueezeSituation) {
    counters.numberOfSqueezeSituations++;
  }

  // Is Hero Put Chips Into Pot
  if (isHeroPutIntoPot) {
    counters.putIntoPot++;
  }

  /*** Flop Actions Handler ***/
  const flopActions = [
    pokerHand.actions.flopActions1,
    pokerHand.actions.flopActions2,
    pokerHand.actions.flopActions3,
  ];

  // Is Hero Saw Flop
  const heroOnFlop = pokerHand.actions.flopActions1.find((el) => isHero(el.id));
  if (heroOnFlop) {
    counters.sawFlopTimes++;
  }

  for (const flopAction of flopActions) {
    for (const playerAction of flopAction) {
      const { id, action, amount, cards } = playerAction;

      const player = pokerHand.players[ID_INDEX_MAP[id]];

      if (action === PlayerAction.BET || action === PlayerAction.CALL || action === PlayerAction.RAISE) {
        if (!amount) continue;

        pokerHand.potInChips += amount;
        player.moneyInPotInChips += amount;
        player.currentStackInChips -= amount;
      }

      if (action === PlayerAction.UNCALLED) {
        if (!amount) continue;

        player.currentStackInChips += amount;
      }

      if (action === PlayerAction.SHOW) {
        player.hand = cards;

        if (isHero(id)) {
          isHeroWentToShowdown = true;

          counters.sawTurnTimes++;
          counters.sawRiverTimes++;
          counters.sawShowDownTimes++;
        }
      }
    }
  }

  /*** Turn Actions Handler ***/
  const turnActions = [
    pokerHand.actions.turnActions1,
    pokerHand.actions.turnActions2,
    pokerHand.actions.turnActions3,
  ];

  // Is Hero Saw Turn
  const heroOnTurn = pokerHand.actions.turnActions1.find((el) => isHero(el.id));
  if (heroOnTurn) {
    counters.sawTurnTimes++;
  }

  for (const turnAction of turnActions) {
    for (const playerAction of turnAction) {
      const { id, action, amount, cards } = playerAction;

      const player = pokerHand.players[ID_INDEX_MAP[id]];

      if (action === PlayerAction.BET || action === PlayerAction.CALL || action === PlayerAction.RAISE) {
        if (!amount) continue;

        pokerHand.potInChips += amount;
        player.moneyInPotInChips += amount;
        player.currentStackInChips -= amount;
      }

      if (action === PlayerAction.UNCALLED) {
        if (!amount) continue;

        player.currentStackInChips += amount;
      }

      if (action === PlayerAction.SHOW) {
        player.hand = cards;

        if (isHero(id)) {
          isHeroWentToShowdown = true;

          counters.sawRiverTimes++;
          counters.sawShowDownTimes++;
        }
      }
    }
  }

  /*** River Actions Handler ***/
  const riverActions = [
    pokerHand.actions.riverActions1,
    pokerHand.actions.riverActions2,
    pokerHand.actions.riverActions3,
  ];

  // Is Hero Saw River
  const heroOnRiver = pokerHand.actions.riverActions1.find((el) => isHero(el.id));
  if (heroOnRiver) {
    counters.sawRiverTimes++;
  }

  for (const riverAction of riverActions) {
    for (const playerAction of riverAction) {
      const { id, action, amount, cards } = playerAction;

      const player = pokerHand.players[ID_INDEX_MAP[id]];

      if (action === PlayerAction.BET || action === PlayerAction.CALL || action === PlayerAction.RAISE) {
        if (!amount) continue;

        pokerHand.potInChips += amount;
        player.moneyInPotInChips += amount;
        player.currentStackInChips -= amount;
      }

      if (action === PlayerAction.UNCALLED) {
        if (!amount) continue;

        player.currentStackInChips += amount;
      }

      if (action === PlayerAction.SHOW) {
        player.hand = cards;

        if (isHero(id)) {
          isHeroWentToShowdown = true;

          counters.sawShowDownTimes++;
        }
      }
    }
  }

  /*** Showdown Actions Handler ***/
  const showdownActions = [
    pokerHand.actions.showdownActions1,
    pokerHand.actions.showdownActions2,
    pokerHand.actions.showdownActions3,
  ];

  let wonShowDownTimes = 0;
  for (const showdownAction of showdownActions) {
    for (const playerAction of showdownAction) {
      const { id, action, amount } = playerAction;

      const player = pokerHand.players[ID_INDEX_MAP[id]];

      if (action === PlayerAction.COLLECTED) {
        if (!amount) continue;

        player.currentStackInChips += amount;

        if (isHero(id) && isHeroWentToShowdown) {
          wonShowDownTimes++;
        }
      }
    }
  }

  // If won showdown 2 of 3 times at least
  if (wonShowDownTimes / pokerHand.boardsAmount > 0.5) {
    counters.wonShowDownTimes++;
  }

  counters.numberOfHands++;
}

export async function setStatsAndCounters() {
  const counterStore = useCountersStore();

  const storeCounters = await counterStore.getCounters();

  if (!storeCounters) return;

  const updatedCounters: Counters = {
    numberOfHands: storeCounters.numberOfHands ? storeCounters.numberOfHands + counters.numberOfHands : counters.numberOfHands,
    sawFlopTimes: storeCounters.sawFlopTimes ? storeCounters.sawFlopTimes + counters.sawFlopTimes : counters.sawFlopTimes,
    sawTurnTimes: storeCounters.sawTurnTimes ? storeCounters.sawTurnTimes + counters.sawTurnTimes : counters.sawTurnTimes,
    sawRiverTimes: storeCounters.sawRiverTimes ? storeCounters.sawRiverTimes + counters.sawRiverTimes : counters.sawRiverTimes,
    wonShowDownTimes: storeCounters.wonShowDownTimes ? storeCounters.wonShowDownTimes + counters.wonShowDownTimes : counters.wonShowDownTimes,
    sawShowDownTimes: storeCounters.sawShowDownTimes ? storeCounters.sawShowDownTimes + counters.sawShowDownTimes : counters.sawShowDownTimes,
    preFlopRaises: storeCounters.preFlopRaises ? storeCounters.preFlopRaises + counters.preFlopRaises : counters.preFlopRaises,
    preFlopThreeBets: storeCounters.preFlopThreeBets ? storeCounters.preFlopThreeBets + counters.preFlopThreeBets : counters.preFlopThreeBets,
    foldPreFlopThreeBets: storeCounters.foldPreFlopThreeBets ? storeCounters.foldPreFlopThreeBets + counters.foldPreFlopThreeBets : counters.foldPreFlopThreeBets,
    preFlopSqueeze: storeCounters.preFlopSqueeze ? storeCounters.preFlopSqueeze + counters.preFlopSqueeze : counters.preFlopSqueeze,
    putIntoPot: storeCounters.putIntoPot ? storeCounters.putIntoPot + counters.putIntoPot : counters.putIntoPot,
    numberOfSqueezeSituations: storeCounters.numberOfSqueezeSituations ? storeCounters.numberOfSqueezeSituations + counters.numberOfSqueezeSituations : counters.numberOfSqueezeSituations,
  };

  await counterStore.updateCounters(updatedCounters);

  const statsStore = useStatsStore();

  const storeStats = await statsStore.getStats();

  if (!storeStats) return;

  const updatedStats: Stats = {
    numberOfHands: updatedCounters.numberOfHands,
    vpip: updatedCounters.numberOfHands ? updatedCounters.putIntoPot / updatedCounters.numberOfHands * 100 : 0,
    pfr: updatedCounters.numberOfHands ? updatedCounters.preFlopRaises / updatedCounters.numberOfHands * 100 : 0,
    threeBet: updatedCounters.numberOfHands ? updatedCounters.preFlopThreeBets / updatedCounters.numberOfHands * 100 : 0,
    wtsd: updatedCounters.sawFlopTimes ? updatedCounters.sawShowDownTimes / updatedCounters.sawFlopTimes * 100 : 0,
    wmsd: updatedCounters.sawShowDownTimes ? updatedCounters.wonShowDownTimes / updatedCounters.sawShowDownTimes * 100 : 0,
    wwsf: updatedCounters.sawFlopTimes ? updatedCounters.wonShowDownTimes / updatedCounters.sawFlopTimes * 100 : 0,
    foldThreeBetAfterRaising: updatedCounters.preFlopRaises ? updatedCounters.foldPreFlopThreeBets / updatedCounters.preFlopRaises * 100 : 0,
    preFlopSqueeze: updatedCounters.numberOfSqueezeSituations ? updatedCounters.preFlopSqueeze / updatedCounters.numberOfSqueezeSituations * 100 : 0,
  };

  await statsStore.updateStats(updatedStats);

  console.log('Данные сохранены в базу');
}
