import { setBlinds, setButtonSeat, setMaxNumberOfPlayers, setTableType } from './setParams';
import { KEY_WORDS } from '@/enums/parser';
import { getArrayFromString, startsWith } from '@/utils';
import { PlayerAction } from '@/enums/actions';
import {
  getActionInfo,
  getBlinds,
  getFlopCards,
  getHandInfo,
  getHeroHand,
  getPlayersInfo,
  getTableTypeAndButtonSeat,
  getTurnOrRiverCard,
  getPlayerId,
  getStraddleAmount,
  isHero,
} from '@/utils/parser';
import type { PlayerId, PokerHand, PositionsInfo } from '@/types';
import type { Counters } from '@/stores/counters';
import type { Stats } from '@/stores/stats';

const defaultPokerHand: PokerHand = {
  sizeOfSB: 0,
  sizeOfBB: 0,
  tableType: null,
  buttonSeat: null,
  players: [],
  maxNumberOfPlayers: 0,
  currentNumberOfPlayers: 0,
  potInChips: 0,
  preFlopActions: [],
  flopActions: [],
  turnActions: [],
  riverActions: [],
  showdownActions: [],
  boardCards: [null, null, null, null, null],
};

const additionalCounters = {
  preFlopRaises: 0,
  preFlopThreeBets: 0,
  foldPreFlopThreeBets: 0,
  preFlopSqueeze: 0,
  handsPlayed: 0,
};

const counters: Counters = {
  numberOfHands: 0,
  sawFlopTimes: 0,
  sawTurnTimes: 0,
  sawRiverTimes: 0,
  sawShowDownTimes: 0,
  wonShowDownTimes: 0,
};

const stats: Stats = {
  vpip: 0,
  pfr: 0,
  threeBet: 0,
  wtsd: 0,
  wmsd: 0,
  wwsf: 0,
  foldThreeBet: 0,
  preFlopSqueeze: 0,
};

export function resetPokerHand() {
  return structuredClone(defaultPokerHand);
}

export async function handHandler(hand: string[]) {
  const pokerHand = resetPokerHand();
  let initInfo: string[] = [];
  let preFlopInfo: string[] = [];
  let flopInfo: string[] = [];
  let turnInfo: string[] = [];
  let riverInfo: string[] = [];
  let showdownInfo: string[] = [];
  // let summaryInfo: string[] = []; пока что не нужна

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

  /* Create Flop Array */
  const flopData = getHandInfo(hand, KEY_WORDS.FLOP);
  if (flopData.endIndex !== -1) {
    flopInfo = flopData.info;
    hand = hand.slice(flopData.endIndex);
  }

  /* Create Turn Array */
  const turnData = getHandInfo(hand, KEY_WORDS.TURN);
  if (turnData.endIndex !== -1) {
    turnInfo = turnData.info;
    hand = hand.slice(turnData.endIndex);
  }

  /* Create River Array */
  const riverData = getHandInfo(hand, KEY_WORDS.RIVER);
  if (riverData.endIndex !== -1) {
    riverInfo = riverData.info;
    hand = hand.slice(riverData.endIndex);
  }

  /* Create Showdown Array */
  const showdownData = getHandInfo(hand, KEY_WORDS.SHOWDOWN);
  if (showdownData.endIndex !== -1) {
    showdownInfo = showdownData.info;
    hand = hand.slice(showdownData.endIndex);
  }

  /* Create Summary Array */
  // summaryInfo = hand; // пока что не нужна


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

  /*** Set Players Postitions ***/
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
      pokerHand.preFlopActions.push(getActionInfo(str));
    }
  }

  /*** Set Flop Data ***/
  for (const str of flopInfo) {
    if (startsWith(str, KEY_WORDS.FLOP)) {
      const { firstCard, secondCard, thirdCard } = getFlopCards(str);
      pokerHand.boardCards[0] = firstCard;
      pokerHand.boardCards[1] = secondCard;
      pokerHand.boardCards[2] = thirdCard;
    } else {
      pokerHand.flopActions.push(getActionInfo(str));
    }
  }

  /*** Set Turn Data ***/
  for (const str of turnInfo) {
    if (startsWith(str, KEY_WORDS.TURN)) {
      pokerHand.boardCards[3] = getTurnOrRiverCard(str);
    } else {
      pokerHand.turnActions.push(getActionInfo(str));
    }
  }

  /*** Set River Data ***/
  for (const str of riverInfo) {
    if (startsWith(str, KEY_WORDS.RIVER)) {
      pokerHand.boardCards[4] = getTurnOrRiverCard(str);
    } else {
      pokerHand.riverActions.push(getActionInfo(str));
    }
  }

  /*** Set Showdown Data ***/
  for (let i = 0; i < showdownInfo.length; i++) {
    if (i === 0) continue;

    pokerHand.showdownActions.push(getActionInfo(showdownInfo[i]));
  }

  let isHeroFoldedOnPreFlop: boolean = false;
  let isPreFlopRaise: boolean = false;
  let preFlopCallCounter: number = 0;
  let preFlopRaiseCounter: number = 0;

  for (const playerAction of pokerHand.preFlopActions) {
    const { id, action, amount, cards } = playerAction;

    const player = pokerHand.players[ID_INDEX_MAP[id]];

    if (action === PlayerAction.RAISE) {
      if (!amount) continue;

      if (isHero(id) && preFlopRaiseCounter === 0 && preFlopCallCounter >= 1) {
        additionalCounters.preFlopSqueeze++;
      }

      if (isHero(id) && preFlopRaiseCounter === 0) {
        additionalCounters.preFlopRaises++;
        isPreFlopRaise = true;
      } else if (isHero(id) && preFlopRaiseCounter === 1) {
        additionalCounters.preFlopThreeBets++;
      }

      pokerHand.potInChips += amount;
      player.moneyInPotInChips += amount;
      player.currentStackInChips -= amount;

      preFlopRaiseCounter++;

      continue;
    }

    if (action === PlayerAction.CALL) {
      if (!amount) continue;

      pokerHand.potInChips += amount;
      player.moneyInPotInChips += amount;
      player.currentStackInChips -= amount;


      preFlopCallCounter++;
    }

    if (action === PlayerAction.FOLD) {
      if (isHero(id)) {
        isHeroFoldedOnPreFlop = true;
      }

      if (isHero(id) && isPreFlopRaise && preFlopRaiseCounter === 1) {
        additionalCounters.foldPreFlopThreeBets++;
      }
    }

    if (action === PlayerAction.UNCALLED) {
      if (!amount) continue;

      player.currentStackInChips += amount;
      console.log(player.currentStackInChips);
    }
  }

  /*** Is Hero Not Folded ***/
  if (!isHeroFoldedOnPreFlop) {
    additionalCounters.handsPlayed++;
  }

  /*** Is Hero Saw Flop ***/
  const hero = pokerHand.flopActions.find((el) => isHero(el.id));
  if (hero) {
    counters.sawFlopTimes++;
  }

  console.log(preFlopCallCounter, preFlopRaiseCounter);


  counters.numberOfHands++;
  console.log(additionalCounters);
  console.log(counters);
  console.log(pokerHand);
}
