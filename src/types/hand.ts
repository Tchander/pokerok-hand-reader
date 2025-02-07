
import type { TableType } from '@/enums/pokerType';
import type { Action } from './actions';
import type { Player } from './player';

export type BoardCards = [string | null, string | null, string | null, string | null, string | null];

export type StartHand = [string, string];

export type PreFlopCounters = {
  callCounter: number;
  raiseCounter: number; // 2 - 3bet, 4 - 4bet
};

export type PokerHand = {
  sizeOfBB: number;
  sizeOfSB: number;
  tableType: TableType | null;
  buttonSeat: number | null;
  players: Player[];
  maxNumberOfPlayers: number;
  currentNumberOfPlayers: number;
  potInChips: number;
  potInBB: number;
  preFlopActions: Action[];
  flopActions: Action[];
  turnActions: Action[];
  riverActions: Action[];
  boardCards: BoardCards;
};
