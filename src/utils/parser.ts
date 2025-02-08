import { getArrayFromString, startsWith } from '.';
import { KEY_WORDS } from '@/enums/parser';
import { TableType } from '@/enums/pokerType';
import type { Blinds, Player, PokerHand, StageInfo } from '@/types';

export const MAX_NUMBER_OF_PLAYERS_MAP: Record<TableType, number> = {
  [TableType.SIX_MAX]: 6,
};

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

export function getPlayersInfo(str: string, sizeOfBb: number): Player {
  const arr = getArrayFromString(str, ' ');

  const seatNumber = parseInt(arr[1], 10);
  const id = arr[2];
  const stackInChips = +arr[3].slice(2);
  const stackInBB = stackInChips / sizeOfBb;

  return {
    id,
    isHero: id === KEY_WORDS.HERO,
    seatNumber,
    startStackInChips: stackInChips,
    startStackInBB: stackInBB,
    currentStackInChips: stackInChips,
    currentStackInBB: stackInBB,
    moneyInPotInChips: 0,
    moneyInPotInBB: 0,
    isPreFlopRaise: false,
  }
}

export function setInitPot(str: string, hand: PokerHand): Player | undefined {
  const arr = getArrayFromString(str, ' ');

  const id = arr[0].slice(0, -1);

  return hand.players.find((player) => player.id === id);
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
