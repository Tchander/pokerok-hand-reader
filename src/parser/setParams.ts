import {
  getActionInfo,
  getFlopCards,
  getTurnOrRiverCard,
  MAX_NUMBER_OF_PLAYERS_MAP,
} from '@/utils/parser';
import { dcr } from '@/utils';
import type { Blinds, PokerHand, PokerHandActions } from '@/types';
import type { TableType } from '@/enums/pokerType';

export function setBlinds(hand: PokerHand, blinds: Blinds) {
  hand.sizeOfSB = blinds.sb;
  hand.sizeOfBB = blinds.bb;
}

export function setTableType(hand: PokerHand, tableType: TableType) {
  hand.tableType = tableType;
}

export function setButtonSeat(hand: PokerHand, buttonSeat: number) {
  hand.buttonSeat = buttonSeat;
}

export function setMaxNumberOfPlayers(hand: PokerHand, tableType: TableType) {
  hand.maxNumberOfPlayers = MAX_NUMBER_OF_PLAYERS_MAP[tableType];
}

export function setFlopData(hand: PokerHand, flopInfo: string[], board: number) {
  for (let i = 0; i < flopInfo.length; i++) {
    const str = dcr(flopInfo[i]);

    if (i === 0) {
      const { firstCard, secondCard, thirdCard } = getFlopCards(str, hand.boardsAmount > 1);

      // TODO: докрутить установку карт в борды
      if (board === 1) {
        hand.boards[0][0] = firstCard;
        hand.boards[0][1] = secondCard;
        hand.boards[0][2] = thirdCard;
      }

      if (hand.boardsAmount >= 2 && board === 2) {
        hand.boards[1][0] = firstCard;
        hand.boards[1][1] = secondCard;
        hand.boards[1][2] = thirdCard;
      }

      if (hand.boardsAmount === 3 && board === 3) {
        hand.boards[2][0] = firstCard;
        hand.boards[2][1] = secondCard;
        hand.boards[2][2] = thirdCard;
      }
    } else {
      const action = `flopActions${board}` as keyof PokerHandActions;
      hand.actions[action].push(getActionInfo(str));
    }
  }
}

export function setTurnData(hand: PokerHand, turnInfo: string[], board: number) {
  for (let i = 0; i < turnInfo.length; i++) {
    const str = dcr(turnInfo[i]);

    if (i === 0) {
      const turnCard = getTurnOrRiverCard(str);

      if (board === 1) {
        hand.boards[0][3] = turnCard;
      }

      if (hand.boardsAmount >= 2 && board === 2) {
        hand.boards[1][3] = turnCard;
      }

      if (hand.boardsAmount === 3 && board === 3) {
        hand.boards[2][3] = turnCard;
      }
    } else {
      const action = `turnActions${board}` as keyof PokerHandActions;
      hand.actions[action].push(getActionInfo(str));
    }
  }
}

export function setRiverData(hand: PokerHand, riverInfo: string[], board: number) {
  for (let i = 0; i < riverInfo.length; i++) {
    const str = dcr(riverInfo[i]);

    if (i === 0) {
      const riverCard = getTurnOrRiverCard(str);

      if (board === 1) {
        hand.boards[0][4] = riverCard;
      }

      if (hand.boardsAmount >= 2 && board === 2) {
        hand.boards[1][4] = riverCard;
      }

      if (hand.boardsAmount === 3 && board === 3) {
        hand.boards[2][4] = riverCard;
      }
    } else {
      const action = `riverActions${board}` as keyof PokerHandActions;
      hand.actions[action].push(getActionInfo(str));
    }
  }
}

export function setShowdownData(hand: PokerHand, showdownInfo: string[], board: number) {
  for (let i = 0; i < showdownInfo.length; i++) {
    if (i === 0) continue;

    const action = `showdownActions${board}` as keyof PokerHandActions;
    hand.actions[action].push(getActionInfo(showdownInfo[i]));
  }
}
