
import type { TableType } from '@/enums/pokerType';
import type { Action } from './actions';
import type { Player } from './player';

export type BoardCards = [string | null, string | null, string | null, string | null, string | null];

export type BoardsAmount = 1 | 2 | 3;

export type StartHand = [string, string];

export type PreFlopCounters = {
  callCounter: number;
  raiseCounter: number; // 2 - 3bet, 4 - 4bet
};

export type PokerHandActions = {
  preFlopActions: Action[];
  flopActions1: Action[];
  flopActions2: Action[];
  flopActions3: Action[];
  turnActions1: Action[];
  turnActions2: Action[];
  turnActions3: Action[];
  riverActions1: Action[];
  riverActions2: Action[];
  riverActions3: Action[];
  showdownActions1: Action[];
  showdownActions2: Action[];
  showdownActions3: Action[];
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
  actions: PokerHandActions;
  boards: [BoardCards, BoardCards, BoardCards];
  boardsAmount: BoardsAmount;
};
