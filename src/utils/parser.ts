import { PlayerAction } from '@/enums/actions';
import { dcr, getArrayFromString, startsWith } from '.';
import { KEY_WORDS } from '@/enums/parser';
import { TableType } from '@/enums/pokerType';
import type { Action, Blinds, BoardsAmount, Player, PlayerId, StageInfo, StartHand } from '@/types';

export const MAX_NUMBER_OF_PLAYERS_MAP: Record<TableType, number> = {
  [TableType.SIX_MAX]: 6,
};

export const BOARDS_AMOUNT_MAP: Record<string, BoardsAmount> = {
  'two times': 2,
  'three times': 3,
};

export function isHero(id: PlayerId) {
  return id === KEY_WORDS.HERO as string;
}

export function getBlinds(arr: string[]): Blinds {
  const blindsInfoString = arr[arr.length - 4];
  const temp = getArrayFromString(blindsInfoString, '/');

  if (temp.length !== 2) throw Error('Передана некорректная строка для подсчёта блайндов');

  const sb = +temp[0].slice(2);
  const bb = +temp[1].slice(1, -1);

  return { sb, bb };
}

export function getTableTypeAndButtonSeat(str: string): { tableType: TableType, buttonSeat: number } {
  const arr = getArrayFromString(str, ' ');
  const tableType = arr[2] as TableType;
  const buttonSeat = +arr[arr.indexOf(KEY_WORDS.SEAT) + 1].slice(1);

  return { tableType, buttonSeat };
}

export function getPlayersInfo(str: string): Player {
  const arr = getArrayFromString(str, ' ');

  const seatNumber = parseInt(arr[1], 10);
  const id = arr[2];
  const stackInChips = +arr[3].slice(2);

  return {
    id,
    isHero: isHero(id),
    seatNumber,
    startStackInChips: stackInChips,
    currentStackInChips: stackInChips,
    moneyInPotInChips: 0,
  }
}

export function getPlayerId(str: string): PlayerId {
  const arr = getArrayFromString(str, ' ');

  return arr[0].slice(0, -1);
}

export function getHandInfo(hand: string[], currentStage: string): StageInfo {
  const info: string[] = [];
  let endIndex: number = -1;

  for (let i = 0; i < hand.length; i++) {
    const str = hand[i];

    if (i === 0 && !startsWith(str, currentStage)) break;

    if (i === 0 && startsWith(str, currentStage)) {
      info.push(str);
      continue;
    }

    if (startsWith(str, KEY_WORDS.NEXT_STAGE)) {
      endIndex = i;
      break;
    } else {
      info.push(str);
    }
  }

  return { info, endIndex };
}

export function getHand(firstCard: string, secondCard: string): StartHand {
  return [dcr(firstCard).slice(1), dcr(secondCard).slice(0, 2)];
}

export function getHeroHand(str: string): StartHand | undefined {
  const arr = getArrayFromString(str, ' ');

  if (arr[2] !== KEY_WORDS.HERO) return;

  return getHand(arr[3], arr[4]);
}

export function getActionInfo(str: string): Action {
  const arr = getArrayFromString(str, ' ');

  if (startsWith(str, KEY_WORDS.UNCALLED_BET)) {
    const id = arr[arr.length - 1];
    const action = arr[0] as PlayerAction;
    const amount = +arr[2].slice(2, -1);
    return { id, action, amount };
  }

  const action = arr[1] as PlayerAction;

  if (action === PlayerAction.COLLECTED) {
    const id = arr[0];
    const amount = +arr[2].slice(1);
    return { id, action, amount };
  }

  const id = arr[0].slice(0, -1);

  if (action === PlayerAction.RAISE) {
    const amount = +arr[4].slice(1);
    return { id, action, amount };
  }

  if (action === PlayerAction.BET || action === PlayerAction.CALL || action === PlayerAction.UNCALLED) {
    const amount = +arr[2].slice(1);
    return { id, action, amount };
  }

  if (action === PlayerAction.SHOW) {
    const cards = getHand(arr[2], arr[3]);
    return { id, action, cards };
  }

  return { id, action };
}

export function getFlopCards(str: string, isMoreThanOneBoard: boolean): { firstCard: string, secondCard: string, thirdCard: string } {
  const arr = getArrayFromString(str, ' ');

  if (isMoreThanOneBoard) {
    const firstCard = arr[4].slice(1);
    const secondCard = arr[5];
    const thirdCard = arr[6].slice(0, -1);

    return { firstCard, secondCard, thirdCard };
  } else {
    const firstCard = arr[3].slice(1);
    const secondCard = arr[4];
    const thirdCard = arr[5].slice(0, -1);

    return { firstCard, secondCard, thirdCard };
  }
}

export function getTurnOrRiverCard(str: string): string {
  const arr = getArrayFromString(str, ' ');

  return arr[arr.length - 1].slice(1, -1);
}

// export function convertChipsIntoBb(amount: number, sizeOfBb: number) {
//   return amount / sizeOfBb;
// }

export function getStraddleAmount(str: string) {
  const arr = getArrayFromString(str, ' ');

  return +arr[arr.length - 1].slice(1);
}

export function getBoardsAmount(str: string): BoardsAmount {
  const arr = getArrayFromString(str, ' ');

  const amount = `${arr[3]} ${arr[4]}`;

  return BOARDS_AMOUNT_MAP[amount];
}
