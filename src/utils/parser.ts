import { getArrayFromString } from '.';
import { KEY_WORDS } from '@/enums/parser';
import { TableType } from '@/enums/pokerType';
import { SixMaxPositions } from '@/enums/positions';
import type { Blinds, Player, PokerHand } from '@/types';

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

export function getPlayersInfo(str: string, buttonSeat: number | null, sizeOfBb: number): Player {
  const arr = getArrayFromString(str, ' ');

  const seatNumber = parseInt(arr[1], 10);
  const id = arr[2];
  const stackInChips = +arr[3].slice(2);
  const stackInBB = stackInChips / sizeOfBb;

  return {
    id,
    isHero: id === KEY_WORDS.HERO,
    seatNumber,
    position: seatNumber === buttonSeat ? SixMaxPositions.BU : undefined,
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
