import { MAX_NUMBER_OF_PLAYERS_MAP } from '@/utils/parser';
import type { Blinds, PokerHand } from '@/types';
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
